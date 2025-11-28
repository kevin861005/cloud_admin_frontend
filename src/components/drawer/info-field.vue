<template>
  <!-- 水平排列（預設） -->
  <div v-if="!vertical" class="flex items-center">
    <!-- 左側：標題框（最大寬度 80px） -->
    <div class="w-[80px] text-left typo-sm text-neutral-600">
      {{ label }}
    </div>

    <!-- 中間：間距 12px -->
    <div class="w-3" />

    <!-- 右側：內容區（佔據剩餘空間） -->
    <div class="flex flex-1 items-center justify-end gap-2">
      <!-- 如果有傳入 value，顯示文字 -->
      <span v-if="value !== undefined" class="typo-sm-medium text-neutral-500">
        {{ value }}
      </span>

      <!-- 否則使用 slot（用於 Badge 等複雜內容） -->
      <div v-else class="flex flex-wrap justify-end gap-2">
        <slot />
      </div>

      <!-- 複製圖示（僅在有 value 且 showCopy 為 true 時顯示） -->
      <img
        v-if="value !== undefined && showCopy"
        :src="copyIcon"
        alt="複製"
        class="h-4 w-4 cursor-pointer text-neutral-400 transition-opacity hover:opacity-70"
        title="點擊複製"
        @click="handleCopy"
      />
    </div>
  </div>

  <!-- 垂直排列 -->
  <div v-else class="flex flex-col">
    <!-- 標題（不限制寬度） -->
    <div class="text-left typo-sm text-neutral-600">
      {{ label }}
    </div>

    <!-- 內容區（靠左對齊） -->
    <div class="flex items-center justify-start gap-2">
      <!-- 如果有傳入 value，顯示文字 -->
      <span v-if="value !== undefined" class="typo-sm-medium text-neutral-500">
        {{ value }}
      </span>

      <!-- 否則使用 slot（用於連結等複雜內容） -->
      <div v-else class="flex flex-wrap items-center justify-start gap-2">
        <slot />
      </div>

      <!-- 複製圖示（僅在有 value 且 showCopy 為 true 時顯示） -->
      <img
        v-if="value !== undefined && showCopy"
        :src="copyIcon"
        alt="複製"
        class="h-4 w-4 cursor-pointer text-neutral-400 transition-opacity hover:opacity-70"
        title="點擊複製"
        @click="handleCopy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import copyIcon from '@/assets/icons/common/cm-copy.svg'

/**
 * InfoField 元件
 * 用於顯示單一欄位資訊（左側標題 + 右側內容）
 *
 * 規格：
 * - 水平排列（預設）：
 *   - 左側標題框最大寬度：80px
 *   - 中間間距：12px
 *   - 右側內容：佔據剩餘空間，靠右對齊
 *   - 標題樣式：Noto Sans TC, 400, 14px, line-height 20px, letter-spacing 0.2px, text-neutral-600
 *   - 內容樣式：Noto Sans TC, 500, 14px, line-height 20px, text-neutral-500
 *
 * - 垂直排列（vertical=true）：
 *   - 標題在上方，不限制寬度
 *   - 內容在下方，靠左對齊
 *   - 標題和內容之間無間距
 *   - 適用於長文字或連結
 *
 * - 複製功能：可選，透過 showCopy prop 控制
 *
 * @example
 * <!-- 簡單文字（水平排列） -->
 * <InfoField label="姓名" value="Alan" />
 *
 * @example
 * <!-- 帶複製功能 -->
 * <InfoField
 *   label="E-mail"
 *   value="alan@example.com"
 *   :show-copy="true"
 *   @copy-success="handleCopySuccess"
 *   @copy-error="handleCopyError"
 * />
 *
 * @example
 * <!-- 連結（垂直排列） -->
 * <InfoField label="快速自動輸入" :vertical="true">
 *   <a href="https://example.com" target="_blank" class="text-sm text-blue-600 hover:underline">
 *     https://example.com/very/long/url/path
 *   </a>
 * </InfoField>
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

  /**
   * 是否顯示複製圖示
   * 僅在有 value 時生效（使用 slot 時不會顯示）
   * @default false
   */
  showCopy?: boolean

  /**
   * 是否使用垂直排列
   * true: 標題在上方，內容在下方（適用於長文字或連結）
   * false: 標題在左側，內容在右側（預設）
   * @default false
   */
  vertical?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCopy: false,
  vertical: false,
})

// ===== Emits 定義 =====
const emit = defineEmits<{
  /**
   * 複製成功事件
   * @param value - 被複製的值
   */
  'copy-success': [value: string]

  /**
   * 複製失敗事件
   * @param error - 錯誤訊息
   */
  'copy-error': [error: string]
}>()

// ===== 方法 =====

/**
 * 處理複製功能
 * 使用 Clipboard API 複製文字到剪貼簿
 */
const handleCopy = async () => {
  if (!props.value) return

  try {
    // 使用現代 Clipboard API
    await navigator.clipboard.writeText(props.value)
    emit('copy-success', props.value)
  } catch (error) {
    console.error('複製失敗:', error)
    emit('copy-error', '複製失敗，請手動複製')
  }
}
</script>
