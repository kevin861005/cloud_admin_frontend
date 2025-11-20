<template>
  <!--
    CardList 元件 - 卡片列表

    功能:
    1. 顯示資料列表（支援任意資料型別）
    2. 支援前端分頁
    3. 支援前端排序（可針對特定欄位啟用）
    4. 欄位寬度使用 flex 比例配置
    5. 支援 tooltip（可針對特定欄位啟用）
    6. 支援載入/錯誤/空資料狀態

    尺寸規格:
    - 間距: py-6 px-5（上下 24px，左右 20px）
    - 高度: 可自訂（預設 396px）
    - 內容區域高度: 248px（固定）
    - 分頁區域高度: 32px
  -->

  <div class="bg-white rounded-lg shadow-md py-6 px-5 flex flex-col" :style="{ height: height }">
    <div class="flex flex-col h-full">
      <!-- 標題列 -->
      <div class="flex items-center h-6 mb-6">
        <div class="flex items-center gap-3">
          <h3 class="text-base font-bold text-gray-700">{{ title }}</h3>

          <!-- 總筆數標籤 -->
          <span
            class="inline-flex items-center justify-center min-w-[24px] h-6 px-2 py-1 text-xs font-medium rounded text-[#398ff9] border border-[#398ff91a] bg-[#398ff90d]"
          >
            {{ totalCount }}
          </span>
        </div>
      </div>

      <!-- 表格區域 -->
      <div class="flex flex-col h-[248px]">
        <!-- 表頭 -->
        <div class="flex items-center h-5 gap-5 pb-3 mb-3 border-b border-black/10">
          <div
            v-for="column in columns"
            :key="column.key"
            :style="{ flex: column.flex || 1 }"
            :class="[
              'flex items-center h-5 gap-1 text-sm font-medium text-gray-700',
              column.sortable && 'cursor-pointer select-none hover:text-gray-800 transition-colors',
              getAlignClass(column.align),
            ]"
            @click="column.sortable && handleSort(column.key)"
          >
            {{ column.label }}

            <!-- 排序圖示（僅在可排序時顯示） -->
            <span v-if="column.sortable" class="text-gray-400">
              <!-- 無排序狀態 -->
              <svg
                v-if="sortState.key !== column.key"
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>

              <!-- 升冪排序 -->
              <svg
                v-else-if="sortState.order === 'asc'"
                class="h-4 w-4 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 15l7-7 7 7"
                />
              </svg>

              <!-- 降冪排序 -->
              <svg
                v-else
                class="h-4 w-4 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </div>
        </div>

        <!-- 內容區域 -->
        <div class="flex-1 min-h-0">
          <!-- Loading 狀態 -->
          <Loading v-if="loading" message="載入資料中..." :show-spinner="true" />

          <!-- 錯誤狀態 -->
          <Alert v-else-if="error" type="error" title="載入失敗" :description="error" />

          <!-- 空資料狀態 -->
          <EmptyState
            v-else-if="paginatedData.length === 0"
            type="no-data"
            :title="emptyTitle"
            :description="emptyDescription"
          />

          <!-- 資料列表 -->
          <div v-else class="space-y-3 pb-3 border-b border-black/10">
            <div
              v-for="(item, index) in paginatedData"
              :key="index"
              class="flex items-center gap-5 py-1 hover:bg-gray-50 transition-colors rounded"
            >
              <div
                v-for="column in columns"
                :key="column.key"
                :style="{ flex: column.flex || 1 }"
                :class="[
                  'text-sm font-normal text-gray-700 tracking-[0.2px]',
                  column.showTooltip && 'truncate',
                  getAlignClass(column.align),
                ]"
                :title="column.showTooltip ? String(item[column.key]) : undefined"
              >
                {{ item[column.key] }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分頁控制（即使只有一頁也顯示） -->
      <div v-if="!loading && !error" class="flex items-center justify-between h-8 mt-auto pt-6">
        <div class="text-sm font-medium text-gray-600">
          第{{ currentPage }}頁，共{{ totalPages }}頁
        </div>

        <div class="flex gap-2">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="flex items-center justify-center w-[38px] h-8 rounded-md border transition-colors"
            :class="
              currentPage === 1
                ? 'opacity-50 cursor-not-allowed bg-[#F8F9FF] border-black/[0.08]'
                : 'bg-[#F8F9FF] border-black/[0.08] hover:bg-gray-100'
            "
          >
            <svg
              class="w-4 h-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="flex items-center justify-center w-[38px] h-8 rounded-md border transition-colors"
            :class="
              currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed bg-[#F8F9FF] border-black/[0.08]'
                : 'bg-[#F8F9FF] border-black/[0.08] hover:bg-gray-100'
            "
          >
            <svg
              class="w-4 h-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, reactive, watch } from 'vue'
import Loading from '@/components/common/loading.vue'
import Alert from '@/components/common/alert.vue'
import EmptyState from '@/components/common/empty-state.vue'
import type { CardListColumn, CardListSortState } from '@/types/overview'

// ==================== Props ====================

interface Props {
  /** 卡片標題 */
  title: string

  /** 資料陣列 */
  data: T[]

  /** 欄位定義 */
  columns: CardListColumn[]

  /** 每頁顯示筆數（預設 6） */
  pageSize?: number

  /** 卡片高度（預設 '396px'） */
  height?: string

  /** 載入狀態（預設 false） */
  loading?: boolean

  /** 錯誤訊息 */
  error?: string

  /** 空資料標題 */
  emptyTitle?: string

  /** 空資料描述 */
  emptyDescription?: string
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 6,
  height: '396px',
  loading: false,
  error: '',
  emptyTitle: '目前沒有資料',
  emptyDescription: '暫時沒有可顯示的內容',
})

// ==================== 狀態管理 ====================

/** 當前頁碼(從 1 開始) */
const currentPage = ref(1)

/** 排序狀態 */
const sortState = reactive<CardListSortState>({
  key: null,
  order: null,
})

// ==================== 計算屬性 ====================

/**
 * 總筆數
 */
const totalCount = computed(() => props.data.length)

/**
 * 計算總頁數
 */
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(totalCount.value / props.pageSize))
})

/**
 * 已排序的資料
 * 根據 sortState 進行前端排序
 */
const sortedData = computed(() => {
  // 如果沒有排序，直接返回原始資料
  if (!sortState.key || !sortState.order) {
    return props.data
  }

  // 複製陣列以避免修改原始資料
  const sorted = [...props.data]

  // 根據排序欄位和方向進行排序
  sorted.sort((a, b) => {
    const aValue = a[sortState.key as keyof T]
    const bValue = b[sortState.key as keyof T]

    // 處理 null/undefined
    if (aValue == null && bValue == null) return 0
    if (aValue == null) return sortState.order === 'asc' ? 1 : -1
    if (bValue == null) return sortState.order === 'asc' ? -1 : 1

    // 字串比較
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue, 'zh-TW')
      return sortState.order === 'asc' ? comparison : -comparison
    }

    // 數字比較
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortState.order === 'asc' ? aValue - bValue : bValue - aValue
    }

    // 其他型別轉字串比較
    const comparison = String(aValue).localeCompare(String(bValue), 'zh-TW')
    return sortState.order === 'asc' ? comparison : -comparison
  })

  return sorted
})

/**
 * 計算當前頁要顯示的資料(前端分頁)
 * 使用已排序的資料進行分頁
 */
const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * props.pageSize
  const endIndex = startIndex + props.pageSize
  return sortedData.value.slice(startIndex, endIndex)
})

// ==================== 方法 ====================

/**
 * 取得對齊方式的 CSS class
 */
function getAlignClass(align?: 'left' | 'center' | 'right'): string {
  switch (align) {
    case 'center':
      return 'text-center justify-center'
    case 'right':
      return 'text-right justify-end'
    default:
      return 'text-left justify-start'
  }
}

/**
 * 處理排序
 *
 * 邏輯:
 * 1. 如果點擊的是不同欄位，則切換到該欄位並設為升冪
 * 2. 如果點擊的是相同欄位:
 *    - 升冪 → 降冪
 *    - 降冪 → 無排序
 *    - 無排序 → 升冪
 */
function handleSort(key: string) {
  if (sortState.key !== key) {
    // 切換到新欄位，預設升冪
    sortState.key = key
    sortState.order = 'asc'
  } else {
    // 同一欄位，切換排序方向
    if (sortState.order === 'asc') {
      sortState.order = 'desc'
    } else if (sortState.order === 'desc') {
      // 降冪後取消排序
      sortState.key = null
      sortState.order = null
    } else {
      sortState.order = 'asc'
    }
  }

  // 排序後重置到第一頁
  currentPage.value = 1
}

/**
 * 上一頁
 */
function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

/**
 * 下一頁
 */
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// ==================== Watchers ====================

/**
 * 監聽資料變化，如果當前頁超過總頁數，重置到第一頁
 */
watch(
  () => props.data,
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = 1
    }
  },
)
</script>
