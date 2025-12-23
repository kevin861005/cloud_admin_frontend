<template>
  <!-- 使用 Teleport 將整個 Drawer 移到 body 最外層 -->
  <Teleport to="body">
    <!-- 背景遮罩 -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[60]"
        style="background: rgba(0, 0, 0, 0.2)"
        @click="handleClose"
      />
    </Transition>

    <!-- Drawer 內容 -->
    <Transition name="slide">
      <div
        v-if="isOpen"
        class="fixed right-0 top-0 bottom-0 z-[70] flex w-[355px] flex-col bg-white shadow-lg"
      >
        <!-- CloseSection: 固定高度 40px，關閉按鈕固定在最右側 -->
        <div class="flex items-center justify-end h-10">
          <button
            type="button"
            class="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-colors hover:bg-gray-100"
            @click="handleClose"
          >
            <img :src="closeIcon" alt="關閉" class="w-4 h-4" />
          </button>
        </div>

        <!-- Contents: 內容區域，佔據剩餘空間 -->
        <div class="flex-1 overflow-y-auto">
          <slot />
        </div>

        <!-- Footer: 固定在底部的按鈕區域 -->
        <div v-if="$slots.footer" class="flex-shrink-0">
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import closeIcon from '@/assets/icons/common/close-icon.svg'

/**
 * Drawer 元件的 Props
 */
interface Props {
  /**
   * 控制 Drawer 開關狀態
   */
  isOpen: boolean
}

const props = defineProps<Props>()

/**
 * Drawer 元件的 Emits
 */
const emit = defineEmits<{
  /**
   * 當 Drawer 需要關閉時觸發
   */
  close: []
}>()

/**
 * 處理關閉 Drawer
 * 會觸發 close 事件通知父元件
 */
const handleClose = () => {
  emit('close')
}

/**
 * 處理 ESC 鍵關閉
 * 當 Drawer 開啟時，按下 ESC 鍵會關閉 Drawer
 */
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

/**
 * 監聽 isOpen 狀態變化
 * 當 Drawer 開啟時，禁止 body 滾動
 * 當 Drawer 關閉時，恢復 body 滾動
 */
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)

/**
 * 元件掛載時註冊 ESC 鍵監聽
 */
onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

/**
 * 元件卸載時移除 ESC 鍵監聽並恢復 body 滾動
 */
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/**
 * 背景遮罩的淡入淡出動畫
 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/**
 * Drawer 滑入滑出動畫
 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
