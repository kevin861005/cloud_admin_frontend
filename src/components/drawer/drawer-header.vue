<template>
  <div class="flex flex-col gap-1">
    <!-- 主標題 -->
    <h2
      class="text-xl font-bold leading-7 tracking-[-0.002em] text-gray-800"
      style="font-family: 'Noto Sans TC', sans-serif"
    >
      {{ title }}
    </h2>

    <!-- 副標題（可選） -->
    <p
      v-if="subtitle"
      class="text-sm font-normal leading-5 tracking-[0.2px] text-gray-600"
      style="font-family: 'Noto Sans TC', sans-serif"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * DrawerHeader 元件
 * 用於顯示 Drawer 的標題區域（主標題 + 可選的副標題）
 *
 * 規格：
 * - 主標題和副標題間距：4px (gap-1)
 * - 主標題樣式：Noto Sans TC, 700 (Bold), 20px, line-height 28px, letter-spacing -0.2%, text-gray-800
 * - 副標題樣式：Noto Sans TC, 400 (Regular), 14px, line-height 20px, letter-spacing 0.2px, text-gray-600
 * - 無背景色、無 padding（由外層控制）
 * - 高度由內容自動撐開
 * - 與下方內容的間距由外層容器控制
 *
 * @example
 * <!-- 有副標題 -->
 * <DrawerHeader
 *   title="Alan"
 *   subtitle="alan12239"
 * />
 *
 * @example
 * <!-- 無副標題 -->
 * <DrawerHeader
 *   title="Alan"
 * />
 */

interface Props {
  /**
   * 主標題
   * @example 'Alan', '客戶資訊'
   */
  title: string

  /**
   * 副標題（可選）
   * @example 'alan12239', 'customer@example.com'
   */
  subtitle?: string
}

defineProps<Props>()
</script>
