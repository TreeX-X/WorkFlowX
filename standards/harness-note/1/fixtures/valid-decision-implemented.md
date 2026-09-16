---
schema: harness-note/1
id: 44444444-4444-4444-8444-444444444445
kind: decision
lifecycle: implemented
created: 2026-09-10
class: architecture
tags: [harness]
codeRefs:
  - repoId: 8fa19f17-c717-43a8-93a7-810a5e0cbc91
    path: standards/harness-note/1/note.schema.json
    role: implementation
---

# Task note absorbs hybrid tree duties

## Problem

Parallel plan files duplicate goals, acceptance, and lifecycle.

## Decision

Task notes carry scope, acceptance refs, verification, dependencies, and execution state. No independent Parent/Child files remain.

## Alternatives considered

- Keep an independent hybrid tree: preserves existing templates but doubles identity and dispatch.
- Do nothing / reuse: preserves duplication and blocks unified acceptance.

## Consequences

- Evidence binds the fixed contract hash and reviewed manifest; stale inputs invalidate coverage.
