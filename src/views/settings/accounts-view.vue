<template>
  <div class="space-y-6">
    <!-- 頁面標題（使用可重用的 PageTitle 元件） -->
    <PageTitle title="帳號管理" subtitle="設定使用人員權限" />

    <TableContainer>
      <AccountManagementTable @row-view="handleViewUser" @add="handleAdd" />
    </TableContainer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import PageTitle from '@/components/common/page-title.vue'
import TableContainer from '@/components/common/table-container.vue'
import AccountManagementTable from '@/components/account/account-management-table.vue'

/**
 * 處理查看按鈕點擊
 * @param row 帳號資料
 */
const handleViewUser = (row: Record<string, unknown>) => {
  console.log('查看帳號:', row)
  // TODO: 實作查看詳情功能
  // 方案 1: 顯示彈窗
  // 方案 2: 跳轉到詳情頁面
}

/**
 * 帳號管理頁面
 */
const router = useRouter()

/**
 * 處理新增帳號
 * 跳轉到新增帳號頁面
 */
const handleAdd = () => {
  console.log('跳轉到新增帳號頁面')
  router.push('/settings/accounts/create')
}
</script>

<style scoped></style>
