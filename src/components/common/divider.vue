<template>
  <div :class="dividerClasses" :style="customStyle"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * 分隔線元件
 *
 * 功能：
 * - 支援水平/垂直方向
 * - 支援自訂寬度/高度
 * - 支援不同顏色主題
 * - Drawer 專用預設值
 *
 * 使用範例：
 * <Divider /> <!-- Drawer 預設：315px 寬，淺灰色 -->
 * <Divider width="100%" /> <!-- 全寬分隔線 -->
 * <Divider color="dark" /> <!-- 深色分隔線 -->
 */

// ===== Props 定義 =====
interface Props {
  /**
   * 方向
   * - horizontal: 水平（預設）
   * - vertical: 垂直
   */
  direction?: 'horizontal' | 'vertical'

  /**
   * 寬度（水平方向時使用）
   * 可以是：
   * - '315px'（Drawer 預設）
   * - '100%'（全寬）
   * - '50%'（半寬）
   * - 'auto'（自動）
   */
  width?: string

  /**
   * 高度（垂直方向時使用）
   * 可以是：
   * - '20px'
   * - '40px'
   * - '100%'
   */
  height?: string

  /**
   * 顏色主題
   * - light: 淺灰色 #e4e6ea（Drawer 預設，對應 gray-200）
   * - default: 灰色 border-gray-300
   * - dark: 深灰色 border-gray-400
   */
  color?: 'light' | 'default' | 'dark'

  /**
   * 間距（上下或左右的間距）
   * - none: 無間距
   * - sm: 小間距（0.5rem / 8px）
   * - md: 中間距（0.75rem / 12px）
   * - lg: 大間距（1rem / 16px）
   */
  spacing?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'horizontal',
  width: '315px', // Drawer 預設寬度
  height: 'auto',
  color: 'light', // Drawer 預設顏色
  spacing: 'none',
})

// ===== 計算屬性 =====

const dividerClasses = computed(() => {
  const classes = []

  // 方向
  if (props.direction === 'horizontal') {
    classes.push('border-t')
  } else {
    classes.push('border-l', 'h-4') // 垂直預設高度
  }

  // 顏色
  const colorMap = {
    light: 'border-gray-200',
    default: 'border-gray-300',
    dark: 'border-gray-400',
  }
  classes.push(colorMap[props.color])

  // 間距
  if (props.spacing !== 'none') {
    const spacingMap = {
      sm: props.direction === 'horizontal' ? 'my-2' : 'mx-2',
      md: props.direction === 'horizontal' ? 'my-3' : 'mx-3',
      lg: props.direction === 'horizontal' ? 'my-4' : 'mx-4',
    }
    classes.push(spacingMap[props.spacing])
  }

  return classes.join(' ')
})

/**
 * 自訂樣式（寬度/高度）
 */
const customStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.direction === 'horizontal' && props.width !== 'auto') {
    style.width = props.width
  }

  if (props.direction === 'vertical' && props.height !== 'auto') {
    style.height = props.height
  }

  return style
})
</script>
