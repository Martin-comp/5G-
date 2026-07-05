# 5G网络优化结果验证样章3.5

入口文件：`index.html`

直接用浏览器打开：

`/Users/ny/Downloads/5G网络优化教材端到端生产演练_2026-06-22/samples/task_workbench_3_5_graph_driven_sample/index.html`

## 当前定位

本样章是“课程能力图谱驱动版”。它在3.4多案例递进式课堂任务版的基础上，重点验证两件事：

1. 把“能力地图”升级为“课程能力图谱”，作为案例、卡片、练习和评价的暗线组织骨架；
2. 将五个案例的练习方式从单一选择题改成有岗位动作的归类、排序、标注、分类和结论拼装。

## 内容边界

本版案例均为教学模拟案例。案例不伪装成真实项目，阈值为本课验收目标，不代表通用行业标准。

本版只细化项目四任务2“5G网络优化结果验证”的课程能力图谱子图。全书完整课程能力图谱仍需后续批量抽取、补全和专家复核。

## 文件说明

- `index.html`：页面入口和课程能力图谱弹层容器。
- `data.js`：课程能力图谱、五个案例、指标、学习活动、课堂/自学模式、教师提示和来源边界。
- `app.js`：案例切换、五类学习活动、课程能力图谱节点详情、教师/资源视图。
- `styles.css`：响应式样式、图谱弹层、活动组件和模式差异样式。
- `qa/run_playwright_qa.cjs`：浏览器QA脚本。

## 五类学习活动

1. 投诉线索归类：把自然语言投诉转成覆盖、移动性、体验或容量验证对象。
2. 验证流程排序：排出移动性问题的处理顺序。
3. 指标行标注：把数据表中的指标标为通过依据或必须写边界。
4. 依据分类：把材料分成通过依据、边界和背景。
5. 结论拼装：按判断、依据、边界、建议组织可提交结论。

## QA方式

```bash
NODE_BIN="/Users/ny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
NODE_MOD="/Users/ny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"
NODE_PATH="$NODE_MOD" "$NODE_BIN" "/Users/ny/Downloads/5G网络优化教材端到端生产演练_2026-06-22/samples/task_workbench_3_5_graph_driven_sample/qa/run_playwright_qa.cjs"
```

## 已知边界

1. 本版重点验证课程能力图谱与学习活动的结构关系，不是正式视觉终稿；
2. 动画和小游戏仍以资源转化方向呈现，并未正式制作；
3. 专业阈值、指标口径和结论表述仍需通信专业教师或行业专家复核；
4. 当前样章是静态前端原型，未接入出版社平台接口、学习记录数据库或真实批改服务。
