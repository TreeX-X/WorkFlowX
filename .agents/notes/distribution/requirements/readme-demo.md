---
{
  "schema": "harness-note/2",
  "id": "ca370eb7-05a0-4bde-9539-4f9fddf77b2c",
  "kind": "requirement",
  "lifecycle": "accepted",
  "created": "2026-10-07",
  "updated": "2026-10-08T14:39:00Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/7d9d87b8-8153-4b01-8c0b-fa52f50127cf"
}
---

# Refresh WorkflowX README demonstrations

## Expected behavior

WorkflowX's bilingual README and diagrams show maintained module documents and current handoffs. JanusX supplies a real desktop recording of the same three-level example: single-click preview, double-click entry with the module parent retained, return, scope/focus and in-place Note maintenance. Diagrams are workflow illustrations; the desktop uses a deterministic local model with real host tools.

## Acceptance criteria

- [x] AC-1: README examples and any embedded demonstration assets show module/submodule folders, one module.md entry per module, parent-level documents and the six document kinds, including generic note.
- [x] AC-2: Demonstrate ordinary xdo maintaining an existing topic and refreshing updated without creating a Task; describe new documents or module restructuring only when the subject warrants it.
- [x] AC-3: Task demonstrations reflect workflow iteration and Main Agent updates before handoff. Remove obsolete date-first accumulation and conflicting workflow examples; verify referenced assets and commands against the integrated version.

## Evidence

Presentation acceptance now also passes independent integration review. Both READMEs contain the same nine-document tree and explicit implementation/evaluation/repair handoff examples. Each module has one entry, ordinary Notes remain at project and parent levels, and all six kinds are present. The example Task remains unexecuted; no receipt or independent verdict is invented.

`node scripts/export-readme-assets.mjs` passes. Maintained-note PNGs are 1200×675; both workflow GIFs are 960×540, 360 frames and 30 seconds. Source rendering has no page errors; bilingual directory/footer and implementation, evaluation, repair and closeout samples were visually checked. Task AC meanings stay consistent between planning, evaluation and closeout. All 50 local links in both repositories' READMEs and the recorder guide resolve.

JanusX's `npm run showcase -- build blueprint` passes on isolated source `dc8a6394cf1618c12bacffb95a7b9a14fc689aed` with agentX `d6cd44569eee3c36c637a996131a1303b3900bde`: 271 frames, 1920×1080, 34.38 seconds. Real `note_scope`, `note_focus`, `note_read` and `note_write` run with two scripted replies and no extra model requests. UI assertions require completed turns without error cards. The same Note preserves UUID/created, refreshes updated and leaves nine documents and one existing Task. The [JanusX showcase decision](note://972afef3-2fc7-49de-a3ee-7e041225d28c/7b4800da-0ea0-4f63-9f15-7ce60e721bd7) owns the recorder details.

## Delivery

The [adoption Task](../tasks/sync-adopters.md) records the local demo delivery and exact repository commits. The independent evaluator reran the complete recording on JanusX 0408046 with agentX 5c41e2f: 271 frames, exact six scripted requests and all identity/count assertions passed; generated visuals were inspected. Local acceptance is complete, while publication remains a separate action.
