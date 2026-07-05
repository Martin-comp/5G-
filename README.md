# 5G网络优化数字教材工程原型

当前项目包含两个部分：

- `next-frontend/`：React + Next.js 前端工程版。
- `backend-go/`：Go 标准库 Mock API 服务。

## 前端

运行：

```bash
cd next-frontend
npm install
cp .env.example .env.local
npm run dev
```

打开：

```text
http://localhost:3000/course
```

已完成：

- 白底青绿色数字教材风格。
- 真实 Next.js 路由：`/course`、`/project`、`/task`、`/graph`、`/teacher`、`/demo-guide`。
- P1-P6 项目上下文联动。
- 课程首页、项目页、学生学习页、图谱页、教师页均可按项目切换。
- P4 保留深度样章，其他项目显示可扩展概览。
- API client：`next-frontend/lib/api.ts`。
- 顶部后端连接状态：自动检测 `GET /api/health`，显示“后端已连接”或“本地演示数据”。

## 后端

需要安装 Go 1.22+。

运行：

```bash
cd backend-go
cp .env.example .env
go run ./cmd/server
```

默认地址：

```text
http://localhost:8080
```

接口：

```text
GET  /api/health
GET  /api/course/overview
GET  /api/projects/P1
GET  /api/projects/P4
GET  /api/tasks/P4T2-N04
GET  /api/graph/course?project=P2
GET  /api/teacher/suggestions?project=P4
POST /api/submissions
```

## 联调说明

前端目前仍使用本地静态数据，保证没有 Go 环境也能演示。后续逐页切 API 时使用：

```text
next-frontend/lib/api.ts
next-frontend/.env.example
```

复制环境变量：

```bash
cd next-frontend
cp .env.example .env.local
```

## 老师反馈方向

已新增 P4-T2/N04 的 Pixel.js 方向互动样章：路线节点点击、移动性证据选择、闯关反馈。

OpenMAIC 已预留真实接入：

- 前端 `.env.local`：`NEXT_PUBLIC_OPENMAIC_URL=http://localhost:3001`
- 后端 `.env`：`OPENMAIC_API_BASE=http://localhost:3001`
- 后端接口：`POST /api/ai/hint`

未配置真实 OpenMAIC 时，页面仍可用本地规则助教演示；配置后 `/game` 会出现真实助教入口和嵌入预览。
