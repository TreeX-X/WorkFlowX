# Hybrid Tree 与 Agent Notes 分工及改造设计

> 状态：理解沉淀 + 改造预告（未实施）。记录日期：2026-09-10。
> 来源：`czm15053/write-notes-like-deepseek`（萃取自 `deepseek-ai/deepseek-harness` 的 `.agents/notes/` 体系）与本仓库现有 `orchestrateX / engineeringX / auditX / socratesX / hybrid-template.md`、`WORKFLOW-EVOLUTION-PLAN.md` 的对照讨论。
> 配套细则分别见 JanusX 侧 `docs/idea/DeepSeek-Agent-Notes方法论提纯与来源记录.md` 与 `docs/idea/JanusX工程理解与工作流分析.md`。

## 1. 核心理解（讨论结论）

### 1.1 两者不可互相代替

- **Hybrid Tree = 任务账本**：这次做什么、拆几步、每步什么算完。未来时，随任务生死，消费者是 coderX / evaluatorX / Main Agent。
- **Agent Notes = 决策资产**：为什么这样、放弃了什么、代价上限与重访信号。现在时，随代码共存亡（Living Law），消费者是半年后的下一个 Agent。
- 硬替的失败模式：Notes 装不下执行态（AC、依赖顺序、Repair Packet，Notes 禁未来时）；Tree 装决策史会膨胀成无人敢删的大杂烩（正好违反本仓库轻量化初衷）。

### 1.2 持久化语义相反

- Tree：只追加不改写历史。Child Complete 后冻结，错了开新 Child 修；任务闭环后沉底，检索只读 Active Parent + Notes，不读旧 Child 全文。
- Notes：只改写不追加历史。改名/移包直接改正文，禁文末流水账；被完全取代才 `git mv → archived/` 冻结，无价值 `rejected` 直接删除；活跃区（所有权边界/否定性保证/安全底线/诱人深坑）禁删禁归档。

### 1.3 链接只做单向：Tree → Notes，禁 Notes → Tree

- Tree → Notes 稳定（Notes 路径是长期资产），Child/Parent 只写相对链接，不抄正文。
- Notes → Tree 必腐（任务编号会归档/删除）且引入会话泄露（`implemented/` 正文禁出现 parent/child/PR 轮次）。谁产出 Note 由 git 原子提交回答，不由正文回答。
- `proposed/` 起草期可暂记出处，转正 `implemented/` 时必须 stripped。

## 2. 预计改造方式（分阶段，遵循轻量化三原则）

### 阶段 A：新增轻量 skill（补 WORKFLOW-EVOLUTION-PLAN §2.2 knowledge wiki 的坑）

- 新增如 `noteX`（或直接复用上游 skill），只含：何时写、路径规则 `{lifecycle}/{class}/yyyy-mm-dd-topic.md`、三模板、校验命令。
- `orchestrateX/SKILL.md` 只加引用行，不加新 mode、不加新 payload 字段；`xdo` 默认不触发。
- 6 封闭 class：`feature / bug-fix / architecture / process / testing / simplification`（无 `refactor`，行为不变即 simplification）。

### 阶段 B：Hybrid Tree 只加链接，不加内容

- Parent §5 Knowledge Notes / §6 Change Notes、Child §3 Implementation Notes：允许写 `见 .agents/notes/...` 相对链接，不内联决策正文。
- `socratesX` 出口：确认的真实取舍顺手落一篇 `proposed/` 草稿。
- 流转：一次性交接（Repair Packet / Integration Note）留 Tree 随任务结束；持久约束转正为 `implemented/` + 代码入口反向注释 `// Note: … 见 …`。
- `xdel`（无 eval）更需要 Notes：它是无验收委托的唯一持久化出口。

### 阶段 C：质量门与 CI（详见第 3、4 节的决策）

- 机械门禁（脚本必过）+ Main Agent 语义抽查 + 用户点头，三道分开。
- CI 只校验 Tree→Notes 链接有效性；Notes 出站禁链 Tree（`auditX` 可机械检查 `implemented/` 正文出现 `parent|child|PR|v[0-9]` 即打回）。

### 阶段 D：双端同步与不做事项

- `.claude/` 与 `.codex/` 同步维护 skill 与模板。
- 不做：不把 Notes 校验塞进每次 `xdo` 强制门禁；不建全局 `INDEX.md`（并行 Agent 必冲突）；不把 Notes 写成第二套 wiki（靠行文去 CoT 规范拦截）。

## 3. 已确认①：xdel 无 eval，Note 质量由 Main Agent 收口三道门把关（2026-09-10）

- 不由 coderX 自批（自审只管代码，不管 Note 定稿；既当运动员又当裁判）。
- 不为 xdel 例外拉起 evaluatorX（`xdel` 不触发 eval 是已确认设计，为省成本而设）。
- 三道门（成本由低到高）：
  1. **脚本机械门**（必过）：头三行、状态与文件夹一致、`Alternatives` 必含、禁用未来时、相对链接有效；不通直接打回 coderX。
  2. **Main Agent 语义抽查**（只报缺口 ≤5 行）：动机独立性、反稻草人、代价与上限、验证可确认性；只说缺口和修法。
  3. **用户点头才落盘**：`proposed → implemented` 转正需确认；Child Complete 不等于 Note 定稿。
- `auditX` 增一条轻检查（无需跑测试）：`implemented/` 正文出现 `parent|child|PR|v数字`（过程泄露）或缺 `Alternatives` 即打回。

## 4. 已确认②：三分流支持“收集方案→序列化→细节进文档→扩展想法”（2026-09-10）

- **执行细节 → Child**：只留本次动手需要的约束，随任务冻结。
- **持久取舍 → Notes `implemented/`**：只留现在时事实 + 代价上限 + 验证，随代码走。
- **发散想法/备选/非目标 → `proposed/` 池**：允许在任何 mode 之外先沉淀（JanusX `docs/idea/` 即现实原型），不强制进 Tree；`socratesX` 确认方向时再投影为 Parent/Child，被否转 `rejected/`，无价值删除。
- 后续动作：给 `socratesX` 输出形状增补 Proposal Pool 格式（Ready Summary 之外），并明确 `xdo/xdel` 可读写池、不强制进 Tree。

## 5. harness 其他机制 survey（2026-09-10，来源 `deepseek-ai/deepseek-harness` AGENTS.md + docs/architecture.md）

除 Notes 外值得评估的机制（决议状态见各条，详见讨论正文）：

### 5.0 通用行文规范（已确认，最高优先级，2026-09-10）

用户要求：**工作中只要提到需要的文档输出，一律按流程规范**——不是只有 Notes，而是 Parent/Child、Repair Packet、Integration Note、Proposal Pool 条目、xstatus 报告等所有工作流产物。

- 新增共享行文模块（对标 `dsh-prose-standard`），被所有 skill 引用：现在时/未来时按产物类型固定、禁过程叙事与会话残留（后续 PR、本轮确认、v数字）、禁死引用（裸编号/§N 无主引用）、一事实一处（其余链过去）、保留可检索机制名与 must/may/never。
- 篇幅决议（2026-09-10）：**不设数字预算**，只留基本门禁（Parent §5/§6、Child §3 只许链接不许内联正文；Child 推导过程进池）。单篇 Note 可大可小，臃肿靠判断拆分。
- 机械可检的进脚本（如 `implemented/` 禁未来时节名），语义的进 Main Agent 抽查；默认 `xdo` 也不豁免行文规范（豁免的只是门禁触发时机，见 §6）。
- 草稿：`docs/prose-standard-draft.md`；skill 增补条文：`docs/skill-deltas-draft.md`；方案池格式：`docs/proposal-pool-draft.md`。

1. **doc-sync 门禁**（已确认）：`verify-notes`（tree/format 校验）进 `verify` 链；Tree→Notes 链接有效性进 CI。（行文规范见 §5.0，本条只留机械门禁。）
2. **Model-visible ⟺ logged 不变式**（已确认）：进模型的输入必须能从 session log 重建。→ 翻译为工作流纪律：coderX 依据的一切（AC、接口约束、失败摘要）必须已在 Child/Payload 落字；口头约定禁入派发。evaluatorX 判失败时先查“依据是否落字”，没落字是 Main Agent 的错，不是 coderX 的错。
3. **Capability seam 三角色完备性**（已确认）：新能力 = Service Definition + Provider + Consumer，缺一不可。→ 新增 WorkFlowX 能力时 skill（定义）+ agent（执行）+ payload/契约（消费）必须三件套齐，不许只加其一。
4. **Snapshot 期望输出基线**（已确认）：keyless recorded-session replay。→ 2026-08-30 三模式 dry-run 应固化为期望输出基线，后续改流程先跑回归。
5. **Guard 预算纪律**（已确认）（loop-hygiene + tool-timeout）：→ 与现有“Child 最多一次自动重派发”同构，补一条预算耗尽停转规则即可，不必新建制。
6. **Labels + 原子提交纪律**（已确认）（kind/area、独立变更分 PR、Note 与代码同 PR）：→ 与原子提交呼应，写入 CONTRIBUTING。xdo 中的体现见 §6。
7. 暂缓：profiles/bundles/patch-layer 运行时组合、session format 版本化迁移链（太重，工作流层用“Tree 只追加 + Notes 原地改”已够用）；per-file 100% coverage、clone detection（搬运成本高于收益）。

## 6. 原子提交在 xdo 中的体现（已确认，2026-09-10）

`xdo` 无 Child、无 eval、无强制 harness，原子提交是它唯一的“收口门”，代替验收链保证“代码与决策不分离”：

- **同 commit 三件套**：代码改动 + Note（新建 `implemented/` 或原地同步老 Note）+ 代码入口反向注释 `// Note: … 见 …`，必须同一 commit；禁“代码先合、文档以后补”。
- **commit 信息即索引**：一行写清改了什么 + 决策指向哪篇 Note（如 `xdo: <事>（Note: .agents/notes/implemented/<class>/yyyy-mm-dd-*.md）`），git log 即反向链接，正文不再复述出处。
- **免写场景**：纯格式/错别字/无歧义重命名/打 tag → 标 `not applicable`，只提交代码，不写 Note（但仍守行文规范 §5.0，若顺手改了注释措辞）。
- **触 Note 守护模块时的强制动作**：动手前读对应 Note（防破坏性重构），收尾时原地同步事实（路径/签名/默认值），同 commit 生效；决策被推翻才开新篇 + 归档旧篇，不在 xdo 里做 Supersession 大手术（转 xflow）。
- **与行文规范的关系**：`xdo` 豁免的是“门禁触发时机”（不强制跑脚本、不强制用户点头），不豁免行文规范本身；Main Agent 自审时顺手过一遍语义抽查。

## 7. 使用方式（已确认，2026-09-10，未来用户手册底稿）
日常开工姿势不变，变化只在三个收口点：

| 时刻 | 之前 | 之后 |
|---|---|---|
| 开工 | 凭感觉选 xdo/xdel/xflow | 一样，路由规则不变 |
| 干活中 | 约束散在对话里，换会话即丢 | 约束必须已在 Child/Payload 落字，否则 coderX 可报“依据缺失” |
| 收尾 xdo | 交代码即结束 | 同 commit 加 Note（新建/原地改）+ 入口注释行；commit 信息带 Note 路径 |
| 收尾 xdel/xflow | Child Complete 即结束 | 加 Main Agent 收口：脚本门禁 → 语义抽查（≤5行）→ 用户点头；“本次不做”顺手入池 |

典型一天：上午冒出想法 → 30 秒按池格式落一条 `exploring`（不评审不开 Tree）；下午用 `xdel` 开工 → 先读池条目 + 检索旧 Note（有归属只许原地同步）；coderX 带 Note 草稿返回 → Main Agent 报 ≤5 行缺口 → 用户“接受缺口”或“补一句” → 同 commit 落盘（含代码、Note、注释、Child 更新）；讨论中“以后再做”顺手入池，散会。

三个抽屉：想做没做翻池子（`proposed/`）；正在做翻 Tree（Parent/Child，结束沉底不再读全文）；为什么这样翻 Notes（`implemented/`，入口注释行是物理索引）。

周期动作：池条目成熟 → `socratesX` 确认 → Ready Summary → Parent/Child（标 `adopted` 链过去）；池 >20 条或季度复盘扫一遍（转 `dropped`/删）；Notes 被完全取代才归档；Tree 无需扫。

心智负担：xdo 小活多 1 分钟，错别字级零增加（not applicable）；xdel 多一次点头（≤5 行）；想法记录负担下降（30 秒入池，`exploring` 无质量门）。开工不变，收口变严，想法变轻。

## 8. 实施记录（2026-09-10，新版本号待定）

已落地（双端 `.claude/` + `.codex/` 镜像）：

- 新 skill `noteX`（SKILL + templates/proposed|implemented|rejected|proposal）与 `proseX`（§1–§8）。
- `orchestrateX`：xdo 原子落盘 2 行、xdel Note 草稿与收口门 1 行、停转规则、派发落字纪律、Shared Rules 2 行。
- `engineeringX` 自审 +2 问；`auditX` Note 轻检查 1 节；`socratesX` 入池出口 1 段。
- 双端 `hybrid-template.md`：Parent §5/§6 与 Child §3 只许链接。
- 根 `AGENTS.md / CLAUDE.md` xdo 原子段；`.claude/commands/xdo.md、xdel.md` 各 +1 段；新建 `CONTRIBUTING.md`。
- 草稿转正关系：`docs/prose-standard-draft.md` → skills 内 `proseX`；`docs/proposal-pool-draft.md` → `noteX/templates/proposal.md` + socratesX 出口；`docs/skill-deltas-draft.md` 已逐条落地（本文 §3–§6 即决议原文）。

待办（未实施）：`verify-notes` 脚本（tree/format）+ 进 CI；dry-run 期望输出固化为回归基线；README/媒体资源更新（延后惯例不变）。

## 10. Review 修复记录（2026-09-10）

- proseX §9 加叙述性正文作用域（AC 清单/登记表/契约字段豁免）；路由补“模式选择问题豁免”半句，终结与 L14 的打架。
- 跨产物禁令去 `v<digit>` 正则（误伤版本号），改为语义表述；auditX 同步；机械正则留待 verify 脚本用词边界实现。
- 载体断点修复：02-bus-payload Output 改为 xdel/xflow 一律附 Note 草稿；coderX.toml/.md 输出契约同步。
- 减字：xdel Note 行拆两条；noteX “guarantees”→“invites”（准确性）。

## 9. GPT-6 Astra Prompt 经验融入（2026-09-10，来源 LINUX DO topic 2869040）

官方 Astra 行为指导中可搬运 5 组，已落地（双端）：自主行动默认执行 + 隐含授权视为开工令（orchestrateX Routing）；批准是最后一步 + 破坏性清单（发布/合并/部署/外部写入/删数据）才需确认（orchestrateX Routing）；用户指令 > skill + skill 拦停自证（引用文件与条文，区分明文与推断）（orchestrateX Shared Rules）；自然风格反 slop（proseX §9）；测试规模匹配改动、不重跑通过项（auditX §6）。

否决 1 组：子代理能委派就委派——与“并行必须用户明确要求”冲突，维持用户决策，仅允许 Main Agent 主动建议并行。模型层特性（异步 tool、steer 下沉、推理档位、偏离检测）不搬；steer 已有 Route 0 应用层等价实现。
