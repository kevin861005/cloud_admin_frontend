<template>
  <!-- 標題區域 -->
  <div class="flex items-center justify-between bg-white">
    <!-- 左側：標題 + 總數 -->
    <div class="flex items-center gap-3">
      <h2 class="typo-base-bold text-neutral-700">{{ title }}</h2>
      <span
        class="typo-xs-bold flex h-6 items-center justify-center rounded border border-primary-500/30 bg-primary-500/5 px-2 text-primary-500"
      >
        {{ totalCount }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Table 標題區元件（階段一：基本標題顯示）
 *
 * 功能：
 * 1. 顯示標題文字和總資料數
 */

// ===== Props 定義 =====
interface Props {
  title: string; // 標題文字（例如：「客戶列表」）
  totalCount: number; // 總資料數（例如：16）
}

defineProps<Props>();
</script>
