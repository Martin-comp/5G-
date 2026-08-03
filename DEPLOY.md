# 完整公网部署

建议使用 Render 部署 Go API 和 PostgreSQL，Netlify 部署 Next.js 静态导出。

## 1. Render PostgreSQL

1. 在 Render 中创建 PostgreSQL 数据库，区域尽量与 Go 服务一致。
2. 打开数据库的 Connect 信息，找到 `Internal Database URL`。
3. 不要把这个 URL 写入仓库文件。

## 2. Render Go 后端

1. 连接 GitHub 仓库，使用根目录的 `render.yaml`，或手动设置：
   - Root Directory: `backend-go`
   - Build Command: `go build -o server ./cmd/server`
   - Start Command: `./server`
2. 配置必要环境变量：
   - `DATABASE_URL`：Render PostgreSQL 的 Internal Database URL。
   - `DEEPSEEK_API_KEY`：AI 助教使用的 key。
   - `DEEPSEEK_BASE_URL=https://api.deepseek.com/v1`
   - `DEEPSEEK_MODEL=deepseek-chat`
3. 需要 OpenMAIC 时再配置 `OPENMAIC_API_BASE`、`OPENMAIC_HINT_PATH` 和 `OPENMAIC_API_KEY`。
4. 需要云端男声播报时配置 `TTS_API_KEY`、`TTS_BASE_URL`、`TTS_MODEL`、`TTS_VOICE` 和 `TTS_FORMAT`。
5. 部署后访问 `https://<后端域名>/api/health`，`status` 应为 `ok`，`storage` 应为 `postgres`。

## 3. Netlify 前端

1. 连接同一 GitHub 仓库。根目录的 `netlify.toml` 已配置：
   - Base directory: `next-frontend`
   - Build command: `npm run build`
   - Publish directory: `out`
2. 配置：
   - `NEXT_PUBLIC_API_BASE_URL=https://<后端域名>`
   - `NEXT_PUBLIC_OPENMAIC_URL`：仅在需要打开完整 OpenMAIC 页面时填写。
3. 触发无缓存重新部署，确保前端构建时读到新的 API 域名。

## 4. 公网验收

1. 用两个浏览器窗口分别登录 `teacher01` 和 `student01`，密码 `123456`，班级编号相同。
2. 学生端打开 `/student?project=P1`，检查 P1/P2 切换、顺序解锁、正式测试和学习产出。
3. 教师端打开 `/teacher?project=P1`，检查学情卡、批阅和成绩回流。
4. 教师在 `/teacher/sessions/P1T1-N01` 点击同步，学生端加入听讲，检查换页、推送练习、退出提示和学生回流。
5. 访问 `/graph?project=P2` 和 `/game?project=P4`，检查角色导航、项目上下文和互动结算。
6. 重启 Render Web Service，再次查看已提交的学习记录，确认 PostgreSQL 持久化有效。

如果 `/api/health` 显示 `storage: memory`，表示 `DATABASE_URL` 未正确连接，此时不应进行持久化验收。
