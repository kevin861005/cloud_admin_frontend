# Cloud Admin 前端專案

Vue 3 + TypeScript + Tailwind CSS 的後台管理系統前端

---

## 📚 技術堆疊

- **框架**: Vue 3.5.22 (Composition API + `<script setup>`)
- **語言**: TypeScript 5.9
- **構建工具**: Vite 7.1.7
- **樣式**: Tailwind CSS v3.4.17
- **狀態管理**: Pinia 3.0.3
- **路由**: Vue Router 4.5.1
- **HTTP 客戶端**: Axios 1.12.2

---

## 📁 專案結構

```
src/
├── assets/              # 靜態資源
│   └── style/          # 樣式檔案目錄
│       └── main.css    # Tailwind CSS 入口
├── components/         # 可重用元件（待開發）
├── router/             # 路由配置
│   └── index.ts
├── services/           # API 服務層
│   └── auth.service.ts
├── stores/             # Pinia 狀態管理
│   └── auth.store.ts
├── types/              # TypeScript 型別定義
│   └── auth.ts
├── utils/              # 工具函數
│   └── axios.ts        # Axios 配置與攔截器
├── views/              # 頁面元件
│   ├── login-view.vue
│   └── home-view.vue
├── App.vue
└── main.ts
```

---

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 開發環境

```bash
npm run dev
```

訪問：`http://localhost:5173/login`

### 類型檢查

```bash
npm run type-check
```

### 程式碼檢查

```bash
npm run lint
```

---

## ⚙️ 配置說明

### 1. Vite 配置 (`vite.config.ts`)

```typescript
export default defineConfig({
  base: '/cloudadmin/', // 必須與後端 context-path 一致

  server: {
    port: 5173,
    proxy: {
      '/cloudadmin/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

### 2. Tailwind CSS 配置

**`tailwind.config.js`**

```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**`src/assets/style/main.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**`src/main.ts`** 中引入樣式

```typescript
import './assets/style/main.css'
```

### 3. API 配置 (`src/utils/axios.ts`)

- **Base URL**: `/cloudadmin/api`
- **自動附加 Token**: 請求攔截器自動加上 `Authorization` header
- **自動刷新 Token**: 401 錯誤時自動使用 Refresh Token 更新

### 4. 路由守衛 (`src/router/index.ts`)

- 未登入自動跳轉至 `/login`
- 已登入無法訪問登入頁
- `base` 設定為 `/cloudadmin/`（與後端 context-path 一致）

---

## 🔐 認證流程

### 登入

```typescript
// 呼叫登入 API
const success = await authStore.login({
  loginId: 'admin',
  password: 'password123',
})

// 成功後自動儲存 Token 到 localStorage
// - accessToken (1 小時)
// - refreshToken (7 天)
```

### Token 刷新機制

- Access Token 過期時，Axios 攔截器自動使用 Refresh Token 取得新 Token
- Refresh Token 過期則清除登入狀態並跳轉到登入頁
- 整個過程對使用者無感知

### 登出

```typescript
// 呼叫登出 API 並清除 Token
await authStore.logout()
```

---

## 📦 打包部署

### 步驟 1: 打包前端

```bash
npm run build
```

生成 `dist` 目錄，包含：

- `index.html`
- `assets/` (包含打包後的 JS 和 CSS)
- `favicon.ico`

### 步驟 2: 複製到後端專案

```bash
# 清空後端 static 目錄
rm -rf ../backend/src/main/resources/static/*

# 複製打包檔案
cp -r dist/* ../backend/src/main/resources/static/
```

### 步驟 3: 後端打包 WAR

```bash
cd ../backend
mvn clean package
```

### 自動化部署腳本

在 `package.json` 加入：

```json
{
  "scripts": {
    "build:prod": "npm run type-check && vite build",
    "deploy": "npm run build:prod && npm run copy-to-backend",
    "copy-to-backend": "rm -rf ../backend/src/main/resources/static/* && cp -r dist/* ../backend/src/main/resources/static/"
  }
}
```

使用：

```bash
npm run deploy
```

---

## 🎨 主要功能

### ✅ 已完成

- [x] 登入頁面（含表單驗證）
- [x] JWT Token 管理
- [x] Refresh Token 自動刷新機制
- [x] 路由權限控制（Navigation Guards）
- [x] 統一 API 回應格式處理
- [x] Axios 請求/回應攔截器
- [x] Pinia 狀態管理（認證 Store）
- [x] 全域錯誤處理
- [x] Loading 狀態管理

### 🚧 待開發

- [ ] 左側功能選單
- [ ] 總攬
- [ ] 客戶管理
- [ ] 環境刪除作業
- [ ] 帳號管理

---

## 🔧 TypeScript 型別定義

所有 API 相關的型別都定義在 `src/types/auth.ts`：

```typescript
// 登入請求
interface LoginRequest {
  loginId: string
  password: string
}

// 登入回應
interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  userInfo: UserInfo
}

// API 統一回應格式
interface ApiResponse<T> {
  success: boolean
  message: string
  code?: string
  data: T | null
}
```

---

## 🔑 環境變數（可選）

如需動態配置，可建立環境變數檔案：

**`.env.development`** (開發環境)

```env
VITE_BASE_URL=/
VITE_API_BASE_URL=/cloudadmin/api
```

**`.env.production`** (生產環境)

```env
VITE_BASE_URL=/cloudadmin/
VITE_API_BASE_URL=/cloudadmin/api
```

---

## 📝 開發規範

### TypeScript

- ✅ 嚴格模式啟用
- ✅ 禁止使用 `any`
- ✅ 所有 API 回應必須定義型別
- ✅ 使用 type-only imports (`import type`)

### Vue 元件

- ✅ 使用 Composition API + `<script setup>`
- ✅ 元件命名：PascalCase (UserProfile.vue)
- ✅ 檔名：kebab-case (user-profile.vue)
- ✅ 詳細中文註解（後端工程師友善）

### Tailwind CSS

- ✅ 僅使用 v3 的 utility classes
- ✅ 避免自定義 CSS
- ✅ 響應式設計（mobile-first）
- ✅ 使用 `@apply` 處理重複樣式（在 `main.css`）

### 程式碼風格

- ✅ ESLint + Prettier 自動格式化
- ✅ 提交前執行 `npm run lint`
- ✅ 遵循專案 ESLint 規則

---

## 🐛 常見問題

### Q1: 編譯錯誤 "Cannot find module '@/xxx'"

**原因**: TypeScript 路徑解析問題

**解決方案**:

1. 確認 `tsconfig.app.json` 有正確的 paths 設定
2. 重啟 VS Code 的 TypeScript Server
   ```
   Cmd/Ctrl + Shift + P → TypeScript: Restart TS Server
   ```
3. 清除快取
   ```bash
   rm -rf node_modules/.tmp
   npm run dev
   ```

### Q2: Tailwind 樣式不生效

**原因**: Tailwind 未正確編譯或路徑配置錯誤

**解決方案**:

1. 確認 `tailwind.config.js` 的 `content` 包含所有 Vue 檔案
2. 確認 `main.ts` 正確引入 `./assets/style/main.css`
3. 清除 Vite 快取
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

### Q3: API 請求 CORS 錯誤

**原因**: Vite proxy 設定不正確

**解決方案**:

1. 確認後端 Spring Boot 正在運行（port 8080）
2. 檢查 `vite.config.ts` 的 proxy 設定
3. 確認後端 CORS 配置允許前端來源

### Q4: 登入後 Token 無法儲存

**原因**: localStorage 被瀏覽器阻擋（隱私模式）

**解決方案**:

1. 檢查瀏覽器 Console 是否有錯誤訊息
2. 確認不是在隱私/無痕模式
3. 檢查瀏覽器的 localStorage 權限設定

### Q5: 打包後路徑錯誤（404）

**原因**: `base` 設定與部署路徑不一致

**解決方案**:

1. 確認 `vite.config.ts` 的 `base` 為 `/cloudadmin/`
2. 確認後端 `application.properties` 的 `server.servlet.context-path=/cloudadmin`
3. 確認 Spring Boot 的 `WebMvcConfig` 正確配置靜態資源

---

## 🧪 測試帳號

開發環境測試用：

- **帳號**: `admin`
- **密碼**: `admin`

---

## 📂 相關檔案位置

| 檔案            | 路徑                       | 說明           |
| --------------- | -------------------------- | -------------- |
| Vite 配置       | `vite.config.ts`           | 構建工具配置   |
| TypeScript 配置 | `tsconfig.app.json`        | TS 編譯選項    |
| Tailwind 配置   | `tailwind.config.js`       | 樣式工具配置   |
| PostCSS 配置    | `postcss.config.js`        | CSS 後處理器   |
| ESLint 配置     | `eslint.config.js`         | 程式碼檢查規則 |
| 路由配置        | `src/router/index.ts`      | 前端路由       |
| API 配置        | `src/utils/axios.ts`       | HTTP 客戶端    |
| 認證 Store      | `src/stores/auth.store.ts` | 登入狀態管理   |

---

## 📞 相關資源

- **Vue 3 文檔**: https://vuejs.org/
- **Tailwind CSS 文檔**: https://tailwindcss.com/
- **Vite 文檔**: https://vitejs.dev/

---

## 📋 開發檢查清單

### 新增頁面時

- [ ] 在 `src/views/` 建立 Vue 元件
- [ ] 在 `src/router/index.ts` 加入路由定義
- [ ] 設定 `meta.requiresAuth` 和 `meta.title`
- [ ] 如需 API，在 `src/services/` 建立對應 service
- [ ] 如需型別，在 `src/types/` 定義 interface

### 新增 API 時

- [ ] 在 `src/types/` 定義請求/回應型別
- [ ] 在 `src/services/` 建立 API 方法
- [ ] 在元件中使用 try-catch 處理錯誤
- [ ] 加入 Loading 狀態處理

### 提交程式碼前

- [ ] 執行 `npm run lint` 檢查程式碼
- [ ] 執行 `npm run type-check` 檢查型別
- [ ] 測試登入/登出流程
- [ ] 測試路由權限控制
- [ ] 檢查 Console 無錯誤訊息

---

## 📄 License

Private Project

---

**最後更新**: 2025-10-07
