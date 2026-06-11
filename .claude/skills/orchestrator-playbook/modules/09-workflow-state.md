# 9. Workflow State Tracking

> **Purpose**: Persist workflow execution state to `.hybrid/status.json` for routing, monitoring, and recovery.
>
> **Design**: Persistent file (never deleted), only Main Agent writes.

## 9.1 Status File Location

**Fixed path**: `.hybrid/status.json`

**Lifecycle**:
- Created at first conversation with `status: "wait"`
- Overwritten at each update checkpoint
- Never deleted (persists across sessions)

---

## 9.2 Status Schema

```json
{
  "status": "normal|wait|xwhole|xlocal|xunit",
  "workflow": {
    "mode": "xwhole|xlocal|xunit|null",
    "phase": "env_init|phase1|phase2|core_loop|waiting|null",
    "started": "2026-06-10T12:30:00Z|null"
  },
  "execution": {
    "current_child": "child-login.md|null",
    "iteration": 0,
    "agent": "coderX|evaluatorX|null"
  },
  "hybrid": ".hybrid/user-auth/|null",
  "task": {
    "type": "analysis|coding|git|browse",
    "subject": "描述性摘要"
  }
}
```

---

## 9.3 Status Values

| Status | Meaning | Allowed Routes | Transition |
|--------|---------|----------------|------------|
| `normal` | Route 1 work in progress | Route 1 only | task done → `wait` |
| `wait` | Idle, between tasks | Route 1 / Route 2 | coding request → workflow mode |
| `xwhole` | xwhole workflow active | Route 0 | exit signal → `wait` |
| `xlocal` | xlocal workflow active | Route 0 | exit signal → `wait` |
| `xunit` | xunit workflow active (ephemeral) | Route 0 | auto-complete → `wait` |

**Route 2 gateway**: Route 2 ONLY fires when `status = wait`.

---

## 9.4 Phase Values

| Phase | Description |
|-------|-------------|
| `null` | No active workflow (status = normal / wait) |
| `env_init` | Module 01 environment initialization |
| `phase1` | xwhole only: Discovery & Solution Design |
| `phase2` | xwhole only: Hybrid Tree generation |
| `core_loop` | Active iteration (coderX/evaluatorX dispatch) |
| `waiting` | xwhole/xlocal: Core Loop finished, waiting for user input |

---

## 9.5 Update Checkpoints

| Event | Update |
|-------|--------|
| First conversation | Create status.json with `status: "wait"` |
| Route 1 task starts | `status: "normal"`, `task.*` |
| Route 1 task ends | `status: "wait"`, clear `task.*` |
| Route 2 user selects mode | `status: "{mode}"`, init `workflow.*` |
| Phase transition | `workflow.phase` |
| Child switch | `execution.current_child`, reset `iteration` to 0 |
| Agent dispatch | `execution.agent` |
| Iteration increment | `execution.iteration` |
| Core Loop finished | `workflow.phase: "waiting"` |
| New input in workflow | `workflow.phase: "core_loop"` |
| Exit signal (xwhole/xlocal) | `status: "wait"`, clear `workflow.*` |
| xunit auto-complete | `status: "wait"`, clear `workflow.*` |

---

## 9.6 Update Implementation

Use Write tool to overwrite status file:

```javascript
// Example: After user selects xwhole mode
const status = {
  status: "xwhole",
  workflow: { mode: "xwhole", phase: "env_init", started: "2026-06-10T12:30:00Z" },
  execution: { current_child: null, iteration: 0, agent: null },
  hybrid: null,
  task: { type: "coding", subject: "重构数据库层" }
};

Write({
  file_path: ".hybrid/status.json",
  content: JSON.stringify(status, null, 2)
});
```

**Rules**:
- Always write full status object (no partial updates)
- Use 2-space indentation for readability
- ISO8601 format for `workflow.started`
- `null` for inactive fields

---

## 9.7 Error Handling

**If status file creation fails**: Log warning, continue workflow (status tracking is non-blocking)

**If status file is corrupted**: Overwrite with fresh status at next checkpoint

**If status file is missing**: Create new one with `status: "wait"`

---

## 9.8 Integration Points

**CLAUDE.md reference**: `## Status Management` section

**Mode execution flows**:
- Mode A (xwhole): status=xwhole → env_init → phase1 → phase2 → core_loop → waiting → (repeat or exit → wait)
- Mode B (xlocal): status=xlocal → env_init → core_loop → waiting → (repeat or exit → wait)
- Mode C (xunit): status=xunit → env_init → core_loop → auto-complete → wait

**Module 03 integration**: Update status file after each document write operation
