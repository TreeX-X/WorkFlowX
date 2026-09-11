---
name: orchestrateX
description: Lightweight routing and execution rules for xdo, xdel, and xflow.
---

# orchestrateX

<!-- Note: dispatch vocabulary cleanup — see .agents/notes/implemented/process/2026-09-11-workflow-redundancy-cleanup.md -->

## Routing

Read the complete request and active context before selecting a mode.

- Explicit `xdo`, `xdel`, `xflow`, or `xstatus` commands take precedence.
- Without an explicit mode, recommend `xflow` for high-impact, cross-module, or uncertain work; recommend `xdel` for clear local work with an existing or requested Hybrid Tree; otherwise recommend `xdo`.
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
- Hybrid Tree and harness are optional.
- Use `engineeringX` and perform self-review before reporting completion.
- Atomic landing: code + Note (new `implemented/` or in-place sync) + entry reverse comment land in one commit; message carries the Note path. Format-only/typo/unambiguous-rename/tag work is `not applicable`, code only. Supersession surgery goes to `xflow`, never `xdo`.
- Writing follows `proseX` (gate timing exempt, standard never exempt).

### xdel - delegate
- Purpose: a traceable single delegation with a Parent/Child record, without paying xflow planning and evaluation. For speed use `xdo`; for an independent quality gate use `xflow`.
- Use or create a Hybrid Tree Parent/Child.
- Dispatch coderX once for the assigned Child.
- coderX reads `engineeringX` and `specX`, then self-reviews.
- coderX returns a Note draft with the Change Summary (new `implemented/` or in-place sync of the owning Note).
- Note finalization is owned by the Main Agent close-out gate (mechanical checklist, then <=5-line semantic gaps, then user nod). coderX self-review never approves Notes.
- Do not trigger evaluatorX or an iteration loop. An independent review happens only on explicit user request, and then as a separate review task, not as an automatic loop.

### xflow - orchestrate
- Run module 08 repository discovery, then load and run `.codex/skills/socratesX/SKILL.md` for only the unresolved decisions in the current analysis phase. Ask those questions in one batch, offer options only for real trade-offs, and use one confirmed Ready Summary gate before creating or updating the Hybrid Tree.
- Execute Children in dependency order.
- Dispatch coderX once per Child with `engineeringX` and `specX`.
- Trigger evaluatorX after each Child.
- After evaluation, the Main Agent classifies findings:
  - local implementation defect: re-dispatch the same Child once with a minimal repair packet;
  - cross-Child integration issue: compress it into an integration note for the affected later Child;
  - architecture or scope issue: the Main Agent updates the plan or fixes it directly.
- A Child gets at most one automatic repair re-dispatch by default. Further repair requires a Main Agent decision.
- On `UNEVALUABLE` (no runnable test path): the Main Agent decides — narrow the scope, add the missing checks, or accept with an explicit recorded risk. Never silently retry or silently pass.
- On exhausted budget (unfixable failure, blown context), stop and hand to the user. Never silently retry a second time.
- Do not pass complete prior Child context to later Children; pass only relevant contracts, files, failures, and risks.
- Dispatch discipline: everything coderX relies on (AC, interface constraints, failure summaries) must already be written down in the Child/Payload. Spoken agreements never enter a dispatch. Missing grounds are the Main Agent's fault, not coderX's.

## Shared Rules

- `xdel` and `xflow` require Parent/Child paths; `xdo` does not.
- Decision keeping follows `noteX`; writing follows `proseX`.
- User instructions outrank skill guidance. On conflict, follow the user.
- When a skill makes you pause, ask for confirmation, leave work undone, or deviate from user intent, cite the exact SKILL.md file and the rule that caused it, explain how it applies, and separate what the skill states from what you inferred.
- Parent §5/§6 and Child §3 allow `.agents/notes` relative links plus a one-line summary, never inlined decision prose.
- `xdo` has no fixed Payload or iteration-count requirement.
- Main Agent owns routing, scheduling, document updates, and final verification.
- Use `modules/09-dispatch-adapter.md` for xdel/xflow handoffs.
- Use `modules/02-bus-payload.md` only for xdel/xflow contracts.
- Use `modules/08-requirements-discovery.md` only during xflow planning.
- Sync contract: the `.claude` and `.codex` copies of this skill carry identical logic; only skill paths (`.claude/...` vs `.codex/...`) differ. Keep them in sync on every change.

## Commands

| Command | Meaning |
|---|---|
| `xdo [--parallel] <requirement>` | Direct work; parallel only when explicitly requested |
| `xdel <requirement or Hybrid Tree>` | One-shot delegated work |
| `xflow [-box] <requirement>` | Full planning and evaluation |
