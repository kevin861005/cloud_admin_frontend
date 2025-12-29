<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-100">
    <div class="flex flex-col items-center gap-5">
      <!-- 文字區塊 -->
      <div class="flex flex-col items-center gap-3 text-center">
        <!-- 主標題 -->
        <h1 class="typo-2xl-medium text-neutral-800">{{ title }}</h1>
        <!-- 副標題 -->
        <p class="typo-base text-neutral-500">{{ subtitle }}</p>
      </div>

      <!-- 圖片 -->
      <img :src="imageSrc" :alt="title" class="h-60 w-60" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 錯誤頁面共用元件
 *
 * 用於顯示 403、404、500 等錯誤頁面
 * 包含主標題、副標題和圖片
 */

interface Props {
  /** 主標題 */
  title: string;
  /** 副標題 */
  subtitle: string;
  /** 圖片路徑 */
  imageSrc: string;
}

defineProps<Props>();
</script>
