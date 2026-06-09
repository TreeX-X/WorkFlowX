---
description: Execute Mode B workflow (local module, PRD detection)
---

Agent(
  subagent_type="orchestratorX",
  description="Execute Mode B workflow",
  prompt="Mode: xlocal

Requirement: $ARGUMENTS

Execute Mode B workflow following orchestrator-playbook:

1. Environment Init (Module 01): MCP probe, concurrency lock
2. Requirements Discovery (Module 08): Quick clarity check, Socratic Discovery (only if clarity < 5.0), Proactive Challenge (always)
3. PRD Detection (priority order):
   a. Existing Hybrid Tree in .hybrid/[feature]/ → use directly
   b. File path in $ARGUMENTS (e.g. ./docs/prd.md) → read and wrap into Hybrid Tree
   c. No PRD → auto-generate minimal Hybrid Tree (code scan → Parent + Child)
4. promptMasterX optimization (Module 04)
5. Core Iteration Loop: coderX (isolation=worktree) ↔ evaluatorX (isolation=worktree)

Parameters (auto-parsed from $ARGUMENTS):
- -N [1-10]: Max evaluation iterations (default: 2)

Key behaviors:
- worktree isolation enabled by default
- PRD auto-generation if not found
- Early exit on PASS"
)
