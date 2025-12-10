<template>
  <svg class="animate-spin" viewBox="0 0 24 24" fill="none">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
</template>

<script setup lang="ts">
/**
 * LoadingSpinner - 載入中旋轉動畫
 *
 * 使用方式：透過 class 控制大小和顏色
 *
 * @example
 * <!-- 基本使用 -->
 * <LoadingSpinner class="h-4 w-4" />
 *
 * <!-- 自訂顏色 -->
 * <LoadingSpinner class="h-6 w-6 text-primary-500" />
 *
 * <!-- 白色（用於深色按鈕） -->
 * <LoadingSpinner class="h-4 w-4 text-white" />
 */
</script>
