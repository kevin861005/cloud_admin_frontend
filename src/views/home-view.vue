<template>
  <!--
    主頁佈局

    結構（正確版本）：
    ┌─────────┬──────────────────────────┐
    │         │   PageHeader (只在右側)   │
    │         ├──────────────────────────┤
    │ Sidebar │                          │
    │ (全高)  │     右側內容區域            │
    │ (完整)  │   (router-view)           │
    │         │                          │
    └─────────┴──────────────────────────┘

    功能：
    1. Sidebar: 左側功能選單（從頂部到底部完整顯示，根據 isCollapsed 狀態收合/展開）
    2. PageHeader: 右側區域的上方固定區塊（收合按鈕、返回總覽按鈕、時間、使用者名稱）
    3. router-view: 右側內容區域（動態顯示子路由）

    布局說明：
    - Sidebar 在左側，從頂部到底部完整顯示（不會被 PageHeader 覆蓋）
    - PageHeader 和內容區域在右側，並排在 Sidebar 旁邊

    動畫說明：
    - 使用 CSS transition（非 Vue transition）實現流暢的並行動畫
    - Sidebar 收合時：寬度從 240px → 0px
    - 右側內容同時展開：自動佔據剩餘空間
    - 動畫時間：300ms，緩動函數：ease-in-out
    - 視覺效果：Sidebar 和右側內容同時動畫，不會卡頓
  -->
  <div class="flex min-h-screen bg-gray-50">
    <!-- 左側：Sidebar（使用 CSS transition 實現流暢的收合/展開動畫） -->
    <div
      class="flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out border-r border-r-[rgba(0,0,0,0.08)]"
      :class="menuStore.isCollapsed ? 'w-0' : 'w-[255px]'"
    >
      <!-- 整合 Sidebar 元件（固定寬度 255px = w-[255px]） -->
      <div class="w-[255px]">
        <Sidebar />
      </div>
    </div>

    <!-- 右側：PageHeader + 內容區域（垂直佈局，會自動跟著展開） -->
    <div class="flex flex-1 flex-col min-w-0">
      <PageHeader class="sticky top-0 z-30" />

      <SuccessToast />

      <main class="flex-1 overflow-auto bg-gray-50">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import PageHeader from '@/components/layout/page-header.vue'
import Sidebar from '@/components/sidebar/sidebar-main.vue'
import SuccessToast from '@/components/common/success-toast.vue'
import { useMenuStore } from '@/stores/menu.store'
import { useAuthStore } from '@/stores/auth.store'

// ==================== Composables ====================

const menuStore = useMenuStore()
const authStore = useAuthStore()

// ==================== Lifecycle ====================

/**
 * 元件掛載時：
 * 如果 localStorage 有 Token 但沒有 userInfo，則嘗試恢復使用者資訊
 */
onMounted(async () => {
  if (!authStore.isAuthenticated && localStorage.getItem('accessToken')) {
    await authStore.restoreUserInfo()
  }
})
</script>
