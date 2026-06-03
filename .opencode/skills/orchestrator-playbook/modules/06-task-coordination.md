# Module 06: Task Coordination (Optimized: Graph-Based Scheduling)

> **Trigger**: Module 05 完成后，持续运行直到所有任务完成或用户中断

## Team Lead 职责

orchestratorX 作为 Team Lead，负责：

1. **任务调度**：基于依赖图的就绪队列调度
2. **文件冲突检查**：任务分配前检查文件重叠
3. **需求变更处理**：接收用户输入，更新 Hybrid Tree
4. **进度监控**：报告进度，处理异常

**注意**：队友只负责认领任务、完成任务、报告结果。调度逻辑由 Team Lead 统一管理。

## 核心调度循环（Optimized: Graph-Based）

```
while (ready_queue 不为空 || 还有 blocked 任务) {
  1. 处理 ready_queue 中的任务：
     - 分配给空闲队友
     - 等待完成
  
  2. 任务完成时：
     - 更新依赖图：for dependent in adj[completed_task]:
         in_degree[dependent]--
         if in_degree[dependent] == 0 → enqueue to ready_queue
     - 更新 per-child 迭代计数器
  
  3. 文件冲突检查（ready 任务与 in_progress 任务）
  
  4. 处理用户输入（如果有）
  
  5. 监控进度
}
```

## 依赖解锁（Optimized: Adjacency List）

**触发条件**：任务标记为 completed 时

**解锁逻辑（O(1) 查找）**：
1. 查找 `adj[completed_task]` → 直接获取所有依赖此任务的下游任务
2. 对每个下游任务：`in_degree[dependent]--`
3. 如果 `in_degree[dependent] == 0` → 加入 `ready_queue`
4. **无需遍历所有任务检查 blockedBy** — 图结构直接定位

## 文件冲突检查

**检查时机**：任务分配前

**检查逻辑**：
1. 读取目标任务的文件索引（Child Section 8.1）
2. 读取所有 in_progress 任务的文件索引
3. 如果有文件重叠，任务状态设为 `wait_blocked`
4. 当冲突任务完成后，重新检查并解锁

**冲突判定**：
- 精确匹配：同一文件被多个任务修改
- 不检查目录级别（同目录不同文件不冲突）

## 任务分配

**分配规则**：
1. 优先分配给空闲的 coder-teammate
2. evaluator-teammate 等待 coder 完成后再分配
3. 按 in_degree 排序（依赖少的优先）

**分配流程**：
1. 从 `ready_queue` 取出任务
2. 检查文件冲突
3. 分配给空闲队友
4. 通知队友认领

## 需求变更处理

**处理流程**：遵循主 SKILL.md 的 Requirement Change Handling 章节

**Agent Teams 特殊处理**：
- 变更直接更新 Hybrid Tree
- 队友在下次认领任务时会看到最新文档
- 如果变更影响 in_progress 任务：
  - 非紧急：更新文档，等待完成后再处理
  - 紧急：中断队友，重新分配
- **依赖图更新**：如果变更影响依赖关系，重建 affected subgraph

## 迭代轮次控制（Optimized: Per-Child Counter）

**控制逻辑**：
- 每个任务有独立迭代计数器（从 Module 05 继承）
- `child_iterations[task_id] = { used: 0, remaining: sessionParams.iteration_limit }`
- 评估结果为 `needs_fix` 时：`used++`, `remaining--`
- `remaining <= 0` 时，任务标记为 `failed`
- **PASS 时**：立即标记完成，无需检查迭代上限

## 进度监控

**监控内容**：
- 总任务数、已完成、进行中、ready_queue 长度、blocked 数量
- 超时检测（可选）

**输出格式**：
```
📊 进度: {completed}/{total} 完成 | {inProgress} 进行中 | {readyQueue} 就绪 | {blocked} 阻塞
```

## 完成处理

**完成条件**：所有任务状态为 `completed` 或 `failed`

**完成动作**：
1. 汇总结果
2. 输出最终报告
3. 清理团队（使用 Agent Teams 的 cleanUpTeam 命令）

## 输出

调度循环结束后，输出：

```
✅ 并行工作流完成

📊 最终统计
   总任务数: {total}
   成功完成: {success}
   失败: {failure}
   依赖边数: {edge-count}
   平均迭代: {avg-iterations}

📁 Hybrid Tree 已更新
   位置: .hybrid/{feature-name}/
```
