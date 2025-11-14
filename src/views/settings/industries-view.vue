<template>
  <div>
    <PageTitle title="產業別設定" subtitle="管理業別分類" />

    <TableContainer>
      <IndustryTable ref="tableRef" @row-view="handleView" @add="handleAdd" />
    </TableContainer>

    <IndustryDetailDrawer
      :is-open="isDrawerOpen"
      :industry-data="selectedIndustry"
      @close="handleCloseDrawer"
      @updated="handleIndustryUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/components/common/page-title.vue'
import TableContainer from '@/components/table/table-container.vue'
import IndustryTable from '@/components/industry/table-industry.vue'
import IndustryDetailDrawer from '@/components/industry/drawer-industry-detail.vue'
import type { IndustryListItem } from '@/types/industry'

const router = useRouter()
const tableRef = ref()

/**
 * 選中的模組資料
 */
const selectedIndustry = ref<IndustryListItem | null>(null)

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
  const industry = row as unknown as IndustryListItem
  console.log('查看產業別:', industry)

  // 設定選中的模組資料並開啟 Drawer
  selectedIndustry.value = industry
  isDrawerOpen.value = true
}

/**
 * 處理關閉 Drawer
 */
const handleCloseDrawer = () => {
  isDrawerOpen.value = false
  // 延遲清空資料，避免 Drawer 關閉動畫時資料消失
  setTimeout(() => {
    selectedIndustry.value = null
  }, 300)
}

/**
 * 處理模組更新成功
 * 重新載入表格資料
 */
const handleIndustryUpdated = () => {
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
  router.push('/settings/industries/create')
}
</script>

<style scoped></style>
