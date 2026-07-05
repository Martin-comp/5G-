# 阶段2项目四小范围内容闭环原型

生成日期：2026-06-26  
版本：overall-0.3-phase2-p4  
入口：`index.html`

## 定位

本原型是在 `samples/digital_textbook_overall_prototype/` 的基础上复制生成的阶段2样本。它不覆盖原始 `overall-0.2`，也不替代任务级深样章 `3.5A-1`。

本版本只验证项目四小范围内容闭环：

```text
P4-T1 5G网络优化方案实施
-> P4-T2 5G网络优化结果验证
-> P4-T3 5G网络优化报告输出
```

## 当前实现

1. 课程首页：说明当前阶段从整书框架转入项目四闭环验证；
2. 项目视图：显示P4-T1、P4-T2、P4-T3三任务闭环路线；
3. 项目四内容样稿：展示P4-T1和P4-T3轻量教材样稿，保留P4-T2深样章入口；
4. 课程能力图谱：新增项目四20个详细节点的局部导航，继续保留V2.1关系评审入口；
5. 教师视图：展示项目四三任务的课堂组织提示；
6. 资源中心：展示P4-T1、P4-T2、P4-T3资源、活动、评价和审核状态；
7. 出版/编辑视图：保留资源包输出、直接呈现挂接、平台接口和质量检测边界。

## 依据文件

1. `../../reports/阶段1基线对齐报告V0.1.md`
2. `../../reports/阶段2项目四小范围内容闭环实施计划.md`
3. `../../reports/阶段2项目四V0.3.13闭环映射表.csv`
4. `../../reports/阶段2项目四内容闭环样稿V0.1.md`
5. `../../reports/课程能力图谱节点主数据表V0.3.13.csv`
6. `../task_workbench_3_5a1_two_period_sample/README.md`

## 已知边界

1. P4-T1和P4-T3是轻量样稿，尚未达到P4-T2深样章质量；
2. 专业阈值、参数依据、客户沟通边界仍需通信专业复核；
3. 原教材仿真软件截图、站点信息和测试截图不能直接作为正式资源发布；
4. 没有接入真实学习记录数据库；
5. 没有接入真实AI助手；
6. 没有接入出版社真实平台接口；
7. 真实一线教师/学生试看尚未完成。

## QA

运行方式：

```bash
NODE_BIN="/Users/ny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
NODE_MOD="/Users/ny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"
NODE_PATH="$NODE_MOD" "$NODE_BIN" "/Users/ny/Downloads/5G网络优化教材端到端生产演练_2026-06-22/samples/digital_textbook_overall_prototype_phase2_p4_loop/qa/run_playwright_qa.cjs"
```

QA覆盖：

1. 桌面端和移动端无横向溢出；
2. 控制台无错误；
3. 六个视图均可切换；
4. 项目四闭环路线可见；
5. P4-T1和P4-T3轻量样稿可见；
6. P4-T2深样章入口存在；
7. 课程能力图谱可显示项目四20个详细节点；
8. 资源中心显示项目四三任务资源；
9. 出版/编辑视图显示平台接口未接入边界。
