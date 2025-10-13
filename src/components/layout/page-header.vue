<template>
  <!--
    Container 上方固定區塊

    功能：
    1. 左側：選單收合/展開按鈕
    2. 中間：
       - 總覽頁面：不顯示任何內容
       - 其他頁面：顯示「返回總覽」按鈕（箭頭 ICON + 文字）
    3. 右側：即時時間 + 使用者名稱

    樣式參考 Figma：
    - 高度：64px
    - 左右 padding：40px
    - 背景：白色
    - 陰影：底部淡灰色陰影
  -->
  <div
    class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-10 shadow-[1px_3px_4px_0_rgba(0,0,0,0.10)]"
  >
    <!-- 左側：選單收合按鈕 -->
    <div class="flex items-center gap-4">
      <!-- 收合/展開按鈕 -->
      <button
        @click="handleToggleMenu"
        class="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100 transition-colors"
        :title="menuStore.isCollapsed ? '展開選單' : '收合選單'"
      >
        <img src="@/assets/icons/common/menu-toggle.svg" alt="選單" class="h-4 w-4" />
      </button>

      <!-- 中間：「返回總覽」按鈕（只在非總覽頁面顯示） -->
      <div v-if="!isOverviewPage">
        <!-- 在非總覽頁面時，顯示「返回總覽」按鈕（箭頭 ICON + 文字） -->
        <button
          @click="handleBackToOverview"
          class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <!-- 左箭頭 ICON（16x16px SVG） -->
          <img src="@/assets/icons/common/back-arrow.svg" alt="返回" class="h-4 w-4" />
          <!-- 文字 -->
          <span class="text-sm">返回總覽</span>
        </button>
      </div>
      <!-- 總覽頁面時，不顯示任何內容 -->
    </div>

    <!-- 右側：即時時間 + 使用者名稱 -->
    <div class="flex items-center gap-6 text-sm text-gray-600">
      <!--
        即時時間（格式：YYYY.MM.DD HH:mm:ss）
        使用 Inter 字型（Medium 500）

        Figma 規範：
        - color: #000
        - font-family: Inter
        - font-size: 14px
        - font-weight: 500
        - line-height: 20px (142.857%)
        - letter-spacing: -0.15px
      -->
      <div class="header-time">{{ currentTime }}</div>

      <!-- 使用者名稱 -->
      <div class="font-medium text-gray-800">{{ userName }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMenuStore } from '@/stores/menu.store'
import { useAuthStore } from '@/stores/auth.store'

// ==================== Composables ====================

const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const authStore = useAuthStore()

// ==================== State ====================

/**
 * 當前時間（格式：YYYY.MM.DD HH:mm:ss）
 */
const currentTime = ref<string>('')

/**
 * 定時器 ID（用於清除定時器）
 */
let timerInterval: number | null = null

// ==================== Computed ====================

/**
 * 是否為總覽頁面
 *
 * 判斷規則：
 * - route.name === 'Overview'
 * - route.path === '/overview'
 * - route.path === '/'
 */
const isOverviewPage = computed(() => {
  return route.name === 'Overview' || route.path === '/overview' || route.path === '/'
})

/**
 * 使用者名稱
 */
const userName = computed(() => {
  return authStore.userName || '訪客'
})

// ==================== Methods ====================

/**
 * 格式化時間
 * 格式：YYYY.MM.DD HH:mm:ss
 */
function formatTime(): string {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 更新當前時間
 */
function updateTime() {
  currentTime.value = formatTime()
}

/**
 * 處理選單收合/展開
 */
function handleToggleMenu() {
  menuStore.toggleCollapsed()
}

/**
 * 處理返回總覽
 *
 * 點擊「返回總覽」按鈕時，導航到總覽頁面
 */
function handleBackToOverview() {
  router.push({ name: 'Overview' })
}

// ==================== Lifecycle ====================

/**
 * 元件掛載時：
 * 1. 立即更新一次時間
 * 2. 啟動定時器（每秒更新時間）
 */
onMounted(() => {
  updateTime()
  timerInterval = window.setInterval(updateTime, 1000)
})

/**
 * 元件卸載時：清除定時器
 */
onUnmounted(() => {
  if (timerInterval !== null) {
    clearInterval(timerInterval)
  }
})
</script>
