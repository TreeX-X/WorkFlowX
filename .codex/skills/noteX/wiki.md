# Shared wiki reads

WorkflowX defines the read contract; agentX owns the common reader/index and JanusX consumes it. Engineering wiki opens original Notes. The derived index supplies module navigation, metadata/body/code-reference search, typed relations, Markdown references and scoped backlinks. It is rebuildable, never another authored source.

Use full Note URIs with explicitly selected repository checkouts. Read module entry first, then necessary parent context and related topics. Query results carry source paths, raw-file SHA-256, coverage, limits and diagnostics. Read the actual target before relying on it. Missing, unavailable, ambiguous and stale sources are distinct.

Keep relation direction and metadata. Derive backlinks; a prose mention is not a dependency. Resolve standard Markdown links and anchors; ignore code examples and guessed titles. Module hierarchy comes from entry declarations checked against directories. Report cycles, duplicate identities and unsupported versions instead of hiding them.

Writes, moves, deletions and checkout changes invalidate affected index data. A missing service falls back to bounded host search; state coverage and unresolved refs. No desktop session is required to read the repository.

Knowledge pages may record `sourceNoteRefs: [{uri, sourceHash}]` for exact raw bytes actually read. Refreshing an index does not revalidate a page or replace its saved provenance; review affected content first. Timestamps, raw-source freshness, task contracts and receipt validity are different signals. Detailed consumer fixtures and hashing rules live in the pinned standard.
