<template>
  <Teleport to="body">
    <!-- 將原本 name="fade" 改為 Tailwind 過場 class -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isVisible"
        class="fixed z-50 flex items-center justify-center gap-2 py-3 bg-white rounded-[20px] shadow-toast"
        :style="{
          top: toastTopPosition,
          left: toastLeftPosition,
          transform: 'translateX(-50%)',
          width: widthValue,
        }"
      >
        <!-- 左側 ICON -->
        <img
          src="@/assets/icons/common/success-icon.svg"
          alt="success"
          class="w-5 h-5 rounded-full p-0.5"
        />

        <!-- 文字 -->
        <span class="typo-base tracking-wide text-[#222222]">
          {{ message }}
        </span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '@/stores/menu.store'

/**
 * 成功訊息 Toast 元件
 *
 * 使用方式:
 * router.push('/path?success=新增成功')
 *
 * 特點:
 * - 使用 Teleport 掛載到 body
 * - 相對於內容區域置中（考慮 Sidebar 寬度）
 * - 可自訂寬度
 */

// ========== Props 定義 ==========
interface Props {
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '141px',
})

// ========== Stores ==========
const menuStore = useMenuStore()

// ========== State ==========
const route = useRoute()
const isVisible = ref(false)
const message = ref('')
const pageHeaderHeight = ref(0)

let hideTimer: ReturnType<typeof setTimeout> | null = null

// ========== Computed ==========
/**
 * 計算 Toast 的寬度值
 */
const widthValue = computed(() => {
  return props.width
})

/**
 * 計算 Toast 的 left 位置
 * 考慮 Sidebar 寬度，讓 Toast 在內容區域置中
 */
const toastLeftPosition = computed(() => {
  // Sidebar 寬度：展開時 255px，收合時 0px
  const sidebarWidth = menuStore.isCollapsed ? 0 : 255

  // 內容區域寬度 = 視窗寬度 - Sidebar 寬度
  const contentWidth = window.innerWidth - sidebarWidth

  // Toast 應該在：Sidebar 寬度 + (內容區域寬度 / 2)
  const leftPosition = sidebarWidth + contentWidth / 2

  return `${leftPosition}px`
})

/**
 * 計算 Toast 的 top 位置
 * PageHeader 高度 + 20px
 */
const toastTopPosition = computed(() => {
  return `${pageHeaderHeight.value + 20}px`
})

// ========== Methods ==========
/**
 * 取得 PageHeader 的高度
 */
const updatePageHeaderHeight = () => {
  const pageHeader = document.querySelector('.sticky.top-0.z-30') as HTMLElement
  if (pageHeader) {
    pageHeaderHeight.value = pageHeader.offsetHeight
  }
}

/**
 * 顯示 Toast 訊息
 */
const showToast = (msg: string) => {
  if (hideTimer) {
    clearTimeout(hideTimer)
  }

  message.value = msg
  isVisible.value = true

  // 測試用
  hideTimer = setTimeout(() => {
    isVisible.value = false
  }, 100000000000)
}

// ========== Watchers ==========
/**
 * 監聽路由變化,檢查是否有 success query
 */
watch(
  () => route.query.success,
  (successMsg) => {
    if (successMsg && typeof successMsg === 'string') {
      showToast(successMsg)
    }
  },
  { immediate: true },
)

// ========== Lifecycle ==========
/**
 * 元件掛載時取得 PageHeader 高度
 */
onMounted(() => {
  updatePageHeaderHeight()

  // 監聽視窗大小變化和 Sidebar 狀態變化
  window.addEventListener('resize', updatePageHeaderHeight)
})
</script>

<!-- 原本的 .fade* CSS 已移除，因為改用 Tailwind 的過場 class -->
<style scoped></style>
