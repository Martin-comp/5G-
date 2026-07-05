# 5G数字教材 Go Mock API

这是给 Next.js 前端预留的 Go 后端 mock 服务。当前只用 Go 标准库，不依赖第三方框架。

## 运行

需要先安装 Go 1.22+。

```bash
cd backend-go
go run ./cmd/server
```

默认端口：

```text
http://localhost:8080
```

也可以指定端口：

```bash
ADDR=:8090 go run ./cmd/server
```

## 接口

```text
GET  /api/health
GET  /api/course/overview
GET  /api/projects/P1
GET  /api/projects/P4
GET  /api/tasks/P4T2-N04
GET  /api/graph/course?project=P2
GET  /api/teacher/suggestions?project=P4
GET  /api/teacher/tasks/P4T2-N04/suggestions?project=P4
POST /api/submissions
```

提交示例：

```bash
curl -X POST http://localhost:8080/api/submissions \
  -H 'Content-Type: application/json' \
  -d '{"taskId":"P4T2-N04","studentId":"demo","answer":"覆盖达标，但移动性未闭环。"}'
```

## 前端联调思路

Next 前端先保留本地静态数据，接口层见：

```text
next-frontend/lib/api.ts
```

后续可以逐页把 `lib/textbook-data.ts` 替换成 API 请求。
