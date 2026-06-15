# Hybrid Docs - Island Pull-Down Animation Optimization

**File Name**: island-pullopt-hybrid.md
**Document Type**: Parent (Routing Center)

**Document Status**: Draft
**Update Date**: 2026-06-13
**Author**: Tree
**Version**: v1.0

---

> **Static Context (Static Section)**

## 0. Runtime Environment Status (System)
- **MCP Status**: Active
- **MCP Servers**: server-memory, server-sequential-thinking
- **Last Checked**: 2026-06-13T12:00:00Z
- **Degraded Since**: N/A
- **Fallback Impact**: None

## 1. Project Overview (Overview)
- **Project Goal**: 优化灵动岛下拉翻转的完整动画链：拖拽跟手性能、transition 控制、阈值渐进反馈、弹性过阻尼、翻转动量感知、回弹弹簧效果
- **Core Value**: 60fps 丝滑拖拽体验，消除 React re-render 卡顿

## 2. Target Audience (Target Audience)
- **Persona 1**: 开发者 — 使用 SwitchX 时频繁通过灵动岛切换终端/蓝图视图

## 3. Boundaries & Scope (Scope & Non-Goals)
### 3.1 Clearly In-Scope
- Titlebar.tsx 灵动岛拖拽逻辑重构（direct DOM）
- App.tsx 翻转容器 transition 控制（data 属性）
- 阈值渐进视觉反馈（边框颜色插值）
- 弹性过阻尼（超过阈值后阻尼递增）
- 翻转动量感知（基于释放速度的动画时长）
- 回弹弹簧效果（spring-back cubic-bezier）
### 3.2 Clearly Out-of-Scope
- 蓝图画布内容实现
- 长按/双击逻辑修改
- 非动画相关的功能变更

## 4. Non-Functional Requirements (Non-Functional Requirements)
- **Performance**: 拖拽期间零 React re-render，所有动画通过 direct DOM + requestAnimationFrame
- **Smoothness**: 60fps 目标，无掉帧
- **Comments**: 关键动画参数处添加中文注释

## 5. Success Metrics (Success Metrics)
- 拖拽期间无 React re-render（React DevTools Profiler 验证）
- 释放后回弹有弹簧质感
- 接近阈值时边框颜色渐变可感知
- 快甩和慢拖的翻转速度有明显区别

## 6. Definition of Done (DoD)
- [ ] P0: 拖拽期间使用 direct DOM，无 setState 调用
- [ ] P1: transition 通过 data-dragging 属性控制，拖拽时 transition: none
- [ ] P1: 阈值接近时边框从白渐变到橙色
- [ ] P2: 超过阈值后阻尼系数递增（橡皮筋感）
- [ ] P2: 快甩释放时翻转动画更快（基于速度）
- [ ] P3: 未达阈值释放时回弹有 cubic-bezier 弹簧效果

---

> **Incremental Section**

## 7. Feature Map & Child Registry (Routing Table)

| # | Child File | Scope | AC Count | Status | Last Eval |
|---|-----------|-------|----------|--------|-----------|
| 1 | island-pullopt-anim-hybrid.md | 灵动岛下拉动画全项优化 | 6 | Needs Fix | 2026-06-13 |

## 8. Engineering & Knowledge Index Appendix
### 8.1 Global Shared File Index
- **File Path**: `E:\Tree Workspace\SwitchX\src\renderer\src\components\Titlebar.tsx` | **File Purpose**: 灵动岛组件（拖拽逻辑主文件） | **Shared By**: global
- **File Path**: `E:\Tree Workspace\SwitchX\src\renderer\src\App.tsx` | **File Purpose**: 3D 翻转容器 | **Shared By**: global
- **File Path**: `E:\Tree Workspace\SwitchX\src\renderer\src\stores\app.ts` | **File Purpose**: blueprintMode / islandDragDeltaY 状态 | **Shared By**: global
- **File Path**: `E:\Tree Workspace\SwitchX\src\renderer\src\styles\globals.css` | **File Purpose**: CSS 动画 keyframes | **Shared By**: global

### 8.2 Memory Pointers
- Root Nodes: island-pullopt-project

### 8.3 Cross-Branch Dependencies
- (无)

---

> **Dynamic Section**

## 9. Evaluation Summary (Aggregated)

| # | Child File | Eval Result | P0 Count | P1 Count | Last Eval |
|---|-----------|-------------|----------|----------|-----------|
| 1 | island-pullopt-anim-hybrid.md | Needs Fix | 1 | 2 | 2026-06-13 |

### 9.1 Aggregated Metrics
- **Total Children**: 1
- **Passed**: 0
- **Needs Fix**: 1 (iteration limit reached)
- **Not Started**: 0

<!-- End of Parent Hybrid Template -->
