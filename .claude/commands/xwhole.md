---
description: Execute Mode A workflow (whole codebase, full planning phase)
---

Agent(
  subagent_type="orchestratorX",
  description="Execute Mode A workflow",
  prompt="Mode: xwhole

Requirement: $ARGUMENTS

Execute Mode A workflow following orchestrator-playbook:

1. Environment Init (Module 01): MCP probe, concurrency lock
2. Requirements Discovery (Module 08): Clarity assessment, Socratic Discovery (if needed), Proactive Challenge
3. Planning Phase: Multi-turn dialogue, file index discovery, knowledge graph writeback
4. Wait for user 'Summary' trigger
5. Core Iteration Loop: Dependency graph scheduling, coderX (isolation=worktree) ↔ evaluatorX (isolation=worktree)
6. Worktree merge + cleanup

Parameters (auto-parsed from $ARGUMENTS):
- -N [1-10]: Max evaluation iterations per Child (default: 2)
- -box [name]: Sandbox branch for dual isolation
- -parallel: Enable Agent Teams parallel execution
- -team [name]: Team name (default: workflow-{timestamp})

Key behaviors:
- worktree isolation enabled by default
- Early exit on PASS (no redundant iterations)
- If -parallel: spawn coder-teammate + evaluator-teammate per Module 05/06"
)
