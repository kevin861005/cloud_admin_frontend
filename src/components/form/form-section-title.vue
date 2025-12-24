<template>
  <div class="flex">
    <div
      class="inline-flex items-center gap-2 rounded bg-primary-500/10 px-2 py-1 transition-all duration-500"
      :class="{ 'ring-1 ring-primary-500': isHighlighted }"
    >
      <h3 class="typo-sm-bold text-primary-500">{{ title }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 表單區塊標題元件（帶高亮效果）
 *
 * 用途：
 * - 顯示表單區塊的標題
 * - 支援高亮效果（Tab 切換時）
 */

interface Props {
  /** 標題文字 */
  title: string;
  /** 是否高亮顯示 */
  isHighlighted?: boolean;
}

withDefaults(defineProps<Props>(), {
  isHighlighted: false,
});
</script>
