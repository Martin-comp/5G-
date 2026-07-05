# 5G网络优化结果验证样章3.5A

入口文件：`index.html`

直接用浏览器打开：

`/Users/ny/Downloads/5G网络优化教材端到端生产演练_2026-06-22/samples/task_workbench_3_5a_review_ready_sample/index.html`

## 当前定位

本样章是“3.5A评审准备版”。它不推翻3.5的课程能力图谱驱动结构，而是在一线教师/学生试看前补齐几个关键短板：

1. 学生首屏看到先做什么、交什么、怎样算完成；
2. 每个案例都有完成标准；
3. 互动反馈后提供再试、看原因、修正和形成更好结论的路径；
4. 课程能力图谱在学生端转译为“我正在练什么、为什么练、练完能做什么”；
5. 右侧增加配置化术语字典；
6. 教师页增加45分钟课时安排、投屏/板书建议、提问脚本、典型答案、模拟学情和自学验收说明。

## 内容边界

本版案例均为教学模拟案例。案例不伪装成真实项目，阈值为本课验收目标，不代表通用行业标准。

术语字典是配置化词条，不是真实AI助手。模拟学情是用于验证教师页信息架构的模拟数据，不是真实学生数据。

本版仍未接入出版社平台接口、学习记录数据库、真实批改服务或真实AI助手。

## 文件说明

- `index.html`：页面入口和课程能力图谱弹层容器。
- `data.js`：课程能力图谱、五个案例、学习入口、完成标准、术语字典、教师工具、模拟学情和来源边界数据。
- `app.js`：案例切换、五类学习活动、二次修正、术语字典、课程能力图谱节点详情、教师/资源视图。
- `styles.css`：响应式样式、学习入口、术语字典、教师工具、模拟学情和模式差异样式。
- `qa/run_playwright_qa.cjs`：浏览器QA脚本。

## QA方式

```bash
NODE_BIN="/Users/ny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
NODE_MOD="/Users/ny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"
NODE_PATH="$NODE_MOD" "$NODE_BIN" "/Users/ny/Downloads/5G网络优化教材端到端生产演练_2026-06-22/samples/task_workbench_3_5a_review_ready_sample/qa/run_playwright_qa.cjs"
```

## 已知边界

1. 本版用于进入真实一线试看前的评审准备，不是出版社正式展示版；
2. 专业阈值、指标口径和结论表述仍需通信专业教师或行业专家复核；
3. 动画和小游戏仍是资源转化方向，并未正式制作；
4. 模拟学情必须在正式展示时继续标注为模拟数据；
5. 术语字典后续如升级为AI助手，必须增加内容安全、专业审核和回答边界机制。

