---
{
  "schema": "harness-note/2",
  "id": "4d4ff96e-89a1-4efc-839e-c9333eba0bc5",
  "kind": "module",
  "lifecycle": "accepted",
  "created": "2026-10-07",
  "updated": "2026-10-10T12:59:17.000Z",
  "moduleState": "implemented",
  "parent": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/6be08bc0-2ac5-4638-8263-cf9883c7cdae"
}
---

# Workflow execution and handoff

## Responsibility

Route direct work, delegated implementation and independent evaluation while maintaining bounded execution grounds.

## Design

Main Agent owns scheduling and all Task writes, including body and metadata. Subagents read fixed Tasks and return Change Summary + Note draft or Evaluation Result. Main Agent integrates those results before each handoff. xdel performs one implementation and self-review; any separate review obligation remains pending. xflow retains discovery, socratesX, Ready Summary, Task planning and dependency-ordered independent evaluation. Ordinary xdo creates no Task; explicitly selected Tasks retain acceptance and review obligations. xdo lands atomically: code, the affected Note and the entry reverse reference share one commit whose message carries the Note path, and mechanical or local edits are exempt as `not applicable`. A landing commit stages only the paths the change touched, so unrelated working-tree edits stay out of it. xdel and xflow use pinned dispatch references.

[orchestrateX](../../../.codex/skills/orchestrateX/SKILL.md) is the compact runtime entry. [Execution contracts](../../../standards/harness-note/2/execution.md) define snapshot, evidence and recovery obligations. [Scaffolding](scaffold.md) creates module entries.

## Work

The [corpus migration task](tasks/note-corpus-migration.md) records this repository migration and check results. Historical tasks remain evidence rather than current structure.
