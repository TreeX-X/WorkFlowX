---
{
  "schema": "harness-note/2",
  "id": "1cecf70e-4f13-4954-8a4c-10e33aefbfe1",
  "kind": "task",
  "lifecycle": "accepted",
  "created": "2026-10-07",
  "updated": "2026-10-07T16:12:56.085Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/4d4ff96e-89a1-4efc-839e-c9333eba0bc5",
  "work": {
    "scope": [
      {
        "repoId": "d2499d5b-4ceb-4d46-aa3b-18e5c9b86034",
        "paths": [
          ".agents/notes/",
          "docs/migrations/",
          "scripts/"
        ]
      }
    ],
    "acceptanceRefs": [
      {
        "uri": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/737f84da-a7b7-4c4f-8919-b61b25df0f88",
        "criterionId": "AC-5"
      }
    ],
    "verification": [
      {
        "id": "V-1",
        "kind": "command",
        "required": true,
        "repoId": "d2499d5b-4ceb-4d46-aa3b-18e5c9b86034",
        "cwd": ".",
        "program": "node",
        "args": [
          "scripts/verify-note-v2.mjs",
          "--repo",
          "."
        ]
      }
    ],
    "review": "self"
  }
}
---

# WorkflowX old Note corpus migration

## Scope

Migrate the 11 tracked old Notes into maintained module directories. Preserve the pre-existing untracked user Task. This is the separately requested corpus work item; it does not create a general Task requirement for xdo.

## Acceptance criteria

Use work.acceptanceRefs AC-5.

## Verification

V-1 checks the migrated corpus, module structure and references after migration.

## Progress

All 11 tracked sources are migrated. Offline schema/hash, module/reference and protected-source checks pass for 19 v2 documents. One pre-existing untracked Task is explicitly excluded; two historic cross-repository targets remain unchecked in this repository phase.

## Evidence

[Inventory](../../../../docs/migrations/note-v2.json) records original paths, Git revision, hashes, target identities and the protected exclusion. [Verification](../../../../docs/migrations/verification.md) records commands, limitations and instruction-load measurements. No runtime receipt is claimed.

## Handoff

The next phase is agentX. Read the pinned v2 standard, especially execution.md, wiki.md and migration.md; implement supported parsing/writes and preserve existing execution ownership/evidence guarantees. Do not deploy these rules to an old-profile writer. The untracked HOL scanner Task remains outside this migration.
