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

The initiative follows the same five delivery boundaries as the downstream [JanusX implementation plan](note://972afef3-2fc7-49de-a3ee-7e041225d28c/e7c03317-8bb8-4d1d-a1b2-832be6c5a3c5):

1. **Profile and contract cutover.** Complete the [S1.2 adoption gate](../../standards/harness-note/1/release-matrix.md) before activating the new interface declarations. Corpus inventory may proceed while that gate is open. WorkFlowX rule delivery alone does not finalize S1.2 or complete the joint consumer cutover.
2. **Corpus inventory, shared reads, and a pilot.** First scan every `.agents/notes/**/*.md` and report valid, legacy, foreign, malformed, and conflicting-identity files, with unresolved references separately. Reuse agentX's existing URI lookup, metadata/body search, formal relations, and backlinks; complete Markdown references, metadata, parent traversal, raw-file source hashes, coverage, diagnostics, and profile-supported interfaces. Connect JanusX's note-provider to that read boundary. Migrate a small representative set covering hierarchy, dependency, decision, code references, and prose links. Account for every remaining file as a diagnostic or readable legacy asset; full migration is not a prerequisite for this delivery. Reuse the in-memory index and host cache, with deterministic rebuild and checkout-scoped invalidation.
3. **Wiki consumers.** After the shared reader and relevant prototype are ready, engineering wiki opens original Notes and knowledge wiki integrates source references into its existing write/review path. Both views preserve formal and reference edges, provenance, and resolution states. Cover one/two checkouts, missing and unavailable targets, changed hashes, legacy pages, duplicate identities, and code-example exclusions.
4. **JanusX composition.** Build the architect-workspace skeleton, per-workspace evidence projections, namespaced node IDs, cross-workspace relation resolution, interface matching, stale evidence, and scoped chat/wiki reads from the shared contract and validated pilot.
5. **Remaining corpus and maintenance closeout.** Use the working read views to migrate remaining legacy Notes in reviewable batches, preserving IDs, dates, titles, resolvable links, and surviving decisions. Record a reason for every asset retained as legacy. Coordinate with JanusX's existing maintenance delivery; preview and confirm old-asset archival before applying it. Each batch reconciles its before/after inventory, including unresolved references, so no asset disappears silently.

The data sequence is full inventory -> shared reads plus a pilot -> wiki integration -> remaining migration. Inventory may overlap version preparation; full corpus conversion never blocks index or wiki development. Execution and verification belong to the later scoped tasks, whose acceptance references retain the AC identifiers below.

Non-goals are a committed central index, a new Note kind for modules or wiki, copied engineering wiki bodies, a second plan file format, inferred dependencies from prose, automatic inference of interface names from arbitrary code, and cross-repository atomic Git transactions.

## Acceptance criteria

- [ ] AC-1: WorkFlowX, janus-agentX, and JanusX either pin one final standard version and digest or clearly remain read-only on a candidate; no writer accepts a mismatched profile.
- [ ] AC-2: Every existing Note is classified; every migrated legacy Note keeps its stable identity and all resolvable links; `check` reports no silent foreign or legacy omissions.
- [ ] AC-3: A fresh checkout rebuilds the same index from committed files, and the index answers metadata, backlink, relation-type, code-reference, and body-search queries with source hashes and diagnostics.
- [ ] AC-4: Blueprint golden fixtures preserve every declared relation type, parent edge, unresolved target, interface demand, and source hash without an untyped relation substitution.
- [ ] AC-5: JanusX can assemble one project view from an architect workspace and multiple evidence workspaces while showing missing or stale evidence without throwing.
- [ ] AC-6: Engineering wiki and blueprint open the same Note in the selected checkout; directories, typed relations, Markdown mentions, and derived backlinks preserve source identity and report coverage. Code examples and title guesses create no reference edges.
- [ ] AC-7: Knowledge wiki records the shared reader's raw-file SHA-256 for the exact source content used, retains fact references, and exposes derived reverse references. Storage and freshness checks use that same algorithm, including formatting and LF/CRLF changes. Missing, unavailable, ambiguous, changed, and unrecorded sources remain distinguishable; refreshing a page never silently updates its provenance.

## Alternatives considered

- Implement JanusX composition first - strongest case is visible product progress, but the adapter would freeze incomplete relation and index semantics; rejected because the consumer would hide upstream gaps.
- Migrate all Notes before completing shared reads - strongest case is a clean corpus, but migration needs diagnostics and queries to prove that no references were lost; use full inventory, shared reads with a small pilot, wiki integration, then remaining migration.
- Keep S1.1 indefinitely - strongest case is avoiding a three-repository cutover, but it leaves the agreed interface contract unavailable and keeps profile drift; rejected unless the S1.2 candidate fails its review.
- Do nothing / reuse - preserves current behavior, but legacy files remain invisible and blueprints cannot answer semantic graph queries; rejected.
