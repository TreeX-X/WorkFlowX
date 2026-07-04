---
name: specX
description: Spec-driven coding workflow for coderX agents. Use this skill whenever implementing, fixing, refactoring, or iterating code from hybrid docs or specified requirements, especially when file index, knowledge index, or evaluator findings are present.
---

# coderX: Spec-Driven Implementation Skill

## Objectives

Enable coderX to execute development following a unified process:
- First read specifications and acceptance criteria
- Then read engineering file index and knowledge index
- Then read audit reports and fix by priority
- Finally submit verifiable code changes

## Input Document Conventions

Prioritize the Type 0 Dispatch Payload handed off by Main Agent. In xwhole/xlocal, the payload must include explicit Parent and Child paths. If either path is missing, stop and return `Dispatch Contract Missing` instead of auto-locating a Hybrid document.

The payload's `Execution Brief` is the authoritative interpretation of the user requirement. coderX should not re-discover or re-argue the requirement from conversation history; it should implement the brief, then verify against the declared acceptance source. If the brief conflicts with current files or Child AC, stop and report the contradiction instead of guessing.

Auto-location of a `[Feature Module]-hybrid.md` document is allowed only as a direct-execution fallback when the user explicitly asks to skip WorkflowX orchestration, or when Main Agent has declared subagent dispatch degraded and the user approves fallback execution. If there is no active reference and no document record in context, coderX may continue directly only for xunit-style tasks.

### Hybrid Tree: Reading Parent+Child Documents

coderX receives (Parent, Child) paths, reads corresponding Sections per `.codex/skills/orchestrateX/SKILL.md` Hybrid Tree Section Map.

**Document permissions**: coderX is a pure reader + implementer. **Does not write to any document.** If implementation involves new files, scope changes, or shared resource updates, mark in Change Summary's `Directed Audit Points` for Main Agent to decide whether to update.

### Knowledge Graph

1. Read Parent Section 8.2 to collect the exact entity names and relation summaries (the "trunk").
2. Call `mcp__server-memory__open_nodes` with those exact names to retrieve detailed node facts.
3. Only fall back to `mcp__server-memory__search_nodes` for keyword discovery when an exact name is missing; do not rely on OR/Boolean semantics.

> **Namespace hygiene**: diagnostic, test, sandbox or throw-away entities should be prefixed with `TEST_` or `DIAG_` and deleted once validation is complete so they do not pollute the long-term project knowledge graph.

## Execution Process

### Step 1: Requirement Alignment

1. **Hybrid Tree Mode**: Read the Type 0 Dispatch Payload first. Extract `Execution Brief`, `Context Manifest`, and `Context Budget` before loading documents. Then read the Child hybrid Section 7 for branch-specific AC. Read Parent Sections only as listed in the `Context Manifest` or required by the declared acceptance source.
   **No Hybrid Tree**: Read `4/5/7`, extract the functional points, acceptance criteria, and non-functional constraints that must be satisfied in this round.
2. Form the current round task list from the `Execution Brief` and acceptance source; avoid implementing beyond scope.

### Step 2: Context-Oriented Loading (MCP Deep Retrieval)

1. Read `Context Manifest -> Read First` before any repo-wide search.
2. Read `Context Manifest -> Read If Needed` only when the listed trigger applies.
3. Use `Context Budget` to cap broad searches and document reads. Do not scan unrelated modules just to rebuild confidence.
4. For MCP graph retrieval, use exact entity names from the manifest or Parent Section 8.2 trunk. Use `open_nodes` first; only fall back to `search_nodes` when an exact name is missing.
5. If additional files or nodes are required, record each expansion and reason in the Change Summary.

### Memory vs. Code Truth

If a memory observation contradicts the current file content, `git diff`, or actual code, the code/file truth wins. The agent must flag the discrepancy in the Change Summary Payload and must update or delete the stale memory observation using `mcp__server-memory__add_observations` or `mcp__server-memory__delete_observations`.

### Step 3: Audit Feedback Handling (Combined with Bus Communication, Conditional Execution)

1. **Read Pipeline Payload**: Prioritize reading the Evaluation Summary Bus Payload directly handed off by upstream evaluatorX in the conversation, quickly identifying the core issues and directions to fix in this round.
2. **Align Detailed Report**: Read the `9` evaluation report section in the hybrid document to obtain specific line numbers and code-level issue details.
3. If valid issues exist: Handle by severity and priority, in order of `P0/Red -> P1/Yellow -> P2/Green`.
4. If no valid issues exist or empty: Skip the audit fix process and proceed directly to completing new implementation per specifications.

### Step 4: Implementation & Verification

1. Only modify the minimal file set related to the task; avoid unrelated refactoring.
2. Map each change to acceptance criteria, ensuring verifiability.
3. Execute necessary builds/tests/static checks and record results.

### Step 5: Output Change Summary Payload

In xwhole/xlocal Hybrid Tree workflows, after implementation, **proactively output a standardized Change Summary Payload**. Do not write to any document; only output Payload for Main Agent to validate and forward to Agent(evaluatorX).

xunit does not load specX and does not output Bus Payload.

Format follows `.codex/skills/orchestrateX/modules/02-bus-payload.md` (Payload Type 1). Core fields:
- `Changed Files`: list of modified files this round with summaries
- `Affected ACs (claimed)`: ACs claimed affected (evaluatorX will cross-validate via diff)
- `Directed Audit Points`: highlight complex logic or shared resources for evaluatorX to focus on

## Output Constraints

1. Must not skip specification reading and directly code.
2. Must not ignore the `Context Manifest`; read indexed sections such as `8.1/8.3` when the manifest or acceptance source requires them.
3. Processing of `9` must be conditional: if content exists, prioritize fixes; if empty, skip.
4. Must not fabricate test results or requirement completion status.
5. Keep changes traceable: every change can be traced back to specification items or evaluation issues.
6. **Do not write to any document**: coderX only outputs Change Summary Payload. All document writes are handled by Main Agent.
