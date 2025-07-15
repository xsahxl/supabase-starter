# Understanding edge functions
_Exported on 2025/7/15 at GMT+8 15:49:46 from Cursor (1.2.2)_

---

**User**

@https://supabase.com/docs/guides/functions 请解释？ 4 w？

---

**Cursor**

Supabase Edge Functions 是什么？（What）

Supabase Edge Functions 是一种在全球分布式边缘节点上运行的 TypeScript 服务器端函数。它们基于 Deno 运行时，支持 TypeScript 和 WASM，允许你在离用户更近的地方执行自定义逻辑，比如处理 Webhook、集成第三方服务（如 Stripe）、自定义 API 等。

这些代码会在“边缘节点”上运行，意思是会在离用户最近的服务器执行，响应速度更快。

为什么要用 Supabase Edge Functions？（Why）

- 延迟低：函数在全球边缘节点运行，响应速度快，用户体验更好。
- 易于扩展：支持 TypeScript，开发体验好，易于维护和扩展。
- 与 Supabase 深度集成：可以直接访问 Supabase 的数据库、认证、存储等服务。
- 安全隔离：每个函数独立运行，安全性高。

谁会用 Supabase Edge Functions？（Who）

- 需要自定义后端逻辑的开发者
- 需要处理 Webhook、第三方 API 集成的团队
- 追求低延迟、全球分布式服务的项目
- 使用 Supabase 作为后端的全栈开发者

在哪里用 Supabase Edge Functions？（Where）

- 在 Supabase 平台上开发和部署（支持本地开发和云端部署）
- 用于 Web 应用、移动应用、自动化任务、Webhook 监听、API 扩展等场景

何时用 Supabase Edge Functions？（When）

- 需要在用户请求时动态处理数据
- 需要与外部服务集成（如 Stripe、Slack、OpenAI 等）
- 需要自定义 API 或后端逻辑
- 需要低延迟、全球分布式的函数执行

更多详细信息和示例可以参考官方文档：[Supabase Edge Functions 官方文档](https://supabase.com/docs/guides/functions)

