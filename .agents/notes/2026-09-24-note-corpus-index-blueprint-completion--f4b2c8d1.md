---
schema: harness-note/1
id: f4b2c8d1-9e07-4a63-b51c-2d8f6e0a7c39
kind: initiative
lifecycle: proposed
created: 2026-09-24
class: architecture
tags: [harness-note, migration, index, blueprint]
relations:
  - type: governed-by
    target: note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/c61d7a4e-6f8b-4a2e-9d31-5c7e8b0f2a14
---

# WorkFlowX Note corpus, index, and blueprint readiness

## Goal

Make the WorkFlowX Note mechanism a reliable source for complex plans and a complete input for later blueprint parsing. The work finishes the shared standard boundary first, brings old documents into an explicit namespace or the current schema, adds a rebuildable semantic index, and only then enables cross-workspace blueprint assembly. The shared Note schema remains small; derived capabilities live in the host index and adapter layers.

## Scope

The baseline inventory on 2026-09-24 finds 181 Note files in JanusX: 57 current-schema files and 124 legacy-format files, with the remainder requiring explicit classification. WorkFlowX also retains legacy-format history. The inventory phase records the exact repository counts before any rewrite and stores the report outside the Note source of truth.

Migration rules are deterministic: the legacy title becomes the single H1, `Status` maps to the closest allowed lifecycle with an explicit diagnostic when no mapping is safe, stable acceptance checkboxes retain their `AC-n` identifiers, recognized file and symbol references become `codeRefs`, and legacy cross-links become URI relations only after target resolution. A legacy document with no reliable kind or target remains a classified legacy diagnostic until a human chooses `idea`, `decision`, or another current kind. The migration never invents execution receipts or claims that an old status proves task completion.

The initiative has five ordered phases:

1. **Profile and contract cutover.** Decide whether S1.2 becomes final. If it does, update the three repositories' profile version, manifest digest, parser behavior, fixtures, and release matrix in one recorded compatibility window. Keep the current candidate read-only until the joint pin is green.
2. **Corpus inventory and migration.** Scan every `.agents/notes/**/*.md`, classify current-schema, legacy, foreign, malformed, duplicate-ID, and unresolved-reference files, and emit a report before rewriting anything. Migrate legacy Notes in batches while preserving stable IDs, dates, titles, relative links, and surviving decisions. Convert obsolete process plans into `idea`, `initiative`, `requirement`, `decision`, or `task`; do not create a second `plans` store. Require zero silent exclusions after migration.
3. **Derived index v1.** Extend the existing scan/index path with URI and ID lookup, metadata filters, forward and reverse relations, parent traversal, `codeRefs`, initiative interfaces, bounded excerpts, full-text search, source hashes, and diagnostics. Store the cache under `.agents/.local`; never commit it or treat it as authority. Add incremental invalidation only after deterministic full rebuilds are covered by fixtures.
4. **Blueprint adapter contract.** Preserve all relation types and unresolved states through the adapter. Keep rendering simplifications in the UI layer. Add golden fixtures for one workspace, two workspaces, missing targets, stale hashes, legacy diagnostics, and interface demands. Unknown core schema values remain diagnostics unless a future standard explicitly adds them.
5. **JanusX composition.** After the first four phases pass, implement the architect-workspace skeleton, per-workspace evidence projections, namespaced node IDs, cross-workspace relation resolution, stale evidence, and scoped chat/wiki reads. This phase consumes WorkFlowX contracts and does not redefine them.

Non-goals are a committed central index, a new Note kind for modules, a second plan file format, automatic inference of interface names from arbitrary code, and cross-repository atomic Git transactions.

## Acceptance criteria

- [ ] AC-1: WorkFlowX, janus-agentX, and JanusX either pin one final standard version and digest or clearly remain read-only on a candidate; no writer accepts a mismatched profile.
- [ ] AC-2: Every existing Note is classified; every migrated legacy Note keeps its stable identity and all resolvable links; `check` reports no silent foreign or legacy omissions.
- [ ] AC-3: A fresh checkout rebuilds the same index from committed files, and the index answers metadata, backlink, relation-type, code-reference, and body-search queries with source hashes and diagnostics.
- [ ] AC-4: Blueprint golden fixtures preserve every declared relation type, parent edge, unresolved target, interface demand, and source hash without an untyped relation substitution.
- [ ] AC-5: JanusX can assemble one project view from an architect workspace and multiple evidence workspaces while showing missing or stale evidence without throwing.

## Alternatives considered

- Implement JanusX composition first - strongest case is visible product progress, but the adapter would freeze incomplete relation and index semantics; rejected because the consumer would hide upstream gaps.
- Migrate all Notes before defining the index - strongest case is a clean corpus, but migration needs diagnostics and queries to prove that no references were lost; rejected in favor of inventory, then migration, then index completion.
- Keep S1.1 indefinitely - strongest case is avoiding a three-repository cutover, but it leaves the agreed interface contract unavailable and keeps profile drift; rejected unless the S1.2 candidate fails its review.
- Do nothing / reuse - preserves current behavior, but legacy files remain invisible and blueprints cannot answer semantic graph queries; rejected.
