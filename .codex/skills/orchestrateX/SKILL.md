---
name: orchestrateX
description: Route xdo, xdel, xflow, xarch and xstatus; coordinate task handoffs and closeout.
---

# orchestrateX

Honor the user's chosen mode and authorization. Without a prefix, execute clear local work directly as xdo; use xdel for an explicit task handoff and xflow for requested full orchestration. Clarify only decisions that materially change scope. Parallel Agents require explicit user request.

## Modes

- **xdo:** Main Agent implements with engineeringX. No Task is required or created. If the user explicitly selects an existing Task, maintain it and preserve its acceptance/review obligations. Use noteX only when recorded facts or lasting reasoning need maintenance.
- **xdel:** create/reuse a scoped Task, then dispatch coderX once; self-review unless the Task retains an independent-review obligation. Main Agent integrates results and documents.
- **xflow:** discover relevant facts with [module 08](modules/08-requirements-discovery.md), resolve open decisions with socratesX, then create/reuse Tasks and execute dependencies. Dispatch coderX and independent evaluatorX per Task. A local defect gets a concise repair dispatch, at most one automatic repair by default; Main Agent decides further action. Cross-task issues go into the affected Task. Unevaluable work needs explicit disposition, never a fake pass.
- **xarch:** read [scaffold](modules/03-scaffold.md); create project/module entries with confirmed boundaries and the supported profile. No Task or subagent.
- **xstatus:** read [status](modules/07-status-report.md); report source-backed module/task state and gaps.

## Task coordination

Main Agent owns Task maintenance. Before every handoff, update current progress, verified versus unverified results, blockers and next action in the same Task. Keep acceptance and review obligations fixed unless explicitly revised; switching execution mode alone does not weaken them.

For xdel/xflow dispatch, read [contract](modules/02-bus-payload.md) and [host adapter](modules/09-dispatch-adapter.md). Send the current action and pinned Task references, not the conversation or whole skills. Subagents return evidence; Main Agent integrates it. No per-agent handoff Note. Recovery must work from repository Task, references, code and formal evidence; recheck actual state after interruption.

Read noteX for affected documentation. On landing, keep relevant code/docs/reverse references coherent in one commit; include changed Note paths when applicable. Do not manufacture a Note update for format-only work. Report actual checks and remaining gaps. Preserve user edits and selected checkout ownership; unavailable cross-repo updates remain explicit gaps.

The runtime may manage leases, revisions and evidence transactions. A document summary is never proof of execution or permission to overwrite an active run. Exact baseline, receipt and recovery rules are in the pinned standard for harness implementers.
