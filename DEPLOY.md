# 完整公网部署说明

这个项目分成两个公网服务：

- 前端：Netlify，目录 `next-frontend`
- 后端：Render，目录 `backend-go`

## 1. 先部署 Go 后端到 Render

1. 把整个项目推到 GitHub。
2. 在 Render 里选择 New Web Service，连接这个仓库。
3. 如果 Render 识别到 `render.yaml`，直接按 Blueprint 部署；否则手动填写：
   - Root Directory: `backend-go`
   - Build Command: `go build -o server ./cmd/server`
   - Start Command: `./server`
4. 在 Render 环境变量里填写：
   - `DEEPSEEK_API_KEY`: 你的 DeepSeek key
   - `DEEPSEEK_BASE_URL`: `https://api.deepseek.com/v1`
   - `DEEPSEEK_MODEL`: `deepseek-chat`
   - `OPENMAIC_API_BASE`: 如果 OpenMAIC 已部署，填写它的公网地址；没有就先留空
   - `OPENMAIC_HINT_PATH`: `/api/ai/hint`
   - `OPENMAIC_API_KEY`: OpenMAIC 需要鉴权时再填
5. 部署完成后打开：
   - `https://你的后端域名/api/health`
   - 看到 `{"status":"ok" ...}` 就说明后端可用。

## 2. 再部署前端到 Netlify

1. 在 Netlify 新建站点，连接同一个 GitHub 仓库。
2. Netlify 会读取根目录的 `netlify.toml`：
   - Base directory: `next-frontend`
   - Build command: `npm run build`
   - Publish directory: `next-frontend/out`
3. 在 Netlify 环境变量里填写：
   - `NEXT_PUBLIC_API_BASE_URL`: Render 后端公网地址，例如 `https://5g-digital-textbook-api.onrender.com`
   - `NEXT_PUBLIC_OPENMAIC_URL`: OpenMAIC 前端/服务公网地址，没有可先留空
4. 重新 Deploy。

## 3. 验证

部署完成后访问 Netlify 网址：

- `/course/?project=P1`
- `/project/?project=P4`
- `/game/?project=P6`

检查左侧 P1-P6 切换、互动游戏、提交判断、AI 助教问答是否正常。
