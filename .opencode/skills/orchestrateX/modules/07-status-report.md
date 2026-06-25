# Module 07: Status Report (xstatus)

> **Trigger**: `/xstatus` 或 `/xstatus --output <path>` 指令触发。
> **Output**: `./status-report.html` (默认) 或指定路径，生成后自动用默认浏览器打开。
> **Style**: huashu-design（暖白底 + 衬线 display + rust 橙 accent，反 AI slop）

## 设计原则（基于 huashu-design）

| 维度 | 选择 | 避免 |
|---|---|---|
| 字体 | Newsreader (serif display) + system sans + JetBrains Mono | Inter/Roboto 作 display |
| 底色 | 暖白 `#fafaf7` | 深蓝 `#0D1117`、纯白 |
| Accent | rust 橙 `#c04a1a` | 紫渐变、霓虹色 |
| 状态图标 | Unicode 符号 `✓ ⚙ ⏸ ⏳ ✗` | Emoji（每个 bullet 都配的）|
| 容器 | 细线 border 分隔 | 圆角卡片 + 左 border accent |
| 信息密度 | 高（开发者工具，每屏 ≥ 3 处产品差异化信息）| 装饰性 icon 堆砌 |

## 数据收集流程

### Step 0: 读取上次报告（趋势计算）

在生成新报告前，尝试读取现有 `status-report.html`（默认路径或 `--output` 指定路径）：

```bash
# 若文件存在，提取上次 COMPLETION_RATE
if [ -f "{output_path}" ]; then
  grep -oP '(?<=class="value accent">)\d+' "{output_path}" | head -1
fi
```

- 若提取成功：计算 `delta = current_rate - previous_rate`
  - `delta > 0` → 趋势 `up`，符号 `▲`，提示 `相比上次报告: +{delta}%`
  - `delta < 0` → 趋势 `down`，符号 `▼`，提示 `相比上次报告: {delta}%`
  - `delta == 0` → 趋势 `flat`，符号 `→`，提示 `相比上次报告: 持平`
- 若文件不存在或提取失败：不显示趋势指示器（`{TREND_INDICATOR}` 替换为空字符串）

### Step 1: 扫描 `.hybrid/` 目录

```bash
# 列出所有 features
ls -la .hybrid/
```

对每个 feature 子目录：
- 读取 `[feature]-parent-hybrid.md`（Parent 文档）
  - **Section 7** (Routing Table): 提取每个 Child 的 ID、Name、Scope、Status
  - **Section 9** (Aggregation): 提取整体进度统计
- 读取每个 `[feature]-child-N-hybrid.md`（Child 文档）
  - **Section 9** (Evaluation Report): 提取评估轮次、最后状态、Fix 历史

### Step 1.1: 增强数据提取（Hover 详情）

对每个 Child，额外提取以下数据用于悬浮提示：

| 数据项 | 来源 | 提取方式 |
|--------|------|----------|
| P0 issue 数量 | Parent Section 9 Aggregation 表 → `P0 Count` 列 | 按 Child 文件名匹配行 |
| P1 issue 数量 | Parent Section 9 Aggregation 表 → `P1 Count` 列 | 按 Child 文件名匹配行 |
| Issue 摘要（前 3 条） | Child Section 9.3 Code Issue List 表 | 取前 3 行的 Issue 列文本 |
| Fix 指令概要 | Child Section 9.3 Fix Instructions 列 | 取前 3 行的 Fix 列摘要 |
| 评估趋势 | Child Section 9.1 + 历史轮次 | 格式: `→ PASS (2 rounds)` 或 `↻ Needs Fix x3` |
| 阻塞依赖 | Parent Section 8.3 Cross-Branch Dependencies | 匹配当前 Child ID 的被依赖关系 |

**组装 hover 文本**（用于 `title` 属性）:
```
详细信息:
• P0: {n} | P1: {n}
• Issues: {issue1}; {issue2}; {issue3}
• 评估: {eval_trend}
• 阻塞: {blocked_by 或 "无"}
```

**Mode A-parallel 额外提取**（团队上下文）：
OpenCode does not expose an external agent-teams config. Infer teammate state from `.hybrid/` team records when available:
- 当前任务 Child ID + 描述（从 task list 推断）
- 工作时长（从 task created_at 计算）
- 最后更新时间

**根据 Section 7 第一列的 `Mode` 字段**判断该 feature 属于哪个工作流：
- `A` → Mode A (xwhole)
- `B` → Mode B (xlocal)
- `A-parallel` → Mode A-parallel
- 单 Child 且无 Parent 路由表 → Mode C (xunit, 通常不在 `.hybrid/` 中)

### Step 2: 收集环境元数据

```bash
# 当前分支
git rev-parse --abbrev-ref HEAD

# 用户名
git config user.name || echo $USER

# 仓库名
basename $(git rev-parse --show-toplevel)
```

### Step 3: Mode C (xunit) 特殊处理

**xunit 模式不生成 Hybrid Tree 文档**，需从 git log 推断最近活动：

```bash
# 最近 24 小时、与项目源文件相关的 commit
git log --since="24 hours ago" --name-only --pretty=format:"%h|%ai|%s" -- ':!*.md' ':!*.lock' ':!package-lock.json'
```

输出字段：
- `time`: 提交时间（YYYY-MM-DD HH:MM）
- `hash`: 7 位短 hash
- `message`: commit message 第一行
- `files`: 修改的文件数

**降级处理**：若 24h 内无 commit，扩大到 7 天，并明确标注"Recent activities (last 7 days)"。

### Step 4: 统计聚合

- `ACTIVE_COUNT` = 状态非 PASS/FAILED 的 feature 数
- `TOTAL_CHILDREN` = 所有 feature 的 Children 总数
- `COMPLETION_RATE` = PASS 状态的 Children / TOTAL_CHILDREN × 100
- `FAILED_COUNT` = FAILED 状态 Children + Stalled (迭代超限) Children

## 模板替换规则

读取模板文件：`.opencode/skills/orchestrateX/templates/status-report.html`

| 占位符 | 替换内容 |
|---|---|
| `{TIMESTAMP}` | `2026-06-01 14:30:22` 格式 |
| `{BRANCH}` | 当前 git 分支名 |
| `{USER}` | git user.name 或系统用户 |
| `{REPO}` | 仓库目录名 |
| `{ACTIVE_COUNT}` | 数字 |
| `{TOTAL_CHILDREN}` | 数字 |
| `{COMPLETION_RATE}` | 数字（不带 %） |
| `{TREND_INDICATOR}` | `<span class="trend-indicator {direction}" title="...">{arrow}</span>` 或空字符串 |
| `{FAILED_COUNT}` | 数字 |
| `{MODE_A_SECTION}` | 完整 `<h2>...</h2>` 块或空字符串 |
| `{MODE_B_SECTION}` | 同上 |
| `{MODE_PARALLEL_SECTION}` | 同上 |
| `{MODE_C_SECTION}` | 表格或空字符串 |

**空 section 规则**：若某模式无活跃 workflow，显示极简占位符（而非空字符串），保持布局节奏并提供启动指引：
```html
<section class="workflow empty-state">
  <h2>{MODE_LABEL} <span class="count">0 active</span></h2>
  <p class="empty">暂无活跃的{MODE_DESC}工作流<br>
  <span class="hint">{COMMAND_HINT}</span></p>
</section>
```

各模式占位符：
| 模式 | MODE_LABEL | MODE_DESC | COMMAND_HINT |
|------|-----------|-----------|-------------|
| Mode A | Mode A · xwhole | 全局 | 使用 /xwhole [-N num] [-box name] 需求 启动 |
| Mode B | Mode B · xlocal | 局部 | 使用 /xlocal 需求 启动 |
| Mode A-parallel | Mode A · parallel | 并行 | 使用 /xwhole -parallel 需求 启动 |
| Mode C | Mode C · xunit | 单元 | 使用 /xunit 需求 启动 |

## 各工作流展示格式

### Mode A · xwhole

```html
<h2>Mode A · xwhole <span class="count">{N} active</span></h2>
<article class="workflow">
  <header class="workflow-header">
    <div class="workflow-title">
      <span class="mode-badge" title="Mode A: 全局工作流 (xwhole)">A</span>
      <h3>{feature-name}</h3>
    </div>
    <div class="progress-group">
      <div class="progress-bar"><div class="progress-fill" style="width: {P}%"></div></div>
      <span class="progress-label"><span class="num">{P}%</span> ({passed}/{total})</span>
    </div>
  </header>
  <ul class="children">
    <li class="child status-pass">
      <span class="icon">✓</span>
      <span class="id">{CHILD_ID}</span>
      <span class="name">{child-name}<span class="desc">{brief-description}</span></span>
      <span class="meta meta-enhanced" title="详细信息:\n• P0: {p0} | P1: {p1}\n• Issues: {issue_summary}\n• 评估: → PASS ({R} rounds)\n• 阻塞: 无">PASS · <strong>{R}</strong> rounds · {files} files <span class="detail-hint">(?)</span></span>
    </li>
    <li class="child status-in-progress">
      <span class="icon">⚙</span>
      <span class="id">{CHILD_ID}</span>
      <span class="name">{child-name}<span class="desc">{brief-description}</span></span>
      <span class="meta meta-enhanced" title="详细信息:\n• P0: {p0} | P1: {p1}\n• Issues: {issue_summary}\n• 评估: {eval_trend}\n• 阻塞: {blocked_by}">Round <strong>{R}/{N}</strong> · {agent} active <span class="detail-hint">(?)</span></span>
    </li>
    <li class="child status-pending">
      <span class="icon">⏸</span>
      <span class="id">{CHILD_ID}</span>
      <span class="name">{child-name}<span class="desc">{brief-description}</span></span>
      <span class="meta meta-enhanced" title="详细信息:\n• 阻塞依赖: {blocked_by_id}\n• 等待原因: {block_reason}">Blocked by {CHILD_ID} <span class="detail-hint">(?)</span></span>
    </li>
  </ul>
</article>
```

**状态映射**（从 Child Section 9 提取）：
- `PASS` → `status-pass` / `✓`
- `In Progress / Round N` → `status-in-progress` / `⚙`
- `Pending / Not Started` → `status-pending` / `⏸`
- `Blocked` → `status-pending` / `⏸`（加 "Blocked by" 标记）
- `Failed` → `status-failed` / `✗`
- `Needs Fix` → `status-needs-fix` / `⚠`

### Mode B · xlocal

**展示格式与 Mode A 相同**，但由于 xlocal 通常 Child 较少（1-2 个），可以：
- 展示更详细的 file-level 信息（来自 Section 8.1）
- 突出单 Child 的迭代历史

### Mode A-parallel

**与 Mode A 相同树状结构 + Team 状态侧栏**：

```html
<article class="workflow">
  <header class="workflow-header">
    <div class="workflow-title">
      <span class="mode-badge mode-a-parallel" title="Mode A-parallel: Agent Teams 并行工作流">A&#x2225;</span>
      <h3>{feature-name}</h3>
    </div>
    <div class="progress-group">...</div>
  </header>
  <div class="parallel-body">
    <ul class="children-section children">
      <!-- Children 列表同 Mode A -->
    </ul>
    <aside class="team-section">
      <h4>Agent Team · {team-name}</h4>
      <div class="teammate">
        <span class="role">coder-<span class="num">1</span></span>
        <span class="teammate-status active" title="当前任务: C-02 ({task_description})\n工作时长: {duration}\n最后更新: {last_update}">active · C-02</span>
      </div>
      <div class="teammate">
        <span class="role">evaluator-<span class="num">1</span></span>
        <span class="teammate-status idle" title="最后任务: {last_task}\n空闲时长: {idle_duration}">idle</span>
      </div>
    </aside>
  </div>
</article>
```

**Team 数据来源**：从 `.hybrid/` 中的 team 记录推断；若没有 team 记录则显示 "Team status unavailable (config not found)"。

### Mode C · xunit

**表格风格，明确标注无文档**：

```html
<h2>Mode C · xunit <span class="count">last 24h</span></h2>
<article class="workflow">
  <div class="unit-note">Unit mode 不维护 Hybrid Tree 文档，以下活动从 git 历史推断</div>
  <table class="unit-table">
    <thead>
      <tr>
        <th>Time</th>
        <th>Hash</th>
        <th>Message</th>
        <th>Files</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="time">14:25</td>
        <td class="hash">a1b2c3d</td>
        <td>fix: typo in error message</td>
        <td class="files">1 file · src/utils.js</td>
      </tr>
    </tbody>
  </table>
</article>
```

**空状态**：若 git log 无结果，显示：
```html
<article class="workflow">
  <div class="empty">No unit activities in the last 24 hours.</div>
</article>
```

## 输出与打开

```bash
# 1. 写入文件
# 默认输出路径: ./status-report.html (项目根，覆盖式)
# 自定义路径: {用户指定路径}

# 2. 打开浏览器（跨平台）
# Windows:  start "" "{file_path}"
# macOS:    open "{file_path}"
# Linux:    xdg-open "{file_path}"
```

**幂等性**：每次执行覆盖 `status-report.html`，不保留历史快照。如需历史，应使用 `--output` 指定不同文件名。

## 命令参数

| 参数 | 说明 | 默认值 |
|---|---|---|
| 无 | 分析当前工作流，输出到 `./status-report.html` | — |
| `--output <path>` | 指定输出路径 | `./status-report.html` |
| `--no-open` | （可选）生成后不打开浏览器 | 默认打开 |

**当前实现**（v1）仅支持前两种用法。

## 错误处理

| 场景 | 处理 |
|---|---|
| `.hybrid/` 目录不存在 | 仅展示 Mode C（git log）+ 空 Summary，显示 "No Hybrid Tree documents found" |
| 模板文件不存在 | 报错并退出，提示检查 skill 安装 |
| git 仓库不存在 | Mode C 显示 "git unavailable" 并跳过 |
| 浏览器启动失败 | 静默失败，仍输出文件路径供用户手动打开 |

## 实现提示

- **单次工具调用完成**：Main Agent 一次性收集所有数据并写入 HTML，避免多轮 token 消耗
- **字符串模板替换**：用 `Read` + `Write` 工具完成，避免在模板中嵌入复杂逻辑
- **Browser 启动**：用 `Bash` 工具执行 `start ""` (Windows) / `open` (macOS) / `xdg-open` (Linux)
- **样式验证**：若有时间，用 `npx playwright screenshot` 验证渲染效果（参考 huashu-design 的验证流程）
