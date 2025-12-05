<template>
  <div>
    <!-- 頁面標題（使用可重用的 PageTitle 元件） -->
    <PageTitle title="總覽" subtitle="關鍵指標和客戶活動狀況" />

    <!-- Card 容器（外部傳入卡片元件） -->
    <CardContainer>
      <!-- 客戶統計卡片 -->
      <CustomerStatsCard @click="scrollToCustomerTable" class="cursor-pointer" />

      <!-- 月度成長卡片 -->
      <CustomerGrowthCard />

      <!-- 異常警示卡片 -->
      <AlertListCard />
    </CardContainer>

    <!-- Card 容器（外部傳入卡片元件） -->
    <CardContainer :width-ratios="[1, 2]" :height="436">
      <!-- 需關注客戶卡片 -->
      <AttentionCustomersCard />

      <!-- 模組使用量卡片 -->
      <ModuleUsageChartCard />
    </CardContainer>

    <!-- Card 容器（外部傳入卡片元件） -->
    <TableContainer ref="customerTableRef">
      <!-- 客戶列表區域 -->
      <customer-table
        :show-filters="true"
        :show-search="true"
        :show-add-button="false"
        :show-checkbox="false"
        :show-edit-button="false"
        :show-border="false"
        @row-view="handleView"
      />
    </TableContainer>

    <!-- 客戶詳細資訊 Drawer -->
    <CustomerDetailDrawer
      :is-open="isDrawerOpen"
      :customer-id="selectedCustomerId"
      @close="handleCloseDrawer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageTitle from '@/components/common/page-title.vue'
import CardContainer from '@/components/common/card-container.vue'
import TableContainer from '@/components/table/table-container.vue'
import CustomerDetailDrawer from '@/components/customer/drawer-customer-detail.vue'

// 引入卡片元件
import CustomerStatsCard from '@/components/overview/card-customer-stats.vue'
import CustomerGrowthCard from '@/components/overview/card-customer-growth.vue'
import AlertListCard from '@/components/overview/card-alert-list.vue'
import AttentionCustomersCard from '@/components/overview/card-attention-customers.vue'
import ModuleUsageChartCard from '@/components/overview/card-module-usage-chart.vue'

// 引入客戶列表表格元件
import CustomerTable from '@/components/customer/table-customer.vue'

// ==================== Refs ====================

/**
 * 客戶列表區域的參考
 */
const customerTableRef = ref<InstanceType<typeof TableContainer> | null>(null)

// ==================== 狀態管理 ====================

/**
 * Drawer 開啟狀態
 */
const isDrawerOpen = ref(false)

/**
 * 選中的客戶 ID
 */
const selectedCustomerId = ref<string | null>(null)

// ==================== 事件處理 ====================

/**
 * 滾動到客戶列表區域
 */
const scrollToCustomerTable = () => {
  customerTableRef.value?.$el.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

/**
 * 處理查看客戶詳情
 * 當表格中的查看按鈕被點擊時觸發
 *
 * @param row - 表格行資料
 */
const handleView = (row: Record<string, unknown>) => {
  // 安全的型別轉換
  const customer = row as unknown as { id: string; name: string }
  console.log('查看客戶:', customer)

  // 設定選中的客戶 ID 並開啟 Drawer
  selectedCustomerId.value = customer.id
  isDrawerOpen.value = true
}

/**
 * 處理關閉 Drawer
 */
const handleCloseDrawer = () => {
  isDrawerOpen.value = false
  // 延遲清空 customerId，避免 Drawer 關閉動畫時資料消失
  setTimeout(() => {
    selectedCustomerId.value = null
  }, 300)
}

// ==================== Lifecycle ====================

/**
 * 元件掛載時：可以在這裡呼叫 API 取得資料
 */
onMounted(() => {
  console.log('總覽頁面已載入')
  // TODO: 呼叫其他統計資料的 API
})
</script>

<style scoped></style>
