<template>
  <span
    :class="[
      'inline-flex items-center justify-center',
      'min-w-[54px] h-6 py-1 px-3 rounded border',
      'text-xs font-bold leading-4 tracking-[0.2px]',
      'whitespace-nowrap',
    ]"
    :style="colorStyles"
    style="font-family: 'Noto Sans TC', sans-serif"
  >
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Badge 元件
 * 用於顯示狀態標籤或一般標籤
 * 符合原本 table 內部 badge 的樣式規範
 *
 * 特點：
 * - 最小寬度 54px，文字多時自動擴大
 * - 使用 Tailwind CSS
 * - 保持原本的顏色規範
 */

interface Props {
  /**
   * 顯示文字
   */
  text: string

  /**
   * 樣式類型
   * - success: 綠色（適合：啟用、成功、活躍）
   * - error: 紅色（適合：停用、錯誤、低活躍）
   * - default: 灰色（適合：一般標籤、權限、未使用）
   * @default 'default'
   */
  type?: 'default' | 'success' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
})

/**
 * 顏色樣式（保持原本的顏色規範）
 */
const colorStyles = computed(() => {
  switch (props.type) {
    case 'success':
      return {
        backgroundColor: '#27BD720D',
        borderColor: 'rgba(39, 189, 114, 0.1)',
        color: '#27BD72',
      }
    case 'error':
      return {
        backgroundColor: '#FD58580D',
        borderColor: 'rgba(253, 88, 88, 0.1)',
        color: '#FD5858',
      }
    case 'default':
    default:
      return {
        backgroundColor: '#0000000D',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        color: 'rgba(0, 0, 0, 0.8)',
      }
  }
})
</script>
