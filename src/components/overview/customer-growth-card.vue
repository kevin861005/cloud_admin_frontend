<template>
  <!--
    Card-Dashboard: 卡片主容器
    - 白色背景、圓角、陰影
    - padding: 24px
    - gap: 20px (使用 space-y-5)
    - flex: 1 0 0 (使用 flex-1)
  -->
  <div
    class="flex-shrink-0 min-w-[386.67px] min-h-[272px] bg-white rounded-lg shadow-md p-6 flex flex-col gap-5"
  >
    <!--
      Contents-Text: 文字內容區域
      - gap: 48px (使用 space-y-12)
    -->
    <div class="flex flex-col gap-12">
      <!--
        Card-Top: 頂部區域 (標題 + 總數)
        - justify-content: space-between
        - align-items: center
      -->
      <div class="flex justify-between items-center">
        <!--
          Card-top-Title: 左側標題區 (Icon + 文字)
          - gap: 12px
        -->
        <div class="flex items-center gap-3">
          <!--
            Card-top-Title-Icon-dashboard: 圖示
            - 尺寸: 32x32px
            - padding: 8px 8px 0 8px
          -->
          <div class="flex flex-col items-start w-8 h-8 rounded-md">
            <img src="@/assets/icons/card/growth-up.svg" alt="月度成長" class="w-full h-full" />
          </div>

          <!--
            Card-top-Title-Text: 標題文字
            - font-family: Noto Sans TC
            - font-size: 16px
            - font-weight: 700
            - line-height: 22px
          -->
          <span
            class="text-black text-base font-bold leading-[22px]"
            style="font-family: 'Noto Sans TC', sans-serif"
          >
            月度成長
          </span>
        </div>

        <!--
          Card-top-Text: 右側成長百分比
          - font-family: Noto Sans TC
          - font-size: 24px
          - font-weight: 700
          - line-height: 30px
          - letter-spacing: -0.2px
        -->
        <span
          class="text-black text-2xl font-bold leading-[30px] tracking-[-0.2px]"
          style="font-family: 'Noto Sans TC', sans-serif"
        >
          {{ formatGrowthRate(stats.growthRate) }}%
        </span>
      </div>

      <!--
        Item-Text Section: 客戶數列表
        - gap: 8px (使用 space-y-2)
      -->
      <div class="flex flex-col gap-2">
        <!-- 當月客戶數 -->
        <div class="flex justify-between items-center">
          <span class="text-sm text-slate-600" style="font-family: 'Noto Sans TC', sans-serif">
            當月客戶數
          </span>
          <span
            class="text-sm text-black font-medium"
            style="font-family: 'Noto Sans TC', sans-serif"
          >
            {{ stats.currentMonthCount }}間
          </span>
        </div>

        <!-- 上月客戶數 -->
        <div class="flex justify-between items-center">
          <span class="text-sm text-slate-600" style="font-family: 'Noto Sans TC', sans-serif">
            上月客戶數
          </span>
          <span
            class="text-sm text-black font-medium"
            style="font-family: 'Noto Sans TC', sans-serif"
          >
            {{ stats.lastMonthCount }}間
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMockCustomerGrowthData } from '@/services/overview.service'
import type { CustomerGrowthData } from '@/types/overview'

/**
 * 客戶統計資料
 * 目前使用 Mock Data，等後端 API 完成後改為呼叫 getCustomerStats()
 */
const stats = ref<CustomerGrowthData>({
  growthRate: 0,
  currentMonthCount: 0,
  lastMonthCount: 0,
})

/**
 * 格式化成長率
 * - 正數前面加上 "+" 號
 * - 負數保持原樣（會自動有 "-" 號）
 * - 0 保持原樣
 */
const formatGrowthRate = (rate: number): string => {
  if (rate > 0) {
    return `+${rate}`
  }
  return `${rate}`
}

/**
 * 元件掛載時載入資料
 */
onMounted(() => {
  // 目前使用 Mock Data
  stats.value = getMockCustomerGrowthData()

  // TODO: 等後端 API 完成後，改為以下程式碼：
  // try {
  //   stats.value = await getCustomerStats()
  // } catch (error) {
  //   console.error('載入客戶統計資料失敗:', error)
  //   // 可以顯示錯誤訊息給使用者
  // }
})
</script>

<style scoped>
/*
  此元件完全使用 Tailwind CSS 和 inline styles
  不需要額外的 CSS 樣式
*/
</style>
