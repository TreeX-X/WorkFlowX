---
{
  "schema": "harness-note/2",
  "id": "0700e5e2-50f4-4265-a2d8-59f5d52a8c5c",
  "kind": "decision",
  "lifecycle": "implemented",
  "created": "2026-09-25",
  "class": "process",
  "tags": [
    "xarch",
    "orchestrateX"
  ],
  "updated": "2026-10-08T12:05:33Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/4d4ff96e-89a1-4efc-839e-c9333eba0bc5",
  "extensions": {
    "migration": {
      "from": "harness-note/1",
      "revision": "abffe283d8de7f7772f8e66b31cb7c37a3b7f4e7",
      "path": ".agents/notes/2026-09-25-xarch-command--0700e5e2.md",
      "sourceHash": "2b00d4640b7bad3f61fd4626b20082169286047f2371a05262c04d85e0302dab",
      "gitBlobHash": "2b00d4640b7bad3f61fd4626b20082169286047f2371a05262c04d85e0302dab"
    }
  }
}
---

# Module workspace scaffold

## Problem

A scaffold must produce identifiable module structure without guessing repository bindings or treating planned work as implemented.

## Decision

Main Agent uses xarch to create a project module.md and only confirmed or explicitly planned modules, each with one entry. Existing repository identity is preserved. Module state, known interfaces and explicit checkout selection describe the structure. Optional host registration and projection checks report unavailable capabilities rather than claiming success.

Architect work manages cross-module responsibilities and collaboration through existing Notes, within one repository or across repositories. Shared requirements and decisions have one owning common module; affected modules reference the same source. Local implementation and Tasks remain with their owners, with no required parent Task or duplicated progress. A separate architect repository is optional. A pure-Note plan remains readable before code or repository bindings exist; project role denotes a root rather than an exclusive architect type. Blueprint verification covers ownership versus association, typed links and cross-module navigation.

## Alternatives considered

Free-form scaffolding has little setup but can omit identity. Full task dispatch adds a delivery contract to a simple initialization. Direct deterministic setup reuses the normal module templates with no Task.

## Consequences

The generated corpus follows the same structure used during later maintenance. Host registration remains a separate capability check. See [scaffold instructions](../../../.codex/skills/orchestrateX/modules/03-scaffold.md).
