# 4. Prompt Preprocessing Rules (Optimized: With Compression)

> promptX is a lightweight intent extractor. Its responsibility is single: extract 9 dimensions from user's raw requirement text, run diagnostic checklist, and output structured prompts for coderX.

**Invocation Method**: Main Agent dispatches Agent(promptMasterX), passing the raw requirement text as the input. promptMasterX loads `promptX` internally and returns the structured prompt. Do not role-play promptMasterX in the main-agent context. When prompt preprocessing is used before coderX, Main Agent must place the promptX result into a Type 0 Dispatch Payload instead of forwarding it as a loose prompt.

## 4.1 Skip Rules (Take Priority Over Auto-Trigger Rules)

When the user input satisfies **any** of the following conditions, skip promptX and place the raw requirement into the Type 0 Dispatch Payload for coderX:
- Input length is **<= 30 characters** (after trimming leading/trailing whitespace) -- short instructions are already concise enough
- Input **contains explicit file paths** (e.g., `src/foo.ts`, `lib/bar.py`) **or function names** (e.g., `getUserInfo`, `handleLogin`) -- precise references do not need optimization

> Rationale: Short instructions are already refined; instructions with paths/function names are already precise; promptX extraction only adds overhead without producing value.

## 4.2 Auto-Trigger Rules

| Mode | Scenario | Call promptX? | Description |
|---|---|---|---|
| `xunit` | Only when `-prompt` is present | Optional | Dispatch Agent(promptMasterX), then include its structured prompt plus original requirement in the Type 0 Dispatch Payload for Agent(coderX). Without `-prompt`, include only the raw requirement in the Type 0 Dispatch Payload |
| `xlocal` | Before first calling coderX | Yes (auto) | Dispatch Agent(promptMasterX), then include the structured prompt as supplemental context in the Type 0 Dispatch Payload for Agent(coderX) |
| `xwhole` | Planner phase | No | Planner phase needs to retain original intent for conversational clarification |
| `xwhole` | Coder phase (after PRD confirmation) | No | PRD itself is already structured |
| `xwhole` | Fix round after evaluator rejection | Yes (auto) | Merge evaluator suggestions + user supplements, dispatch Agent(promptMasterX), then place the structured fix prompt in the Type 0 Dispatch Payload for Agent(coderX) |
| `xprompt` | Direct call | Yes | Does not enter any workflow; only performs intent extraction |

**Passing Specification**: When prompt preprocessing is invoked, the structured prompt is placed in the `Structured Requirement` field of the Type 0 Dispatch Payload, with the original requirement retained in `Original Requirement` to prevent intent loss.

For xlocal/xwhole Hybrid Tree workflows, Child Section 7 remains the acceptance criteria source. promptX output may clarify wording and scope, but must not override the Hybrid Tree.

## 4.3 Prompt Compression (Optimized: Token Reduction)

When constructing prompts for coderX/evaluatorX, apply compression to reduce token consumption:

### Compression Strategy

1. **Static Section Summarization** (Parent Sections 0-6):
   - First iteration: Pass full sections
   - Subsequent iterations: Replace with one-line summary: `[Global spec unchanged, see Parent §0-6]`

2. **Unchanged Child Section Compression**:
   - If Child §7 AC hasn't changed since last iteration: `[AC unchanged, see Child §7]`
   - If Child §8.1 file index hasn't changed: `[File index unchanged, see Child §8.1]`

3. **Prior Evaluation Compression**:
   - Replace full prior evaluation with: `[Prior: {PASS/Needs Fix}, {issue_count} issues, see Child §9]`

4. **Fix Instruction Focus**:
   - Extract only P0/P1 issues from Evaluation Result
   - Format as concise list: `[file:line] — [fix action]`

### Compression Application Points

| Agent Call | Compression Applied |
|------------|---------------------|
| coderX (first iteration) | No compression, full context |
| coderX (subsequent iterations) | Compress Parent §0-6, unchanged Child sections |
| evaluatorX | Compress Parent §0-6, focus on §7 AC + Change Summary |
| promptX | No compression (raw input extraction) |

**Expected Token Savings**: 30-50% reduction in multi-iteration scenarios.
