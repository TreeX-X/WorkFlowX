# AGENTS.md — WorkflowX 项目指令 (Codex / 通用 AI Agent)

## Default Behavior: Main Agent Orchestrates Directly

**The Main Claude Agent acts as orchestrator directly** (per `CLAUDE.md`). It never writes project code itself — for any code development, feature implementation, refactoring, or bug fix, it dispatches `coderX` (and `evaluatorX` for audits). There is no `orchestratorX` sub-agent.

### Rules

1. When receiving any code development, feature implementation, refactoring, or bug fix request, the Main Agent **must** dispatch `coderX` (`Agent({ subagent_type: "coderX", ... })`) for code changes, and `evaluatorX` for audits.
2. The Main Agent routes to the appropriate workflow mode (whole/local/unit) via `.claude/skills/routeX/SKILL.md`. Planning is performed inline by the Main Agent through Module 08 (requirements discovery) — there is no separate planner agent.
3. **Exceptions** — the following scenarios do NOT need a workflow dispatch:
   - Pure file reading / searching / browsing (exploratory)
   - Project configuration changes (settings.json, CLAUDE.md, AGENTS.md, etc.)
   - Git operations (commit, branch, status, etc.)
   - User explicitly says "do it directly" or skips orchestration

### Codex Mode Aliases

OpenAI Codex does not support project-defined slash commands. Use these as natural-language prefixes in the user message:

- `xwhole [task description]` — Full-repo workflow (discovery -> coder -> evaluator)
- `xlocal [task description]` — Single-module local development workflow
- `xunit [task description]` — Minimal unit task, direct modification
- `xstatus [--output <path>]` — Generate styled HTML status report (huashu-design) and open in browser
- `xprompt [raw prompt]` — Prompt optimization only, no workflow triggered

## File Read/Write Rules (Mandatory)

**Source files in this project use encrypted encoding. Direct Read on project files will show garbled output.** All file operations must follow these rules:

### Reading Files

- **DO NOT** use the Read tool to open project source files (will return garbled text)
- **MUST** use `rg` (ripgrep) via Bash to search and read file content:
  - Search keyword: `rg "keyword" path/to/file`
  - Search with context: `rg -C 3 "keyword" file`
  - Search entire project: `rg -n "keyword"`
- Only files under `.claude/` directory (settings.json, CLAUDE.md, AGENTS.md, agents/*.md, skills/*.md) can be read/written normally with Read/Write tools

### Modifying Files

- **PREFER** the Edit tool for precise string-replacement edits (preserves file encoding)
- **DO NOT** use the Write tool to overwrite entire project source files (will lose encoding, corrupting the file)
- If new content needs to be appended, use `Bash` + `echo` or `printf` to append to file
- Before modifying, **always** use `rg` to confirm the exact location and context of the target content

### Summary

| Operation | Correct Method | Wrong Method |
|---|---|---|
| Read source files | `rg` via Bash | Read tool |
| Search keywords | `rg -n "keyword"` | Grep tool (limited scenarios) |
| Modify source files | Edit tool (precise replacement) | Write tool (overwrite entire file) |
| Read/write config files | Read / Write tools | — |

## General Rules

- Under normal circumstances, the use of PowerShell is prohibited. If it is unavoidable to use it, the correctness and completeness of the commands must be ensured.

## Project Overview

WorkflowX is a multi-agent collaborative development framework. The Main Claude Agent acts as orchestrator: it performs requirement discovery/planning inline (Module 08), then dispatches coderX, evaluatorX, abstracterX and other sub-agents to achieve a complete loop from requirement clarification → code implementation → quality evaluation. The Main Agent is the sole document writer; there is no `orchestratorX` sub-agent and no separate planner agent.

### Workflow Modes

| Mode | Command | Description |
|------|---------|-------------|
| **Mode A** | `xwhole` | 全局工作流，适合大规模、高影响力的任务 |
| **Mode B** | `xlocal` | 本地工作流，适合需求明确、范围有限的任务 |
| **Mode C** | `xunit` | 单元工作流，适合最小任务：单个修复、单个文件 |


### Agent Teams (Mode A-parallel)

Mode A-parallel 使用 Claude 的 Agent Teams 特性，实现多任务并行执行：
- **前提条件**: 需要启用 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`，Claude Code v2.1.32+
- **核心特性**: 多个 coder-teammate + evaluator-teammate 并行工作
- **智能调度**: 基于依赖关系的动态任务分配
- **文件冲突检查**: 运行时检测，防止多人修改同一文件
- **需求变更**: 实时接入，用户可随时提出新需求

### Agent 定义

- Agent definitions: `.claude/agents/`
- Skill definitions: `.claude/skills/`
- Runtime playbook: `.claude/skills/orchestrateX/SKILL.md`
