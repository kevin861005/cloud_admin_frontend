<template>
  <div
    ref="containerRef"
    class="w-full mx-auto px-10 pb-10 overflow-x-auto overflow-y-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    :style="{ height: `${props.height}px` }"
  >
    <!-- 可選的白色卡片背景 -->
    <div v-if="props.useCard" class="flex-shrink-0 bg-white rounded-lg shadow-md p-6">
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
   * 容器高度（單位：px）
   *
   * 使用方式：
   * - 不傳入（預設）：使用預設高度 628px
   * - 傳入數字：自訂高度（例如：800 表示 800px）
   *
   * 範例：
   * :height="628"  → 容器高度 628px（預設）
   * :height="800"  → 容器高度 800px
   * :height="1000" → 容器高度 1000px
   *
   * 注意事項：
   * - 根據表格預期顯示的列數調整
   * - 預設 628px 約可顯示 10-12 列資料
   */
  height?: number

  /**
   * 是否使用白色卡片背景
   *
   * 使用方式：
   * - true（預設）：表格外層會有白色背景、圓角、陰影
   * - false：表格直接顯示，無背景卡片
   *
   * 範例：
   * :use-card="true"   → 有白色卡片背景（預設）
   * :use-card="false"  → 無背景，直接顯示表格
   *
   * 使用建議：
   * - 獨立表格頁面：建議使用 true（更美觀）
   * - 嵌入其他卡片內：使用 false（避免雙層卡片）
   */
  useCard?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 628, // 預設高度 628px（約 10-12 列資料）
  useCard: true, // 預設使用白色卡片背景
})

const containerRef = ref<HTMLElement | null>(null)

/**
 * 處理滑鼠滾輪事件，轉換為水平滾動
 *
 * 行為：
 * - 當表格寬度超過容器寬度時，啟用此功能
 * - 使用者上下滾動滑鼠滾輪時，轉換為左右滾動
 * - 提升使用者體驗（不需要拖拉滾動條）
 *
 * 適用場景：
 * - 表格欄位很多，超出螢幕寬度
 * - 需要左右捲動查看更多欄位
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
    // 監聽滾輪事件（passive: false 允許阻止預設行為）
    containerRef.value.addEventListener('wheel', handleWheel, { passive: false })
  }
})

onUnmounted(() => {
  // 清理事件監聽器，避免記憶體洩漏
  if (containerRef.value) {
    containerRef.value.removeEventListener('wheel', handleWheel)
  }
})
</script>

<style scoped>
/*
  此元件使用 Tailwind CSS utility classes
  不需要額外的 CSS 樣式
*/
</style>
