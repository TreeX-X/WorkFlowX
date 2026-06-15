# Hybrid Docs - Island Pull-Down / Animation Optimization

**File Name**: island-pullopt-anim-hybrid.md
**Document Type**: Child (Branch-Specific)
**Parent**: island-pullopt-hybrid.md

**Document Status**: Draft
**Update Date**: 2026-06-13
**Author**: Tree
**Version**: v1.0

---

> **Inheritance Declaration**
> Sections 0-6 are inherited from parent `island-pullopt-hybrid.md`.

### Branch-Specific Overrides
- No overrides.

---

> **Incremental Section**

## 7. Branch Features & Acceptance Criteria (Branch-Specific AC)

### Feature: 灵动岛下拉动画全项优化
- **Description**: 重构 Titlebar.tsx 和 App.tsx 中灵动岛下拉翻转的动画实现，从 React state 驱动改为 direct DOM + data 属性驱动，同时添加阈值渐进反馈、弹性过阻尼、动量感知翻转、弹簧回弹效果。
- **Implementation Requirements**:

**P0 — 拖拽期间 Direct DOM（消除 re-render）**:
- Titlebar.tsx: 删除 `islandOffsetY` useState，改为 useRef + 直接 DOM 操作
- 指针事件中通过 `islandEl.style.transform = ...` 直接更新
- App.tsx 翻转容器也改为 ref + direct DOM：`flipperEl.style.transform = ...`
- store 中的 `islandDragDeltaY` 保留但仅在 pointerup 时 setState（用于同步蓝图模式状态）

**P1 — Transition 控制（data-dragging 属性）**:
- Titlebar.tsx: pointerdown 时 `islandEl.dataset.dragging = '1'`，pointerup 时删除
- CSS/inline: `[data-dragging]` 对应 `transition: none !important`
- App.tsx 翻转容器同理：pointerdown 时 `flipperEl.style.transition = 'none'`，pointerup 时恢复

**P1 — 阈值渐进视觉反馈**:
- 拖拽过程中边框颜色从 `rgba(255,255,255,0.12)` 渐变到 `rgba(255,120,48,0.8)`
- 使用 `progress = Math.min(deltaY / SWIPE_THRESHOLD, 1)` 插值
- dot 亮度从 0 0 8px 递增到 0 0 14px

**P2 — 弹性过阻尼（橡皮筋感）**:
- 阻尼公式：`offset = deltaY < T ? deltaY * 0.4 : T * 0.4 + (deltaY - T) * 0.15`
- 超过阈值后阻尼系数从 0.4 降到 0.15，营造拉伸阻力感

**P2 — 翻转动量感知**:
- 在 pointermove 中记录最近 5 帧的 deltaY 变化，计算释放速度
- 速度公式：`velocity = (lastY - firstY) / (lastTime - firstTime)`
- 快甩（velocity > 0.5px/ms）：翻转动画 0.35s
- 慢拖：翻转动画 0.65s（默认）

**P3 — 回弹弹簧效果**:
- 未达阈值释放时，island 回弹使用 `cubic-bezier(0.175, 0.885, 0.32, 1.275)`（有 overshoot）
- flipper 回弹使用 `cubic-bezier(0.25, 1, 0.25, 1)`

- **Acceptance Criteria (AC)**:
  - [ ] AC1: 拖拽期间 pointermove 零 setState 调用，所有动画通过 direct DOM
  - [ ] AC2: data-dragging 属性控制 transition 开关，拖拽时 transition: none
  - [ ] AC3: 接近阈值时边框颜色从白渐变到橙色，dot 亮度递增
  - [ ] AC4: 超过阈值后阻尼系数递增（橡皮筋感）
  - [ ] AC5: 快甩释放时翻转动画更短（0.35s vs 0.65s）
  - [ ] AC6: 未达阈值释放时回弹有弹簧 overshoot 效果

## 8. Engineering & Knowledge Index Appendix
### 8.1 Branch Private File Index
- **File Path**: `E:\Tree Workspace\SwitchX\src\renderer\src\components\Titlebar.tsx` | **File Purpose**: 灵动岛拖拽逻辑 | **Association Reason**: 主要重构文件
- **File Path**: `E:\Tree Workspace\SwitchX\src\renderer\src\App.tsx` | **File Purpose**: 翻转容器 transition 控制 | **Association Reason**: 关联修改

### 8.2 Branch Incremental Index References
- 设计原型: `SwitchX-灵动岛下拉翻转蓝图.html` 第 263-370 行（JS 拖拽逻辑）

---

> **Dynamic Section**

## 9. Evaluation Report (Branch-Specific)
### 9.1 Most Recent Evaluation Metadata
- **Evaluator/Agent**: evaluatorX
- **evaluation_mode**: full
- **Evaluation Date**: 2026-06-13

### 9.2 Acceptance Criteria (AC) Compliance

| AC | Status | Notes |
|----|--------|-------|
| AC1 | Partial Pass | direct DOM 操作正确，但 setPressing(false) 触发 re-render 覆盖样式（P0） |
| AC2 | Pass | pointerdown transition:none + store isIslandDragging 控制翻转容器 |
| AC3 | Pass | 边框颜色插值 + dot boxShadow blur 递增，均通过 direct DOM |
| AC4 | Pass | 阻尼公式完全匹配 PRD |
| AC5 | Pass | velocity > 0.5px/ms → 350ms，否则 650ms |
| AC6 | Pass | cubic-bezier overshoot 弹簧效果 |

### 9.3 Code Issue List + Fix Instructions

| # | Severity | File:Line | Issue | Fix |
|---|----------|-----------|-------|-----|
| 1 | P0 | Titlebar.tsx:137 | setPressing(false) in pointermove 触发 re-render 覆盖 direct DOM 样式 | pressing 改为 useRef + direct DOM |
| 2 | P1 | Titlebar.tsx:445-476 | JSX inline style 用 pressing 驱动 width/height/border 等 | 拆分为 direct DOM helper |
| 3 | P1 | app.ts:10 | islandDragDeltaY 零消费者，死代码 | 删除字段和调用 |
| 4 | P2 | Titlebar.tsx:224 | flipDuration 二值离散切换 | 线性插值 350-650ms |
| 5 | P2 | App.tsx:88-96 | flipperElRef 拖拽期间未被 Titlebar 访问 | 简化或实现 3D 预览 |

### 9.4 Comprehensive Evaluation Conclusion
**Result: Needs Fix** — 5/6 AC 通过，P0 为 setPressing re-render 冲突。核心优化（direct DOM、transition 控制、阈值反馈、弹性阻尼、动量感知、弹簧回弹）均已实现，仅需将 pressing 改为 ref 消除最后一次 re-render。

<!-- End of Child Hybrid Template -->
