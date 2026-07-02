# 2. Bus Payload Specification & Validation

> **Core principle**: Main Agent is the sole document writer. Downstream Bus Payloads do not carry document write instructions. Upstream Dispatch Payloads may carry Parent/Child paths only as read/routing context for subagents.

In xwhole/xlocal workflows, agents pass information via structured Payloads. Main Agent validates format, forwards Payloads, and performs document updates. xunit uses only the upstream Type 0 Dispatch Payload and does not require downstream Bus Payloads unless the user explicitly asks for evaluation.

For every automatic handoff to coderX or evaluatorX, Main Agent must first build a clear Dispatch Payload. This is the upstream execution contract. Do not rely on loose natural-language prompts such as "implement this Child", "fix the above issues", or "review this change".

---

## 2.0 Payload Type 0: Main Agent -> coderX (Dispatch Payload)

Main Agent outputs this payload as the primary input when dispatching Agent(coderX). coderX must read this payload before loading implementation context.

```markdown
### Dispatch Payload: coderX Task
- **Workflow Mode**: [xunit | xlocal | xwhole]
- **Dispatch Type**: [implement | fix | new_branch | prompt_preprocessed]
- **Task Objective**: [one concrete outcome coderX must produce]
- **Requirement Source**: [raw_user_prompt | promptX | Child Section 7 | evaluator_fix]
- **Original Requirement**: [raw user requirement or N/A]
- **Structured Requirement**: [promptX output summary or N/A]
- **Parent Path**: [path or N/A]
- **Child Path**: [path or N/A]
- **Acceptance Criteria Source**: [raw prompt | Child Section 7 | evaluator Fix Instructions]
- **Allowed Scope**:
  - [file/path/module or "auto-detect from local code"]
- **Do Not Touch**:
  - [file/path/module or "N/A"]
- **Required Skills**: [guideX, razorX, optional specX]
- **MCP Policy**: [skip | allowed | required]
- **Output Contract**: [concise summary | Bus Payload Type 1]
- **Verification Required**:
  - [test/build/static check/manual verification or "best effort with reason"]
- **Fix Instructions**: [evaluator Fix Instructions or N/A]
- **Stop Conditions**:
  - [condition where coderX must stop and return instead of guessing]
```

### Dispatch Rules

- `xunit`: `Workflow Mode=xunit`, `MCP Policy=skip`, `Required Skills=guideX, razorX`, `Output Contract=concise summary`, `Parent Path=N/A`, `Child Path=N/A`.
- `xunit -prompt`: same as xunit, but `Dispatch Type=prompt_preprocessed`, `Requirement Source=promptX`, and include both original and structured requirements.
- `xlocal/xwhole` first implementation: `Dispatch Type=implement`, `Requirement Source=Child Section 7`, `Required Skills=guideX, razorX, specX`, `Output Contract=Bus Payload Type 1`.
- Fix rounds: `Dispatch Type=fix`, `Requirement Source=evaluator_fix`, include exact evaluator Fix Instructions, and keep Child Section 7 as the acceptance source.
- New branch: `Dispatch Type=new_branch`, include the new Child path and the reason it was created.

### Dispatch Validation

Before invoking coderX, Main Agent checks that required fields are present and mode-consistent:

- `xunit` must not include Parent/Child paths, must skip MCP, and must not require Bus Payload.
- `xlocal/xwhole` must include valid Parent and Child paths, must require `specX`, and must require Bus Payload Type 1.
- Fix rounds must include non-empty `Fix Instructions`.
- If the payload cannot be assembled clearly, Main Agent must stop and ask for clarification instead of sending an ambiguous task.

---

## 2.1 Payload Type 1: coderX -> Main Agent -> evaluatorX (Change Summary)

coderX outputs after completing implementation. Main Agent validates and forwards to evaluatorX.

```markdown
### Bus Payload: Change Summary
- **Changed Files**:
  - [file path] — [modification role/logic summary]
  - ...
- **Affected ACs (claimed)**:
  - [AC identifier or summary] — [change reason: new implementation / fix / adjustment]
  - ...
- **Directed Audit Points**: [prompt evaluatorX to focus on complex logic or external dependencies]
```

> **`Affected ACs (claimed)` notes**:
> - coderX declares which ACs this round's changes affect. evaluatorX cross-validates via git diff and does not fully trust this declaration.
> - First iteration (no prior evaluation) may omit this; evaluatorX automatically enters `full` mode.
> - If missing in subsequent rounds, Main Agent issues a warning; evaluatorX falls back to `full` mode.

---

## 2.1.5 Payload Type 1.5: Main Agent -> evaluatorX (Review Dispatch)

Main Agent outputs this payload as the primary input when dispatching Agent(evaluatorX). evaluatorX must read this payload before deciding what documents, source files, or MCP nodes to inspect.

```markdown
### Dispatch Payload: evaluatorX Review Task
- **Workflow Mode**: [xlocal | xwhole | prompt]
- **Evaluation Type**: [full | partial | fix | final | prompt-based]
- **Review Objective**: [one concrete review outcome]
- **Parent Path**: [path or N/A for prompt-based]
- **Child Path**: [path or N/A for prompt-based]
- **Acceptance Source**: [Child Section 7 | original prompt]
- **Original Prompt**: [raw user prompt or N/A]
- **Prior Evaluation Source**: [Child Section 9 | N/A]
- **Change Summary**: [Payload Type 1 content or concise reference]
- **Changed Files**:
  - [file path]
- **Affected ACs Claimed**:
  - [AC identifier or summary, or "N/A for full mode"]
- **Review Focus**:
  - [specific logic, risk, integration point, or evaluator attention request]
- **Required Reads**:
  1. This Dispatch Payload
  2. Change Summary Payload
  3. git diff for Changed Files
  4. Acceptance Source content: Child Section 7 scoped by Evaluation Type, or Original Prompt for prompt-based
  5. Child Section 9 only when Prior Evaluation Source is not N/A
- **Conditional Reads**:
  - Parent Sections 0-6 only when global scope, NFR, DoD, or project constraints may be affected
  - Parent Section 8.1 only to map changed files to known ownership/index
  - Parent Section 8.3 only when dependency or cross-branch ownership is relevant
  - Parent Section 8.2 / MCP only when exact node names are needed for a named review risk
  - Additional source files only when changed code references their functions, types, API contracts, or shared state
- **Do Not Read By Default**:
  - full Parent document
  - unrelated Child documents
  - unrelated source files
  - knowledge graph deep nodes
- **Expansion Rules**:
  - Expand only for a named risk: API contract, shared file, dependency, security, data loss, test gap, or cross-branch conflict
  - Every expansion must be reported with path, reason, and result in `Context Expansion`
- **MCP Policy**: [skip | on_demand | allowed]
- **Output Contract**: Bus Payload Type 2
```

### Review Dispatch Rules

- `full`: evaluate all ACs in Child Section 7, but still read diff and changed files first.
- `partial`: evaluate claimed ACs plus ACs implicitly affected by git diff; inherit unaffected ACs from Child Section 9.
- `fix`: evaluate previous failed/partial ACs and exact Fix Instructions, then verify no regression in directly touched ACs.
- `final`: evaluate the Child or branch completion summary with the broadest review focus, but still use explicit changed files and declared review focus to guide reading.
- `prompt-based`: allowed only for explicit no-Hybrid review requests; evaluate original prompt intent and skip Parent/Child reads.

### Review Dispatch Validation

Before invoking evaluatorX, Main Agent checks that required fields are present and mode-consistent:

- `Changed Files`, `Required Reads`, `Conditional Reads`, `Expansion Rules`, and `Output Contract` must be non-empty.
- `full`, `partial`, `fix`, and `final` must include valid `Parent Path`, `Child Path`, and `Acceptance Source=Child Section 7`.
- `partial` and `fix` must include `Prior Evaluation Source=Child Section 9`.
- `partial` must include non-empty `Affected ACs Claimed` unless Main Agent intentionally falls back to `full`.
- `prompt-based` must use `Parent Path=N/A`, `Child Path=N/A`, `Acceptance Source=original prompt`, and `MCP Policy=skip` unless explicitly overridden.
- If the payload cannot be assembled clearly, Main Agent must stop and ask for clarification instead of sending an ambiguous review task.

---

## 2.2 Payload Type 2: evaluatorX -> Main Agent (Evaluation Result)

evaluatorX outputs after completing evaluation. Main Agent reads this Payload for document updates and iteration decisions.

```markdown
### Bus Payload: Evaluation Result

#### AC Status Table
| AC | Status | Eval Method | Code Location | Basis / Gap |
|----|--------|-------------|---------------|-------------|
| [AC identifier] | Pass / Partial Pass / Fail / Unevaluable | this_round / inherited | [file:line] | [basis or gap description] |

- Total: [n] | Pass: [n] (this: [n], inherited: [n]) | Partial: [n] | Fail: [n] | Unevaluable: [n]

#### Issue List
| # | Type | Severity | Location | Description |
|---|------|----------|----------|-------------|
| 1 | [requirement deviation / logic defect / spec issue] | P0/P1/P2 | [file:line] | [issue description] |

#### Fix Instructions
> Structured fix instructions. Main Agent copies these into the next Type 0 Dispatch Payload without human reinterpretation.
- [ ] [file:line] — [specific fix action] (Priority: P0/P1)
- [ ] [file:line] — [specific fix action] (Priority: P0/P1)

#### Blocking Dependencies
> Only output when unsatisfied cross-branch dependencies are detected. Empty when no blocking.
- [Child path] depends on [Child path] — [reason] (status: [current status])

#### Cross-Branch Violations
> Only output when cross-branch file conflicts are detected. Empty when no conflicts.
- [file] modified by current Child, owned by [other Child] — severity: P0

#### Context Expansion
> Only output when evaluatorX reads beyond Required Reads. Empty when no expansion.
- [path or MCP node] - Reason: [named risk] - Result: [compatible / issue found / pending]

#### Conclusion
- **Evaluation Result**: [PASS | Needs Fix]
- **evaluation_mode**: [full | partial | fix | final | prompt-based]
- **Summary**: [one paragraph summarizing implementation quality, main gaps, suggested next steps]
```

---

## 2.3 Payload Type 3: Requirement Change (Main Agent internal)

Generated by Main Agent during the Requirement Change Handling flow to drive document updates.

```markdown
### Bus Payload: Requirement Change
- **Change Type**: [adjustment | optimization | scope_expansion | scope_reduction | new_branch]
- **Needs Confirmation**: [true/false]
- **Confirmation Prompt**: [only filled when Needs Confirmation=true]

- **Target Child**: [path or "new"]

- **AC Changes**:
  - [action: add/modify/remove] [AC identifier] — [new content or change description]

- **New Child Description** (new_branch only):
  - **Description**: [new sub-module feature description]
  - **Suggested ACs**: [suggested acceptance criteria list]
  - **Suggested Files**: [suggested file scope]

- **Parent Routing Update**:
  - [action: update_row/add_row] [Child path] — scope/ac_count filled by Main Agent after Child creation

- **Dependency Changes**:
  - [action: add/remove] [Child A] -> [Child B] — [reason]

- **Affected Children**:
  - [Child path] — Status reset to "Needs Re-evaluation"
```

---

## 2.4 Validation Rules (Optimized: Fast-Path)

**Format check**: After each agent returns, Main Agent checks that all required `- **Field**:` entries in the Payload exist and are non-empty. For Type 0 and Type 1.5 Dispatch Payloads, `N/A` is allowed only where the mode-specific Dispatch Rules allow it.

**Semantic check** (Payload Type 1): At least one file in `Changed Files` must appear in `git diff`. If none match, treat as anomaly.

**Fast-Path Validation** (Optimized):
```
// Skip expensive validation when payload is from known-good source
if (payload_source === 'coderX' && 
    payload.has_field('Changed Files') && 
    payload.has_field('Affected ACs') &&
    !payload.is_first_iteration) {
  // Quick format check only, skip git diff semantic check
  return VALID;
}

// First iteration or fix round: full validation
return fullValidation(payload);
```

- **Validation failure**: Do not forward to downstream agent. Append format correction instructions and re-invoke the upstream agent. Retry at most **1** time. If second attempt also fails, stop workflow and report to human.
- **Validation pass**: Forward the validated Payload as the primary context to the downstream agent.

## 2.5 Incremental Context Passing (Optimized)

When iterating on the same Child, use incremental context to reduce token consumption. coderX receives implementation context through Type 0. evaluatorX receives review context through Type 1.5 and must not default to full Parent/Child reads.

### coderX First Iteration
```
Full context: Parent §0-6, §7, §8.1, §8.2, §8.3 + Child §7, §8.1
```

### coderX Subsequent Iterations (Same Child)

```
Incremental context:
- Parent §8.2 Memory Pointers: include the trunk only (entity names and relation summaries)
- Child §7: [Full content — branch AC, may have changed]
- Child §9: [Full content — prior evaluation report / fix instructions]
- Change Summary: [Current iteration's changes]
- Fix Instructions: [From last evaluation, if any]
```

> Deep node facts are **not** included in the prompt. The subagent reads the exact entity names from Parent §8.2 and retrieves detailed facts on demand by calling `mcp__server-memory__open_nodes(names=[...])`. Only fall back to `mcp__server-memory__search_nodes` when an exact name is missing.
>
> **Evidence**: In diagnostic TEST-MEMORY-001, full Parent+Child context was ~13,506 chars (~3,377 tokens), while the §8.2 trunk plus on-demand `open_nodes` retrieval was ~1,369 chars (~342 tokens) — roughly a 90% prompt-size reduction.

**Expected Savings**: ~90% token reduction in multi-iteration scenarios when using trunk + on-demand `open_nodes`.

### evaluatorX Review Context

evaluatorX does not use the full-context first-iteration rule. It starts from Type 1.5 Review Dispatch, reads git diff and changed file hunks first, then reads Child Section 7 and conditional Parent/Child/MCP context only as allowed by the Review Dispatch.
