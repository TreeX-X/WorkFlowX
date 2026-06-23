# WorkflowX 配置架构文档

> **文档目标**：清晰描述 WorkflowX 的工作流设计、配置文件结构、流转机制及智能体-技能映射关系。

---

## 1. 核心概念

### 1.1 设计理念

**WorkflowX** 是一个多智能体协作开发框架，通过 **Main Agent** 作为核心编排者，协调多个专业智能体完成从需求澄清到代码实现再到质量评估的完整闭环。

核心原则：
- **职责分离**：orchestrator 编排流程、coder 实现代码、evaluator 审计质量、各司其职
- **文档驱动**：通过 Hybrid Tree 文档传递上下文和规范
- **结构化通信**：智能体间通过 Bus Payload 传递结构化信息
- **单一写入者**：Main Agent 是唯一的文档写入者，其他智能体只读

### 1.2 三种工作模式

| 模式 | 指令 | 适用场景 | 特点 |
|------|------|---------|------|
| **Mode A (whole)** | `/xwhole` | 大规模、高影响力任务 | 完整规划-编码-评估循环，自动 worktree 隔离 |
| **Mode B (local)** | `/xlocal` | 需求明确的局部模块 | PRD检测 + 迭代循环，自动 worktree 隔离 |
| **Mode C (unit)** | `/xunit` | 最小单元任务 | 单文件/最小改动，无评估环节，无隔离 |

**Mode A-parallel**: `/xwhole -parallel` 启用 Agent Teams 并行执行模式（需要 Claude Code 环境）

---

## 2. 配置文件结构

### 2.1 目录布局

```
.claude/
├── agents/                    # 智能体定义（Main Claude Agent 自身担任编排者，无独立编排者文件）
│   ├── coderX.md              # 编码智能体
│   ├── evaluatorX.md          # 评估智能体
│   ├── promptMasterX.md       # 提示词优化
│   ├── abstracterX.md         # 代码分析
│   ├── coder-teammate.md      # 并行编码队友
│   └── evaluator-teammate.md  # 并行评估队友
│
├── skills/                    # 技能模块
│   ├── orchestrator-playbook/
│   │   ├── SKILL.md           # 编排手册主文件
│   │   └── modules/           # 按需加载的模块
│   │       ├── 01-environment-init.md
│   │       ├── 02-bus-payload.md
│   │       ├── 03-post-evaluation.md
│   │       ├── 04-prompt-preprocess.md
│   │       ├── 05-parallel-setup.md
│   │       ├── 06-task-coordination.md
│   │       ├── 07-status-report.md
│   │       └── 08-requirements-discovery.md
│   ├── codex-spec-implementation/
│   │   └── SKILL.md           # coderX 规范驱动实现流程
│   ├── evaluator-prd-audit/
│   │   └── SKILL.md           # evaluatorX 审计工作流
│   ├── guidelines/
│   │   └── SKILL.md           # Karpathy 编码准则
│   ├── prompt-master/
│   │   └── SKILL.md           # 提示词优化规则
│   └── abstracter-code-summary/
│       └── SKILL.md           # 代码分析规范
│
└── settings.json              # 全局配置

.hybrid/                       # Hybrid Tree 文档存储
└── [feature-name]/
    ├── [feature]-hybrid.md    # Parent 文档
    └── child-*-hybrid.md      # Child 文档们
```

### 2.2 智能体定义文件结构

每个智能体定义（`.claude/agents/*.md`）包含：

```yaml
---
name: agentName                # 智能体标识
description: "..."             # 功能描述
tools: [...]                   # 可用工具列表
model: opus/sonnet/haiku       # 可选：指定模型
extends: baseAgent             # 可选：继承基础智能体
---

[智能体行为规范和执行规则的详细说明]
```

### 2.3 技能定义文件结构

每个技能（`.claude/skills/*/SKILL.md`）包含：

```yaml
---
name: skill-name
description: "触发条件和功能说明"
---

[技能的执行逻辑、输入输出规范、约束条件]
```

---

## 3. 智能体与技能映射

### 3.1 核心智能体及其技能

| 智能体 | 职责 | 核心技能 | 可用工具 |
|--------|------|----------|---------|
| **Main Agent** | 流程编排、文档写入、子智能体调度 | `orchestrator-playbook` | Bash, Read, Write, Edit, Agent, SendMessage, Team*, Task* |
| **coderX** | 代码实现、最小化修改 | `guidelines`<br>`codex-spec-implementation` | Bash, Read, Write, Edit, Glob, Grep, mcp |
| **evaluatorX** | 代码审计、质量评估 | `evaluator-prd-audit` | Bash, Read, Glob, Grep, mcp |
| **promptMasterX** | 提示词优化 | `prompt-master` | Read, Glob, Grep |
| **abstracterX** | 代码分析、架构总结 | `abstracter-code-summary` | Read, Glob, Grep, Bash |

### 3.2 并行模式队友智能体

| 智能体 | 继承自 | 增量工具 | 特点 |
|--------|--------|----------|------|
| **coder-teammate** | coderX | SendMessage, Task* | Agent Teams 模式下的并行编码单元 |
| **evaluator-teammate** | evaluatorX | SendMessage, Task* | Agent Teams 模式下的并行评估单元 |

**继承规则**：队友智能体继承基础智能体的所有工具、技能和行为规范，额外增加团队协作工具。

### 3.3 技能加载时机

| 技能 | 加载者 | 触发时机 |
|------|--------|---------|
| `orchestrator-playbook` | Main Agent | 工作流启动时，作为核心逻辑手册 |
| `guidelines` | coderX, coder-teammate | 每次编码任务开始时（Mode A/B/C 均需） |
| `codex-spec-implementation` | coderX, coder-teammate | Hybrid Tree 工作流（Mode A/B）时加载 |
| `evaluator-prd-audit` | evaluatorX, evaluator-teammate | 评估任务开始时 |
| `prompt-master` | promptMasterX | Main Agent 调用 Module 04 时 |
| `abstracter-code-summary` | abstracterX | 用户请求代码分析时 |

---

## 4. Hybrid Tree 文档架构

### 4.1 Parent-Child 分离原则

**Parent 文档**（路由层）：
- 全局规范、非功能需求、完成定义
- 路由表（Child 索引）
- 共享文件索引（8.1）
- 知识图谱（8.2）
- 跨分支依赖（8.3）
- 聚合评估表（9）

**Child 文档**（需求层）：
- 分支特定的验收标准（AC）
- 私有文件索引（8.1）
- 分支评估报告（9）

### 4.2 文档结构（Section 映射）

**Parent 文档结构**：
```
## 0. MCP Status                # MCP 工具可用性
## 1. Project Overview          # 项目概览
## 2. Boundaries                # 边界定义
## 3. Technical Constraints     # 技术约束
## 4. Non-Functional Requirements  # 非功能需求
## 5. Definition of Done        # 完成定义
## 6. Scope                     # 范围声明
## 7. Routing Table             # Child 路由表
## 8.1 Shared File Index        # 共享文件索引
## 8.2 Knowledge Graph          # 知识图谱大纲（详情在 MCP）
## 8.3 Cross-Branch Dependencies  # 跨分支依赖
## 9. Aggregation Table         # 聚合评估汇总
```

**Child 文档结构**：
```
## 7. Acceptance Criteria       # 分支验收标准
## 8.1 Private File Index       # 私有文件索引
## 8.2 Incremental References   # 增量引用
## 9. Evaluation Report         # 评估报告（初始为空）
```

### 4.3 读写权限

| 角色 | Parent 读 | Parent 写 | Child 读 | Child 写 |
|------|-----------|-----------|----------|----------|
| Main Agent | ✅ | ✅ 唯一写入者 | ✅ | ✅ 唯一写入者 |
| coderX | ✅ 只读 8.1/8.3 | ❌ | ✅ | ❌ |
| evaluatorX | ✅ 全部可读 | ❌ | ✅ | ❌ |

---

## 5. Bus Payload 通信协议

### 5.1 通信原则

智能体间不直接写文档，通过结构化 Payload 传递信息：
- **coderX** → Payload Type 1 → **Main Agent** → **evaluatorX**
- **evaluatorX** → Payload Type 2 → **Main Agent** → 更新文档 → **coderX**

### 5.2 Payload Type 1: Change Summary（coderX 输出）

```markdown
### Bus Payload: Change Summary
- **Changed Files**:
  - [file path] — [modification role/logic summary]
- **Affected ACs (claimed)**:
  - [AC identifier] — [change reason: new implementation / fix / adjustment]
- **Directed Audit Points**: [highlight complex logic for evaluatorX]
```

### 5.3 Payload Type 2: Evaluation Result（evaluatorX 输出）

```markdown
### Bus Payload: Evaluation Result

#### AC Status Table
| AC | Status | Eval Method | Code Location | Basis / Gap |
|----|--------|-------------|---------------|-------------|
| ... | Pass/Partial/Fail/Unevaluable | this_round/inherited | file:line | ... |

#### Issue List
| # | Type | Severity | Location | Description |
|---|------|----------|----------|-------------|
| 1 | requirement deviation / logic defect | P0/P1/P2 | file:line | ... |

#### Fix Instructions
- [ ] [file:line] — [specific fix action] (Priority: P0/P1)

#### Blocking Dependencies
- [Child path] depends on [Child path] — [reason]

#### Cross-Branch Violations
- [description of file conflicts]
```

---

## 6. 工作流流转机制

### 6.1 Mode A (whole) 流程

```
用户输入 → Main Agent 启动
    ↓
[Module 01] 环境初始化 + MCP 探测
    ↓
[Module 08] 需求发现 + 主动挑战
    ↓
Planning Phase 对话
    ↓
生成 Hybrid Tree (Parent + Children)
    ↓
[Core Iteration Loop - 串行模式]
    ├→ 读取 Parent §7 路由表
    ├→ 解析依赖关系（Parent §8.3）
    ├→ 按拓扑序遍历 Children：
    │   ├→ [Module 04] promptMasterX 优化提示词
    │   ├→ Agent(coderX, isolation="worktree")
    │   │   ├→ 读取 Parent §0-6, §8.1-8.3
    │   │   ├→ 读取 Child §7 (AC), §8.1, §9 (prior eval)
    │   │   ├→ 实现代码
    │   │   └→ 输出 Payload Type 1
    │   ├→ Main Agent 验证 Payload
    │   ├→ Agent(evaluatorX, isolation="worktree")
    │   │   ├→ 读取 Parent + Child
    │   │   ├→ 读取 git diff
    │   │   ├→ 审计代码
    │   │   └→ 输出 Payload Type 2
    │   ├→ Main Agent [Module 03] 更新文档
    │   │   ├→ 写入 Child §9
    │   │   ├→ 更新 Parent §9 聚合表
    │   │   └→ 判断迭代 / 继续 / 结束
    │   └→ 若 Needs Fix → 组装 Fix 指令 → 重新调用 coderX
    └→ 所有 Children 完成 → 工作流结束
```

### 6.2 Mode A-parallel 流程（Agent Teams）

```
用户输入 /xwhole -parallel → Main Agent 启动
    ↓
[Phase 1: Init]
    ├→ 验证环境（CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1）
    ├→ TeamCreate(team_name)
    ├→ 读取 Parent §7 → 每个 Child 创建 Task
    ├→ 读取 Parent §8.3 → 设置任务依赖（TaskUpdate addBlockedBy）
    ├→ 根据就绪任务数量生成队友（1-3 coder + 1-3 evaluator）
    │   ├→ Agent(subagent_type="coder-teammate", name="coder-1", team_name=...)
    │   └→ Agent(subagent_type="evaluator-teammate", name="evaluator-1", team_name=...)
    └→ 分配初始任务（TaskUpdate owner + status, SendMessage 通知）
    ↓
[Phase 2: Loop - 事件驱动]
    等待队友消息（自动送达）：
    ├→ coder 完成 → SendMessage 转发给 evaluator
    ├→ evaluator PASS → TaskUpdate(completed) → 解锁依赖任务 → 分配下一个
    ├→ evaluator Needs Fix → SendMessage fix 指令给 coder（受 -N 限制）
    └→ 迭代次数耗尽 → TaskUpdate(failed) → 上报用户
    ↓
[Phase 3: Cleanup]
    ├→ 验证所有任务 completed/failed
    ├→ SendMessage({type: "shutdown_request"}) 给每个队友
    ├→ TeamDelete()
    └→ 输出最终总结
```

### 6.3 Mode B (local) 流程

```
用户输入 → Main Agent 启动
    ↓
[Module 01] 环境初始化
    ↓
[Module 08] 需求发现（clarity < 5.0 时触发 Socratic Discovery）
    ↓
PRD 检测（优先级顺序）：
    1. .hybrid/[feature]/ 已存在 → 直接使用
    2. 参数包含 PRD 文件路径 → 读取并包装为 Hybrid Tree
    3. 无 PRD → 自动生成最小 Hybrid Tree
    ↓
[Module 04] promptMasterX 优化
    ↓
[Core Iteration Loop]（同 Mode A）
```

### 6.4 Mode C (unit) 流程

```
用户输入 → Main Agent 启动
    ↓
[Module 04] promptMasterX 优化
    ↓
Agent(coderX)（轻量模式）
    ├→ 只加载 guidelines 技能
    ├→ 不加载 codex-spec-implementation
    ├→ 无 Bus Payload 输出
    └→ 最小化修改
    ↓
直接上报用户（除非用户明确要求评估）
```

---

## 7. 按需加载模块索引

Main Agent 通过 `orchestrator-playbook` 的模块系统实现按需加载：

| 模块 | 触发时机 | 文件路径 |
|------|---------|---------|
| 01 | 首次进入 xwhole/xlocal/xunit | `modules/01-environment-init.md` |
| 02 | 跨智能体交接时 | `modules/02-bus-payload.md` |
| 03 | evaluatorX 返回后 | `modules/03-post-evaluation.md` |
| 04 | 调用 coderX 前（非首轮规划） | `modules/04-prompt-preprocess.md` |
| 05 | `/xwhole -parallel` 触发 | `modules/05-parallel-setup.md` |
| 06 | Module 05 完成后持续运行 | `modules/06-task-coordination.md` |
| 07 | `/xstatus` 指令 | `modules/07-status-report.md` |
| 08 | Planning Phase 前（xwhole）或 PRD 检测前（xlocal） | `modules/08-requirements-discovery.md` |

**加载优化**：模块首次读取后缓存在会话内存，后续访问直接读缓存。

---

## 8. 特殊参数说明

### 8.1 支持的参数

| 参数 | 格式 | 作用域 | 默认值 | 说明 |
|------|------|--------|--------|------|
| `-N` | `-N [1-10]` | xwhole, xlocal | `2` | 每个 Child 的最大评估迭代轮数 |
| `-box` | `-box [name]` | xwhole, xlocal | 无 | 沙箱分支名（物理隔离） |
| `-parallel` | `-parallel` | xwhole | off | 启用 Agent Teams 并行模式 |
| `-team` | `-team [name]` | xwhole (with -parallel) | `workflow-{timestamp}` | Agent Team 名称 |

### 8.2 示例

```bash
# 基础 Mode A
/xwhole Add user authentication

# 限制迭代次数
/xwhole -N 5 Refactor database layer

# 沙箱隔离
/xwhole -box feature-auth Implement OAuth

# 并行执行
/xwhole -parallel -team auth-team Multi-module auth system

# 组合使用
/xwhole -parallel -N 3 -box sandbox-test Complex feature
```

---

## 9. 文件访问规则（特殊约束）

**本项目特殊性**：源文件经过加密编码处理。

### 9.1 读取规则

| 文件类型 | 正确方式 | 错误方式 |
|---------|---------|---------|
| 项目源文件 | `rg` via Bash | Read 工具（会显示乱码） |
| `.claude/` 配置文件 | Read / Write / Edit | — |

### 9.2 修改规则

| 操作 | 正确方式 | 错误方式 |
|------|---------|---------|
| 精准修改源文件 | Edit 工具（字符串替换） | Write 工具（会破坏编码） |
| 新增内容 | `echo`/`printf` via Bash | Write 工具 |
| 配置文件修改 | Read + Write / Edit | — |

**所有智能体必须遵守 CLAUDE.md 中的文件访问规则。**

---

## 10. 快速索引

### 10.1 想修改智能体行为
→ 编辑 `.claude/agents/{agentName}.md`

### 10.2 想修改工作流逻辑
→ 编辑 `.claude/skills/orchestrator-playbook/SKILL.md` 或对应 `modules/*.md`

### 10.3 想修改编码规范
→ 编辑 `.claude/skills/guidelines/SKILL.md`

### 10.4 想修改评估标准
→ 编辑 `.claude/skills/evaluator-prd-audit/SKILL.md`

### 10.5 想查看某次工作流的文档
→ 查看 `.hybrid/{feature-name}/` 目录下的 Parent 和 Child 文档

### 10.6 想生成状态报告
→ 运行 `/xstatus` 或 `/xstatus --output path/to/report.html`

---

## 11. 设计哲学

### 11.1 为什么要 Hybrid Tree？

- **上下文传递**：跨会话、跨智能体传递需求和实现上下文
- **增量更新**：支持需求变更、迭代评估，文档持续演进
- **可追溯性**：每个 AC、每个评估结果都有明确的文档位置

### 11.2 为什么要 Bus Payload？

- **结构化通信**：避免自然语言的歧义和信息丢失
- **单一写入者**：Main Agent 统一管理文档更新，避免冲突
- **模块化**：智能体职责清晰，coderX 不需要知道如何写评估报告

### 11.3 为什么要分三种模式？

- **Mode A**：大型任务需要完整规划和多轮迭代
- **Mode B**：中型任务可以跳过规划对话，直接进入迭代
- **Mode C**：小型任务避免过度设计，快速完成

### 11.4 为什么要 Worktree 隔离？

- **安全性**：避免破坏用户当前工作分支
- **并行性**：Mode A-parallel 中多个 coder 可以同时工作在不同 worktree
- **可回滚**：失败时可以轻松丢弃 worktree，不影响主分支

---

## 12. 常见问题

**Q: Main Agent 什么时候调用哪个智能体？**
A: 根据模式和阶段：
- Mode A: Planning → promptMasterX → (coderX → evaluatorX) 循环
- Mode B: PRD 检测 → promptMasterX → (coderX → evaluatorX) 循环
- Mode C: promptMasterX → coderX（单次）

**Q: 如果 evaluatorX 发现问题，怎么反馈给 coderX？**
A: evaluatorX 输出 Payload Type 2 → Main Agent 读取 Fix Instructions → 组装成 fix prompt → 调用 coderX（带上 fix 指令）

**Q: Parent 和 Child 文档的边界是什么？**
A: Parent 存全局共享信息（NFR、全局索引、跨分支依赖），Child 存分支特定信息（AC、私有文件、分支评估）。

**Q: 如何知道当前工作流进度？**
A: 运行 `/xstatus` 生成 HTML 状态报告，显示所有 Children 的完成状态、评估结果、依赖关系。

**Q: 可以手动修改 Hybrid Tree 文档吗？**
A: 可以，但需要理解文档结构。修改后再次运行工作流时，Main Agent 会读取最新版本。

**Q: 并行模式和串行模式的区别？**
A: 串行模式中 Main Agent 依次调用 coderX/evaluatorX（一个智能体执行完再调下一个）。并行模式中多个 coder-teammate 和 evaluator-teammate 同时工作在不同任务上，通过 Task 系统协调依赖关系。

---

## 附录：完整配置清单

### A.1 智能体清单
- Main Agent（编排核心）
- coderX（编码）
- evaluatorX（评估）
- promptMasterX（提示词优化）
- abstracterX（代码分析）
- coder-teammate（并行编码）
- evaluator-teammate（并行评估）

### A.2 技能清单
- orchestrator-playbook（编排手册）
- codex-spec-implementation（规范实现流程）
- evaluator-prd-audit（审计流程）
- guidelines（Karpathy 编码准则）
- prompt-master（提示词优化）
- abstracter-code-summary（代码分析）

### A.3 关键文件路径
```
.claude/agents/          # 智能体定义
.claude/skills/          # 技能定义
.claude/settings.json    # 全局配置
.hybrid/                 # 工作流文档
CLAUDE.md                # 项目级指令
```

---

**文档版本**：v1.0  
**最后更新**：2026-06-10  
**维护者**：WorkflowX Team
