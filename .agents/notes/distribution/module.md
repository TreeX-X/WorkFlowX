---
{
  "schema": "harness-note/2",
  "id": "7d9d87b8-8153-4b01-8c0b-fa52f50127cf",
  "kind": "module",
  "lifecycle": "accepted",
  "created": "2026-10-07",
  "updated": "2026-10-08T14:39:00Z",
  "moduleState": "implemented",
  "parent": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/6be08bc0-2ac5-4638-8263-cf9883c7cdae"
}
---

# Rule distribution

## Responsibility

Keep Codex and Claude instructions equivalent while preserving host-local settings and ensuring adopters explicitly select a supported standard.

## Design

Managed skill files and marked entry/agent blocks are synchronized. Commands point to their owning skill rather than duplicate policy. [Rule synchronization](rule-sync.md) describes the version guard. Adopters are upgraded sequentially; applying rules to an old profile must fail before any write.

Use scripts/sync-harness-rules.mjs with an explicit repository list. WorkflowX, agentX and JanusX now pass local managed parity and repeat-apply checks.

[Readiness review](../../../docs/reviews/workflowx-v2.md) findings are repaired and source regressions pass. Teammate files now use managed blocks; unmarked existing files require a merge and fail synchronization without being overwritten. Source rules and downstream integration pass independent local acceptance; exact revisions, historical evidence qualifications and the separate release/push boundary are recorded in the [agentX then JanusX adoption Task](tasks/sync-adopters.md).

[README demonstration refresh](requirements/readme-demo.md) is required before final release after integration stabilizes.
