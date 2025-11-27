<template>
  <!--
    頁面標題元件

    功能：
    1. 顯示頁面主標題（大字體）
    2. 顯示頁面副標題/描述（小字體）

    使用方式：
    <PageTitle
      title="總覽"
      subtitle="關鍵指標和客戶活動狀況"
    />

    Props：
    - title: 主標題文字（必填）
    - subtitle: 副標題文字（選填）
  -->
  <div class="pt-10 pb-10 pl-10">
    <!-- 主標題（使用自定義 CSS 類別 page-title-main） -->
    <h1 class="page-title-main typo-2xl-bold text-gray-800">
      {{ title }}
    </h1>

    <!-- 副標題（使用自定義 CSS 類別 page-title-subtitle） -->
    <p v-if="subtitle" class="page-title-subtitle mt-2 typo-sm text-gray-600">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * Props 定義
 */
interface Props {
  /**
   * 主標題文字
   * 例如：「總覽」、「客戶管理」、「環境管理」
   */
  title: string

  /**
   * 副標題文字（選填）
   * 例如：「關鍵指標和客戶活動狀況」
   */
  subtitle?: string
}

// 接收 props
defineProps<Props>()
</script>
