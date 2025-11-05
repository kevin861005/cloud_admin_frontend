<template>
  <div>
    <!-- 頁面標題（使用可重用的 PageTitle 元件） -->
    <PageTitle title="總覽" subtitle="關鍵指標和客戶活動狀況" />

    <!-- Card 容器（外部傳入卡片元件） -->
    <CardContainer>
      <!-- 客戶統計卡片 -->
      <CustomerStatsCard />

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
    <TableContainer>
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
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import PageTitle from '@/components/common/page-title.vue'
import CardContainer from '@/components/common/card-container.vue'
import TableContainer from '@/components/table/table-container.vue'

// 引入卡片元件
import CustomerStatsCard from '@/components/overview/customer-stats-card.vue'
import CustomerGrowthCard from '@/components/overview/customer-growth-card.vue'
import AlertListCard from '@/components/overview/alert-list-card.vue'
import AttentionCustomersCard from '@/components/overview/attention-customers-card.vue'
import ModuleUsageChartCard from '@/components/overview/module-usage-chart-card.vue'

// 引入客戶列表表格元件
import CustomerTable from '@/components/customer/customer-table.vue'

const handleView = (row: Record<string, unknown>) => {
  // 安全的型別轉換
  const customer = row as unknown as { id: number; name: string }
  console.log('查看客戶:', customer)
}

/**
 * 總覽頁面主元件
 *
 * 結構：
 * 1. PageTitle - 頁面標題
 * 2. SectionCardContainer - 包含 3 張統計卡片（客戶統計、月度成長、異常警示）
 * 3. SectionChartContainer - 包含需關注客戶和模組使用量圖表
 * 4.SectionCustomerListTableContainer - 包含客戶列表表格
 *
 * 設計理念：
 * - 採用「直接包含子元件」模式
 * - 父元件只管理容器，不管理個別卡片
 * - 簡化引入，提高可維護性
 */

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
