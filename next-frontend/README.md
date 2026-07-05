# 5G网络优化教材 Next.js 前端工程版

这是按“React + Next.js 前端先行，后端 Go 预留接口”整理的工程版原型。当前视觉主题为白底青绿色数字教材风格。

## 页面路由

- `/course`：课程首页，跟随 P1-P6 项目切换。
- `/project`：项目任务结构页。
- `/task`：学生学习页。
- `/graph`：课程能力图谱页。
- `/teacher`：教师授课/任务组织页。
- `/game`：P4-T2/N04 游戏化互动闯关样章。
- `/demo-guide`：演示路由说明页。

访问 `/` 会自动进入 `/course`。

## 项目上下文

左侧项目链 P1-P6 已支持点击进入；课程首页、项目页、学生学习页、图谱页和教师页都会保留当前项目上下文。P4 显示深度样章，其他项目显示可扩展概览。

## API 层

- `lib/textbook-data.ts`：当前静态演示数据。
- `lib/api.ts`：Go 后端 API client。
- `.env.example`：后端地址配置示例。
- `docs/frontend-api-layer.md`：逐页替换 API 的建议。
- `docs/go-api-contract.md`：接口契约草图。

## 运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

打开：

```text
http://localhost:3000/course
```

## 构建检查

```bash
npm run build
```

- 顶部后端连接状态：自动检测 `GET /api/health`，显示“后端已连接”或“本地演示数据”。

## 老师反馈方向

已新增 P4-T2/N04 的 Pixel.js 方向互动样章：路线节点点击、移动性证据选择、闯关反馈。后续可继续接入 OpenMAIC 做 AI 提示、自动讲评和学习路径推荐。

## OpenMAIC 助教

`/game` 页面已接入 OpenMAIC 助教面板。前端调用 Go 后端：

```text
POST /api/ai/hint
```

Go 后端再根据环境变量转发到真实 OpenMAIC 服务。这样可以避免把 OpenMAIC key 暴露在浏览器里。

如果已经启动或部署了真实 OpenMAIC，可以在 `.env.local` 填写：

```bash
NEXT_PUBLIC_OPENMAIC_URL=http://localhost:3001
```

配置后 `/game` 页面会显示“打开真实助教”入口，并在页面下方展示 OpenMAIC 嵌入预览。
