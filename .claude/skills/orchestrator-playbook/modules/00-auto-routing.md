# 0. Auto-Routing (一级智能路由)

> **Purpose**: Intelligent request classification and mode recommendation before entering workflow.

## 0.1 Three-Way Routing

### Route 1: Direct Handling (No Workflow)

**Trigger keywords**: 查看, 分析, 解释, 什么, 为什么, 怎么, git, commit, push, pull, branch, status, diff, log, 搜索, 找, show, explain, what, why, how, search, find

**Patterns**:
- Exploratory questions: "这个文件是做什么的？", "分析下架构", "explain this function"
- Git operations: "git status", "创建分支", "提交代码", "commit changes"
- File browsing: "查看 README", "show me config.json", "搜索关键词"
- Configuration edits: settings.json, CLAUDE.md modifications

**Action**: Handle directly without calling orchestratorX. Use Read, Grep, Bash tools as needed.

### Route 2: Smart Mode Recommendation (Ask User)

**Trigger**: Natural language programming requests without explicit mode command.

**Patterns**:
- Implementation: "重构 X", "添加 Y 功能", "实现 Z", "refactor X", "add Y feature"
- Bug fixes: "修复 X bug", "fix X issue"
- Changes: "优化 X", "改进 Y", "更新 Z", "optimize X", "improve Y"

**Action**:
1. Analyze request characteristics (see §0.2)
2. Recommend most suitable mode (see §0.3)
3. Use `AskUserQuestion` to confirm (see §0.4)
4. Execute chosen mode

### Route 3: Explicit Command (Direct Execute)

**Trigger**: `/xwhole`, `/xlocal`, `/xunit`, `/xprompt`, `/xstatus`

**Action**: Execute immediately without confirmation.

---

## 0.2 Request Analysis

Analyze natural language request across 5 dimensions:

### Dimension 1: Scope

| Pattern | Scope | Signal |
|---------|-------|--------|
| "重构整个 X 模块", "全局 X", "整体 Y" | **Global** | 全局, 整个, 全部, entire, whole, global |
| "修改 X 文件", "更新 Y 函数", "单个 Z" | **Unit** | 单个, 一个, 文件, 函数, single, file, function |
| Other | **Local** | 模块, 部分, module, part |

### Dimension 2: Complexity

| Pattern | Complexity | Signal |
|---------|------------|--------|
| "需要设计", "多个模块", "不确定怎么做" | **High** | 设计, 架构, 多个, 不确定, design, architecture, multiple, uncertain |
| "简单修改", "已知问题", "文档已有" | **Low** | 简单, 已知, 明确, simple, known, clear |
| Other | **Medium** | - |

### Dimension 3: PRD Existence

```bash
# Check if Hybrid Tree exists
if [ -d ".hybrid/*[related-to-request]*/" ]; then
  PRD_EXISTS=true
else
  PRD_EXISTS=false
fi
```

### Dimension 4: Change Type

| Keyword | Type | Recommended Mode |
|---------|------|------------------|
| 重构, refactor | Refactor | xwhole (if multi-module), xlocal (if local) |
| 添加, 实现, add, implement | New Feature | xwhole (if uncertain), xlocal (if clear) |
| 修复, fix | Bug Fix | xunit (if single file), xlocal (if module) |
| 优化, optimize | Optimization | xlocal |

### Dimension 5: Uncertainty

| Pattern | Uncertainty | Signal |
|---------|-------------|--------|
| "帮我想想", "不确定", "怎么做比较好" | **High** | 帮我, 不确定, 怎么, 比较好, help me, uncertain, how should |
| "按照 X 做", "参考 Y", "文档说 Z" | **Low** | 按照, 参考, 文档, according to, refer to, documented |

---

## 0.3 Mode Recommendation Logic

### Decision Tree

```
IF scope == Global AND (complexity == High OR uncertainty == High):
  → Recommend xwhole

ELSE IF scope == Unit AND complexity == Low:
  → Recommend xunit

ELSE IF PRD_EXISTS == true:
  → Recommend xlocal

ELSE IF change_type == "New Feature" AND uncertainty == High:
  → Recommend xwhole

ELSE:
  → Recommend xlocal (default for unclear cases)
```

### Reasoning Template

```markdown
**需求分析**：
- 范围：{Global/Local/Unit}
- 复杂度：{High/Medium/Low}
- PRD 存在：{是/否}
- 不确定性：{High/Low}

**推荐理由**：
- {为什么推荐这个模式，基于上述分析}
```

---

## 0.4 User Confirmation via AskUserQuestion

### Question Format

```javascript
AskUserQuestion({
  questions: [{
    question: "检测到编程任务：{task_summary}。基于需求分析，推荐使用 {recommended_mode} 模式。请选择执行方式：",
    header: "工作流模式",
    multiSelect: false,
    options: [
      {
        label: "{recommended_mode_label} (推荐)",
        description: "{为什么推荐 - 基于分析结果}"
      },
      {
        label: "xwhole - 完整规划",
        description: "适合大型需求、多模块改动、需要深度探索和方案设计的任务。会先进行探索和方案推敲，确认后再生成文档和实现。"
      },
      {
        label: "xlocal - 快速实现",
        description: "适合局部模块、需求明确、有现成 PRD 的任务。跳过规划阶段，直接进入实现。"
      },
      {
        label: "xunit - 最小改动",
        description: "适合单文件修复、bug 修复、最小改动的任务。轻量快速，无评估环节。"
      }
    ]
  }]
})
```

### After User Selection

```javascript
const selectedMode = userAnswer; // "xwhole - 完整规划", "xlocal - 快速实现", or "xunit - 最小改动"
const mode = selectedMode.split(" - ")[0]; // Extract "xwhole", "xlocal", or "xunit"

// Call orchestratorX with selected mode
Agent({
  subagent_type: "orchestratorX",
  description: `执行 ${mode} 工作流`,
  prompt: `Mode: ${mode}\n\nRequirement: ${original_user_request}`
});
```

---

## 0.5 Integration Points

### CLAUDE.md Update

Remove "所有任务必须通过 orchestratorX" rule. Replace with:

```markdown
## 默认行为：智能路由

1. **探索/Git 操作**：直接处理，不走工作流
2. **自然语言编程请求**：分析需求 → 推荐模式 → 用户确认 → 执行
3. **明确指令**（/xwhole 等）：直接执行，无需确认
```

### Main Claude Agent Behavior

```
User input arrives
  ↓
IF matches Route 1 patterns (explore/git/browse):
  → Handle directly (Read, Grep, Bash, etc.)
ELSE IF matches Route 3 patterns (/xwhole, /xlocal, /xunit):
  → Execute command immediately
ELSE IF matches Route 2 patterns (natural language programming):
  → Load Module 00
  → Analyze request (§0.2)
  → Recommend mode (§0.3)
  → AskUserQuestion (§0.4)
  → Execute selected mode
ELSE:
  → Respond naturally (conversational, non-task requests)
```

---

## 0.6 Examples

### Example 1: Exploratory Question

**User**: "这个项目的架构是怎样的？"

**Route**: Route 1 (Direct Handling)

**Action**: Use Glob, Grep, Read to explore project structure and explain directly.

### Example 2: Natural Language Programming

**User**: "重构数据库层"

**Route**: Route 2 (Smart Recommendation)

**Analysis**:
- Scope: Global (关键词：整个层)
- Complexity: High (重构通常需要设计)
- PRD: false (假设不存在)
- Uncertainty: Medium

**Recommendation**: xwhole

**Output**:
```
检测到编程任务：重构数据库层

需求分析：
- 范围：Global（全局模块重构）
- 复杂度：High（需要架构设计）
- PRD 存在：否
- 不确定性：Medium

推荐理由：
全局重构涉及多个模块，需要深度探索现有架构、识别风险、设计方案。建议使用 xwhole 模式进行完整规划。

[弹出 AskUserQuestion 确认]
```

### Example 3: Explicit Command

**User**: "/xunit 修复 login.ts 中的拼写错误"

**Route**: Route 3 (Explicit Command)

**Action**: Execute xunit immediately without confirmation.

### Example 4: Git Operation

**User**: "git status"

**Route**: Route 1 (Direct Handling)

**Action**: Execute `git status` via Bash, output result.

---

## 0.7 Edge Cases

**Case 1: Ambiguous Request**

User: "改一下登录"

**Handling**:
- Too vague for auto-recommendation
- Ask clarifying question first: "请问是修复 bug、添加功能、还是重构登录模块？"
- After clarification, re-analyze and recommend

**Case 2: Mixed Request**

User: "先看看代码，然后重构数据库"

**Handling**:
- Split into two phases
- Phase 1: Route 1 (explore code) - handle directly
- Phase 2: After exploration, ask: "探索完成。接下来重构数据库，推荐使用 xwhole 模式。确认？"

**Case 3: User Rejects Recommendation**

User selects different mode than recommended.

**Handling**:
- Respect user's choice
- Execute selected mode without further questions
- (Optional) Briefly explain why the other mode might have trade-offs, but proceed
