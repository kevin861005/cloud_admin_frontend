<template>
  <button :class="buttonClasses" :style="buttonStyles" type="button" @click="handleClick">
    <img v-if="icon" :src="icon" :alt="iconAlt" :style="iconStyles" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * IconFrame 元件
 * 提供可自訂尺寸、背景顏色的相框容器來包裹 ICON
 * 支援無外框模式（僅顯示 ICON）
 *
 * @example
 * <!-- 有外框（預設） -->
 * <IconFrame
 *   :size="40"
 *   :icon-size="16"
 *   :icon="closeIcon"
 *   icon-alt="關閉"
 *   bg-color="bg-transparent"
 *   hover-bg-color="hover:bg-gray-100"
 *   @click="handleClose"
 * />
 *
 * @example
 * <!-- 無外框（僅顯示 ICON） -->
 * <IconFrame
 *   :show-frame="false"
 *   :icon-size="20"
 *   :icon="editIcon"
 *   icon-alt="編輯"
 *   @click="handleEdit"
 * />
 */

interface Props {
  /**
   * 是否顯示外框
   * - true: 顯示圓形外框，支援背景色和 hover 效果
   * - false: 僅顯示 ICON，無外框和 hover 效果
   * @default true
   */
  showFrame?: boolean

  /**
   * 相框尺寸（寬度和高度相同，單位：px）
   * 注意：當 showFrame 為 false 時，此屬性無效
   * @default 40
   */
  size?: number

  /**
   * 背景顏色（Tailwind CSS class）
   * 注意：當 showFrame 為 false 時，此屬性無效
   * @default 'bg-transparent'
   * @example 'bg-gray-100', 'bg-blue-500'
   */
  bgColor?: string

  /**
   * Hover 時的背景顏色（Tailwind CSS class）
   * 如果不提供，則不會有 hover 效果
   * 注意：當 showFrame 為 false 時，此屬性無效
   * @default ''
   * @example 'hover:bg-gray-100', 'hover:bg-blue-600'
   */
  hoverBgColor?: string

  /**
   * ICON 圖片來源路徑
   * @example '@/assets/icons/common/close-icon.svg'
   */
  icon?: string

  /**
   * ICON 尺寸（寬度和高度相同，單位：px）
   * @default 16
   */
  iconSize?: number

  /**
   * ICON 的替代文字（alt 屬性）
   * @default ''
   */
  iconAlt?: string
}

const props = withDefaults(defineProps<Props>(), {
  showFrame: true,
  size: 40,
  bgColor: 'bg-transparent',
  hoverBgColor: '',
  icon: '',
  iconSize: 16,
  iconAlt: '',
})

const emit = defineEmits<{
  /**
   * 當相框或 ICON 被點擊時觸發
   */
  click: []
}>()

/**
 * 處理點擊事件
 */
const handleClick = () => {
  emit('click')
}

/**
 * 按鈕樣式 class
 * 根據 showFrame 決定是否套用外框樣式
 */
const buttonClasses = computed(() => {
  if (props.showFrame) {
    // 有外框：套用圓形外框、背景色、hover 效果、過渡動畫
    return [
      'flex items-center justify-center rounded-full transition-colors',
      props.bgColor,
      props.hoverBgColor,
    ]
  } else {
    // 無外框：只保留基本的 flex 置中
    return 'flex items-center justify-center'
  }
})

/**
 * 按鈕 inline style
 * 根據 showFrame 決定是否設定固定尺寸
 */
const buttonStyles = computed(() => {
  if (props.showFrame) {
    // 有外框：設定固定尺寸
    return {
      width: `${props.size}px`,
      height: `${props.size}px`,
    }
  } else {
    // 無外框：不設定尺寸，由 ICON 大小決定
    return {}
  }
})

/**
 * ICON inline style
 * 固定使用 iconSize
 */
const iconStyles = computed(() => ({
  width: `${props.iconSize}px`,
  height: `${props.iconSize}px`,
}))
</script>
