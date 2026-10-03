# Project and module declarations

<!-- Note: confirmed module declarations and conditional maintenance — see note://d2499d5b-4ceb-4d46-aa3b-18e5c9b86034/0700e5e2-50f4-4265-a2d8-59f5d52a8c5c -->

This opt-in authoring convention consumes the sealed harness-note/1 S1.2 fields. It introduces no kind, schema key or Task contract field. A module describes enduring system structure; decisions preserve reasons and Tasks preserve delivery contracts. Files remain flat in `.agents/notes/` with stable UUIDs and full Note URIs.

## Identification and lifecycle

Use `kind: initiative` with exactly one role tag: `architecture:project` for a project root or `architecture:module` for a module. Exact, case-sensitive tags determine the role, never filenames, titles or class. Both roles on one Note are ambiguous: show a diagnostic and exclude it from current structure. A role tag on another kind is also a diagnostic, not a module. Untagged initiatives retain their planning meaning.

The current structure contains accepted declarations only. Draft and proposed declarations describe planned structure and remain readable in all Notes. Rejected and archived declarations remain historical assets outside the current graph. `architecture:example` excludes a declaration from the current graph regardless of role or lifecycle. Invalid or duplicate identities remain diagnostics; a partial view must state its checkout coverage. Lifecycle describes the declaration, not completion of its related Tasks.

## Structure and connections

Each project is a root. Each module declares `parent` as the full URI of its project or containing module. Missing, unavailable, ambiguous, non-structural or cyclic parents produce visible diagnostics rather than guessed ownership. Keep the module visible as unresolved when a valid placement is unavailable. The current graph must not silently promote planned, historical or example parents into current components.

Use Goal for responsibilities and Scope for boundaries, constraints and non-goals. Keep the initiative Acceptance criteria section. Existing repositories and codeRefs locate owning code and important entrypoints; record only known values. Templates in `templates/` are parseable instructional examples: generate fresh UUIDs, replace sample identity and confirmed facts, and remove architecture:example only for a real declaration. Choose accepted only when the current facts are confirmed; otherwise retain proposed.

Use initiative `interfaces` for important provided and needed interfaces. Connect a needs entry only when its explicit provider URI resolves to one eligible declaration that provides the exact case-sensitive interface name. A missing provider remains dangling demand; matching names alone never establish ownership. Missing, ambiguous, excluded or incompatible providers remain visible diagnostics. A parent edge expresses containment; an interface edge expresses an explicit connection, not a claim about runtime call direction. Task depends-on and Markdown mentions never become runtime edges.

A module may use governed-by relations to applicable decisions. Retain each decision and Task as an independent asset with its original identity and contract. Derive related work and backlinks from explicit relations and references; path matches may aid search but must be labeled as matches rather than written as formal ownership. Do not reparent historical decisions or Tasks merely to arrange the graph. Decision acceptance alone does not establish implementation; update current module facts when the relevant change lands. Supersession follows noteX and keeps surviving reasons.

## Ownership and maintenance

Single-repository declarations may live beside code. Cross-repository projects and modules have one owning architect repository; implementation decisions and Tasks stay in their owning repositories. Cross-repository decisions may live with architecture. Link with full Note URIs and resolve explicit selected checkouts; do not duplicate declarations or infer checkouts from names.

Synchronize a declaration when work changes module existence, responsibility, public interfaces, explicit dependencies or recorded entrypoints. Read only boundaries relevant to the task. Internal bug fixes, tests and implementation refinements keep existing Note obligations without mandatory module updates. Hard interface constraints belong in existing task scope/acceptance and fixed references. No extra per-task module binding, approval phase, relation store or maintenance report is required.

Write only within authorized scope using existing transaction and expectedHash rules. If an owning repository is unavailable or unauthorized, record the concrete pending synchronization in existing results rather than copying the declaration or silently claiming completion. Generate graph layout, backlinks and related-work lists from sources; do not maintain coordinates, duplicate indexes or architecture JSON as another source of truth.
