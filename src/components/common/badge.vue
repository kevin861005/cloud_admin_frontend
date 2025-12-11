<template>
  <span
    :class="[
      'inline-flex items-center justify-center',
      'min-w-[54px] min-h-6 py-1 px-3 rounded border',
      'typo-xs-bold',
      'break-all',
    ]"
    :style="badgeStyles"
  >
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Badge 元件
 * 用於顯示狀態標籤或一般標籤
 *
 * 特點：
 * - 最小寬度 54px，文字多時自動擴大
 * - 使用 Tailwind CSS
 * - 支援顯示/隱藏邊框
 *
 * @example
 * <!-- 基本使用 -->
 * <Badge text="啟用" type="success" />
 *
 * <!-- 無邊框 -->
 * <Badge text="處理中" type="working" :show-border="false" />
 */

// ========== 型別定義 ==========
type BadgeType = 'default' | 'success' | 'error' | 'working' | 'neutral'

interface BadgeColor {
  bg: string
  border: string
  text: string
}

// ========== Props 定義 ==========
interface Props {
  /** 顯示文字 */
  text: string

  /**
   * 樣式類型
   * - success: 綠色（適合：啟用、成功、活躍）
   * - error: 紅色（適合：停用、錯誤、低活躍）
   * - working: 藍色（適合：處理中、進行中、運行中）
   * - neutral: 灰色背景（適合：資料顯示、標籤內容）
   * - default: 灰色（適合：一般標籤、權限、未使用）
   * @default 'default'
   */
  type?: BadgeType

  /**
   * 是否顯示邊框
   * @default true
   */
  showBorder?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  showBorder: true,
})

// ========== 顏色配置 ==========
const colorMap: Record<BadgeType, BadgeColor> = {
  success: {
    bg: '#27BD720D',
    border: 'rgba(39, 189, 114, 0.1)',
    text: '#27BD72',
  },
  error: {
    bg: '#FD58580D',
    border: 'rgba(253, 88, 88, 0.1)',
    text: '#FD5858',
  },
  working: {
    bg: '#398FF90D',
    border: 'rgba(57, 143, 249, 0.1)',
    text: '#398FF9',
  },
  neutral: {
    bg: '#F3F4F6',
    border: 'rgba(0, 0, 0, 0.1)',
    text: '#374151',
  },
  default: {
    bg: '#0000000D',
    border: 'rgba(0, 0, 0, 0.1)',
    text: 'rgba(0, 0, 0, 0.8)',
  },
}

// ========== Computed ==========
/**
 * Badge 樣式
 */
const badgeStyles = computed(() => {
  const colors = colorMap[props.type]

  return {
    backgroundColor: colors.bg,
    borderColor: props.showBorder ? colors.border : 'transparent',
    color: colors.text,
  }
})
</script>
