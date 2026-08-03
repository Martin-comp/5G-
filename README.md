# 5G网络优化数字教材

可部署的学生端、教师端与课堂协同样章。项目由 Next.js 前端和 Go API 组成，PostgreSQL 用于保存学习记录、测评、产出版本、教师审核和课堂状态。

## 当前能力

- P1、P2 顺序学习样章：问题、看图、步骤、纠偏、练习、产出六阶段，节点依次解锁。
- 正式测试：限时作答、最多三次、不可变答卷版本、首次/最高/最近成绩。
- 学习产出与成果包：提交、退回修改、认证通过和历史版本追溯。
- 教师工作台：真实学习进度、正确率、学习时长、错误知识点、AI 学情建议与批阅闭环。
- 课堂受控：教师显式同步当前页，在线学生加入听讲，支持退出提示、推送练习和实时回流。
- P4 创新样例：保留 Pixel.js 方向的四轮卡牌构筑互动、AI 助教与云端 TTS 讲评。
- 能力图谱、资源治理、公开生产流和交付包页面。

## 目录

- `next-frontend/`：Next.js 16 + React 前端。
- `backend-go/`：Go API、WebSocket 课堂通道与 PostgreSQL 存储。
- `DEPLOY.md`：Render + Netlify 公网部署步骤。

## 本地运行

需要 Node.js 20+、npm 和 Go 1.22+。

```bash
cd backend-go
cp .env.example .env
go run ./cmd/server
```

新开一个终端：

```bash
cd next-frontend
npm install
cp .env.example .env.local
npm run dev
```

打开 [http://localhost:3000/login](http://localhost:3000/login)。演示账号为 `student01`、`student02`、`student03` 和 `teacher01`，密码均为 `123456`。师生需填写相同班级编号。

## 验证

```bash
cd next-frontend
npm run lint
npm run build
```

```bash
cd backend-go
go test ./...
```

主要验收入口：

- `/student?project=P1`：学生学习首页。
- `/student/projects/P1`：项目任务链。
- `/learn/P1T1-N01`：节点六阶段自学。
- `/teacher?project=P1`：教师学情工作台。
- `/teacher/sessions/P1T1-N01`：教师授课控制台。
- `/graph?project=P1`：课程能力图谱。
- `/game?project=P4`：P4 卡牌互动样例。

## 环境变量

后端的完整模板在 `backend-go/.env.example`，主要包括 `DATABASE_URL`、DeepSeek/OpenMAIC 配置和 TTS 配置。前端通过 `NEXT_PUBLIC_API_BASE_URL` 连接 API。不要把真实 API key 提交到 Git。

`DATABASE_URL` 留空时后端使用内存模式，适合本地界面验证；公网部署必须配置 PostgreSQL，才能在服务重启后保留历史记录。
