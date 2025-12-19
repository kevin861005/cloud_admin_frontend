<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- 左側：Sidebar（固定定位，不隨頁面滾動） -->
    <aside
      class="fixed left-0 top-0 z-40 h-screen border-r border-r-[rgba(0,0,0,0.08)] bg-white transition-all duration-300 ease-in-out"
      :class="menuStore.isCollapsed ? 'w-0 overflow-hidden' : 'w-[255px]'"
    >
      <div class="w-[255px]">
        <Sidebar />
      </div>
    </aside>

    <!-- 右側：PageHeader + 內容區域 -->
    <div
      class="flex h-screen flex-col overflow-hidden bg-neutral-50 transition-all duration-300 ease-in-out"
      :class="menuStore.isCollapsed ? 'ml-0' : 'ml-[255px]'"
    >
      <PageHeader class="flex-shrink-0" />

      <ToastMessage />

      <main class="min-h-0 flex-1 overflow-y-auto bg-neutral-50">
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
