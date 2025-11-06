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
      class="h-9 rounded border border-slate-900/10 bg-slate-900/5 px-5 py-2 text-sm font-bold text-slate-900"
      @click="handleCancel"
    >
      {{ cancelText }}
    </button>

    <!-- 確認按鈕 -->
    <button
      type="button"
      :disabled="disabled"
      class="h-9 rounded bg-blue-500 px-5 py-2 text-sm font-bold text-white"
      @click="handleConfirm"
    >
      {{ confirmText }}
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * 表單按鈕群組元件
 */

interface Props {
  cancelText?: string
  confirmText?: string
  disabled?: boolean
  width?: number
  height?: number
  paddingTop?: number
  gap?: number
}

withDefaults(defineProps<Props>(), {
  cancelText: '取消',
  confirmText: '新增',
  disabled: false,
  width: 560,
  height: 48,
  paddingTop: 12,
  gap: 12,
})

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const handleCancel = () => {
  emit('cancel')
}

const handleConfirm = () => {
  emit('confirm')
}
</script>
