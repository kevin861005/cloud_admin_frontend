<template>
  <!-- 表格容器 -->
  <div ref="tableContainerRef" class="overflow-x-auto" @wheel="handleWheel">
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
              'px-6 py-3 typo-sm-medium text-neutral-500',
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
              <span v-if="column.sortable" class="text-neutral-400">
                <!-- 無排序狀態 -->
                <img
                  v-if="sortState.key !== (column.sortKey || column.key)"
                  src="@/assets/icons/common/cm-sort.svg"
                  alt="排序"
                  class="h-4 w-4"
                />
                <!-- 升冪排序 -->
                <img
                  v-else-if="sortState.order === 'asc'"
                  src="@/assets/icons/common/cm-arrow-up.svg"
                  alt="升冪"
                  class="h-4 w-4 icon-primary"
                />
                <!-- 降冪排序 -->
                <img
                  v-else
                  src="@/assets/icons/common/cm-arrow-down.svg"
                  alt="降冪"
                  class="h-4 w-4 icon-primary"
                />
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
              isRowSelected(row) ? 'bg-blue-50 hover:bg-blue-100' : 'hover-bg',
              enableRowClick && 'cursor-pointer', // 啟用整列點擊時顯示手指游標
            ]"
            @click="handleRowClick(row)"
          >
            <!-- Checkbox 欄位（階段三新增） -->
            <td v-if="showCheckbox" class="px-6 py-4" @click.stop>
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
                'typo-sm whitespace-nowrap px-6 py-4',
                column.align === 'left' && 'text-left',
                column.align === 'center' && 'text-center',
                column.align === 'right' && 'text-right',
              ]"
            >
              <!-- 標準顯示 -->
              <template v-if="!column.customRender">
                <span class="typo-sm text-neutral-800">{{ row[column.key] }}</span>
              </template>

              <!-- Link 連結顯示 -->
              <template v-else-if="column.customRender === 'link'">
                <a
                  :href="`https://${String(row[column.key])}`"
                  :target="column.linkConfig?.target || '_blank'"
                  class="link"
                  @click.stop
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
                <div class="inline-flex items-center gap-3" @click.stop>
                  <!-- 編輯按鈕 -->
                  <button
                    v-if="showEditButton"
                    class="btn-icon-cell"
                    title="編輯"
                    @click="handleEdit(row)"
                  >
                    <img src="@/assets/icons/common/cm-edit.svg" alt="編輯" class="icon" />
                  </button>
                  <!-- 查看按鈕 -->
                  <button class="btn-icon-cell" title="查看" @click="handleView(row)">
                    <img src="@/assets/icons/common/cm-view.svg" alt="查看" class="icon" />
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
import { ref, reactive, onMounted, watch } from 'vue'
import Loading from '@/components/common/loading.vue'
import EmptyState from '@/components/common/empty-state.vue'
import type { ColumnConfig, SortState } from '@/types/table'

// ===== Refs =====

/** 表格容器的參考 */
const tableContainerRef = ref<HTMLDivElement | null>(null)

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
  enableRowClick?: boolean // 是否啟用整列點擊（預設 false）
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
  enableRowClick: false, // 預設不啟用整列點擊
})

// ===== Emits 定義 =====
const emit = defineEmits<{
  'sort-change': [sortState: SortState] // 排序改變事件
  'row-edit': [row: Record<string, unknown>] // 編輯按鈕點擊事件
  'row-view': [row: Record<string, unknown>] // 查看按鈕點擊事件
  'toggle-all': [] // 全選/取消全選事件
  'toggle-row': [row: Record<string, unknown>] // 單行選取/取消選取事件
  'row-click': [row: Record<string, unknown>] // 整列點擊事件
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

/**
 * 【新增】處理整列點擊
 * 邏輯：
 * 1. 只有啟用 enableRowClick 時才會觸發
 * 2. 發出 row-click 事件，傳遞該行資料
 */
const handleRowClick = (row: Record<string, unknown>) => {
  if (!props.enableRowClick) return
  emit('row-click', row)
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

/**
 * 處理滑鼠滾輪事件
 * 將垂直滾動轉換為水平滾動
 */
const handleWheel = (event: WheelEvent) => {
  const container = tableContainerRef.value
  if (!container) return

  // 檢查是否需要水平滾動（內容寬度 > 容器寬度）
  const hasHorizontalScroll = container.scrollWidth > container.clientWidth

  if (hasHorizontalScroll) {
    // 阻止預設的垂直滾動
    event.preventDefault()

    // 將垂直滾動轉換為水平滾動
    container.scrollLeft += event.deltaY
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
