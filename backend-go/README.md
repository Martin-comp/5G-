# 5G数字教材 Go Mock API

这是给 Next.js 前端预留的 Go 后端 mock 服务。当前只用 Go 标准库，不依赖第三方框架。

## 运行

需要先安装 Go 1.22+。

```bash
cd backend-go
cp .env.example .env
go run ./cmd/server
```

默认端口：

```text
http://localhost:8080
```

也可以在 `.env` 里改端口，或临时指定端口：

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
POST /api/ai/hint
POST /api/ai/chat
POST /api/tts
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

## OpenMAIC 真实接入

当前已提供真实 OpenMAIC 代理入口：

```text
POST /api/ai/hint
```

如果老师提供 OpenMAIC 服务地址和密钥，可以这样启动：

```bash
cd backend-go
cp .env.example .env
# 然后编辑 .env：
# OPENMAIC_API_BASE=http://localhost:3001
# OPENMAIC_HINT_PATH=/api/ai/hint
# OPENMAIC_API_KEY=your_token
go run ./cmd/server
```

说明：

- `OPENMAIC_API_BASE`：OpenMAIC 服务根地址。
- `OPENMAIC_HINT_PATH`：OpenMAIC 提示接口路径，不填默认 `/api/ai/hint`。
- `OPENMAIC_API_KEY`：OpenMAIC 鉴权 token，没有鉴权时可不填。
- 后端会自动读取 `backend-go/.env`。

未配置 OpenMAIC 时，后端会返回本地规则提示，前端仍显示为 OpenMAIC 代理/降级模式。

## 云端 TTS 播报

前端“云端男声播报”会调用：

```text
POST /api/tts
```

后端默认按 OpenAI 兼容接口 `/v1/audio/speech` 生成 mp3。部署到 Render 时至少配置：

```text
TTS_API_KEY=your_tts_key
TTS_BASE_URL=https://api.openai.com/v1
TTS_MODEL=tts-1
TTS_VOICE=onyx
TTS_FORMAT=mp3
```

如果已经有 `OPENAI_API_KEY`，也可以不填 `TTS_API_KEY`，后端会自动读取 `OPENAI_API_KEY`。
