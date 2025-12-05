<template>
  <!-- 使用 span 包裝，作為定位基準 -->
  <span class="relative inline-flex">
    <!-- 複製圖示 -->
    <img
      :src="copyIcon"
      :alt="title"
      :title="title"
      class="copy-icon h-4 w-4 flex-shrink-0 cursor-pointer transition-all duration-200"
      @click="handleCopy"
    />

    <!-- 提示框：使用相對定位，顯示在圖示正上方 -->
    <Transition name="fade">
      <span
        v-if="showToast"
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 typo-xs-bold text-neutral-800 bg-neutral-300/60 rounded-lg py-1 px-3 pointer-events-none whitespace-nowrap"
      >
        {{ toastMessage }}
      </span>
    </Transition>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import copyIcon from '@/assets/icons/common/cm-copy.svg'

/**
 * CopyButton 元件
 * 點擊後複製指定的值到剪貼簿，並顯示提示框
 *
 * @example
 * <span>0963139756</span>
 * <CopyButton :value="contactInfo.phone" />
 */

interface Props {
  /** 要複製的值 */
  value: string
  /** 滑鼠懸停時的提示文字 */
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '複製',
})

// ========== State ==========

/** 是否顯示提示框 */
const showToast = ref(false)

/** 提示框訊息 */
const toastMessage = ref('')

/** 提示框計時器 */
let toastTimer: number | null = null

// ========== Methods ==========

/**
 * 顯示提示訊息
 * @param message 要顯示的訊息
 */
function showToastMessage(message: string) {
  // 清除之前的計時器
  if (toastTimer !== null) {
    clearTimeout(toastTimer)
  }

  toastMessage.value = message
  showToast.value = true

  // 1.5 秒後自動隱藏
  toastTimer = window.setTimeout(() => {
    showToast.value = false
    toastTimer = null
  }, 1500)
}

/**
 * 處理複製動作
 */
async function handleCopy() {
  try {
    await navigator.clipboard.writeText(props.value)
    showToastMessage('複製成功')
  } catch (error) {
    console.error('複製失敗:', error)
    showToastMessage('複製失敗')
  }
}
</script>

<style scoped>
/* 圖示預設顏色：#6B7280 */
.copy-icon {
  filter: brightness(0) saturate(100%) invert(45%) sepia(5%) saturate(1032%) hue-rotate(182deg)
    brightness(95%) contrast(90%);
}

/* 圖示 hover 顏色：#398FF9 */
.copy-icon:hover {
  filter: brightness(0) saturate(100%) invert(52%) sepia(52%) saturate(2758%) hue-rotate(196deg)
    brightness(100%) contrast(96%);
}

/* 淡入淡出動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
