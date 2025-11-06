<template>
  <div class="flex items-center">
    <!-- 左側：標題框（最大寬度 80px） -->
    <div class="w-[80px] text-left text-sm font-normal tracking-[0.2px] text-gray-600">
      {{ label }}
    </div>

    <!-- 中間：間距 12px -->
    <div class="w-3" />

    <!-- 右側：內容區（佔據剩餘空間） -->
    <div class="flex-1 text-right text-sm font-medium text-gray-500">
      <!-- 如果有傳入 value，顯示文字 -->
      <span v-if="value !== undefined">{{ value }}</span>

      <!-- 否則使用 slot（用於 Badge 等複雜內容） -->
      <div v-else class="flex justify-end gap-2 flex-wrap">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * InfoField 元件
 * 用於顯示單一欄位資訊（左側標題 + 右側內容）
 *
 * 規格：
 * - 左側標題框最大寬度：80px
 * - 中間間距：12px (gap-3)
 * - 右側內容：佔據剩餘空間
 * - 垂直對齊：置中 (items-center)
 * - 標題樣式：Noto Sans TC, 400, 14px, line-height 20px, letter-spacing 0.2px, text-gray-600
 * - 內容樣式：Noto Sans TC, 500, 14px, line-height 20px, text-gray-500
 *
 * @example
 * <!-- 簡單文字 -->
 * <InfoField label="姓名" value="Alan" />
 *
 * @example
 * <!-- 複雜內容（使用 slot） -->
 * <InfoField label="使用狀態">
 *   <Badge text="啟用" type="success" />
 * </InfoField>
 *
 * @example
 * <!-- 多個元素 -->
 * <InfoField label="權限">
 *   <div class="flex gap-2">
 *     <Badge text="業務" type="default" />
 *     <Badge text="主管" type="default" />
 *   </div>
 * </InfoField>
 */

interface Props {
  /**
   * 欄位標題（左側顯示）
   * @example '姓名', '使用狀態', '權限'
   */
  label: string

  /**
   * 欄位值（右側顯示）
   * 僅用於簡單文字顯示
   * 如果需要顯示 Badge 等複雜內容，請使用 slot
   * @example 'Alan', 'Alan@interinfo.com'
   */
  value?: string
}

defineProps<Props>()
</script>
