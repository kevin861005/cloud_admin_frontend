<template>
  <!-- 表格容器 -->
  <div class="overflow-x-auto">
    <table class="w-full border-collapse bg-white">
      <!-- 表格標題列 -->
      <thead>
        <tr class="border-b border-gray-200">
          <!-- Checkbox 欄位（階段三新增） -->
          <th v-if="showCheckbox" class="w-12 px-6 py-3">
            <div class="flex items-center justify-center">
              <input
                type="checkbox"
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                class="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                @change="handleToggleAll"
              />
            </div>
          </th>

          <!-- 原始欄位 -->
          <th
            v-for="column in columns"
            :key="column.key"
            :style="{ width: column.width }"
            :class="[
              'px-6 py-3 text-sm font-medium leading-5 tracking-normal text-gray-500',
              column.align === 'center' && 'text-center',
              column.align === 'right' && 'text-right',
              column.sortable && 'cursor-pointer select-none hover:bg-gray-100',
            ]"
            @click="column.sortable ? handleSort(column.key, column.sortKey) : undefined"
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
                  v-if="sortState.key !== (column.sortKey || column.key)"
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
          <td :colspan="showCheckbox ? columns.length + 1 : columns.length" class="px-6 py-12">
            <Loading message="載入資料中..." />
          </td>
        </tr>

        <!-- 無資料狀態 -->
        <tr v-else-if="data.length === 0">
          <td :colspan="showCheckbox ? columns.length + 1 : columns.length" class="px-6 py-12">
            <EmptyState type="no-data" title="暫無資料" :description="emptyText" />
          </td>
        </tr>

        <!-- 資料列 -->
        <template v-else>
          <tr
            v-for="(row, rowIndex) in data"
            :key="rowIndex"
            :class="[
              'last:border-b last:border-gray-200 transition-colors',
              isRowSelected(row) ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50',
            ]"
          >
            <!-- Checkbox 欄位（階段三新增） -->
            <td v-if="showCheckbox" class="px-6 py-4">
              <div class="flex items-center justify-center">
                <input
                  type="checkbox"
                  :checked="isRowSelected(row)"
                  class="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  @change="handleToggleRow(row)"
                />
              </div>
            </td>

            <!-- 原始資料欄位 -->
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-6 py-4 text-sm font-normal leading-[22px] tracking-[0.2px]',
                column.align === 'center' && 'text-center',
                column.align === 'right' && 'text-right',
              ]"
            >
              <!-- 標準顯示 -->
              <template v-if="!column.customRender">
                <span class="text-sm font-normal tracking-[0.2px] text-gray-800">{{
                  row[column.key]
                }}</span>
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
                <div
                  :class="[
                    'flex items-center gap-3',
                    column.align === 'center' && 'justify-center',
                    column.align === 'right' && 'justify-end',
                    !column.align && 'justify-center',
                  ]"
                >
                  <!-- 編輯按鈕 -->
                  <button
                    v-if="showEditButton"
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
                <div
                  :class="[
                    'flex',
                    column.align === 'center' && 'justify-center',
                    column.align === 'right' && 'justify-end',
                    column.align === 'left' && 'justify-start',
                    !column.align && 'justify-start',
                  ]"
                >
                  <slot :name="column.slotName" :row="row" :column="column"></slot>
                </div>
              </template>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue'
import Loading from '@/components/common/loading.vue'
import EmptyState from '@/components/common/empty-state.vue'
import type { ColumnConfig, SortState } from '@/types/table'

/**
 * Table 表格內容元件（階段三：整合選取功能）
 *
 * 功能：
 * 1. 顯示表格標題列（含排序圖示）
 * 2. 顯示資料列
 * 3. 支援多種自訂渲染方式（badge、link、actions、slot）
 * 4. 前端排序功能（點擊欄位標題）
 * 5. 載入狀態和空資料狀態
 * 6. Checkbox 選取功能（單選、全選）
 * 7. 選中行的視覺回饋（藍色背景）
 *
 * 事件：
 * - sort-change: 排序改變時觸發，回傳 { key: string, order: 'asc' | 'desc' }
 * - row-edit: 點擊編輯按鈕時觸發，回傳該列資料
 * - row-view: 點擊查看按鈕時觸發，回傳該列資料
 * - toggle-all: 全選/取消全選時觸發
 * - toggle-row: 單行選取/取消選取時觸發，回傳該列資料
 */

// ===== Props 定義 =====
interface Props<T = Record<string, unknown>> {
  columns: ColumnConfig[] // 欄位配置
  data: T[] // 表格資料（已經是當前頁的資料）
  loading?: boolean // 載入狀態
  emptyText?: string // 無資料時的提示文字
  // ===== 選取功能（階段三）=====
  showCheckbox?: boolean // 是否顯示 Checkbox（預設 false）
  showEditButton?: boolean // 是否顯示編輯按鈕（預設 true)
  selectedIds?: (string | number)[] // 已選擇的項目 ID（預設 []）
  rowKey?: string // 資料的唯一識別欄位（預設 'id'）
  isAllSelected?: boolean // 當前頁是否全選（預設 false）
  isIndeterminate?: boolean // 是否為半選狀態（預設 false）
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  emptyText: '暫無資料',
  showCheckbox: false,
  showEditButton: true,
  selectedIds: () => [],
  rowKey: 'id',
  isAllSelected: false,
  isIndeterminate: false,
})

// ===== Emits 定義 =====
const emit = defineEmits<{
  'sort-change': [sortState: SortState] // 排序改變事件
  'row-edit': [row: Record<string, unknown>] // 編輯按鈕點擊事件
  'row-view': [row: Record<string, unknown>] // 查看按鈕點擊事件
  'toggle-all': [] // 全選/取消全選事件
  'toggle-row': [row: Record<string, unknown>] // 單行選取/取消選取事件
}>()

// ===== 排序狀態 =====
const sortState = reactive<SortState>({
  key: null,
  order: null,
})

// ===== Helper 函數 =====

/**
 * 判斷該行是否被選中
 */
const isRowSelected = (row: Record<string, unknown>): boolean => {
  if (!props.showCheckbox) return false
  const id = row[props.rowKey] as string | number
  return props.selectedIds?.includes(id) || false
}

// ===== 事件處理 =====

/**
 * 處理排序
 * 支援 sortKey：當欄位有 sortKey 時，使用 sortKey 進行排序
 */
const handleSort = (key: string, sortKey?: string) => {
  // 使用 sortKey（如果有提供）或 key 作為排序依據
  const actualSortKey = sortKey || key

  if (sortState.key !== actualSortKey) {
    // 切換到新欄位，預設升冪
    sortState.key = actualSortKey
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

/**
 * 處理全選/取消全選
 */
const handleToggleAll = () => {
  emit('toggle-all')
}

/**
 * 處理單行選取/取消選取
 */
const handleToggleRow = (row: Record<string, unknown>) => {
  emit('toggle-row', row)
}

// ===== Checkbox 半選狀態處理 =====

/**
 * 在元件掛載後和 props 變化時，更新 checkbox 的半選狀態
 * 原因：indeterminate 是 DOM 屬性，不能透過 Vue 的屬性綁定設定
 */
const updateCheckboxIndeterminate = () => {
  if (!props.showCheckbox) return

  // 找到全選 checkbox
  const checkbox = document.querySelector('thead input[type="checkbox"]') as HTMLInputElement
  if (checkbox) {
    checkbox.indeterminate = props.isIndeterminate
  }
}

onMounted(() => {
  updateCheckboxIndeterminate()
})

watch(
  () => props.isIndeterminate,
  () => {
    updateCheckboxIndeterminate()
  },
)
</script>
