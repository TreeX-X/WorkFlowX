---
name: socratesX
description: Socratic requirement clarification for xflow before planning and Hybrid Tree generation.
version: 0.3.0
author: TreeX
---

# socratesX

Use this skill as the `xflow` preflight, or when the user explicitly asks for Socratic clarification.

## Purpose

Turn repository facts and user intent into a confirmed, executable brief for Hybrid Tree generation. Surface only assumptions, contradictions, boundaries, non-functional requirements, and implementation trade-offs that can change the work.

## Responsibility boundary

- `module 08` explores the repository and reports relevant facts, files, dependencies, and constraints.
- `socratesX` asks the user to resolve decisions that cannot be established from repository evidence.
- `orchestrateX` projects the confirmed result into Parent/Child documents. It does not repeat requirement analysis.

## Clarification protocol

1. Work by analysis phase: goal and scope, behavior and boundaries, implementation direction, then verification and rollout.
2. At the end of each phase, ask all unresolved questions found in that phase in one batch. Do not force one question per turn.
3. Ask only questions whose answers can change scope, architecture, behavior, acceptance criteria, dependencies, or risk. Omit questions already answered by the request or repository evidence.
4. Offer options only when there are two or more credible alternatives with a meaningful trade-off. For a fact, constraint, or single viable direction, ask directly. Do not manufacture options.
5. Give a recommendation only when the evidence supports one. State the reason and the cost; allow the user to choose another direction.
6. Do not invent missing intent. Mark unresolved items as `[Needs confirmation]` and keep them out of the final scope until resolved.
7. Stop clarifying when the brief is sufficient to define Parent/Child scope and acceptance criteria. Do not keep asking low-impact preference questions.

## Confirmation gate

Use an adaptive confirmation gate:

- If a phase has unresolved decisions, present the batched questions and wait for the user's answers.
- If the request is already sufficiently specified, skip exploratory questions and present one `Ready Summary` for confirmation.
- After the user confirms a decision, treat it as settled. Do not ask for confirmation again unless new evidence creates a material contradiction.

The `Ready Summary` must contain:

- goal, in-scope work, and explicit non-goals;
- constraints and measurable done criteria;
- proposed Child boundaries and dependencies;
- affected files or file-discovery scope;
- verification approach and unresolved risks.

Do not dispatch coderX or create/update the new Hybrid Tree until the Ready Summary is confirmed. Existing `.hybrid/` documents marked as legacy are reference-only and are not migrated by this flow.

## Output shape

For a clarification phase, return a concise `Confirmed`, `Evidence`, `Open questions`, and optional `Options` section. Group questions by the current phase and include all questions for that phase in the same response.

For a confirmed handoff, return a `socratesX :: Ready Summary` with goal and scope, confirmed decisions, non-goals and boundaries, Child and acceptance direction, verification and risks, and the next step to create or update the new Hybrid Tree.

Directions deferred to later ("not this round, worth keeping") land as `exploring` Proposal Pool entries per `noteX/templates/proposal.md` without blocking the Ready Summary. Genuine trade-offs confirmed here may also drop a `proposed/` Note draft.

`xdo` and `xdel` do not invoke this skill automatically.
