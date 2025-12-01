<template>
  <div>
    <!-- Title 區域：固定高度 40px -->
    <div class="flex h-7 items-center justify-between">
      <!-- 左側：標題文字 -->
      <h3 class="typo-sm-bold text-neutral-600">
        {{ title }}
      </h3>

      <!-- 右側：自訂動作區（可選） -->
      <slot name="action" />
    </div>

    <!-- Group 區域：InfoField 列表，間距 8px -->
    <div class="flex flex-col gap-2">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * InfoSection 元件
 * 用於組織和顯示一組相關的資訊欄位
 *
 * 結構：
 * - Title 區域：固定高度 40px，標題文字 + 可選的右側動作按鈕
 * - Group 區域：包含多個 InfoField，欄位之間間距 8px
 *
 * 規格：
 * - Title 固定高度：40px
 * - Title 和 Group 之間：無間距
 * - InfoField 之間間距：8px (gap-2)
 * - Title 文字樣式：Noto Sans TC, 700 (Bold), 14px, line-height 20px, text-neutral-600
 * - 無背景色、無邊線、無 padding（由外層控制）
 *
 * @example
 * <!-- 基本用法（無右側動作） -->
 * <InfoSection title="異動資訊">
 *   <InfoField label="建立者" value="kevin" />
 *   <InfoField label="建立日" value="2025.10.12" />
 * </InfoSection>
 *
 * @example
 * <!-- 帶右側編輯按鈕 -->
 * <InfoSection title="個人資訊">
 *   <template #action>
 *     <IconFrame
 *       :show-frame="false"
 *       :icon-size="16"
 *       :icon="editIcon"
 *       icon-alt="編輯"
 *       @click="handleEdit"
 *     />
 *   </template>
 *
 *   <InfoField label="姓名" value="Alan" />
 *   <InfoField label="使用狀態">
 *     <Badge text="啟用" type="success" />
 *   </InfoField>
 * </InfoSection>
 */

interface Props {
  /**
   * 區塊標題
   * @example '個人資訊', '異動資訊'
   */
  title?: string
}

defineProps<Props>()
</script>
