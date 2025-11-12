<template>
  <!-- 只有傳入按鈕文字時才顯示 -->
  <div v-if="buttonText" class="absolute left-5 right-5 bottom-5">
    <button
      type="button"
      class="flex h-9 w-full items-center justify-center rounded border text-sm font-bold transition-all"
      :class="buttonClasses"
      :disabled="disabled || loading"
      @click="handleClick"
    >
      <!-- Loading 狀態：顯示 Spinner -->
      <span
        v-if="loading"
        class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      />

      <!-- 正常狀態：顯示按鈕文字 -->
      <span v-else>{{ buttonText }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * DrawerButton 元件
 * 用於在 Drawer 底部顯示操作按鈕
 */

interface Props {
  /**
   * 按鈕文字（選填，沒有文字則不顯示按鈕）
   */
  buttonText?: string

  /**
   * 按鈕類型
   * @default 'error'
   */
  buttonType?: 'success' | 'error'

  /**
   * 是否顯示載入中狀態
   * @default false
   */
  loading?: boolean

  /**
   * 是否禁用按鈕
   * @default false
   */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  buttonType: 'error',
  loading: false,
  disabled: false,
})

const emit = defineEmits<{
  /**
   * 按鈕點擊事件
   */
  click: []
}>()

// ===== 計算屬性 =====

/**
 * 按鈕樣式 class
 */
const buttonClasses = computed(() => {
  // 禁用或載入中的樣式
  if (props.disabled || props.loading) {
    return 'cursor-not-allowed opacity-50 bg-gray-100 border-gray-300 text-gray-500'
  }

  // Success 類型（綠色）
  if (props.buttonType === 'success') {
    return 'bg-[#10B9811A] border-[#10B98180] text-[#10B981] hover:bg-[#10B98133] active:bg-[#10B9814D]'
  }

  // Error 類型（紅色）
  return 'bg-[#FD58581A] border-[#FD585880] text-[#FD5858] hover:bg-[#FD585833] active:bg-[#FD58584D]'
})

// ===== 事件處理 =====

/**
 * 處理按鈕點擊
 * 只有在非禁用且非載入中狀態才會觸發
 */
const handleClick = () => {
  if (!props.disabled && !props.loading) {
    emit('click')
  }
}
</script>

<style scoped>
/**
 * Loading Spinner 動畫
 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
