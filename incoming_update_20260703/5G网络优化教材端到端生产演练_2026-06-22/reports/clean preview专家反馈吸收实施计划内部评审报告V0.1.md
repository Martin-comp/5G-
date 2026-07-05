# clean preview专家反馈吸收实施计划内部评审报告V0.1

生成时间：2026-06-29

评审对象：`reports/clean preview专家反馈吸收实施计划V0.1.md`

评审依据：

1. `reports/专家反馈处理_2026-06-29/朱启文专家反馈处理表V0.1.md`
2. `reports/专家反馈处理_2026-06-29/朱启文专家反馈处理计划全局影响评估V0.1.md`
3. `00_治理与索引/数字教材样章设计原则与质量门禁.md`
4. `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/index.html`
5. `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/app.js`
6. `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/task_workbench_3_5a1_two_period_sample/`

## 一、评审结论

结论：有条件通过。

该实施计划已经可以作为下一轮 clean preview 原型修改的上位约束，但不能直接进入编码修改。进入原型修改前，需要补充一份更具体的执行清单，明确改哪些文件、保留哪些历史镜像、辅助入口如何落位、QA脚本如何改、哪些旧文案必须消除。

判断理由：

1. 计划正确识别了专家反馈的结构性影响，不再把反馈当成局部文案意见；
2. 计划保留了“资源输出”和“直接呈现”两条路线，没有简单删除资源和交付逻辑；
3. 计划明确了“AI预生成、教师审核确认”的责任边界，避免AI替代教师的风险；
4. 计划提出整书、项目、任务三级图谱，解决全局图谱和任务学习之间的粒度冲突；
5. 计划明确P2-T3必须等新教师端、资源端和图谱规则确定后再推进；
6. 但计划仍停留在实施计划层，尚未具备可直接改代码的文件级和断言级清单。

## 二、通过项

| 编号 | 通过项 | 判断 |
| --- | --- | --- |
| P-01 | 平台三层架构 | 已明确数字教材呈现端、AI教学组织层、素材/生产/交付子平台 |
| P-02 | 两种输出路线 | 已明确资源输出和直接呈现都必须保留 |
| P-03 | AI责任边界 | 已明确AI生成建议、教师审核确认，不写成AI完全替代教师 |
| P-04 | 主导航方向 | 已判断资源/交付不应继续作为学生教师主学习场景 |
| P-05 | 图谱表达方向 | 已提出整书图谱、项目图谱、任务局部图谱三级表达 |
| P-06 | P4-T2处理边界 | 已明确不重做学生正文，优先改教师端、任务资源端和局部图谱 |
| P-07 | P2-T3前置条件 | 已明确P2-T3不能沿用旧教师端和资源端结构 |
| P-08 | QA意识 | 已列出导航、教师端、图谱、资源映射、P4-T2、本地Safari和移动端QA |

## 三、主要问题

### 问题1：辅助入口落位还不够明确

严重度：中高

计划建议把“任务资源、素材子平台、交付说明”放入右上角或页尾“平台支持”区域，但没有确定具体位置、交互方式和默认可见性。

风险：

1. 原型修改时可能出现多个版本：有的人放右上角，有的人放页尾；
2. QA脚本无法稳定定位入口；
3. 专家可能仍然不知道资源输出和直接呈现路线在哪里。

建议：

1. 在原型修改前确定唯一方案；
2. 建议使用“平台支持”折叠入口或页尾辅助入口；
3. 入口项建议为“任务资源映射”“素材子平台说明”“交付说明”；
4. 辅助入口不参与学生主学习路径，不占顶部一级导航。

### 问题2：文件修改边界不够具体

严重度：高

clean preview 目录中存在多个历史镜像目录，例如：

1. `digital_textbook_overall_prototype/`
2. `digital_textbook_overall_prototype_phase2_p4_loop/`
3. `digital_textbook_overall_prototype_phase3_p2_loop/`
4. `task_workbench_3_5a1_two_period_sample/`

当前计划没有明确哪些文件可以改、哪些历史镜像只能追溯。

风险：

1. 可能误改历史镜像，破坏追溯证据；
2. 可能只改主入口，遗漏P4-T2任务页；
3. 可能改了主资产而忘记clean preview镜像。

建议：

原型修改前必须形成文件级执行清单：

| 文件或目录 | 是否修改 | 原因 |
| --- | --- | --- |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/index.html` | 是 | 顶部导航和辅助入口 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/app.js` | 是 | 主导航、教师页、图谱和资源入口 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/styles.css` | 可能 | 新辅助入口和图谱布局 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/data.js` | 可能 | 资源映射和平台支持说明 |
| `samples/digital_textbook_overall_prototype_overall_0_5_clean_preview/task_workbench_3_5a1_two_period_sample/` | 是 | P4-T2教师端和任务资源页 |
| `digital_textbook_overall_prototype*`历史镜像目录 | 否 | 只作追溯，不在本轮改动 |

### 问题3：资源和图谱的数据契约仍偏概念化

严重度：中高

计划列出了 `node_id`、`resource_id`、`source_asset_id`、`activity_id`、`output_id`、`package_id`、`version_id`，但没有说明当前前端数据如何承载这些字段。

风险：

1. 实现时可能继续用文本硬编码；
2. 资源卡片和能力节点关系仍然只是显示层关系；
3. 后续P2-T3无法复用。

建议：

原型修改前补充最小数据契约：

| 字段 | 当前阶段要求 |
| --- | --- |
| `resource.id` | 必须唯一 |
| `resource.node` | 必须能对应能力节点ID或节点范围 |
| `resource.activity` | 必须说明学习动作 |
| `resource.output` | 必须说明评价产出 |
| `resource.platformRole` | 区分教材呈现端资源、素材后台资源、交付资源 |
| `resource.sourceAssetId` | 可为空，但字段应预留 |
| `resource.reviewState` | clean preview不展示内部状态，但治理版应保留 |

### 问题4：AI教师端缺少状态设计

严重度：中

计划已提出AI生成、教师审核确认，但没有定义界面状态。

风险：

1. 页面可能只是写一段“AI生成建议”，缺少可操作感；
2. 教师无法理解确认、修改、发布的流程；
3. 后续接入真实AI助手时缺少状态模型。

建议：

至少定义四种状态：

1. `AI已生成建议`；
2. `教师待确认`；
3. `教师已调整`；
4. `已形成课堂执行方案`。

在静态原型中可用标签和按钮模拟，不需要真实AI。

### 问题5：QA缺少反向断言

严重度：中高

计划列出了要检查什么，但还没有列出必须不存在什么。

风险：

1. 顶部导航仍保留“资源/交付”，QA可能没有发现；
2. “课前准备”“教师带教”旧词仍出现在主流程；
3. 历史镜像中的旧词被误纳入当前QA，造成误判。

建议：

QA必须增加反向断言：

1. clean preview主入口顶部导航不显示“资源”“交付”；
2. clean preview主教师页不以“课前准备”为一级流程；
3. clean preview主教师页不以“教师带教视图”为标题；
4. P4-T2任务页不再显示“教师带教”页签；
5. 主学习流程中不出现“资源中心”作为学生/教师主入口；
6. 交付说明不出现在学生学习路径中。

注意：这些断言只针对当前正式预览入口和P4-T2任务镜像，不扫描历史追溯目录。

## 四、是否可以进入原型修改

当前不建议直接进入原型修改。

建议先补一份 `clean preview专家反馈吸收原型修改执行清单V0.1.md`，内容包括：

1. 文件级修改清单；
2. 导航落位方案；
3. AI教师端状态模型；
4. 资源/图谱最小数据契约；
5. P4-T2任务页修改点；
6. QA断言清单；
7. 不修改的历史镜像目录清单。

该清单完成后，可以进入原型修改。

## 五、内部评分

| 维度 | 分数 | 说明 |
| --- | ---: | --- |
| 专家反馈理解 | 90 | 对四条批注理解准确 |
| 全局影响覆盖 | 86 | 覆盖平台分层、AI、素材、图谱、P2-T3 |
| 可执行性 | 76 | 缺少文件级清单、状态模型和QA反向断言 |
| 风险控制 | 82 | 主要风险已列出，但落地控制还需细化 |
| 治理一致性 | 88 | 与当前治理原则一致 |

综合评分：84/100。

结论：有条件通过。可作为上位实施计划保留，但进入原型修改前必须补充执行清单。

## 六、下一步建议

下一步建议不是直接改 clean preview，而是形成：

`reports/clean preview专家反馈吸收原型修改执行清单V0.1.md`

该清单完成并通过快速检查后，再开始修改 clean preview 原型。
