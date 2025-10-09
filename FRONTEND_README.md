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
│   ├── fonts/          # 字體檔案
│   │   ├── NotoSansTC-Regular.ttf    # Noto Sans TC 正常體 (400)
│   │   ├── NotoSansTC-Medium.ttf     # Noto Sans TC 中等體 (500)
│   │   ├── NotoSansTC-Bold.ttf       # Noto Sans TC 粗體 (700)
│   │   └── Inter-VariableFont_opsz,wght.ttf  # Inter 可變字型 (100-900)
│   ├── icons/          # 圖示資源
│   │   └── menu/       # 選單 ICON（SVG）
│   └── style/          # 樣式檔案目錄
│       └── main.css    # Tailwind CSS 入口 + 自訂字體樣式
├── components/         # 可重用元件
│   ├── common/         # 共用元件
│   │   └── page-title.vue   # 頁面標題元件（可重用）
│   ├── layout/         # 佈局元件
│   │   └── page-header.vue  # 頁面頂部區塊（收合按鈕、返回總覽、時間、使用者名稱）
│   ├── overview/       # 總覽頁面專用元件
│   │   └── section-card-container.vue  # 卡片容器元件（支援水平滾動）
│   └── sidebar/        # 左側選單元件
│       ├── main-sidebar.vue     # 選單主容器（含路由跳轉邏輯）
│       ├── sidebar-menuitem.vue # 選單項目
│       └── sidebar-group.vue    # 群組選單
├── config/             # 配置檔案
│   └── menu.config.ts  # 選單項目配置
├── router/             # 路由配置
│   └── index.ts        # 路由定義（已啟用所有功能路由）
├── services/           # API 服務層
│   ├── auth.service.ts # 認證 API
│   └── user.service.ts # 使用者權限 API
├── stores/             # Pinia 狀態管理
│   ├── auth.store.ts   # 認證狀態管理
│   └── menu.store.ts   # 選單狀態管理
├── types/              # TypeScript 型別定義
│   ├── auth.ts         # 認證相關型別
│   ├── menu.ts         # 選單相關型別
│   └── user.ts         # 使用者權限型別
├── utils/              # 工具函數
│   └── axios.ts        # Axios 配置與攔截器
├── views/              # 頁面元件
│   ├── login-view.vue       # 登入頁面
│   ├── home-view.vue        # 首頁（含 PageHeader + Sidebar + 內容區域）
│   ├── overview-view.vue    # 總覽頁面
│   ├── customers-view.vue   # 客戶管理頁面
│   ├── environment-view.vue # 環境管理頁面
│   └── settings/            # 設定相關頁面
│       ├── accounts-view.vue    # 帳號管理
│       ├── roles-view.vue       # 權限設定
│       ├── modules-view.vue     # 模組設定
│       ├── industries-view.vue  # 產業別設定
│       └── dealers-view.vue     # 經銷商設定
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

### 5. 字體配置 (`src/assets/style/main.css`)

專案使用兩種字體：

- **Noto Sans TC**：主要用於中文介面（標題、一般文字）
- **Inter**：用於數字、英文、時間顯示

**字體檔案位置：**

```
src/assets/fonts/
├── NotoSansTC-Regular.ttf              # 正常體 (400)
├── NotoSansTC-Medium.ttf               # 中等體 (500)
├── NotoSansTC-Bold.ttf                 # 粗體 (700)
└── Inter-VariableFont_opsz,wght.ttf    # Variable Font (100-900)
```

**main.css 字體定義：**

```css
/* Tailwind CSS 基本樣式 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自訂字體定義 */
@layer base {
  /* Noto Sans TC - Regular (400) */
  @font-face {
    font-family: 'Noto Sans TC';
    font-weight: 400;
    font-style: normal;
    font-display: swap;
    src: url('@/assets/fonts/NotoSansTC-Regular.ttf') format('truetype');
  }

  /* Noto Sans TC - Medium (500) */
  @font-face {
    font-family: 'Noto Sans TC';
    font-weight: 500;
    font-style: normal;
    font-display: swap;
    src: url('@/assets/fonts/NotoSansTC-Medium.ttf') format('truetype');
  }

  /* Noto Sans TC - Bold (700) */
  @font-face {
    font-family: 'Noto Sans TC';
    font-weight: 700;
    font-style: normal;
    font-display: swap;
    src: url('@/assets/fonts/NotoSansTC-Bold.ttf') format('truetype');
  }

  /* Inter Variable Font (支援所有字重 100-900) */
  @font-face {
    font-family: 'Inter';
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
    src: url('@/assets/fonts/Inter-VariableFont_opsz,wght.ttf') format('truetype-variations');
  }
}

/* 自訂元件樣式 */
@layer components {
  /* 頁面主標題樣式 */
  .page-title-main {
    color: #1e293b;
    font-family: 'Noto Sans TC', sans-serif;
    font-size: 24px;
    font-weight: 700;
    line-height: 30px;
    letter-spacing: -0.2px;
  }

  /* 頁面副標題樣式 */
  .page-title-subtitle {
    color: #64748b;
    font-family: 'Noto Sans TC', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0.2px;
  }

  /* Header 時間顯示樣式 */
  .header-time {
    color: #000;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: -0.15px;
  }
}
```

**字體使用範例：**

| 區域        | 字體                 | 字重          | CSS 類別               |
| ----------- | -------------------- | ------------- | ---------------------- |
| 頁面主標題  | Noto Sans TC         | 700 (Bold)    | `.page-title-main`     |
| 頁面副標題  | Noto Sans TC         | 400 (Regular) | `.page-title-subtitle` |
| Header 時間 | Inter                | 500 (Medium)  | `.header-time`         |
| 選單文字    | Inter / Noto Sans TC | 400           | 依內容類型             |

---

## 🎨 可重用元件

### 1. PageTitle 元件

**路徑**: `src/components/common/page-title.vue`

**用途**: 統一的頁面標題元件，包含主標題和副標題

**使用範例**:

```vue
<template>
  <PageTitle title="總覽" subtitle="關鍵指標和客戶活動狀況" />
</template>

<script setup lang="ts">
import PageTitle from '@/components/common/page-title.vue'
</script>
```

### 2. Section-Card Container 元件

**路徑**: `src/components/overview/section-card-container.vue`

**用途**: 卡片容器元件，提供統一的佈局和水平滾動功能

**特色功能**:

- ✅ Flex 橫向佈局，卡片間距 20px
- ✅ 支援水平滾動（內容超出容器寬度時）
- ✅ **滑鼠滾輪自動轉換為水平滾動**
- ✅ 滾動條隱藏（視覺更簡潔）
- ✅ 響應式設計

**滾動方式**:
| 方式 | 說明 |
|------|------|
| 🖱️ 滑鼠拖拉 | 按住左鍵拖拉卡片 |
| 🖱️ 滑鼠滾輪 | 上下滾動 → 卡片左右移動 |
| 👆 觸控板 | 兩指左右滑動 |

**使用範例**:

```vue
<template>
  <section-card-container>
    <div class="flex-shrink-0 min-w-[360px] bg-white rounded-lg shadow-md p-6">卡片 1</div>
    <div class="flex-shrink-0 min-w-[360px] bg-white rounded-lg shadow-md p-6">卡片 2</div>
    <div class="flex-shrink-0 min-w-[360px] bg-white rounded-lg shadow-md p-6">卡片 3</div>
  </section-card-container>
</template>

<script setup lang="ts">
import SectionCardContainer from '@/components/overview/section-card-container.vue'
</script>
```

**重要提醒**:

- 每個卡片**必須**加上 `flex-shrink-0` class（防止被壓縮）
- 每個卡片建議設定 `min-w-[360px]` 或其他固定最小寬度
- 所有樣式應該在 template 的 class 中定義，避免在 `<style scoped>` 中設定寬度相關屬性

**技術實作**:

```typescript
// 監聽滑鼠滾輪事件，轉換為水平滾動
const handleWheel = (event: WheelEvent) => {
  // 檢查是否需要滾動
  const canScroll = containerRef.value.scrollWidth > containerRef.value.clientWidth
  if (!canScroll) return

  // 阻止預設的垂直滾動
  event.preventDefault()

  // 將垂直滾動轉換為水平滾動
  containerRef.value.scrollLeft += event.deltaY
}
```

---

## 🧭 路由與選單整合

### 路由結構

系統使用嵌套路由，所有功能頁面都在主佈局（`home-view.vue`）內，透過 `<router-view>` 動態切換內容。

```
/                          → 自動跳轉到 /overview
├── /overview              → 總覽頁面
├── /customers             → 客戶管理頁面
├── /environment           → 環境管理頁面
└── /settings              → 設定群組
    ├── /settings/accounts    → 帳號管理
    ├── /settings/roles       → 權限設定
    ├── /settings/modules     → 模組設定
    ├── /settings/industries  → 產業別設定
    └── /settings/dealers     → 經銷商設定
```

### 選單 Key 與路由對應

選單配置（`menu.config.ts`）中的 `key` 與路由路徑的對應關係：

| 選單 Key              | 路由路徑               | 頁面元件                       |
| --------------------- | ---------------------- | ------------------------------ |
| `overview`            | `/overview`            | `overview-view.vue`            |
| `customers`           | `/customers`           | `customers-view.vue`           |
| `environment`         | `/environment`         | `environment-view.vue`         |
| `settings.accounts`   | `/settings/accounts`   | `settings/accounts-view.vue`   |
| `settings.roles`      | `/settings/roles`      | `settings/roles-view.vue`      |
| `settings.modules`    | `/settings/modules`    | `settings/modules-view.vue`    |
| `settings.industries` | `/settings/industries` | `settings/industries-view.vue` |
| `settings.dealers`    | `/settings/dealers`    | `settings/dealers-view.vue`    |

### 選單點擊邏輯

在 `main-sidebar.vue` 的 `handleMenuClick` 函數中實現：

```typescript
function handleMenuClick(key: string) {
  // 1. 忽略分隔線
  if (key.includes('divider')) {
    return
  }

  // 2. 更新選單狀態（視覺回饋）
  menuStore.setActiveMenu(key)

  // 3. 路徑轉換
  let routePath = ''
  if (key.startsWith('settings.')) {
    // settings.accounts → /settings/accounts
    routePath = `/${key.replace('.', '/')}`
  } else {
    // overview → /overview
    routePath = `/${key}`
  }

  // 4. 執行路由跳轉
  router.push(routePath)
}
```

### 佈局結構

```
┌─────────┬──────────────────────────┐
│         │   PageHeader             │
│         ├──────────────────────────┤
│ Sidebar │                          │
│ (固定)  │     <router-view>        │
│         │   (動態內容區域)          │
│         │                          │
└─────────┴──────────────────────────┘
```

**特點：**

- Sidebar 和 PageHeader 始終保持不動
- 只有右側內容區域（`<router-view>`）會根據路由切換
- 選單狀態與當前路由同步

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

## 🔧 TypeScript 型別定義

### 認證相關型別 (`src/types/auth.ts`)

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
}

// API 統一回應格式
interface ApiResponse<T> {
  success: boolean
  message: string
  code?: string
  data: T | null
}
```

### 選單相關型別 (`src/types/menu.ts`)

```typescript
// 選單項目類型
type MenuItemType = 'item' | 'group' | 'divider'

// 選單項目介面
interface MenuItem {
  key: string // 唯一識別碼
  label: string // 顯示名稱
  type: MenuItemType // 項目類型
  icon?: string // ICON 檔名
  requiredPermissions?: string[] // 需要的權限代號
  children?: MenuItem[] // 子選單項目
  defaultExpanded?: boolean // 是否預設展開
}
```

### 使用者權限型別 (`src/types/user.ts`)

```typescript
// 使用者權限回應
interface UserInfoResponse {
  userId: string // 使用者 ID
  userName: string // 使用者名稱
  permissions: string[] // 功能權限代號清單
  roles: string[] // 角色清單
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

### Section-Card Container 使用規範

使用 `section-card-container` 時，請遵循以下規範：

1. **卡片必須防止壓縮**

   ```vue
   <!-- ✅ 正確：加上 flex-shrink-0 -->
   <div class="flex-shrink-0 min-w-[360px] ...">卡片內容</div>

   <!-- ❌ 錯誤：沒有 flex-shrink-0，卡片會被壓縮 -->
   <div class="min-w-[360px] ...">卡片內容</div>
   ```

2. **寬度設定在 template，不要在 style**

   ```vue
   <!-- ✅ 正確：所有樣式都在 template 中 -->
   <template>
     <div class="flex-shrink-0 min-w-[360px] bg-white ...">卡片</div>
   </template>

   <!-- ❌ 錯誤：在 style 中設定寬度會造成衝突 -->
   <template>
     <div class="card">卡片</div>
   </template>
   <style scoped>
   .card {
     @apply min-w-[360px]; /* 會覆蓋 template 的設定 */
   }
   </style>
   ```

3. **適當的卡片數量**
   - 至少 3-4 張卡片才能觸發滾動效果
   - 建議每張卡片最小寬度 320-400px

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

### Q6: 左側選單不顯示或顯示空白

**原因**: 使用者權限 API 錯誤或未登入

**解決方案**:

1. 確認已登入並取得 Token
2. 檢查 Browser Console 是否有錯誤訊息
3. 檢查 Network 標籤，確認 `/api/me/permissions` 回應正常
4. 確認使用者在資料庫中有配置權限

### Q7: 選單 ICON 不顯示（破圖）

**原因**: ICON 檔案路徑錯誤或檔名拼字錯誤

**解決方案**:

1. 確認所有 ICON 檔案都在 `src/assets/icons/menu/` 目錄
2. 確認檔名完全符合 `menu.config.ts` 中的定義
3. 確認 ICON 檔案格式為 SVG
4. 重新啟動開發伺服器

### Q8: 選單項目點擊後狀態沒有變化

**原因**: Store 狀態更新失敗或 localStorage 被阻擋

**解決方案**:

1. 檢查 Browser Console 是否有 JavaScript 錯誤
2. 確認不是在隱私/無痕模式（localStorage 會被阻擋）
3. 檢查 `menu.store.ts` 是否正確引入
4. 清除 localStorage 後重新登入測試

### Q9: 點擊選單後網址有變化但內容沒更新

**原因**: 頁面元件檔案不存在或路由配置錯誤

**解決方案**:

1. 確認所有頁面元件都存在於 `src/views/` 目錄
2. 確認 `src/views/settings/` 目錄已建立且包含所有設定頁面
3. 確認 `src/router/index.ts` 的路由配置正確
4. 檢查瀏覽器 Console 是否有模組載入錯誤

### Q10: 瀏覽器返回/前進時選單狀態不同步

**原因**: 路由變化時未更新選單狀態

**解決方案**:

1. 確認 `menu.store.ts` 正確監聽路由變化
2. 在 `home-view.vue` 或路由守衛中同步選單狀態
3. 使用 `watch` 監聽 `$route` 變化並更新選單

### Q11: 字體無法正常顯示或顯示為預設字體

**原因**: 字體檔案缺失或路徑錯誤

**解決方案**:

1. 確認字體檔案都在 `src/assets/fonts/` 目錄
   ```
   src/assets/fonts/
   ├── NotoSansTC-Regular.ttf
   ├── NotoSansTC-Medium.ttf
   ├── NotoSansTC-Bold.ttf
   └── Inter-VariableFont_opsz,wght.ttf
   ```
2. 確認 `main.css` 正確引入字體檔案
3. 清除瀏覽器快取並重新載入
4. 檢查 Browser Console 是否有 404 錯誤（字體檔案載入失敗）
5. 確認字體檔案格式正確（.ttf）

### Q12: Section-Card 容器無法滾動

**原因**: 卡片缺少 `flex-shrink-0` 或內容寬度不夠

**解決方案**:

1. 確認每個卡片都有 `flex-shrink-0` class
2. 確認每個卡片有設定最小寬度（如 `min-w-[360px]`）
3. 確認有足夠數量的卡片（至少 3-4 張）
4. 縮小瀏覽器視窗寬度測試
5. 在 Console 執行測試：
   ```javascript
   const container = document.querySelector('.section-card-container')
   console.log('容器寬度:', container.clientWidth)
   console.log('內容寬度:', container.scrollWidth)
   console.log('需要滾動:', container.scrollWidth > container.clientWidth)
   ```

### Q13: 滑鼠滾輪無法左右滾動

**原因**: 事件監聽器未正確添加或被其他元素攔截

**解決方案**:

1. 確認使用了最新版的 `section-card-container.vue`
2. 檢查 Console 是否有 JavaScript 錯誤
3. 確認滑鼠游標在卡片區域內
4. 嘗試在不同瀏覽器測試
5. 使用拖拉方式確認滾動功能是否正常

---

## 🧪 測試帳號

開發環境測試用（不同權限等級）：

| 帳號    | 密碼          | 角色       | 權限範圍                         |
| ------- | ------------- | ---------- | -------------------------------- |
| `admin` | `password123` | 一般管理員 | 除了帳號管理和權限設定的所有功能 |

**測試建議**：

1. 使用不同帳號登入，確認左側選單顯示的項目符合權限設定
2. 管理員應該看到所有選單項目
3. 一般使用者看不到「設定」群組

---

## 📂 相關檔案位置

| 檔案            | 路徑                                                 | 說明                            |
| --------------- | ---------------------------------------------------- | ------------------------------- |
| Vite 配置       | `vite.config.ts`                                     | 構建工具配置                    |
| TypeScript 配置 | `tsconfig.app.json`                                  | TS 編譯選項                     |
| Tailwind 配置   | `tailwind.config.js`                                 | 樣式工具配置                    |
| PostCSS 配置    | `postcss.config.js`                                  | CSS 後處理器                    |
| ESLint 配置     | `eslint.config.js`                                   | 程式碼檢查規則                  |
| 字體樣式配置    | `src/assets/style/main.css`                          | Tailwind + 自訂字體樣式         |
| Noto Sans TC    | `src/assets/fonts/NotoSansTC-*.ttf`                  | 中文字型（Regular/Medium/Bold） |
| Inter 字型      | `src/assets/fonts/Inter-VariableFont_*.ttf`          | 可變字型（100-900）             |
| 路由配置        | `src/router/index.ts`                                | 前端路由                        |
| API 配置        | `src/utils/axios.ts`                                 | HTTP 客戶端                     |
| 認證 Store      | `src/stores/auth.store.ts`                           | 登入狀態管理                    |
| 選單 Store      | `src/stores/menu.store.ts`                           | 選單狀態管理                    |
| 選單配置        | `src/config/menu.config.ts`                          | 選單項目配置                    |
| 認證服務        | `src/services/auth.service.ts`                       | 認證 API                        |
| 使用者服務      | `src/services/user.service.ts`                       | 使用者權限 API                  |
| 頁面標題元件    | `src/components/common/page-title.vue`               | 可重用的頁面標題元件            |
| 卡片容器元件    | `src/components/overview/section-card-container.vue` | 支援水平滾動的卡片容器          |
| 頁面頂部區塊    | `src/components/layout/page-header.vue`              | PageHeader 元件                 |
| 選單主容器      | `src/components/sidebar/main-sidebar.vue`            | Sidebar 元件（含路由跳轉邏輯）  |
| 選單項目        | `src/components/sidebar/sidebar-menuitem.vue`        | 選單項目元件                    |
| 群組選單        | `src/components/sidebar/sidebar-group.vue`           | 群組選單元件                    |

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
- [ ] 確保路由路徑與選單 key 對應（例如：`settings.accounts` → `/settings/accounts`）
- [ ] 如需 API，在 `src/services/` 建立對應 service
- [ ] 如需型別，在 `src/types/` 定義 interface
- [ ] 如需加入選單，在 `src/config/menu.config.ts` 更新配置
- [ ] 確保後端有對應的權限代號

### 新增 API 時

- [ ] 在 `src/types/` 定義請求/回應型別
- [ ] 在 `src/services/` 建立 API 方法
- [ ] 在元件中使用 try-catch 處理錯誤
- [ ] 加入 Loading 狀態處理

### 新增選單項目時

- [ ] 在 `src/config/menu.config.ts` 加入選單配置
- [ ] 設定 `key` 屬性（會用於路由跳轉）
- [ ] 準備對應的 ICON SVG 檔案（16x16px）
- [ ] 放置 ICON 到 `src/assets/icons/menu/`
- [ ] 設定 `requiredPermissions` 權限代號
- [ ] 確認後端已建立對應的權限資料
- [ ] 在 `src/router/index.ts` 建立對應的路由
- [ ] 建立對應的頁面元件
- [ ] 測試不同權限使用者的選單顯示
- [ ] 測試選單點擊後的路由跳轉

### 使用 Section-Card Container 時

- [ ] 引入 `section-card-container.vue` 元件
- [ ] 每個卡片都加上 `flex-shrink-0` class
- [ ] 每個卡片設定適當的最小寬度（如 `min-w-[360px]`）
- [ ] 所有樣式都在 template 的 class 中定義
- [ ] 不要在 `<style scoped>` 中設定寬度相關屬性
- [ ] 測試滑鼠拖拉滾動
- [ ] 測試滑鼠滾輪滾動
- [ ] 測試觸控板滾動
- [ ] 測試不同螢幕寬度的響應式效果

### 提交程式碼前

- [ ] 執行 `npm run lint` 檢查程式碼
- [ ] 執行 `npm run type-check` 檢查型別
- [ ] 測試登入/登出流程
- [ ] 測試路由權限控制
- [ ] 測試選單權限過濾
- [ ] 測試選單展開/收合功能
- [ ] 測試選單點擊後的路由跳轉
- [ ] 測試瀏覽器返回/前進功能
- [ ] 測試直接輸入網址訪問頁面
- [ ] 檢查 Console 無錯誤訊息

---

## 📄 License

Private Project

---

**最後更新**: 2025-10-09

**本次更新內容**:

- ✅ 新增 Section-Card Container 元件說明（支援滑鼠滾輪水平滾動）
- ✅ 更新專案結構（加入 components/overview/ 目錄）
- ✅ 新增可重用元件章節，詳細說明 PageTitle 和 Section-Card Container
- ✅ 新增 Section-Card Container 使用規範
- ✅ 更新常見問題（Q12, Q13）
- ✅ 更新開發檢查清單
- ✅ 更新相關檔案位置表格
