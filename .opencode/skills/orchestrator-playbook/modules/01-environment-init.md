# 1. Environment Initialization (Environment & MCP Self-Check Mechanism)

When you are in a new project or opening a conversation with a user for the first time, you must have "out-of-box self-check" awareness:

1. Proactively check whether the project provides MCP tool dependencies (such as `server-memory` and `server-sequential-thinking`).
2. If the evaluation environment may be missing these MCP Servers, kindly remind the user: "Detected that the current workflow depends on external MCP Server capabilities. If this is your first deployment, please refer to the `mcp.json.template` in the root directory to configure it in your IDE or client." Guide the user through the prerequisite configuration before smoothly entering the main workflow.

## 1.1 MCP Health Check & Auto-Recovery (MCP Lifecycle)

**Trigger**: Every entry into xwhole/xlocal/xunit workflow, before any other operation.

### Step 1: Probe with Retry

Attempt to call `mcp_memory_read_graph`. If the call succeeds, MCP is **Active** — proceed to Step 3.

If the call fails:
1. Wait 3 seconds, then retry (call `mcp_memory_read_graph` again).
2. If still fails, wait 3 seconds and retry once more (third attempt total).
3. If all 3 attempts fail, declare MCP **Degraded** — proceed to Step 2.

### Step 2: Degraded Mode — Notify & Persist

1. **One-time user notification** (show only once per session):
   > MCP Server is unavailable after 3 retry attempts. The workflow has entered fallback mode. Knowledge graph retrieval steps will be skipped; agents will only rely on the `8.1` file index and `8.3` incremental references in the hybrid document. Functionality is unaffected, but context precision may decrease. To restore full capability, please reload the window (`Ctrl+Shift+P` → "Developer: Reload Window") to restart MCP servers.

2. **Persist status** (see Step 3 for format).

### Step 3: Write MCP Status to Hybrid Doc

**If a hybrid document exists** (xwhole / xlocal workflows): Update `Section 0. Runtime Environment Status` in the static zone:

- **MCP Active**:
  ```
  - **MCP Status**: Active
  - **MCP Servers**: server-memory, server-sequential-thinking
  - **Last Checked**: [ISO timestamp]
  - **Degraded Since**: N/A
  - **Fallback Impact**: None
  ```

- **MCP Degraded**:
  ```
  - **MCP Status**: Degraded
  - **MCP Servers**: server-memory, server-sequential-thinking
  - **Last Checked**: [ISO timestamp]
  - **Degraded Since**: [ISO timestamp]
  - **Fallback Impact**: Knowledge graph retrieval skipped; relying on 8.1/8.3 file index only
  ```

**If no hybrid document exists** (unit mode): Fall back to session-local `TodoWrite` marker (`MCP_DEGRADED`), preserving backward compatibility.

### Step 4: SubAgent Dispatch Adaptation (Degraded Mode Only)

When calling coderX / evaluatorX in degraded mode, prepend this instruction prefix to the dispatch prompt:

> [MCP Fallback Mode] Current MCP Server is unavailable. Please skip all `mcp_memory_open_nodes` / `mcp_memory_search_nodes` and other MCP graph retrieval steps. Instead: rely only on information from the hybrid document `8.1` main index and `8.3` incremental references as context. If context is insufficient, explicitly point out what specific information is missing and continue execution; do not block.

### Step 5: Recovery Detection

Each time entering a new xwhole/xlocal/xunit workflow, **always re-probe** (repeat Step 1). If MCP was previously Degraded and is now Active:

1. Update hybrid doc Section 0 status to `Active`, clear `Degraded Since`, set `Fallback Impact: None`.
2. Notify user:
   > MCP Server has recovered. Full knowledge graph capabilities restored.
3. Clear any `TodoWrite` `MCP_DEGRADED` marker if present.
