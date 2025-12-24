<template>
  <!--
    Card-Dashboard: 卡片主容器
    - 白色背景、圓角、陰影
    - padding: 24px
    - gap: 20px (使用 space-y-5)
    - flex: 1 0 0 (使用 flex-1)
  -->
  <div class="flex h-[256px] flex-col gap-5 rounded-lg bg-white p-6 shadow-md">
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
      <div class="flex items-center justify-between">
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
          <div class="flex h-8 w-8 flex-col items-start rounded-md">
            <img
              src="@/assets/icons/card/card-d-growth-filled.svg"
              alt="月度成長"
              class="h-full w-full"
            />
          </div>

          <span class="typo-base-bold text-neutral-700"> 月度成長 </span>
        </div>

        <span class="typo-2xl-bold text-neutral-800">
          {{ formatGrowthRate(stats.growthRate) }}%
        </span>
      </div>

      <!--
        Item-Text Section: 客戶數列表
        - gap: 8px (使用 space-y-2)
      -->
      <div class="flex flex-col gap-2">
        <!-- 當月客戶數 -->
        <div class="flex items-center justify-between">
          <span class="typo-sm-medium text-slate-600"> 當月客戶數 </span>
          <span class="typo-sm-medium text-black"> {{ stats.currentMonthCount }}間 </span>
        </div>

        <!-- 上月客戶數 -->
        <div class="flex items-center justify-between">
          <span class="typo-sm-medium text-slate-600"> 上月客戶數 </span>
          <span class="typo-sm-medium text-black"> {{ stats.lastMonthCount }}間 </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { overviewService } from "@/services/overview.service";
import type { CustomerGrowthData } from "@/types/overview";

/** 載入狀態 */
const isLoading = ref(false);

/** 錯誤訊息 */
const errorMessage = ref("");

/**
 * 客戶統計資料
 * 目前使用 Mock Data，等後端 API 完成後改為呼叫 getCustomerStats()
 */
const stats = ref<CustomerGrowthData>({
  growthRate: 0,
  currentMonthCount: 0,
  lastMonthCount: 0,
});

/**
 * 格式化成長率
 * - 正數前面加上 "+" 號
 * - 負數保持原樣（會自動有 "-" 號）
 * - 0 保持原樣
 */
const formatGrowthRate = (rate: number): string => {
  if (rate > 0) {
    return `+${rate}`;
  }
  return `${rate}`;
};

/**
 * 載入月度成長資料
 */
async function loadCustomerGrowthData() {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    // TODO: 等後端 API 完成後，改用真實 API
    stats.value = await overviewService.getCustomerGrowthData();
  } catch (error) {
    console.error("載入月度成長失敗:", error);
    errorMessage.value = error instanceof Error ? error.message : "載入失敗，請稍後再試";
  } finally {
    isLoading.value = false;
  }
}

/**
 * 元件掛載時載入資料
 */
onMounted(() => {
  loadCustomerGrowthData();
});
</script>

<style scoped>
/*
  此元件完全使用 Tailwind CSS 和 inline styles
  不需要額外的 CSS 樣式
*/
</style>
