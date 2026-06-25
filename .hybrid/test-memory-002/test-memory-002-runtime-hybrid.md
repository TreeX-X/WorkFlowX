# Hybrid Docs - TEST-MEMORY-002 / Runtime

**File Name**: test-memory-002-runtime-hybrid.md
**Document Type**: Child (Branch-Specific)
**Parent**: test-memory-002-hybrid.md

**Document Status**: Final
**Update Date**: 2026/06/22
**Author**: TreeX / coderX
**Version**: v1.0

---

> **Inheritance Declaration**
> Sections 0-6 are inherited from parent `test-memory-002-hybrid.md`. This document only contains branch-specific overrides and additions.
> **Knowledge Graph**: The knowledge graph lives exclusively in the Parent document (Section 8.2). This Child document does not contain its own knowledge graph. When needing cross-branch context, read the Parent's Section 8.2.
> If no overrides are listed for a section, the parent's definition applies in full.

### Branch-Specific Overrides
- No overrides to Sections 0-6.

---

> **Incremental Section (Slow-Changing Incremental Section)**
> Contains branch-specific acceptance criteria and engineering index.

## 7. Branch Features & Acceptance Criteria (Branch-Specific AC)
> **Scope**: Detailed AC for this sub-module only. Parent Section 7 routing table references this document.

### Feature: Runtime Regression Checks for Commit e7d8faf
- **Description**: Exercise the five server-memory optimizations from the agent/tooling layer and the skills that depend on them, confirming the previously diagnosed gaps are closed.
- **Implementation Requirements**:
  - Do not modify production code or `.hybrid/status.json`.
  - Only create diagnostic memory nodes with the prefix `DIAG_testmemory002_`.
  - Record exact tool output and file quotes as evidence.
  - Delete all `DIAG_testmemory002_*` entities before finishing.

#### AC-A: Agent tool exposure (live)
- **Action**: In the current coderX context, call `mcp__server-memory__read_graph()`. If it succeeds, create a temporary entity named `DIAG_testmemory002_agent_probe`.
- **Expected**: The wrapper tools respond without error and the probe entity can be created.
- **Evidence**:
  - `read_graph()` returned `{"entities":[],"relations":[]}`.
  - `create_entities()` returned `{"entities":[{"name":"DIAG_testmemory002_agent_probe","entityType":"Diagnostic","observations":["Temporary probe created for TEST-MEMORY-002 test case A."]}]}`.
- **Status**: PASS

#### AC-B: Trunk + open_nodes handoff wording
- **Action**: Read `.claude/skills/orchestrator-playbook/modules/02-bus-payload.md` and `.claude/skills/orchestrator-playbook/SKILL.md`. Confirm wording exists for (1) first-round full docs, (2) subsequent rounds Parent §8.2 trunk + Child §7/§9 + `open_nodes`, and (3) `search_nodes` only as fallback for missing exact names.
- **Expected**: All three wordings are present.
- **Evidence**:
  - `02-bus-payload.md` §2.5 `Subsequent Iterations (Same Child)`:
    > "Incremental context:
    > - Parent §8.2 Memory Pointers: include the trunk only (entity names and relation summaries)
    > - Child §7: [Full content — branch AC, may have changed]
    > - Child §9: [Full content — prior evaluation report / fix instructions]
    > - Change Summary: [Current iteration's changes]
    > - Fix Instructions: [From last evaluation, if any]"
  - `02-bus-payload.md` §2.5:
    > "Deep node facts are **not** included in the prompt. The subagent reads the exact entity names from Parent §8.2 and retrieves detailed facts on demand by calling `mcp__server-memory__open_nodes(names=[...])`. Only fall back to `mcp__server-memory__search_nodes` when an exact name is missing."
  - `orchestrator-playbook/SKILL.md` Hybrid Tree Section Map:
    > "**Context hand-off rule (Optimized)**: In the **first round**, pass full Parent + Child documents to coderX/evaluatorX. In subsequent rounds, prefer a lightweight trunk: pass only Parent §8.2 (Memory Pointers entity/relation summaries) plus the current Child §7 (AC) and §9 (prior evaluation / fix instructions). Tell the subagent to call `mcp__server-memory__open_nodes` with the exact entity names from §8.2 to pull node details on demand; only fall back to `mcp__server-memory__search_nodes` when an exact name is missing."
- **Status**: PASS

#### AC-C: Token reduction quantification
- **Action**: Read the TEST-MEMORY-001 Parent and Child documents, compute character counts, then compute the size of the §8.2 trunk plus entity names. Report the character reduction percentage and the previously reported token estimates.
- **Expected**: Numeric counts are produced; savings align with the TEST-MEMORY-001 claim of ~90% token savings.
- **Evidence**:
  - Test-memory-001 files measured at runtime (current worktree copy):
    - `test-memory-001-hybrid.md`: 7,800 chars
    - `test-memory-001-runtime-hybrid.md`: 7,177 chars
    - **Full Parent + Child**: 14,977 chars
    - Parent `§8.2 Memory Pointers`: 1,309 chars
    - Entity names (`WorkflowX_Architecture`, `TestMemory001_Feature`, `TestMemory001_Lesson`): ~65 chars
    - **Trunk + entity names**: ~1,374 chars
    - **Character reduction vs. full documents**: `(14,977 - 1,374) / 14,977 ≈ 90.8%`
  - TEST-MEMORY-001 self-reported token estimates (`test-memory-001-runtime-hybrid.md` §9.2 AC-D):
    - Full-context prompt ≈ 3,377 tokens
    - Trunk + on-demand memory prompt ≈ 342 tokens
    - Token savings ≈ 3,035 tokens (~90%)
- **Status**: PASS

#### AC-D: Exact open_nodes + code-truth-wins
- **Action**: Read `.claude/skills/codex-spec-implementation/SKILL.md` and `.claude/skills/evaluator-prd-audit/SKILL.md`. Confirm (1) exact entity names from §8.2, (2) `open_nodes` priority over `search_nodes`, (3) "Memory vs. Code Truth" / "code truth wins" rule, and (4) stale observations must be corrected/deleted.
- **Expected**: All four rules are present in both skills.
- **Evidence**:
  - `codex-spec-implementation/SKILL.md` §Knowledge Graph:
    > "1. Read Parent §8.2 to collect the exact entity names and relation summaries (the 'trunk').
    > 2. Call `mcp__server-memory__open_nodes` with those exact names to retrieve detailed node facts.
    > 3. Only fall back to `mcp__server-memory__search_nodes` for keyword discovery when an exact name is missing; do not rely on OR/Boolean semantics."
  - `codex-spec-implementation/SKILL.md` §Step 2:
    > "**Call MCP Graph Layer Retrieval**: Use `mcp__server-memory__open_nodes` with the exact names from §8.2 to pull detailed node facts relevant to your focused module. Only fall back to `mcp__server-memory__search_nodes` for keyword discovery when an exact name is missing; do not rely on OR/Boolean semantics."
  - `codex-spec-implementation/SKILL.md` §Memory vs. Code Truth:
    > "If a memory observation contradicts the current file content, `git diff`, or actual code, the code/file truth wins. The agent must flag the discrepancy in the Change Summary Payload or Evaluation Report and must update or delete the stale memory observation using `mcp__server-memory__add_observations` or `mcp__server-memory__delete_observations`."
  - `evaluator-prd-audit/SKILL.md` §Step 1:
    > "1. Read Parent §8.2 to collect exact entity names and relation summaries.
    > 2. Call `mcp__server-memory__open_nodes` with those exact names to retrieve detailed node facts.
    > 3. Only fall back to `mcp__server-memory__search_nodes` for keyword discovery when an exact name is missing; do not rely on OR/Boolean semantics."
  - `evaluator-prd-audit/SKILL.md` §Memory vs. Code Truth:
    > "If a memory observation contradicts the current file content, `git diff`, or actual code, the code/file truth wins. The agent must flag the discrepancy in the Evaluation Report (Payload Type 2) and must update or delete the stale memory observation using `mcp__server-memory__add_observations` or `mcp__server-memory__delete_observations`."
- **Status**: PASS

#### AC-E: Memory hygiene governance
- **Action**: Confirm `.claude/skills/orchestrator-playbook/modules/10-memory-hygiene.md` exists and contains reconciliation steps. Confirm `.claude/skills/orchestrator-playbook/hybrid-template.md` §6 DoD contains reconciliation against committed file truth and cleanup of stale/diagnostic entities.
- **Expected**: Reconciliation steps and DoD wording are present.
- **Evidence**:
  - `10-memory-hygiene.md` §Steps:
    > "1. Read current graph: call `mcp__server-memory__read_graph()`."
    > "2. Compare observations against current files (§8.1/§8.2, code, `.hybrid/status.json`)."
    > "3. For each discrepancy: ... If observation is stale/obsolete → call `delete_observations` (or `delete_entities`/`delete_relations` if the node itself is obsolete)."
    > "4. Prefix or remove diagnostic/test entities (`TEST_`, `DIAG_`) after they are no longer needed."
    > "5. Record reconciliation summary in the Parent §8.2 Memory Pointers update log."
    > "## Rule: Code truth wins
    > Memory must never override current file/git reality. Any conflict is resolved in favor of the codebase."
  - `hybrid-template.md` §6 DoD:
    > "- [ ] If `mcp/server-memory` is enabled, corresponding session memory has been serialized and written back to `8.2 Memory Pointers`.
    >   - Memory observations have been reconciled against committed file truth.
    >   - Stale, contradictory, or diagnostic-only entities/relations have been updated or removed."
- **Status**: PASS

#### AC-F: Namespace isolation
- **Action**: Confirm `.claude/skills/orchestrator-playbook/hybrid-template.md` §8.2 contains `TEST_`/`DIAG_` prefix/delete guidance. Confirm `.claude/skills/codex-spec-implementation/SKILL.md` or `.claude/skills/evaluator-prd-audit/SKILL.md` also references it.
- **Expected**: Both template and skill reference the namespace policy.
- **Evidence**:
  - `hybrid-template.md` §8.2:
    > "Diagnostic, test, sandbox or throw-away entities should be prefixed with `TEST_` or `DIAG_` and should be deleted once validation is complete to avoid polluting the long-term project knowledge graph."
  - `codex-spec-implementation/SKILL.md` §Knowledge Graph:
    > "**Namespace hygiene**: diagnostic, test, sandbox or throw-away entities should be prefixed with `TEST_` or `DIAG_` and deleted once validation is complete so they do not pollute the long-term project knowledge graph."
- **Status**: PASS

#### AC-G: Live contradiction drill
- **Action**: Create an entity `DIAG_testmemory002_conflict` with the observation `"Current status is xwhole"`. Read `.hybrid/status.json` and apply the code-truth-wins rule: delete the false observation and add the correct observation `"status is wait"`. Confirm the entity reflects the corrected fact.
- **Expected**: The false observation is removed, the correct observation is present, and the entity matches file truth.
- **Evidence**:
  - `.hybrid/status.json` contains `"status": "wait"`.
  - Created `DIAG_testmemory002_conflict` with observation `["Current status is xwhole"]`.
  - Called `delete_observations` for the false observation and `add_observations` for `"status is wait"`.
  - Final `open_nodes(names=["DIAG_testmemory002_conflict"])` returned `{"entities":[{"name":"DIAG_testmemory002_conflict","entityType":"Diagnostic","observations":["status is wait"]}],"relations":[]}`.
- **Status**: PASS

## 8. Engineering & Knowledge Index Appendix (Branch Context)
### 8.1 Branch Private File Index
> **Scope**: Files private to this branch only. Shared files are in Parent 8.1.

| File Path | File Purpose | Association Reason |
|-----------|--------------|--------------------|
| `.hybrid/test-memory-002/test-memory-002-hybrid.md` | Parent Hybrid document for TEST-MEMORY-002 | Test routing center and knowledge-graph trunk |
| `.hybrid/test-memory-002/test-memory-002-runtime-hybrid.md` | Child Hybrid document for TEST-MEMORY-002 | Runtime regression checks A-G |
| `.hybrid/test-memory-002/test-memory-002-report.md` | Final regression report | Feedback-loop analysis and next steps |

### 8.2 Branch Incremental Index References
- No branch-specific incremental index beyond Parent §8.2.

---

> **Dynamic Section (High-Frequency Volatile Section)**
> Overwritten by sub-agents every iteration round.

## 9. Evaluation Report (Branch-Specific)
### 9.1 Most Recent Evaluation Metadata
- **Evaluator/Agent**: coderX (self-evaluation for regression verification)
- **evaluation_mode**: full

### 9.2 Acceptance Criteria (AC) Compliance
| AC | Status | Evidence | Finding |
|----|--------|----------|---------|
| A | PASS | `read_graph()` and `create_entities()` both responded; `DIAG_testmemory002_agent_probe` created successfully. | Tool wrappers are fully exposed to coderX. |
| B | PASS | `02-bus-payload.md` §2.5 and `orchestrator-playbook/SKILL.md` both define first-round full docs, subsequent-round trunk + `open_nodes`, and `search_nodes` fallback. | Incremental handoff policy is documented. |
| C | PASS | Full documents = 14,977 chars; Parent §8.2 trunk = 1,309 chars; trunk + entity names ≈ 1,374 chars (~90.8% char reduction). TEST-MEMORY-001 token baseline = 3,377 vs 342 tokens (~90% savings). | Token-reduction claim is reproducible. |
| D | PASS | Both `codex-spec-implementation/SKILL.md` and `evaluator-prd-audit/SKILL.md` mandate exact names, `open_nodes` priority, code-truth-wins, and stale-observation cleanup. | Code-truth reconciliation rules are in place. |
| E | PASS | `10-memory-hygiene.md` exists with five reconciliation steps; `hybrid-template.md` §6 DoD requires reconciliation and cleanup. | Hygiene governance is documented. |
| F | PASS | `hybrid-template.md` §8.2 and `codex-spec-implementation/SKILL.md` both require `TEST_`/`DIAG_` prefixes and deletion after validation. | Namespace isolation policy is documented. |
| G | PASS | False observation `"Current status is xwhole"` deleted; corrected `"status is wait"` added; matches `.hybrid/status.json`. | Live code-truth reconciliation works. |

### 9.3 Code Issue List + Fix Instructions
- No production code issues identified during regression verification.

### 9.4 Comprehensive Evaluation Conclusion
All seven regression checks passed. Commit `e7d8faf`'s optimizations are in place: agent tool wrappers are exposed, the trunk + `open_nodes` handoff is documented in both the bus-payload module and the orchestrator playbook, token savings remain substantial (~90%), code-truth-wins and stale-observation cleanup rules are present in both coderX and evaluatorX skills, memory hygiene governance exists, namespace isolation guidance is documented, and a live contradiction drill successfully reconciled memory against `.hybrid/status.json`. No DIAG_* diagnostic entities remain in server-memory.
