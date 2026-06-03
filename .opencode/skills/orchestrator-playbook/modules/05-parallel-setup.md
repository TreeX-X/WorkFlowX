# Module 05: Parallel Setup (Optimized: Graph-Based Task Pool)

> **Trigger**: `/xwhole -parallel` 指令触发时，在环境初始化之后执行

## 前置条件检查

1. **检查 Agent Teams 环境**
   - 需要 Claude Code v2.1.32+
   - 需要设置环境变量 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`

2. **降级策略**
   - 如果 Agent Teams 不可用，回退到 Mode A/B 的 subagent 模式
   - 通知用户当前环境不支持 Agent Teams

## 团队创建流程

### Step 1: 解析参数（使用预编译正则）

```
/xwhole -parallel [-N] [-team team-name] [requirement]

解析结果（存入 sessionParams 对象）：
- N: 最大迭代轮次（默认 2）
- team: 团队名称（默认: "workflow-{timestamp}"）
- requirement: 需求描述
```

### Step 2: 生成 Hybrid Tree

- 如果已有 Hybrid Tree → 直接使用
- 如果没有 → 按照 Mode B 的最小 Hybrid Tree 自动生成流程

### Step 3: 创建 Agent Team

- 创建团队，设置 teammateMode 为 "in-process"
- 团队名称使用 `-team` 参数或默认值

### Step 4: 生成队友

**队友数量规则**：
- 最少 2 个（1 coder + 1 evaluator）
- 最多 6 个（3 coder + 3 evaluator）
- 每 2-3 个 Children 配一对 coder+evaluator

**生成命令**：
```
Spawn teammate using .claude/agents/coder-teammate.md
Spawn teammate using .claude/agents/evaluator-teammate.md
// 根据需要生成更多对
```

### Step 5: 初始化任务池（Optimized: Dependency Graph）

1. **读取 Parent Section 7** → 获取所有 Children
2. **读取 Parent Section 8.3** → 获取依赖关系
3. **构建依赖图**：
   ```javascript
   // Adjacency list: parent → [dependents]
   adj = {};
   // In-degree map: child → dependency count
   in_degree = {};
   // Per-child iteration counters
   child_iterations = {};
   
   // Initialize
   for (child of children) {
     in_degree[child] = 0;
     adj[child] = [];
     child_iterations[child] = { used: 0, remaining: sessionParams.iteration_limit };
   }
   
   // Build edges from Section 8.3
   for (edge of dependencies) {
     adj[edge.parent].push(edge.child);
     in_degree[edge.child]++;
   }
   ```
4. **初始化就绪队列**：
   - `ready_queue` = all children where `in_degree[child] == 0`
   - `blocked_set` = all children where `in_degree[child] > 0`

### Step 6: 初始分配（Graph-Aware）

- 将 `ready_queue` 中的任务分配给空闲的 coder-teammate
- evaluator-teammate 等待 coder 完成后再分配
- **动态调度**：当 Child PASS 后，更新 `in_degree`，将新就绪的 Child 加入 `ready_queue`

## 输出

完成并行设置后，输出：

```
✅ Agent Team 创建成功
   团队名称: {team-name}
   队友数量: {count}

📊 任务池初始化（依赖图模式）
   总任务数: {total}
   Ready: {ready-count} (in_degree == 0)
   Blocked: {blocked-count} (in_degree > 0)
   依赖边数: {edge-count}

🚀 开始并行执行...
```

然后进入 **Module 06: Task Coordination** 进行动态调度。
