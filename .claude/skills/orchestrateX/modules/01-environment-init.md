# 1. Environment Initialization (Environment & MCP Self-Check Mechanism)

When entering a workflow for the first time, perform an "out-of-box self-check":

1. Check for concurrent workflow conflicts (Step 0)
2. Proactively check whether the project provides MCP tool dependencies (such as `server-memory` and `server-sequential-thinking`) for xwhole/xlocal workflows.
3. If MCP Servers are missing, remind the user to configure them.

**xunit exception**: xunit is a lightweight unit workflow. It skips MCP health checks entirely and must not use knowledge graph retrieval. Dispatch Agent(coderX) with a Type 0 Dispatch Payload that sets `MCP Policy=skip` and instructs coderX to rely only on the current prompt and local code exploration.

## Step 0: Concurrency Lock Check

Before any other operation, check for `.hybrid/.workflow-lock`:

1. **If lock exists**: Read the lock file to get the active workflow mode and timestamp. Warn the user:
   > Another workflow is currently running (mode: {mode}, started: {timestamp}). Please wait for it to complete or manually delete `.hybrid/.workflow-lock` to force-start.

   Then abort.

2. **If no lock**: Create `.hybrid/.workflow-lock` with content:
   ```
   mode: {current-mode}
   started: {real-timestamp}
   ```

3. **On workflow completion or interruption**: Delete `.hybrid/.workflow-lock`.

## 1.1 MCP Health Check & Auto-Recovery (MCP Lifecycle)

**Trigger**: Every entry into xwhole/xlocal workflow, before any other operation.

**Do not run for xunit**. xunit does not probe `server-memory`, does not write MCP status markers, and does not prepend MCP fallback instructions.

### Step 1: Probe — Single Attempt

**Execute this exact tool call** to check MCP availability:

```
mcp__server-memory__read_graph()
```

**Interpret the result**:
- **Success** (returns JSON with `entities` array, even if empty): MCP is **Active** → proceed to Step 3
- **Error / tool not found / timeout**: MCP is **Degraded** → proceed to Step 2

**Important**: Do NOT assume degradation. You MUST actually call the tool. Only declare Degraded if the call returns an error.

### Step 2: Degraded Mode — Notify & Persist

1. **One-time user notification** (show only once per session):
   > MCP Server is unavailable. The workflow has entered fallback mode. Knowledge graph retrieval steps will be skipped; agents will only rely on the `8.1` file index and `8.3` incremental references in the hybrid document.

2. **Persist status** (see Step 3 for format).

### Step 3: Write MCP Status to Hybrid Doc

**If a hybrid document exists** (xwhole / xlocal workflows): Update `Section 0. Runtime Environment Status` in the static zone.

Generate real timestamp: `date -u +%Y-%m-%dT%H:%M:%SZ`

- **MCP Active**:
  ```
  - **MCP Status**: Active
  - **MCP Servers**: server-memory, server-sequential-thinking
  - **Last Checked**: {real-timestamp}
  - **Degraded Since**: N/A
  - **Fallback Impact**: None
  ```

- **MCP Degraded**:
  ```
  - **MCP Status**: Degraded
  - **MCP Servers**: server-memory, server-sequential-thinking
  - **Last Checked**: {real-timestamp}
  - **Degraded Since**: {real-timestamp}
  - **Fallback Impact**: Knowledge graph retrieval skipped; relying on 8.1/8.3 file index only
  ```

**If no hybrid document exists**: Do not persist MCP status. xunit never reaches this step.

### Step 4: SubAgent Dispatch Adaptation (Degraded Mode Only)

When calling coderX / evaluatorX in degraded mode, prepend this instruction prefix to the dispatch prompt:

> [MCP Fallback Mode] Current MCP Server is unavailable. Please skip all `mcp_memory_open_nodes` / `mcp_memory_search_nodes` and other MCP graph retrieval steps. Instead: rely only on information from the hybrid document `8.1` main index and `8.3` incremental references as context. If context is insufficient, explicitly point out what specific information is missing and continue execution; do not block.

### Step 5: Recovery Detection

Each time entering a new xwhole/xlocal workflow, **always re-probe** (repeat Step 1). If MCP was previously Degraded and is now Active:

1. Update hybrid doc Section 0 status to `Active`, clear `Degraded Since`, set `Fallback Impact: None`.
2. Notify user:
   > MCP Server has recovered. Full knowledge graph capabilities restored.
3. Clear any `TodoWrite` `MCP_DEGRADED` marker if present.

## 1.2 Predictive Module Prefetch (Optimized)

**Trigger**: After environment init, before workflow execution.

### Prefetch Strategy

Based on detected workflow mode, pre-load likely needed modules and sections:

```
Mode Detection → Prefetch Map:
- xwhole: Prefetch modules 01(done), 08, 04, hybrid-template
- xlocal: Prefetch modules 01(done), 08, 04, hybrid-template
- xunit: No Module 01 MCP prefetch. Load Module 04 only when `-prompt` is present
- xparallel: Prefetch modules 01(done), 08, 05, 06
```

### Section Prefetch

For workflows with existing Hybrid Tree:
1. Read and cache Parent §0-6 (static, rarely changes)
2. Read and cache Parent §8.1, §8.2, §8.3 (incremental)
3. Read Parent §7 routing table (to know Children)

**Benefit**: First iteration of Core Loop starts with cached data, no initial I/O spike.
