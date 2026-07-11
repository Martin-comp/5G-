# Go 后端接口预留说明

前端先用本地结构化数据完成 React + Next.js 原型。后端接入 Go 时，建议按下面几个资源拆分接口：

## 建议接口

- `GET /api/course/overview`：课程首页、项目链、统计信息。
- `GET /api/projects/:projectId`：项目详情、任务列表、前后置证据。
- `GET /api/tasks/:taskId`：任务页面、指标卡、课堂小任务、资源卡。
- `GET /api/graph/course`：课程能力图谱、能力节点、资源挂接关系。
- `GET /api/teacher/tasks/:taskId/suggestions`：AI预生成任务组织、讲评、复核建议。
- `POST /api/submissions`：学生提交课堂任务答案。

## 前端数据替换位置

当前静态数据集中在 `lib/textbook-data.ts`。后续接 Go 后端时，可先在 Next.js 中建立 `lib/api.ts`，再逐步把页面中的本地数据替换成 fetch 请求。

## Go 服务建议模块

- `course`：课程、项目、任务结构。
- `resource`：资源卡片、图谱挂接、素材来源。
- `classroom`：课堂任务、学生跟随与课堂状态。
- `submission`：作答、提交、批注、讲评状态。
- `teacher`：AI建议、教师审核、专业复核。
