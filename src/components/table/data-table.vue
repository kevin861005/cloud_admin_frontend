<!-- <template>
  <div :class="['bg-white', showBorder ? 'rounded-lg border border-gray-200 shadow-sm' : '']">

    <table-header
      :title="title"
      :total-count="filteredTotalCount"
      :show-add-button="showAddButton"
      :add-button-text="addButtonText"
      :show-checkbox="showCheckbox"
      :show-edit-button="showEditButton"
      :selected-count="selectedIds?.length || 0"
      :batch-actions="batchActions"
      @add-click="emit('add-click')"
      @batch-action="handleBatchAction"
      @cancel-selection="handleCancelSelection"
    />


    <div
      v-if="filters.length > 0 || showSearch"
      class="border-b border-gray-200 bg-gray-50 px-6 py-4"
    >
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <table-filters
          v-if="filters.length > 0"
          v-model="filterValues"
          :filters="filters"
          class="flex-1"
        />

        <div v-else class="flex-1"></div>

        <table-search
          v-if="showSearch"
          v-model="searchKeyword"
          :placeholder="searchPlaceholder"
          class="w-full md:w-80"
        />
      </div>
    </div>

    <table-content
      :columns="columns"
      :data="paginatedData"
      :show-edit-button="showEditButton"
      :loading="loading"
      :empty-text="emptyText"
      :show-checkbox="showCheckbox"
      :selected-ids="selectedIds || []"
      :row-key="rowKey"
      :is-all-selected="isCurrentPageAllSelected"
      :is-indeterminate="isIndeterminate"
      @sort-change="handleSortChange"
      @row-edit="emit('row-edit', $event)"
      @row-view="emit('row-view', $event)"
      @toggle-all="handleToggleAll"
      @toggle-row="handleToggleRow"
    >
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>
    </table-content>

    <table-pagination
      :current-page="currentPage"
      :page-size="currentPageSize"
      :total-pages="totalPages"
      :total-elements="filteredTotalCount"
      :start-index="startIndex"
      :end-index="endIndex"
      :page-size-options="pageSizeOptions"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    />
  </div>
</template> -->
<template>
  <!-- DataTable：兩大區塊，TABLE（含 TOP + TABLE） + Pagination；區塊間距 20px -->
  <div class="flex flex-col gap-5">

    <!-- TABLE 區（TOP + TABLE 本體），內部區塊間距 20px -->
    <section class="flex flex-col gap-5">

      <!-- TOP 區：左側 Header，右側 Filters + Search -->
      <div class="flex h-9 w-full items-center justify-between">
        <!-- 左：標題 + 總數/批次操作（保持你原本的綁定） -->
        <table-header
          :title="title"
          :total-count="totalCount"
          :show-add-button="showAddButton"
          :add-button-text="addButtonText"
          :show-checkbox="showCheckbox"
          :selected-count="selectedIds.length"
          :batch-actions="batchActions"
          @add-click="$emit('add-click')"
          @batch-action="handleBatchAction"
          @cancel-selection="handleCancelSelection"
        />

        <!-- 右：篩選 + 搜尋（保持你原本的綁定） -->
        <div class="flex flex-wrap items-center gap-3">
          <table-filters
            v-if="filters && filters.length"
            v-model="filterValues"
            :filters="filters"
          />
          <table-search
            v-if="showSearch"
            v-model="searchKeyword"
            :placeholder="searchPlaceholder"
          />
        </div>
      </div>

      <!-- TABLE 本體（標題列 + 內容列），保持你原本的 props/slots/emit -->
      <table-content
        :columns="columns"
        :data="paginatedData"
        :loading="loading"
        :empty-text="emptyText"
        :show-checkbox="showCheckbox"
        :show-edit-button="showEditButton"
        :selected-ids="selectedIds"
        :row-key="rowKey"
        :is-all-selected="isCurrentPageAllSelected"
        :is-indeterminate="isIndeterminate"
        @sort-change="handleSortChange"
        @row-edit="emit('row-edit', $event)"
        @row-view="emit('row-view', $event)"
        @toggle-all="handleToggleAll"
        @toggle-row="handleToggleRow"
      >
        <!-- 透明轉發所有自訂 slots（保持你原本已有的寫法） -->
        <template
          v-for="(_, slotName) in $slots"
          :key="slotName"
          v-slot:[slotName]="slotProps"
        >
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </table-content>
    </section>

    <!-- Pagination 區（獨立在 TABLE 區下方），與上方保持 20px 間距 -->
    <table-pagination
      :current-page="currentPage"
      :page-size="currentPageSize"
      :total-pages="totalPages"
      :total-elements="filteredTotalCount"
      :start-index="startIndex"
      :end-index="endIndex"
      :page-size-options="pageSizeOptions"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import TableHeader from './table-header.vue'
import TableFilters from './table-filters.vue'
import TableSearch from './table-search.vue'
import TableContent from './table-content.vue'
import TablePagination from './table-pagination.vue'
import type {
  ColumnConfig,
  FilterConfig,
  FilterValues,
  SortState,
  BatchActionConfig,
} from '@/types/table'

/**
 * Data Table 主容器元件（階段三：整合選取功能）
 *
 * 資料流程：
 * 原始資料 (props.data)
 *   ↓
 * 篩選器過濾 (filteredByFilters)
 *   ↓
 * 搜尋框過濾 (filteredData)
 *   ↓
 * 排序處理 (sortedData)
 *   ↓
 * 分頁處理 (paginatedData)
 *   ↓
 * 最終顯示
 *
 * 互動邏輯：
 * - 改變篩選器 → 清空搜尋框 + 立即重新篩選 + 回到第一頁
 * - 輸入搜尋 → 保留篩選器條件 + 立即搜尋 + 回到第一頁
 * - 選取功能 → 支援跨頁選取 + 全選當前頁 + 批量操作
 */

// ===== Props 定義 =====
interface Props {
  title: string // 表格標題
  totalCount: number // 原始資料總數（不含篩選）
  columns: ColumnConfig[] // 欄位配置
  data: Record<string, unknown>[] // 完整資料（由父元件提供）
  filters?: FilterConfig[] // 篩選器配置（階段二新增）
  showSearch?: boolean // 是否顯示搜尋框（階段二新增）
  searchPlaceholder?: string // 搜尋框提示文字（階段二新增）
  showAddButton?: boolean // 是否顯示新增按鈕
  showEditButton?: boolean // 是否顯示編輯按鈕
  showBorder?: boolean // 是否顯示外層邊框（預設 true）
  addButtonText?: string // 新增按鈕文字
  loading?: boolean // 載入狀態
  emptyText?: string // 無資料提示文字
  pageSize?: number // 每頁顯示筆數
  pageSizeOptions?: number[] // 筆數選項
  // ===== 選取功能（階段三）=====
  showCheckbox?: boolean // 是否顯示勾選框（預設 false）
  selectedIds?: (string | number)[] // 已選擇的項目 ID（v-model）
  rowKey?: string // 資料的唯一識別欄位（預設 'id'）
  batchActions?: BatchActionConfig[] // 批次操作按鈕配置
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => [],
  showSearch: false,
  searchPlaceholder: '搜尋...',
  showAddButton: false,
  showEditButton: true,
  showBorder: true, // 預設顯示邊框
  addButtonText: '新增',
  loading: false,
  emptyText: '暫無資料',
  pageSize: 10,
  pageSizeOptions: () => [10, 20, 50, 100],
  // 選取功能預設值
  showCheckbox: false,
  selectedIds: () => [],
  rowKey: 'id',
  batchActions: () => [],
})

// ===== Emits 定義 =====
const emit = defineEmits<{
  'add-click': [] // 新增按鈕點擊事件
  'row-edit': [row: Record<string, unknown>] // 編輯按鈕點擊事件
  'row-view': [row: Record<string, unknown>] // 查看按鈕點擊事件
  'update:selectedIds': [ids: (string | number)[]] // 選取變更事件（v-model）
  'batch-action': [actionKey: string, selectedRows: Record<string, unknown>[]] // 批量操作事件
}>()

// ===== 內部狀態 =====

/**
 * 當前頁碼（從 0 開始，0 = 第 1 頁）
 */
const currentPage = ref(0)

/**
 * 當前每頁顯示筆數
 */
const currentPageSize = ref(props.pageSize)

/**
 * 排序狀態
 */
const sortState = ref<SortState>({
  key: null,
  order: null,
})

/**
 * 篩選器值（階段二新增）
 * 例如：{ status: 'active', module: 'Master' }
 *
 * 初始化邏輯：
 * 1. 建立初始 filterValues 物件
 * 2. 遍歷每個篩選器，設定其預設值
 * 3. 使用立即執行函數，避免觸發 watch
 */
const filterValues = ref<FilterValues>(
  (() => {
    const initialValues: FilterValues = {}
    if (props.filters.length > 0) {
      props.filters.forEach((filter) => {
        const defaultValue = filter.defaultValue ?? filter.options[0]?.value ?? 'all'
        initialValues[filter.key] = defaultValue
      })
    }
    return initialValues
  })(),
)

/**
 * 搜尋關鍵字（階段二新增）
 */
const searchKeyword = ref('')

// ===== 計算屬性 =====

/**
 * 步驟 1：篩選器過濾後的資料
 * 邏輯：
 * 1. 遍歷所有篩選器
 * 2. 如果篩選值不是 'all'，則進行精確匹配過濾
 * 3. 所有篩選條件都滿足才保留該列
 */
const filteredByFilters = computed(() => {
  let result = props.data

  // 遍歷每個篩選器
  for (const filter of props.filters) {
    const filterValue = filterValues.value[filter.key]

    // 如果篩選值是 'all' 或未設定，則不過濾
    if (filterValue === 'all' || filterValue === undefined) {
      continue
    }

    // 精確匹配過濾
    result = result.filter((row) => {
      return row[filter.key] === filterValue
    })
  }

  return result
})

/**
 * 步驟 2：搜尋框過濾後的資料
 * 邏輯：
 * 1. 在篩選後的資料中進行模糊搜尋
 * 2. 搜尋所有欄位的值（轉為字串後比對）
 * 3. 至少有一個欄位符合就保留該列
 */
const filteredData = computed(() => {
  // 如果沒有搜尋關鍵字，直接返回篩選後的資料
  if (!searchKeyword.value.trim()) {
    return filteredByFilters.value
  }

  const keyword = searchKeyword.value.trim().toLowerCase()

  return filteredByFilters.value.filter((row) => {
    // 遍歷該列的所有欄位值
    return Object.values(row).some((value) => {
      // 將值轉為字串並轉小寫，進行模糊匹配
      const stringValue = String(value).toLowerCase()
      return stringValue.includes(keyword)
    })
  })
})

/**
 * 步驟 3：排序後的資料
 * 邏輯：
 * 1. 如果沒有排序條件，直接返回篩選後的資料
 * 2. 根據排序欄位和方向進行排序
 */
const sortedData = computed(() => {
  if (!sortState.value.key || !sortState.value.order) {
    return filteredData.value
  }

  const { key, order } = sortState.value

  return [...filteredData.value].sort((a, b) => {
    const aValue = a[key]
    const bValue = b[key]

    // 處理 null 或 undefined
    if (aValue == null && bValue == null) return 0
    if (aValue == null) return 1
    if (bValue == null) return -1

    // 比較值
    if (aValue < bValue) return order === 'asc' ? -1 : 1
    if (aValue > bValue) return order === 'asc' ? 1 : -1
    return 0
  })
})

/**
 * 步驟 4：分頁後的資料（最終顯示）
 * 邏輯：
 * 1. 計算起始索引和結束索引（currentPage 從 0 開始）
 * 2. 使用 slice 切割資料
 */
const paginatedData = computed(() => {
  const start = currentPage.value * currentPageSize.value
  const end = start + currentPageSize.value
  return sortedData.value.slice(start, end)
})

/**
 * 過濾後的總數（用於分頁顯示）
 */
const filteredTotalCount = computed(() => filteredData.value.length)

/**
 * 總頁數
 */
const totalPages = computed(() => {
  return Math.ceil(filteredTotalCount.value / currentPageSize.value)
})

/**
 * 當前頁的起始索引（從 0 開始，用於內部計算）
 * 例如：第 1 頁（currentPage=0）的 startIndex = 0
 */
const startIndex = computed(() => {
  if (filteredTotalCount.value === 0) return 0
  return currentPage.value * currentPageSize.value
})

/**
 * 當前頁的結束索引（用於內部計算）
 * 例如：第 1 頁（currentPage=0，pageSize=10）的 endIndex = 10
 */
const endIndex = computed(() => {
  if (filteredTotalCount.value === 0) return 0
  const end = (currentPage.value + 1) * currentPageSize.value
  return Math.min(end, filteredTotalCount.value)
})

// ===== 選取功能計算屬性（階段三）=====

/**
 * 當前頁是否全選
 * 邏輯：當前頁所有項目的 ID 都在 selectedIds 中
 */
const isCurrentPageAllSelected = computed(() => {
  if (!props.showCheckbox || paginatedData.value.length === 0) {
    return false
  }

  return paginatedData.value.every((row) => {
    const id = row[props.rowKey] as string | number
    return props.selectedIds?.includes(id)
  })
})

/**
 * 是否為半選狀態（部分選中）
 * 邏輯：當前頁有部分項目被選中，但不是全部
 */
const isIndeterminate = computed(() => {
  if (!props.showCheckbox || paginatedData.value.length === 0) {
    return false
  }

  const selectedCount = paginatedData.value.filter((row) => {
    const id = row[props.rowKey] as string | number
    return props.selectedIds?.includes(id)
  }).length

  return selectedCount > 0 && selectedCount < paginatedData.value.length
})

// ===== 監聽器 =====

/**
 * 監聽篩選器變化
 * 邏輯：
 * 1. 清空搜尋框
 * 2. 回到第一頁
 *
 * 注意：使用 flush: 'post' 確保在 DOM 更新後執行
 */
watch(
  filterValues,
  (newVal, oldVal) => {
    // 避免初始化時觸發（oldVal 為 undefined 表示是初始化）
    if (oldVal !== undefined) {
      searchKeyword.value = '' // 清空搜尋
      currentPage.value = 0 // 回到第一頁（從 0 開始）
    }
  },
  { deep: true, flush: 'post' },
)

/**
 * 監聽搜尋關鍵字變化
 * 邏輯：
 * 1. 回到第一頁（保留篩選器條件）
 */
watch(searchKeyword, (newVal, oldVal) => {
  // 只有在真正改變時才回到第一頁（避免初始化時觸發）
  if (oldVal !== undefined && newVal !== oldVal) {
    currentPage.value = 0 // 回到第一頁（從 0 開始）
  }
})

/**
 * 監聽過濾後的資料總數變化
 * 邏輯：
 * 1. 確保當前頁碼不超出範圍
 * 2. 如果超出範圍，則跳到最後一頁（或第一頁）
 */
watch(filteredTotalCount, (newTotal) => {
  // 如果沒有資料，回到第一頁
  if (newTotal === 0) {
    currentPage.value = 0 // 從 0 開始
    return
  }

  // 計算最大頁數（頁數索引從 0 開始，所以最大索引 = 頁數 - 1）
  const maxPageIndex = Math.ceil(newTotal / currentPageSize.value) - 1

  // 如果當前頁碼超出範圍，跳到最後一頁
  if (currentPage.value > maxPageIndex) {
    currentPage.value = maxPageIndex
  }
})

// ===== 事件處理 =====

/**
 * 處理排序變化
 * 邏輯：
 * 1. 更新排序狀態
 * 2. 回到第一頁（從 0 開始）
 */
const handleSortChange = (newSortState: SortState) => {
  sortState.value = newSortState
  currentPage.value = 0 // 回到第一頁（從 0 開始）
}

/**
 * 處理頁碼變化
 * 邏輯：
 * 1. 直接更新當前頁碼（已經從 table-pagination 傳來正確的值）
 * 2. table-pagination 已經處理了邊界檢查
 */
const handlePageChange = (page: number) => {
  currentPage.value = page
}

/**
 * 處理每頁筆數變化
 * 邏輯：
 * 1. 更新每頁筆數
 * 2. 回到第一頁（從 0 開始）
 */
const handlePageSizeChange = (size: number) => {
  currentPageSize.value = size
  currentPage.value = 0 // 回到第一頁（從 0 開始）
}

// ===== 選取功能事件處理（階段三）=====

/**
 * 處理全選/取消全選當前頁
 * 邏輯：
 * 1. 如果當前頁全選，則取消選中當前頁所有項目
 * 2. 如果當前頁未全選，則選中當前頁所有項目
 * 3. 跨頁選取狀態會保留
 */
const handleToggleAll = () => {
  if (!props.selectedIds) return

  const currentPageIds = paginatedData.value.map((row) => row[props.rowKey] as string | number)

  let newSelectedIds: (string | number)[]

  if (isCurrentPageAllSelected.value) {
    // 取消選中當前頁所有項目
    newSelectedIds = props.selectedIds.filter((id) => !currentPageIds.includes(id))
  } else {
    // 選中當前頁所有項目
    // 先移除當前頁已選中的項目，避免重複
    const otherPageIds = props.selectedIds.filter((id) => !currentPageIds.includes(id))
    newSelectedIds = [...otherPageIds, ...currentPageIds]
  }

  emit('update:selectedIds', newSelectedIds)
}

/**
 * 處理單行選取/取消選取
 * 邏輯：
 * 1. 如果該行已選中，則取消選中
 * 2. 如果該行未選中，則選中
 * 3. 跨頁選取狀態會保留
 */
const handleToggleRow = (row: Record<string, unknown>) => {
  if (!props.selectedIds) return

  const id = row[props.rowKey] as string | number
  const isSelected = props.selectedIds.includes(id)

  let newSelectedIds: (string | number)[]

  if (isSelected) {
    // 取消選中
    newSelectedIds = props.selectedIds.filter((selectedId) => selectedId !== id)
  } else {
    // 選中
    newSelectedIds = [...props.selectedIds, id]
  }

  emit('update:selectedIds', newSelectedIds)
}

/**
 * 處理取消所有選擇
 * 邏輯：清空所有選取狀態（包含跨頁）
 */
const handleCancelSelection = () => {
  emit('update:selectedIds', [])
}

/**
 * 處理批量操作
 * 邏輯：
 * 1. 根據 selectedIds 從完整資料中找到對應的行資料
 * 2. 發出 batch-action 事件，傳遞操作 key 和選中的行資料
 */
const handleBatchAction = (actionKey: string) => {
  if (!props.selectedIds || props.selectedIds.length === 0) return

  // 從完整資料中找到選中的行
  const selectedRows = props.data.filter((row) => {
    const id = row[props.rowKey] as string | number
    return props.selectedIds?.includes(id)
  })

  emit('batch-action', actionKey, selectedRows)
}
</script>
