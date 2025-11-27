<template>
  <button
    class="inline-flex items-center justify-center gap-2 h-6 px-2 py-1 rounded border border-gray-200 typo-xs-bold text-gray-700 bg-gray-100 cursor-pointer hover:bg-opacity-80 transition-colors"
    @click="handleClick"
  >
    <!-- 圖片在左邊 -->
    <img
      v-if="props.icon && props.iconPosition === 'left'"
      :src="props.icon"
      alt=""
      class="h-4 w-4"
    />

    <!-- 按鈕文字 -->
    <span>{{ props.text }}</span>

    <!-- 圖片在右邊 -->
    <img
      v-if="props.icon && props.iconPosition === 'right'"
      :src="props.icon"
      alt=""
      class="h-4 w-4"
    />
  </button>
</template>

<script setup lang="ts">
/**
 * 徽章按鈕元件
 *
 * 用途：
 * - 小型徽章風格的按鈕
 * - 可包含文字和圖片
 *
 * 特點：
 * - 文字為必填
 * - 圖片選填，位置可由外部決定（左邊或右邊）
 * - 圖片尺寸固定為 16x16px
 * - 圖片與文字間隔 8px
 * - 點擊事件由父元件處理
 *
 * 使用範例：
 * <!-- 純文字 -->
 * <BadgeButton text="更多" @click="handleClick" />
 *
 * <!-- 文字 + 圖片（預設在右邊）-->
 * <BadgeButton text="新增" :icon="AddIcon" @click="handleClick" />
 *
 * <!-- 文字 + 圖片在左邊 -->
 * <BadgeButton text="更新" :icon="UpdateIcon" icon-position="left" @click="handleClick" />
 *
 * <!-- 文字 + 圖片在右邊（明確指定）-->
 * <BadgeButton text="刪除" :icon="DeleteIcon" icon-position="right" @click="handleClick" />
 */

/**
 * Props 定義
 */
interface Props {
  /**
   * 按鈕文字（必填）
   */
  text: string

  /**
   * 圖片路徑（選填）
   * - 固定尺寸 16x16px
   * - 與文字間隔 8px
   */
  icon?: string

  /**
   * 圖片位置（選填）
   * - 'left': 圖片在文字左邊
   * - 'right': 圖片在文字右邊（預設）
   */
  iconPosition?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  iconPosition: 'right',
})

/**
 * Emits 定義
 */
const emit = defineEmits<{
  /**
   * 按鈕點擊事件
   */
  click: []
}>()

/**
 * 處理按鈕點擊
 * 將點擊事件向上傳遞給父元件
 */
const handleClick = () => {
  emit('click')
}
</script>
