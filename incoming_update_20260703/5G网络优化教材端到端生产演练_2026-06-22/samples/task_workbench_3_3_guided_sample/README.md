# 5G网络优化结果验证样章3.3

入口文件：`index.html`

直接用浏览器打开：

`/Users/ny/Downloads/5G网络优化教材端到端生产演练_2026-06-22/samples/task_workbench_3_3_guided_sample/index.html`

## 当前定位

本样章是“老师带学式零基础版”。它不是继续扩展3.2工作台，而是单独验证一个更低门槛的学习组织方式：一屏只解决一个小问题，用表、图、互动判断和结论拼句把学生带到“部分达标”的短结论。

## 结构

5个关卡：

1. 看懂投诉：先别急着说成功；
2. 找对数据：投诉要对应到指标；
3. 看覆盖：信号变好，但不能证明体验全好；
4. 看体验：改善不等于达标；
5. 拼结论：依据、边界、建议缺一不可。

## 文件说明

- `index.html`：页面入口。
- `data.js`：5关导学内容、表图数据、互动题、资源转化位、教师提示。
- `app.js`：关卡切换、答题反馈、结论拼句、能力地图、教师/资源视图。
- `styles.css`：响应式样式。
- `qa/run_playwright_qa.cjs`：浏览器QA脚本。

## QA方式

```bash
NODE_BIN="/Users/ny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
NODE_MOD="/Users/ny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"
NODE_PATH="$NODE_MOD" "$NODE_BIN" "/Users/ny/Downloads/5G网络优化教材端到端生产演练_2026-06-22/samples/task_workbench_3_3_guided_sample/qa/run_playwright_qa.cjs"
```

## 已知边界

1. 本版重点验证“看得懂、知道怎么学、能得出结论”，不是最终视觉稿；
2. 动画、互动、小游戏目前是可转化位，只有部分交互原型；
3. 样章数据仍为教学模拟数据，专业阈值和结论口径需专业教师或行业专家复核；
4. 若3.3仍看不明白，应继续降低术语密度和单屏信息量。
