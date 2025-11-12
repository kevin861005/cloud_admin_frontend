<template>
  <div>
    <!-- 頁面標題（使用可重用的 PageTitle 元件） -->
    <PageTitle title="帳號管理" subtitle="設定使用人員權限" />

    <TableContainer>
      <AccountManagementTable ref="tableRef" @row-view="handleViewUser" @add="handleAdd" />
    </TableContainer>

    <!-- 使用者詳細資料 Drawer -->
    <UserDetailDrawer
      :is-open="isDrawerOpen"
      :login-id="selectedLoginId"
      @close="closeDrawer"
      @updated="handleUserUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/components/common/page-title.vue'
import TableContainer from '@/components/table/table-container.vue'
import UserDetailDrawer from '@/components/account/drawer-user-detail.vue'
import AccountManagementTable from '@/components/account/table-account-management.vue'

// ===== Drawer 狀態 =====
const isDrawerOpen = ref(false)
const selectedLoginId = ref<string | null>(null)

/**
 * 表格元件的 ref（用於呼叫 refresh 方法）
 */
const tableRef = ref<{ refresh: () => Promise<void> } | null>(null)

/**
 * 處理查看按鈕點擊
 * @param row 帳號資料
 */
const handleViewUser = (user: Record<string, unknown>) => {
  console.log('查看使用者:', user)
  selectedLoginId.value = user.loginId as string
  isDrawerOpen.value = true
}

/**
 * 關閉 Drawer
 */
const closeDrawer = () => {
  isDrawerOpen.value = false
  // 延遲清空資料,等動畫結束
  setTimeout(() => {
    selectedLoginId.value = null
  }, 300)
}

/**
 * 處理使用者資料更新成功
 * 當 Drawer 更新成功後,重新載入表格資料
 */
const handleUserUpdated = () => {
  console.log('使用者資料已更新,重新載入表格')
  // 呼叫表格的 refresh 方法
  tableRef.value?.refresh()
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
