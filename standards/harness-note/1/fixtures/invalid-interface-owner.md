---
schema: harness-note/1
id: 99999999-9999-4999-8999-999999999999
kind: task
lifecycle: draft
created: 2026-09-25
interfaces:
  - name: IBusinessEngine
    direction: needs
work:
  scope:
    - repoId: d2499d5b-4ceb-4d46-aa3b-18e5c9b86034
      paths: ["./"]
  acceptanceRefs:
    - uri: note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/99999999-9999-4999-8999-999999999999
      criterionId: AC-1
  verification:
    - id: V-1
      kind: manual
      required: true
      repoId: d2499d5b-4ceb-4d46-aa3b-18e5c9b86034
      cwd: .
      description: Owner check needs full task shape to reach the interfaces rule.
---

# Interfaces on a task must be rejected

## Scope

Owner rule only.

## Acceptance criteria

- [ ] AC-1: Rejected with SCHEMA_INVALID.
