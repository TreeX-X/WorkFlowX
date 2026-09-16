---
schema: harness-note/1
id: 00000000-0000-4000-8000-000000000000
kind: task
lifecycle: accepted
created: 2026-09-16
class: feature
relations:
  - type: implements
    target: note://00000000-0000-4000-8000-000000000001/00000000-0000-4000-8000-000000000002
    criteria: [AC-1]
work:
  scope:
    - repoId: 00000000-0000-4000-8000-000000000001
      paths: ["./"]
  acceptanceRefs:
    - uri: note://00000000-0000-4000-8000-000000000001/00000000-0000-4000-8000-000000000002
      criterionId: AC-1
  verification:
    - id: V-1
      kind: command
      required: true
      repoId: 00000000-0000-4000-8000-000000000001
      cwd: .
      program: node
      args: ["scripts/verify-harness-standard.mjs"]
---

# Title (single H1)

## Scope

Bounded delivery scope for this task. Required even for draft.

## Acceptance criteria

Inherited clauses live in work.acceptanceRefs; task-only clauses use stable IDs:

- [ ] AC-1: Task-owned check (when no inheritance).

## Verification

- V-1: Run `node scripts/verify-harness-standard.mjs`; required checks pass.
