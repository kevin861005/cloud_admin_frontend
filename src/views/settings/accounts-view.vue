<template>
  <div class="space-y-6">
    <!-- 頁面標題（使用可重用的 PageTitle 元件） -->
    <PageTitle title="帳號管理" subtitle="設定使用人員權限" />

    <TableContainer>
      <AccountManagementTable @row-view="handleViewUser" @add="handleAdd" />
    </TableContainer>

    <!-- 使用者詳細資料 Drawer -->
    <Drawer :is-open="isDrawerOpen" @close="closeDrawer"> </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/components/common/page-title.vue'
import TableContainer from '@/components/common/table-container.vue'
import Drawer from '@/components/common/drawer.vue'
import AccountManagementTable from '@/components/account/account-management-table.vue'
import type { UserListItem } from '@/types/user'

// ===== Drawer 狀態 =====
const isDrawerOpen = ref(false)
const selectedUser = ref<UserListItem | null>(null)

/**
 * 處理查看按鈕點擊
 * @param row 帳號資料
 */
const handleViewUser = (user: Record<string, unknown>) => {
  console.log('查看使用者:', user)
  selectedUser.value = user as unknown as UserListItem
  isDrawerOpen.value = true
}

/**
 * 關閉 Drawer
 */
const closeDrawer = () => {
  isDrawerOpen.value = false
  // 延遲清空資料,等動畫結束
  setTimeout(() => {
    selectedUser.value = null
  }, 300)
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
