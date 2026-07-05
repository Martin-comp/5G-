# clean preview专家反馈吸收原型修改执行清单V0.1

生成时间：2026-06-29

适用对象：`samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/`

前置依据：

1. `reports/clean preview专家反馈吸收实施计划V0.1.md`
2. `reports/clean preview专家反馈吸收实施计划内部评审报告V0.1.md`
3. `reports/专家反馈处理_2026-06-29/朱启文专家反馈处理表V0.1.md`
4. `reports/专家反馈处理_2026-06-29/朱启文专家反馈处理计划全局影响评估V0.1.md`
5. `00_治理与索引/数字教材样章设计原则与质量门禁.md`

## 一、执行结论

本清单用于把专家反馈吸收实施计划转成下一轮可编码修改任务。下一轮可以进入 clean preview 原型修改，但必须按本清单控制范围。

本轮修改目标只有四项：

1. 顶部主导航从“课程、项目、图谱、教师、资源、交付”调整为“课程、项目、图谱、教师”；
2. “任务资源映射、素材子平台说明、交付说明”进入辅助入口，不再作为学生/教师主学习场景；
3. 教师端改为“任务组织、讲评与复核”，体现“AI预生成建议，教师审核确认”；
4. 图谱和任务资源建立可追踪映射：能力节点、资源卡片、学习活动、评价产出必须能互相定位。

本轮不做：

1. 不开发真实AI助手；
2. 不开发真实素材子平台后台；
3. 不接入出版社平台接口；
4. 不修改V0.3.13课程能力图谱主数据表；
5. 不重做P4-T2学生正文；
6. 不制作P2-T3页面；
7. 不修改历史追溯镜像。

## 二、辅助入口唯一落位方案

### 2.1 顶部一级导航

clean preview 顶部一级导航只保留：

1. 课程
2. 项目
3. 图谱
4. 教师

不得继续把“资源”“交付”作为顶部一级导航。

### 2.2 辅助入口

新增一个非主导航入口：

```text
平台支持
```

建议位置：页面右上角，位于四个主导航按钮右侧，视觉层级低于主导航。移动端可换行到主导航下方。

`平台支持` 打开后包含三项：

| 辅助项 | 作用 | 呈现边界 |
| --- | --- | --- |
| 任务资源映射 | 查看当前任务资源卡片如何挂接能力节点、学习活动和评价产出 | 属于教材呈现端的辅助信息 |
| 素材子平台说明 | 说明素材入库、媒体审查、资源包封装、版本追溯在后台完成 | 不写成已开发完成的后台系统 |
| 交付说明 | 说明资源输出和直接呈现两条交付路线 | 不进入学生学习路径 |

### 2.3 不允许的落位

1. 不放在顶部一级导航；
2. 不放在学生学习任务主流程中；
3. 不作为左侧场景导航；
4. 不把“素材子平台”写成真实可操作后台。

## 三、文件级修改清单

### 3.1 必须修改

| 文件或目录 | 修改内容 | 验收点 |
| --- | --- | --- |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/index.html` | 调整顶部入口容器，保留四个主导航并增加“平台支持”辅助入口挂载点 | 页面首屏不再出现一级“资源”“交付”按钮 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/app.js` | 调整场景路由、顶部导航、平台支持抽屉/区域、教师端流程、图谱资源映射渲染 | 主场景只剩课程/项目/图谱/教师；平台支持不改变主场景 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/data.js` | 补充最小数据契约：资源卡片、平台支持说明、AI教师建议、任务局部图谱 | 数据字段可被P4-T2和后续P2-T3复用 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/styles.css` | 增加平台支持入口、AI状态标签、任务局部图谱和资源映射样式 | 桌面和移动端不遮挡、不溢出 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/README.md` | 更新当前预览版使用说明和专家反馈吸收边界 | 说明四主导航、平台支持入口和不开发真实后台 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/task_workbench_3_5a1_two_period_sample/app.js` | P4-T2任务页教师端改为任务组织、讲评与复核；删除“教师带教”主身份 | 任务页教师视图不再出现“教师带教”作为页签或主标题 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/task_workbench_3_5a1_two_period_sample/data.js` | 增加P4-T2任务局部图谱、资源卡片映射、AI教师建议状态 | P4-T2资源能定位到P4T2-N01至P4T2-N08 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/task_workbench_3_5a1_two_period_sample/styles.css` | 增加任务局部图谱、AI建议卡、确认状态样式 | 学生/教师视图切换不破坏布局 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/qa/run_navigation_qa.cjs` | 更新导航断言和反向断言 | 检查主导航无“资源/交付” |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/qa/run_graph_resource_qa.cjs` | 更新图谱和资源映射断言 | 检查节点到资源、资源到节点、资源到评价产出 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/qa/run_expert_feedback_absorption_qa.cjs` | 新增专家反馈吸收专项QA | 检查AI教师端、平台支持入口、P4-T2任务页和旧词反向断言 |

### 3.2 可以修改但需谨慎

| 文件或目录 | 条件 |
| --- | --- |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/task_workbench_3_5a1_two_period_sample/index.html` | 仅在需要新增挂载点或标题容器时修改 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/task_workbench_3_5a1_two_period_sample/README.md` | 若任务页教师端和资源映射规则改变，应同步说明 |

### 3.3 本轮不修改

| 文件或目录 | 原因 |
| --- | --- |
| `samples/digital_textbook_overall_prototype_overall_0_5/` | 治理评审版，不被clean preview呈现层修改覆盖 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/digital_textbook_overall_prototype/` | 历史镜像，只作追溯 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/digital_textbook_overall_prototype_phase2_p4_loop/` | 历史镜像，只作追溯 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/digital_textbook_overall_prototype_phase3_p2_loop/` | 历史镜像，只作追溯 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/course_capability_graph_v2_relation_review/` | 关系评审镜像，不作为当前正式呈现层 |
| `reports/课程能力图谱*V0.3.13*.csv` | 主数据基线，不在本轮改写 |
| `assets/` | 原始媒体池，不在本轮改动 |
| `reports/专家评审使用说明材料_2026-06-27/` | 等原型修改和QA通过后再更新说明书 |

## 四、最小数据契约

### 4.1 资源卡片

建议在 `data.js` 中形成或补齐：

```js
{
  id: "R-P4T2-01",
  title: "P4-T2学习任务页",
  type: "direct_page",
  projectId: "P4",
  taskId: "P4-T2",
  nodeIds: ["P4T2-N01", "P4T2-N02"],
  activity: "识别投诉线索并判断验证场景",
  output: "投诉线索归类结果",
  platformRole: "textbook_resource",
  sourceAssetId: "",
  reviewState: "clean_preview_visible",
  supportEntry: "task_resource_mapping"
}
```

字段要求：

| 字段 | 是否必填 | 说明 |
| --- | --- | --- |
| `id` | 是 | 资源卡片唯一ID |
| `title` | 是 | 前端显示名称 |
| `type` | 是 | `direct_page`、`worksheet`、`table`、`interactive`、`media` 等 |
| `projectId` | 是 | 所属项目 |
| `taskId` | 是 | 所属任务 |
| `nodeIds` | 是 | 关联能力节点，可为多个 |
| `activity` | 是 | 学习动作，不能只写资源名称 |
| `output` | 是 | 学生或教师使用后形成的评价产出 |
| `platformRole` | 是 | `textbook_resource`、`material_backend`、`delivery_support` |
| `sourceAssetId` | 可空 | 原始素材或媒体对象ID |
| `reviewState` | 是 | clean preview可简化显示，治理版保留详细状态 |
| `supportEntry` | 是 | 对应平台支持入口 |

### 4.2 图谱节点

```js
{
  id: "P4T2-N03",
  title: "读覆盖指标",
  level: "task_node",
  projectId: "P4",
  taskId: "P4-T2",
  resourceIds: ["R-P4T2-03"],
  activity: "根据RSRP/SINR判断覆盖改善是否成立",
  output: "覆盖指标判断记录"
}
```

图谱节点必须能反查资源卡片，资源卡片必须能定位回图谱节点。

### 4.3 AI教师建议

```js
{
  id: "AI-P4T2-ORG-01",
  taskId: "P4-T2",
  type: "task_organization",
  status: "generated_pending_confirm",
  sourceInputs: ["P4T2 task graph", "resource mappings", "simulated learning evidence"],
  suggestion: "先用投诉场景引出验证问题，再组织指标判断和结论表达。",
  teacherAction: "confirm_or_adjust",
  output: "课堂任务组织方案"
}
```

状态枚举：

| 状态 | 前端显示 |
| --- | --- |
| `not_generated` | 待生成 |
| `generated_pending_confirm` | AI已生成，待教师确认 |
| `teacher_adjusted` | 教师已调整 |
| `confirmed` | 已确认 |
| `used_in_class` | 已用于课堂 |
| `reviewed` | 已复核 |

静态原型只需要模拟状态，不接入真实AI。

## 五、教师端修改清单

### 5.1 主页面教师端

修改后教师页主标题：

```text
任务组织、讲评与复核
```

副标题：

```text
AI预生成任务组织、课堂讲评和复核建议，教师审核确认后形成可执行教学安排。
```

教师端四个核心区域：

| 区域 | 内容 | 状态要求 |
| --- | --- | --- |
| 任务组织建议 | 学习目标、任务链、资源调用、课堂节奏 | AI已生成，待教师确认 |
| 课堂推进建议 | 提问脚本、示范顺序、练习节点 | 教师可调整 |
| 学情讲评建议 | 模拟错误分布、讲评优先级、二次学习路径 | 标注模拟学情 |
| 专业复核建议 | 指标阈值、结论口径、待复核项 | 明确不能替代专业教师复核 |

### 5.2 P4-T2任务页教师端

必须修改：

1. 页签或标题不再使用“教师带教”；
2. 改为“任务组织”或“教师组织”；
3. 增加“AI建议-教师确认”状态；
4. 学情讲评必须说明是模拟学情；
5. 专业复核不得写成已经完成；
6. 保留2课时课堂组织建议，但不放在学生端。

## 六、图谱与资源映射修改清单

### 6.1 整书图谱

保留课程主链：

```text
信息采集 -> 网络测试 -> 信息管理 -> 优化实施 -> 结果验证 -> 性能提升 -> 信令分析
```

整书图谱只说明全局方向，不展示所有V0.3.13节点。

### 6.2 项目图谱

项目四至少表达：

```text
P4-T1 优化实施 -> P4-T2 结果验证 -> P4-T3 报告输出
```

项目二至少表达：

```text
P2-T1 测试采集 -> P2-T3 数据分析
P2-T1 测试采集 -> P2-T2 异常处理 -> P2-T3 数据分析
```

### 6.3 P4-T2任务局部图谱

P4-T2任务局部图谱必须表达：

```text
P4T2-N01 识别验证场景
-> P4T2-N02 区分改善与达标
-> P4T2-N03 读覆盖指标
-> P4T2-N04 读移动性指标
-> P4T2-N05 读体验与容量指标
-> P4T2-N06 选择判断依据
-> P4T2-N07 形成验收结论
-> P4T2-N08 修正职业表达
```

每个节点至少挂接：

1. 一个资源卡片或任务页面片段；
2. 一个学习动作；
3. 一个评价产出；
4. 一个教师讲评点或专业复核点。

## 七、QA断言清单

### 7.1 语法检查

需要执行：

```bash
node --check samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/app.js
node --check samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/data.js
node --check samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/task_workbench_3_5a1_two_period_sample/app.js
node --check samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/task_workbench_3_5a1_two_period_sample/data.js
```

### 7.2 正向断言

1. 顶部主导航存在且只包含课程、项目、图谱、教师；
2. 页面存在“平台支持”辅助入口；
3. 平台支持入口包含任务资源映射、素材子平台说明、交付说明；
4. 教师页标题为“任务组织、讲评与复核”；
5. 教师页出现“AI预生成”或同义明确表达；
6. 教师页出现“教师审核确认”或同义明确表达；
7. 教师页出现AI建议状态标签；
8. 图谱页能从节点定位到资源卡片；
9. 资源卡片能反向定位到能力节点；
10. 资源卡片能显示学习活动和评价产出；
11. P4-T2任务页教师端改为任务组织、讲评或复核口径；
12. P4-T2任务页保留返回整书入口；
13. 本地 `file://` 打开 clean preview 和P4-T2任务页不报错；
14. 移动端不出现主导航遮挡或横向溢出；
15. 控制台无JavaScript错误。

### 7.3 反向断言

只针对 clean preview 主入口和P4-T2任务镜像，不扫描历史追溯目录。

1. 顶部主导航不得出现一级“资源”；
2. 顶部主导航不得出现一级“交付”；
3. 主教师页不得以“课前准备”为一级流程；
4. 主教师页不得以“教师带教”为标题；
5. P4-T2任务页不得以“教师带教”作为页签或主标题；
6. 学生学习路径中不得出现“交付说明”；
7. 学生学习路径中不得出现“素材子平台”；
8. clean preview 不得写“素材子平台已建成”；
9. clean preview 不得写“AI自动完成课堂组织且无需教师确认”；
10. clean preview 不得写“专业复核已完成”。

## 八、修改顺序

1. 修改 `data.js`：先建立平台支持、资源映射、AI教师建议和任务局部图谱数据；
2. 修改主 `app.js`：调整主导航、场景路由、教师页、平台支持入口、图谱资源映射；
3. 修改主 `styles.css` 和必要的 `index.html` 挂载点；
4. 修改P4-T2任务页 `data.js`、`app.js`、`styles.css`；
5. 更新QA脚本；
6. 运行语法检查；
7. 运行导航QA、图谱资源QA和专家反馈吸收专项QA；
8. 抽查桌面与移动截图；
9. 更新clean preview README；
10. QA通过后再更新专家说明书和治理文件。

## 九、进入修改前门禁

开始改原型前需确认：

1. 本清单已被治理文件索引；
2. 不修改历史追溯镜像；
3. 不修改overall-0.5治理评审版；
4. 不把辅助入口做回一级导航；
5. 不把AI写成替代教师；
6. 不把素材子平台写成已开发完成；
7. 不把P4-T2写成已通过真实一线教学验证；
8. 不启动P2-T3页面制作。

## 十、通过标准

本轮原型修改完成后，只有同时满足以下条件，才算通过：

1. 主导航层级清楚；
2. 平台支持辅助入口可用但不干扰学习主线；
3. 教师端体现AI预生成、教师审核确认；
4. P4-T2任务页教师端口径同步；
5. 图谱节点、资源卡片、学习活动、评价产出可追踪；
6. QA正向和反向断言全部通过；
7. 桌面和移动端截图可读；
8. README和治理文件同步；
9. 专家说明书更新计划明确，但不早于原型QA；
10. 当前下一步可以恢复为“修改clean preview原型”，而不是继续补计划。
