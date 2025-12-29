<template>
  <div
    :class="[
      'flex items-center justify-center',
      variant === 'page' && 'rounded-lg border border-neutral-200 bg-white p-12 shadow-sm',
      variant === 'inline' && 'py-8',
    ]"
  >
    <div class="text-center">
      <!-- 圖示 -->
      <component
        :is="iconComponent"
        :class="['mx-auto text-neutral-400', variant === 'page' ? 'h-16 w-16' : 'h-12 w-12']"
      />

      <!-- 標題 -->
      <h3
        :class="[
          'mt-4 text-neutral-900',
          variant === 'page' ? 'typo-xl-medium' : 'typo-base-medium',
        ]"
      >
        {{ title }}
      </h3>

      <!-- 描述 -->
      <p class="typo-sm mt-2 text-neutral-500">
        {{ description }}
      </p>

      <!-- 動作按鈕（可選） -->
      <div v-if="showButton" class="mt-6">
        <button
          type="button"
          class="typo-sm-medium inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          @click="handleButtonClick"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from "vue";

/**
 * 空狀態/無權限提示元件
 *
 * 功能：
 * - 顯示圖示、標題、描述
 * - 支援不同類型（no-permission, no-data, no-results）
 * - 支援不同變體（page: 獨立頁面, inline: 卡片內嵌）
 * - 支援自訂動作按鈕
 *
 * @example
 * <!-- 獨立頁面使用 -->
 * <EmptyState
 *   variant="page"
 *   type="no-permission"
 *   title="無權限存取"
 *   description="您沒有權限查看此功能"
 * />
 *
 * <!-- 卡片內嵌使用 -->
 * <EmptyState
 *   variant="inline"
 *   type="no-data"
 *   title="暫無資料"
 *   description="目前沒有系統紀錄"
 * />
 */

// ===== Props 定義 =====
interface Props {
  /**
   * 顯示變體
   * - page: 獨立頁面（有邊框、陰影、較大間距）
   * - inline: 卡片內嵌（無邊框、較小間距）
   * @default 'page'
   */
  variant?: "page" | "inline";

  /**
   * 類型
   * - no-permission: 無權限（鎖頭圖示）
   * - no-data: 無資料（文件圖示）
   * - no-results: 搜尋無結果（搜尋圖示）
   */
  type?: "no-permission" | "no-data" | "no-results";

  /** 標題文字 */
  title: string;

  /** 描述文字 */
  description: string;

  /** 是否顯示按鈕 */
  showButton?: boolean;

  /** 按鈕文字 */
  buttonText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "page",
  type: "no-data",
  showButton: false,
  buttonText: "確定",
});

// ===== Emits 定義 =====
const emit = defineEmits<{
  "button-click": [];
}>();

// ===== 圖示映射 =====

/**
 * 根據類型返回對應的 SVG 圖示元件
 */
const iconComponent = computed(() => {
  const icons = {
    // 無權限圖示（鎖頭）
    "no-permission": () =>
      h(
        "svg",
        {
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
          }),
        ]
      ),

    // 無資料圖示（文件）
    "no-data": () =>
      h(
        "svg",
        {
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
          }),
        ]
      ),

    // 搜尋無結果圖示（搜尋）
    "no-results": () =>
      h(
        "svg",
        {
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
          }),
        ]
      ),
  };

  return icons[props.type];
});

// ===== 事件處理 =====

/**
 * 處理按鈕點擊
 */
const handleButtonClick = () => {
  emit("button-click");
};
</script>
