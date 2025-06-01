import os
import re
import json
import base64
import redis
from pathlib import Path

from flask import Flask, request, jsonify
from dotenv import load_dotenv

import requests
import google.generativeai as genai

# ─────────────────────────────────────────
# Load only GEMINI_API_KEY from .env
# ─────────────────────────────────────────
load_dotenv()  # expects .env next to this script

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY must be set in .env")

# ─────────────────────────────────────────
# Redis client (default localhost:6379)
# ─────────────────────────────────────────
redis_client = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

# TTL for cache entries: 24 hours (in seconds)
CACHE_TTL = 24 * 3600

# ─────────────────────────────────────────
# LLM (Gemini) Setup
# ─────────────────────────────────────────
genai.configure(api_key=GEMINI_API_KEY)
LLM_MODEL = genai.GenerativeModel("gemini-2.0-flash-lite")

# ─────────────────────────────────────────
# Supported file extensions → language
# ─────────────────────────────────────────
SUPPORTED_EXTENSIONS = {
    ".py": "python",
    ".js": "javascript",
    ".java": "java",
    ".ts": "typescript",
    ".cpp": "cpp",
    ".c": "c",
    ".cs": "csharp",
    ".rb": "ruby",
    ".go": "go",
    ".php": "php",
}

def clean_code_block(s: str) -> str:
    """Strip triple‐backtick fences from LLM output."""
    if not isinstance(s, str):
        return ""
    s = re.sub(r"^```[\w]*\n", "", s.strip(), flags=re.MULTILINE)
    s = re.sub(r"```$", "", s.strip(), flags=re.MULTILINE)
    return s.strip()

def call_gemini(prompt: str, expect_json: bool = False):
    """
    Send `prompt` to Gemini. If expect_json=True, extract the first JSON array.
    """
    try:
        resp = LLM_MODEL.generate_content(prompt)
        text = resp.text.strip()
        if expect_json:
            match = re.search(r"(\[.*?\])", text, re.DOTALL)
            if match:
                return json.loads(match.group(1))
            try:
                return json.loads(text)
            except:
                return []
        return text
    except Exception as e:
        print(f"LLM error: {e}")
        return [] if expect_json else ""

# ─────────────────────────────────────────
# GitHub API helper functions
# ─────────────────────────────────────────
def github_headers(token: str):
    return {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"Bearer {token}",
    }

def get_default_branch(owner: str, repo: str, headers: dict) -> str:
    """
    GET /repos/{owner}/{repo}
    Returns default_branch.
    """
    url = f"https://api.github.com/repos/{owner}/{repo}"
    resp = requests.get(url, headers=headers)
    resp.raise_for_status()
    return resp.json()["default_branch"]

def get_commit_sha_for_branch(owner: str, repo: str, branch: str, headers: dict) -> str:
    """
    GET /repos/{owner}/{repo}/git/refs/heads/{branch}
    → returns commit SHA directly.
    """
    url_ref = f"https://api.github.com/repos/{owner}/{repo}/git/refs/heads/{branch}"
    resp = requests.get(url_ref, headers=headers)
    resp.raise_for_status()
    return resp.json()["object"]["sha"]

def get_tree_sha_for_branch(owner: str, repo: str, branch: str, headers: dict) -> str:
    """
    GET /repos/{owner}/{repo}/git/commits/{commit_sha}
    → returns tree SHA for that commit.
    """
    commit_sha = get_commit_sha_for_branch(owner, repo, branch, headers)
    url_commit = f"https://api.github.com/repos/{owner}/{repo}/git/commits/{commit_sha}"
    resp = requests.get(url_commit, headers=headers)
    resp.raise_for_status()
    return resp.json()["tree"]["sha"]

def get_github_tree(owner: str, repo: str, tree_sha: str, headers: dict):
    """
    GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1
    Returns a list of {"path":..., "type":...}.
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1"
    resp = requests.get(url, headers=headers)
    resp.raise_for_status()
    return resp.json().get("tree", [])

def fetch_file_content(owner: str, repo: str, path: str, branch: str, headers: dict) -> str:
    """
    GET /repos/{owner}/{repo}/contents/{path}?ref={branch}
    Returns decoded UTF-8 file content (if base64-encoded).
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    resp = requests.get(url, headers=headers, params={"ref": branch})
    resp.raise_for_status()
    data = resp.json()
    if data.get("encoding") == "base64" and "content" in data:
        return base64.b64decode(data["content"]).decode("utf-8", errors="ignore")
    return ""

# ─────────────────────────────────────────
# AI Prompt Templates
# ─────────────────────────────────────────
def prompt_test_cases(code: str, language: str) -> str:
    return f"""
Given the following {language} code, generate comprehensive unit/integration test code using the standard test framework for that language.
Return ONLY the test code as plain text, WITHOUT explanations, comments, or markdown fences.
Format output to be copy-paste ready with correct indentation and line breaks.

Code:
{code}
"""

def prompt_generate_mocks(code: str, language: str) -> str:
    return f"""
Given the following {language} code (functions/classes/modules), generate:
- Realistic test input data for each function/class (both valid and invalid edge cases)
- Example mocks for any APIs, DB calls, or external services used (use unittest.mock, pytest, or language-native mocking tools)
Output ONLY the code, one test function per example (named test_*), ready to copy-paste. No explanations.

Code:
{code}
"""

def prompt_bug_finder(code: str, language: str) -> str:
    return f"""
You are a senior security engineer.
Review the following {language} code for:
- Logic bugs
- Security vulnerabilities (injection, XSS, CSRF, unsafe deserialization, etc.)
- Bad practices or anti-patterns

For each issue, output:
- Line number(s)
- Short description
- Severity (High/Medium/Low)
- A concise suggested fix

Output ONLY as a JSON array:
[
  {{"line": 12, "issue": "Possible SQL Injection", "severity": "High", "fix": "Use parameterized queries"}},
  ...
]

Code:
{code}
"""

# ─────────────────────────────────────────
# Core Generation + Caching Logic
# ─────────────────────────────────────────
def list_all_files(owner: str, repo: str, token: str, single_file: str = None):
    """
    1) Find default branch
    2) Find commit SHA for that branch
    3) Find tree SHA for that branch
    4) GET tree recursively
    5) Filter blobs by SUPPORTED_EXTENSIONS

    Returns list of (rel_path, language).
    """
    headers = github_headers(token)
    branch = get_default_branch(owner, repo, headers)
    tree_sha = get_tree_sha_for_branch(owner, repo, branch, headers)
    tree = get_github_tree(owner, repo, tree_sha, headers)

    files = []
    for element in tree:
        if element["type"] != "blob":
            continue
        path = element["path"]
        ext = Path(path).suffix
        if ext in SUPPORTED_EXTENSIONS:
            files.append((path, SUPPORTED_EXTENSIONS[ext]))
    if single_file:
        for (p, lang) in files:
            if p == single_file:
                return [(p, lang)]
        return []
    return files

def get_cache_key(owner: str, repo: str, commit_sha: str, feature: str, single_file: str = None) -> str:
    """
    Construct a Redis key of the form:
      "<owner>:<repo>:<commit_sha>:<feature>" 
    or if single_file is provided:
      "<owner>:<repo>:<commit_sha>:<feature>:<single_file>"
    """
    base_key = f"{owner}:{repo}:{commit_sha}:{feature}"
    if single_file:
        # Replace any colons in the filename to avoid conflicts
        sanitized = single_file.replace(":", "_")
        return f"{base_key}:{sanitized}"
    return base_key

def generate_tests(owner: str, repo: str, token: str, single_file: str = None):
    """
    Fetch each file’s content, call Gemini for test generation, and return a dict:
    { rel_path: {"language": ..., "test_cases": "..."} }
    """
    headers = github_headers(token)
    branch = get_default_branch(owner, repo, headers)
    files = list_all_files(owner, repo, token, single_file)

    results = {}
    for rel_path, language in files:
        code = fetch_file_content(owner, repo, rel_path, branch, headers)
        prompt = prompt_test_cases(code, language)
        raw = call_gemini(prompt)
        tests = clean_code_block(raw)
        results[rel_path] = {"language": language, "test_cases": tests}
    return results

def generate_mocks(owner: str, repo: str, token: str, single_file: str = None):
    """
    Fetch each file’s content, call Gemini for mock generation, and return a dict:
    { rel_path: {"language": ..., "mock_data": "..."} }
    """
    headers = github_headers(token)
    branch = get_default_branch(owner, repo, headers)
    files = list_all_files(owner, repo, token, single_file)

    results = {}
    for rel_path, language in files:
        code = fetch_file_content(owner, repo, rel_path, branch, headers)
        prompt = prompt_generate_mocks(code, language)
        raw = call_gemini(prompt)
        mocks = clean_code_block(raw)
        results[rel_path] = {"language": language, "mock_data": mocks}
    return results

def detect_bugs(owner: str, repo: str, token: str, single_file: str = None):
    """
    Fetch each file’s content, call Gemini for bug detection, and return a dict:
    { rel_path: {"language": ..., "bug_report": [...] } }
    """
    headers = github_headers(token)
    branch = get_default_branch(owner, repo, headers)
    files = list_all_files(owner, repo, token, single_file)

    results = {}
    for rel_path, language in files:
        code = fetch_file_content(owner, repo, rel_path, branch, headers)
        prompt = prompt_bug_finder(code, language)
        bugs = call_gemini(prompt, expect_json=True)
        results[rel_path] = {"language": language, "bug_report": bugs}
    return results

# ─────────────────────────────────────────
# Flask App + Endpoints with Redis Caching
# ─────────────────────────────────────────
app = Flask(__name__)

def validate_request_json(data):
    """
    Ensure 'owner', 'repo', and 'token' exist in request JSON.
    """
    owner = data.get("owner")
    repo  = data.get("repo")
    token = data.get("token")
    if not owner or not repo or not token:
        raise ValueError("Request JSON must include 'owner', 'repo', and 'token'.")
    return owner, repo, token

@app.route("/generate_tests", methods=["POST"])
def endpoint_generate_tests():
    """
    Expects JSON body containing:
      { "owner": "...", "repo": "...", "token": "...", "file": "<optional>" }
    Uses Redis key "<owner>:<repo>:<commit_sha>:generate_tests[:<file>]".
    """
    try:
        body = request.get_json(force=True)
        owner, repo, token = validate_request_json(body)
        single_file = body.get("file")

        # Build GitHub headers and fetch commit SHA for caching
        headers = github_headers(token)
        default_branch = get_default_branch(owner, repo, headers)
        commit_sha = get_commit_sha_for_branch(owner, repo, default_branch, headers)

        # Build cache key
        cache_key = get_cache_key(owner, repo, commit_sha, "generate_tests", single_file)

        # Try Redis lookup
        cached = redis_client.get(cache_key)
        if cached is not None:
            # Refresh TTL
            redis_client.expire(cache_key, CACHE_TTL)
            return jsonify(json.loads(cached))

        # Not in cache → generate
        result = generate_tests(owner, repo, token, single_file)

        # Store in Redis (stringify as JSON)
        redis_client.setex(cache_key, CACHE_TTL, json.dumps(result))
        return jsonify(result)

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        print(f"[ERROR] generate_tests: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/generate_mocks", methods=["POST"])
def endpoint_generate_mocks():
    """
    Expects JSON body containing:
      { "owner": "...", "repo": "...", "token": "...", "file": "<optional>" }
    Uses Redis key "<owner>:<repo>:<commit_sha>:generate_mocks[:<file>]".
    """
    try:
        body = request.get_json(force=True)
        owner, repo, token = validate_request_json(body)
        single_file = body.get("file")

        headers = github_headers(token)
        default_branch = get_default_branch(owner, repo, headers)
        commit_sha = get_commit_sha_for_branch(owner, repo, default_branch, headers)

        cache_key = get_cache_key(owner, repo, commit_sha, "generate_mocks", single_file)
        cached = redis_client.get(cache_key)
        if cached is not None:
            redis_client.expire(cache_key, CACHE_TTL)
            return jsonify(json.loads(cached))

        result = generate_mocks(owner, repo, token, single_file)
        redis_client.setex(cache_key, CACHE_TTL, json.dumps(result))
        return jsonify(result)

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        print(f"[ERROR] generate_mocks: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/bug_detect", methods=["POST"])
def endpoint_bug_detect():
    """
    Expects JSON body containing:
      { "owner": "...", "repo": "...", "token": "...", "file": "<optional>" }
    Uses Redis key "<owner>:<repo>:<commit_sha>:bug_detect[:<file>]".
    """
    try:
        body = request.get_json(force=True)
        owner, repo, token = validate_request_json(body)
        single_file = body.get("file")

        headers = github_headers(token)
        default_branch = get_default_branch(owner, repo, headers)
        commit_sha = get_commit_sha_for_branch(owner, repo, default_branch, headers)

        cache_key = get_cache_key(owner, repo, commit_sha, "bug_detect", single_file)
        cached = redis_client.get(cache_key)
        if cached is not None:
            redis_client.expire(cache_key, CACHE_TTL)
            return jsonify(json.loads(cached))

        result = detect_bugs(owner, repo, token, single_file)
        redis_client.setex(cache_key, CACHE_TTL, json.dumps(result))
        return jsonify(result)

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        print(f"[ERROR] bug_detect: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8888)
