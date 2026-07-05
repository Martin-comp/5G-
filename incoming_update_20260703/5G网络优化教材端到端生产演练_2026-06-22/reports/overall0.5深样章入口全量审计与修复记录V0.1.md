# overall0.5深样章入口全量审计与修复记录V0.1

生成时间：2026-06-26

## 一、审计问题

用户反馈：当前 `overall-0.5` 原型无法打开深样章。

本次审计范围：

1. `samples/digital_textbook_overall_prototype_overall_0_5/index.html`
2. `samples/digital_textbook_overall_prototype_overall_0_5/data.js`
3. `samples/digital_textbook_overall_prototype_overall_0_5/app.js`
4. `samples/digital_textbook_overall_prototype_overall_0_5/styles.css`
5. `samples/digital_textbook_overall_prototype_overall_0_5/qa/run_playwright_qa.cjs`
6. `samples/task_workbench_3_5a1_two_period_sample/index.html`
7. `samples/course_capability_graph_v2_relation_review/index.html`

## 二、根因判断

审计结论：深样章文件存在，链接相对路径可用，真实点击能够导航成功；主要问题不是文件损坏或路径错误，而是入口可发现性和QA覆盖不足。

具体问题：

1. 课程首页的“任务级深样章 P4-T2 3.5A-1”只是状态卡，不是可点击入口；
2. 用户需要先进入项目四，才会看到“打开深样章”按钮，入口层级不够直接；
3. 原QA只检查链接 `href` 和目标文件是否存在，没有实际点击验证深样章是否打开；
4. 因此页面在工程上可跳转，但在用户使用路径上容易被判断为“打不开”或“找不到可打开入口”。

## 三、修复内容

已完成以下修复：

1. 在课程首页 `overall-0.5` 状态区下方新增“直接打开P4-T2任务级深样章”入口；
2. 在课程首页同时提供“进入项目四闭环”和“查看P2-T3候选位置”入口；
3. 将项目四任务链中的深样章入口增加稳定 `data-link` 标识；
4. 将项目四闭环路线中的深样章入口增加稳定 `data-link` 标识；
5. 将版本入口中的P4-T2深样章卡片增加稳定 `data-link` 标识；
6. QA脚本从“只检查链接存在”升级为“真实点击并验证跳转后的页面标题/正文”；
7. QA脚本同时点击验证V2.1关系评审入口，避免后续出现同类跨页面链接盲点；
8. QA脚本使用 `pathToFileURL` 生成本地文件URL，降低中文路径和空格路径导致的误判风险。

## 四、复核结果

复跑命令：

```bash
NODE_BIN="/Users/ny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
NODE_MOD="/Users/ny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"
NODE_PATH="$NODE_MOD" "$NODE_BIN" "/Users/ny/Downloads/5G网络优化教材端到端生产演练_2026-06-22/samples/digital_textbook_overall_prototype_overall_0_5/qa/run_playwright_qa.cjs"
```

复跑结果：

1. QA生成时间：`2026-06-26T15:28:02.480Z`
2. 桌面端：1440x960，无横向溢出；
3. 移动端：390x844，无横向溢出；
4. 控制台错误：0；
5. 断言：15项全部通过。

新增关键断言：

1. 课程首页深样章入口可点击打开；
2. 项目四任务链深样章入口可点击打开；
3. 版本入口深样章可点击打开；
4. V2.1关系评审入口可点击打开。

## 五、保留边界

1. 本次修复解决的是入口和点击链路问题，不改变P4-T2深样章本身内容；
2. P2-T3仍只是深样章候选，不应因为首页出现深样章入口而误认为P2-T3已完成；
3. `overall-0.5` 仍是整书综合母版原型，不是完整数字教材定稿；
4. 通信专业复核、媒体审查、真实一线试看、出版社平台接口仍未完成。

## 六、后续QA要求

凡是跨页面入口，后续QA不能只检查 `href` 和文件存在，必须至少覆盖：

1. 入口在用户自然路径中可见；
2. 点击后URL进入目标页面；
3. 目标页面加载完成；
4. 目标页面出现关键标题或正文；
5. 控制台无错误。
