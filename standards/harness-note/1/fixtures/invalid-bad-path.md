---
schema: harness-note/1
id: aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa
kind: requirement
lifecycle: proposed
created: 2026-09-16
codeRefs:
  - repoId: 8fa19f17-c717-43a8-93a7-810a5e0cbc91
    path: ../escape/secret.txt
    role: implementation
---

# Bad path

## Problem

Escaping paths must fail.

## Expected behavior

Validator rejects parent traversal.

## Scope

In scope.

## Acceptance criteria

- [ ] AC-1: Rejected with a diagnostic.
