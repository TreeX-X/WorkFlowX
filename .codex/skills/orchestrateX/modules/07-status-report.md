# Module 07: Status Report (xstatus)

> **Trigger**: `xstatus` or `xstatus --output <path>`
> **Output**: `./status-report.html` by default, or the specified output path. Open the report in the default browser after generation unless `--no-open` is provided.
> **Style**: huashu-design inspired, warm white background, serif display typography, rust accent, high information density.

## Design Principles

| Dimension | Prefer | Avoid |
|---|---|---|
| Typography | Newsreader or similar serif display + system sans + JetBrains Mono | Generic all-Inter/Roboto display |
| Background | Warm white `#fafaf7` | Dark blue, pure white, heavy gradients |
| Accent | Rust orange `#c04a1a` | Purple gradients, neon colors |
| Status icons | Text labels such as `PASS`, `WARN`, `WAIT`, `FAIL` | Decorative emoji-heavy bullets |
| Containers | Thin borders and dense sections | Rounded card piles and heavy decorative accents |
| Density | Developer-tool density, at least 3 useful facts per viewport | Sparse marketing layout |

## Data Collection Flow

### Step 0: Read Previous Report For Trend

Before generating a new report, try to read the existing report at the output path:

```bash
if [ -f "{output_path}" ]; then
  grep -oP '(?<=class="value accent">)\d+' "{output_path}" | head -1
fi
```

- If extraction succeeds, calculate `delta = current_rate - previous_rate`.
- `delta > 0`: trend `up`, indicator `鈻瞏, title `Compared with previous report: +{delta}%`.
- `delta < 0`: trend `down`, indicator `鈻糮, title `Compared with previous report: {delta}%`.
- `delta == 0`: trend `flat`, indicator `->, title `Compared with previous report: unchanged`.
- If extraction fails, replace `{TREND_INDICATOR}` with an empty string.

### Step 1: Scan `.hybrid/`

List feature directories under `.hybrid/`. For each feature:

- Read the Parent hybrid document when present.
- Extract Parent Section 7 routing table: Child id/name/scope/status.
- Extract Parent Section 9 aggregation: total progress and issue counts.
- Read each Child hybrid document.
- Extract Child Section 9: evaluation rounds, latest status, issue summaries, and fix history.

### Step 1.1: Enhanced Child Metadata

For each Child, collect hover/detail metadata:

| Field | Source | Extraction |
|---|---|---|
| P0 count | Parent Section 9 aggregation | Match by Child file name |
| P1 count | Parent Section 9 aggregation | Match by Child file name |
| Issue summary | Child Section 9.3 issue list | First 3 issue descriptions |
| Fix summary | Child Section 9.3 fix instructions | First 3 fix descriptions |
| Evaluation trend | Child Section 9.1 and history | Example: `-> PASS (2 rounds)` or `-> Needs Fix x3` |
| Blocking dependency | Parent Section 8.3 | Match current Child id |

Hover text format:

```text
Details:
- P0: {n} | P1: {n}
- Issues: {issue1}; {issue2}; {issue3}
- Evaluation: {eval_trend}
- Blocked by: {blocked_by or "none"}
```

### Step 1.2: Parallel Mode Metadata

Codex does not expose an external agent-team config. Infer teammate state from `.hybrid/` team records when available:

- Current task Child id and description.
- Work duration derived from task creation time.
- Last update time.

Determine workflow mode from the routing table or available metadata:

- `A`: Mode A (`xwhole`)
- `B`: Mode B (`xlocal`)
- `A-parallel`: Mode A parallel
- Single Child without Parent routing table: Mode C (`xunit`, usually not stored in `.hybrid/`)

### Step 2: Collect Environment Metadata

```bash
git rev-parse --abbrev-ref HEAD
git config user.name || echo $USER
basename $(git rev-parse --show-toplevel)
```

### Step 3: Mode C (`xunit`) Fallback

`xunit` does not maintain Hybrid Tree documents. Infer recent unit activity from git history:

```bash
git log --since="24 hours ago" --name-only --pretty=format:"%h|%ai|%s" -- ':!*.md' ':!*.lock' ':!package-lock.json'
```

Fields:

- `time`: commit time in `YYYY-MM-DD HH:MM`
- `hash`: short commit hash
- `message`: first line of commit message
- `files`: changed source file count

If there are no commits in the last 24 hours, expand to 7 days and label the section `Recent activities (last 7 days)`.

### Step 4: Aggregate Metrics

- `ACTIVE_COUNT`: features whose status is not `PASS` or `FAILED`.
- `TOTAL_CHILDREN`: total Child count across active features.
- `COMPLETION_RATE`: passed Children divided by total Children, as an integer percentage.
- `FAILED_COUNT`: failed Children plus stalled Children.

## Template Replacement

Read `.codex/skills/orchestrateX/templates/status-report.html`.

| Placeholder | Replacement |
|---|---|
| `{TIMESTAMP}` | Current timestamp, e.g. `2026-06-01 14:30:22` |
| `{BRANCH}` | Current git branch |
| `{USER}` | `git config user.name` or system user |
| `{REPO}` | Repository directory name |
| `{ACTIVE_COUNT}` | Number |
| `{TOTAL_CHILDREN}` | Number |
| `{COMPLETION_RATE}` | Number without `%` |
| `{TREND_INDICATOR}` | Trend span or empty string |
| `{FAILED_COUNT}` | Number |
| `{MODE_A_SECTION}` | Full Mode A HTML block or empty-state block |
| `{MODE_B_SECTION}` | Full Mode B HTML block or empty-state block |
| `{MODE_PARALLEL_SECTION}` | Full parallel HTML block or empty-state block |
| `{MODE_C_SECTION}` | Mode C table or empty-state block |

When a mode has no active workflow, render a compact empty state rather than removing the section:

```html
<section class="workflow empty-state">
  <h2>{MODE_LABEL} <span class="count">0 active</span></h2>
  <p class="empty">No active {MODE_DESC} workflow.<br>
  <span class="hint">{COMMAND_HINT}</span></p>
</section>
```

| Mode | MODE_LABEL | MODE_DESC | COMMAND_HINT |
|---|---|---|---|
| Mode A | Mode A - xwhole | whole-repo | Start with `xwhole [-N num] [-box name] requirement` |
| Mode B | Mode B - xlocal | local/module | Start with `xlocal requirement` |
| Mode A-parallel | Mode A - parallel | parallel | Start with `xwhole -parallel requirement` |
| Mode C | Mode C - xunit | unit | Start with `xunit requirement` |

## Display Rules

### Mode A - xwhole

Render a tree-style feature block:

- Header: feature name and progress percentage.
- Child list: id, name, short description, status, rounds, file count.
- Hover metadata: P0/P1 count, issue summary, evaluation trend, blockers.

Status mapping:

| Workflow status | CSS class | Label |
|---|---|---|
| `PASS` | `status-pass` | `PASS` |
| `In Progress` or `Round N` | `status-in-progress` | `RUN` |
| `Pending` or `Not Started` | `status-pending` | `WAIT` |
| `Blocked` | `status-pending` | `BLOCKED` |
| `Failed` | `status-failed` | `FAIL` |
| `Needs Fix` | `status-needs-fix` | `FIX` |

### Mode B - xlocal

Use the same layout as Mode A, but show more file-level detail because `xlocal` usually has only 1-2 Children.

### Mode A - parallel

Use the Mode A tree plus a team-status side panel when team metadata exists. If no team records exist, show `Team status unavailable (config not found)`.

### Mode C - xunit

Render a compact git-history table:

```html
<h2>Mode C - xunit <span class="count">last 24h</span></h2>
<article class="workflow">
  <div class="unit-note">Unit mode does not maintain Hybrid Tree documents. Activity is inferred from git history.</div>
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
        <td class="files">1 file - src/utils.js</td>
      </tr>
    </tbody>
  </table>
</article>
```

If git log has no result:

```html
<article class="workflow">
  <div class="empty">No unit activities in the selected time range.</div>
</article>
```

## Output

1. Write or overwrite the output file. Default: `./status-report.html`.
2. Open the report unless `--no-open` is set.
   - Windows: `start "" "{file_path}"`
   - macOS: `open "{file_path}"`
   - Linux: `xdg-open "{file_path}"`

The command is idempotent: each run overwrites the target report. Use `--output` with different file names only when history snapshots are needed.

## Command Parameters

| Parameter | Description | Default |
|---|---|---|
| none | Analyze current workflow and write `./status-report.html` | N/A |
| `--output <path>` | Custom output path | `./status-report.html` |
| `--no-open` | Generate without opening the browser | open by default |

Current implementation v1 supports the first two usages.

## Error Handling

| Scenario | Handling |
|---|---|
| `.hybrid/` does not exist | Show Mode C from git log and an empty summary |
| Template file missing | Report error and suggest checking skill installation |
| Not a git repository | Show `git unavailable` for Mode C and continue |
| Browser launch fails | Silently keep the generated file and report the path |

## Implementation Notes

- Collect data and write HTML in one pass to avoid multi-turn token overhead.
- Prefer simple string replacement over embedding complex logic in the template.
- If time allows, verify rendering with a Playwright screenshot.
