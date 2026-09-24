---
schema: harness-note/1
id: c61d7a4e-6f8b-4a2e-9d31-5c7e8b0f2a14
kind: decision
lifecycle: implemented
created: 2026-09-24
class: architecture
tags: [harness-note, index, wiki, blueprint]
relations:
  - type: related-to
    target: note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/7d3f9a21-4b6e-4c8a-9f1d-2e5a6b7c8d9e
---

# Note index is a rebuildable derived layer

## Problem

The harness-note format provides stable identities, typed relations, acceptance references, repository code references, and task evidence. Consumers need one interpretation of those sources to keep engineering wiki navigation, knowledge-page provenance, and blueprint edges consistent. Separate scans, copied page bodies, truncated identities, or inferred dependencies would produce conflicting views of the same Note. Existing index capabilities do not prove that every adapter preserves them, and a valid standard bundle does not prove that legacy files are visible or that all hosts share one active profile.

## Decision

Note files own engineering content. Engineering wiki and blueprints are views over the same source and derived index; knowledge wiki owns its explanatory pages and records the Note snapshots used to produce them. This decision defines the consumer contract. The Codex and Claude `noteX` skills carry its agent-facing rules; runtime implementation belongs to janus-agentX and JanusX. The implemented lifecycle records this WorkFlowX rule delivery, not downstream feature completion.

### Identity and common reads

Use the full `note://<repo-id>/<note-id>` for shared identity. A host separately selects a checkout for each repoId and scopes caches, navigation, and queries to that checkout. Multiple checkouts require an explicit selection; a title, slug, path, local workspace ID, or first matching repository must not decide the target. A path rename preserves identity.

The common read boundary provides the following data without prescribing a new transport or persisted index schema:

| Data | Consumer contract |
|---|---|
| Note metadata | Full URI, title, kind, lifecycle, class/tags, parent, repositories, codeRefs, and profile-supported interfaces; preserve execution separately when present |
| Source | Owning checkout, source path, reader-provided content hash, section headings, bounded excerpt, and original body on demand |
| Formal relations | Original type, direction, complete target URI, and attached criteria/scope/reason; preserve unresolved declarations |
| Derived references | Source URI, original Markdown destination, resolved target URI when known, optional section anchor, and resolution diagnostic |
| Query context | Searched checkouts, source revisions/hashes, diagnostics, and any paging or result limit; backlinks state their coverage |

Metadata, body search, code-reference lookup, one-hop relations, backlinks, and parent traversal reuse the existing index. The parent hierarchy supplies a directory without inventing folder Notes. When parent and a parent relation represent the same hierarchy edge, render one edge while retaining declaration provenance. Detect cycles and duplicate identities; never choose an arbitrary winner. Traversal is bounded and reports truncation.

### Formal relations and Markdown references

Preserve `parent / depends-on / implements / governed-by / derived-from / supersedes / related-to` and all relation metadata through every adapter. A shared line style does not change the relation type. Derive reverse lookups from source edges; never persist a second authoritative relation table. A body mention is a reference, not an engineering dependency.

Extract standard Markdown links, including inline, reference-style, and URI autolinks. Ignore fenced, indented, and inline code. Resolve Note URIs directly; resolve relative paths from the source file only against scanned Notes within the same checkout. A section fragment is a locator, not part of Note identity; a fragment-only link targets the source Note. Non-Note files and external URLs remain ordinary links. `[[wikilinks]]`, bare URI text, and guessed title matches do not create indexed edges. Unresolved declarations remain visible.

Collapse repeated mentions to the same source/target/anchor for display, preserving original destinations for diagnostics. A mention and a formal relation to the same Note remain distinguishable. A missing section is a locator diagnostic and does not erase a resolved Note.

### Knowledge wiki provenance

Engineering wiki opens the original Note; it does not create one WikiPage per Note. Knowledge wiki may add optional host-owned `sourceNoteRefs: [{ uri, sourceHash }]`, retaining its existing `sourceFactIds`. Each reference records a Note actually read when generating or reviewing the page; `sourceHash` is that reader's content hash, never a model-generated value or taskContractHash. The page keeps its existing workspace and identity, so source matching never merges pages by slug across workspaces. Note-to-wiki backlinks are derived from these references.

Deduplicate identical URI/hash pairs. Conflicting hashes for one URI require review: keep existing provenance and the conflict visible rather than silently selecting the latest hash. Only review or rewrite of all page content based on that Note, followed by the host's existing wiki approval, can replace its stored reference. Reading a newer Note or refreshing an index alone never updates provenance. Pages without recorded sources remain readable with unknown freshness. These fields and derived summaries/backlinks do not enter Note frontmatter or change task/receipt hash rules.

### Resolution and freshness

| Condition | Required result |
|---|---|
| One readable target in the selected checkout | Resolve the Note; compare hashes when a source snapshot is recorded |
| Repository unbound or unreadable, or scan incomplete | Unavailable or incomplete coverage; preserve the reference and do not infer deletion |
| Repository completely scanned but target absent | Missing target diagnostic |
| Duplicate target IDs or checkout selection ambiguous | Ambiguous target diagnostic; no guessed navigation or edge |
| Recorded source hash differs from the current content hash | Changed source; show current content without updating the saved hash |
| Page has no recorded source hash | Unknown freshness; never claim current |

Resolution and freshness are independent: an unavailable source has unknown current freshness, while the saved snapshot remains intact. Lifecycle, task execution, and source freshness never substitute for each other. A changed page source does not revoke a task receipt; existing receipt rules continue to decide evidence validity.

### Ownership and minimal implementation

harness-core owns parsing, validation, and hashing; harness-node owns file access and the rebuildable index. JanusX's note-provider supplies one engineering read boundary to wiki and blueprint consumers. Reuse existing in-memory indexes and host caches. Add persistence under `.agents/.local` only after measured need; never commit a cache, add a database by default, or create a second scanner in a view. File edits, moves, deletion, and branch switches invalidate affected checkout data; cache loss is recoverable from sources.

Every scanned Note file receives a classification: valid, legacy, foreign, malformed, or conflicting identity. Unresolved references are reported alongside their source. Inaccessible files remain diagnostics. An Agent without index tools uses bounded host search and original reads, names the searched scope, and does not claim complete reverse references. Writes retain the owning repository's approval and transaction rules.

This contract uses the existing five kinds and relation vocabulary. Profile-gated interface fields still require joint S1.2 adoption under the release matrix; wiki references do not activate a candidate, add core schema fields, or bypass a writer's profile checks.

### Consumer examples

These are required downstream behaviors, not claims that consumer implementations already pass:

| Input or event | Expected behavior |
|---|---|
| A standard Markdown link to a Note plus a declared governed-by relation | One mention and one typed relation; their backlinks retain the distinction |
| The same destination in a reference-style link and a fenced code example | Only the real link contributes a mention |
| A relative Note link with a section fragment | Resolve from the source path; retain full URI and separate locator |
| Two checkouts share repoId and Note ID | Read only the explicitly selected checkout and report that scope |
| A referenced repository is unavailable | Keep the reference with unavailable status; do not report a deleted Note |
| A reviewed knowledge page records hash A; current source is hash B | Mark changed source, preserve A, and require content review before replacing it |
| A legacy page has no sourceNoteRefs | Read the page with unknown freshness; invent no historical hashes |
| A parent cycle or duplicate ID occurs | Surface the diagnostic without selecting a fabricated hierarchy |

The [delivery initiative](./2026-09-24-note-corpus-index-blueprint-completion--f4b2c8d1.md) (note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/f4b2c8d1-9e07-4a63-b51c-2d8f6e0a7c39) tracks consumer adoption separately.

## Alternatives considered

- Keep path and `byId` lookup only - strongest case is minimal code and no cache format, but blueprint and wiki consumers repeatedly rescan files and cannot answer backlinks or semantic relation queries; rejected for the target capability.
- Commit a shared `INDEX.md` - strongest case is easy inspection in Git, but concurrent agents would create merge conflicts and the index would become a second source of truth; rejected.
- Put summaries and search fields into every Note - strongest case is fast reads, but derived text would drift from the body and increase the sealed schema surface; rejected in favor of a rebuildable local index.
- Copy every Note into knowledge wiki - strongest case is immediate reuse of page CRUD, but duplicated bodies, identities, and review state drift; direct engineering views and small source references preserve ownership.
- Infer dependencies from prose links or matching titles - strongest case is less authoring work, but mentions do not declare dependency and names collide across repositories; typed relations and visible unresolved references retain intent.
- Do nothing / reuse - keeps S1.1 compatibility pressure low, but leaves the current candidate mismatch and makes legacy omissions invisible; rejected because the blueprint migration depends on complete graph visibility.

## Consequences

The shared Note format stays small. Consumers bear the cost of Markdown-aware link extraction, scoped invalidation, and source review; the same work serves both wiki and blueprints. Reference lists cover only the selected readable checkouts. Knowledge pages can legitimately show unknown or changed sources until reviewed. Persistent caching or broader link syntax warrants reconsideration only when measured scan costs or concrete authoring needs justify it.

WorkFlowX checks its unchanged sealed bundle with `node scripts/verify-harness-standard.mjs` and both managed surfaces with `node scripts/sync-harness-rules.mjs --check --repos scripts/sync-repos.list`. Runtime examples, corpus migration, and cross-host profile cutover remain consumer work; those checks do not prove wiki functionality in JanusX.
