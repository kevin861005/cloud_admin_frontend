<template>
  <div>
    <PageTitle title="刪除紀錄" />

    <!-- 表格容器 -->
    <TableContainer>
      <TableDeleteRecord ref="tableRef" @row-view="handleViewDetail" />
    </TableContainer>

    <!-- 詳情 Drawer -->
    <DrawerDeleteRecordDetail
      :is-open="isDrawerOpen"
      :delete-record-id="selectedRecordId"
      @close="handleCloseDrawer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PageTitle } from '@/components/common'
import TableContainer from '@/components/table/table-container.vue'
import TableDeleteRecord from '@/components/environment/table-delete-record.vue'
import DrawerDeleteRecordDetail from '@/components/environment/drawer-delete-record-detail.vue'

// ===== 元件參照 =====

/**
 * 表格元件參照（用於呼叫 refresh 等方法）
 */
const tableRef = ref<InstanceType<typeof TableDeleteRecord> | null>(null)

// ===== Drawer 狀態 =====

/**
 * Drawer 開關狀態
 */
const isDrawerOpen = ref(false)

/**
 * 選取的刪除紀錄 ID
 */
const selectedRecordId = ref<string | null>(null)

// ===== 事件處理 =====

/**
 * 處理查看詳情
 * 開啟 Drawer 顯示刪除紀錄詳情
 */
const handleViewDetail = (row: Record<string, unknown>) => {
  selectedRecordId.value = String(row.id)
  isDrawerOpen.value = true
}

/**
 * 處理關閉 Drawer
 */
const handleCloseDrawer = () => {
  isDrawerOpen.value = false
  selectedRecordId.value = null
}
</script>
