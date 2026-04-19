#!/usr/bin/env bash
set -euo pipefail

echo "== GIT STATUS =="
git status --short || true
echo

if ! git diff --cached --quiet; then
  echo "== STAGED STAT =="
  git diff --cached --stat
  echo
  echo "== STAGED DIFF =="
  git diff --cached --minimal
  echo
fi

if ! git diff --quiet; then
  echo "== WORKTREE STAT =="
  git diff --stat
  echo
  echo "== WORKTREE DIFF =="
  git diff --minimal
  echo
fi
