# Task handoff contract

Only Main Agent writes the shared Task, including metadata, prose, time and execution updates through its runtime. Subagents read fixed inputs and return results; they never edit, move or delete Tasks.

## Task ownership

Keep each fact once: work holds literal scope, AC references, check declarations and review obligation; Scope explains delivery constraints; Acceptance criteria owns local clauses or links external ones; Verification adds conditions absent from declared checks. Progress records verified/unverified work and findings; Evidence locates results; Handoff records blockers and the next action. Do not copy commands, raw logs or machine state into prose. Preserve required snapshots and receipts.

Before dispatch, Main Agent integrates prior results, validates scope/AC/dependencies, and accepts the agreed Task using confirmed user intent. Pin its readable snapshot; a hash without content is insufficient. Draft/proposed Tasks cannot execute. Changed grounds require reassessment, never silent rebaselining.

## coderX Task

Required: Workflow Mode; Task URI and fixed snapshot; current Objective; Allowed Scope; fixed Acceptance Refs; Applicable Decisions; Dependency Tasks/results; Standard Version; Required Skills (engineeringX, specX); Verification; Output. Supply existing fields through precise Task references, without pasting whole documents or conversations. Add only necessary module context.

Output: Change Summary (implementation, self-review, actual checks, unresolved issues) + Note draft. Return requested contract changes to Main Agent. xdel dispatches once and never automatically invokes evaluatorX; a retained independent-review obligation remains pending, not waived.

## evaluatorX Review

Required: Task URI and fixed snapshot; Changed Files/tested manifest; fixed Acceptance Source; Review Focus; Output (Evaluation Result: tests, findings, PASS/NEEDS_FIX/UNEVALUABLE).

Run the smallest useful checks against fixed AC. Supply constraints and evidence without implementation conversation or persuasive success narrative. Use a separate reviewer identity. On NEEDS_FIX, return failed check, observed/expected result, likely cause, repair scope, regression risk and blocker.

## Repair and continuation

Main Agent updates the same Task before repair or dependent work. A repair payload carries fixed references, current action and failure evidence; do not resend history. Cross-task issues belong in the affected Task with predecessor, changed interface, files and adaptation needed. On interruption, re-read Task/code/evidence and recheck run ownership. Local logs are optional; no separate per-agent handoff Note.
