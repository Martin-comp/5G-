# 数字教材整体原型

生成日期：2026-06-23  
版本：overall-0.2  
入口：`index.html`

## 定位

本原型用于验证《5G网络优化教材（高级）》整书级数字教材如何组织课程层、项目层、任务层、课程能力图谱、资源中心、教师带教和出版/编辑视图。

当前不是生产工具链，也不是完整数字教材成品。除项目四任务2外，其他任务尚未形成完整教材正文；P2-T3、P5-T3、P6-T2仅作为课程能力图谱关系层试拆样本。

## 当前实现

1. 课程首页：显示6个项目、18个任务、7个课程主链节点和1个纵向深样章；
2. 项目视图：显示项目目标、任务链、学习活动和任务状态；
3. 课程能力图谱：显示7个课程主链节点、四任务关系层、任务节点、节点邻域和V2.1完整关系评审版入口；
4. 教师带教：展示课程教学总览、项目四带教、任务2课堂组织和外部门禁；
5. 资源中心：展示资源类型、项目任务位置、图谱节点、状态和审核边界；
6. 出版/编辑视图：展示资源包输出、直接呈现挂接、平台接口和质量检测状态；
7. P4-T2深样章入口：链接到 `../task_workbench_3_5a1_two_period_sample/index.html`；
8. V2.1关系评审入口：链接到 `../course_capability_graph_v2_relation_review/index.html`。

## 依据文件

1. `../../reports/数字教材整体原型设计与实施计划.md`
2. `../../reports/整书层级与流转关系图.md`
3. `../../reports/课程能力图谱跨层映射表.csv`
4. `../task_workbench_3_5a1_two_period_sample/README.md`
5. `../course_capability_graph_v2_relation_review/README.md`

## 已知边界

1. 除P4-T2外，其他任务没有完整教材正文；
2. P2-T3、P5-T3、P6-T2只用于图谱关系层验证，不等同于任务级数字教材样章；
3. 没有接入真实学习记录数据库；
4. 没有接入真实AI助手；
5. 没有接入出版社真实平台接口；
6. 原教材媒体资源仍需逐项治理；
7. 教学模拟案例、指标阈值和结论口径仍需通信专业教师复核；
8. 真实一线教师/学生试看尚未完成。

## QA

运行方式：

```bash
NODE_BIN="/Users/ny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
NODE_MOD="/Users/ny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"
NODE_PATH="$NODE_MOD" "$NODE_BIN" "/Users/ny/Downloads/5G网络优化教材端到端生产演练_2026-06-22/samples/digital_textbook_overall_prototype/qa/run_playwright_qa.cjs"
```

QA覆盖：

1. 桌面端和移动端无横向溢出；
2. 控制台无错误；
3. 六个视图均可切换；
4. 项目四任务2深样章入口存在；
5. 课程能力图谱节点可点击并显示关联任务；
6. 课程能力图谱显示四任务关系层、V2.1入口和“不是完整定稿图谱”的边界说明；
7. 节点邻域能显示关系类型和评价产出；
8. 资源中心显示审核状态；
9. 出版/编辑视图显示平台接口未接入边界。

最新QA时间：2026-06-24T01:44:23.407Z。新增图谱页视觉截图：`qa/graph_desktop.png`、`qa/graph_mobile.png`。
