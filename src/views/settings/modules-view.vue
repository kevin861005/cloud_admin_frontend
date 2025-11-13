<template>
  <div>
    <PageTitle title="模組設定" subtitle="使用模組" />

    <TableContainer>
      <module-table ref="tableRef" @row-view="handleView" @add="handleAdd" />
    </TableContainer>

    <ModuleDetailDrawer
      :is-open="isDrawerOpen"
      :module-data="selectedModule"
      @close="handleCloseDrawer"
      @updated="handleModuleUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/components/common/page-title.vue'
import TableContainer from '@/components/table/table-container.vue'
import ModuleTable from '@/components/module/table-module.vue'
import ModuleDetailDrawer from '@/components/module/drawer-module-detail.vue'
import type { ModuleListItem } from '@/types/module'

const router = useRouter()
const tableRef = ref()

/**
 * 選中的模組資料
 */
const selectedModule = ref<ModuleListItem | null>(null)

/**
 * Drawer 開啟狀態
 */
const isDrawerOpen = ref(false)

/**
 * 處理查看模組
 * 開啟 Drawer 顯示模組詳情
 */
const handleView = (row: Record<string, unknown>) => {
  // 型別轉換
  const module = row as unknown as ModuleListItem
  console.log('查看模組:', module)

  // 設定選中的模組資料並開啟 Drawer
  selectedModule.value = module
  isDrawerOpen.value = true
}

/**
 * 處理關閉 Drawer
 */
const handleCloseDrawer = () => {
  isDrawerOpen.value = false
  // 延遲清空資料，避免 Drawer 關閉動畫時資料消失
  setTimeout(() => {
    selectedModule.value = null
  }, 300)
}

/**
 * 處理模組更新成功
 * 重新載入表格資料
 */
const handleModuleUpdated = () => {
  // 重新載入表格
  if (tableRef.value && tableRef.value.refresh) {
    tableRef.value.refresh()
  }
}

/**
 * 處理新增模組
 * 跳轉到新增模組頁面
 */
const handleAdd = () => {
  console.log('跳轉到新增模組頁面')
  router.push('/settings/modules/create')
}
</script>

<style scoped></style>
