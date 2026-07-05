# 整书综合母版原型 overall-0.5

生成日期：2026-06-26  
版本：overall-0.5-integrated  
入口：`index.html`

## 定位

本原型用于解决多个验证分支分散的问题，把以下成果统一到一个整书入口：

1. `overall-0.2`早期整书框架；
2. 阶段2项目四闭环样本；
3. 阶段3项目二闭环复制验证样本；
4. P4-T2任务级深样章3.5A-1；
5. 课程能力图谱V2.1关系评审入口。

本版本不是完整数字教材定稿，也不是出版社平台发布稿。

## 当前实现

1. 课程首页：展示6个项目、2个已接入项目级闭环、1个任务级深样章和1个候选深样章；
2. 项目视图：可在项目二和项目四之间切换，展示两个项目级闭环；
3. 图谱视图：整合课程主链、项目二19个节点和项目四20个节点，并保留V2.1关系评审入口；
4. 教师视图：说明项目二、项目四和P4-T2深样章的课堂入口；
5. 资源中心：合并项目二和项目四的资源治理状态；
6. 出版/编辑视图：展示资源输出、直接呈现挂接、平台接口和发布前门禁；
7. 版本入口：可从同一页面跳转到overall-0.2、阶段2项目四、阶段3项目二和P4-T2深样章。

## Safari本地预览镜像

Safari通过 `file://` 打开本地HTML时，跨兄弟目录跳转可能触发WebKit sandbox限制。为保证用户从整书母版直接点击深样章和图谱入口时不出现“打开页面失败”，本目录下保留以下同目录镜像：

1. `task_workbench_3_5a1_two_period_sample/`：P4-T2任务级深样章本地预览镜像；
2. `course_capability_graph_v2_relation_review/`：课程能力图谱V2.1关系评审版本地预览镜像；
3. `digital_textbook_overall_prototype/`、`digital_textbook_overall_prototype_phase2_p4_loop/`、`digital_textbook_overall_prototype_phase3_p2_loop/`：版本入口本地预览镜像。

上述镜像只用于 `overall-0.5` 本地预览点击稳定，不取代原始主资产目录；主样章仍以 `../task_workbench_3_5a1_two_period_sample/` 为准。

## 依据文件

1. `../../reports/整书综合母版overall0.5实施计划V0.1.md`
2. `../../reports/阶段2项目四小范围内容闭环收口审计报告V0.1.md`
3. `../../reports/阶段3项目二闭环复制验证收口审计报告V0.1.md`
4. `../../reports/项目级闭环样本共性流程提炼V0.1.md`
5. `../task_workbench_3_5a1_two_period_sample/README.md`

## 已知边界

1. P2-T3仍只是任务级深样章候选；
2. P4-T2虽已形成任务级深样章，但仍需一线试看和专业复核；
3. 项目二和项目四之外的项目仍为结构占位；
4. 图谱页是综合评审入口，不是学生第一学习界面；
5. 未接入真实AI助手、学习记录数据库或出版社平台接口；
6. 真实LOG、GPS、软件截图、设备照片和网管截图均不能默认发布。

## QA

运行方式：

```bash
NODE_BIN="/Users/ny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
NODE_MOD="/Users/ny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"
NODE_PATH="$NODE_MOD" "$NODE_BIN" "/Users/ny/Downloads/5G网络优化教材端到端生产演练_2026-06-22/samples/digital_textbook_overall_prototype_overall_0_5/qa/run_playwright_qa.cjs"
```

QA覆盖：

1. 桌面端和移动端无横向溢出；
2. 控制台无错误；
3. 课程首页显示overall-0.5定位；
4. 项目二和项目四均作为已接入闭环出现；
5. 项目二和项目四可切换；
6. P4-T2深样章入口存在；
7. P2-T3只显示为候选，不伪造深样章入口；
8. 图谱页显示项目二19个节点和项目四20个节点；
9. 资源中心合并两项目资源；
10. 出版/编辑视图显示平台接口未接入和发布门禁。
11. 课程首页、项目四任务链和版本入口的P4-T2深样章链接必须真实点击打开；
12. V2.1关系评审入口必须真实点击打开。
13. Safari `file://` 预览下跨目录入口必须改走同目录镜像路径，避免WebKit sandbox打开失败。
