<template>
  <div class="space-y-6">
    <!-- 頁面標題 -->
    <PageTitle title="新增帳號" subtitle="帳號名稱新增後無法變更" />

    <!-- TODO: 後續新增表單內容 -->
    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <p class="text-gray-500">新增帳號表單開發中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageTitle from '@/components/common/page-title.vue'

/**
 * 新增帳號頁面
 *
 * 功能：
 * - 建立新的使用者帳號
 * - 權限檢查：需要 settings.accounts 權限
 * - 從「帳號管理」頁面跳轉而來
 *
 * 路由：/settings/accounts/create
 */
</script>

<style scoped></style>
