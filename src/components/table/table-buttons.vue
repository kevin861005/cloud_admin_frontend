<template>
  <!-- 新增按鈕 -->
  <button
    v-if="showAddButton"
    class="group relative rounded-lg bg-primary-500 px-4 py-2 typo-sm-medium text-white transition-colors focus:outline-none"
    @click="handleAddClick"
  >
    <!-- 黑色遮罩層（只影響背景） -->
    <span
      class="absolute inset-0 rounded-lg bg-black opacity-0 transition-opacity group-hover:opacity-10"
    />
    <!-- 按鈕文字（不受影響） -->
    <span class="relative">{{ addButtonText }}</span>
  </button>
</template>

<script setup lang="ts">
/**
 * 表格操作按鈕元件
 *
 * 功能：
 * - 提供新增按鈕
 * - 未來可擴展其他操作按鈕（匯出、匯入等）
 *
 * Props：
 * - showAddButton: 是否顯示新增按鈕
 * - addButtonText: 新增按鈕文字
 *
 * Events：
 * - add-click: 新增按鈕點擊
 */

interface Props {
  /** 是否顯示新增按鈕 */
  showAddButton?: boolean
  /** 新增按鈕文字 */
  addButtonText?: string
}

withDefaults(defineProps<Props>(), {
  showAddButton: false,
  addButtonText: '新增',
})

const emit = defineEmits<{
  /** 新增按鈕點擊 */
  'add-click': []
}>()

/**
 * 處理新增按鈕點擊
 */
const handleAddClick = () => {
  emit('add-click')
}
</script>
