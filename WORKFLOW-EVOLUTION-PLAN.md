# WorkflowX 工作流演进方案

> 本文档记录 WorkflowX 工作流的轻量化重构方向、各项改动的落实方案，以及实施顺序。
> 生成日期：2026-08-29。状态：设计记录阶段，部分待定。

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
- 命名确定后，同步更新 `AGENTS.md`、`CLAUDE.md`、`.claude/commands/*.md`、`orchestrateX` SKILL.md、`routeX` SKILL.md 中的模式名称和触发命令。

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
- **问题移交**：eval 发现的问题不再回退给同一 coderX 迭代修复，而是移交给下一个流程的 coderX 在开发时一并解决。
- **最后一个 Child 的修复**：最后一个功能点由 coderX 开发完成后触发 eval，如果测试发现问题，可以继续派发 coderX 修复，流程不结束，直到 eval 通过。
- 此模式不再有多轮迭代循环，但最后一个 Child 保留了"eval -> 修复 -> 再 eval"的修复闭环。

**落实方案**：
- 移除 `orchestrateX` SKILL.md 中 Mode A 的 Core Iteration Loop（Phase 1 Ready Queue Processing + Phase 2 Blocked Queue Resolution 的迭代逻辑）。
- 替换为线性顺序流程：Hybrid Tree 生成 -> 按 Child 顺序逐个派发 coderX 实现 -> 每个 Child 实现后逐个触发 evaluatorX 审核 -> 问题移交给下一个 Child 的 coderX -> 最后一个 Child 保留 eval->修复->再 eval 的修复闭环。
- 依赖图仍可用于确定 Child 执行顺序，但不再用于迭代调度。
- `-N` 参数移除。

### 2.7 promptX 移除

**现状**：`promptX` skill 和 `promptMasterX` 子智能体负责提示词预处理，`xprompt` 命令触发提示词优化。

**改动**：移除 `promptX` skill、`promptMasterX` 子智能体定义、`xprompt` 命令。

**落实方案**：
- 删除 `.codex/skills/promptX/` 和 `.claude/skills/promptX/`。
- 删除 `.codex/agents/promptMasterX.toml` 和 `.claude/agents/promptMasterX.md`。
- 删除 `.claude/commands/xprompt.md`。
- 清理 `orchestrateX` SKILL.md 和 `routeX` SKILL.md 中对 promptMasterX 的引用。
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

### 2.10 苏格拉底保留但修改

**现状**：`socratesX` skill 实现苏格拉底式需求澄清，通过反诘、归纳、产婆术帮助用户把模糊想法变成清晰可执行的方案。`orchestrateX` module 08 也包含苏格拉底发现流程。

**改动**：保留苏格拉底能力，但会修改（具体待定）。

**落实方案**：待定。当前保留 `socratesX` skill 和 module 08 的苏格拉底流程，后续结合 xwhole 模式的规划阶段重构一起调整。

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
- Evaluation Result Payload 简化：从"AC 状态 + 问题列表 + 修复指令 + 阻塞依赖"精简为"测试结果 + 失败案例 + 失败原因"。
- 具体 payload 格式和 auditX skill 重写方案待定。

---

## 3. 待扩展完善的项

以下项在当前阶段仅记录方向，需要后续单独设计或等待用户决策：

| 项 | 说明 | 依赖 |
|----|------|------|
| 知识 wiki skill 设计 | 替代 server-memory 的轻量知识管理方案 | 依赖 Hybrid Tree 轻量化定稿（2.11） |
| 三模式新命名 | 已提供候选方案（见第 6 节），待用户选定 | 无 |
| 各模式并行调度方案 | 用户会详细设计三模式各自的并行调度方案 | 无 |
| routeX 合并方案 | routeX 可考虑合并进 orchestrateX 以节省 token、加快流程，需设计合并方案 | 依赖模式重命名定稿（2.4） |
| guideX 具体调整 | 需单独评估保留哪些条目 | 无 |
| 苏格拉底具体修改 | 结合 xwhole 规划阶段重构一起设计 | 依赖 xwhole 流程定稿（2.6） |

| evaluatorX 测试驱动审核的 payload 格式 | 测试结果如何结构化输出 | 依赖自审机制定稿（2.13） |
| 合并后模式的 harness 流程 | xmain + xunit 合并后的执行流程细节 | 待用户说明 harness 改动方向 |

---

## 4. 实施顺序

按依赖关系和风险程度排序，分四个阶段：

### 阶段一：移除已确定的冗余组件
低风险、无依赖，可立即执行。

1. 移除 MCP 配置（`config.toml` 删除 `[mcp_servers]` 段，清理 skill 中所有 MCP 引用）
2. 移除 `promptX` / `promptMasterX` / `xprompt`（删除文件 + 清理引用）
3. 移除 `noiseX`（删除文件 + 清理引用）
4. 删除已确认废弃的 `abstracterX`（上一轮已完成）

### 阶段二：模式合并与流程调整
中风险，涉及核心编排逻辑改动。

5. 合并 `xmain` + `xunit` 为直接执行模式（移除 xunit 轻量派发逻辑）
6. 调整原 xlocal：移除迭代循环，改为单次派发
7. 调整原 xwhole：移除迭代循环，改为线性顺序 + eval + 问题移交
8. 确定三模式新命名并全局更新

### 阶段三：Agent 行为与审核机制改造
中高风险，涉及 Agent 定义和审核逻辑重写。

9. `razorX` 重写为工程优雅品格 skill
10. `guideX` 轻量化调整
11. coderX 增加自审机制
12. evaluatorX 转向测试驱动审核（重写 evaluatorX 定义 + auditX skill）

### 阶段四：Hybrid Tree 与知识管理重构
高风险，涉及文档结构和知识管理范式变更。

13. Hybrid Tree 模板轻量化（移除 MCP 相关 section，精简结构）
14. 设计知识 wiki skill 替代记忆能力
15. 苏格拉底流程调整（结合 xwhole 规划阶段重构）
16. 合并后模式的 harness 流程定稿

---

## 5. 确认事项（已闭环）

以下事项已由用户确认，记录最终结论：

1. **xlocal 移除迭代后的 evaluatorX 定位** [已确认]：xlocal 移除迭代后，coderX 完成后 **不再触发 evaluatorX**。流程在 coderX 完成时即结束。

2. **xwhole 的 eval 时机** [已确认]：逐个触发。每个 Child 由 coderX 实现后立即触发 eval，问题移交给下一个 Child 的 coderX。最后一个功能点开发后若 eval 测试有问题，可以继续派发 coderX 修复，流程不结束，直到 eval 通过。

3. **coderX 自审与 evaluatorX 测试审核的边界** [已确认]：coderX 自审 = 自己读代码 review（不跑测试）；evaluatorX 审核 = 建立测试案例并执行测试。两者不重叠。

4. **并行能力在新流程中的位置** [已确认]：三个模式均支持并行。用户会详细设计各模式的并行调度方案。

5. **routeX 的去留** [已确认]：路由仍需要。考虑将 routeX 合并进 orchestrateX 以节省 token、加快流程。合并方案待设计（见第 3 节待扩展项）。
## 6. 三模式命名（已确定）

用户选定混合方案：取方案 A 的 direct/orchestrate + 方案 C 的 delegate，命令取极简风格。

| 模式 | 命名 | 命令 | 原模式 | 定位 |
|------|------|------|--------|------|
| 模式一 | **direct** | xdo | xmain + xunit 合并 | 直接开发，主 Agent 亲自动手，不派发子智能体 |
| 模式二 | **delegate** | xdel | xlocal | 委托执行，派发 coderX 一次完成，不触发 eval |
| 模式三 | **orchestrate** | xflow | xwhole | 全流程编排，含规划 + 派发 + 逐个 eval + 问题移交 + 最后 Child 修复闭环 |