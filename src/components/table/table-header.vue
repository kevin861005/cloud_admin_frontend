<template>
  <!-- 標題區域 -->
  <div class="bg-white">
    <!-- 原始標題列（無選取時顯示） -->
    <div
      v-if="!showCheckbox || selectedCount === 0"
      class="flex items-center justify-between px-6 py-4"
    >
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

    <!-- 選取狀態列（有選取時顯示） -->
    <div
      v-if="showCheckbox && selectedCount > 0"
      class="flex items-center justify-between border-b border-gray-200 bg-blue-50 px-6 py-4"
    >
      <!-- 左側：選取狀態 -->
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-gray-900"> 已選擇 {{ selectedCount }} 個項目 </span>
        <button
          class="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
          @click="handleCancelSelection"
        >
          取消選擇
        </button>
      </div>

      <!-- 右側：批量操作按鈕 -->
      <div v-if="batchActions.length > 0" class="flex items-center gap-2">
        <button
          v-for="action in batchActions"
          :key="action.key"
          :class="[
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
            action.type === 'danger'
              ? 'border border-red-300 bg-white text-red-700 hover:bg-red-50 focus:ring-red-500'
              : action.type === 'primary'
                ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
          ]"
          @click="handleBatchAction(action)"
        >
          {{ action.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BatchActionConfig } from '@/types/table'

/**
 * Table 標題區元件（階段三：整合選取功能）
 *
 * 功能：
 * 1. 顯示標題文字和總資料數
 * 2. 可選的「新增」按鈕
 * 3. 選取狀態顯示（已選擇 X 個項目）
 * 4. 批量操作按鈕（根據配置動態顯示）
 * 5. 取消選擇連結
 *
 * 事件：
 * - add-click: 新增按鈕點擊時觸發
 * - batch-action: 批量操作按鈕點擊時觸發
 * - cancel-selection: 取消選擇連結點擊時觸發
 */

// ===== Props 定義 =====
interface Props {
  title: string // 標題文字（例如：「客戶列表」）
  totalCount: number // 總資料數（例如：16）
  showAddButton?: boolean // 是否顯示「新增」按鈕（預設 false）
  addButtonText?: string // 新增按鈕文字（預設：「新增」）
  // ===== 選取功能（階段三）=====
  showCheckbox?: boolean // 是否顯示選取功能（預設 false）
  selectedCount?: number // 已選擇的項目數量（預設 0）
  batchActions?: BatchActionConfig[] // 批量操作按鈕配置（預設 []）
}

withDefaults(defineProps<Props>(), {
  showAddButton: false,
  addButtonText: '新增',
  showCheckbox: false,
  selectedCount: 0,
  batchActions: () => [],
})

// ===== Emits 定義 =====
const emit = defineEmits<{
  'add-click': [] // 新增按鈕點擊事件
  'batch-action': [actionKey: string] // 批量操作按鈕點擊事件
  'cancel-selection': [] // 取消選擇連結點擊事件
}>()

// ===== 事件處理 =====

/**
 * 處理新增按鈕點擊
 */
const handleAddClick = () => {
  emit('add-click')
}

/**
 * 處理批量操作按鈕點擊
 * 如果設定了確認訊息，先顯示確認對話框
 */
const handleBatchAction = (action: BatchActionConfig) => {
  if (action.confirmMessage) {
    // 顯示確認對話框
    if (confirm(action.confirmMessage)) {
      emit('batch-action', action.key)
    }
  } else {
    // 直接執行
    emit('batch-action', action.key)
  }
}

/**
 * 處理取消選擇連結點擊
 */
const handleCancelSelection = () => {
  emit('cancel-selection')
}
</script>
