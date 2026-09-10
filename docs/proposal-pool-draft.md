# Proposal Pool（方案池）格式草稿（未实施）

> 状态：草稿（2026-09-10）。只做格式与规则设计，不修改 `socratesX / orchestrateX` 现有 skill；待确认后实施。
> 定位：`docs/agent-notes-and-hybrid-tree-design.md` §4 的后续动作。行文遵循 `docs/prose-standard-draft.md`。
> 现实原型：JanusX `docs/idea/` 13 篇方案（收集→序列化→细节→扩展想法的工作法已在那跑通，本池是它的制度化）。

## 1. 池是什么、不是什么

- 是：发散想法、备选方向、非目标、后续念头的**待办停车场**。任何 mode 之外随时可写，不强制进 Tree，不强制评审。
- 不是：第二套 Hybrid Tree（无 AC、无派发、无验收），也不是第二套 Notes（未来时、可推翻、无需反向注释）。

## 2. 条目格式

```md
# Proposal: <一句话方向>

Status: exploring | scoped | adopted | dropped
Date: yyyy-mm-dd（首次提出日，不随修改更新）

## Background
<从哪来：用户原话 / 仓库事实 / 关联 Parent 或 Note 链接，一行摘要 + 链接，不抄正文>

## Options
- A: <方向> —— 代价 / 风险一行
- B: <方向> —— 代价 / 风险一行
- （含“不做”档：不做的代价是什么）

## Recommendation
<有证据才写，写明理由和代价；证据不足则写“暂无推荐”>

## Scope if adopted
<若采纳：预计 Child 边界、影响文件面、验证思路，点到为止，不展开 AC>

## Open questions
<阻塞决策的问题；答完即删行，不留历史>
```

Status 流转：`exploring`（收集中）→ `scoped`（已定界，可投影为 Tree）→ `adopted`（已投影，留链接指向 Parent/Child）/`dropped`（放弃，留一句话原因防重提，无价值直接删文件）。

## 3. 生命周期规则

1. **随时进**：`xdo/xdel/xflow` 任何时刻、或无 mode 纯讨论时，都可新建或追加条目；不触发门禁、不要求用户点头（`exploring` 是草稿态）。
2. **出池才变重**：只有 `scoped → adopted`（投影为 Parent/Child）那一刻，才走 `socratesX` 确认（xflow）或 Main Agent 定界（xdel）；出池后条目只追加指向 Tree 的链接，正文冻结。
3. **转正即迁移**：被采纳方向落地后，持久取舍另起 `implemented/` Note（按 Notes 规范重写，不搬运池条目正文）；池条目标 `adopted` 并链向 Note + Parent。
4. **定期清池**：活跃条目 > 20 或季度复盘时扫一遍——已过时（依赖消失/方向被堵死）转 `dropped` 或删除；不过期的长期想法允许一直停在 `exploring`。
5. **池条目之间可互链**（相对链接），也可链向 Notes（读决策背景）；禁链向 Child（任务编号会沉底腐烂），出池链接只指向 Parent。

## 4. socratesX 出口增补（实施时接入，不在本草稿改 skill）

现有 `Ready Summary` 不变，新增第二出口 `Proposal Pool 入池`：澄清中出现“本次不做、但值得留”的方向时，按 §2 格式落一条 `exploring`，不阻塞当前 Ready Summary 确认。一句话：**本期定的进 Tree，本期不定的进池**。

## 5. 与三分流的关系

- 执行细节 → Child（§2 `Scope if adopted` 展开后即 Child 素材）。
- 持久取舍 → Notes `implemented/`（池条目不直接转 Note，必须按 Notes 规范重写 + 反向注释）。
- 发散想法 → 本池。池是 Tree 的上游、Notes 的远祖，三者经链接可溯源，经正文不互抄。
