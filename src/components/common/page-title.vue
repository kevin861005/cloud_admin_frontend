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

    字體樣式規範（來自 Figma）：
    主標題：
    - color: #1E293B
    - font-family: "Noto Sans TC"
    - font-size: 24px
    - font-weight: 700
    - line-height: 30px (125%)
    - letter-spacing: -0.2px

    副標題：
    - color: #64748B
    - font-family: "Noto Sans TC"
    - font-size: 14px
    - font-weight: 400
    - line-height: 22px (157.143%)
    - letter-spacing: 0.2px
  -->
  <div>
    <!-- 主標題（使用自定義 CSS 類別 page-title-main） -->
    <h1 class="page-title-main">
      {{ title }}
    </h1>

    <!-- 副標題（使用自定義 CSS 類別 page-title-subtitle） -->
    <p v-if="subtitle" class="page-title-subtitle mt-2">
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
