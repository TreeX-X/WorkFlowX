# 4. Prompt Preprocessing Rules (Optimized: With Compression)

> promptMasterX is a lightweight prompt preprocessing agent. Its responsibility is single: optimize the user's raw requirement text into high-quality, unambiguous, structured prompts, then pass them to downstream agents for execution.

**Invocation Method**: Use `Agent` tool to call `promptMasterX` (subagent_type="promptMasterX"), passing the raw requirement text as the prompt.

## 4.1 Skip Rules (Take Priority Over Auto-Trigger Rules)

When the user input satisfies **any** of the following conditions, skip promptMasterX directly and pass the raw requirement to the downstream agent:
- Input length is **<= 30 characters** (after trimming leading/trailing whitespace) -- short instructions are already concise enough
- Input **contains explicit file paths** (e.g., `src/foo.ts`, `lib/bar.py`) **or function names** (e.g., `getUserInfo`, `handleLogin`) -- precise references do not need optimization

> Rationale: Short instructions are already refined; instructions with paths/function names are already precise; promptMasterX optimization only adds overhead without producing value.

## 4.2 Auto-Trigger Rules

| Mode | Scenario | Call promptMasterX? | Description |
|---|---|---|---|
| `/xunit` | Before calling coderX | Yes (auto) | Optimize user requirement + pass original requirement together to coderX |
| `/xlocal` | After Hybrid Tree ready, before first calling coderX | Yes (auto) | PRD detection + optional auto-generation happens first; then optimize prompt for coderX |
| `/xwhole` | Planning phase | No | Planning phase needs to retain original intent for conversational clarification |
| `/xwhole` | Coder phase (after PRD confirmation) | No | PRD itself is already structured |
| `/xwhole` | Fix round after evaluator rejection | Yes (auto) | Merge and optimize evaluator suggestions + user supplements before passing to coderX |
| `/xprompt` | Direct call | Yes | Does not enter any workflow; only performs prompt engineering |

**Passing Specification**: The optimized prompt is passed as the main body to the downstream agent, with the original requirement text attached in context to prevent intent loss.

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
| promptMasterX | No compression (raw input optimization) |

**Expected Token Savings**: 30-50% reduction in multi-iteration scenarios.
