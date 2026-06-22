# TEST-MEMORY-002 — Configuration-Environment Sync Report

**Date:** 2026-06-22  
**Baseline:** `C:\Users\Tree\Desktop\git\WorkFlowX\.claude\` at commit `e7d8faf`  
**Memory-optimization commit:** `e7d8faf workflow: expose server-memory MCP tools and add memory hygiene rules`  
**Worktree checkout base:** all active worktrees are at `6453815 update readme` (parent of `e7d8faf`)

## Summary table

| Environment | Scope | Status | Missing changes | Action recommended |
|-------------|-------|--------|-----------------|-------------------|
| **Main `.claude/`** | `agents/`, `skills/`, `mcp.json` | **In sync** | None — already contains `e7d8faf` updates. | None — this is the baseline. |
| **`.codex/`** | `agents/*.toml` | **Stale** | No `mcp__server-memory__*` / `mcp__server-sequential-thinking__sequentialthinking` tools listed; still uses generic `mcp` references. | Update agent tool lists to match main `.claude` definitions. |
| **`.codex/`** | `skills/` (codex-spec-implementation, evaluator-prd-audit, orchestrator-playbook) | **Stale** | Uses old `mcp_memory_open_nodes` / `mcp_memory_search_nodes` naming; lacks `Memory vs. Code Truth` reconciliation rules; missing `modules/10-memory-hygiene.md`; `02-bus-payload.md` still includes full cached context trunk. | Port all skill edits from `e7d8faf` and add `modules/10-memory-hygiene.md`. |
| **`.codex/`** | `config.toml` | **In sync** | None — `[mcp_servers.server-memory]` and `[mcp_servers.server-sequential-thinking]` are already configured. | None. |
| **`.codex/`** | **Overall** | **Partially updated** | MCP servers configured, but agents/skills still pre-`e7d8faf`. | Deploy a full agent+skill sync pass before relying on memory optimizations in Codex. |
| **`.opencode/`** | `agents/*.md` | **Stale** | Agent definitions use a `permissions` block (no tool list), and no memory/sequential-thinking tools are declared. | Add equivalent memory-tool permission declarations or agent tool manifests matching main. |
| **`.opencode/`** | `skills/` | **Stale** | Same issues as `.codex/skills/`: old `mcp_memory_*` names, no `10-memory-hygiene.md`, no token-reduction updates in `02-bus-payload.md`, no `Memory vs. Code Truth` section. | Port all `e7d8faf` skill changes and add missing modules. |
| **`.opencode/`** | MCP/server config | **Not present** | No `.opencode/config.toml`, `.opencode/mcp.json`, or plugin-registered MCP servers found; `plugins/workflowx.js` only registers skills/agents/commands directories. | Provide an OpenCode MCP/server configuration (or extend plugin `onLoad`) that exposes `server-memory` and `server-sequential-thinking`. |
| **`.opencode/`** | **Overall** | **Stale** | Servers not wired, agents/skills pre-memory-optimization. | Needs both a deploy pass and an MCP server integration step. |
| **Worktree `agent-a6420b0620972bdfc`** | `.claude/agents/`, `.claude/skills/` | **Stale** | Checked out at `6453815`; all memory-relevant agents/skills are pre-`e7d8faf`; `modules/10-memory-hygiene.md` missing. Local modifications exist in 3 unrelated files only. | Leave isolated; refresh from main if this worktree is reactivated. |
| **Worktree `agent-a8c9628e2af28f43f`** | `.claude/agents/`, `.claude/skills/` | **Partially updated** | Commit is still `6453815`, but the working tree has the 9 tracked `e7d8faf` changes applied, and `modules/10-memory-hygiene.md` is present as an untracked file. | Commit the working-tree changes (and add the untracked module) to finish the sync. |
| **Worktree `agent-a90fbd99c4fd29f9c`** | `.claude/agents/`, `.claude/skills/` | **Stale** | Checked out at `6453815`; all memory-relevant agents/skills pre-`e7d8faf`; `modules/10-memory-hygiene.md` missing; no local changes. | Leave isolated; refresh from main if reactivated. |
| **Worktree `agent-a9bf37a95651d9da9`** | `.claude/agents/`, `.claude/skills/` | **Stale** | Checked out at `6453815`; all memory-relevant agents/skills pre-`e7d8faf`; `modules/10-memory-hygiene.md` missing. | Leave isolated; refresh from main if reactivated. |
| **Worktree `agent-a9bf37a95651d9da9`** | `.claude/mcp.json` | **In sync** | File exists and is byte-identical to main `.claude/mcp.json` (both servers configured). | None. |
| **Worktree `agent-ae00592f4540a76a7`** | `.claude/agents/`, `.claude/skills/` | **Stale** | Checked out at `6453815`; all memory-relevant agents/skills pre-`e7d8faf`; `modules/10-memory-hygiene.md` missing. Contains TEST-MEMORY-002 artifacts. | Leave isolated; refresh from main if reactivated. |
| **Worktree `agent-af1dcb41e826cb348`** (current execution tree) | `.claude/agents/`, `.claude/skills/` | **Stale** | Checked out at `6453815`; all memory-relevant agents/skills pre-`e7d8faf`; `modules/10-memory-hygiene.md` missing. | Pull/rebase onto main `e7d8faf` to bring this worktree in sync. |

## Key memory-optimization changes that are missing in stale environments

1. **Agent tool manifests** must include the full MCP server-memory and server-sequential-thinking tool names:
   - `mcp__server-memory__create_entities`, `create_relations`, `read_graph`, `open_nodes`, `search_nodes`, `add_observations`, `delete_observations`, `delete_entities`, `delete_relations`
   - `mcp__server-sequential-thinking__sequentialthinking`
2. **`codex-spec-implementation/SKILL.md`** and **`evaluator-prd-audit/SKILL.md`** must instruct agents to use exact `open_nodes` names from Parent §8.2, fall back to `search_nodes` only when an exact name is missing, and reconcile stale observations against file/git truth.
3. **`orchestrator-playbook/SKILL.md`** must add Section 10 (Memory Hygiene) to the module map and include the optimized context hand-off rule (trunk + on-demand `open_nodes`).
4. **`orchestrator-playbook/hybrid-template.md`** must add memory-reconciliation checklist items and the `TEST_`/`DIAG_` prefix guidance.
5. **`orchestrator-playbook/modules/02-bus-payload.md`** must use the §8.2 trunk + on-demand retrieval format for subsequent iterations.
6. **`orchestrator-playbook/modules/10-memory-hygiene.md`** must exist as a new module.

## Executive recommendation

- **Update immediately:**
  - **`.codex/` and `.opencode/`** — they are the production-facing non-Claude environments. `.codex/config.toml` already exposes the two MCP servers, so `.codex/` only needs an agent+skill text sync. `.opencode/` additionally needs a new MCP/server registration step (config file or plugin extension) before the skill updates become operational.
  - **Current worktree `agent-af1dcb41e826cb348`** — because this is the active execution tree and it is still on `6453815`; rebase/pull to `e7d8faf` so the running agent definitions match the main baseline.

- **Leave as-is (isolated worktrees):**
  - All other `.claude/worktrees/*/` except `agent-a8c9628e2af28f43f` are isolated snapshots; they can stay at `6453815` unless reactivated.
  - **`agent-a8c9628e2af28f43f`** is only "partially updated" because its working tree is already at the `e7d8faf` content but the commit has not been advanced. If this worktree is reused, commit the pending changes and add the untracked `10-memory-hygiene.md` file.

- **Does `.codex/` / `.opencode/` need a deploy pass?**
  - **Yes.** `.codex/` can be deployed with a file-content sync alone. `.opencode/` needs both a file-content sync and an MCP server wiring step; without the latter the new skill instructions will reference tools the OpenCode runtime does not know about.
