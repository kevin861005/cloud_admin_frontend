<template>
  <!--
    Card-Dashboard: 卡片主容器
    - 白色背景、圓角、陰影
    - padding: 24px
    - gap: 20px (使用 space-y-5)
    - flex: 1 0 0 (使用 flex-1)
  -->
  <div class="flex-shrink-0 h-[256px] bg-white rounded-lg shadow-md p-6 flex flex-col gap-5">
    <!--
      Contents-Text: 文字內容區域
      - gap: 48px (使用 space-y-12)
    -->
    <div class="flex flex-col gap-8">
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
            <img
              src="@/assets/icons/card/card-d-customer-filled.svg"
              alt="客戶統計"
              class="w-full h-full"
            />
          </div>

          <!--
            Card-top-Title-Text: 標題文字
            - font-family: Noto Sans TC
            - font-size: 16px
            - font-weight: 700
            - line-height: 22px
          -->
          <span class="text-base font-bold text-gray-700"> 客戶統計 </span>
        </div>

        <!--
          Card-top-Text: 右側總數
          - font-family: Noto Sans TC
          - font-size: 24px
          - font-weight: 700
          - line-height: 30px
          - letter-spacing: -0.2px
        -->
        <span class="text-2xl font-bold tracking-[-0.2px] text-gray-800">
          {{ stats.totalCustomers }}間
        </span>
      </div>

      <!--
        Item-Text Section: 客戶狀態列表
        - gap: 8px (使用 space-y-2)
      -->
      <div class="flex flex-col gap-2">
        <!-- 活躍客戶 -->
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium text-gray-700"> 活躍 </span>
          <span class="text-sm font-medium text-gray-700 text-right">
            {{ stats.activeCount }}間（{{ stats.activePercentage }}%）
          </span>
        </div>

        <!-- 低活躍客戶 -->
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium text-gray-700"> 低活躍 </span>
          <span class="text-sm font-medium text-gray-700 text-right">
            {{ stats.lowActiveCount }}間（{{ stats.lowActivePercentage }}%）
          </span>
        </div>

        <!-- 未使用客戶 -->
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium text-gray-700"> 未使用 </span>
          <span class="text-sm font-medium text-gray-700 text-right">
            {{ stats.inactiveCount }}間（{{ stats.inactivePercentage }}%）
          </span>
        </div>
      </div>
    </div>

    <!--
      Bar: 進度條區域
      - gap: 12px (使用 space-y-3)
    -->
    <div class="flex flex-col gap-3">
      <!--
        Container: 進度條本體
        - height: 8px
        - border-radius: 完全圓角
        - background: #DCE5EF

        使用 normalizedPercentages 確保三個區段加總為 100%
      -->
      <div class="flex h-2 rounded-full overflow-hidden bg-slate-200">
        <!-- 3天內使用 (#334155 - slate-700) -->
        <div
          class="h-full bg-slate-700"
          :style="{
            width: `${normalizedPercentages.active}%`,
          }"
        ></div>

        <!-- 4-7天內使用 (#64748B - slate-500) -->
        <div
          class="h-full bg-slate-500"
          :style="{
            width: `${normalizedPercentages.lowActive}%`,
          }"
        ></div>

        <!-- 7天以上未使用 (#94A3B8 - slate-400) -->
        <div
          class="h-full bg-slate-400"
          :style="{
            width: `${normalizedPercentages.inactive}%`,
          }"
        ></div>
      </div>

      <!--
        Notes: 圖例區域
        - padding: 0 4px
        - justify-content: space-between
      -->
      <div class="flex justify-between items-center px-1">
        <!-- Chart-note: 3天內使用 -->
        <div class="flex items-center gap-1 h-4">
          <!-- Container: 圓點 -->
          <div class="w-2 h-2 rounded-full bg-slate-700"></div>
          <!-- Text: 標籤文字 -->
          <span class="text-xs tracking-[0.2px] text-gray-600"> 3天內使用 </span>
        </div>

        <!-- Chart-note: 4-7天內使用 -->
        <div class="flex items-center gap-1 h-4">
          <div class="w-2 h-2 rounded-full bg-slate-500"></div>
          <span class="text-xs tracking-[0.2px] text-gray-600"> 4-7天內使用 </span>
        </div>

        <!-- Chart-note: 7天以上未使用 -->
        <div class="flex items-center gap-1 h-4">
          <div class="w-2 h-2 rounded-full bg-slate-400"></div>
          <span class="text-xs tracking-[0.2px] text-gray-600"> 7天以上未使用 </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { overviewService } from '@/services/overview.service'
import type { CustomerStats } from '@/types/overview'

/**
 * 客戶統計資料
 * 目前使用 Mock Data，等後端 API 完成後改為呼叫 getCustomerStats()
 */
const stats = ref<CustomerStats>({
  totalCustomers: 0,
  activeCount: 0,
  activePercentage: 0,
  lowActiveCount: 0,
  lowActivePercentage: 0,
  inactiveCount: 0,
  inactivePercentage: 0,
})

/**
 * 計算正規化後的百分比（確保總和為 100%）
 * 如果後端資料已經正確，這個計算會得到相同結果
 * 如果後端資料有誤差，會自動修正
 */
const normalizedPercentages = computed(() => {
  const total =
    stats.value.activePercentage + stats.value.lowActivePercentage + stats.value.inactivePercentage

  // 如果總和已經是 100%，直接使用原始數據
  if (Math.abs(total - 100) < 0.01) {
    return {
      active: stats.value.activePercentage,
      lowActive: stats.value.lowActivePercentage,
      inactive: stats.value.inactivePercentage,
    }
  }

  // 如果總和不是 100%，按比例調整
  // 例如：如果總和是 112.5%，每個值都乘以 (100/112.5)
  const ratio = 100 / total
  return {
    active: stats.value.activePercentage * ratio,
    lowActive: stats.value.lowActivePercentage * ratio,
    inactive: stats.value.inactivePercentage * ratio,
  }
})

/**
 * 元件掛載時載入資料
 */
onMounted(() => {
  // 目前使用 Mock Data
  stats.value = overviewService.getMockCustomerStats()

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
