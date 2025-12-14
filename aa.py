#!/usr/bin/env python3
"""
merge_jsx.py

Recursively find all .jsx files under a directory and merge them into a single text file.
Each file entry in the output contains:
 - A clear header with the file absolute path
 - The file contents (read as UTF-8 with replacement for invalid bytes)
 - A per-file separator

Usage:
    python merge_jsx.py /path/to/search -o merged.txt

If no directory is provided, the current working directory is used.
"""

import os
import argparse
from pathlib import Path

DEFAULT_OUTPUT = "merged_jsx_files.txt"
FILE_HEADER_FMT = "=== FILE: {path} ===\n"
FILE_SEPARATOR = "\n--- END OF FILE ---\n\n"
FINAL_SEPARATOR = "\n=== END OF MERGE (Total files: {count}) ===\n"

def find_jsx_files(root: Path, ignore_dirs=None):
    """
    Yield Path objects for all .jsx files under root (recursively).
    By default, ignores common node_modules and .git folders (can be extended).
    """
    if ignore_dirs is None:
        ignore_dirs = {"node_modules", ".git", "dist", "build"}
    for dirpath, dirnames, filenames in os.walk(root):
        # prune ignored directories in-place to avoid descending
        dirnames[:] = [d for d in dirnames if d not in ignore_dirs]
        for fname in filenames:
            if fname.lower().endswith(".jsx") or fname.lower().endswith(".js"):
                yield Path(dirpath) / fname

def merge_jsx_files(root: Path, out_path: Path, ignore_dirs=None, show_progress=True):
    root = root.resolve()
    out_path = out_path.resolve()
    files = sorted(find_jsx_files(root, ignore_dirs=ignore_dirs))
    total = len(files)

    if show_progress:
        print(f"Found {total} .jsx files under: {root}")

    with out_path.open("w", encoding="utf-8", errors="replace") as out_f:
        for idx, fpath in enumerate(files, start=1):
            header = FILE_HEADER_FMT.format(path=str(fpath))
            out_f.write(header)
            try:
                with fpath.open("r", encoding="utf-8", errors="replace") as in_f:
                    content = in_f.read()
            except Exception as e:
                # If something goes wrong, write an error placeholder
                content = f"/* ERROR READING FILE: {e} */\n"
            out_f.write(content)
            out_f.write(FILE_SEPARATOR)
            if show_progress:
                print(f"[{idx}/{total}] merged: {fpath}")
        out_f.write(FINAL_SEPARATOR.format(count=total))

    if show_progress:
        print(f"\nMerge complete. Output written to: {out_path}")

def parse_args():
    p = argparse.ArgumentParser(description="Merge .jsx files into a single text file.")
    p.add_argument("root", nargs="?", default=".", help="Root directory to search (default: current dir).")
    p.add_argument("-o", "--output", default=DEFAULT_OUTPUT, help=f"Output file (default: {DEFAULT_OUTPUT}).")
    p.add_argument("--no-progress", action="store_true", help="Do not print progress to stdout.")
    p.add_argument("--ignore", nargs="*", default=None, help="Directory names to ignore (space separated).")
    return p.parse_args()

def main():
    args = parse_args()
    root = Path(args.root)
    out = Path(args.output)
    ignore = set(args.ignore) if args.ignore else None
    merge_jsx_files(root, out, ignore_dirs=ignore, show_progress=not args.no_progress)

if __name__ == "__main__":
    main()
