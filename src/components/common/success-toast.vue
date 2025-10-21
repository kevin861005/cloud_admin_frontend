<template>
  <Transition name="fade">
    <div
      v-if="isVisible"
      class="fixed left-1/2 -translate-x-1/2 z-50 flex items-center gap-2"
      :style="{
        top: toastTopPosition,
        width: '141px',
        padding: '12px 24px 12px 20px',
        borderRadius: '20px',
        boxShadow:
          '0px 4px 4px -4px rgba(12, 12, 13, 0.05), 0px 16px 32px -4px rgba(12, 12, 13, 0.1)',
        background: 'white',
      }"
    >
      <!-- 左側 ICON -->
      <img
        src="@/assets/icons/common/success-icon.svg"
        alt="success"
        style="width: 20px; height: 20px; border-radius: 25px; padding: 2px"
      />

      <!-- 文字 -->
      <span
        style="
          font-family: 'Noto Sans TC';
          font-weight: 400;
          font-size: 16px;
          line-height: 140%;
          letter-spacing: 10%;
          color: #222222;
        "
      >
        {{ message }}
      </span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

/**
 * 成功訊息 Toast 元件
 *
 * 使用方式:
 * router.push('/path?success=新增成功')
 */

const route = useRoute()
const isVisible = ref(false)
const message = ref('')
const pageHeaderHeight = ref(0)

let hideTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 計算 Toast 的 top 位置
 * PageHeader 高度 + 20px
 */
const toastTopPosition = computed(() => {
  return `${pageHeaderHeight.value + 20}px`
})

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
  // 清除之前的計時器
  if (hideTimer) {
    clearTimeout(hideTimer)
  }

  message.value = msg
  isVisible.value = true

  // 3 秒後自動隱藏
  hideTimer = setTimeout(() => {
    isVisible.value = false
  }, 3000)
}

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

/**
 * 元件掛載時取得 PageHeader 高度
 */
onMounted(() => {
  updatePageHeaderHeight()

  // 監聽視窗大小變化,重新計算 PageHeader 高度
  window.addEventListener('resize', updatePageHeaderHeight)
})
</script>

<style scoped>
/* 淡入淡出動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
