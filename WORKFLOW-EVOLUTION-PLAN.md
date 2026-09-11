# WorkflowX 工作流演进方案

> 历史记录。已落实事项以现行两侧 `orchestrateX/SKILL.md`、`modules/02-bus-payload.md` 与 `hybrid-template.md` 为准；本计划仅保留决策来源，不再作为执行依据。

> 本文档记录 WorkflowX 工作流的轻量化重构方向、各项改动的落实方案，以及实施顺序。
> 生成日期：2026-08-29。当前状态：核心重构已完成，进入文档收口与实际演练阶段。

---

## 1. 重构核心理念

随着 Agent 基础能力提升，WorkflowX 原有的重度编排机制（多 skill 堆叠、MCP 依赖、复杂迭代循环、冗长的 dispatch payload）反而成为限制：拉长生成时间、增加上下文负担、抑制 Agent 原生能力。重构的核心目标是 **轻量化**——移除冗余设计，让 Agent 用原生能力完成思考与记忆，保留真正有价值的编排结构。

三条判断标准：
- 该机制是否仍在解决 Agent 原生做不好的问题？如果不是，移除。
- 该机制是否会增加 Agent 的上下文负担或生成延迟？如果是，优先精简。
- 该机制是否可以被一个更轻量的 skill 或 Agent 原生能力替代？如果可以，替换。

---

## 2. 改动清单与落实方案

### 2.1 MCP 全部移除

**现状**：`config.toml` 配置了两个 MCP server：
- `server-memory`（知识图谱 / 记忆）
- `server-sequential-thinking`（深度思考链路）

**改动**：
- `server-sequential-thinking`：移除。原因：Agent 自身已具备较好的思考链路，强制走 MCP 的顺序思考会导致过长的思考链，反而降低效率。改用 Agent 原生思考能力。
- `server-memory`：移除。原因：记忆 MCP 的知识图谱检索增加了复杂度且与 Hybrid Tree 的索引机制重叠。
- `config.toml` 的 `[mcp_servers]` 段整体删除。

**落实方案**：直接删除 `config.toml` 中 `[mcp_servers.server-memory]` 和 `[mcp_servers.server-sequential-thinking]` 两段配置。同步清理所有 skill 中对 MCP 的引用（`orchestrateX` 的 module 01 环境探测、module 10 memory hygiene、Hybrid Tree 模板 Section 0 MCP Status、Section 8.2 对 `mcp/server-memory` 的引用）。

**待定项**：记忆能力的替代方案见 2.2，目前先记录设计方向，不立即落实。

### 2.2 自建轻量知识 Wiki 替代记忆 MCP

**现状**：记忆依赖 `server-memory` MCP，通过知识图谱实体/关系存储项目级知识，Hybrid Tree Section 8.2 保留图谱"主干"，叶子节点存于 MCP。

**改动方向**：设计一个极度轻量化的知识 wiki skill，融合现有 Hybrid Tree 的索引设计，替代 `server-memory` 的职能。

**设计要点（待定，先记录）**：
- 知识以 Markdown 文件形式存储在仓库内（如 `.wiki/` 或直接嵌入 Hybrid Tree），而非外部 MCP。
- 复用 Hybrid Tree 已有的 Section 8.1（文件索引）和 8.2（知识索引）结构，不再维护独立的知识图谱。
- 知识条目随 Hybrid Tree 一起生成和更新，不再有独立的 memory writeback 流程。
- skill 仅负责读写这些 Markdown 知识文件，不涉及图谱遍历、实体消歧等重逻辑。

**落实方案**：待定。需要先完成 2.11 的 Hybrid Tree 轻量化设计，再确定知识 wiki 的融合方式。

### 2.3 xmain 与 xunit 合并

**现状**：
- `xmain`：主 Agent 直接执行，不派发子智能体，每个需求重新分解。
- `xunit`：最小单元任务，派发 coderX 轻量模式（仅加载 guideX + razorX，不输出 Bus Payload）。

**改动**：合并为一个模式，统一由主 Agent 直接执行。后续 harness 流程会有改动（具体待定）。

**落实方案**：
- 合并后保留一个"直接执行"模式，命名见 2.4 的统一命名方案。
- 移除 `xunit` 的 coderX 轻量派发逻辑（Type 0 Dispatch Payload 的轻量分支）。
- 移除 `xprompt` 命令（见 2.7）。
- 合并后该模式的 harness 流程待重新设计，当前先记录"主 Agent 直接执行"为基线。

### 2.4 三模式重命名

**现状**：四个模式 `xwhole` / `xlocal` / `xunit` / `xmain`。

**改动**：合并为三个模式，重新命名。`xlocal` 和 `xwhole` 的流程也要改动（见 2.5、2.6）。

**落实方案**：
- 三模式命名已确定（混合方案 A 动作导向 + D 极简）：
  - 模式一（原 xmain + xunit 合并）：**direct**，命令 `xdo` — 直接开发，主 Agent 亲自动手
  - 模式二（原 xlocal）：**delegate**，命令 `xdel` — 委托执行，派发 coderX 一次完成，不触发 eval
  - 模式三（原 xwhole）：**orchestrate**，命令 `xflow` — 全流程编排，含规划 + 派发 + 逐个 eval + 问题移交 + 最后 Child 修复闭环
- 命名确定后，同步更新 `AGENTS.md`、`CLAUDE.md`、`.claude/commands/*.md` 和两侧 `orchestrateX` SKILL.md 中的模式名称和触发命令。

### 2.5 原 xlocal 模式调整

**现状**：xlocal 流程为环境初始化 -> PRD 检测 -> prompt 预处理 -> 核心迭代循环（coderX ↔ evaluatorX 多轮迭代，`-N` 控制轮数）。

**改动**：
- 保留 Hybrid Tree 的生成与使用。
- 保留子智能体派发（coderX 实现）。
- **移除迭代流程**：不再有 coderX ↔ evaluatorX 的多轮迭代循环。coderX 完成后流程即结束。
- **不触发 evaluatorX**：coderX 完成后流程即结束，不再触发 evaluatorX 审核。eval 审核仅在其他模式中按需使用。

**落实方案**：
- 移除 `orchestrateX` SKILL.md 中 Mode B 的 Core Iteration Loop，替换为单次派发流程：PRD/Hybrid Tree 检测 -> 派发 coderX 实现 -> 结束。
- 移除 `-N` 参数在该模式的作用。
- 移除 module 03（Post-Evaluation Document Update）在该模式的调用。
- Hybrid Tree 的 Child Section 9（Evaluation Report）保留但不再填充，xlocal 流程不触发 eval。

### 2.6 原 xwhole 模式调整

**现状**：xwhole 流程为需求发现 -> 规划对话 -> Hybrid Tree 生成 -> 核心迭代循环（多 Child 依赖图 + 就绪队列 + 每轮 coderX -> evaluatorX 迭代）。

**改动**：
- **移除迭代流程**：不再有 coderX ↔ evaluatorX 的多轮迭代。
- **保留 eval 流程**：evaluatorX 仍会执行审核。
- **逐个触发 eval**：每个 Child 由 coderX 实现完成后，立即触发 evaluatorX 审核，不等待全部 Child 完成。
- **分级修复**：eval 后由 Main Agent 分类问题。局部实现错误只对同一 Child 重新派发一次最小修复包；跨 Child 集成问题压缩为 integration note 交给受影响的后续 Child；架构或范围问题由 Main Agent 更新计划或直接处理。
- 不恢复原 coderX 实例，也不把完整历史上下文传给后续 Child；修复只携带失败测试、相关文件、接口约束和风险摘要。
- 每个 Child 默认最多一次自动修复重派发；再次失败由 Main Agent 决定是否继续。

**落实方案**：
- 移除 `orchestrateX` SKILL.md 中 Mode A 的 Core Iteration Loop（Phase 1 Ready Queue Processing + Phase 2 Blocked Queue Resolution 的迭代逻辑）。
- 替换为线性顺序流程：Hybrid Tree 生成 -> 按 Child 顺序逐个派发 coderX 实现 -> 每个 Child 实现后逐个触发 evaluatorX 审核 -> Main Agent 按问题类型执行最小修复重派发、integration note 传递或架构处理。
- 依赖图仍可用于确定 Child 执行顺序，但不再用于迭代调度。
- `-N` 参数移除。

### 2.7 promptX 移除

**现状**：`promptX` skill 和 `promptMasterX` 子智能体负责提示词预处理，`xprompt` 命令触发提示词优化。

**改动**：移除 `promptX` skill、`promptMasterX` 子智能体定义、`xprompt` 命令。

**落实方案**：
- 删除 `.codex/skills/promptX/` 和 `.claude/skills/promptX/`。
- 删除 `.codex/agents/promptMasterX.toml` 和 `.claude/agents/promptMasterX.md`。
- 删除 `.claude/commands/xprompt.md`。
- 清理两侧 `orchestrateX` SKILL.md 中对 promptMasterX 的引用。
- 清理 `AGENTS.md`、`CLAUDE.md`、`.codex/agents/README.md` 中的 promptMasterX 提及。
- 清理 module 04（prompt-preprocess）的调用点。

### 2.8 noiseX 移除

**现状**：`noiseX` 是上下文降噪单元，识别对话噪声、提取信号、输出专注提示或净化摘要。

**改动**：移除 `noiseX` skill。

**落实方案**：
- 删除 `.claude/skills/noiseX/`。
- 清理 `orchestrateX` SKILL.md（Claude 侧）中 Mode A 流程对 noiseX 的调用（Claude 版本在 Phase 1 结束后有 noiseX summary 步骤）。
- 清理 `.claude/skills/noiseX/skill.md` 中对 `orchestrateX/modules/08-requirements-discovery.md` 的反向引用（该引用随 noiseX 删除一并消失）。

### 2.9 razorX 与 guideX 调整

**现状**：
- `razorX`：代码美学框架，用"路径能否更短"和"认知负担能否更低"两个问题指导代码判断，支持 Review 与 Generate 模式。
- `guideX`：行为准则，减少常见 LLM 编码错误（避免过度复杂、外科手术式改动、明确假设、可验证的成功标准）。

**改动**：
- `razorX`：重新定位为定义"工程优雅"一词的性格行为 skill。不再是独立的代码美学审查框架，而是内化为 Agent 的工作品格——在生成代码时自然体现优雅标准。
- `guideX`：调整（具体方向待定，需结合轻量化目标重新审视其内容，移除冗余条目）。

**落实方案**：
- `razorX`：重写 SKILL.md，从"审查框架"改为"工程优雅品格定义"。核心从两个提问式判断改为对"工程优雅"的行为描述和内化标准。保留精简后的核心原则，移除 Review/Generate 模式区分。
- `guideX`：待定。需要单独评估哪些条目仍有价值、哪些与 Agent 原生能力重叠。

**最新调整**：不再分别维护 `guideX` 与 `razorX` 的完整工作模式。两者的有效原则合并为轻量 `engineeringX` skill，仅保留实现原则与完成前自审清单；工作流、路由、并行和 Hybrid Tree 约束由命令与模式指令负责。

### 2.10 苏格拉底保留并作为 xflow 前置

**现状**：`socratesX` skill 实现苏格拉底式需求澄清，通过反诘、归纳、产婆术帮助用户把模糊想法变成清晰可执行的方案。`orchestrateX` module 08 也包含苏格拉底发现流程。

**改动**：保留 `socratesX`，将其固定为 `xflow` 的前置阶段，用于需求澄清、方案比较和生成 Hybrid Tree 所需的确认结论。

**落实方案**：`xflow` 先运行 `socratesX`，用户确认目标、范围、约束和方案后，Main Agent 再创建或更新 Hybrid Tree。`xdo/xdel` 不强制运行 `socratesX`，除非用户明确要求需求澄清。

### 2.11 Hybrid Tree 轻量化

**现状**：Hybrid Tree 模板包含大量 section（Parent: 0-6 静态 + 7 路由表 + 8.1/8.2/8.3 索引 + 9 聚合；Child: 7 AC + 8.1/8.2 + 9 评估报告）。Section 0 依赖 MCP 状态，Section 8.2 依赖 `server-memory` 知识图谱。模板设计强调 Token caching（静态段在前、增量段居中、动态段在后）。

**改动**：调整为更轻量级的结构。

**落实方案**：
- 移除 Section 0（MCP Status），MCP 已移除。
- 移除 Section 8.2 对 `mcp/server-memory` 的引用，知识索引改为纯 Markdown（融合 2.2 的知识 wiki 设计）。
- 精简 Parent 模板：合并冗余 section，减少元数据开销（如 Document Status / Update Date / Author / Version 等可精简）。
- 精简 Child 模板：Branch-Specific Overrides 段在轻量化后可能不再需要。
- 具体 section 裁剪方案待定，需结合迭代流程移除后 Child Section 9（Evaluation Report）的新定位一起设计。

### 2.12 并行能力保留

**现状**：Claude 侧支持 `-parallel` 和 `-team` 参数，通过 Agent Teams 实现并行执行。`config.toml` 有 `[agents] max_threads = 6`。

**改动**：保留并行能力，且三个模式均支持并行。用户会详细设计各模式的并行调度方案。

**落实方案**：并行能力的配置保持现状（`config.toml` 的 `[agents] max_threads`、Claude 侧 `-parallel` / `-team` 参数）。三个模式均支持并行执行，具体各模式的并行调度方案待用户详细设计后落实。随模式重命名同步更新命令参数文档。

### 2.13 Agent 自审机制（新增）

**现状**：coderX 实现后直接输出 Change Summary，由 evaluatorX 做静态评估（读 diff、对照 AC、输出问题列表）。

**改动**：赋予工作 Agent 一种工程开发习惯——生成代码后自己 review 检查一遍才能通过。如果是 eval 审核，由 eval 建立测试案例测试审核，不再做静态评估。

**落实方案**：
- coderX：在实现完成后增加自审步骤。输出前先对自己的代码做一遍 review，确认无问题后才输出结果。这是内化为工作习惯的机制，不是额外的 skill 调用。
- evaluatorX：从静态评估改为测试驱动审核。eval 建立测试案例并执行测试，根据测试结果判断通过与否，不再仅靠读 diff 做人工判断。
- 需要更新 `coderX.toml` / `coderX.md` 增加自审要求。
- 需要重写 `evaluatorX.toml` / `evaluatorX.md` 和 `auditX` skill 的审核逻辑。

### 2.14 evaluatorX 转向精准快速评估

**现状**：evaluatorX 是纯分析器，读文档和代码，输出结构化 Evaluation Result Payload（AC 状态、问题、修复指令、阻塞依赖）。审核依赖人工读 diff 对照 AC。

**改动**：调整为"能否快速实现精准评估"的设计。

**落实方案**：
- 评估核心从"人工读代码判断"转向"测试案例驱动"（配合 2.13）。
- 评估速度优先：eval 不做全量代码审查，而是针对 AC 建立精准的测试案例并执行，用测试结果作为评估依据。
- 移除静态评估相关逻辑（读 diff 逐行对照 AC 的人工判断流程）。
- Evaluation Result Payload 简化：从"AC 状态 + 问题列表 + 修复指令 + 阻塞依赖"精简为"测试结果 + 失败案例 + 观察结果 + 可能原因 + 修复范围 + 回归风险 + 阻塞项"。
- `auditX` 只输出紧凑结果；Main Agent 将局部失败转换为 Repair Packet，将跨 Child 失败转换为 Integration Note。

---

## 3. 待扩展完善的项

以下是当前真正未完成或需要用户决策的内容。已落地事项不再重复列入：

| 项 | 说明 | 依赖 |
|----|------|------|
| `routeX` 最终归属 | 已合并进两侧 `orchestrateX`，Claude 侧独立 `routeX` 已移除 | 已完成 |
| `socratesX` 定位 | 作为 `xflow` 前置，负责需求澄清、方案设计和 Hybrid Tree 生成输入 | 已确认，后续只做必要精简 |
| knowledge wiki | 当前由 Hybrid Tree Knowledge Notes 覆盖，暂不新增 skill | 未来出现复用需求时再设计 |
| README 与媒体资源 | 更新 README、图片和 GIF，反映最终流程 | 等流程演练和路由决策完成 |
| 三模式实际演练 | 协议级 dry-run 已完成；仍需真实工具任务验证派发和测试命令 | 当前文档契约已完成 |

---

## 4. 当前执行顺序

1. **文档收口**：完成本次架构文档重写，并清理本计划中的过期状态。
2. **真实任务验证**：用小型任务验证 `xdo`、`xdel`、`xflow` 的实际入口、并行条件、Child 交接和分级修复。
3. **流程验证**：在真实任务中验证 `socratesX -> Hybrid Tree -> coderX -> evaluatorX` 的 xflow 前置链路。
4. **产品化文档**：流程稳定后再更新 README、图片和 GIF；本阶段不提前修改媒体内容。
5. **可选扩展**：只有出现跨任务知识复用需求时，才设计 knowledge wiki skill。

---

## 5. 确认事项（已闭环）

以下事项已由用户确认，记录最终结论：

1. **xlocal 移除迭代后的 evaluatorX 定位** [已确认]：xlocal 移除迭代后，coderX 完成后 **不再触发 evaluatorX**。流程在 coderX 完成时即结束。

2. **xflow 的 eval 与修复时机** [已确认]：逐个触发。每个 Child 由 coderX 实现后立即触发 eval；由 Main Agent 按局部实现、跨 Child 集成、架构/范围三类问题分流。局部问题默认只对原 Child 新派发一次最小修复包，跨 Child 问题交给受影响的后续 Child，架构/范围问题由 Main Agent 处理。

3. **coderX 自审与 evaluatorX 测试审核的边界** [已确认]：coderX 自审 = 自己读代码 review（不跑测试）；evaluatorX 审核 = 建立测试案例并执行测试。两者不重叠。

4. **并行能力在新流程中的位置** [已确认]：三个模式均支持并行。用户会详细设计各模式的并行调度方案。

5. **routeX 的去留** [已确认]：路由仍需要，已合并进两侧 `orchestrateX`；Claude 侧独立 `routeX` 已移除。
## 6. 三模式命名（已确定）

用户选定混合方案：取方案 A 的 direct/orchestrate + 方案 C 的 delegate，命令取极简风格。

| 模式 | 命名 | 命令 | 原模式 | 定位 |
|------|------|------|--------|------|
| 模式一 | **direct** | xdo | xmain + xunit 合并 | 直接开发，主 Agent 亲自动手，不派发子智能体 |
| 模式二 | **delegate** | xdel | xlocal | 委托执行，派发 coderX 一次完成，不触发 eval |
| 模式三 | **orchestrate** | xflow | xwhole | 全流程编排，含规划 + 派发 + 逐个 eval + 分级修复交接 |

## 7. 最新确认（2026-08-30）

1. `xmain`、`xunit` 不保留，直接替换为 `xdo`，不提供兼容别名。
2. `xdo` 默认由主 Agent 直接工作；只有用户明确要求时才启用并行 Agent。
3. `xdo` 不强制使用 harness 或 Hybrid Tree。主 Agent 可按任务需要使用 Hybrid Tree，并通过原生能力自行调度和派发。
4. `xdo` 与并行子 Agent 均遵循统一的工程开发 skill，并在工作阶段执行 review。
5. `xdel` 暂按 Hybrid Tree + coderX 一次委托 + coderX 自审设计，不触发 evaluatorX；后续可继续调整。
6. 当前 WorkflowX 重构由主 Agent 直接实施，不进行 coderX/evaluatorX 派发。
7. 工程开发原则统一由 `engineeringX` skill 提供；该 skill 不承载工作流约束，只包含实现原则和 self-review 能力。
8. Hybrid Tree 模板已轻量化：移除运行时状态、复杂元数据、知识图谱和独立评估报告；`xdel/xflow` 使用 Parent/Child，`xdo` 按需使用。
9. `specX` 与 `orchestrateX` 的新模式契约已完成迁移：`xflow` 采用线性 Child 调度，`xdel` 单次委托，`xdo` 直接执行。
10. 已完成一次三模式文档演练，未发现入口级阻断；`auditX` 与 evaluatorX 已改为 xflow 专用的测试驱动审核。
11. `xflow` 采用分级修复：局部问题最多一次最小上下文修复重派发，跨 Child 问题使用 Integration Note，架构或范围问题由 Main Agent 处理；不恢复原 child 实例，不传递完整历史上下文。
12. 项目级 `AGENTS.md` / `CLAUDE.md` 已统一为主 Agent 可直接执行的入口规则；仓库 MCP 模板已移除，用户级 Codex 配置与 WorkflowX skill/agent 已同步，用户级 Claude WorkflowX 入口也已同步。
13. README、图片和 GIF 明确延后到流程最终确认后更新，本阶段不将其视为核心重构阻塞项。
14. `routeX` 已合并进两侧 `orchestrateX`，不再维护独立路由 skill。
15. `socratesX` 保留，并固定为 `xflow` 的前置需求澄清、方案设计和 Hybrid Tree 生成输入阶段；`xdo/xdel` 不强制调用。
16. 已完成一次协议级三模式 dry-run；未执行真实代码变更或伪造 coderX/evaluatorX 结果，后续只需进行工具层验证。

> **旧版 Hybrid Tree 记录（用户确认）**：仓库中已有 `.hybrid/` 文档属于重构前旧版本，作为历史记录保留；不迁移到轻量模板、不回填当前状态，也不作为新流程的运行状态依据。新的 `xdel`/`xflow` 任务按需创建新的 Parent/Child。

## 8. 三模式流程演练（2026-08-30）

演练场景：为现有服务新增认证 API。以下为协议级 dry-run，未执行真实代码变更或伪造子 Agent 测试结果。

### xdo

`xdo` 显式进入 direct；Main Agent 读取 `engineeringX`，直接拆解并实现，完成 self-review 和可行验证后结束。默认不调用 `socratesX`、Hybrid Tree、coderX 或 evaluatorX。只有用户明确要求并行时，才将独立工作拆给原生并行 Agent。

### xdel

`xdel` 显式进入 delegate；Main Agent 读取或创建 Parent/Child，组装 Child 范围和 AC，派发一次 coderX。coderX 使用 `engineeringX + specX` 并自审，返回 Change Summary；Main Agent 接收后结束，不触发 evaluatorX，不进入迭代循环。

### xflow

`xflow` 显式进入 orchestrate；先运行 `socratesX` 澄清认证方式、边界、非目标和方案取舍，等待确认后生成 Parent/Child。随后按依赖派发 coderX，每个 Child 完成后由 evaluatorX 执行最小测试审核；失败由 Main Agent 转为 Repair Packet、Integration Note 或架构处理。演练确认没有完整上下文回传或原 Agent 恢复规则。

### 演练结论

- 三个入口的边界清晰，没有发现模式互相越权。
- `socratesX` 只位于 `xflow` 前置链路，不会污染 `xdo/xdel`。
- 并行触发条件、Child 交接和分级修复规则均可执行。
- 后续仍需在真实任务中验证工具层派发和测试命令，而不是继续增加流程约束。

### socratesX 提问策略更新（2026-08-30）

- 按分析阶段一次性提出该阶段全部未决问题，不再强制每轮只能问一个问题。
- 只有存在真实且有取舍的多个方案时才提供选项；事实确认、约束确认或单一路径直接提问。
- 确认采用自适应门槛：信息不足时分阶段批量澄清，信息充分时只提交一次 `Ready Summary`；已确认内容不重复确认，除非出现实质冲突。
- `module 08` 负责仓库事实探索，`socratesX` 负责用户决策，`orchestrateX` 负责将确认结果投影为 Hybrid Tree，Claude 与 Codex 两侧规则保持一致。
