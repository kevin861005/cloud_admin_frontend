<template>
  <!-- 新增按鈕 -->
  <button
    v-if="showAddButton"
    class="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    @click="handleAddClick"
  >
    {{ addButtonText }}
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
