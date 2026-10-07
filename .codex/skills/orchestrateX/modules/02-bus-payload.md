# Task handoff contract

Main Agent updates the shared Task before every handoff. The Task holds durable scope, acceptance, verification, current progress, unresolved issues and next action. A payload selects a role/action against a fixed snapshot; it does not duplicate the whole Task.

## coderX Task

Before execution, validate Task scope, acceptance sources and dependencies; resolve blockers and retain the mode-required review obligation. Using already-confirmed user intent, Main Agent accepts the agreed contract (`lifecycle: accepted`) before pinning its snapshot and dispatching. Draft/proposed Tasks are not executable; unclear or changed execution grounds require resolution, never an automatic rebaseline.

Required: Workflow Mode; Task URI and snapshot (commit or source hash); current Objective; Allowed Scope; fixed Acceptance Refs; Applicable Decisions; Dependency Tasks and relevant results; Standard Version; Required Skills (engineeringX, specX); Verification; Output.

Fields already explicit in the pinned Task may be supplied as precise section/field references. Include only necessary Goal Refs/module context. Verify referenced snapshots are readable; a hash alone does not supply missing content.

Output: implementation summary, actual checks/evidence, unresolved issues and proposed documentation updates. Return contract changes as scope-change requests. Main Agent owns the Task and final document integration.

## evaluatorX Review

Required: Task URI and fixed snapshot; Changed Files/tested manifest; fixed Acceptance Source; Review Focus; Output (tests, findings, PASS/NEEDS_FIX/UNEVALUABLE).

Provide constraints and evidence, not the implementation conversation or persuasive success narrative. Reviewer identity differs from implementer. For NEEDS_FIX return a compact failure record: failed check, observed/expected, likely cause, scope, regression risk and blocker.

## Repair / dependent task

A local repair reuses Task URI, fixed acceptance and scope with a new attempt: include failure evidence, current action and prohibited unrelated edits. Do not resend full history.

A cross-task issue belongs in the affected Task: predecessor URI, changed contract, relevant files, required adaptation and risk. Main Agent reconciles dependencies before dispatch.

## Checkpoint

Before handoff, Main Agent writes Progress, Evidence and Handoff sections: verified work, unverified reports, concrete unresolved issues, next action and exact necessary references. Refresh updated. Do not change acceptance to match an implementation. On interruption, re-read Task and inspect current code/evidence; old conversation is optional context, never a prerequisite.
