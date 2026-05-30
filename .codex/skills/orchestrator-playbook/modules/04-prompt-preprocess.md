# 4. Prompt Preprocessing Rules (Prompt Preprocessing Rules)

promptMasterX is a lightweight prompt preprocessing agent. Its responsibility is single: optimize the user's raw requirement text into high-quality, unambiguous, structured prompts, then pass them to downstream agents for execution.

**Invocation Method**: Use `#tool:agent/runSubagent` to call `promptMasterX`, passing the raw requirement text as the prompt.

## 4.1 Skip Rules (Take Priority Over Auto-Trigger Rules)

When the user input satisfies **any** of the following conditions, skip promptMasterX directly and pass the raw requirement to the downstream agent:
- Input length is **<= 30 characters** (after trimming leading/trailing whitespace) -- short instructions are already concise enough
- Input **contains explicit file paths** (e.g., `src/foo.ts`, `lib/bar.py`) **or function names** (e.g., `getUserInfo`, `handleLogin`) -- precise references do not need optimization

> Rationale: Short instructions are already refined; instructions with paths/function names are already precise; promptMasterX optimization only adds overhead without producing value.

## 4.2 Auto-Trigger Rules

| Mode | Scenario | Call promptMasterX? | Description |
|---|---|---|---|
| `/xunit` | Before calling coderX | Yes (auto) | Optimize user requirement + pass original requirement together to coderX |
| `/xlocal` | Before first calling coderX | Yes (auto) | Same as above |
| `/xwhole` | Planner phase | No | Planner phase needs to retain original intent for conversational clarification |
| `/xwhole` | Coder phase (after PRD confirmation) | No | PRD itself is already structured |
| `/xwhole` | Fix round after evaluator rejection | Yes (auto) | Merge and optimize evaluator suggestions + user supplements before passing to coderX |
| `/xprompt` | Direct call | Yes | Does not enter any workflow; only performs prompt engineering |

**Passing Specification**: The optimized prompt is passed as the main body to the downstream agent, with the original requirement text attached in context to prevent intent loss.
