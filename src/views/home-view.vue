<template>
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

      <ToastMessage />

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
import ToastMessage from '@/components/common/toast-message.vue'
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
