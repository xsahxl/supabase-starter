# 如何使用本地的url
_Exported on 2025/7/15 at GMT+8 13:32:05 from Cursor (1.2.2)_

---

**User**

目前是配置的线上的url，如何使用本地的呢

---

**Cursor**

你现在的 Supabase 配置是通过环境变量（process.env.NEXT_PUBLIC_SUPABASE_URL 和 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY）来设置的。要切换到本地 Supabase 实例，只需要把这两个环境变量的值改为你本地 Supabase 的 URL 和 ANON KEY 即可。

详细步骤如下：

1. 找到你的本地 Supabase 项目的 URL 和 ANON KEY。  
   - URL 通常是 http://localhost:54321 或类似的地址（可以在 supabase 本地启动日志中看到）。
   - ANON KEY 可以在本地 supabase 项目的 config.toml 或 supabase studio 的 Project Settings > API 页面找到。

2. 修改 nextjs-todo-list 项目的环境变量文件（通常是 .env.local，如果没有可以新建一个）：

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的本地anon key
```

3. 保存后，重启 Next.js 服务（pnpm dev 或 npm run dev）。

4. 代码无需更改，initSupabase.ts 会自动读取新的环境变量。

---

总结：只需修改 .env.local 文件中的 Supabase 相关环境变量为本地的值即可，无需改动代码。

如需进一步帮助（比如如何查找本地 Supabase 的 URL/KEY），请告诉我！

```plaintext
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的本地anon key
```

---

**User**

可以在 supabase 本地启动日志中看到？那本地如何启动supabase呢

---

**Cursor**

当然可以！本地启动 Supabase 的步骤如下（假设你已经安装了 Supabase CLI，如果没有，下面也有安装方法）：

---

### 1. 安装 Supabase CLI（如未安装）

```bash
npm install -g supabase
```
或用 Homebrew（推荐）：
```bash
brew install supabase/tap/supabase
```

---

### 2. 初始化 Supabase 项目（如还没初始化）

在你的项目根目录下运行：
```bash
supabase init
```
这会生成 supabase/ 目录和相关配置文件。

---

### 3. 启动本地 Supabase 服务

在项目根目录下运行：
```bash
supabase start
```
- 这会启动本地的数据库、API、Studio 等服务。
- 启动后，终端会显示类似如下日志：

```
Started supabase local development setup.
API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6...
service_role key: ...
```

你需要的就是 `API URL` 和 `anon key`。

---

### 4. 停止本地 Supabase

按下 `Ctrl+C` 即可停止服务。

---

### 5. 常见问题

- 如果端口被占用，可以用 `supabase stop` 停止所有 supabase 服务后再重启。
- 本地数据和云端数据是分开的，互不影响。

---

如需更详细的操作或遇到报错，欢迎随时问我！

```shellscript
npm install -g supabase
```

```shellscript
brew install supabase/tap/supabase
```

```shellscript
supabase init
```

```shellscript
supabase start
```

```plaintext
Started supabase local development setup.
API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6...
service_role key: ...
```

