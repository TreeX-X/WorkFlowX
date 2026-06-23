---
name: auditX
description: >
  Structured code audit workflow supporting both PRD-based and prompt-based evaluation modes.
  evaluatorX is a pure analyzer — reads docs + code, outputs structured Evaluation Result Payload.
  Document writes are handled by Main Agent, not evaluatorX.
---

# Evaluator: Code Audit Skill (PRD-Based & Prompt-Based)

## Why This Skill Is Needed

In iterative development, an independent audit step is needed after the coding agent completes implementation:
- Whether code aligns with PRD requirements or original prompt intent
- Whether code quality meets standards
- Optimization direction for the next iteration

**evaluatorX is a pure analyzer**: reads documents and code, outputs structured Evaluation Result Payload. Does not write to any document. Document updates are handled by orchestratorX.

## Trigger Conditions

Loaded when the user or upstream agent requests "audit code", "evaluate implementation", "run evaluator", "review". orchestratorX also invokes this in prompt-based mode.

---

## Core Workflow

### Step 1: Load Specification Documents

1. Read documents passed by orchestratorX (Parent + Child hybrid paths)
2. If no hybrid document, switch to **Prompt-Based mode** (see Step 2B)
3. If specification documents exist, extract:
   - **Requirements list**: functional requirements, non-functional requirements, business rules
   - **Acceptance Criteria (AC)**: verifiable conditions for each requirement
   - **Engineering file index**: Section 8.1 main index
   - **Knowledge graph**: Section 8.2 node outlines
4. **MCP knowledge graph retrieval**:
   1. Read Parent §8.2 to collect exact entity names and relation summaries.
   2. Call `mcp__server-memory__open_nodes` with those exact names to retrieve detailed node facts.
   3. Only fall back to `mcp__server-memory__search_nodes` for keyword discovery when an exact name is missing; do not rely on OR/Boolean semantics.
5. Read Section 8.3 incremental index differences
6. **Read old Section 9**: Extract previous evaluation results for inheritance (needed by partial mode)

#### Memory vs. Code Truth

If a memory observation contradicts the current file content, `git diff`, or actual code, the code/file truth wins. The agent must flag the discrepancy in the Evaluation Report (Payload Type 2) and must update or delete the stale memory observation using `mcp__server-memory__add_observations` or `mcp__server-memory__delete_observations`.

#### Hybrid Tree Reading

Per `orchestrateX/SKILL.md` Hybrid Tree Section Map. evaluatorX-specific: read **Child Section 9** to inherit prior evaluation results (needed by partial mode).

### Step 2: Get Code Changes + Evaluation Mode Detection

1. **Read Change Summary Payload**: coderX's change summary (which files modified, which ACs claimed affected)
2. **Read git diff**: Combine with Payload scope, get unstaged + staged changes
3. If git diff is empty, get changes from the most recent commit
4. **Search context files**: Search related files for modules, interfaces, types referenced by coderX

#### Evaluation Mode Detection

| Mode | Identifier | Trigger | Behavior |
|------|-----------|---------|----------|
| **Full** | `full` | First evaluation / prior Needs Fix / no history 9.* / Payload lacks AC list | Evaluate all ACs in Child Section 7 |
| **Partial** | `partial` | Prior PASS and Payload contains non-empty AC list | Evaluate only declared ACs, inherit rest |
| **Prompt-Based** | `prompt-based` | No PRD/hybrid document [DEPRECATED for xlocal — always has Hybrid Tree] | Evaluate original user prompt intent |

**Decision rules**:
1. No hybrid document -> `prompt-based`
2. Read Child Section 9.1 `evaluation_mode` and 9.4 conclusion
3. Prior `Needs Fix` or no history -> `full`
4. Prior `PASS` and Payload has non-empty AC list -> `partial`
5. Other -> `full` (safe fallback)

**Partial mode execution**:
1. Extract prior passed AC list from Child Section 9.2
2. Identify this round's declared ACs from Payload's `Affected ACs`
3. Evaluate only ACs within declared scope
4. Unaffected ACs directly inherit prior status

#### Step 2B: Prompt-Based Mode (No PRD)

When no hybrid document exists, evaluation criteria is the **original user prompt**:

| Aspect | PRD Mode | Prompt Mode |
|--------|---------|-------------|
| Criteria | PRD requirements + AC | Original prompt intent |
| AC evaluation | Per-item | **Omitted** (no AC) |
| Issue list | Against PRD | Against prompt intent |
| Conclusion | Based on AC | Based on prompt completion |

**Prompt mode flow**:
1. Read the original prompt passed by orchestratorX
2. Decompose into **verifiable intent points**
3. For each intent point, check whether code changes satisfy: met / partially met / not met / irrelevant change
4. Execute the same code quality review as PRD mode (Step 4)
5. Output Evaluation Result Payload (same format, but AC Status Table replaced with intent point analysis)

---

### Step 3: AC Per-Item Evaluation

AC source: current Child's Section 7 (branch AC). Do not read from Parent Section 7 (that is the routing table).

Each AC must be evaluated individually:

| Status | Description |
|--------|-------------|
| Pass | Code directly proves the AC is met |
| Partial Pass | Implementation exists but is incomplete |
| Fail | Current implementation cannot satisfy the AC |
| Unevaluable | Missing runtime conditions or external dependencies |

For each AC record: original text, implementation location (file:line), judgment status, judgment basis.

Requirement-level status is derived from AC results: all Pass -> Fully Implemented, partial Pass -> Partially Implemented, all Fail -> Not Implemented.

### AC Impact Cross-Validation

**Do not trust coderX's declarations.** evaluatorX cross-validates via git diff:

1. Extract changed file list from git diff
2. Build **file <-> AC mapping** from Child Section 7
3. Compare:
   - Diff touches files associated with ACs coderX did not declare -> mark as **implicitly affected**
   - Force-evaluate these implicitly affected ACs
4. Output AC Status Table covers all **actually** affected ACs (declared + implicit)

### Cross-Branch Dependency Handling

When evaluating a Child, check Section 8.3 and Parent Section 8.3:
- If current Child depends on other Children's outputs: record dependency but **do not evaluate** other Children's code
- If dependency unsatisfied (e.g., depends on Child B but Child B status is not PASS): mark as **Blocking Dependency**
- Cross-branch conflict (two Children modify the same file): report as P0 **Cross-Branch Violation**

### Step 4: Code Quality Review

Beyond requirement alignment, review general code quality:

1. **Correctness**: logic errors, boundary omissions, null risks
2. **Robustness**: error handling, input validation
3. **Maintainability**: naming, comments, module structure
4. **Performance risks**: unnecessary loops, repeated queries
5. **Security**: injection risks, sensitive information leaks

#### Tree Mode: Ownership Awareness

- If coderX modified files in another Child's `Owned Entities` -> P0 cross-branch violation
- If modified `Referenced (shared)` -> verify backward compatibility
- If modified `Referenced (root)` -> flag for Parent-level approval

### Step 5: Output Evaluation Result Payload

**Do not write to any document.** Output structured Payload for orchestratorX to read and process. Format follows `orchestrateX/modules/02-bus-payload.md` (Payload Type 2).

### Step 6: Supplementary Search

If the following situations are discovered during evaluation, proactively search other project files:
- Changed code references functions/classes/modules not included in the changes
- Specification requirements involve integration points with existing systems
- Suspected duplicate implementation or conflict with existing functionality

Prioritize reading via 8.1 file index; supplement with 8.3 incremental differences as needed.

---

## Output Behavior Constraints

1. **Evaluate only based on visible facts**: Do not infer beyond code and specification scope. Mark uncertain items as "Pending Confirmation".
2. **Actionability**: Every issue must specify file:line so coderX can directly locate the fix.
3. **Severity distinction**: P0 blocking (must fix) / P1 improvement (optimization opportunity) / P2 suggestion (non-functional).
4. **No standard, no evaluation**: Requirements without defined evaluation criteria in the spec document are marked "Unevaluable".
5. **Index first**: Read 8.1 main index and knowledge entries before evaluation; supplement with 8.3 incremental differences when present.
