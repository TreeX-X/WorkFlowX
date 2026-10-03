---
name: orchestrateX
description: Lightweight routing and execution rules for xdo, xdel, xflow, and xarch.
---

# orchestrateX

<!-- Note: xdo mandatory archiving — see .agents/notes/2026-09-21-xdo-mandatory-note--e92790eb.md -->

## Routing

Read the complete request and active context before selecting a mode.

- Explicit `xdo`, `xdel`, `xflow`, `xarch`, or `xstatus` commands take precedence.
- Without an explicit mode, recommend `xflow` for high-impact, cross-module, or uncertain work; recommend `xdel` for clear local work with an existing or requested task note; otherwise recommend `xdo`.
- When the mode is ambiguous, present the three choices instead of silently selecting one.
- Once a mode is active, keep subsequent messages in that mode until completion.
- Parallel development is never implicit; activate it only when the user explicitly requests parallel work.
- Default to action: an explicit command, or "能不能 / 我想 / 帮我"-style intent ("can you...", "I want...", "help me..."), is an execution order. Do the work; never stop at "I can do that", a plan-only reply, or asking whether to continue. Mode-choice questions are exempt; once a mode is active, continuation questions are not asked. Never deliver a partial "good enough" result to save time or tokens.
- Approval is the last step, not the first: finish all authorized prep work until the result is concrete and reviewable, then ask once. Destructive or irreversible operations (publish, merge, deploy, external writes, data deletion) require user confirmation as the final step. Read-only work, reviews, reversible fixes, and anything already authorized need no further permission. Never add unrequested warnings, disclaimers, or approval checklists for hypothetical risks.

## Modes

### xdo - direct
- Main Agent works directly using the requested skills.
- Do not dispatch by default.
- Parallel Agents are allowed only when the user explicitly requests parallel development.
- Task notes are mandatory at landing: search existing Notes with host search (`rg` over titles, ids, code refs) first; update the owning Note in place when one fits, otherwise create a new Note directly in `.agents/notes/` with frontmatter lifecycle. No `not applicable` in `xdo`.
- Use `engineeringX` and perform self-review before reporting completion.
- Atomic landing: code + Note (new flat-layout Note when no owning Note fits, otherwise in-place sync) + entry reverse comment land in one commit; message carries the Note path. Even format-only/typo/unambiguous-rename/tag/small work lands a Note. Supersession surgery goes to `xflow`, never `xdo`.
- Writing follows `proseX` (gate timing exempt, standard never exempt).

### xarch - scaffold
- Main Agent scaffolds an architect workspace directly with deterministic steps; fail fast, never guess.
- Do not dispatch. No parallel Agents. No task note URI, no fixed Payload.
- Steps: git init (reuse an existing repo, stop on a dirty tree) -> write `.agents/harness.json` (schemaVersion 1 + fresh UUID repoId + frozen workflowx profile digest; verify-only if present) -> write flat `.agents/notes/` declarations (identified project tagged architecture:project + only confirmed modules tagged architecture:module, kind initiative, current pinned S1.2 profile, explicit module parent URI, no views/) -> CODEOWNERS (with `--with-codeowners`) + README -> register through the existing workspace.create chain -> verify the projection (projectView readable, invalid not increased).
- Use confirmed project identity and module boundaries from the active conversation; do not invent module splits, interface names or primary bindings. With no confirmed modules, create only the project. Optional instructional modules also carry architecture:example and stay out of the current graph. Existing user authorization applies; unresolved choices follow the existing changeset two-layer approval. After handoff, note edits go through harness transactions + expectedHash + approval.
- Templates follow the pinned S1.2 initiative shape (Goal, Scope, Acceptance criteria); omit unknown repositories/interfaces instead of placeholders. Registration must return a workspace identity; unavailable registration stays pending. Composition uses explicit repoId/checkoutId/path/selected records in .agents/.local/workspace-map.json; no checkout inference by name. Atomic landing; writing follows `proseX`.

### xdel - delegate
- Purpose: a traceable single delegation against one accepted task note, without paying xflow planning and evaluation. For speed use `xdo`; for an independent quality gate use `xflow`.
- Use the task note; create one (accepted, scoped, verifiable) when none fits.
- Dispatch coderX once for the assigned task.
- coderX reads `engineeringX` and `specX`, then self-reviews.
- coderX returns a Note draft with the Change Summary (new flat-layout Note or in-place sync of the owning Note).
- Note finalization is owned by the Main Agent close-out gate (mechanical checklist, then <=5-line semantic gaps, then user nod). coderX self-review never approves Notes.
- Do not trigger evaluatorX or an iteration loop. An independent review happens only on explicit user request, and then as a separate review task, not as an automatic loop.

### xflow - orchestrate
- Run module 08 repository discovery, then load and run `.codex/skills/socratesX/SKILL.md` for only the unresolved decisions in the current analysis phase. Ask those questions in one batch, offer options only for real trade-offs, and use one confirmed Ready Summary gate before creating or updating task notes.
- Execute tasks in dependency order.
- Dispatch coderX once per task with `engineeringX` and `specX`.
- Trigger evaluatorX after each task.
- After evaluation, the Main Agent classifies findings:
  - local implementation defect: re-dispatch the same task once with a minimal repair packet;
  - cross-task integration issue: compress it into an integration note for the affected later task;
  - architecture or scope issue: the Main Agent updates the task notes or fixes it directly.
- A task gets at most one automatic repair re-dispatch by default. Further repair requires a Main Agent decision.
- On `UNEVALUABLE` (no runnable test path): the Main Agent decides — narrow the scope, add the missing checks, or accept with an explicit recorded risk. Never silently retry or silently pass.
- On exhausted budget (unfixable failure, blown context), stop and hand to the user. Never silently retry a second time.
- Do not pass complete prior task context to later tasks; pass only relevant contracts, files, failures, and risks.
- Dispatch discipline: everything coderX relies on (AC, interface constraints, failure summaries) must already be written down in the task note and payload. Spoken agreements never enter a dispatch. Missing grounds are the Main Agent's fault, not coderX's.

## Shared Rules

- Module authoring follows `../noteX/module-structure.md`. In xdo/xdel/xflow, read only relevant declared boundaries. During existing impact analysis and self-review, synchronize declarations when module existence, responsibility, public interfaces, explicit dependencies or recorded entrypoints change. Internal changes need no module update; existing Note and atomic landing obligations still apply.
- Put hard interface constraints into existing task scope/acceptance and fixed source references; carry bounded module context in existing payload fields. Do not require a module binding on every Task, a new approval phase, a second relation store or a module maintenance report.
- A declaration has one owner. If its architect repository is unavailable or outside authorized scope, record concrete pending synchronization in the existing result/Task; do not copy the declaration or expand write scope. Authorized cross-repository changes use separate associated commits, never a claimed cross-repository atomic commit.

- `xdel` and `xflow` require a task note URI upfront; `xdo` does not require one upfront but must produce one at landing (in-place sync preferred, new flat-layout Note otherwise).
- Decision keeping follows `noteX`; writing follows `proseX`.
- User instructions outrank skill guidance. On conflict, follow the user.
- When a skill makes you pause, ask for confirmation, leave work undone, or deviate from user intent, cite the exact SKILL.md file and the rule that caused it, explain how it applies, and separate what the skill states from what you inferred.
- Task notes carry scope, acceptance, and verification in one file; related notes link by URI plus a one-line summary, never inlined prose.
- `xdo` has no fixed Payload or iteration-count requirement.
- Main Agent owns routing, scheduling, document updates, and final verification.
- Optional tooling (note checker, desktop canvas, built-in engine) never gates base work: a missing tool means the document flow, not an install nag. A failed machine check never becomes a pass by downgrade.
- Use `modules/09-dispatch-adapter.md` for xdel/xflow handoffs.
- Use `modules/02-bus-payload.md` only for xdel/xflow contracts.
- Use `modules/08-requirements-discovery.md` only during xflow planning.
- Sync contract: the `.claude` and `.codex` copies of this skill carry identical logic; only skill paths (`.claude/...` vs `.codex/...`) differ. Keep them in sync on every change.

## Commands

| Command | Meaning |
|---|---|
| `xdo [--parallel] <requirement>` | Direct work; parallel only when explicitly requested |
| `xdel <requirement or task note>` | One-shot delegated work |
| `xflow [-box] <requirement>` | Full planning and evaluation |
| `xarch <dir> [--name <name>] [--with-codeowners]` | Scaffold architect workspace; deterministic, no dispatch, no task note |
