# 5G网络优化教材 Next.js 前端工程版

这是按“React + Next.js 前端先行，后端 Go 预留接口”整理的工程版原型。当前视觉主题为白底青绿色数字教材风格。

## 页面路由

- `/course`：课程首页，跟随 P1-P6 项目切换。
- `/project`：项目任务结构页。
- `/task`：学生学习页。
- `/graph`：课程能力图谱页。
- `/teacher`：教师授课/任务组织页。
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
