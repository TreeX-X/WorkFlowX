---
schema: harness-note/1
id: f4b2c8d1-9e07-4a63-b51c-2d8f6e0a7c39
kind: initiative
lifecycle: proposed
created: 2026-09-24
class: architecture
tags: [harness-note, migration, index, wiki, blueprint]
relations:
  - type: governed-by
    target: note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/c61d7a4e-6f8b-4a2e-9d31-5c7e8b0f2a14
---

# WorkFlowX Note corpus, wiki, and blueprint readiness

## Goal

Make the WorkFlowX Note mechanism a reliable source for complex plans, engineering wiki navigation, knowledge-page provenance, and blueprint assembly. The work aligns the shared standard boundary, classifies old documents, completes the existing derived index, and connects consumers through one read contract. The shared Note schema remains small; derived capabilities live in the host index and adapter layers.

## Scope

The earlier inventory recorded 181 Note files in JanusX. Schema-header counts do not establish validity, and subsequent edits change category totals. WorkFlowX also retains legacy-format history. The inventory phase records current, non-overlapping file classifications before any rewrite and stores its derived report outside the Note source of truth.

Migration rules are deterministic: the legacy title becomes the single H1, `Status` maps to an allowed lifecycle only when its meaning is unambiguous, stable acceptance checkboxes retain their `AC-n` identifiers, and recognized file and symbol references become `codeRefs`. Legacy links become formal URI relations only when both target and declared relation semantics are known; ordinary prose links remain derived references. A document with uncertain kind, lifecycle, or target keeps its original text and an explicit diagnostic until resolved. The migration never invents execution receipts or claims that an old status proves task completion.

WorkFlowX delivers the [shared wiki and index contract](./2026-09-24-note-index-derived-layer--c61d7a4e.md) (note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/c61d7a4e-6f8b-4a2e-9d31-5c7e8b0f2a14) through its Codex and Claude noteX rules. This covers identity, typed relations, Markdown mentions, scoped backlinks, and knowledge-wiki source review. It does not mark the following consumer acceptance criteria complete. The S1.2 release decision, agentX index/reader work, and JanusX wiki/blueprint integration retain separate delivery boundaries.

The initiative has five ordered phases:

1. **Profile and contract cutover.** Decide whether S1.2 becomes final. If it does, update the three repositories' profile version, manifest digest, parser behavior, fixtures, and release matrix in one recorded compatibility window. Keep the current candidate read-only until the joint pin is green.
2. **Corpus inventory and migration.** Scan every `.agents/notes/**/*.md`, classify valid, legacy, foreign, malformed, and conflicting-identity files, and report unresolved references separately before rewriting anything. Migrate legacy Notes in batches while preserving stable IDs, dates, titles, relative links, and surviving decisions. Convert obsolete process plans into `idea`, `initiative`, `requirement`, `decision`, or `task`; do not create a second `plans` store. Require zero silent exclusions after migration.
3. **Shared derived reads.** Reuse agentX's existing URI lookup, metadata/body search, forward relations, and backlinks. Fill gaps in complete metadata, Markdown references, parent traversal, source hashes, coverage, diagnostics, and profile-supported interfaces. Start with the current in-memory index and host cache; persistent `.agents/.local` storage needs measured justification. Cover deterministic rebuild and checkout-scoped invalidation without adding a second scanner.
4. **Wiki and blueprint consumers.** Pass the shared read contract through JanusX's note-provider. Engineering wiki reads original Notes; knowledge wiki integrates the contract's source references into its existing write/review path. Preserve formal and reference edges, provenance, and resolution states through both views. After the relevant prototype is reviewed, cover one/two checkouts, missing and unavailable targets, changed hashes, legacy pages, duplicate identities, and code-example exclusions.
5. **JanusX composition.** After the earlier dependencies pass, implement the architect-workspace skeleton, per-workspace evidence projections, namespaced node IDs, cross-workspace relation resolution, interface matching, stale evidence, and scoped chat/wiki reads. This phase consumes WorkFlowX contracts and does not redefine them.

Non-goals are a committed central index, a new Note kind for modules or wiki, copied engineering wiki bodies, a second plan file format, inferred dependencies from prose, automatic inference of interface names from arbitrary code, and cross-repository atomic Git transactions.

## Acceptance criteria

- [ ] AC-1: WorkFlowX, janus-agentX, and JanusX either pin one final standard version and digest or clearly remain read-only on a candidate; no writer accepts a mismatched profile.
- [ ] AC-2: Every existing Note is classified; every migrated legacy Note keeps its stable identity and all resolvable links; `check` reports no silent foreign or legacy omissions.
- [ ] AC-3: A fresh checkout rebuilds the same index from committed files, and the index answers metadata, backlink, relation-type, code-reference, and body-search queries with source hashes and diagnostics.
- [ ] AC-4: Blueprint golden fixtures preserve every declared relation type, parent edge, unresolved target, interface demand, and source hash without an untyped relation substitution.
- [ ] AC-5: JanusX can assemble one project view from an architect workspace and multiple evidence workspaces while showing missing or stale evidence without throwing.
- [ ] AC-6: Engineering wiki and blueprint open the same Note in the selected checkout; directories, typed relations, Markdown mentions, and derived backlinks preserve source identity and report coverage. Code examples and title guesses create no reference edges.
- [ ] AC-7: Knowledge wiki records actual Note source hashes, retains fact references, and exposes derived reverse references. Missing, unavailable, ambiguous, changed, and unrecorded sources remain distinguishable; refreshing a page never silently updates its provenance.

## Alternatives considered

- Implement JanusX composition first - strongest case is visible product progress, but the adapter would freeze incomplete relation and index semantics; rejected because the consumer would hide upstream gaps.
- Migrate all Notes before defining the index - strongest case is a clean corpus, but migration needs diagnostics and queries to prove that no references were lost; rejected in favor of inventory, then migration, then index completion.
- Keep S1.1 indefinitely - strongest case is avoiding a three-repository cutover, but it leaves the agreed interface contract unavailable and keeps profile drift; rejected unless the S1.2 candidate fails its review.
- Do nothing / reuse - preserves current behavior, but legacy files remain invisible and blueprints cannot answer semantic graph queries; rejected.
