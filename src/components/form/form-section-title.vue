<template>
  <div
    class="mb-4 transition-all duration-300"
    :class="{ 'rounded border-2 border-primary-500 px-3 py-2 -mx-3': isHighlighted }"
  >
    <h3 class="typo-sm-bold text-primary-500">{{ title }}</h3>
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
  title: string
  /** 是否高亮顯示 */
  isHighlighted?: boolean
}

withDefaults(defineProps<Props>(), {
  isHighlighted: false,
})
</script>
