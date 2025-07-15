# Questions about Supabase real-time documentation
_Exported on 2025/7/15 at GMT+8 16:15:12 from Cursor (1.2.2)_

---

**User**

@https://supabase.com/docs/guides/realtime ? 4 w?

---

**Cursor**

你问的是 Supabase Realtime 的 4W（What, Why, When, Where）总结，参考了[Supabase 官方文档](https://supabase.com/docs/guides/realtime)：

**What（是什么）**  
Supabase Realtime 是一个全球分布式的实时服务，允许你在客户端之间发送和接收消息。它支持三大核心功能：  
- Broadcast（广播）：通过客户端库、REST 或数据库发送低延迟消息。  
- Presence（在线状态）：追踪和同步用户间的共享状态。  
- Postgres Changes（数据库变更）：监听数据库变更并推送给授权用户。

**Why（为什么用）**  
- 实现多人协作、实时聊天、在线状态同步等功能。  
- 提供低延迟、易用的实时数据推送能力。  
- 无需自建 WebSocket 服务，直接集成到 Supabase 项目中。

**When（什么时候用）**  
- 需要实时数据同步时（如多人编辑、聊天室、协作白板等）。  
- 需要追踪用户在线状态或共享状态时。  
- 需要监听数据库变更并实时响应时。

**Where（在哪里用）**  
- 适用于任何基于 Supabase 的 Web、移动或桌面应用。  
- 可在 Next.js、Flutter、React、Vue 等多种前端框架中使用。  
- 通过 Supabase 提供的客户端库、REST API 或直接在数据库层集成。

如需更详细的用法和代码示例，可以参考[官方文档](https://supabase.com/docs/guides/realtime)。

