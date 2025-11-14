<template>
  <!--
    Container 上方固定區塊

    功能：
    1. 左側：選單收合/展開按鈕
    2. 中間：
       - 總覽頁面：不顯示任何內容
       - 子頁面（如 /environment/delete-records）：顯示「返回上一頁」按鈕
       - 主功能頁面（左側選單中的頁面）：顯示「返回總覽」按鈕
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

      <!-- 中間：返回按鈕（根據路由層級顯示不同文字） -->
      <div v-if="showBackButton">
        <button
          @click="handleBack"
          class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <!-- 左箭頭 ICON（16x16px SVG） -->
          <img src="@/assets/icons/common/back-arrow.svg" alt="返回" class="h-4 w-4" />
          <!-- 文字：根據路由層級動態顯示 -->
          <span class="text-sm">{{ backButtonText }}</span>
        </button>
      </div>
    </div>

    <!-- 右側：即時時間 + 使用者名稱 -->
    <div class="flex items-center gap-6">
      <!--
        即時時間（格式：YYYY.MM.DD HH:mm:ss）
      -->
      <div class="text-sm font-normal text-gray-900 tracking-[0.2px]">
        {{ currentTime }}
      </div>

      <!-- 使用者名稱 -->
      <div class="text-sm font-medium text-gray-900 text-right">{{ userName }}</div>
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

// ==================== Constants ====================

/**
 * 主功能頁面路徑列表
 * 這些是左側選單中的頁面，點擊返回按鈕應該回到總覽
 */
const MAIN_FEATURE_PATHS = [
  '/customers',
  '/environment',
  '/settings/accounts',
  '/settings/roles',
  '/settings/modules',
  '/settings/industries',
  '/settings/dealers',
]

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
 */
const isOverviewPage = computed(() => {
  return route.name === 'Overview' || route.path === '/overview' || route.path === '/'
})

/**
 * 是否為新增帳號頁面
 */
const isAccountCreatePage = computed(() => {
  return route.name === 'AccountCreate' || route.path === '/settings/accounts/create'
})

/**
 * 是否為新增模組頁面
 */
const isModuleCreatePage = computed(() => {
  return route.name === 'ModuleCreate' || route.path === '/settings/modules/create'
})

/**
 * 是否為新增產業別頁面
 */
const isIndustryCreatePage = computed(() => {
  return route.name === 'IndustryCreate' || route.path === '/settings/industries/create'
})

/**
 * 是否為主功能頁面
 * 主功能頁面：在左側選單中的頁面
 */
const isMainFeaturePage = computed(() => {
  return MAIN_FEATURE_PATHS.includes(route.path)
})

/**
 * 是否顯示返回按鈕
 * 只有總覽頁面不顯示
 */
const showBackButton = computed(() => {
  return (
    !isOverviewPage.value &&
    !isAccountCreatePage.value &&
    !isModuleCreatePage.value &&
    !isIndustryCreatePage.value
  )
})

/**
 * 返回按鈕文字
 * - 主功能頁面：「返回總覽」
 * - 子頁面：「返回上一頁」
 */
const backButtonText = computed(() => {
  return isMainFeaturePage.value ? '返回總覽' : '返回上一頁'
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
 * 處理返回邏輯
 * - 主功能頁面：返回總覽頁面
 * - 子頁面：返回父路徑
 */
function handleBack() {
  if (isMainFeaturePage.value) {
    // 主功能頁面：返回總覽
    router.push({ name: 'Overview' })
  } else {
    // 子頁面：返回父路徑
    const parentPath = getParentPath(route.path)
    router.push(parentPath)
  }
}

/**
 * 取得父路徑
 * 例如：/environment/delete-records → /environment
 *      /settings/accounts/create → /settings/accounts
 */
function getParentPath(path: string): string {
  const segments = path.split('/').filter(Boolean) // 移除空字串
  segments.pop() // 移除最後一段
  return '/' + segments.join('/')
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
