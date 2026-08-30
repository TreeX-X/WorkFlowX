---
name: specX
description: Lightweight specification-reading rules for coderX in xdel and xflow.
---

# specX

Use only when coderX is dispatched by `xdel` or `xflow` with a Hybrid Tree task.

## Before Editing

- Read the dispatch task first.
- Read the assigned Child acceptance criteria and file scope.
- Read only the Parent sections required for ownership, dependencies, or global constraints.
- Treat the dispatch interpretation and Child acceptance criteria as authoritative. Stop on contradictions instead of guessing.

## During Implementation

- Follow `engineeringX` for implementation principles and self-review.
- Stay within the assigned Child scope. Report required shared-file or scope changes to the Main Agent.
- Do not write to Parent or Child documents.
- Expand context only when a named dependency or API contract requires it.

## Completion

- Perform the `engineeringX` self-review.
- Run relevant checks when available and report what was actually run.
- Return the mode-specific implementation summary or Bus Payload requested by the dispatch contract.
