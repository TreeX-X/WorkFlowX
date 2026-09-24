---
schema: harness-note/1
id: c61d7a4e-6f8b-4a2e-9d31-5c7e8b0f2a14
kind: decision
lifecycle: implemented
created: 2026-09-24
class: architecture
tags: [harness-note, index, blueprint]
relations:
  - type: related-to
    target: note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/7d3f9a21-4b6e-4c8a-9f1d-2e5a6b7c8d9e
---

# Note index is a rebuildable derived layer

## Problem

The harness-note format already provides stable identities, typed relations, acceptance references, repository code references, and task evidence. The current repository index resolves files and IDs and checks graph integrity, but list queries do not expose reverse links, relation semantics, code references, summaries, or body search. Treating this as complete would make a later blueprint depend on repeated full scans and lossy adapter logic. The standard also has legacy documents and a candidate profile, so a green standard-fixture check does not prove that the repository corpus or all hosts share one active format.

## Decision

The Note files remain the only shared source of truth. WorkFlowX continues to reject a committed central `INDEX.md` and does not add a second plan format. It defines a rebuildable derived index as an implementation capability: the index records URI, ID, title, kind, lifecycle, tags, parent, forward and reverse relations, code references, interfaces, section headings, a bounded excerpt, source path, content hash, and diagnostics. The index supports metadata filters, relation and backlink queries, code-reference queries, and full-text search through a local cache; cache loss triggers a deterministic rescan. The index never owns Note content, lifecycle transitions, execution state, or approval authority.

The index and blueprint adapter keep different responsibilities. The index preserves every declared relation and unresolved target. A blueprint renderer may choose a simpler visual style, but it does not replace `governed-by`, `derived-from`, `supersedes`, or `parent` with an untyped `related-to` edge. Legacy files are classified explicitly and either migrated or exposed as legacy diagnostics; they are never silently treated as absent. The S1.2 profile remains a candidate until WorkFlowX, janus-agentX, and JanusX agree on one version and digest.

## Alternatives considered

- Keep path and `byId` lookup only - strongest case is minimal code and no cache format, but blueprint and wiki consumers repeatedly rescan files and cannot answer backlinks or semantic relation queries; rejected for the target capability.
- Commit a shared `INDEX.md` - strongest case is easy inspection in Git, but concurrent agents would create merge conflicts and the index would become a second source of truth; rejected.
- Put summaries and search fields into every Note - strongest case is fast reads, but derived text would drift from the body and increase the sealed schema surface; rejected in favor of a rebuildable local index.
- Do nothing / reuse - keeps S1.1 compatibility pressure low, but leaves the current candidate mismatch and makes legacy omissions invisible; rejected because the blueprint migration depends on complete graph visibility.

## Consequences

The Note format stays small and portable, while local consumers gain the query surface required by blueprints and wiki search. Index invalidation is driven by file hash and watcher events, and a fresh checkout can reproduce the same index from committed files. The implementation must add fixtures for backlinks, relation preservation, body search, code references, stale cache rebuild, duplicate IDs, unresolved targets, and legacy classification. The migration and cross-host profile cutover remain separate tasks.
