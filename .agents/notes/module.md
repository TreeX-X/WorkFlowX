---
{
  "schema": "harness-note/2",
  "id": "6be08bc0-2ac5-4638-8263-cf9883c7cdae",
  "kind": "module",
  "lifecycle": "accepted",
  "created": "2026-10-07",
  "updated": "2026-10-07T16:06:22.322Z",
  "moduleState": "partial",
  "role": "project"
}
---

# WorkflowX

WorkflowX defines how agents maintain engineering documents and coordinate scoped work. Its module-oriented Note standard, shared wiki read contract and task handoff rules are consumed by agentX and JanusX.

## Structure

[Harness](harness/module.md) owns document formats, references and execution contracts. [Workflow](workflow/module.md) owns direct work, dispatch and shared Task maintenance. [Distribution](distribution/module.md) keeps host rules and standard pins consistent.

## Delivery boundary

The v2 format and offline conformance live here. Runtime read/edit, execution and index adoption belong to agentX; blueprint and engineering Chat adoption belong to JanusX. Their implementation status is not inferred from this repository.
