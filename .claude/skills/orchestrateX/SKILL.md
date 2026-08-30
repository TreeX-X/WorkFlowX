---
name: orchestrateX
description: Lightweight routing and execution rules for xdo, xdel, and xflow.
---

# orchestrateX

## Routing

Read the complete request and active context before selecting a mode.

- Explicit `xdo`, `xdel`, `xflow`, or `xstatus` commands take precedence.
- Without an explicit mode, recommend `xflow` for high-impact, cross-module, or uncertain work; recommend `xdel` for clear local work with an existing or requested Hybrid Tree; otherwise recommend `xdo`.
- When the mode is ambiguous, present the three choices instead of silently selecting one.
- Once a mode is active, keep subsequent messages in that mode until completion.
- Parallel development is never implicit; activate it only when the user explicitly requests parallel work.

## Modes

### xdo - direct
- Main Agent works directly using the requested skills.
- Do not dispatch by default.
- Parallel Agents are allowed only when the user explicitly requests parallel development.
- Hybrid Tree and harness are optional.
- Use `engineeringX` and perform self-review before reporting completion.

### xdel - delegate
- Use or create a Hybrid Tree Parent/Child.
- Dispatch coderX once for the assigned Child.
- coderX reads `engineeringX` and `specX`, then self-reviews.
- Do not trigger evaluatorX or an iteration loop.

### xflow - orchestrate
- Run module 08 repository discovery, then load and run `.claude/skills/socratesX/SKILL.md` for only the unresolved decisions in the current analysis phase. Ask those questions in one batch, offer options only for real trade-offs, and use one confirmed Ready Summary gate before creating or updating the Hybrid Tree.
- Execute Children in dependency order.
- Dispatch coderX once per Child with `engineeringX` and `specX`.
- Trigger evaluatorX after each Child.
- After evaluation, the Main Agent classifies findings:
  - local implementation defect: re-dispatch the same Child once with a minimal repair packet;
  - cross-Child integration issue: compress it into an integration note for the affected later Child;
  - architecture or scope issue: the Main Agent updates the plan or fixes it directly.
- A Child gets at most one automatic repair re-dispatch by default. Further repair requires a Main Agent decision.
- Do not pass complete prior Child context to later Children; pass only relevant contracts, files, failures, and risks.

## Shared Rules

- `xdel` and `xflow` require Parent/Child paths; `xdo` does not.
- `xdo` has no fixed Payload or iteration-count requirement.
- Main Agent owns routing, scheduling, document updates, and final verification.
- Use `modules/09-dispatch-adapter.md` for xdel/xflow handoffs.
- Use `modules/02-bus-payload.md` only for xdel/xflow contracts.
- Use `modules/08-requirements-discovery.md` only during xflow planning.

## Commands

| Command | Meaning |
|---|---|
| `xdo [--parallel] <requirement>` | Direct work; parallel only when explicitly requested |
| `xdel <requirement or Hybrid Tree>` | One-shot delegated work |
| `xflow [-box] <requirement>` | Full planning and evaluation |
