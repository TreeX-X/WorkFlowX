---
{
  "schema": "harness-note/2",
  "id": "b20315aa-3881-4651-8052-f33a85215583",
  "kind": "module",
  "lifecycle": "accepted",
  "created": "2026-10-07",
  "updated": "2026-10-07T16:06:22.322Z",
  "moduleState": "partial",
  "parent": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/6be08bc0-2ac5-4638-8263-cf9883c7cdae"
}
---

# Harness documents and contracts

## Responsibility

Own the versioned Note format, module structure, maintenance rules and stable execution grounds. [The v2 standard](../../../standards/harness-note/2/standard.md) is the normative format; skills provide only the instructions needed for the current action.

## Design

Modules have one entry, complete overall explanations and independently maintained child/topic documents. Identity is a UUID plus repository identity. Maintenance updates UTC time, while task contracts exclude handoff progress and timestamps. Execution evidence remains explicit and versioned.

[Maintained-document decisions](maintained-documents.md) explain the trade-off; [requirements](requirements/maintained-notes.md) provide acceptance. [Wiki](wiki/module.md) defines shared discovery and source-backed reads.

## Downstream work

agentX must adopt the new parser, writer, index and execution contracts before JanusX enables module blueprint and Chat consumers. The format is defined; runtime adoption is pending.
