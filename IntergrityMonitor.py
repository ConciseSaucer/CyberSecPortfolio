import hashlib
import os
import json
import time

# Configuration
TARGET_DIR = "./my_important_files"
BASELINE_FILE = "baseline.json"

def get_file_hash(filepath):
    """Calculates SHA-256 hash of a file."""
    sha256_hash = hashlib.sha256()
    try:
        with open(filepath, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    except Exception as e:
        return None

def create_baseline():
    """Scans the directory and saves hashes to a JSON file."""
    baseline = {}
    for root, _, files in os.walk(TARGET_DIR):
        for file in files:
            full_path = os.path.join(root, file)
            hash_value = get_file_hash(full_path)
            if hash_value:
                baseline[full_path] = hash_value
    
    with open(BASELINE_FILE, "w") as f:
        json.dump(baseline, f, indent=4)
    print(f"[+] Baseline created with {len(baseline)} files.")

def monitor():
    """Compares current file states against the saved baseline."""
    if not os.path.exists(BASELINE_FILE):
        print("[-] No baseline found. Please create one first.")
        return

    with open(BASELINE_FILE, "r") as f:
        baseline = json.load(f)

    print("[*] Monitoring started... (Ctrl+C to stop)")
    
    # We'll keep track of seen files to detect deletions later
    current_files_seen = []

    for root, _, files in os.walk(TARGET_DIR):
        for file in files:
            full_path = os.path.join(root, file)
            current_files_seen.append(full_path)
            current_hash = get_file_hash(full_path)

            # Check if file is new
            if full_path not in baseline:
                print(f"[ALERT] NEW FILE CREATED: {full_path}")
            # Check if file was modified
            elif current_hash != baseline[full_path]:
                print(f"[ALERT] FILE MODIFIED: {full_path}")

    # Check for deleted files
    for path in baseline:
        if path not in current_files_seen:
            print(f"[ALERT] FILE DELETED: {path}")
