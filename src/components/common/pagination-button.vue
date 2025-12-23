<template>
  <button
    type="button"
    :disabled="disabled"
    class="btn-page flex h-8 w-[38px] items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed"
    @click="$emit('click')"
  >
    <img :src="icon" :alt="alt" class="icon h-4 w-4 transition-all" />
  </button>
</template>

<script setup lang="ts">
/**
 * PaginationButton 分頁按鈕元件
 *
 * 用於表格和列表的上一頁/下一頁按鈕
 *
 * 樣式規格：
 * - disable: 底色 #F3F4F6 (neutral-100), icon #9CA3AF (neutral-400)
 * - active:  底色 #D1D5DB (neutral-300), icon #1F2937 (neutral-800)
 * - hover:   底色 #9CA3AF (neutral-400), icon #1F2937 (neutral-800)
 * - pressed: 底色 #9CA3AF (neutral-400), icon #F9FAFB (neutral-50)
 *
 * @example
 * ```vue
 * <PaginationButton
 *   :icon="PrevIcon"
 *   alt="上一頁"
 *   :disabled="currentPage === 0"
 *   @click="handlePreviousPage"
 * />
 * ```
 */

interface Props {
  /** 圖示來源 */
  icon: string;
  /** 圖示替代文字 */
  alt?: string;
  /** 是否禁用 */
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  alt: "",
  disabled: false,
});

defineEmits<{
  click: [];
}>();
</script>

<style scoped>
/* 預設狀態 (active): 底色 neutral-300, icon neutral-800 */
.btn-page {
  background-color: #d1d5db;
}

.btn-page .icon {
  filter: brightness(0) saturate(100%) invert(12%) sepia(10%) saturate(1000%) hue-rotate(180deg)
    brightness(95%);
}

/* hover 狀態: 底色 neutral-400, icon neutral-800 */
.btn-page:hover:not(:disabled) {
  background-color: #9ca3af;
}

/* pressed 狀態: 底色 neutral-400, icon neutral-50 */
.btn-page:active:not(:disabled) {
  background-color: #9ca3af;
}

.btn-page:active:not(:disabled) .icon {
  filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) brightness(103%);
}

/* disabled 狀態: 底色 neutral-100, icon neutral-400 */
.btn-page:disabled {
  background-color: #f3f4f6;
}

.btn-page:disabled .icon {
  filter: brightness(0) saturate(100%) invert(70%) sepia(5%) saturate(500%) hue-rotate(180deg)
    brightness(95%);
}
</style>
