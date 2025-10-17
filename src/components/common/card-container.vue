<template>
  <!--
    【通用卡片容器元件】

    用途：
    - 提供水平排列的卡片容器
    - 支援平均分配或自訂比例分配寬度
    - 支援自訂容器高度
    - 支援水平滾動
    - 支援滑鼠滾輪轉換為水平滾動

    使用場景：
    - 總覽頁面的統計卡片
    - 儀表板的數據卡片
    - 報表頁面的圖表卡片
    - 任何需要水平排列卡片的地方

    使用方式：

    【方式 1：平均分配 + 預設高度】
    <card-container>
      <Card1 />
      <Card2 />
      <Card3 />
    </card-container>

    【方式 2：自訂比例 + 預設高度】
    <card-container :width-ratios="[1, 2]">
      <Card1 />  佔 33.33%
      <Card2 />  佔 66.67%
    </card-container>

    【方式 3：平均分配 + 自訂高度】
    <card-container :height="400">
      <Card1 />
      <Card2 />
    </card-container>

    【方式 4：自訂比例 + 自訂高度】
    <card-container :width-ratios="[34, 66]" :height="500">
      <Card1 />  佔 34%
      <Card2 />  佔 66%
    </card-container>

    特性：
    ✅ 自動計算寬度（平均或按比例）
    ✅ 自訂容器高度
    ✅ 響應式設計（視窗大小改變自動調整）
    ✅ 動態支援（卡片新增/移除自動重新計算）
    ✅ 水平滾動（當卡片總寬度超過容器時）
    ✅ 滑鼠滾輪支援（上下滾動轉為左右滾動）
  -->
  <div
    ref="containerRef"
    class="flex items-center gap-5 overflow-x-auto overflow-y-hidden py-5 px-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    :style="{ height: `${props.height}px` }"
  >
    <!-- 使用 slot 讓外部可以插入任意數量的卡片 -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

/**
 * Props 定義
 */
interface Props {
  /**
   * 卡片寬度比例陣列
   *
   * 使用方式：
   * - 不傳入（預設）：平均分配所有卡片
   * - [1, 2]：第一張卡片佔 1/3，第二張佔 2/3
   * - [1, 2, 1]：按 1:2:1 的比例分配
   * - [34, 66]：第一張卡片佔 34%，第二張佔 66%
   *
   * 注意事項：
   * - 陣列長度必須與卡片數量一致
   * - 如果長度不一致，會自動改用平均分配
   * - 比例會自動正規化（總和不需要是 100）
   *
   * 範例：
   * [1, 2] 會轉換為 [33.33%, 66.67%]
   * [34, 66] 會轉換為 [34%, 66%]
   * [1, 2, 1] 會轉換為 [25%, 50%, 25%]
   */
  widthRatios?: number[]

  /**
   * 容器高度（單位：px）
   *
   * 使用方式：
   * - 不傳入（預設）：使用預設高度 312px
   * - 傳入數字：自訂高度（例如：400 表示 400px）
   *
   * 範例：
   * :height="400"  → 容器高度 400px
   * :height="500"  → 容器高度 500px
   * :height="272"  → 容器高度 272px（與卡片高度一致）
   *
   * 注意事項：
   * - 建議設定為卡片高度 + 上下 padding (40px)
   * - 例如：卡片高度 272px，建議容器高度設為 312px
   */
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  widthRatios: () => [],
  height: 312, // 預設高度 312px (272px 卡片 + 40px padding)
})

const containerRef = ref<HTMLElement | null>(null)

/**
 * 計算並設定每張卡片的寬度
 *
 * 支援兩種模式：
 * 1. 平均分配模式（預設）：每張卡片寬度相等
 * 2. 自訂比例模式：根據 widthRatios prop 分配寬度
 *
 * 計算邏輯：
 * 1. 取得容器的可用寬度（扣除左右 padding）
 * 2. 計算卡片數量
 * 3. 扣除所有 gap 的總寬度
 * 4. 根據模式分配寬度
 *
 * 【平均分配模式】
 * 公式：卡片寬度 = (容器寬度 - padding總和 - gap總寬度) / 卡片數量
 *
 * 範例（容器 1200px，3 張卡片）：
 * 可用寬度 = 1200px - 80px(padding) - 40px(gap) = 1080px
 * 每張卡片 = 1080px / 3 = 360px
 *
 * 【自訂比例模式】
 * 公式：卡片寬度 = 可用寬度 × (該卡片比例 / 比例總和)
 *
 * 範例（容器 1200px，2 張卡片，比例 [1, 2]）：
 * 可用寬度 = 1200px - 80px(padding) - 20px(gap) = 1100px
 * 比例總和 = 1 + 2 = 3
 * 第一張卡片 = 1100px × (1/3) = 366.67px
 * 第二張卡片 = 1100px × (2/3) = 733.33px
 */
const calculateCardWidth = () => {
  if (!containerRef.value) return

  // 取得所有子元素（卡片）
  const cards = Array.from(containerRef.value.children) as HTMLElement[]
  const cardCount = cards.length

  if (cardCount === 0) return

  // 取得容器寬度
  const containerWidth = containerRef.value.clientWidth

  // 計算左右 padding 總和 (px-10 = 40px * 2)
  const paddingTotal = 40 * 2

  // 計算 gap 總寬度 (gap-5 = 20px，gap 數量 = 卡片數量 - 1)
  const gapTotal = 20 * (cardCount - 1)

  // 計算可用寬度
  const availableWidth = containerWidth - paddingTotal - gapTotal

  // 判斷使用哪種模式
  const useCustomRatios =
    props.widthRatios && props.widthRatios.length > 0 && props.widthRatios.length === cardCount

  if (useCustomRatios) {
    // 【自訂比例模式】
    const ratios = props.widthRatios!
    const ratioSum = ratios.reduce((sum, ratio) => sum + ratio, 0)

    // 將計算後的寬度套用到每張卡片
    cards.forEach((card, index) => {
      const ratio = ratios[index]

      // TypeScript 型別守衛：確保 ratio 存在
      if (ratio === undefined) {
        console.error(`⚠️ 比例陣列索引 ${index} 的值為 undefined`)
        return
      }

      const cardWidth = availableWidth * (ratio / ratioSum)

      card.style.width = `${cardWidth}px`
      card.style.flexShrink = '0' // 防止卡片被壓縮
    })

    // 開發環境下輸出除錯資訊
    if (import.meta.env.DEV) {
      console.log('📊 卡片寬度計算（自訂比例模式）:')
      console.log('- 容器寬度:', containerWidth, 'px')
      console.log('- 可用寬度:', availableWidth, 'px')
      console.log('- 比例設定:', ratios)
      console.log('- 比例總和:', ratioSum)
      ratios.forEach((ratio, index) => {
        const percentage = ((ratio / ratioSum) * 100).toFixed(2)
        const cardWidth = availableWidth * (ratio / ratioSum)
        console.log(`- 卡片 ${index + 1}: ${cardWidth.toFixed(2)}px (${percentage}%)`)
      })
    }
  } else {
    // 【平均分配模式】
    const cardWidth = availableWidth / cardCount

    // 將計算後的寬度套用到每張卡片
    cards.forEach((card) => {
      card.style.width = `${cardWidth}px`
      card.style.flexShrink = '0' // 防止卡片被壓縮
    })

    // 開發環境下輸出除錯資訊
    if (import.meta.env.DEV) {
      console.log('📊 卡片寬度計算（平均分配模式）:')
      console.log('- 容器寬度:', containerWidth, 'px')
      console.log('- 可用寬度:', availableWidth, 'px')
      console.log('- 卡片數量:', cardCount)
      console.log('- 每張卡片:', cardWidth.toFixed(2), 'px')
    }

    // 如果有傳入 widthRatios 但長度不符，顯示警告
    if (
      props.widthRatios &&
      props.widthRatios.length > 0 &&
      props.widthRatios.length !== cardCount
    ) {
      console.warn(
        `⚠️ widthRatios 長度 (${props.widthRatios.length}) 與卡片數量 (${cardCount}) 不一致，已自動改用平均分配模式`,
      )
    }
  }
}

/**
 * 處理滑鼠滾輪事件，轉換為水平滾動
 *
 * 行為：
 * - 當內容寬度超過容器寬度時，啟用此功能
 * - 使用者上下滾動滑鼠滾輪時，轉換為左右滾動
 * - 提升使用者體驗（不需要拖拉滾動條）
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
 *
 * 觸發時機：
 * - 使用者調整瀏覽器視窗大小
 * - 螢幕方向改變（手機/平板）
 */
const handleResize = () => {
  calculateCardWidth()
}

/**
 * 使用 MutationObserver 監聽子元素變化
 *
 * 監聽內容：
 * - 卡片元件的新增
 * - 卡片元件的移除
 *
 * 行為：
 * - 當偵測到變化時，自動重新計算所有卡片的寬度
 * - 確保卡片始終按照指定比例或平均分配
 */
let observer: MutationObserver | null = null

/**
 * 監聽 widthRatios prop 變化
 * 當比例設定改變時，重新計算寬度
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

onMounted(() => {
  if (containerRef.value) {
    // 初始計算（等待 DOM 完全渲染）
    nextTick(() => {
      calculateCardWidth()
    })

    // 監聽滾輪事件（passive: false 允許阻止預設行為）
    containerRef.value.addEventListener('wheel', handleWheel, { passive: false })

    // 監聽視窗大小變化
    window.addEventListener('resize', handleResize)

    // 監聽子元素變化（卡片新增/移除）
    observer = new MutationObserver(() => {
      nextTick(() => {
        calculateCardWidth()
      })
    })

    observer.observe(containerRef.value, {
      childList: true, // 監聽子元素的新增/移除
      subtree: false, // 不監聽更深層的變化
    })
  }
})

onUnmounted(() => {
  // 清理事件監聽器，避免記憶體洩漏
  if (containerRef.value) {
    containerRef.value.removeEventListener('wheel', handleWheel)
  }
  window.removeEventListener('resize', handleResize)

  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
/*
  此元件使用 Tailwind CSS utility classes
  不需要額外的 CSS 樣式
*/
</style>
