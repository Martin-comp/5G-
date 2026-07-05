# 5G网络优化结果验证样章3.4

入口文件：`index.html`

直接用浏览器打开：

`/Users/ny/Downloads/5G网络优化教材端到端生产演练_2026-06-22/samples/task_workbench_3_4_progressive_sample/index.html`

## 当前定位

本样章是“多案例递进式课堂任务版”。它在3.3“能看懂”的基础上，解决一节课体量和学习丰富度不足的问题。

本版不再使用一个案例从头讲到底，而是按：

1. 入门样例；
2. 对照样例A；
3. 对照样例B；
4. 半扶手练习；
5. 独立实践；

组织完整课堂任务。

## 内容边界

本版案例均为教学模拟案例。案例不伪装成真实项目，阈值为本课验收目标，不代表通用行业标准。

案例设计原则是：可以合理化创造，但必须符合5G网络优化结果验证的基本专业逻辑，并且能把知识和技能传递给学生。

## 文件说明

- `index.html`：页面入口。
- `data.js`：5个案例、指标、互动题、结论结构、能力图谱、教师提示和来源边界。
- `app.js`：案例切换、互动反馈、结论生成、能力地图、教师/资源视图。
- `styles.css`：响应式样式。
- `qa/run_playwright_qa.cjs`：浏览器QA脚本。

## QA方式

```bash
NODE_BIN="/Users/ny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
NODE_MOD="/Users/ny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"
NODE_PATH="$NODE_MOD" "$NODE_BIN" "/Users/ny/Downloads/5G网络优化教材端到端生产演练_2026-06-22/samples/task_workbench_3_4_progressive_sample/qa/run_playwright_qa.cjs"
```

## 已知边界

1. 本版重点验证“多案例递进式学习结构”，不是正式视觉终稿；
2. 动画和小游戏仍以资源转化位为主；
3. 专业阈值、指标口径和结论表述仍需通信专业教师或行业专家复核；
4. 后续如果方向成立，应优先把半扶手练习和独立实践做成可提交、可批改、可导出的正式学习任务。
