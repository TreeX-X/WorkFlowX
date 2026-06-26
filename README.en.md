<div align="center">

[中文](./README.md) · **English**

# WorkflowX

### Make AI coding as controllable as a real team

<p align="center">
  <img src="docs/assets/WorkFlowX-Logo.png" alt="WorkflowX Logo" width="620" />
</p>

**A pure file-driven multi-agent framework — turning "chatting with AI to write code" into a planned, verified, traceable engineering process**

[![License](https://img.shields.io/badge/License-MIT-2A211B?style=for-the-badge)](./LICENSE)
[![Skills](https://img.shields.io/badge/Skills-8-FF5A1F?style=for-the-badge)](#deep-dive)
[![Agents](https://img.shields.io/badge/Agents-7-FF8A24?style=for-the-badge)](#deep-dive)
[![Modules](https://img.shields.io/badge/Modules-8-4A4038?style=for-the-badge)](#deep-dive)

![Claude Code](https://img.shields.io/badge/Claude_Code-Skill-FF5A1F?style=flat-square&logo=anthropic&logoColor=white)
![Codex](https://img.shields.io/badge/Codex-Skill-2A211B?style=flat-square&logo=openai&logoColor=white)
![OpenCode](https://img.shields.io/badge/OpenCode-Skill-4A4038?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMiAxNWwtNS01IDEuNDEtMS40MUwxMCAxNC4xN2w3LjU5LTcuNTlMMTkgOGwtOSA5eiIvPjwvc3ZnPg==&logoColor=white)

</div>

---

## What Is It?

WorkflowX is an **engineering workflow** that lives inside your AI coding tool. You still talk to one main agent, but it no longer freestyle-codes inside a long chat:

- **The Main Agent orchestrates directly**: routing, discovery, plan confirmation, Hybrid Tree document writes, state, and dispatch.
- **coderX implements only**: reads the spec and execution prompt, writes code, and returns a structured Change Summary.
- **evaluatorX verifies independently**: reads real code and diff, checks every acceptance criterion, and emits fix instructions on failure.
- **Hybrid Tree keeps the ledger**: Parent + Child documents store scope, AC, file index, dependencies, evaluation results, and state.

> In the current architecture there is no `orchestratorX` sub-agent. The Main Agent owns orchestration directly; execution agents hand off through structured Payloads only.

<p align="center">
  <img src="docs/assets/06-workflow-animation-en.gif" alt="WorkflowX xwhole Workflow Demo" width="880" />
  <br/>
  <sub>A complete xwhole workflow: RouteX state gate → discovery → user confirmation → noiseX denoise → Hybrid Tree → coderX → evaluatorX → fix loop → PASS close</sub>
</p>

---

## Why Use It?

The real problem with single-agent AI coding is not just model quality. It is the lack of process constraints. WorkflowX turns common failure modes into explicit mechanisms:

| Failure mode | WorkflowX mechanism |
|---|---|
| **Context gets noisy and expensive** | Main Agent maintains state; execution agents work in isolated context and exchange only structured Payloads |
| **Requirements disappear into chat history** | Requirements become a Hybrid Tree; changes update only the relevant Section and affected Children re-enter the loop |
| **AI says "done" but misses the requirement** | evaluatorX distrusts coderX self-report and independently checks code, diff, and AC |
| **Misread requirements surface after coding** | xwhole Phase 1 explores the codebase, asks Socratic questions, and proactively challenges assumptions |
| **Multi-round iteration burns tokens** | Section caching, trunk/leaf split, MCP memory snapshots, and noiseX denoising control context budget |
| **Parallel work overwrites itself** | Worktree isolation, Child ownership boundaries, and cross-branch violation detection |

---

## Understand It In 30 Seconds

```text
you
│
├─ xwhole / xlocal / xunit / xstatus / xprompt
│
▼
Main Agent
├─ RouteX: read .hybrid/status.json and decide continue / explore / start workflow
├─ Module 08: xwhole discovery, solution design, and Hard Gate confirmation
├─ Phase 2: generate or maintain Hybrid Tree (Main Agent is the sole document writer)
└─ Core Loop: forward Payloads and drive coderX ↔ evaluatorX iteration
        │
        ├─ coderX: implement and emit Change Summary
        └─ evaluatorX: verify independently and emit Evaluation Result
```

<p align="center">
  <img src="docs/assets/01-architecture.png" alt="WorkflowX Main Agent orchestration architecture" width="880" />
  <br/>
  <sub>Main Agent centralizes orchestration and document writes; coderX / evaluatorX / promptX / noiseX enter as execution or helper units</sub>
</p>

In one line: **Main Agent owns flow and facts, coderX writes code, evaluatorX gates quality, Hybrid Tree keeps everything traceable.**

---

## Quick Start

**Requirement**: Node.js v18+

**1. Install MCP dependencies** for cross-session memory:

```bash
npm install -g @modelcontextprotocol/server-memory @modelcontextprotocol/server-sequential-thinking
```

**2. Install WorkflowX**

| Platform | How to install |
|---|---|
| **Claude Code** | `/plugin marketplace add https://github.com/TreeX-X/workflowX` → `/plugin install workflowx` |
| **OpenAI Codex** | `/plugins` → search `workflowx` → Install Plugin |
| **OpenCode** | Add `"plugin": ["workflowx@git+https://github.com/TreeX-X/workflowX.git"]` to `opencode.json` |
| **Manual** | Copy `.claude/`, `.codex/`, or `.opencode/` into the project root, then mount MCP per `mcp.json.template` |

**3. Run your first requirement**

```bash
xwhole implement user login with email/password and OAuth
```

> Claude Code / OpenCode can use slash commands. OpenAI Codex uses natural-language prefixes, for example starting the message with `xwhole`.

---

## Four Modes

Choose by blast radius. If unsure, describe the requirement and RouteX can recommend a mode based on current state.

| Mode | Use case | Planning | Verify loop | Example |
|---|---|---|---|---|
| **`xunit`** | Single-file, small, clear change | promptX extracts intent | evaluatorX off by default | `xunit add timeout config to Config` |
| **`xlocal`** | Bug fix or local feature within 1-2 modules | Reuse/create minimal Hybrid Tree | Auto, up to N rounds | `xlocal fix order list pagination bug` |
| **`xwhole`** | New feature, cross-module refactor, high-impact work | Phase 1 discovery → Phase 2 docs | Auto, up to N rounds | `xwhole build the order center` |
| **`xwhole -parallel`** | Multiple independent subtasks in parallel | Generate Hybrid Tree, then dispatch by Child | Parallel coder/evaluator teammates | `/xwhole -parallel build user, order, product modules` |

Common flags: `-N 3` caps verification rounds per Child; `-box demo` isolates work in a sandbox branch; `-parallel` requires Claude Code Agent Teams.

<p align="center">
  <img src="docs/assets/05-capabilities.png" alt="WorkflowX modes and capability matrix" width="880" />
</p>

---

## What Happens In xwhole?

For `xwhole implement user login`, the full workflow is:

1. **Entry routing**: Main Agent reads `.hybrid/status.json` and decides whether to start or attach to an existing workflow.
2. **Environment init**: parse `-N` / `-box` / `-parallel`, probe MCP, and prepare degradation behavior.
3. **Code exploration**: search project structure, related modules, and existing constraints to build a file index.
4. **Requirement discovery**: socratesX asks one grounded question at a time and challenges contradictions, missing NFRs, and technical risks.
5. **Hard Gate confirmation**: docs cannot be generated until the user confirms the plan.
6. **noiseX denoising**: compress Phase 1 exploration, discarded hypotheses, and confirmed facts into a clean signal.
7. **Hybrid Tree generation**: Main Agent writes Parent / Child docs with scope, AC, dependencies, and file index.
8. **coderX implementation**: implements against Child AC and returns a Change Summary Payload.
9. **evaluatorX verification**: independently reads diff and code, then outputs AC status, severity-ranked issues, and fix instructions.
10. **Close or loop**: PASS updates docs and closes; failure sends fix instructions back to coderX until PASS or the N-round cap.

---

## Deep Dive

<details>
<summary><b>Hybrid Tree: Structured Requirement Docs</b></summary>

Hybrid Tree is WorkflowX's source of truth:

| Document | Purpose |
|---|---|
| **Parent** | Global scope, NFRs, DoD, routing table, shared file index, memory outline, Child status aggregation |
| **Child** | Subtask scope, acceptance criteria, private file index, implementation summary, evaluation result, iteration log |

The Main Agent is the only document writer. coderX and evaluatorX only read docs and output Payloads, avoiding multiple agents mutating the same fact source.

</details>

<details>
<summary><b>AC Cross-Validation: Evaluator Distrusts Coder</b></summary>

evaluatorX does not evaluate coderX's summary. It evaluates reality:

1. Read the Child acceptance criteria;
2. Read git diff and relevant source code;
3. Mark every AC as `pass / partial / fail / unevaluable`;
4. Emit P0/P1/P2 issues and executable fix instructions;
5. Let the Main Agent update docs and decide whether to loop.

This turns "the AI says it is done" into "an independent quality gate confirms it is done."

</details>

<details>
<summary><b>Token Optimization For Multi-Round Work</b></summary>

<p align="center">
  <img src="docs/assets/03-token-optimization.png" alt="WorkflowX three-layer token optimization" width="880" />
</p>

| Layer | Strategy | Effect |
|---|---|---|
| **L1 Section caching** | Stable sections at top, dynamic sections overwritten at bottom | Better Prompt Cache hit rate |
| **L2 Trunk/leaf split** | Markdown keeps the requirement trunk; entity relations live in MCP memory | Smaller docs |
| **L3 Memory snapshot** | Hybrid Tree stores summaries and pointers; full nodes persist in server-memory | Cross-session fact reuse |

noiseX and promptX handle the related problems: planning noise contaminating docs, and fix-round prompts becoming too scattered.

</details>

<details>
<summary><b>RouteX And State Machine</b></summary>

Every input passes a state gate:

| Route | Trigger | Handling |
|---|---|---|
| **Route 0** | Active workflow exists | Treat user input as part of the current workflow; support incremental requirement changes |
| **Route 1** | Read-only exploration, search, git, config | Handle directly without dispatching coderX |
| **Route 2** | Coding intent while idle | Analyze scope, recommend xwhole / xlocal / xunit, ask for confirmation |
| **Route 3** | Explicit `xwhole` / `xlocal` / `xunit` command | Enter the requested mode immediately |

State lives in `.hybrid/status.json`: `wait`, `normal`, `xwhole`, `xlocal`, `xunit`. Interrupted sessions can resume from this state.

</details>

<details>
<summary><b>Other Built-In Capabilities</b></summary>

- **promptX / promptMasterX**: convert rough requirements or fix instructions into structured input for coderX.
- **noiseX**: cleans Phase 1 context before Phase 2 so discarded assumptions do not enter the PRD.
- **razorX**: uses "Can the path be shorter? Can cognitive load be lower?" to guide implementation and review.
- **guideX**: keeps coderX away from overdesign, false completion, and unverified edits.
- **xstatus**: generates a high-fidelity HTML workflow status report.

```bash
xstatus
xstatus --output ./reports/today.html
```

</details>

---

## Platform Support

| Platform | Config dir | Trigger style | Parallel mode |
|---|---|---|---|
| **Claude Code** | `.claude/` | `/xwhole` `/xlocal` `/xunit` `/xstatus` `/xprompt` | Supports `/xwhole -parallel` |
| **OpenAI Codex** | `.codex/` | Natural-language prefix: `xwhole` `xlocal` `xunit` `xstatus` `xprompt` | Not supported |
| **OpenCode** | `.opencode/` | `/xwhole` `/xlocal` `/xunit` `/xstatus` `/xprompt` | Not supported |

All configs share the same workflow model, with trigger syntax, sub-agent dispatch, and parallelism adapted to the host tool.

---

## Framework Comparison

Full comparison: [comparison-report.md](docs/comparison-report.md).

| Capability | WorkflowX | Superpowers | OMC |
|---|:---:|:---:|:---:|
| Hybrid Tree requirement tracking | Unique | Not supported | Not supported |
| AC cross-validation | Unique | Not supported | Not supported |
| Phase 1 discovery + proactive challenge | Strong | Basic | Basic |
| Incremental token optimization | Systematic | Partial | Partial |
| Worktree isolation + cross-branch checks | Supported | Partial | Partial |
| Multi-platform configs | Claude / Codex / OpenCode | Multi-platform | Limited |
| Status report visualization | Built-in xstatus | Different implementation | Different implementation |

---

## About

WorkflowX is an open-source experimental project used in real communities. Its goal is to explore reliable process design, document structure, and quality gates for multi-agent collaborative development.

Discussions, suggestions, and contributions are welcome. Fork the repo, open a Pull Request, or share your usage scenarios and issues.

If this helps you, a star helps more people discover and test the workflow.

**Friend link**: [Linux.Do](https://linux.do/) — a community providing high-quality discussions and resource sharing for tech enthusiasts and professionals.

---

<div align="center">

[MIT License](./LICENSE) · Free to use / Modify / Redistribute · Made by [@TreeX-X](https://github.com/TreeX-X)

</div>

## Star History

<a href="https://www.star-history.com/#TreeX-X/workflowX&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=TreeX-X/workflowX&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=TreeX-X/workflowX&type=date&theme=dark&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=TreeX-X/workflowX&type=date&theme=dark&legend=top-left" />
 </picture>
</a>
