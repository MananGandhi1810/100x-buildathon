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
OUTPUT_JSON = "./backend/src/generated_mocks.json"

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

def prompt_generate_mocks(code, language):
    return f"""
Given the following {language} code (functions/classes/modules), generate:
- Realistic test input data for each function/class (including both valid and invalid edge cases)
- Example mocks for any APIs, DB calls, or external services used in the code (use unittest.mock, pytest, or language-native mocking tools)
- Output only code, with one test function per example (named test_*), ready to copy-paste into a test file. No explanations.

Code:
{code}
"""

def call_gemini(prompt, model):
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Gemini API error: {e}")
        return ""

def clean_code_block(s):
    if not isinstance(s, str):
        return ""
    s = re.sub(r"^```[\w]*\n", "", s.strip(), flags=re.MULTILINE)
    s = re.sub(r"```$", "", s.strip(), flags=re.MULTILINE)
    return s.strip()

def main():
    # CLI usage: python generate_mocks.py [optional_file_path]
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

        prompt = prompt_generate_mocks(code, language)
        mock_data = call_gemini(prompt, model)
        mock_data = clean_code_block(mock_data)

        results[rel_path] = {
            "language": language,
            "mock_data": mock_data
        }

    with open(OUTPUT_JSON, "w", encoding="utf-8") as jf:
        json.dump(results, jf, indent=2, ensure_ascii=False)
    print(f"\nMock data saved to {OUTPUT_JSON}")

if __name__ == "__main__":
    main()
