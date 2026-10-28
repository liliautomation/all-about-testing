#!/usr/bin/env python3

import argparse
import os
import re
import subprocess
import sys


PATTERNS = {
    "email address": re.compile(
        r"\b[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}\b", re.I
    ),
    "US phone number": re.compile(
        r"(?<!\d)(?:\+?1[ .-]?)?(?:\([2-9]\d{2}\)|[2-9]\d{2})"
        r"[ .-]?[2-9]\d{2}[ .-]?\d{4}(?!\d)"
    ),
    "US Social Security number": re.compile(
        r"(?<!\d)(?!000|666|9\d\d)\d{3}[- ]"
        r"(?!00)\d{2}[- ](?!0000)\d{4}(?!\d)"
    ),
}
ALLOWED_EMAIL_DOMAINS = {
    "example.com",
    "example.net",
    "example.org",
    "localhost",
}


def valid_card_number(value: str) -> bool:
    digits = re.sub(r"\D", "", value)
    if not 13 <= len(digits) <= 19 or len(set(digits)) == 1:
        return False

    total = 0
    parity = len(digits) % 2
    for index, digit in enumerate(map(int, digits)):
        if index % 2 == parity:
            digit *= 2
            if digit > 9:
                digit -= 9
        total += digit
    return total % 10 == 0


def added_lines(base: str, head: str | None):
    command = [
        "git",
        "diff",
        "--unified=0",
        "--no-color",
        "--diff-filter=ACMR",
    ]
    command.extend([base, head] if head else [base])
    diff = subprocess.run(
        command,
        check=True,
        capture_output=True,
        text=True,
    ).stdout

    path = None
    line_number = 0
    for line in diff.splitlines():
        if line.startswith("+++ b/"):
            path = line[6:]
            continue
        if line.startswith("@@"):
            match = re.search(r"\+(\d+)", line)
            line_number = int(match.group(1)) if match else 0
            continue
        if not line.startswith("+") or line.startswith("+++"):
            continue

        yield path, line_number, line[1:]
        line_number += 1

    if head:
        return

    untracked = subprocess.run(
        ["git", "ls-files", "--others", "--exclude-standard", "-z"],
        check=True,
        capture_output=True,
    ).stdout.split(b"\0")
    for raw_path in filter(None, untracked):
        path = raw_path.decode("utf-8", errors="surrogateescape")
        try:
            with open(path, encoding="utf-8") as file:
                for line_number, content in enumerate(file, start=1):
                    yield path, line_number, content.rstrip("\n")
        except (OSError, UnicodeDecodeError):
            continue


def main() -> int:
    parser = argparse.ArgumentParser(description="Scan added Git lines for common PII")
    parser.add_argument("base", help="base Git revision")
    parser.add_argument(
        "head",
        nargs="?",
        help="head Git revision; omit it to include current working-tree changes",
    )
    args = parser.parse_args()

    findings = []
    try:
        lines = added_lines(args.base, args.head)
        for path, line_number, content in lines:
            for label, pattern in PATTERNS.items():
                for match in pattern.finditer(content):
                    if label == "email address":
                        domain = match.group().rsplit("@", 1)[1].lower()
                        if domain in ALLOWED_EMAIL_DOMAINS:
                            continue
                    findings.append((path, line_number, label))

            for match in re.finditer(r"(?<!\d)(?:\d[ -]?){13,19}(?!\d)", content):
                if valid_card_number(match.group()):
                    findings.append((path, line_number, "payment card number"))
    except subprocess.CalledProcessError as error:
        print(error.stderr.strip() or "Unable to create Git diff for PII scan.", file=sys.stderr)
        return 2

    if findings:
        print("Potential PII found in added lines:", file=sys.stderr)
        for path, line_number, label in findings:
            if "GITHUB_ACTIONS" in os.environ:
                print(f"::error file={path},line={line_number}::{label} detected")
            else:
                print(f"  {path}:{line_number}: {label} detected", file=sys.stderr)
        print(
            "Replace real data with synthetic values. Reserved example email domains "
            "(example.com, example.net, and example.org) are allowed.",
            file=sys.stderr,
        )
        return 1

    print("No common PII patterns found in added lines.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
