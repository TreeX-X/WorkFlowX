# Maintained module documents

Each module has one module.md entry explaining the whole, with topic Notes and submodules beside it. Planned modules use the same structure and remain visible in blueprint navigation. Agent maintenance follows responsibility and the user's change scope.

Authoring rules live in [noteX](../.codex/skills/noteX/SKILL.md); use its conditional references for structural changes, wiki reads and reorganization. The [v2 standard](../standards/harness-note/2/standard.md) defines metadata and validation. [Migration](../standards/harness-note/2/migration.md) describes staged WorkflowX → agentX → JanusX adoption.

Task execution is separate from module state. Main Agent updates the same Task before each handoff; ordinary xdo needs no Task. A selected existing Task retains its review obligations when executed directly.
