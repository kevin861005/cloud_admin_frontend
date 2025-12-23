<template>
  <div>
    <PageTitle title="環境管理" subtitle="刪除作業" />

    <CardContainer>
      <!-- 申請中卡片 -->
      <CardPending />

      <!-- 待刪除卡片 -->
      <CardToDelete />
    </CardContainer>

    <TableContainer>
      <EnvironmentTable ref="tableRef" @row-view="handleView" />
    </TableContainer>

    <!-- 環境詳細資訊 Drawer -->
    <EnvironmentDetailDrawer
      :is-open="isDrawerOpen"
      :environment-id="selectedEnvironmentId"
      @close="handleCloseDrawer"
      @delete-success="handleDeleteSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageTitle from '@/components/common/page-title.vue'
import CardContainer from '@/components/common/card-container.vue'
import CardPending from '@/components/environment/card-pending.vue'
import CardToDelete from '@/components/environment/card-to-delete.vue'
import TableContainer from '@/components/table/table-container.vue'
import EnvironmentTable from '@/components/environment/table-environment.vue'
import EnvironmentDetailDrawer from '@/components/environment/drawer-environment-detail.vue'

// ===== 元件參照 =====

/**
 * 表格元件參照（用於呼叫 refresh 等方法）
 */
const tableRef = ref<InstanceType<typeof EnvironmentTable> | null>(null)

// ===== Drawer 狀態 =====

/**
 * 選中的環境 ID
 */
const selectedEnvironmentId = ref<string | null>(null)

/**
 * Drawer 開啟狀態
 */
const isDrawerOpen = ref(false)

// ===== 事件處理 =====

/**
 * 處理查看環境
 * 開啟 Drawer 顯示環境詳情
 */
const handleView = (row: Record<string, unknown>) => {
  selectedEnvironmentId.value = String(row.id)
  isDrawerOpen.value = true
}

/**
 * 處理關閉 Drawer
 */
const handleCloseDrawer = () => {
  isDrawerOpen.value = false
  // 延遲清空 ID，避免 Drawer 關閉動畫時資料消失
  setTimeout(() => {
    selectedEnvironmentId.value = null
  }, 300)
}

/**
 * 處理刪除成功
 * 刷新表格資料
 */
const handleDeleteSuccess = () => {
  tableRef.value?.refresh()
}
</script>
