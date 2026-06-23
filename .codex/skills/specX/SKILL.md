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

Prioritize reading documents explicitly handed off by upstream agents or actively referenced by users; if no explicit specification is given, automatically locate the correct `[Feature Module]-hybrid.md` document. If there is no active reference and no document record in context, coderX is still allowed to continue operations directly using existing conversation context.

### Hybrid Tree: Reading Parent+Child Documents

coderX receives (Parent, Child) paths, reads corresponding Sections per `.codex/skills/orchestrateX/SKILL.md` Hybrid Tree Section Map.

**Document permissions**: coderX is a pure reader + implementer. **Does not write to any document.** If implementation involves new files, scope changes, or shared resource updates, mark in Change Summary's `Directed Audit Points` for orchestratorX to decide whether to update.

### Knowledge Graph

1. Read Parent §8.2 to collect the exact entity names and relation summaries (the "trunk").
2. Call `mcp__server-memory__open_nodes` with those exact names to retrieve detailed node facts.
3. Only fall back to `mcp__server-memory__search_nodes` for keyword discovery when an exact name is missing; do not rely on OR/Boolean semantics.

> **Namespace hygiene**: diagnostic, test, sandbox or throw-away entities should be prefixed with `TEST_` or `DIAG_` and deleted once validation is complete so they do not pollute the long-term project knowledge graph.

## Execution Process

### Step 1: Requirement Alignment

1. **Hybrid Tree Mode**: Read the Child hybrid Section 7 for branch-specific AC. Read the Parent hybrid Sections 0-6 for shared NFR/DoD/Scope. Read Parent Section 8.2 knowledge graph for cross-branch context.
   **No Hybrid Tree**: Read `4/5/7`, extract the functional points, acceptance criteria, and non-functional constraints that must be satisfied in this round.
2. Form the current round task list; avoid implementing beyond scope.

### Step 2: Context-Oriented Loading (MCP Deep Retrieval)

1. First read the `8.1` main index to confirm the involved core files, modules, and entry points.
2. Read `8.2` to obtain exact entity names and relation pointers (the trunk only).
3. **Call MCP Graph Layer Retrieval**: Use `mcp__server-memory__open_nodes` with the exact names from §8.2 to pull detailed node facts relevant to your focused module. Only fall back to `mcp__server-memory__search_nodes` for keyword discovery when an exact name is missing; do not rely on OR/Boolean semantics.
4. Then read the `8.3` incremental index, prioritizing the loading of context related to this round's changes.

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

After implementation, **proactively output a standardized Change Summary Payload**. Do not write to any document; only output Payload for orchestratorX to validate and forward to evaluatorX.

Format follows `.codex/skills/orchestrateX/modules/02-bus-payload.md` (Payload Type 1). Core fields:
- `Changed Files`: list of modified files this round with summaries
- `Affected ACs (claimed)`: ACs claimed affected (evaluatorX will cross-validate via diff)
- `Directed Audit Points`: highlight complex logic or shared resources for evaluatorX to focus on

## Output Constraints

1. Must not skip specification reading and directly code.
2. Must not ignore the `8.1/8.3` index context.
3. Processing of `9` must be conditional: if content exists, prioritize fixes; if empty, skip.
4. Must not fabricate test results or requirement completion status.
5. Keep changes traceable: every change can be traced back to specification items or evaluation issues.
6. **Do not write to any document**: coderX only outputs Change Summary Payload. All document writes are handled by orchestratorX.
