import os
import re
import json
import base64
from pathlib import Path

from flask import Flask, request, jsonify
from dotenv import load_dotenv

import requests
import google.generativeai as genai

# ─────────────────────────────────────────
# Load only GEMINI_API_KEY from .env
# ─────────────────────────────────────────
load_dotenv()  # expects .env in same directory as this script

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY must be set in .env")

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

# ─────────────────────────────────────────
# GitHub API helper functions (now parameterized)
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

def get_tree_sha_for_branch(owner: str, repo: str, branch: str, headers: dict) -> str:
    """
    1) GET /repos/{owner}/{repo}/git/refs/heads/{branch}
       → get commit SHA
    2) GET /repos/{owner}/{repo}/git/commits/{commit_sha}
       → get tree SHA
    """
    url_ref = f"https://api.github.com/repos/{owner}/{repo}/git/refs/heads/{branch}"
    resp = requests.get(url_ref, headers=headers)
    resp.raise_for_status()
    commit_sha = resp.json()["object"]["sha"]

    url_commit = f"https://api.github.com/repos/{owner}/{repo}/git/commits/{commit_sha}"
    resp = requests.get(url_commit, headers=headers)
    resp.raise_for_status()
    return resp.json()["tree"]["sha"]

def get_github_tree(owner: str, repo: str, tree_sha: str, headers: dict):
    """
    GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1
    Returns list of {"path":..., "type":...}.
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1"
    resp = requests.get(url, headers=headers)
    resp.raise_for_status()
    return resp.json().get("tree", [])

def fetch_file_content(owner: str, repo: str, path: str, branch: str, headers: dict) -> str:
    """
    GET /repos/{owner}/{repo}/contents/{path}?ref={branch}
    Return decoded UTF-8 file content (if base64-encoded).
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    resp = requests.get(url, headers=headers, params={"ref": branch})
    resp.raise_for_status()
    data = resp.json()
    if data.get("encoding") == "base64" and "content" in data:
        return base64.b64decode(data["content"]).decode("utf-8", errors="ignore")
    return ""

# ─────────────────────────────────────────
# LLM Helper Functions
# ─────────────────────────────────────────
def clean_code_block(s: str) -> str:
    """Strip ```...``` fences."""
    if not isinstance(s, str):
        return ""
    s = re.sub(r"^```[\w]*\n", "", s.strip(), flags=re.MULTILINE)
    s = re.sub(r"```$", "", s.strip(), flags=re.MULTILINE)
    return s.strip()

def call_gemini(prompt: str, expect_json: bool = False):
    """Call Gemini; if expect_json=True, parse first JSON array."""
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
# AI Prompt Templates
# ─────────────────────────────────────────
def prompt_test_cases(code: str, language: str) -> str:
    return f"""
Given the following {language} code, generate comprehensive unit/integration test code using the standard test framework for that language.
Return ONLY the test code as plain text, WITHOUT explanations, comments, markdown, or code block fences.
Format output to be copy-paste ready with correct indentation and line breaks.

Code:
{code}
"""

def prompt_generate_mocks(code: str, language: str) -> str:
    return f"""
Given the following {language} code (functions/classes/modules), generate:
- Realistic test input data for each function/class (valid + invalid edge cases)
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
# Core Generation Functions (parameterized)
# ─────────────────────────────────────────
def list_all_files(owner: str, repo: str, token: str, single_file: str = None):
    """
    1. GET default branch
    2. GET tree SHA for that branch
    3. GET tree recursively
    4. Filter blobs by SUPPORTED_EXTENSIONS
    Returns list of (path, language)
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
            lang = SUPPORTED_EXTENSIONS[ext]
            files.append((path, lang))
    if single_file:
        for (p, lang) in files:
            if p == single_file:
                return [(p, lang)]
        return []
    return files

def generate_tests(owner: str, repo: str, token: str, single_file: str = None):
    """
    Fetch each file’s content and generate tests via Gemini.
    Returns: {path:{"language":..., "test_cases": "..."}}
    """
    files = list_all_files(owner, repo, token, single_file)
    headers = github_headers(token)
    branch = get_default_branch(owner, repo, headers)

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
    Fetch each file’s content and generate mock code via Gemini.
    Returns: {path:{"language":..., "mock_data": "..."}}
    """
    files = list_all_files(owner, repo, token, single_file)
    headers = github_headers(token)
    branch = get_default_branch(owner, repo, headers)

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
    Fetch each file’s content and run bug detection via Gemini.
    Returns: {path:{"language":..., "bug_report": [...]}}
    """
    files = list_all_files(owner, repo, token, single_file)
    headers = github_headers(token)
    branch = get_default_branch(owner, repo, headers)

    results = {}
    for rel_path, language in files:
        code = fetch_file_content(owner, repo, rel_path, branch, headers)
        prompt = prompt_bug_finder(code, language)
        bugs = call_gemini(prompt, expect_json=True)
        results[rel_path] = {"language": language, "bug_report": bugs}
    return results

# ─────────────────────────────────────────
# Flask App
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
    try:
        body = request.get_json(force=True)
        owner, repo, token = validate_request_json(body)
        single_file = body.get("file")  # optional relative path
        result = generate_tests(owner, repo, token, single_file)
        return jsonify(result)
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        print(f"[ERROR] generate_tests: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/generate_mocks", methods=["POST"])
def endpoint_generate_mocks():
    try:
        body = request.get_json(force=True)
        owner, repo, token = validate_request_json(body)
        single_file = body.get("file")
        result = generate_mocks(owner, repo, token, single_file)
        return jsonify(result)
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        print(f"[ERROR] generate_mocks: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/bug_detect", methods=["POST"])
def endpoint_bug_detect():
    try:
        body = request.get_json(force=True)
        owner, repo, token = validate_request_json(body)
        single_file = body.get("file")
        result = detect_bugs(owner, repo, token, single_file)
        return jsonify(result)
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        print(f"[ERROR] bug_detect: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8888)
