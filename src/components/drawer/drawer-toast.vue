<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-5 opacity-0"
  >
    <div
      v-if="isVisible"
      class="absolute left-5 right-5 flex h-12 items-center justify-center rounded border px-4"
      :class="[toastClasses, positionClass]"
      style="gap: 8px"
    >
      <!-- Icon -->
      <img :src="iconSrc" :alt="iconAlt" class="w-5 h-5" />

      <!-- Message -->
      <span class="typo-sm-medium" :class="textColorClass">
        {{ message }}
      </span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import successIcon from '@/assets/icons/common/cm-success.svg'
import failedIcon from '@/assets/icons/common/cm-failed.svg'

/**
 * DrawerToast 元件
 * 用於在 Drawer 底部顯示操作結果提示
 */

interface Props {
  /**
   * 是否顯示 Toast
   */
  isVisible: boolean

  /**
   * Toast 類型
   */
  type: 'success' | 'error'

  /**
   * 顯示訊息
   */
  message: string

  /**
   * 自動消失時間（毫秒）
   * @default 3000
   */
  duration?: number

  /**
   * 是否有底部按鈕
   * 當有按鈕時，Toast 會浮動在按鈕上方
   * @default false
   */
  hasButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000,
  hasButton: false,
})

const emit = defineEmits<{
  /**
   * Toast 關閉事件
   */
  close: []
}>()

// ===== 計算屬性 =====

/**
 * Icon 來源
 */
const iconSrc = computed(() => {
  return props.type === 'success' ? successIcon : failedIcon
})

/**
 * Icon 替代文字
 */
const iconAlt = computed(() => {
  return props.type === 'success' ? '成功' : '失敗'
})

/**
 * Toast 樣式 class
 */
const toastClasses = computed(() => {
  if (props.type === 'success') {
    return 'bg-white border-[#E4E6EA]'
  } else {
    return 'bg-[#FD58580D] border-[#FD5858]'
  }
})

/**
 * 文字顏色 class
 */
const textColorClass = computed(() => {
  return props.type === 'success' ? 'text-[#111827]' : 'text-[#FD5858]'
})

/**
 * Toast 位置 class
 * 當有按鈕時，Toast 會浮動在按鈕上方（bottom-[96px]）
 * 沒有按鈕時，Toast 在底部（bottom-5）
 */
const positionClass = computed(() => {
  return props.hasButton ? 'bottom-[96px]' : 'bottom-5'
})

// ===== 自動關閉邏輯 =====

/**
 * 監聽 isVisible 變化，當顯示時啟動自動關閉計時器
 */
watch(
  () => props.isVisible,
  (isVisible) => {
    if (isVisible && props.duration > 0) {
      setTimeout(() => {
        emit('close')
      }, props.duration)
    }
  },
)
</script>

<style scoped></style>
