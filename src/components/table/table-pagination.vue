<template>
  <!-- 分頁控制區域 -->
  <div class="flex items-center justify-between border-gray-200 bg-white px-6 py-4">
    <!-- 左側：顯示資料筆數資訊 -->
    <div class="text-sm font-medium text-gray-500">
      顯示 {{ startIndex + 1 }}-{{ endIndex }} 筆，共 {{ totalElements }} 筆記錄
    </div>

    <!-- 中間：頁碼控制 -->
    <div class="flex items-center gap-4">
      <!-- 上一頁按鈕 -->
      <button
        :disabled="currentPage === 0"
        :class="[
          'rounded px-3 py-1 text-sm transition-colors',
          currentPage === 0
            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        ]"
        @click="handlePreviousPage"
      >
        &lt;
      </button>

      <!-- 頁碼資訊 -->
      <span class="text-sm font-medium text-gray-500">
        第 {{ currentPage + 1 }} 頁，共 {{ totalPages }} 頁
      </span>

      <!-- 下一頁按鈕 -->
      <button
        :disabled="currentPage >= totalPages - 1"
        :class="[
          'rounded px-3 py-1 text-sm transition-colors',
          currentPage >= totalPages - 1
            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        ]"
        @click="handleNextPage"
      >
        &gt;
      </button>
    </div>

    <!-- 右側：每頁顯示筆數選擇 -->
    <div class="flex items-center gap-2">
      <span class="text-sm font-medium text-gray-500">顯示筆數:</span>
      <select
        :value="pageSize"
        class="rounded border border-gray-300 bg-white px-3 py-1 text-sm font-normal text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        @change="handlePageSizeChange"
      >
        <option v-for="size in pageSizeOptions" :key="size" :value="size">
          {{ size }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Table 分頁控制元件
 *
 * 功能：
 * 1. 顯示目前頁的資料範圍（例如：顯示 1-10 筆，共 16 筆記錄）
 * 2. 頁碼切換（上一頁/下一頁按鈕）
 * 3. 調整每頁顯示筆數的下拉選單
 *
 * 事件：
 * - page-change: 頁碼改變時觸發，回傳新的頁碼（從 0 開始）
 * - page-size-change: 每頁筆數改變時觸發，回傳新的筆數
 */

// ===== Props 定義 =====
interface Props {
  currentPage: number // 目前頁碼（從 0 開始）
  pageSize: number // 每頁顯示筆數
  totalPages: number // 總頁數
  totalElements: number // 總資料數
  startIndex: number // 目前頁的起始索引（從 1 開始顯示）
  endIndex: number // 目前頁的結束索引
  pageSizeOptions?: number[] // 筆數選項（預設：[10, 20, 50, 100]）
}

const props = withDefaults(defineProps<Props>(), {
  pageSizeOptions: () => [10, 20, 50, 100],
})

// ===== Emits 定義 =====
const emit = defineEmits<{
  'page-change': [page: number] // 頁碼改變事件
  'page-size-change': [size: number] // 每頁筆數改變事件
}>()

// ===== 事件處理 =====

/**
 * 處理上一頁點擊
 */
const handlePreviousPage = () => {
  if (props.currentPage > 0) {
    emit('page-change', props.currentPage - 1)
  }
}

/**
 * 處理下一頁點擊
 */
const handleNextPage = () => {
  if (props.currentPage < props.totalPages - 1) {
    emit('page-change', props.currentPage + 1)
  }
}

/**
 * 處理每頁筆數改變
 */
const handlePageSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newSize = Number(target.value)
  emit('page-size-change', newSize)
}
</script>
