---
name: noteX
description: Repository-level decision assets for AI agents. Use when making a non-trivial change, technical selection, structural refactor, bug postmortem, or simplification worth revisiting.
---

# noteX

<!-- Note: wiki and blueprint share Note identity and derived references — see .agents/notes/2026-09-24-note-index-derived-layer--c61d7a4e.md -->

Task notes plan and track the work. Decision notes keep the reasoning. Write the `why` and the `why-not` into the repo, in the same commit as the code, for the next agent that touches it.

Normative source is `standards/harness-note/1/` (schema, five kind templates, valid/invalid fixtures). This skill summarizes; the standard decides on conflict. Check the bundle with `node scripts/verify-harness-standard.mjs`; check dual-surface parity with `node scripts/sync-harness-rules.mjs --check --repos scripts/sync-repos.list`.

Writing follows `proseX`. Prose quality is a human nod; structure below is checkable.

## 1. One asset, five kinds

`.agents/notes/**/*.md`, one note per file. Identity is the frontmatter `id` (UUID), addressed as `note://<repo-id>/<note-id>`. Paths, titles, and states may move; identity never does.

- `idea`: hunches, questions, raw intent. Drafts stay light with unknowns explicit. Replaces the old Proposal Pool: park directions here, never in a second pool format.
- `initiative`: product direction spanning repos, only when aggregation earns it.
- `requirement`: needed behavior with stable `AC-n` acceptance clauses.
- `decision`: trade-offs with options, cost, and revisit signals. Adoption and landing stay separate states.
- `task`: bounded delivery with scope, acceptance refs, verification, dependencies, and the single `execution` state. No separate plan files exist.

`class` (feature/bug-fix/architecture/process/testing/simplification) names the engineering area and never substitutes for kind. Locate source files with host search; consumers may build a disposable index from them. Never commit a central `INDEX.md` or maintain a second relation store. Pre-S7 lifecycle-folder files still on disk are legacy: readable, never extended; new notes use flat layout with frontmatter lifecycle.

## 2. File shape

Frontmatter carries `schema: harness-note/1`, `id`, `kind`, `lifecycle`, `created`, plus kind-appropriate relations, scope, and execution fields per the standard. The body carries exactly one H1 title and the kind's English section names from `standards/harness-note/1/templates/`. Unknown top-level keys are preserved verbatim and reported, never executed.

## 3. When to write, update, or delete

- If half a year from now someone asks "why not the simpler way", write.
- Rename/move/default-value change on guarded code -> update the owning Note in place (facts, not a changelog appendix). 80% of maintenance is in-place sync, not new files.
- New direction -> `idea`/`requirement`/`decision` draft first, then land with the code in one commit, plus one reverse comment at the code entry.
- Execution state lives only in task notes. Outside `xdo`, small reversible changes with no lasting trade-off may land without a task note; lasting trade-offs, architecture choices, and non-obvious behavior always get one.
- Declined in review -> `rejected` with a reason, or delete. Fully superseded -> the new Note absorbs surviving reasons and links both ways; partial overlap keeps both alive and linked.
- Exempt (`not applicable`, no Note) applies outside `xdo` only: pure formatting, unambiguous renames, typos, release tags, behavior-preserving dependency patches.
- `xdo` mandatory archiving: every `xdo` lands a Note — search existing Notes first (`rg` over titles, ids, code refs); update the owning Note in place when one fits, otherwise create a new `implemented/` Note. No `not applicable` in `xdo`.
- When unsure whether to write, write.

## 4. Binding and linking

- Each `implemented/` decision leaves one reverse comment at the core entry (public interface, type definition, module top, state-machine entry): `// Note: <reason> — see .agents/notes/...`. Never per-line.
- Link related Notes with standard Markdown links and a one-line summary, never inlined prose. Use Note URIs across repositories; same-checkout relative links are allowed. Bare URI text does not create an indexed reference. Provenance lives in the atomic commit.
- Same-commit rule: code + Note + entry comment land together. Commit message carries the Note path.

## 5. Mechanical checklist (the verify script checks by hand until it lands, then it checks)

- Frontmatter schema/kind/lifecycle closed sets, single H1, required kind sections present.
- `Alternatives considered` present with an explicit do-nothing/reuse option.
- Stable `AC-n` ids, never renumbered; task refs point at note URI + AC id, never copied prose.
- No second plan store (no Parent/Child files, no plans directory, no plan URIs).
- Relative Markdown links resolve; `implemented/` bodies carry no dispatch identifiers or PR-process nouns.

## 6. Wiki and blueprint reads

Engineering wiki and blueprint views read the same Note source and derived index. Use the complete `note://<repo-id>/<note-id>` plus the host's selected checkout; paths, titles, slugs, and local workspace IDs never replace Note identity. Resolve a linked Note before relying on its content. With no index tool, use bounded host search and read the original files; report the searched scope and unresolved references. Never invent a wiki service or claim an exhaustive backlink list from a partial search.

- Keep all declared relation types, directions, and metadata. Derive backlinks; never write reverse edges or turn a prose mention into `depends-on`. Parent hierarchy supplies the directory, while missing parents and cycles remain visible diagnostics.
- Write standard Markdown links (inline or reference style). Use stable Note URIs across repositories; resolve relative links against the source file within its known checkout. Ignore code examples when deriving mentions. Do not infer targets from titles or `[[wikilinks]]`.
- When supported by its schema and tools, knowledge wiki may store host-owned `sourceNoteRefs: [{ uri, sourceHash }]` for Notes actually read. Set `sourceHash` to the `sha256` returned by the shared `readNoteFile` call for that content: SHA-256 of the complete raw file bytes, lowercase hexadecimal, with no text normalization. Compare current sources using the same algorithm; formatting and LF/CRLF changes also mark a source changed. Preserve existing fact references and derive Note-to-wiki backlinks. These fields, summaries, and backlinks never become Note frontmatter. Engineering wiki reads Notes directly, without copying each Note into a wiki page.
- Report unavailable repositories, missing or ambiguous targets, and changed source content separately. Missing source hashes mean freshness is unknown. Lifecycle, task execution, and source freshness have different meanings.
- Update a stored source hash only after reviewing or rewriting all page content based on that Note and passing the host's existing wiki review. A read or refresh alone never marks old content current. Conflicting hashes for one URI require review; preserve existing provenance. All writes follow the owning repository's existing approval and transaction rules.

Reuse the current in-memory index and host cache. Rebuild or invalidate on source changes; add local persistence only when measured need justifies it. Search and backlinks state checkout coverage. Legacy, malformed, duplicate, and unresolved assets remain visible; a consumer without a capability reports the gap instead of silently omitting files.
