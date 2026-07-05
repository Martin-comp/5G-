# 前端 API 层说明

当前页面仍使用 `lib/textbook-data.ts` 的本地静态数据，保证没有后端时也能演示。

已新增 API client：

```text
lib/api.ts
```

## 环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

默认指向：

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 后续替换路径

建议按页面逐步替换，而不是一次性全部替换：

1. `/course` 使用 `textbookApi.courseOverview()`。
2. `/project` 使用 `textbookApi.project(projectId)`。
3. `/task` 使用 `textbookApi.task('P4T2-N04')` 和 `textbookApi.submitAnswer()`。
4. `/graph` 使用 `textbookApi.graph(projectId)`。
5. `/teacher` 使用 `textbookApi.teacherSuggestions(projectId)`。

这样即使 Go 服务未启动，前端静态演示仍然不受影响。
