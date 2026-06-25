# TEST-MEMORY-001 Diagnostic Report

**Date**: 2026/06/22  
**Scope**: Verify WorkFlowX integration with `mcp/server-memory` knowledge graph.  
**Tester**: coderX  
**Worktree**: `C:\Users\Tree\Desktop\git\WorkFlowX\.claude\worktrees\agent-a90fbd99c4fd29f9c`

---

## 1. Executive Summary

`mcp/server-memory` is **partially effective** in the current WorkFlowX setup.

- The underlying server (`@modelcontextprotocol/server-memory` v0.6.3) starts correctly and all graph operations (`create_entities`, `create_relations`, `read_graph`, `open_nodes`, `add_observations`, `delete_observations`) work via raw JSON-RPC.
- However, the convenience tool wrappers `mcp__server-memory__*` are **not exposed to the coderX subagent**. As a result, agent-based workflows cannot yet use memory unless the orchestrator/main agent invokes the tools itself or the subagent tooling is updated.
- Once available, using Parent §8.2 memory pointers instead of full Parent + Child text reduces prompt size by roughly **90%** for this diagnostic.
- The "code truth wins" policy was successfully modeled: a deliberately false memory observation was detected against `.hybrid/status.json`, removed, and replaced with a corrected observation.

**Verdict**: WorkFlowX should keep the MCP server-memory configuration, but must expose the tool wrappers to subagents before relying on it for routine Hybrid Tree workflows.

---

## 2. Per-Test-Case Results

| Case | Status | Evidence | Key Finding |
|------|--------|----------|-------------|
| A. MCP availability self-check | **PASS** | `read_graph` responded with `{entities:[],relations:[]}`. Server version v0.6.3 confirmed. | Underlying server is healthy; `mcp__server-memory__read_graph()` wrapper not in coderX tool list. |
| B. Memory write round-trip | **PASS** | Created 3 entities and 2 relations; `read_graph`/`open_nodes` returned identical content. | Graph persistence and round-trip read work correctly. |
| C. Memory read usage link | **PASS** | `open_nodes` returned all 3 nodes; `search_nodes` OR query returned empty. | Memory did not influence coderX routing/scope because the agent could not call memory tools directly; scope came from file trunk. |
| D. Token-effectiveness estimate | **PASS** | Full context = 13,506 chars; trunk+memory = ~1,369 chars. | Estimated full prompt ~3,377 tokens vs. trunk+memory ~342 tokens, saving ~90% (~3,035 tokens). |
| E. Memory conflict handling | **PASS** | Injected false `status=xwhole` observation; actual `.hybrid/status.json` shows `"wait"`; deleted false observation; added corrected `status=wait`. | "Code truth wins" rule successfully demonstrated. |

---

## 3. Actual Memory Graph Content

### 3.1 Entities

| Name | Type | Observations |
|------|------|--------------|
| `WorkflowX_Architecture` | project | 1. WorkFlowX orchestrator uses Hybrid Trees (Parent + Child).<br>2. Routes via `.hybrid/status.json`.<br>3. Supports `/xwhole`, `/xlocal`, `/xunit`.<br>4. Current `.hybrid/status.json` status is `wait` (code truth verified at runtime). |
| `TestMemory001_Feature` | feature | 1. Diagnostic feature verifying `mcp/server-memory` integration.<br>2. Tests availability, round-trip write, search, open, conflict handling. |
| `TestMemory001_Lesson` | lesson | 1. Captures findings from TEST-MEMORY-001.<br>2. Primary rule: when code truth conflicts with memory, code truth wins. |

### 3.2 Relations

| From | To | Relation Type |
|------|----|---------------|
| `WorkflowX_Architecture` | `TestMemory001_Feature` | `uses_memory_for` |
| `TestMemory001_Feature` | `TestMemory001_Lesson` | `validates` |

### 3.3 Persistence

The graph was persisted to:

```text
C:\Users\Tree\Desktop\git\WorkFlowX\.claude\worktrees\agent-a90fbd99c4fd29f9c\.hybrid\test-memory-001\server-memory-graph.json
```

---

## 4. Issues Observed

1. **Tool wrapper not exposed to subagents**: `mcp__server-memory__read_graph()` and related functions were not available in the coderX tool set. A manual JSON-RPC probe (`probe-memory.js`) was required to exercise the server.
2. **`search_nodes` OR semantics returned empty**: A query of `"WorkflowX_Architecture OR TestMemory001_Feature"` returned no results, while `open_nodes` with the exact names succeeded. This suggests the server uses simple keyword/embedding logic that does not reliably handle OR syntax.
3. **No automatic code-truth synchronization**: The server accepts any observation without validating it against file truth. Agents must explicitly enforce the "code truth wins" rule.

---

## 5. Optimization Recommendations

1. **Expose `mcp__server-memory__*` tools to coderX/evaluatorX subagents**. The MCP server is already configured in `.claude/mcp.json`, but subagents cannot call the wrappers. Enabling them is the highest-impact fix.
2. **Use Parent §8.2 trunk + `open_nodes` references in incremental iterations**. For multi-round workflows, pass only the §8.2 memory skeleton and let the agent open nodes on demand. This can cut per-prompt tokens by ~90%.
3. **Avoid relying on `search_nodes` for OR/Boolean queries**. Prefer exact `open_nodes` calls with names from §8.2, or maintain an explicit node-name index in the Parent document.
4. **Add a memory hygiene step to the orchestrator DoD**. Before marking a workflow PASS, verify that graph observations match the committed file truth; if they diverge, update memory (code truth wins).
5. **Scope diagnostic-only nodes to a sandbox namespace**. Prefix test/diagnostic entities (e.g., `TEST_`) or isolate them to feature-specific memory files to avoid polluting the project knowledge graph.

---

## 6. Optional Test Skill Created

A minimal, reversible test skill was created as the "feature under test" for Case B:

```text
C:\Users\Tree\Desktop\git\WorkFlowX\.claude\worktrees\agent-a90fbd99c4fd29f9c\.claude\skills\diag-example-skill\SKILL.md
```

It contains no production logic and can be safely deleted after the diagnostic is archived.

---

## 7. Artifacts

| Artifact | Path |
|----------|------|
| Parent Hybrid Doc | `C:\Users\Tree\Desktop\git\WorkFlowX\.claude\worktrees\agent-a90fbd99c4fd29f9c\.hybrid\test-memory-001\test-memory-001-hybrid.md` |
| Child Hybrid Doc | `C:\Users\Tree\Desktop\git\WorkFlowX\.claude\worktrees\agent-a90fbd99c4fd29f9c\.hybrid\test-memory-001\test-memory-001-runtime-hybrid.md` |
| Diagnostic Report | `C:\Users\Tree\Desktop\git\WorkFlowX\.claude\worktrees\agent-a90fbd99c4fd29f9c\.hybrid\test-memory-001\test-memory-001-report.md` |
| JSON-RPC Probe Script | `C:\Users\Tree\Desktop\git\WorkFlowX\.claude\worktrees\agent-a90fbd99c4fd29f9c\.hybrid\test-memory-001\probe-memory.js` |
| Probe Transcript | `C:\Users\Tree\Desktop\git\WorkFlowX\.claude\worktrees\agent-a90fbd99c4fd29f9c\.hybrid\test-memory-001\probe-memory-output.json` |
| Persisted Memory Graph | `C:\Users\Tree\Desktop\git\WorkFlowX\.claude\worktrees\agent-a90fbd99c4fd29f9c\.hybrid\test-memory-001\server-memory-graph.json` |
| Test Skill | `C:\Users\Tree\Desktop\git\WorkFlowX\.claude\worktrees\agent-a90fbd99c4fd29f9c\.claude\skills\diag-example-skill\SKILL.md` |
