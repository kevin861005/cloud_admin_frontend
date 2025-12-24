<template>
  <span v-if="message" class="typo-xs inline-block rounded py-1" :class="colorClasses">
    {{ message }}
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

/**
 * 表單欄位錯誤提示元件
 *
 * 功能：
 * - 顯示表單欄位的錯誤訊息
 * - 支援不同嚴重程度（error, warning）
 * - 自動處理空訊息（不顯示）
 *
 * 使用範例：
 * <FieldError message="此欄位為必填" />
 * <FieldError message="格式不正確" type="warning" />
 */

// ===== Props 定義 =====
interface Props {
  /**
   * 錯誤訊息
   * 如果為空字串或 null，元件不會顯示
   */
  message?: string | null;

  /**
   * 錯誤類型
   * - error: 錯誤（紅色，預設）
   * - warning: 警告（黃色）
   */
  type?: "error" | "warning";
}

const props = withDefaults(defineProps<Props>(), {
  message: "",
  type: "error",
});

// ===== 計算屬性 =====

/**
 * 顏色樣式 classes
 */
const colorClasses = computed(() => {
  const typeMap = {
    error: "text-red-500 bg-white", // #fd5858 接近 text-red-500
    warning: "text-yellow-600 bg-yellow-50",
  };
  return typeMap[props.type];
});
</script>
