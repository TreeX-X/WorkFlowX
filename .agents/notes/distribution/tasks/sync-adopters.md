---
{
  "schema": "harness-note/2",
  "id": "2ce416be-b118-40c4-bddc-87da25a8fe02",
  "kind": "task",
  "lifecycle": "draft",
  "created": "2026-10-07",
  "updated": "2026-10-07T16:29:33.592Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/7d9d87b8-8153-4b01-8c0b-fa52f50127cf",
  "work": {
    "scope": [
      {"repoId": "d2499d5b-4ceb-4d46-aa3b-18e5c9b86034", "paths": [".agents/notes/distribution/", "docs/reviews/", "docs/migrations/"]},
      {"repoId": "62b44166-82f0-41ff-838d-e2b02388ed06", "paths": ["."]},
      {"repoId": "972afef3-2fc7-49de-a3ee-7e041225d28c", "paths": ["."]}
    ],
    "acceptanceRefs": [
      {"uri": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/2ce416be-b118-40c4-bddc-87da25a8fe02", "criterionId": "AC-1"},
      {"uri": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/2ce416be-b118-40c4-bddc-87da25a8fe02", "criterionId": "AC-2"},
      {"uri": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/2ce416be-b118-40c4-bddc-87da25a8fe02", "criterionId": "AC-3"},
      {"uri": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/2ce416be-b118-40c4-bddc-87da25a8fe02", "criterionId": "AC-4"}
    ],
    "verification": [
      {"id": "V-1", "kind": "command", "required": true, "repoId": "d2499d5b-4ceb-4d46-aa3b-18e5c9b86034", "cwd": ".", "program": "node", "args": ["scripts/review-note-v2.mjs"]},
      {"id": "V-2", "kind": "manual", "required": true, "repoId": "62b44166-82f0-41ff-838d-e2b02388ed06", "cwd": ".", "description": "Verify pinned managed-file parity, migration accounting, runtime reads/writes/wiki, and fresh-session Task handoff; record commands and results."},
      {"id": "V-3", "kind": "manual", "required": true, "repoId": "972afef3-2fc7-49de-a3ee-7e041225d28c", "cwd": ".", "description": "Verify managed-file parity, migrated corpus, shared agentX tools in Chat, and planned/current module blueprint navigation; record commands and results."}
    ],
    "review": "independent"
  }
}
---

# Synchronize finalized WorkflowX to agentX and JanusX

## Scope

After WorkflowX source repair and final review, adopt its finalized files in janus-agentX, then JanusX. Include skills, commands, managed AGENTS/CLAUDE and agent instructions, teammate wrappers, and required standard resources. Preserve local models, permissions, plugins, unrelated configuration and unmanaged text. Keep uppercase-X skill names.

Target root scopes are provisional because runtime paths have not been mapped. Before accepting or dispatching this Task, inspect each target and narrow paths to the actual adoption modules. No unrelated module cleanup is authorized.

## Acceptance criteria

- [ ] AC-1: All findings in the source review are resolved and independently reviewed; record the exact finalized source commit, profile/version/digest and managed file inventory before distribution.
- [ ] AC-2: agentX then JanusX adopt the complete inventory, including teammate rules. Dry-run/diff, managed parity and repeat-run idempotence pass while local settings remain intact. Each runtime supports the selected profile before activating it; no fake profile update bypasses the synchronization guard.
- [ ] AC-3: Each target has a distinct legacy Note migration work item completed before final parsing validation. Account for old identities, rewritten/deleted sources, repaired references and protected exclusions; validate maintained module structure, type conversion, timestamps and planned modules.
- [ ] AC-4: Target evidence proves common wiki source reads and engineering tools, ordinary xdo without Task creation, and fresh-session continuation using the same Main-Agent-owned Task updated before each handoff. Preserve review obligations. JanusX proves module-only initial blueprint, single-click expansion, double-click detail/return and Chat harness read/edit/script execution through agentX.

## Verification

V-1 is currently expected to fail and blocks finalization. Also rerun the source unit tests, standard/corpus validation, skill-resource checks and managed parity after repairs. V-2 and V-3 require concrete target commands and independent review evidence before their phases are declared complete. Offline source checks alone do not satisfy runtime acceptance.

## Progress

Recorded at user request; no downstream files have been synchronized. Both adopters were observed on profile 1.0.0-s1.2 during review. WorkflowX revision 324f20518dcb021d3c27451ff107edd46c9ff5bd is reviewed but not finalized. Source defects must be repaired first; this draft is not dispatch-ready.

## Evidence

[Source readiness review](../../../../docs/reviews/workflowx-v2.md) records blockers and requirement coverage. [Source verification](../../../../docs/migrations/verification.md) records limited existing checks. [Maintained document requirements](../../harness/requirements/maintained-notes.md) distinguish WorkflowX contracts from later runtime adoption. No target receipts or successful adoption are claimed.

## Handoff

Main Agent owns this shared Task and updates it before every handoff with current source/target revisions, fixed references, narrowed scope, unresolved issues, next action and verification evidence. First repair and finalize WorkflowX; then inspect agentX runtime adoption and migration needs. Complete agentX acceptance before JanusX. New agents read this Task and linked source documents without relying on earlier conversation.
