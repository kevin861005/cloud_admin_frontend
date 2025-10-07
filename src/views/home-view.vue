<script setup lang="ts">
/**
 * 首頁（暫時）
 * 用於測試登入功能
 */
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

/**
 * 處理登出
 */
async function handleLogout() {
  await authStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Cloud Admin</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700"> 歡迎，{{ authStore.userInfo?.name }} </span>
            <button
              @click="handleLogout"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">登入成功！</h2>

          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-600">帳號</p>
              <p class="text-lg font-medium">{{ authStore.userInfo?.loginId }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-600">姓名</p>
              <p class="text-lg font-medium">{{ authStore.userInfo?.name }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-600">Email</p>
              <p class="text-lg font-medium">{{ authStore.userInfo?.email }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-600">角色</p>
              <div class="flex flex-wrap gap-2 mt-1">
                <span
                  v-for="role in authStore.userRoles"
                  :key="role"
                  class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {{ role }}
                </span>
              </div>
            </div>

            <div>
              <p class="text-sm text-gray-600">權限</p>
              <div class="flex flex-wrap gap-2 mt-1">
                <span
                  v-for="permission in authStore.userPermissions"
                  :key="permission"
                  class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {{ permission }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
