<template>
  <div
    ref="containerRef"
    class="flex items-center overflow-x-auto overflow-y-hidden px-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    :style="containerStyle"
  >
    <!-- 使用 slot 讓外部可以插入任意數量的卡片 -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

/**
 * CardContainer 元件
 *
 * 功能：
 * - 自動計算卡片寬度（平均分配或自訂比例）
 * - 支援水平滾動（滑鼠滾輪上下轉換為左右滾動）
 * - 響應式調整（視窗大小變化時自動重新計算）
 *
 * Props：
 * - widthRatios: 自訂寬度比例（例如 [1, 2] 表示第一張佔 33%，第二張佔 67%）
 * - height: 容器高度（單位：px，預設 296px）
 * - usePaddingTop: 是否使用上方內距（預設 false）
 * - paddingTop: 上方內距數值（單位：px，預設 12px，僅在 usePaddingTop=true 時生效）
 * - usePaddingBottom: 是否使用下方內距（預設 true）
 * - paddingBottom: 下方內距數值（單位：px，預設 40px，僅在 usePaddingBottom=true 時生效）
 * - gap: 卡片間距（單位：px，預設 20px）
 */

/**
 * Props 定義
 */
interface Props {
  /**
   * 自訂寬度比例陣列
   * - 例如：[1, 2] 表示第一張佔 33%，第二張佔 67%
   * - 若不提供或陣列長度與卡片數量不符，則平均分配
   */
  widthRatios?: number[]

  /**
   * 容器高度（單位：px）
   * - 預設：296px
   */
  height?: number

  /**
   * 是否使用上方內距
   * - 預設：false
   * - 若為 true，則套用 paddingTop 的數值
   */
  usePaddingTop?: boolean

  /**
   * 上方內距數值（單位：px）
   * - 預設：12px
   * - 僅在 usePaddingTop=true 時生效
   */
  paddingTop?: number

  /**
   * 是否使用下方內距
   * - 預設：true
   * - 若為 true，則套用 paddingBottom 的數值
   */
  usePaddingBottom?: boolean

  /**
   * 下方內距數值（單位：px）
   * - 預設：40px
   * - 僅在 usePaddingBottom=true 時生效
   */
  paddingBottom?: number

  /**
   * 卡片間距（單位：px）
   * - 預設：20px
   */
  gap?: number
}

const props = withDefaults(defineProps<Props>(), {
  widthRatios: () => [],
  height: 296,
  usePaddingTop: false,
  paddingTop: 12,
  usePaddingBottom: true,
  paddingBottom: 40,
  gap: 20,
})

const containerRef = ref<HTMLElement | null>(null)

/**
 * 計算容器樣式
 */
const containerStyle = computed(() => {
  return {
    height: `${props.height}px`,
    paddingTop: props.usePaddingTop ? `${props.paddingTop}px` : '0',
    paddingBottom: props.usePaddingBottom ? `${props.paddingBottom}px` : '0',
    gap: `${props.gap}px`,
  }
})

/**
 * 計算並設定每張卡片的寬度
 */
const calculateCardWidth = () => {
  if (!containerRef.value) return

  const cards = Array.from(containerRef.value.children) as HTMLElement[]
  const cardCount = cards.length

  if (cardCount === 0) return

  const containerWidth = containerRef.value.clientWidth
  const paddingTotal = 40 * 2 // px-10 = 左右各 40px
  const gapTotal = props.gap * (cardCount - 1) // 使用傳入的 gap 值
  const availableWidth = containerWidth - paddingTotal - gapTotal

  const useCustomRatios =
    props.widthRatios && props.widthRatios.length > 0 && props.widthRatios.length === cardCount

  if (useCustomRatios) {
    // 使用自訂比例
    const ratios = props.widthRatios!
    const ratioSum = ratios.reduce((sum, ratio) => sum + ratio, 0)

    cards.forEach((card, index) => {
      const ratio = ratios[index]
      if (ratio === undefined) {
        return
      }
      const cardWidth = availableWidth * (ratio / ratioSum)
      card.style.width = `${cardWidth}px`
      card.style.flexShrink = '0'
    })
  } else {
    // 平均分配
    const cardWidth = availableWidth / cardCount

    cards.forEach((card) => {
      card.style.width = `${cardWidth}px`
      card.style.flexShrink = '0'
    })
  }
}

/**
 * 處理滑鼠滾輪事件，轉換為水平滾動
 */
const handleWheel = (event: WheelEvent) => {
  if (!containerRef.value) return
  const canScroll = containerRef.value.scrollWidth > containerRef.value.clientWidth
  if (!canScroll) return
  event.preventDefault()
  containerRef.value.scrollLeft += event.deltaY
}

/**
 * 監聽視窗大小變化，重新計算卡片寬度
 */
const handleResize = () => {
  calculateCardWidth()
}

/**
 * 使用 MutationObserver 監聽子元素變化
 */
let mutationObserver: MutationObserver | null = null

/**
 * 使用 ResizeObserver 監聽容器大小變化
 * 用於偵測左側選單展開/收起等導致的容器寬度變化
 */
let resizeObserver: ResizeObserver | null = null

/**
 * 監聽 widthRatios prop 變化
 */
watch(
  () => props.widthRatios,
  () => {
    nextTick(() => {
      calculateCardWidth()
    })
  },
  { deep: true },
)

/**
 * 監聽 gap prop 變化
 */
watch(
  () => props.gap,
  () => {
    nextTick(() => {
      calculateCardWidth()
    })
  },
)

onMounted(() => {
  if (containerRef.value) {
    // 初始計算（等待 DOM 完全渲染）
    nextTick(() => {
      calculateCardWidth()
    })

    // 監聽滾輪事件
    containerRef.value.addEventListener('wheel', handleWheel, { passive: false })

    // 監聽視窗大小變化
    window.addEventListener('resize', handleResize)

    // 監聽子元素變化（卡片新增/移除）
    mutationObserver = new MutationObserver(() => {
      nextTick(() => {
        calculateCardWidth()
      })
    })
    mutationObserver.observe(containerRef.value, {
      childList: true,
      subtree: false,
    })

    // 監聽容器本身的大小變化
    // 當左側選單展開/收起時，容器寬度會改變，這裡會自動偵測並重新計算
    resizeObserver = new ResizeObserver(() => {
      nextTick(() => {
        calculateCardWidth()
      })
    })
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  // 清理事件監聽器
  if (containerRef.value) {
    containerRef.value.removeEventListener('wheel', handleWheel)
  }
  window.removeEventListener('resize', handleResize)

  // 清理 MutationObserver
  if (mutationObserver) {
    mutationObserver.disconnect()
  }

  // 清理 ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>
