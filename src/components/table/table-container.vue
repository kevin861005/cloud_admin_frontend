<template>
  <div
    ref="containerRef"
    class="mx-auto w-full overflow-x-auto overflow-y-visible px-10 pb-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
  >
    <!-- 可選的白色卡片背景 -->
    <div v-if="props.useCard" class="flex-shrink-0 rounded-lg bg-white p-6 shadow-md">
      <slot></slot>
    </div>

    <!-- 無卡片背景，直接放置內容 -->
    <div v-else class="flex-shrink-0">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Props 定義
 */
interface Props {
  /**
   * 是否使用白色卡片背景
   *
   * 使用方式：
   * - true（預設）：表格外層會有白色背景、圓角、陰影
   * - false：表格直接顯示，無背景卡片
   */
  useCard?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  useCard: true,
})

const containerRef = ref<HTMLElement | null>(null)

/**
 * 處理滑鼠滾輪事件，轉換為水平滾動
 */
const handleWheel = (event: WheelEvent) => {
  if (!containerRef.value) return

  // 檢查是否需要水平滾動
  const canScroll = containerRef.value.scrollWidth > containerRef.value.clientWidth
  if (!canScroll) return

  // 阻止預設的垂直滾動
  event.preventDefault()

  // 將垂直滾動轉換為水平滾動
  containerRef.value.scrollLeft += event.deltaY
}

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('wheel', handleWheel, { passive: false })
  }
})

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('wheel', handleWheel)
  }
})
</script>
