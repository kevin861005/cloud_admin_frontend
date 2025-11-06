<template>
  <div class="flex items-center justify-center py-5">
    <div class="text-center">
      <!-- Spinner 動畫 -->
      <div
        v-if="showSpinner"
        class="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
      ></div>

      <!-- 載入文字 -->
      <p class="text-sm text-slate-500">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Loading 載入狀態元件
 *
 * 功能：
 * - 顯示載入中的動畫
 * - 可自訂載入文字
 * - 可選擇是否顯示 spinner
 *
 * 使用範例：
 * <Loading />
 * <Loading message="載入資料中..." />
 * <Loading message="處理中..." :show-spinner="false" />
 */

// ===== Props 定義 =====
interface Props {
  /**
   * 載入提示文字
   */
  message?: string

  /**
   * 是否顯示 spinner 動畫
   */
  showSpinner?: boolean
}

withDefaults(defineProps<Props>(), {
  message: '載入中...',
  showSpinner: true,
})
</script>
