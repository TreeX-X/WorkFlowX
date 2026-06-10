# 9. Workflow State Tracking

> **Purpose**: Persist workflow execution state to `.hybrid/.workflow-state.json` for CLI-agnostic monitoring and recovery.

## 9.1 State File Location

**Fixed path**: `.hybrid/.workflow-state.json`

**Lifecycle**:
- Created at workflow start
- Overwritten at each update checkpoint
- Deleted at workflow completion

**Single file design**: Always write to the same path, never versioned or archived. Current state only.

---

## 9.2 State Schema

```json
{
  "workflow": {
    "mode": "xwhole|xlocal|xunit",
    "phase": "env_init|phase1|phase2|core_loop|complete",
    "started": "2026-06-10T12:30:00Z"
  },
  "execution": {
    "current_child": "child-login.md",
    "iteration": 2,
    "agent": "coderX|evaluatorX|null"
  },
  "parallel_mode": {
    "enabled": false,
    "team_name": null,
    "active_tasks": []
  },
  "hybrid": ".hybrid/user-auth/"
}
```

**Full schema**: `modules/workflow-state-schema.json`

---

## 9.3 Update Checkpoints

| Checkpoint | Update Fields | Example |
|------------|---------------|---------|
| **Workflow start** | All fields init | `{ "workflow": { "mode": "xwhole", "phase": "env_init", "started": "..." }, ... }` |
| **Phase transition** | `workflow.phase` | `"phase": "phase1"` → `"phase": "phase2"` |
| **Child switch** | `execution.current_child`, reset `iteration` to 0 | `"current_child": "child-register.md"`, `"iteration": 0` |
| **Agent dispatch** | `execution.agent` | `"agent": "coderX"` |
| **Iteration increment** | `execution.iteration` | `"iteration": 2` → `"iteration": 3` |
| **Parallel mode start** | `parallel_mode.*` | `{ "enabled": true, "team_name": "auth-team", "active_tasks": [...] }` |
| **Parallel task update** | `parallel_mode.active_tasks` | Add/remove task entries |
| **Workflow end** | Delete file | `rm .hybrid/.workflow-state.json` |

---

## 9.4 Update Implementation

Use Write tool to overwrite state file:

```javascript
// Example: Update at Child switch
const state = {
  workflow: { mode: "xwhole", phase: "core_loop", started: "2026-06-10T12:30:00Z" },
  execution: { current_child: "child-register.md", iteration: 0, agent: null },
  parallel_mode: { enabled: false, team_name: null, active_tasks: [] },
  hybrid: ".hybrid/user-auth/"
};

Write({
  file_path: ".hybrid/.workflow-state.json",
  content: JSON.stringify(state, null, 2)
});
```

**Rules**:
- Always write full state object (no partial updates)
- Use 2-space indentation for readability
- ISO8601 format for `workflow.started`
- `null` for inactive fields (`current_child`, `agent`, `team_name`)

---

## 9.5 Phase Values

| Phase | Description |
|-------|-------------|
| `env_init` | Module 01 environment initialization |
| `phase1` | Mode A only: Discovery & Solution Design (Module 08) |
| `phase2` | Mode A only: Hybrid Tree generation |
| `core_loop` | Core iteration loop (coderX/evaluatorX dispatch) |
| `complete` | Workflow finished, about to delete state file |

---

## 9.6 Parallel Mode State

**When `parallel_mode.enabled = true`**:

```json
{
  "parallel_mode": {
    "enabled": true,
    "team_name": "auth-team",
    "active_tasks": [
      { "task_id": "1", "child": "child-login.md", "agent": "coderX" },
      { "task_id": "2", "child": "child-register.md", "agent": "coderX" }
    ]
  }
}
```

**Update on**:
- Task dispatch: Add to `active_tasks`
- Task completion: Remove from `active_tasks`
- All tasks done: Set `enabled: false`, clear `active_tasks`

---

## 9.7 Error Handling

**If state file creation fails**: Log warning, continue workflow (state tracking is non-blocking)

**If state file is missing mid-workflow**: Workflow continues without state tracking

**If state file is corrupted**: Overwrite with fresh state at next checkpoint

---

## 9.8 Integration Points

**CLAUDE.md reference**: `## Workflow State & Incremental Iteration` section

**Mode execution flows**:
- Mode A (xwhole): Update at env_init → phase1 → phase2 → core_loop → complete
- Mode B (xlocal): Update at env_init → core_loop → complete (skip phase1/phase2)
- Mode C (xunit): Update at env_init → core_loop → complete (single iteration)

**Module 03 integration**: Update state file after each document write operation
