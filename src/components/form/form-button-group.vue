<template>
  <div
    class="flex items-center justify-start"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
      paddingTop: `${paddingTop}px`,
      gap: `${gap}px`,
    }"
  >
    <!-- 取消按鈕 -->
    <button
      type="button"
      class="typo-sm-bold group relative h-9 rounded border border-neutral-200 bg-neutral-100 px-4 py-2 text-neutral-600 transition-colors"
      @click="handleCancel"
    >
      <!-- 黑色遮罩層（只影響背景） -->
      <span
        class="absolute inset-0 rounded bg-black opacity-0 transition-opacity group-hover:opacity-10"
      />
      <!-- 按鈕文字（不受影響） -->
      <span class="relative">{{ cancelText }}</span>
    </button>

    <!-- 確認按鈕 -->
    <button
      type="button"
      :disabled="disabled"
      class="typo-sm-bold group relative h-9 rounded bg-primary-500 px-4 py-2 text-white transition-colors disabled:opacity-50"
      @click="handleConfirm"
    >
      <!-- 黑色遮罩層（只影響背景） -->
      <span
        class="absolute inset-0 rounded bg-black opacity-0 transition-opacity group-hover:opacity-10 group-disabled:group-hover:opacity-0"
      />
      <!-- 按鈕文字（不受影響） -->
      <span class="relative">{{ confirmText }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * 表單按鈕群組元件
 */

interface Props {
  cancelText?: string;
  confirmText?: string;
  disabled?: boolean;
  width?: number;
  height?: number;
  paddingTop?: number;
  gap?: number;
}

withDefaults(defineProps<Props>(), {
  cancelText: "取消",
  confirmText: "新增",
  disabled: false,
  width: 560,
  height: 48,
  paddingTop: 12,
  gap: 12,
});

const emit = defineEmits<{
  cancel: [];
  confirm: [];
}>();

const handleCancel = () => {
  emit("cancel");
};

const handleConfirm = () => {
  emit("confirm");
};
</script>
