<template>
  <div
    v-if="visible"
    class="flex h-14 items-center justify-between rounded-lg border border-[#E4E6EA] bg-[#F9FAFB] px-5 py-3"
  >
    <!-- 左側：已選擇項目數 + 批量操作按鈕 -->
    <div class="flex items-center gap-3">
      <!-- 已選擇項目數 -->
      <span class="typo-sm-medium text-[#6B7280]">
        已選擇 {{ selectedCount }} 個{{ itemName }}
      </span>

      <!-- 批量操作按鈕 -->
      <template v-for="action in batchActions" :key="action.key">
        <!-- 通知寄送狀態按鈕 -->
        <button
          v-if="action.type === 'applied'"
          class="flex h-8 items-center gap-1 rounded bg-white px-2.5 py-1.5 typo-sm-medium text-primary-500 hover:bg-neutral-200"
          @click="handleBatchAction(action)"
        >
          <img :src="AppliedIcon" alt="" class="h-4 w-4 icon-primary" />
          <span>{{ action.label }}</span>
        </button>

        <!-- 環境刪除按鈕 -->
        <button
          v-if="action.type === 'delete'"
          class="flex h-8 items-center gap-1 rounded bg-white px-2.5 py-1.5 typo-sm-medium text-semantic-warning hover:bg-neutral-200"
          @click="handleBatchAction(action)"
        >
          <img :src="DeleteIcon" alt="" class="h-4 w-4" />
          <span>{{ action.label }}</span>
        </button>
      </template>
    </div>

    <!-- 右側：取消選擇 -->
    <div class="px-3">
      <button
        class="flex h-8 items-center rounded px-2.5 typo-sm-medium text-neutral-500 hover:bg-neutral-200"
        @click="handleCancelSelection"
      >
        取消選擇
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BatchActionConfig } from '@/types/table'
import AppliedIcon from '@/assets/icons/card/card-e-applied.svg'
import DeleteIcon from '@/assets/icons/table/delete.svg'

/**
 * Table 選取狀態列元件
 *
 * 功能：
 * 1. 顯示已選擇的項目數量
 * 2. 批量操作按鈕（根據 type 顯示不同樣式）
 *    - notify: 藍色按鈕（通知寄送狀態）
 *    - delete: 紅色按鈕（環境刪除）
 * 3. 取消選擇連結
 *
 * 顯示條件：
 * - showCheckbox === true 且 selectedCount > 0
 *
 * 事件：
 * - batch-action: 批量操作按鈕點擊時觸發
 * - cancel-selection: 取消選擇連結點擊時觸發
 */

// ===== Props 定義 =====
interface Props {
  showCheckbox: boolean // 是否啟用選取功能
  selectedCount: number // 已選擇的項目數量
  itemName?: string // 項目名稱（例如：「客戶」、「訂單」），預設為「項目」
  batchActions?: BatchActionConfig[] // 批量操作按鈕配置
}

const props = withDefaults(defineProps<Props>(), {
  itemName: '項目',
  batchActions: () => [],
})

// ===== Emits 定義 =====
const emit = defineEmits<{
  'batch-action': [actionKey: string] // 批量操作按鈕點擊事件
  'cancel-selection': [] // 取消選擇連結點擊事件
}>()

// ===== 計算屬性 =====

/**
 * 判斷選取狀態列是否顯示
 * 條件：showCheckbox === true 且 selectedCount > 0
 */
const visible = computed(() => props.showCheckbox && props.selectedCount > 0)

// ===== 事件處理 =====

/**
 * 處理批量操作按鈕點擊
 * 目前先使用 alert 提示，未來可替換為自訂彈窗
 */
const handleBatchAction = (action: BatchActionConfig) => {
  emit('batch-action', action.key)
}

/**
 * 處理取消選擇連結點擊
 */
const handleCancelSelection = () => {
  emit('cancel-selection')
}
</script>
