<template>
  <!--
    Section-Card 容器元件
    用途：用於包裹多個卡片，提供統一的佈局和水平滾動功能

    設計規格（來自 Figma）：
    - display: flex
    - padding: 20px 40px
    - align-items: center
    - gap: 20px
    - 響應式：維持橫向但允許水平滾動

    滾動方式：
    1. 滑鼠拖拉（原生支援）
    2. 滑鼠滾輪上下滾動 → 轉換為左右滾動（新增功能）
    3. 觸控板兩指滑動（原生支援）
  -->
  <div ref="containerRef" class="section-card-container">
    <!--
      使用 slot 讓外部可以傳入任意內容（卡片元件）
      這樣設計的好處：
      1. 容器不需要知道內部卡片的具體實作
      2. 可以彈性地增加或減少卡片數量
      3. 每個卡片可以有不同的內容和邏輯
    -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Section-Card 容器元件
 *
 * 功能：
 * - 提供 flex 佈局，讓卡片橫向排列
 * - 卡片之間有固定間距（20px）
 * - 支援水平滾動（當卡片總寬度超過容器寬度時）
 * - 滑鼠滾輪自動轉換為水平滾動
 * - 響應式設計：在不同螢幕尺寸下維持橫向佈局
 *
 * 使用方式：
 * <section-card-container>
 *   <customer-stats-card />
 *   <growth-card />
 *   <alert-card />
 * </section-card-container>
 */

// ==================== Refs ====================

/**
 * 容器元素的 ref
 * 用於：
 * 1. 監聽滑鼠滾輪事件
 * 2. 控制水平滾動位置
 */
const containerRef = ref<HTMLElement | null>(null)

// ==================== 滾動邏輯 ====================

/**
 * 處理滑鼠滾輪事件
 *
 * 功能：
 * - 攔截垂直滾動事件
 * - 轉換為水平滾動
 * - 保持平滑的滾動體驗
 *
 * @param event - 滑鼠滾輪事件
 */
const handleWheel = (event: WheelEvent) => {
  // 如果容器不存在，直接返回
  if (!containerRef.value) return

  // 檢查是否有水平滾動的需求
  // scrollWidth: 內容的總寬度
  // clientWidth: 容器的可見寬度
  const canScroll = containerRef.value.scrollWidth > containerRef.value.clientWidth

  // 如果內容不需要滾動（內容寬度 <= 容器寬度），不處理事件
  if (!canScroll) return

  // 阻止預設的垂直滾動行為
  // 這樣滑鼠滾輪就不會觸發頁面的上下滾動
  event.preventDefault()

  // 將垂直滾動的距離（deltaY）轉換為水平滾動
  // deltaY: 滑鼠滾輪滾動的距離（正數向下，負數向上）
  // 我們直接把這個距離用於水平滾動（正數向右，負數向左）
  containerRef.value.scrollLeft += event.deltaY
}

// ==================== 生命週期 ====================

/**
 * 元件掛載時：
 * 1. 添加滑鼠滾輪事件監聽器
 * 2. 使用 passive: false 允許 preventDefault()
 */
onMounted(() => {
  if (containerRef.value) {
    // 添加 wheel 事件監聽器
    // passive: false 是必要的，因為我們需要呼叫 event.preventDefault()
    // 如果不設定 passive: false，瀏覽器會忽略 preventDefault()
    containerRef.value.addEventListener('wheel', handleWheel, { passive: false })
  }
})

/**
 * 元件卸載時：
 * 移除事件監聽器，避免記憶體洩漏
 */
onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('wheel', handleWheel)
  }
})
</script>

<style scoped>
/**
 * Section-Card 容器樣式
 *
 * 注意：不使用 @apply scrollbar-hide，改用手寫 CSS
 * 這樣可以避免插件相依性問題
 */
.section-card-container {
  /* flex 佈局：讓內部卡片橫向排列 */
  display: flex;

  /* 內距：上下 20px，左右 40px */
  padding: 1.25rem 2.5rem; /* 等於 py-5 px-10 */

  /* 垂直對齊：卡片在垂直方向上居中對齊 */
  align-items: center;

  /* 卡片之間的間距：20px */
  gap: 1.25rem; /* 等於 gap-5 */

  /* 水平滾動：當內容超出容器寬度時，允許水平滾動 */
  overflow-x: auto;

  /* 防止垂直滾動 */
  overflow-y: hidden;
}

/* 當使用者按下滑鼠拖拉時，改變游標樣式 */
.section-card-container:active {
  cursor: grabbing;
}

/*
  跨瀏覽器隱藏滾動條
  使用標準 CSS，不依賴任何插件
*/

/* Webkit 瀏覽器（Chrome, Safari, Edge） */
.section-card-container::-webkit-scrollbar {
  display: none;
}

/* IE and Edge (舊版) */
.section-card-container {
  -ms-overflow-style: none;
}

/* Firefox */
.section-card-container {
  scrollbar-width: none;
}
</style>
