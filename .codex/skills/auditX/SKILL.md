---
name: auditX
description: >
  Structured code audit workflow supporting both PRD-based and prompt-based evaluation modes.
  evaluatorX is a pure analyzer — reads dispatch-selected docs + code, outputs structured Evaluation Result Payload.
  Document writes are handled by Main Agent, not evaluatorX.
---

# Evaluator: Code Audit Skill (PRD-Based & Prompt-Based)

## Why This Skill Is Needed

In iterative development, an independent audit step is needed after the coding agent completes implementation:
- Whether code aligns with PRD requirements or original prompt intent
- Whether code quality meets standards
- Optimization direction for the next iteration

**evaluatorX is a pure analyzer**: reads Review Dispatch-selected documents and code, outputs structured Evaluation Result Payload. Does not write to any document. Document updates are handled by Main Agent.

## Trigger Conditions

Loaded when the user or upstream agent requests "audit code", "evaluate implementation", "run evaluator", "review". Main Agent also invokes this in prompt-based mode.

---

## Core Workflow

### Step 1: Read Review Dispatch Payload

1. Read the `Dispatch Payload: evaluatorX Review Task` handed off by Main Agent.
2. If the Review Dispatch Payload is missing, internally inconsistent, or lacks required fields, stop and return `Evaluation Contract Missing` with the missing fields. Do not infer evaluation scope from conversation history.
3. Extract:
   - **Evaluation Type**: `full | partial | fix | final | prompt-based`
   - **Parent Path / Child Path**
   - **Acceptance Source / Original Prompt**
   - **Changed Files**
   - **Affected ACs Claimed**
   - **Review Focus**
   - **Required Reads / Conditional Reads / Expansion Rules**
   - **MCP Policy**
4. If no hybrid document is provided, switch to **Prompt-Based mode** only when the dispatch explicitly says so.

### Step 1A: Required Reads, In Order

Read only the required materials first:

1. Change Summary Payload
2. git diff for Changed Files
3. changed file hunks and immediate surrounding code needed to understand the diff
4. Acceptance Source content: Child Section 7 acceptance criteria scoped by Evaluation Type, or Original Prompt for prompt-based mode
5. Child Section 9 only when `Prior Evaluation Source` is not `N/A`

This ordering is intentional: evaluatorX should understand the actual code change before expanding document context.

### Step 1B: Conditional Reads

Read additional context only when the dispatch or diff creates a named risk:

- Parent Sections 0-6: only when global scope, NFR, DoD, or project constraints may be affected.
- Parent Section 8.1: only to map changed files to known ownership/index.
- Parent Section 8.3: only when dependency or cross-branch ownership is relevant.
- Parent Section 8.2 / MCP: only when exact node names are needed for a named review risk and `MCP Policy` permits it.
- Additional source files: only when changed code references their functions, types, API contracts, or shared state.

Every conditional read must be listed in the `Context Expansion` section of the Evaluation Result Payload with path/node, reason, and result.

#### Memory vs. Code Truth

If a memory observation contradicts the current file content, `git diff`, or actual code, the code/file truth wins. evaluatorX must flag the discrepancy in the Evaluation Report (Payload Type 2) and `Context Expansion`. Do not update memory directly; Main Agent handles stale memory cleanup through the memory hygiene process.

#### Hybrid Tree Reading

Use the Review Dispatch Payload as the reading contract. The Hybrid Tree Section Map defines available sections, not permission to read them all by default. evaluatorX-specific default: read **Child Section 7**, and read **Child Section 9** only when prior evaluation inheritance is required.

### Step 2: Get Code Changes + Evaluation Mode Detection

1. **Read Change Summary Payload**: coderX's change summary (which files modified, which ACs claimed affected)
2. **Read git diff**: Combine with Review Dispatch scope, get unstaged + staged changes for Changed Files
3. If git diff is empty, get changes from the most recent commit
4. **Context expansion check**: Read related files only when the diff creates a named risk allowed by the Review Dispatch Expansion Rules

#### Evaluation Mode Detection

| Mode | Identifier | Trigger | Behavior |
|------|-----------|---------|----------|
| **Full** | `full` | Review Dispatch says `Evaluation Type=full` | Evaluate all ACs in Child Section 7 |
| **Partial** | `partial` | Review Dispatch says `Evaluation Type=partial` | Evaluate declared and implicitly affected ACs, inherit rest |
| **Fix** | `fix` | Review Dispatch says `Evaluation Type=fix` | Evaluate prior failed/partial ACs, exact Fix Instructions, and regression risk in touched ACs |
| **Final** | `final` | Review Dispatch says `Evaluation Type=final` | Evaluate Child/branch completion with the broadest review focus allowed by dispatch |
| **Prompt-Based** | `prompt-based` | Dispatch explicitly declares prompt-based evaluation without a Hybrid Tree | Evaluate original user prompt intent |

**Decision rules**:
1. Use Review Dispatch `Evaluation Type` as the source of truth. Do not re-derive mode from conversation context.
2. No hybrid document -> `prompt-based` only when Review Dispatch explicitly declares it and includes the original prompt; otherwise return `Evaluation Contract Missing`.
3. `partial` and `fix` require `Prior Evaluation Source=Child Section 9`; if missing, return `Evaluation Contract Missing`.
4. If `partial` has no affected AC list and no explicit fallback to `full`, return `Evaluation Contract Missing`.
5. If git diff implies undeclared AC impact, widen the evaluated AC set only to the implicitly affected ACs and record the basis.

**Partial mode execution**:
1. Extract prior passed AC list from Child Section 9.2
2. Identify this round's declared ACs from Payload's `Affected ACs`
3. Evaluate only ACs within declared scope
4. Unaffected ACs directly inherit prior status

**Fix mode execution**:
1. Extract prior failed/partial ACs and Fix Instructions from Child Section 9.
2. Evaluate the exact Fix Instructions first.
3. Evaluate any directly touched ACs for regression risk.
4. Inherit unaffected passed ACs directly from Child Section 9.

**Final mode execution**:
1. Evaluate all ACs in Child Section 7.
2. Use Review Focus to inspect completion, integration, and regression risks.
3. Keep context expansion bounded by the same Conditional Reads and Expansion Rules.

#### Step 2B: Prompt-Based Mode (No PRD)

When no hybrid document exists, evaluation criteria is the **original user prompt**:

| Aspect | PRD Mode | Prompt Mode |
|--------|---------|-------------|
| Criteria | PRD requirements + AC | Original prompt intent |
| AC evaluation | Per-item | **Omitted** (no AC) |
| Issue list | Against PRD | Against prompt intent |
| Conclusion | Based on AC | Based on prompt completion |

**Prompt mode flow**:
1. Read the original prompt passed by Main Agent
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

**Do not write to any document.** Output structured Payload for Main Agent to read and process. Format follows `orchestrateX/modules/02-bus-payload.md` (Payload Type 2).

### Step 6: Supplementary Search

If the following situations are discovered during evaluation, supplementary search is allowed but must follow the Review Dispatch Expansion Rules:
- Changed code references functions/classes/modules not included in the changes
- Specification requirements involve integration points with existing systems
- Suspected duplicate implementation or conflict with existing functionality

Prefer the smallest useful read: changed file hunk -> directly referenced file/function/type -> Parent 8.1/8.3 only when ownership or dependency mapping is needed. Record every supplementary read in `Context Expansion`.

---

## Output Behavior Constraints

1. **Evaluate only based on visible facts**: Do not infer beyond code and specification scope. Mark uncertain items as "Pending Confirmation".
2. **Actionability**: Every issue must specify file:line so coderX can directly locate the fix.
3. **Severity distinction**: P0 blocking (must fix) / P1 improvement (optimization opportunity) / P2 suggestion (non-functional).
4. **No standard, no evaluation**: Requirements without defined evaluation criteria in the spec document are marked "Unevaluable".
5. **Dispatch first**: Read the Review Dispatch Payload and git diff before expanding document or source context; use 8.1/8.3/8.2 only under the conditional read rules.
