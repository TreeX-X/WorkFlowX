---
{
  "schema": "harness-note/2",
  "id": "3240a01d-34e0-4a7e-8682-7213200fd5e2",
  "kind": "decision",
  "created": "2026-09-17",
  "updated": "2026-10-07T16:12:56.085Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/7d9d87b8-8153-4b01-8c0b-fa52f50127cf",
  "extensions": {
    "migration": {
      "from": "legacy",
      "revision": "abffe283d8de7f7772f8e66b31cb7c37a3b7f4e7",
      "path": ".agents/notes/implemented/process/2026-09-17-harness-repo-identity-s7.md",
      "sourceHash": "c719a415dd9a6c249c7a1baaf400fb238c184b096eb4df6094602d203004126a",
      "gitBlobHash": "c719a415dd9a6c249c7a1baaf400fb238c184b096eb4df6094602d203004126a"
    }
  },
  "lifecycle": "implemented"
}
---

# Repository identity

## Problem

Paths and repository names change; using them as identity breaks cross-repository Note references.

## Decision

.agents/harness.json records a stable repository UUID and an explicit standard version/digest. Clones retain identity; a distinct fork joining the same graph needs its own identity. The current repository adopts v2 while downstream repositories keep their existing pins until supported cutover.

## Alternatives considered

Path-derived IDs avoid metadata but change on moves. A shared ID across repositories collapses independent assets. A stored UUID provides stable references with explicit ownership.

## Consequences

Profile changes are deliberate and verified. A source profile does not prove an installed reader supports it. See [adoption rules](../../../standards/harness-note/2/migration.md).
