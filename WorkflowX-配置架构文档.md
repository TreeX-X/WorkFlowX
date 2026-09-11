# WorkflowX 配置架构

> 本文档描述当前 WorkflowX 轻量工作流。历史版本中的 `xmain`、`xunit`、`xlocal`、`xwhole`、MCP、固定迭代循环和旧评估报告不再属于现行架构。

## 1. 设计原则

- 主 Agent 使用原生能力负责理解、拆解、调度、合并和最终判断。
- `engineeringX` 只提供实现原则和完成前 self-review，不承载路由或调度约束。
- 只有用户明确要求并行时才启用并行 Agent。
- Hybrid Tree、harness 和详细 Payload 按模式需要使用，不作为所有任务的强制前置条件。
- 任何测试或检查结果都必须以实际执行为依据。

## 2. 三种工作模式

| 模式 | 命令 | 主体行为 | Hybrid Tree | evaluatorX |
|---|---|---|---|---|
| direct | `xdo` | 主 Agent 直接实现；用户明确要求时可原生并行 | 可选 | 不默认触发 |
| delegate | `xdel` | 可追溯的单次委托（无规划与评审成本）；要速度用 `xdo`，要独立质量门用 `xflow` | 必须 | 不触发（仅用户明确要求时做独立评审） |
| orchestrate | `xflow` | 需求发现、规划、Child 调度、逐 Child 测试审核 | 必须 | 每个 Child 后触发 |

模式执行细节以两侧 `orchestrateX/SKILL.md` 为准，本表只做索引。

### 2.1 xdo

1. 主 Agent 读取用户指定的 skill 并直接工作。
2. 主 Agent 自行决定是否创建 Hybrid Tree、拆分任务或调用原生并行 Agent。
3. 并行只有在用户明确要求时启用，所有并行 Agent 遵循 `engineeringX`。
4. 完成前执行 self-review 和实际可行的验证。

### 2.2 xdel

1. 读取或创建轻量 Parent/Child 文档。
2. 为指定 Child 派发一次 coderX。
3. coderX 使用 `engineeringX` 和 `specX`，完成实现并自审。
4. Main Agent 接收结果并决定是否完成，不自动启动 evaluatorX 或迭代循环。

### 2.3 xflow

1. 先使用 `socratesX` 澄清需求、识别边界和比较方案。
2. 用户确认后，由 Main Agent 根据结论创建或更新 Parent/Child。
3. 按依赖顺序派发 coderX；依赖允许时可按用户要求并行。
4. 每个 Child 完成后触发 evaluatorX 的测试驱动审核；`UNEVALUABLE`（无可运行测试路径）时由 Main Agent 决定缩小范围、补充检查或显式记录风险后接受，不静默重试或静默通过。
5. Main Agent 对失败进行分级：
   - 局部实现错误：同一 Child 最多一次最小 Repair Packet 修复；
   - 跨 Child 集成问题：压缩为 Integration Note，传给受影响的后续 Child；
   - 架构或范围问题：Main Agent 更新计划或直接处理。
6. 不恢复原 Agent 实例，不把完整历史上下文传给后续 Child。

`socratesX` 的提问按分析阶段批量进行：一次性询问该阶段所有会影响实现的未决问题，不强制一轮一个问题。只有存在真实方案取舍时才提供选项；事实确认或单一路径直接提问。需求已经足够明确时跳过探索性提问，改为一次 `Ready Summary` 确认；已确认的决策不重复确认，除非新证据产生实质冲突。

## 3. 配置目录

```text
.codex/
├── config.toml                 # Codex 项目设置和 Agent 并发上限
├── agents/
│   ├── coderX.toml
│   ├── evaluatorX.toml
│   └── README.md
└── skills/
    ├── engineeringX/
    ├── specX/
    ├── auditX/
    ├── socratesX/
    └── orchestrateX/

.claude/
├── commands/                   # xdo/xdel/xflow/xstatus 入口
├── agents/                     # Claude 侧 coder/evaluator 定义
└── skills/                     # Claude 侧同步 skill

.hybrid/
└── [feature]/                  # xdel/xflow 使用的 Parent/Child 文档
```

两侧均由 `orchestrateX` 提供入口路由和模式执行规则。Codex 的 `AGENTS.md` 负责持久化项目入口指令；Claude 的命令文件负责显式命令入口。两侧的核心模式、skill 和 Agent 契约保持一致：两份 `orchestrateX` 逻辑相同，仅 skill 路径（`.claude/...` 与 `.codex/...`）不同，每次修改必须双端同步。

## 4. Skill 与 Agent 职责

| 组件 | 职责 |
|---|---|
| `engineeringX` | 最小改动、复用现有模式、范围控制、完成前 self-review |
| `specX` | xdel/xflow 中读取和遵循 Child 规范 |
| `orchestrateX` | xdo/xdel/xflow 路由、模式流程和 Hybrid Tree 规则 |
| `auditX` | evaluatorX 的测试驱动审核规则 |
| `socratesX` | xflow 前置需求澄清、方案比较和 Hybrid Tree 生成输入 |
| `coderX` | 按交接范围实现代码并自审 |
| `evaluatorX` | 只读，建立并执行针对 AC 的最小测试或检查 |
| Main Agent | 唯一的流程决策者、调度者、文档更新者和最终验收者 |

## 5. Hybrid Tree

> 说明：`.hybrid/` 只存放现行轻量模板的 Parent/Child。旧版本文档（`Section 0/7/8.x`、旧 `*-hybrid.md` 命名）视为历史记录，不迁移、不回填，也不作为运行状态依据；`xstatus` 默认忽略它们。新的 `xdel`/`xflow` 任务按需创建新的 Parent/Child 文档。

### Parent

- 目标和范围
- 约束与完成标准
- Child Registry
- 文件索引
- 知识备注
- 变更说明
- 完成摘要

### Child

- 任务范围和允许文件
- Acceptance Criteria
- 实现说明
- 验证结果
- Change Summary

不再包含 MCP 状态、知识图谱、运行时迭代状态或独立 Evaluation Report。

## 6. 交接契约

字段定义以两侧 `orchestrateX/modules/02-bus-payload.md` 为准。`xdo` 不使用固定 Bus Payload。`xdel/xflow` 使用简洁交接字段：目标、Parent/Child 路径、AC、允许范围、所需 skill、验证方式和输出摘要。无全局 workflow 锁；旧 `.hybrid/.workflow-lock` 如存在则删除后继续。

### Repair Packet

用于同一 Child 的局部错误，至少包含：失败测试和命令、预期/实际结果、可能原因、修复范围、对应 AC、回归风险、阻塞项和禁止修改范围。

### Integration Note

用于跨 Child 问题，至少包含：前一 Child、改变的接口契约、相关文件、观察到的问题、后续 Child 必须执行的动作和兼容性风险。

## 7. 并行规则

- 并行不是默认行为，必须由用户明确要求。
- `xdo`：主 Agent 自行拆分独立工作并调用原生并行 Agent。
- `xdel`：默认一次委托，不因任务规模自动扩展为多轮并行。
- `xflow`：依赖允许时可并行执行独立 Child；每个 Child 的审核和合并由 Main Agent 负责。
- 并行 Agent 遵循相同的 `engineeringX` 实现原则，不能自行扩大文件范围。

## 8. 配置与验证

- 项目和用户级 Codex 配置均不启用 WorkflowX MCP。
- 项目 MCP 模板已移除。
- Agent 并发上限由 `.codex/config.toml` 的 `[agents]` 控制；它不是强制并行开关。
- 验证以实际运行的测试、检查命令和 `git diff --check` 为准。
- 当前 README、图片和 GIF 属于最后阶段的产品化文档，待流程最终确认后再更新。

## 9. 已移除组件

- 命令：`xmain`、`xunit`、`xlocal`、`xwhole`
- skill：`guideX`、`razorX`、`promptX`、`abstracter-code-summary`
- Agent：`promptMasterX`、`abstracterX`
- 机制：MCP 记忆/顺序思考、固定多轮迭代、强制 harness、旧静态 P0/P1/P2 Evaluation Report
