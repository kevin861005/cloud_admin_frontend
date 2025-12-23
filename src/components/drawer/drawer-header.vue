<template>
  <div class="flex flex-col">
    <!-- 主標題列 -->
    <div class="flex items-center justify-between gap-2">
      <h2 class="typo-xl-bold text-neutral-800">
        {{ title }}
      </h2>
      <!-- Badge slot -->
      <slot name="badge"></slot>
    </div>

    <!-- 副標題（可選） -->
    <p v-if="subtitle" class="typo-sm leading-7 text-neutral-600">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * DrawerHeader 元件
 * 用於顯示 Drawer 的標題區域（主標題 + 可選的 Badge + 可選的副標題）
 *
 * 規格：
 * - 主標題和副標題間距：4px (gap-1)
 * - 主標題與 Badge 間距：8px (gap-2)
 * - 主標題樣式：Noto Sans TC, 700 (Bold), 20px, line-height 28px, letter-spacing -0.2%, text-neutral-800
 * - 副標題樣式：Noto Sans TC, 400 (Regular), 14px, line-height 20px, letter-spacing 0.2px, text-neutral-600
 * - 無背景色、無 padding（由外層控制）
 * - 高度由內容自動撐開
 * - 與下方內容的間距由外層容器控制
 *
 * @example
 * <!-- 有副標題，無 Badge -->
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
 *
 * @example
 * <!-- 有 Badge -->
 * <DrawerHeader
 *   title="客戶名稱"
 *   subtitle="科技業"
 * >
 *   <template #badge>
 *     <Badge text="啟用" type="success" />
 *   </template>
 * </DrawerHeader>
 */

interface Props {
  /**
   * 主標題
   * @example 'Alan', '客戶資訊'
   */
  title: string;

  /**
   * 副標題（可選）
   * @example 'alan12239', 'customer@example.com'
   */
  subtitle?: string;
}

defineProps<Props>();
</script>
