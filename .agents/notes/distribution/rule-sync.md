---
{
  "schema": "harness-note/2",
  "id": "7d3f9a21-4b6e-4c8a-9f1d-2e5a6b7c8d9e",
  "kind": "decision",
  "class": "process",
  "lifecycle": "implemented",
  "created": "2026-09-16",
  "tags": [
    "harness",
    "s7"
  ],
  "updated": "2026-10-07T16:12:56.085Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/7d9d87b8-8153-4b01-8c0b-fa52f50127cf",
  "extensions": {
    "migration": {
      "from": "harness-note/1",
      "revision": "abffe283d8de7f7772f8e66b31cb7c37a3b7f4e7",
      "path": ".agents/notes/2026-09-16-harness-s7-workflowx-rules--7d3f9a21.md",
      "sourceHash": "ac64e75f686f397ebf5885cd6c84eff5e7e4c3f70feff6880fe76c1ea82ecc6f",
      "gitBlobHash": "ac64e75f686f397ebf5885cd6c84eff5e7e4c3f70feff6880fe76c1ea82ecc6f"
    }
  }
}
---

# Managed rule synchronization

## Problem

Duplicated instructions and unguarded adopter updates can make hosts write incompatible Notes.

## Decision

The source repository owns managed skill trees and entry/agent blocks. Synchronization preserves local settings and unmarked content, checks normalized host parity, and refuses writes when the adopter profile does not match the source standard. WorkflowX upgrades first, then agentX and JanusX separately.

## Alternatives considered

Copying all host configuration is simpler but overwrites local choices. Keeping manual copies avoids tooling but permits equal-yet-stale files. Reusing the managed synchronizer with a pre-write profile guard preserves the existing boundary.

## Consequences

Source/profile drift is visible and idempotent synchronization is testable. Adopter upgrades require an explicit supported profile; source rule delivery alone does not establish runtime support.
