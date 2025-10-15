<template>
  <!-- 標題區域 -->
  <div class="flex items-center justify-between bg-white px-6 py-4">
    <!-- 左側：標題 + 總數 -->
    <div class="flex items-center gap-2">
      <h2 class="text-xl font-bold text-gray-900">{{ title }}</h2>
      <span
        class="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-blue-100 px-2 text-sm font-medium text-blue-700"
      >
        {{ totalCount }}
      </span>
    </div>

    <!-- 右側：新增按鈕 -->
    <button
      v-if="showAddButton"
      class="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      @click="handleAddClick"
    >
      {{ addButtonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * Table 標題區元件
 *
 * 功能：
 * 1. 顯示標題文字
 * 2. 顯示總資料數（藍色圓形標籤）
 * 3. 可選的「新增」按鈕
 *
 * 事件：
 * - add-click: 新增按鈕點擊時觸發
 */

// ===== Props 定義 =====
interface Props {
  title: string // 標題文字（例如：「客戶列表」）
  totalCount: number // 總資料數（例如：16）
  showAddButton?: boolean // 是否顯示「新增」按鈕（預設 false）
  addButtonText?: string // 新增按鈕文字（預設：「新增」）
}

withDefaults(defineProps<Props>(), {
  showAddButton: false,
  addButtonText: '新增',
})

// ===== Emits 定義 =====
const emit = defineEmits<{
  'add-click': [] // 新增按鈕點擊事件
}>()

// ===== 事件處理 =====

/**
 * 處理新增按鈕點擊
 */
const handleAddClick = () => {
  emit('add-click')
}
</script>
