# WorkFlowX 共享行文规范（草稿，未实施）

> 状态：草稿（2026-09-10）。只做条文起草，不修改任何现有 skill；待确认后才被各 skill 引用。
> 来源：`deepseek-harness` 的 `dsh-prose-standard` 思想 + `write-notes-like-deepseek` 的 `prose-checklist.md / quality-gate.md`，按 WorkFlowX 产物体裁配。
> 对应设计文档：`docs/agent-notes-and-hybrid-tree-design.md` §5.0。

## 0. 适用范围与引用方式

凡工作流产出的文档，一律适用本规范，包括：Parent/Child、Agent Notes（proposed/implemented/rejected）、Repair Packet、Integration Note、Proposal Pool 条目、xstatus 报告、代码入口反向注释、commit 信息。

各 skill 只写一行引用（`行文遵循 docs/prose-standard-draft.md`），条文只在此一处维护。`xdo` 豁免门禁触发时机，不豁免本规范。

## 1. 时态规则（按产物固定）

| 产物 | 时态 | 禁用 |
|---|---|---|
| `implemented/` Note | 现在时（已落地事实） | `Proposal/Plan/Acceptance criteria`、变更叙事（used to/不再/now） |
| `proposed/` 条目、Child AC、Repair Packet | 未来时/祈使（要做什么、验收线） | 写成已完成口吻 |
| Parent/Child Change Notes、xstatus | 现在时 + 日期戳（当前状态） | 过程流水账（第 N 轮、v数字史） |
| commit 信息 | 祈使 + 索引（改了什么 + Note 路径） | 复述决策理由（理由只活在 Note 里） |

回归描述用现在时反事实：“若无 X 则 Y”，不写“以前用 X，现在改 Y”。

## 2. 命题完整性（写前自检）

每段保留完整命题：主体/动作、条件与时序、must/may/never、否定保证与例外、所有权、副作用、失败与后果。缺一即补。

- 点名谁做、在什么条件下、会怎样；少用“契约/边界/形态”等抽象词，除非指的就是该技术主体（写 `response fields` 不写 `response shape` 之类）。
- 保留可检索的机制名与关键 must/may/never、时序与否定强调；装饰性加粗和感叹少用。
- 只写代码说不清的：行为、失败、时序、所有权、后果与取舍；不复述代码，不写走读。

## 3. 去泄露自检（8 类命中即改）

对每段可疑文字问：**只有当时会话可见吗？HEAD 的读者能独立验证吗？** 不能则重述为仓库视角。

1. 死引用：`(decision 7)/(audit C2)/§N/plan §1.4` 无主编号 → 改为具名路径引用，无主则删引用重述事实。
2. 栈/PR 视角：`后续 PR/本 PR 新增/上一 commit` → 改为已落地的机制或扩展点；未做事项用 `TODO` 或 issue 引用。
3. 变更叙事：`used to/不再/旧 X/this cut/now` → 现在时（回归用反事实）。
4. 评审编排：`评审否掉/reviewer 确认/v5/第 N 轮` → 只留决定与理由。
5. 自证正确：`这样转是安全的，因为…` → 改为使之安全的 invariant，或删（代码已自明）。
6. 过程复述：`先 X 再 Y/测试走读` → 删，只留非显然契约。
7. 含糊占位：`应该够了/probably fine` → 升为 `TODO/FIXME` 或明确边界。
8. 语言串台：中英混杂的工作语言片段 → 翻译或删除。

**跨产物编号禁令**：`implemented/` 正文禁出现 `parent|child|PR|v数字`（Tree 编号会归档腐烂）；出处由 git 原子提交回答。`proposed/` 起草期可暂记出处，转正时 stripped。

**不算泄露（保留）**：issue 引用、`TODO(name):`、已合并 PR 引用、suppression 理由、现在时反事实、带实测值的边界、运行时 old/new 状态、已提交文档的编号。

## 4. 语义要求（脚本管不了，人来点头）

- **Problem 动机独立**：删掉 Decision 再读，还是同一个问题吗？触发清楚（什么破了/什么要变/不做会怎样）。
- **Decision 具体可行动**：理由是被 vs 逼出来的；写“用 X”就补一句“X vs Y 为何选 X”。
- **Alternatives 反稻草人**：≥2 真备选；先写对手最强论据再否；落到具体驱动条件；必含“不做/复用”档。
- **Consequences 代价收益兼备**：必答“什么变难了？维护成本？”；simplification 必写已知上限与重访信号；无基线不写“更快了”，降级为事实陈述。
- **Verification 可确认**：落到哪条路径/什么量级/跑什么命令；不写“看起来能用”。
- **Repair Packet / Integration Note**：只含失败测试、相关文件、接口约束、风险摘要；不传完整历史上下文，不恢复原 Agent 实例。

## 5. 一事实一处与引用格式

- 一个事实只在一处讲透，其余链过去；同一规则不抄两遍。
- 跨 Note 引用用相对 Markdown 链接 `[topic](../../implemented/<class>/yyyy-mm-dd-*.md)`，不裸数字。
- Tree → Notes 只写相对链接，不抄正文；Parent §5/§6、Child §3 同例。
- 代码入口反向注释固定形状：`// Note: <一句话理由> — 见 <Note 相对路径>`，选公开接口/类型定义/模块顶层导出/核心状态机入口留一行，不逐行标。

## 6. 篇幅原则（2026-09-10 决议：不设数字预算）

不设字数/行数阈值，只留基本门控。单篇 Note 可大可小，篇幅由事实复杂度决定，不由数字卡。

- 臃肿是 smell，不是红线：若一篇讲了两个决策，靠判断拆成两篇，不靠字数报警。
- 真正的门控只有结构性的：Parent §5/§6、Child §3 只允许链接 + 一行摘要、不许内联决策正文（防 Tree 膨胀）；Child 推导过程不进 Child，进 Proposal Pool。
- xstatus 只报状态与缺口是习惯建议，不是门禁。

## 7. 自检汇报形态

写完/改完按此汇报，一行一缺口，无缺口收口（≤5 行）：

```md
**语义自检：<filename>**
✅ 稳定：<动机独立 / 真备选≥2 / 代价收益兼备 …>
⚠️ 缺口：
- <位置> — <问题>，<具体修法>
建议：修后落盘 / 接受缺口直接放行
```

用户接受缺口即放行；意思判断不撑成另一道脚本门禁。

## 8. 删过头警示

删前先列全段落命题，再对照：约束别删成可选（must/never 保留）、假设别删成事实（proposed 不写成 implemented）、真事实不因“像过程叙述”而删、承重溯源不删（`实测：…` 的实测二字与来源编号是结论的根）。
