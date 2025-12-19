<template>
  <div
    ref="triggerRef"
    class="relative inline-flex"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 觸發區域（slot 內容） -->
    <slot />

    <!-- 提示框（使用 Teleport 到 body，避免被 overflow 裁切） -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-150"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showTip && text"
          class="fixed z-[9999] whitespace-nowrap rounded bg-neutral-600/80 px-2 py-1 typo-xs-bold text-white"
          :style="tooltipStyle"
        >
          <!-- 左側箭頭（指向左側） -->
          <div
            class="absolute right-full top-2 border-4 border-transparent border-r-neutral-600/80"
          />
          {{ text }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * TableTip - 表格專用提示元件
 *
 * 功能：
 * - Hover 時在右下方顯示提示文字
 * - 使用 Teleport 避免被容器 overflow 裁切
 * - 帶有指向左側的箭頭
 * - 用於 disabled checkbox 等需要提示的場景
 *
 * 樣式規格：
 * - border-radius: 4px
 * - padding: 4px 8px
 * - background: neutral-600/80
 * - text: white, typo-xs-bold
 */
import { ref, reactive } from 'vue'

// ========== Props 定義 ==========
interface Props {
  /** 提示文字 */
  text: string
}

defineProps<Props>()

// ========== 狀態 ==========
/** 是否顯示提示 */
const showTip = ref(false)

/** 觸發元素的參考 */
const triggerRef = ref<HTMLElement | null>(null)

/** tooltip 的位置樣式 */
const tooltipStyle = reactive({
  top: '0px',
  left: '0px',
})

// ========== 事件處理 ==========
/**
 * 滑鼠進入時計算 tooltip 位置
 */
const handleMouseEnter = () => {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()

  // tooltip 顯示在觸發元素的右下方
  tooltipStyle.top = `${rect.bottom - 12}px`
  tooltipStyle.left = `${rect.right + 4}px`

  showTip.value = true
}

/**
 * 滑鼠離開時隱藏 tooltip
 */
const handleMouseLeave = () => {
  showTip.value = false
}
</script>
