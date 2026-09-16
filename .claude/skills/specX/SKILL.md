---
name: specX
description: Lightweight specification-reading rules for coderX in xdel and xflow.
---

# specX

Use only when coderX is dispatched by `xdel` or `xflow` with a task note.

## Before Editing

- Read the dispatch task first.
- Read the assigned task's acceptance refs (fixed revision) and work scope.
- Read only the referenced requirement/decision notes needed for ownership, dependencies, or constraints.
- Treat the dispatch interpretation and fixed acceptance refs as authoritative. Stop on contradictions instead of guessing.

## During Implementation

- Follow `engineeringX` for implementation principles and self-review.
- Stay within the assigned task scope. Report required shared-file or scope changes to the Main Agent as a scope-change request.
- Do not rewrite other notes; update only files inside the allowed scope.
- `task.execution` is owned by the Main Agent and the state service. coderX never writes it; only an explicit contract-scope grant lets coderX propose work/AC changes, otherwise return a scope-change request.
- Expand context only when a named dependency or API contract requires it.

## Completion

- Perform the `engineeringX` self-review.
- Run relevant checks when available and report what was actually run.
- Return the mode-specific implementation summary or Bus Payload requested by the dispatch contract.
