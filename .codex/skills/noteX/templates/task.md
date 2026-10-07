---
{
  "schema": "harness-note/2",
  "id": "77777777-7777-4777-8777-777777777777",
  "kind": "task",
  "lifecycle": "draft",
  "created": "2026-10-07",
  "updated": "2026-10-07T00:00:00Z",
  "module": "note://11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222",
  "work": {
    "scope": [
      {
        "repoId": "11111111-1111-4111-8111-111111111111",
        "paths": [
          "src/"
        ]
      }
    ],
    "acceptanceRefs": [
      {
        "uri": "note://11111111-1111-4111-8111-111111111111/55555555-5555-4555-8555-555555555555",
        "criterionId": "AC-1"
      }
    ],
    "verification": [
      {
        "id": "V-1",
        "kind": "command",
        "required": true,
        "repoId": "11111111-1111-4111-8111-111111111111",
        "cwd": ".",
        "program": "node",
        "args": [
          "--test"
        ]
      }
    ],
    "review": "independent"
  }
}
---

# Delivery task

## Scope

State the bounded deliverable and constraints.

## Acceptance criteria

Use work.acceptanceRefs for stable clauses.

## Verification

Run the declared checks and preserve their evidence.

## Progress

Distinguish verified completion from unverified reports.

## Evidence

Link exact source snapshots and formal results; never invent receipts.

## Handoff

Main Agent updates before every handoff: unresolved issues, next action, ownership and necessary references.
