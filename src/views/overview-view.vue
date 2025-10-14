<template>
  <!--
    總覽頁面

    功能：
    1. ✅ 顯示客戶統計卡片（已完成）
    2. ✅ 顯示月度成長卡片（已完成）
    3. ✅ 顯示異常警示卡片（已完成）
    4. ✅ 顯示需關注客戶列表（已完成）
    5. 顯示模組使用量圖表（待實作）
    6. 顯示客戶列表表格（待實作）

    目前狀態：Section-Card 和 Section-Chart（左側）已完成

    設計模式：
    - 使用「直接包含子元件」模式
    - 容器內部已包含所有卡片
    - 父元件只需引入容器即可
  -->
  <div class="space-y-6">
    <!-- 頁面標題（使用可重用的 PageTitle 元件） -->
    <PageTitle title="總覽" subtitle="關鍵指標和客戶活動狀況" />

    <!-- Section-Card 容器（內部已包含 3 張卡片） -->
    <SectionCardContainer />

    <!-- Section-Chart 容器（內部已包含需關注客戶卡片） -->
    <SectionChartContainer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import PageTitle from '@/components/common/page-title.vue'
import SectionCardContainer from '@/components/overview/section-card-container.vue'
import SectionChartContainer from '@/components/overview/section-chart-container.vue'

/**
 * 總覽頁面主元件
 *
 * 結構：
 * 1. PageTitle - 頁面標題
 * 2. SectionCardContainer - 包含 3 張統計卡片（客戶統計、月度成長、異常警示）
 * 3. SectionChartContainer - 包含需關注客戶和模組使用量圖表
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
