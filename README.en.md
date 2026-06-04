<div align="center">

[中文](./README.md) · **English**

# 🧰 WorkflowX: SubAgent-based Hybrid Orchestration Workflow

![WorkflowX Logo](images/WorkFlowX-Logo.png)
WorkflowX is a **pure file-driven multi-agent orchestration configuration system** — no servers to install, no runtime to set up. Just copy the config files into your AI IDE project and you're ready to go. By leveraging the `runSubAgent` capabilities of mainstream CLI tools, it builds an ecosystem where a master orchestrator intelligently delegates tasks to specialized sub-agents.

[![License](https://img.shields.io/badge/License-MIT-3B82F6?style=for-the-badge)](./LICENSE)
[![Skills](https://img.shields.io/badge/Skills-6-10B981?style=for-the-badge)](#-skills)
[![Agents](https://img.shields.io/badge/Agents-5-10B981?style=for-the-badge)](#-skills)
[![AgentSkills](https://img.shields.io/badge/AgentSkills-Standard-8B5CF6?style=for-the-badge)](https://agentskills.io)

![Claude Code](https://img.shields.io/badge/Claude_Code-Skill-D97706?style=flat-square&logo=anthropic&logoColor=white)
![Codex](https://img.shields.io/badge/Codex-Skill-10B981?style=flat-square&logo=openai&logoColor=white)
![VSCode Copilot](https://img.shields.io/badge/VSCode_Copilot-Skill-6F42C1?style=flat-square&logo=github&logoColor=white)
![OpenCode](https://img.shields.io/badge/OpenCode-Skill-3B82F6?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMiAxNWwtNS01IDEuNDEtMS40MUwxMCAxNC4xN2w3LjU5LTcuNTlMMTkgOGwtOSA5eiIvPjwvc3ZnPg==&logoColor=white)

</div>

The core philosophy: **Independent context for maximum efficiency, hybrid document-driven state (Hybrid Docs) for seamless human-in-the-loop interaction. A single document writer (orchestratorX) ensures state consistency, and structured Payload communication achieves zero context pollution.**

## 🌟 Design Philosophy

- **Zero-dependency deployment, config-and-run** — Pure file-driven, copy and go
- **Single writer, consistent state** — orchestratorX is the sole document writer, no multi-source conflicts
- **Reduce Hallucinations & Maximize Single-Step Efficiency** — Pristine context + structured Payload communication
- **Single-Point Operations with Global Synchronization** — Requirement changes propagate automatically, dependencies auto-retry via deferred queue

## 🏗 System Architecture

Modern LLMs perform best when focused on a single, well-defined problem. WorkflowX solves the "context window bloating" and memory degradation problem through a modular design:

1. **Master Orchestrator Agent**: Acts as the central brain. It analyzes requirements, plans the workflow path, and delegates to specialized sub-agents. **orchestratorX is the sole document writer** — all Hybrid Document creation and updates are performed by it.
2. **Specialized Sub-Agents (Pure Context)**: Invoked via the `runSubAgent` protocol. Each sub-agent operates with a **pristine, isolated context**. coderX is a pure reader + implementer (reads docs, writes code, outputs Payload). evaluatorX is a pure analyzer (reads docs + code, outputs Evaluation Payload). Neither writes to any document.
3. **Hybrid Document State Flow**: Instead of accumulating invisible black-box context, task progress, knowledge indexes, and architecture details are persisted into human-readable **Hybrid Documents**. Uses a Hybrid Tree structure (Parent routing layer + Children requirement layer) with MECE division of responsibility.
4. **Bus Pipeline Communication**: Agents communicate via 3 structured Payload types — Change Summary (coderX→orchestratorX→evaluatorX), Evaluation Result (evaluatorX→orchestratorX), and Requirement Change (orchestratorX internal). orchestratorX validates format, forwards Payloads, and performs document updates.

## ✨ Core Capabilities

### Prompt Optimization Engine (Prompt-Master)

Built-in **prompt-master** skill generates production-grade prompts for 20+ AI tools (Claude, GPT, Gemini, Cursor, Copilot, etc.):

- **9-Dimension Intent Extraction**: Silently analyzes task, target tool, output format, constraints, and more
- **Tool-Specific Routing**: Auto-matches optimal prompting strategies per model (e.g., no CoT for reasoning-native models)
- **6-Category Fault Scanning**: Detects and fixes ambiguity, missing context, format drift, and more
- **Copy-Paste Ready**: Outputs a single prompt block requiring zero manual edits

### Hybrid Docs × Indexing × Memory Graph — Maximum Token Savings

Three-layer collaboration that dramatically cuts context overhead:

**Layer 1: Hybrid Document Topology (Prompt Caching)**
- Strict zoning: **Static** (requirements, scope, DoD — rarely changes), **Incremental** (acceptance criteria, file indexes), **Dynamic** (evaluation reports — overwritten each round)
- Static sections at the top hit LLM Prompt Cache continuously; dynamic sections at the bottom don't invalidate cached tokens when overwritten
- Token costs stay minimal even after 100+ conversation turns

**Layer 2: Trunk-Leaf Index Separation**
- Markdown documents retain only business "trunk" outlines — no code detail dumps
- Entity relations, code structures ("leaves") are maintained separately in the MCP Knowledge Graph
- Agents fetch on-demand, keeping engineering documents lean

**Layer 3: Memory Graph Snapshot**
- Hybrid doc §8.2 stores only **skeleton pointers** to knowledge graph entities (names, relation summaries)
- Full leaf-node details are persisted by MCP server-memory
- L3 deep compression auto-syncs graph state, ensuring doc-graph consistency
- Cross-session, cross-agent knowledge sharing without redundant context transfer

> **Combined effect**: Static requirements trigger cache hits → incremental indexes enable targeted references → memory graph loads on-demand. Every SubAgent wake-up gets the minimum viable input tokens.

### 🤖 Seamless Auto / Semi-Auto Shift

Because cross-agent state is continuously persisted via clear Markdown/Text hybrid docs, human developers can safely pause, intervene, and guide the workflow by directly editing the documents for the next agent.

### 🧹 Zero Context Pollution

Strictly filters input information for each sub-agent. By blocking redundant long-history chats, it significantly drops the statistical probability of LLM hallucinations.

### 📊 Workflow Status Visualization (`/xstatus`)

A single command generates a high-fidelity HTML status report showing real-time progress of all active workflows:

- **Data source**: `xwhole` / `xlocal` / `xwhole -parallel` parse Parent + Child docs from `.hybrid/`; `xunit` is inferred from git log (explicitly labeled "no documents")
- **Style**: Built on `huashu-design` language — warm off-white background + serif display font + rust orange accent. Anti-AI-slop: no purple gradient, no decorative emoji, no rounded cards with left-border accent
- **Mode-specific layouts**: 4 workflow modes each have a distinct display format — children tree / progress bar / iteration rounds / agent team sidebar / git activity table
- **Read-only & idempotent**: No project files modified. Each run overwrites `./status-report.html` and auto-opens it in your default browser
- **Custom output path**: `/xstatus --output <path>` lets you archive or share reports

```bash
/xstatus                            # Output to ./status-report.html and open
/xstatus --output ./reports/today.html  # Output to a custom path
```

## ⚙️ Setup & Installation

1. Ensure Node.js (v18+) and Python 3.10+ are installed.
2. Install the required MCP tools for the workflow:
~~~bash
npm install -g @modelcontextprotocol/server-memory @modelcontextprotocol/server-sequential-thinking
~~~
3. Configure and mount the above MCPs in your AI Client (e.g., VSCode Copilot / Claude) using the provided configuration template `mcp.json.template`.

## 🚀 Workflow & Usage

### 1. Platform Integration

WorkflowX is a **lightweight, pure text-based configuration and instruction system**. No runtime lock-in, no extra services to install — just copy the config files into your project directory and deploy.

Three platform configurations are provided out of the box:

| Platform | Config Directory | Supported Modes | Notes |
|----------|-----------------|-----------------|-------|
| **Claude Code** | `.claude/` | All modes (incl. `-parallel`) | agents + skills, native SubAgent + Agent Teams + Worktree isolation |
| **OpenAI Codex** | `.codex/` | 3 modes (no `-parallel`) | agents (`.toml`) + skills, full parity |
| **GitHub Copilot** | `.github/` | 3 modes (no `-parallel`) | agents (`.agent.md`) + skills + instructions |
| **OpenCode** | `.opencode/` | 3 modes (no `-parallel`) | agents + commands + skills, Task tool SubAgent delegation |

> All four configurations share **identical workflow logic** — the same commands, modes, and multiple runtime modules. Only the tool-call syntax differs per platform. **Parallel mode (`/xwhole -parallel`) is only supported on Claude Code**, leveraging its experimental Agent Teams feature. OpenCode auto-discovers skills from `.claude/skills/`, so no duplication is needed. All modes auto-enable Worktree isolation (except xunit).

**Quick Setup:**
1. Copy the relevant config directory (e.g., `.claude/` or `.opencode/`) into your project root
2. Install MCP dependencies: `npm install -g @modelcontextprotocol/server-memory @modelcontextprotocol/server-sequential-thinking`
3. Mount MCP config in your AI client (see `mcp.json.template`; OpenCode users can use the `opencode.json` at project root which includes MCP configuration)
4. Start using: call orchestratorX in your chat and deliver your requirements

**OpenCode-Specific Configuration:**

OpenCode users should pay attention to these configuration files:

| Config Item | File | Description |
|-------------|------|-------------|
| MCP Servers | `opencode.json` → `mcp` | Pre-configured memory + sequential-thinking; adjust paths for your environment |
| Agent Permissions | `opencode.json` → `agent` | Tool permissions for 5 agents (orchestratorX / coderX / evaluatorX / promptMasterX / abstracterX) |
| Command Definitions | `opencode.json` → `command` | 5 commands registered (xwhole / xlocal / xunit / xprompt / xstatus) |
| Command Templates | `.opencode/commands/*.md` | Detailed execution flow for each command, with YAML frontmatter |
| Agent Definitions | `.opencode/agents/*.md` | Behavior definitions for 5 agents |
| Skill Discovery | `.opencode/skills/` | OpenCode auto-discovers skills from `.claude/skills/`, no duplication needed |

OpenCode's `opencode.json` includes MCP configuration out of the box — no need to create a separate `mcp.json`. If your Node.js installation path differs, update the `command` field in `opencode.json`.

> Parallel mode (`/xwhole -parallel`) relies on Claude Code's Agent Teams feature and is not available on OpenCode. For parallelism, manually split tasks and run multiple `/xlocal` calls.

### 2. Command Reference

| Command | Description | Example |
|---------|-------------|---------|
| `/xwhole [req]` | Full-repo workflow (plan → code → evaluate) | `/xwhole implement user login module` |
| `/xwhole -parallel [req]` | **Parallel workflow**, multiple subtasks executed concurrently (Claude Code only) | `/xwhole -parallel implement user, order, and product modules` |
| `/xwhole -box demo` | Execute in sandbox branch `demo`, isolated from main | `/xwhole -box auth refactor auth logic` |
| `/xwhole -N 3` | Cap evaluator iterations at 3 (default: 2) | `/xwhole -N 3 optimize DB query performance` |
| `/xwhole -parallel -team my-team` | Set Agent Team name | `/xwhole -parallel -team auth-team implement auth module` |
| `/xlocal [req]` | Local module development, skips PRD planning | `/xlocal fix order list pagination bug` |
| `/xunit [req]` | Minimal single-task change, no evaluation | `/xunit add timeout config to Config class` |
| `/xstatus` | Generate huashu-styled HTML workflow status report and auto-open in browser | `/xstatus` or `/xstatus --output ./reports/today.html` |
| `/xprompt [text]` | Optimize a prompt only, no dev workflow triggered | `/xprompt write me a login page prompt` |

> By default, all development requests are routed through orchestratorX. Exceptions: pure file reads, config edits, Git operations, or when the user explicitly says "directly do it."

### 3. Workflow Modes

orchestratorX auto-routes based on requirement complexity (inferred from file scope, keywords, impact range, and PRD necessity), or you can specify manually:

```
/xwhole              → [orchestratorX planning dialogue] → [promptMasterX optimize] → [coderX implement] → [evaluatorX evaluate] → loop
/xwhole -parallel    → [orchestratorX creates Agent Team] → [multiple coder-teammates implement in parallel] → [multiple evaluator-teammates review in parallel] → loop
/xlocal              → [promptMasterX optimize] → [coderX implement] → [evaluatorX evaluate] → loop
/xunit               → [promptMasterX optimize] → [coderX implement] → done
```

| | `/xwhole` Global | `/xwhole -parallel` Parallel | `/xlocal` Scoped | `/xunit` Minimal |
|---|---|---|---|---|
| **Use case** | New features, cross-module refactors | Multiple independent subtasks concurrently | 1-2 module changes | Single-file fixes, small edits |
| **Platform support** | Claude Code / Codex / Copilot / OpenCode | **Claude Code only** | Claude Code / Codex / Copilot / OpenCode | Claude Code / Codex / Copilot / OpenCode |
| **PRD planning** | orchestratorX built-in multi-turn planning, outputs Hybrid Tree (Parent + Children) | Same as xwhole, then splits into parallel tasks | Skipped | Skipped |
| **Evaluation loop** | evaluatorX auto-runs, up to N rounds | Multiple evaluator-teammates run in parallel | evaluatorX runs, up to N rounds | Only on explicit request |
| **Dependency handling** | Deferred queue: blocked Children auto-queued for retry | Dependency graph auto-scheduling, independent tasks run in parallel | Deferred queue | None |
| **Requirement changes** | Built-in change handling (adjust/optimize/scope/new branch) | Supported, updates docs and re-schedules automatically | Supported with Hybrid Tree | Terminate and restart |
| **Checkpoints** | Auto-created each iteration | 7 hard checkpoints, blocking verification at each step | Auto-created each iteration | Not mandatory |
| **Sandbox branch** | `-box` supported | `-box` supported | Not supported | Not supported |
| **Worktree isolation** | ✅ Auto-enabled | ✅ Auto-enabled | ✅ Auto-enabled | Not used |
| **Agent Teams** | Not used | Uses TeamCreate + Agent tool to spawn teammates | Not used | Not used |

> **⚠️ `/xwhole -parallel` is Claude Code only**
>
> Parallel mode relies on Claude Code's experimental Agent Teams feature (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`). Other platforms (Codex, Copilot, OpenCode) do not support this mode. For parallel execution on other platforms, manually split tasks and run them with `/xlocal` separately.

### 4. Walkthrough: A Complete `/xwhole` Session

Suppose you want to add a "User Login" feature to your project:

```
① Initiate the request
   /xwhole implement user login with email+password and OAuth support

② orchestratorX auto-routes to whole mode
   → Conducts multi-turn requirement planning in current session
   → Generates Hybrid Tree: [UserLogin]-hybrid.md (Parent) + sub-module Child docs
   → You review the hybrid docs, confirm they're correct, reply "confirmed"

③ promptMasterX optimizes the execution prompt
   → Translates confirmed requirements into precise coderX instructions

④ coderX implements based on the prompt
   → Outputs Change Summary Payload: "Completed auth module login logic,
     added oauth_callback handling. Focus review on token refresh flow"

⑤ evaluatorX reviews directionally based on the Payload
   → Outputs Evaluation Result Payload (AC status table + issue list + fix instructions)
   → orchestratorX updates docs and decides whether to continue iterating (up to N rounds)

⑥ Iteration complete
   → evaluatorX confirms pass, hybrid doc finalized
   → Optionally call abstracterX for a code summary
```

**Human Intervention**: At any point between steps, you can directly edit the hybrid document to adjust requirements, modify constraints, or correct direction. Since orchestratorX is the sole document writer, your manual edits won't be overwritten — the next agent will automatically read your changes on startup. During iteration, if you need to change requirements, orchestratorX will automatically detect the change type (adjust/optimize/scope/new branch) and update documents accordingly.

### 6. Parallel Mode Configuration (Claude Code Only)

`/xwhole -parallel` allows executing multiple independent subtasks concurrently, significantly improving development efficiency. Parallel mode is an extension of Mode A, sharing the same planning flow but using Agent Teams for parallel execution.

**Prerequisites**:
1. Claude Code v2.1.32+
2. Set environment variable `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
3. Configure `teammateMode: "in-process"` in `settings.json`

**Configuration example** (`.claude/settings.json`):
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "teammateMode": "in-process"
}
```

**Workflow**:
```
/xwhole -parallel implement user, order, and product modules independently
  ↓
orchestratorX conducts planning dialogue (same as Mode A)
  ↓
Creates Agent Team, auto-generates Hybrid Tree, splits into parallel tasks
  ↓
Each teammate gets an isolated worktree (physical isolation)
  ↓
Multiple coder-teammates implement concurrently
  ↓
Multiple evaluator-teammates review concurrently
  ↓
Iterative fixes → All pass → Merge worktree branches → TeamDelete cleanup
```

**Dual-layer isolation** (`-parallel` + `-box`):
```
main branch
  └── sandbox/feature-x (sandbox branch)   ← Layer 1: protects main
        ├── worktree/coder-1                ← Layer 2: agent isolation
        ├── worktree/coder-2
        ├── worktree/evaluator-1
        └── worktree/evaluator-2
```

**Use cases**:
- Parallel development of independent modules (e.g., user module, order module, product module)
- Batch feature implementation (e.g., multiple API endpoints)
- Quick validation of multiple independent design approaches

**Not suitable for**:
- Modules with strong inter-dependencies (use serial execution)
- Single-file modifications (use `/xunit`)
- Deep planning dialogue needed (use `/xwhole`)

### 5. Multi-Platform Collaboration

Since config directories are independent, you can use the same workflow across tools:

- **Claude Code CLI**: `.claude/agents/orchestratorX.md` defines agent behavior, **the only platform supporting parallel mode (`/xwhole -parallel`)**
- **VS Code + Copilot**: `.github/agents/orchestratorX.agent.md` uses VSCode-native tool bindings
- **OpenAI Codex CLI**: `.codex/agents/orchestratorX.toml` uses TOML format config
- **OpenCode**: `.opencode/agents/orchestratorX.md` + `.opencode/commands/` defines agents and commands, delegating subtasks via the Task tool

All four share the same skill definitions (in each platform's `skills/` directory), ensuring consistent workflow behavior. OpenCode auto-discovers skills from `.claude/skills/`, eliminating the need for duplication. Core skills are consolidated to 6: orchestrator-playbook (orchestration handbook + planning + requirement routing), evaluator-prd-audit, codex-spec-implementation, prompt-master, abstracter-code-summary, and guidelines.

> **Parallel mode platform limitation**: `/xwhole -parallel` relies on Claude Code's Agent Teams feature (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` + `teammateMode: "in-process"`). Other platforms cannot use this mode. For parallel execution on Codex/Copilot/OpenCode, manually split tasks and run them with `/xlocal` separately.


## 🌟 About

This is an open-source experimental project deployed across real communities, aiming to explore best practices and architectural designs for multi-agent collaborative development.

Discussions, suggestions, and contributions of any kind are welcome!
How to contribute: Fork this repo, submit a Pull Request, or share your ideas directly in Issues.

If this project helps you, feel free to give it a ⭐ so more people can join us in exploring the future of AI-driven development!

---

<div align="center">

[MIT License](./LICENSE) · Free to use / Modify / Redistribute

Made by [@TreeX-X](https://github.com/TreeX-X)

</div>

## ⭐ Star History

<a href="https://www.star-history.com/#TreeX-X/workflowX&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=TreeX-X/workflowX&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=TreeX-X/workflowX&type=date&theme=light&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=TreeX-X/workflowX&type=date&theme=light&legend=top-left" />
 </picture>
</a>
