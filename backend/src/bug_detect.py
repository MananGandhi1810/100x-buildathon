import os
import sys
import git
import google.generativeai as genai
import json
import re
from dotenv import load_dotenv

# --- LOAD ENV VARIABLES ---
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
REPO_URL = os.getenv("REPO_URL")

LOCAL_REPO_DIR = "./repo"
OUTPUT_JSON = "bug_reports.json"

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
    ".php": "php"
}

def clone_repo(repo_url, target_dir):
    if os.path.exists(target_dir):
        import shutil
        shutil.rmtree(target_dir)
    print(f"Cloning repo {repo_url} ...")
    git.Repo.clone_from(repo_url, target_dir)
    print("Repo cloned.")

def find_code_files(base_path, single_file=None):
    if single_file:
        ext = os.path.splitext(single_file)[1]
        if ext in SUPPORTED_EXTENSIONS:
            rel = os.path.relpath(single_file, base_path)
            return [(rel, single_file, SUPPORTED_EXTENSIONS[ext])]
        else:
            return []
    code_files = []
    for root, _, files in os.walk(base_path):
        for file in files:
            ext = os.path.splitext(file)[1]
            if ext in SUPPORTED_EXTENSIONS:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, base_path)
                code_files.append((rel_path, full_path, SUPPORTED_EXTENSIONS[ext]))
    return code_files

def prompt_bug_finder(code, language):
    return f"""
You are a senior security engineer.
Review the following {language} code for:
- Logic bugs
- Security vulnerabilities (injection, unsafe deserialization, XSS, CSRF, etc.)
- Bad practices or anti-patterns

For each issue, output:
- Line number(s)
- Short description
- Severity (High/Medium/Low)
- A concise suggested fix

Output only as a JSON list:
[
  {{"line": 12, "issue": "Possible SQL Injection", "severity": "High", "fix": "Use parameterized queries"}},
  ...
]

Code:
{code}
"""

def call_gemini(prompt, model):
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Extract only the first valid JSON array from response
        match = re.search(r'(\[.*?\])', text, re.DOTALL)
        if match:
            return json.loads(match.group(1))
        try:
            return json.loads(text)
        except Exception:
            return []
    except Exception as e:
        print(f"Gemini API error: {e}")
        return []

def main():
    # CLI usage: python bug_detect.py [optional_file_path]
    file_path = sys.argv[1] if len(sys.argv) > 1 else None

    if GEMINI_API_KEY is None or REPO_URL is None:
        print("ERROR: GEMINI_API_KEY and REPO_URL must be set in the .env file.")
        return

    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.0-flash-lite")

    if not os.path.exists(LOCAL_REPO_DIR):
        clone_repo(REPO_URL, LOCAL_REPO_DIR)

    code_files = find_code_files(LOCAL_REPO_DIR, file_path)
    print(f"Found {len(code_files)} code files.")

    results = {}
    for rel_path, full_path, language in code_files:
        print(f"\nProcessing: {rel_path} ({language})")
        with open(full_path, "r", encoding="utf-8") as f:
            code = f.read()

        prompt = prompt_bug_finder(code, language)
        bug_report = call_gemini(prompt, model)

        results[rel_path] = {
            "language": language,
            "bug_report": bug_report
        }

    with open(OUTPUT_JSON, "w", encoding="utf-8") as jf:
        json.dump(results, jf, indent=2, ensure_ascii=False)
    print(f"\nBug reports saved to {OUTPUT_JSON}")

if __name__ == "__main__":
    main()
