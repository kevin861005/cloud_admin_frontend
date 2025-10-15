<template>
  <!-- 表格容器 -->
  <div class="overflow-x-auto">
    <table class="w-full border-collapse bg-white">
      <!-- 表格標題列 -->
      <thead>
        <tr class="border-b border-gray-200 bg-gray-50">
          <th
            v-for="column in columns"
            :key="column.key"
            :style="{ width: column.width }"
            :class="[
              'px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500',
              column.align === 'center' && 'text-center',
              column.align === 'right' && 'text-right',
              column.sortable && 'cursor-pointer select-none hover:bg-gray-100',
            ]"
            @click="column.sortable ? handleSort(column.key) : undefined"
          >
            <div
              :class="[
                'flex items-center gap-1',
                column.align === 'center' && 'justify-center',
                column.align === 'right' && 'justify-end',
              ]"
            >
              <span>{{ column.label }}</span>
              <!-- 排序圖示 -->
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
          </th>
        </tr>
      </thead>

      <!-- 表格內容 -->
      <tbody>
        <!-- 載入狀態 -->
        <tr v-if="loading">
          <td :colspan="columns.length" class="px-6 py-12 text-center">
            <div class="flex items-center justify-center gap-2 text-gray-500">
              <svg
                class="h-5 w-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>載入中...</span>
            </div>
          </td>
        </tr>

        <!-- 無資料狀態 -->
        <tr v-else-if="data.length === 0">
          <td :colspan="columns.length" class="px-6 py-12 text-center text-gray-500">
            {{ emptyText }}
          </td>
        </tr>

        <!-- 資料列 -->
        <tr
          v-else
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          class="border-b border-gray-200 transition-colors hover:bg-gray-50"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            :class="[
              'px-6 py-4 text-sm',
              column.align === 'center' && 'text-center',
              column.align === 'right' && 'text-right',
            ]"
          >
            <!-- 標準顯示 -->
            <template v-if="!column.customRender">
              <span class="text-gray-900">{{ row[column.key] }}</span>
            </template>

            <!-- Badge 標籤顯示（用於狀態） -->
            <template v-else-if="column.customRender === 'badge'">
              <span
                v-if="getBadgeColor(column, row)"
                :class="[
                  'inline-flex rounded-full px-3 py-1 text-xs font-medium',
                  getBadgeColor(column, row)?.bg,
                  getBadgeColor(column, row)?.text,
                ]"
              >
                {{ row[column.key] }}
              </span>
              <span v-else class="text-gray-900">{{ row[column.key] }}</span>
            </template>

            <!-- Link 連結顯示 -->
            <template v-else-if="column.customRender === 'link'">
              <a
                :href="`https://${String(row[column.key])}`"
                :target="column.linkConfig?.target || '_blank'"
                class="text-blue-600 underline hover:text-blue-800"
              >
                {{ row[column.key] }}
                <!-- 外部連結圖示 -->
                <svg
                  v-if="column.linkConfig?.showIcon"
                  class="ml-1 inline h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </template>

            <!-- Actions 操作按鈕 -->
            <template v-else-if="column.customRender === 'actions'">
              <div class="flex items-center justify-center gap-3">
                <!-- 編輯按鈕 -->
                <button
                  class="text-gray-600 transition-colors hover:text-blue-600"
                  title="編輯"
                  @click="handleEdit(row)"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <!-- 查看按鈕 -->
                <button
                  class="text-gray-600 transition-colors hover:text-green-600"
                  title="查看"
                  @click="handleView(row)"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
            </template>

            <!-- Slot 自訂內容（階段二） -->
            <template v-else-if="column.customRender === 'slot' && column.slotName">
              <slot :name="column.slotName" :row="row" :column="column"></slot>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
// import type { ColumnConfig, SortState, SortOrder } from '@/types/table'
import type { ColumnConfig, SortState } from '@/types/table'

/**
 * Table 表格內容元件
 *
 * 功能：
 * 1. 顯示表格標題列（含排序圖示）
 * 2. 顯示資料列
 * 3. 支援多種自訂渲染方式（badge、link、actions、slot）
 * 4. 前端排序功能（點擊欄位標題）
 * 5. 載入狀態和空資料狀態
 *
 * 事件：
 * - sort-change: 排序改變時觸發，回傳 { key: string, order: 'asc' | 'desc' }
 * - row-edit: 點擊編輯按鈕時觸發，回傳該列資料
 * - row-view: 點擊查看按鈕時觸發，回傳該列資料
 */

// ===== Props 定義 =====
interface Props<T = Record<string, unknown>> {
  columns: ColumnConfig[] // 欄位配置
  data: T[] // 表格資料（已經是當前頁的資料）
  loading?: boolean // 載入狀態
  emptyText?: string // 無資料時的提示文字
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  emptyText: '暫無資料',
})

// ===== Emits 定義 =====
const emit = defineEmits<{
  'sort-change': [sortState: SortState] // 排序改變事件
  'row-edit': [row: Record<string, unknown>] // 編輯按鈕點擊事件
  'row-view': [row: Record<string, unknown>] // 查看按鈕點擊事件
}>()

// ===== 排序狀態 =====
const sortState = reactive<SortState>({
  key: null,
  order: null,
})

// ===== Helper 函數 =====

/**
 * 取得 Badge 的顏色配置
 * 解決 TypeScript 'unknown' 類型無法作為索引的問題
 */
const getBadgeColor = (column: ColumnConfig, row: Record<string, unknown>) => {
  if (!column.badgeConfig || !column.badgeConfig.colorMap) {
    return null
  }

  const value = row[column.key]
  // 將 value 轉換為 string，因為 colorMap 的 key 是 string
  const key = String(value)

  return column.badgeConfig.colorMap[key] || null
}

// ===== 事件處理 =====

/**
 * 處理排序
 * 邏輯：
 * 1. 如果點擊的是不同欄位，則切換到該欄位並設為升冪
 * 2. 如果點擊的是相同欄位：
 *    - 升冪 → 降冪
 *    - 降冪 → 無排序
 *    - 無排序 → 升冪
 */
const handleSort = (key: string) => {
  if (sortState.key !== key) {
    // 切換到新欄位，預設升冪
    sortState.key = key
    sortState.order = 'asc'
  } else {
    // 同一欄位，切換排序方向
    if (sortState.order === 'asc') {
      sortState.order = 'desc'
    } else if (sortState.order === 'desc') {
      sortState.key = null
      sortState.order = null
    } else {
      sortState.order = 'asc'
    }
  }

  // 發出排序改變事件
  emit('sort-change', { ...sortState })
}

/**
 * 處理編輯按鈕點擊
 */
const handleEdit = (row: Record<string, unknown>) => {
  emit('row-edit', row)
}

/**
 * 處理查看按鈕點擊
 */
const handleView = (row: Record<string, unknown>) => {
  emit('row-view', row)
}
</script>
