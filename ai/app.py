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
# Load environment variables from .env
# ─────────────────────────────────────────
load_dotenv()  # expects .env in same directory as app.py

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GITHUB_TOKEN   = os.getenv("GITHUB_TOKEN")
GITHUB_OWNER   = os.getenv("GITHUB_OWNER")
GITHUB_REPO    = os.getenv("GITHUB_REPO")

if not (GEMINI_API_KEY and GITHUB_TOKEN and GITHUB_OWNER and GITHUB_REPO):
    raise RuntimeError(
        "Set GEMINI_API_KEY, GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO in .env"
    )

# ─────────────────────────────────────────
# GitHub API base and helper functions
# ─────────────────────────────────────────
GITHUB_API_BASE = "https://api.github.com"

def github_headers():
    return {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"Bearer {GITHUB_TOKEN}",
    }

def get_default_branch():
    """
    GET /repos/{owner}/{repo}
    Returns the default branch name (e.g., 'main' or 'master').
    """
    url = f"{GITHUB_API_BASE}/repos/{GITHUB_OWNER}/{GITHUB_REPO}"
    resp = requests.get(url, headers=github_headers())
    resp.raise_for_status()
    return resp.json()["default_branch"]

def get_tree_sha_for_branch(branch: str):
    """
    1) GET /repos/{owner}/{repo}/git/refs/heads/{branch}
       → retrieve commit SHA
    2) GET /repos/{owner}/{repo}/git/commits/{commit_sha}
       → retrieve tree SHA from this commit
    """
    # Step 1: Branch ref
    url_ref = (
        f"{GITHUB_API_BASE}/repos/{GITHUB_OWNER}/{GITHUB_REPO}"
        f"/git/refs/heads/{branch}"
    )
    resp = requests.get(url_ref, headers=github_headers())
    resp.raise_for_status()
    commit_sha = resp.json()["object"]["sha"]

    # Step 2: Commit data
    url_commit = (
        f"{GITHUB_API_BASE}/repos/{GITHUB_OWNER}/{GITHUB_REPO}"
        f"/git/commits/{commit_sha}"
    )
    resp = requests.get(url_commit, headers=github_headers())
    resp.raise_for_status()
    return resp.json()["tree"]["sha"]

def get_github_tree(tree_sha: str):
    """
    GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1
    Returns a list of dicts with keys: 'path' and 'type' ("blob" or "tree").
    """
    url = (
        f"{GITHUB_API_BASE}/repos/{GITHUB_OWNER}/{GITHUB_REPO}"
        f"/git/trees/{tree_sha}?recursive=1"
    )
    resp = requests.get(url, headers=github_headers())
    resp.raise_for_status()
    return resp.json().get("tree", [])

def fetch_file_content(path: str, branch: str) -> str:
    """
    GET /repos/{owner}/{repo}/contents/{path}?ref={branch}
    If returned JSON has "content" base64-encoded, decode it.
    """
    url = (
        f"{GITHUB_API_BASE}/repos/{GITHUB_OWNER}/{GITHUB_REPO}"
        f"/contents/{path}"
    )
    resp = requests.get(url, headers=github_headers(), params={"ref": branch})
    resp.raise_for_status()
    data = resp.json()
    if data.get("encoding") == "base64" and "content" in data:
        return base64.b64decode(data["content"]).decode("utf-8", errors="ignore")
    return ""

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
    """
    Remove triple‐backtick fences (```...) from LLM output.
    """
    if not isinstance(s, str):
        return ""
    s = re.sub(r"^```[\w]*\n", "", s.strip(), flags=re.MULTILINE)
    s = re.sub(r"```$", "", s.strip(), flags=re.MULTILINE)
    return s.strip()

def call_gemini(prompt: str, expect_json: bool = False):
    """
    Send `prompt` to Gemini. If expect_json=True, extract first JSON array.
    Returns a string (or dict/list if expect_json).
    """
    try:
        resp = LLM_MODEL.generate_content(prompt)
        text = resp.text.strip()
        if expect_json:
            m = re.search(r"(\[.*?\])", text, re.DOTALL)
            if m:
                return json.loads(m.group(1))
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
# Core Generation Functions
# ─────────────────────────────────────────
def list_all_files(single_file: str = None):
    """
    1) Find default branch
    2) Find tree SHA for that branch
    3) GET tree recursively
    4) Filter blobs by SUPPORTED_EXTENSIONS
    Returns list of (rel_path, language)
    """
    branch = get_default_branch()
    tree_sha = get_tree_sha_for_branch(branch)
    tree = get_github_tree(tree_sha)

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

def generate_tests(single_file: str = None):
    """
    Fetch each file’s content and generate tests via Gemini.
    Returns a dict: { rel_path: {language, test_cases} }
    """
    files = list_all_files(single_file)
    branch = get_default_branch()
    results = {}
    for rel_path, language in files:
        code = fetch_file_content(rel_path, branch)
        prompt = prompt_test_cases(code, language)
        raw = call_gemini(prompt)
        tests = clean_code_block(raw)
        results[rel_path] = {"language": language, "test_cases": tests}
    return results

def generate_mocks(single_file: str = None):
    """
    Fetch each file’s content and generate mocks via Gemini.
    Returns a dict: { rel_path: {language, mock_data} }
    """
    files = list_all_files(single_file)
    branch = get_default_branch()
    results = {}
    for rel_path, language in files:
        code = fetch_file_content(rel_path, branch)
        prompt = prompt_generate_mocks(code, language)
        raw = call_gemini(prompt)
        mocks = clean_code_block(raw)
        results[rel_path] = {"language": language, "mock_data": mocks}
    return results

def detect_bugs(single_file: str = None):
    """
    Fetch each file’s content and run bug detection via Gemini.
    Returns a dict: { rel_path: {language, bug_report} }
    """
    files = list_all_files(single_file)
    branch = get_default_branch()
    results = {}
    for rel_path, language in files:
        code = fetch_file_content(rel_path, branch)
        prompt = prompt_bug_finder(code, language)
        bugs = call_gemini(prompt, expect_json=True)
        results[rel_path] = {"language": language, "bug_report": bugs}
    return results

# ─────────────────────────────────────────
# Flask App
# ─────────────────────────────────────────
app = Flask(__name__)

@app.route("/generate_tests", methods=["POST"])
def endpoint_generate_tests():
    data = request.get_json(silent=True) or {}
    single_file = data.get("file")  # e.g. "src/utils.py"
    try:
        output = generate_tests(single_file)
        return jsonify(output)
    except Exception as e:
        print(f"[ERROR] generate_tests: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/generate_mocks", methods=["POST"])
def endpoint_generate_mocks():
    data = request.get_json(silent=True) or {}
    single_file = data.get("file")
    try:
        output = generate_mocks(single_file)
        return jsonify(output)
    except Exception as e:
        print(f"[ERROR] generate_mocks: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/bug_detect", methods=["POST"])
def endpoint_bug_detect():
    data = request.get_json(silent=True) or {}
    single_file = data.get("file")
    try:
        output = detect_bugs(single_file)
        return jsonify(output)
    except Exception as e:
        print(f"[ERROR] detect_bugs: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)

