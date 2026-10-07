---
{
  "schema": "harness-note/2",
  "id": "f4b2c8d1-9e07-4a63-b51c-2d8f6e0a7c39",
  "kind": "requirement",
  "lifecycle": "accepted",
  "created": "2026-09-24",
  "class": "architecture",
  "tags": [
    "harness-note",
    "migration",
    "index",
    "wiki",
    "blueprint"
  ],
  "relations": [
    {
      "type": "governed-by",
      "target": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/c61d7a4e-6f8b-4a2e-9d31-5c7e8b0f2a14"
    }
  ],
  "updated": "2026-10-07T16:12:56.085Z",
  "module": "note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/b20315aa-3881-4651-8052-f33a85215583",
  "extensions": {
    "migration": {
      "from": "harness-note/1",
      "revision": "abffe283d8de7f7772f8e66b31cb7c37a3b7f4e7",
      "path": ".agents/notes/2026-09-24-note-corpus-index-blueprint-completion--f4b2c8d1.md",
      "sourceHash": "4c38b6a870aa655788ce8fa68e12411ac3b022e18a159d71ee0b3ee3c0137471",
      "gitBlobHash": "4c38b6a870aa655788ce8fa68e12411ac3b022e18a159d71ee0b3ee3c0137471"
    }
  }
}
---

# Corpus and consumer readiness

## Expected behavior

The three repositories adopt the maintained-document format in order: WorkflowX, agentX, JanusX. Migrate each owned old corpus before its final parsing and consumer validation. Preserve identity, explicit references and evidence; do not infer downstream completion from source rule delivery. These inherited acceptance IDs remain stable; the current v2 requirements refine the format.

## Acceptance criteria

- [ ] AC-1: WorkFlowX, janus-agentX, and JanusX either pin one final standard version and digest or clearly remain read-only on a candidate; no writer accepts a mismatched profile.
- [ ] AC-2: Every existing Note is classified; every migrated legacy Note keeps its stable identity and all resolvable links; `check` reports no silent foreign or legacy omissions.
- [ ] AC-3: A fresh checkout rebuilds the same index from committed files, and the index answers metadata, backlink, relation-type, code-reference, and body-search queries with source hashes and diagnostics.
- [ ] AC-4: Blueprint golden fixtures preserve every declared relation type, parent edge, unresolved target, interface demand, and source hash without an untyped relation substitution.
- [ ] AC-5: JanusX can assemble one project view from an architect workspace and multiple evidence workspaces while showing missing or stale evidence without throwing.
- [ ] AC-6: Engineering wiki and blueprint open the same Note in the selected checkout; directories, typed relations, Markdown mentions, and derived backlinks preserve source identity and report coverage. Code examples and title guesses create no reference edges.
- [ ] AC-7: Knowledge wiki records the shared reader's raw-file SHA-256 for the exact source content used, retains fact references, and exposes derived reverse references. Storage and freshness checks use that same algorithm, including formatting and LF/CRLF changes. Missing, unavailable, ambiguous, changed, and unrecorded sources remain distinguishable; refreshing a page never silently updates its provenance.
