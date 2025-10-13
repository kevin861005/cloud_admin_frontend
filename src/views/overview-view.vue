<template>
  <!--
    總覽頁面

    功能：
    1. ✅ 顯示客戶統計卡片（已完成）
    2. 顯示月度成長卡片
    3. 顯示異常警示卡片
    4. 顯示需關注客戶列表
    5. 顯示模組使用量圖表
    6. 顯示客戶列表表格

    目前狀態：已實作客戶統計卡片，其他卡片待實作
  -->
  <div class="space-y-6">
    <!-- 頁面標題（使用可重用的 PageTitle 元件） -->
    <PageTitle title="總覽" subtitle="關鍵指標和客戶活動狀況" />

    <!-- Section-Card 容器 - 支援水平滾動 -->
    <section-card-container>
      <!-- 卡片 1: 客戶統計（已完成） -->
      <CustomerStatsCard />

      <!-- 卡片 2: 月度成長（已完成） -->
      <CustomerGrowthCard />

      <!-- 卡片 3: 異常警示（已完成） -->
      <AlertListCard />
    </section-card-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import PageTitle from '@/components/common/page-title.vue'
import SectionCardContainer from '@/components/overview/section-card-container.vue'
import CustomerStatsCard from '@/components/overview/customer-stats-card.vue'
import CustomerGrowthCard from '@/components/overview/customer-growth-card.vue'
import AlertListCard from '@/components/overview/alert-list-card.vue'

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
