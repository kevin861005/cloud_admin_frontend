<template>
  <div>
    <PageTitle title="環境管理" subtitle="刪除作業" />

    <CardContainer>
      <!-- 申請中卡片 -->
      <CardPending />

      <!-- 已通知卡片 -->
      <CardNotified />

      <!-- 待刪除卡片 -->
      <CardToDelete />
    </CardContainer>

    <TableContainer>
      <environment-table
        ref="customerTableRef"
        :show-filters="true"
        :show-search="true"
        :show-add-button="false"
        :show-checkbox="true"
        :show-edit-button="false"
        :show-border="false"
        @row-view="handleView"
      />
    </TableContainer>

    <!-- 環境詳細資訊 Drawer -->
    <EnvironmentDetailDrawer
      :is-open="isDrawerOpen"
      :environment-id="selectedEnvironmentId"
      @close="handleCloseDrawer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageTitle from '@/components/common/page-title.vue'
import CardContainer from '@/components/common/card-container.vue'
import CardPending from '@/components/environment/card-pending.vue'
import CardNotified from '@/components/environment/card-notified.vue'
import CardToDelete from '@/components/environment/card-to-delete.vue'
import TableContainer from '@/components/table/table-container.vue'
import EnvironmentTable from '@/components/environment/table-environment.vue'
import EnvironmentDetailDrawer from '@/components/environment/drawer-environment-detail.vue'

/**
 * 選中的客戶 ID
 */
const selectedEnvironmentId = ref<number | null>(null)

/**
 * Drawer 開啟狀態
 */
const isDrawerOpen = ref(false)

/**
 * 處理查看客戶
 * 跳轉到客戶詳情頁
 */
const handleView = (row: Record<string, unknown>) => {
  // 安全的型別轉換
  const environment = row as unknown as { id: number; name: string }
  console.log('查看環境:', environment)

  // 設定選中的客戶 ID 並開啟 Drawer
  selectedEnvironmentId.value = environment.id
  isDrawerOpen.value = true
}

/**
 * 處理關閉 Drawer
 */
const handleCloseDrawer = () => {
  isDrawerOpen.value = false
  // 延遲清空 customerId，避免 Drawer 關閉動畫時資料消失
  setTimeout(() => {
    selectedEnvironmentId.value = null
  }, 300)
}
</script>

<style scoped></style>
