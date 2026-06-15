<div align="center">

**中文** · [English](./README.en.md)

# WorkflowX

### 让 AI 写代码像团队协作一样可控

<p align="center">
  <img src="docs/assets/WorkFlowX-Logo.png" alt="WorkflowX Logo" width="620" />
</p>

**一个纯文件驱动的多智能体协作框架 —— 把"和 AI 聊天写代码"升级为"有规划、有验收、可追踪"的工程流程**

[![License](https://img.shields.io/badge/License-MIT-3B82F6?style=for-the-badge)](./LICENSE)
[![Skills](https://img.shields.io/badge/Skills-8-10B981?style=for-the-badge)](#深入设计)
[![Agents](https://img.shields.io/badge/Agents-7-10B981?style=for-the-badge)](#深入设计)
[![Modules](https://img.shields.io/badge/Modules-8-F59E0B?style=for-the-badge)](#深入设计)

![Claude Code](https://img.shields.io/badge/Claude_Code-Skill-D97706?style=flat-square&logo=anthropic&logoColor=white)
![Codex](https://img.shields.io/badge/Codex-Skill-10B981?style=flat-square&logo=openai&logoColor=white)
![OpenCode](https://img.shields.io/badge/OpenCode-Skill-3B82F6?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMiAxNWwtNS01IDEuNDEtMS40MUwxMCAxNC4xN2w3LjU5LTcuNTlMMTkgOGwtOSA5eiIvPjwvc3ZnPg==&logoColor=white)

</div>

---

## 这是什么？

**WorkflowX 是一套装进你 AI 编程工具里的工作流框架。** 它把单个 AI"边聊边写"的随意模式，变成一条有角色分工的流水线：**一个编排者负责规划、派活、记录，一个程序员智能体负责写代码，一个评估员智能体负责独立验收**——不达标就打回重做，达标才收工。

你不需要安装任何服务或运行时。把配置文件拷进项目，它就能在 **Claude Code / OpenAI Codex / OpenCode** 里直接运行。

<p align="center">
  <img src="docs/assets/06-workflow-animation.gif" alt="WorkflowX xwhole 工作流演示" width="880" />
  <br/>
  <sub>一次完整的 xwhole 工作流：需求收束 → Hybrid Tree → 指令优化 → 编码 → 独立验收 → 修复回流 → PASS 收口</sub>
</p>

---

## 为什么需要它？

直接和单个 AI 聊天写代码，你大概率遇到过这些坑。WorkflowX 针对每一个都给了机制化的答案：

| 用 AI 写代码的痛点 | WorkflowX 的解法 |
|---|---|
| **长对话后上下文失控**，信息越堆越乱、成本越来越高 | 每个智能体在**独立上下文**中工作，只通过结构化 Payload 通信 |
| **AI 声称完成，但实际没做或做错** | **评估员独立验收**，不采信程序员的自我声明，逐条核对验收标准后才放行 |
| **需求散落在聊天记录里**，变更难追踪 | 需求沉淀为结构化 **Hybrid Tree**，支持追踪、增量修改和影响联动 |
| **编码后才发现需求理解偏差** | 规划阶段通过苏格拉底式追问和主动质疑提前暴露假设、边界与风险 |
| **多轮迭代 Token 消耗过快** | 三层 Token 优化让多轮场景节省 40–60% |
| **并行任务互相覆盖、产生分支冲突** | 每个智能体在独立 git worktree 中工作，配合跨分支违规检测 |

---

## 30 秒理解工作原理

整套框架只有一个核心循环。你只跟一个角色对话，剩下的它替你协调：

```
        你 ──提需求──▶  orchestratorX（编排者，唯一文档写入者）
                              │
                  ① 把需求写成 Hybrid Tree（结构化需求文档）
                              │
                  ②  ┌───────────────────────────────┐
                     ▼                               │ 不达标，带修复指令重来
              coderX 编码  ──Change Summary──▶  evaluatorX 独立验收
                                                     │
                  ③  达标 ──────────────────────────┘ → 收口为最终版本
```

- **orchestratorX —— 编排者**：你唯一对话的对象。负责规划需求、拆解任务、派活、记录状态。它是唯一能改需求文档的角色，因此状态一致、不会多方写乱。
- **coderX —— 程序员**：只读需求并写代码，完成后输出结构化 Change Summary。
- **evaluatorX —— 评估员**：拿到摘要后独立读取代码，对照验收标准（AC）核验。不达标就产出修复指令打回，达标才放行。
- **Hybrid Tree —— 需求文档树**：`Parent`（总纲/路由）+ 多个 `Child`（子任务，含各自验收标准）。这是整个流程的事实来源，需求变更只改这里。

> 一句话：**编排者规划，程序员实现，评估员把关，文档树记账。** 每一轮"编码→验收"不通过就自动再来（默认最多 2 轮），通过就收口。

<p align="center">
  <img src="docs/assets/01-architecture-zh.png" alt="WorkflowX 系统架构" width="880" />
  <br/>
  <sub>编排层 + 数据层：orchestratorX 调度子智能体，通过 Hybrid Tree + MCP 记忆图谱实现结构化协作</sub>
</p>

---

## 快速开始

**环境要求**：Node.js v18+

**① 安装 MCP 依赖**（用于跨会话记忆）

```bash
npm install -g @modelcontextprotocol/server-memory @modelcontextprotocol/server-sequential-thinking
```

**② 安装 WorkflowX**

| 平台 | 安装方式 |
|------|----------|
| **Claude Code** | `/plugin marketplace add https://github.com/TreeX-X/workflowX` → `/plugin install workflowx` |
| **OpenAI Codex** | `/plugins` → 搜索 `workflowx` → Install Plugin |
| **OpenCode** | 在 `opencode.json` 添加 `"plugin": ["workflowx@git+https://github.com/TreeX-X/workflowX.git"]` |
| **手动部署** | 把 `.claude/`（或 `.codex/` `.opencode/`）目录拷进项目根目录，再按 `mcp.json.template` 挂载 MCP 配置 |

**③ 跑第一条指令**

```bash
xwhole 实现用户登录功能，支持邮箱+密码和 OAuth 两种方式
```

> 接下来编排者会反问你几个关键问题、给出方案，你确认后它就自动进入"编码 → 验收 → 迭代"循环。完整示例见下方[一次完整的工作流](#一次完整的工作流)。

---

## 四种模式：用哪个？

按"改动范围"从大到小选。**不确定就直接说需求**——框架会自动分析并推荐合适的模式让你确认。

| 模式 | 一句话场景 | 规划 | 验收迭代 | 触发示例 |
|------|-----------|------|---------|---------|
| **`xwhole`** 全局 | 新功能、跨模块重构 | 多轮对话 → 生成 Hybrid Tree | 自动，最多 N 轮 | `xwhole 实现订单中心` |
| **`xwhole -parallel`** 并行 | 多个互相独立的子任务同时做<br/>*(仅 Claude Code)* | 同 xwhole，自动拆分并行 | 多评估员并行 | `/xwhole -parallel 实现用户、订单、商品三个模块` |
| **`xlocal`** 局部 | 1–2 个模块内的修改/修 bug | 跳过（自动检测/生成 PRD） | 自动，最多 N 轮 | `xlocal 修复订单列表分页 bug` |
| **`xunit`** 单元 | 单文件、小改动 | 跳过 | 默认不评估 | `xunit 给 Config 加超时配置` |

**常用参数**：`-N 3` 限定最多迭代 3 轮（默认 2）｜ `-box demo` 在沙箱分支隔离执行（仅 xwhole）

**其他指令**：

| 指令 | 作用 |
|------|------|
| `xstatus` | 一键生成高保真 HTML 工作流状态报告 |
| `xprompt [文本]` | 只优化提示词，不触发开发流程 |

> **触发语法差异**：Claude Code 与 OpenCode 用斜杠命令（`/xwhole`）；**OpenAI Codex 用自然语言前缀**（消息开头直接写 `xwhole`，无斜杠）。`-parallel` 并行模式**仅 Claude Code 支持**。

---

## 一次完整的工作流

以 `xwhole 实现用户登录功能` 为例，你会经历这 6 步：

```
①  你发起需求
    xwhole 实现用户登录功能，支持邮箱+密码和 OAuth 两种方式

②  编排者规划（Phase 1：需求发现）
    → 苏格拉底式追问：OAuth token 如何刷新？是否限制并发登录？
    → 自主探索代码库，给出 2-3 个方案及取舍
    → 你审阅后回复"确认" → 生成 Hybrid Tree

③  指令优化（promptMasterX）
    → 自动检测反模式，产出精确无歧义的执行指令

④  coderX 编码
    → 实现功能，输出 Change Summary（改动摘要）

⑤  evaluatorX 独立验收
    → 对照每条验收标准核验，输出 AC 状态表 + 问题清单
    → 不达标 → 带修复指令打回 ④，再来一轮

⑥  收口
    → 评估员确认 PASS，Hybrid Tree 落定为最终版本
```

整个过程中你只需做两件事：**回答编排者的澄清提问**，以及**在关键节点确认方案**。其余协调、派活、验收、记账全部自动完成。

---

## 深入设计

> 上面已经够你上手了。如果想了解"为什么它更省、更准、更可控"，展开下面的细节。

<details>
<summary><b>Hybrid Tree —— 结构化需求文档树</b></summary>

<br/>

所有规划产物都落成 Hybrid Tree，而不是散落在对话里：

- **Parent（总纲层）**：全局规范、NFR、DoD、路由表、全局文件索引、知识图谱概要。
- **Child（需求层）**：每个子模块一份，含本分支的**验收标准（AC）**和私有文件索引。
- **MECE 分工**：各 Child 互斥且穷尽，无遗漏、无重叠，每个任务都有明确负责人和验收标准。
- **依赖自动排队**：Child 间依赖记录在 Parent，核心循环用就绪队列（Ready Queue）按依赖顺序调度，依赖未满足的任务自动等待。
- **需求变更可追踪**：改需求只改文档树对应 Section，受影响的 Child 自动标记"需重新评估"并重入循环。

</details>

<details>
<summary><b>AC 交叉验证 —— 评估员不信任程序员</b></summary>

<br/>

evaluatorX 是一道**独立**的质量门，它不采信 coderX 的自我声明，而是：

1. 独立读取实际代码；
2. 逐条对照 Child 的验收标准（AC）；
3. 输出结构化评估报告：**AC 状态表**（pass / partial / fail / unevaluable）+ **P0/P1/P2 问题清单** + **修复指令**。

只有所有 AC 为 pass 才放行；否则修复指令回流给 coderX 进入下一轮（默认最多 2 轮，可用 `-N` 调整）。配合**独立迭代计数器 + 早退机制**，避免无效消耗。

</details>

<details>
<summary><b>三层 Token 优化 —— 多轮迭代省 40–60%</b></summary>

<br/>

<p align="center">
  <img src="docs/assets/03-token-optimization-zh.png" alt="WorkflowX 三层 Token 优化" width="880" />
</p>

| 层 | 策略 | 效果 |
|---|------|------|
| **L1 分区缓存** | 混合文档严格分区：极少变动的静态区（需求/范围/DoD）置顶，命中 LLM Prompt Cache；动态区（评估报告）置底覆写，不影响缓存 | 首轮后省 40–60% |
| **L2 干叶分离** | Markdown 只留业务"树干"大纲，实体关联等"树叶"交给 MCP 知识图谱独立维护、按需检索 | 文档精瘦 |
| **L3 记忆快照** | Hybrid Tree 只存骨架指针（实体名、关系概要），完整节点由 MCP server-memory 持久化 | 跨会话共享 · 最小上下文 |

</details>

<details>
<summary><b>苏格拉底式需求发现 —— 在规划阶段暴露问题</b></summary>

<br/>

xwhole 的 Phase 1 不急着写代码，而是先把需求问清楚：

- **加权清晰度评估**：6 维打分（功能范围 25% / 技术约束 20% / 目标用户 15% / 边界条件 15% / 验收标准 15% / 非功能需求 10%）。
- **一次一题、先探索再发问**：每个问题都基于上一个回答，且先自主搜索代码库再提问——以"我发现了 X"而非"你能告诉我 X 吗"的姿态推进。
- **主动质疑**：即使需求看起来很清晰，也强制分析 6 类风险——矛盾、边界、技术风险、隐含假设、跨模块冲突、遗漏的非功能需求。

</details>

<details>
<summary><b>智能路由系统 —— 每个请求先经状态门控</b></summary>

<br/>

WorkflowX 内置四层路由，所有输入先读 `.hybrid/status.json` 再分发：

| 路由 | 触发条件 | 处理方式 |
|------|----------|----------|
| **Route 0** | 活跃工作流（status=xwhole/xlocal/xunit） | 输入视为当前工作流一部分，支持需求增量变更 |
| **Route 1** | 探索/只读（查看/分析/搜索/git/配置） | 直接处理，不派子智能体、不改代码 |
| **Route 2** | 编码意图 + status=wait | 5 维度分析 → 推荐模式 → **弹窗必须确认** → 启动 |
| **Route 3** | 显式命令（`/x*` 或 `x*`） | 立即执行，覆盖现有工作流，无需确认 |

**状态机**：`wait`（空闲）｜`normal`（Route 1 执行中）｜`xwhole`/`xlocal`/`xunit`（对应工作流进行中）。状态由 Main Agent 唯一写入 `.hybrid/status.json`，**会话中断重启后可自动恢复**。

</details>

<details>
<summary><b>其他内置能力</b></summary>

<br/>

- **promptMasterX（Prompt 优化引擎）**：内置 `prompt-master` 技能，为 20+ 种 AI 工具生成生产级提示词，包括 9 维意图解析、工具专属路由、6 类故障扫描和一键可用输出。
- **razorX（代码美学框架）**：以"路径能否更短？认知负荷能否更低？"为准绳，Review 模式逐行扫描，Generation 模式声明式优先。
- **xstatus（状态可视化）**：一条指令生成高保真 HTML 工作流状态报告，基于 `huashu-design` 的暖白底、衬线字体和 rust 橙设计语言。
  ```bash
  xstatus                                 # 输出到 ./status-report.html 并打开
  xstatus --output ./reports/today.html   # 输出到指定路径
  ```

</details>

---

## 平台支持

三套配置工作流逻辑**完全一致**，仅触发语法与并行能力因平台而异。除 xunit 外，所有模式自动启用 Worktree 隔离。

| 平台 | 配置目录 | 触发方式 | 并行模式 |
|------|----------|----------|----------|
| **Claude Code** | `.claude/` | 斜杠命令 `/xwhole` `/xlocal` `/xunit` `/xstatus` `/xprompt` | 支持 `/xwhole -parallel`（Agent Teams） |
| **OpenAI Codex** | `.codex/` | **自然语言前缀** `xwhole` `xlocal` …（无斜杠） | 不支持 |
| **OpenCode** | `.opencode/` | 斜杠命令 `/xwhole` `/xlocal` … | 不支持 |

---

## 框架对比

> 完整对比（架构、Token 消耗、AI 痛点解决、评分明细）见 [comparison-report.md](docs/comparison-report.md)。

<table>
<tr>
<td width="50%">

**WorkflowX 的 6 项独有能力**
- Hybrid Tree 需求追踪
- AC 交叉验证
- Prompt 优化引擎
- 跨分支违规检测
- 加权苏格拉底式需求发现
- 代码美学框架

</td>
<td width="50%">

**加权总分（满分 100）**

| 框架 | 总分 |
|------|:---:|
| **WorkflowX** | **83** |
| Superpowers | 80 |
| OMC | 73 |

</td>
</tr>
</table>

<details>
<summary>展开详细评分与能力对比</summary>

<br/>

| 大类 (权重) | WorkflowX | Superpowers | OMC |
|-------------|:---------:|:-----------:|:---:|
| 架构与设计 (25%) | **9.15** | 6.70 | 7.40 |
| 工作流与流程 (30%) | **9.20** | 7.60 | 7.50 |
| 质量与可靠性 (25%) | 7.85 | **8.55** | 7.70 |
| 平台与生态 (20%) | 6.40 | **9.60** | 6.60 |
| **加权总分** | **83** | **80** | **73** |

| 能力 | WorkflowX | Superpowers | OMC |
|------|:---------:|:-----------:|:---:|
| Hybrid Tree 需求追踪 | 独有 | 不支持 | 不支持 |
| AC 交叉验证 | 独有 | 不支持 | 不支持 |
| Prompt 优化引擎 | 独有 | 不支持 | 不支持 |
| 跨分支违规检测 | 独有 | 不支持 | 不支持 |
| 苏格拉底式需求发现 | 加权 + 主动质疑 | 基础 | 基础 |
| 代码美学框架 | 独有 | 不支持 | 不支持 |
| Token 增量优化 | 系统化 | 部分 | 部分 |
| TDD 铁律 | 不支持 | 最严格 | 部分 |
| 系统化调试 | 不支持 | 四阶段法 | 部分 |
| 智能模型路由 | 不支持 | 不支持 | 支持 |
| 多 AI 交叉验证 | 不支持 | 不支持 | 支持 |
| 安全审查 (OWASP) | 部分 | 不支持 | 专业 |
| 多平台原生 | 4 平台 | 8 平台 | 2 平台 |

<p align="center">
  <img src="docs/assets/05-capabilities-zh.png" alt="WorkflowX 独有能力" width="880" />
</p>

</details>

---

## 关于

这是一个真实投入各社区使用的开源实验性项目，旨在探索多智能体协同开发的最佳实践与架构设计。

欢迎任何形式的讨论、建议与贡献！Fork 本仓库提交 Pull Request，或在 Issues 中分享你的想法。

公众号：**TreeX-AI**　·　如果对你有帮助，欢迎 Star，让更多人一起探索 AI 开发的未来。

**友情链接**：[Linux.Do](https://linux.do/) —— 为技术爱好者和专业人士提供高质量讨论与资源分享的社区。

---

<div align="center">

[MIT License](./LICENSE) · 自由使用 / 修改 / 再分发　·　Made by [@TreeX-X](https://github.com/TreeX-X)

</div>

## 星级历史

<a href="https://www.star-history.com/#TreeX-X/workflowX&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=TreeX-X/workflowX&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=TreeX-X/workflowX&type=date&theme=light&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=TreeX-X/workflowX&type=date&theme=light&legend=top-left" />
 </picture>
</a>
