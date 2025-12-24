<template>
  <div class="flex flex-col gap-5">
    <section class="flex flex-col gap-5">
      <div class="flex h-9 w-full items-center justify-between px-1">
        <table-header
          :title="title"
          :total-count="totalCount"
          :show-checkbox="showCheckbox"
          :selected-count="selectedIds.length"
          :batch-actions="batchActions"
          @batch-action="handleBatchAction"
          @cancel-selection="handleCancelSelection"
        />

        <div class="flex items-center gap-5">
          <div class="flex items-center gap-3">
            <table-filters
              v-if="filters && filters.length"
              v-model="filterValues"
              :filters="filters"
            />
            <table-search
              v-if="showSearch"
              v-model="searchKeyword"
              :placeholder="searchPlaceholder"
              :disabled="searchDisabled"
            />
          </div>

          <table-buttons
            :show-add-button="showAddButton"
            :add-button-text="addButtonText"
            @add-click="$emit('add-click')"
          />
        </div>
      </div>

      <!-- 選取狀態列（條件顯示） -->
      <table-selection-bar
        :show-checkbox="showCheckbox"
        :selected-count="selectedIds.length"
        :item-name="itemName"
        :batch-actions="batchActions"
        @batch-action="handleBatchAction"
        @cancel-selection="handleCancelSelection"
      />

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
        :enable-row-click="enableRowClick"
        :is-checkbox-disabled="isCheckboxDisabled"
        :checkbox-disabled-tooltip="checkboxDisabledTooltip"
        @sort-change="handleSortChange"
        @row-edit="emit('row-edit', $event)"
        @row-view="emit('row-view', $event)"
        @row-click="emit('row-click', $event)"
        @toggle-all="handleToggleAll"
        @toggle-row="handleToggleRow"
      >
        <template v-for="(_, slotName) in $slots" :key="slotName" v-slot:[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </table-content>
    </section>

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
import { ref, computed, watch } from "vue";
import TableHeader from "./table-header.vue";
import TableFilters from "./table-filters.vue";
import TableSearch from "./table-search.vue";
import TableContent from "./table-content.vue";
import TablePagination from "./table-pagination.vue";
import TableButtons from "./table-buttons.vue";
import TableSelectionBar from "./table-selection-bar.vue";

import type {
  ColumnConfig,
  FilterConfig,
  FilterValues,
  SortState,
  BatchActionConfig,
} from "@/types/table";

// ===== Props 定義 =====
interface Props {
  title: string; // 表格標題
  totalCount: number; // 原始資料總數（不含篩選）
  columns: ColumnConfig[]; // 欄位配置
  data: Record<string, unknown>[]; // 完整資料（由父元件提供）
  filters?: FilterConfig[]; // 篩選器配置（階段二新增）
  showSearch?: boolean; // 是否顯示搜尋框（階段二新增）
  searchPlaceholder?: string; // 搜尋框提示文字（階段二新增）
  showAddButton?: boolean; // 是否顯示新增按鈕
  showEditButton?: boolean; // 是否顯示編輯按鈕
  showBorder?: boolean; // 是否顯示外層邊框（預設 true）
  addButtonText?: string; // 新增按鈕文字
  loading?: boolean; // 載入狀態
  emptyText?: string; // 無資料提示文字
  pageSize?: number; // 每頁顯示筆數
  pageSizeOptions?: number[]; // 筆數選項
  itemName?: string; // 項目名稱（用於選取狀態列），預設為「項目」
  showCheckbox?: boolean; // 是否顯示勾選框（預設 false）
  selectedIds?: (string | number)[]; // 已選擇的項目 ID（v-model）
  rowKey?: string; // 資料的唯一識別欄位（預設 'id'）
  batchActions?: BatchActionConfig[]; // 批次操作按鈕配置
  enableRowClick?: boolean; // 是否啟用整列點擊（預設 false）
  isCheckboxDisabled?: (row: Record<string, unknown>) => boolean; // 判斷 checkbox 是否 disabled 的函數
  checkboxDisabledTooltip?: string | ((row: Record<string, unknown>) => string); // checkbox disabled 時的提示文字
  searchDisabled?: boolean; // 搜尋框是否停用
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => [],
  showSearch: false,
  searchPlaceholder: "搜尋...",
  showAddButton: false,
  showEditButton: true,
  showBorder: true, // 預設顯示邊框
  addButtonText: "新增",
  loading: false,
  emptyText: "暫無資料",
  pageSize: 10,
  pageSizeOptions: () => [10, 20, 50, 100],
  // 選取功能預設值
  showCheckbox: false,
  selectedIds: () => [],
  rowKey: "id",
  batchActions: () => [],
  enableRowClick: false, // 預設不啟用整列點擊
  isCheckboxDisabled: undefined,
  checkboxDisabledTooltip: "",
  searchDisabled: false,
});

// ===== Emits 定義 =====
const emit = defineEmits<{
  "add-click": []; // 新增按鈕點擊事件
  "row-edit": [row: Record<string, unknown>]; // 編輯按鈕點擊事件
  "row-view": [row: Record<string, unknown>]; // 查看按鈕點擊事件
  "update:selectedIds": [ids: (string | number)[]]; // 選取變更事件（v-model）
  "batch-action": [actionKey: string, selectedRows: Record<string, unknown>[]]; // 批量操作事件
  "row-click": [row: Record<string, unknown>]; // 整列點擊事件
}>();

// ===== 內部狀態 =====

/**
 * 當前頁碼（從 0 開始，0 = 第 1 頁）
 */
const currentPage = ref(0);

/**
 * 當前每頁顯示筆數
 */
const currentPageSize = ref(props.pageSize);

/**
 * 排序狀態
 */
const sortState = ref<SortState>({
  key: null,
  order: null,
});

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
    const initialValues: FilterValues = {};
    if (props.filters.length > 0) {
      props.filters.forEach((filter) => {
        const defaultValue = filter.defaultValue ?? filter.options[0]?.value ?? "all";
        initialValues[filter.key] = defaultValue;
      });
    }
    return initialValues;
  })()
);

/**
 * 搜尋關鍵字（階段二新增）
 */
const searchKeyword = ref("");

// ===== 計算屬性 =====

/**
 * 步驟 1：篩選器過濾後的資料
 * 邏輯：
 * 1. 遍歷所有篩選器
 * 2. 如果篩選值不是 'all'，則進行精確匹配過濾
 * 3. 所有篩選條件都滿足才保留該列
 */
const filteredByFilters = computed(() => {
  let result = props.data;

  // 遍歷每個篩選器
  for (const filter of props.filters) {
    const filterValue = filterValues.value[filter.key];

    // 如果篩選值是 'all' 或未設定，則不過濾
    if (filterValue === "all" || filterValue === undefined) {
      continue;
    }

    // 精確匹配過濾
    result = result.filter((row) => {
      return row[filter.key] === filterValue;
    });
  }

  return result;
});

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
    return filteredByFilters.value;
  }

  const keyword = searchKeyword.value.trim().toLowerCase();

  return filteredByFilters.value.filter((row) => {
    // 遍歷該列的所有欄位值
    return Object.values(row).some((value) => {
      // 將值轉為字串並轉小寫，進行模糊匹配
      const stringValue = String(value).toLowerCase();
      return stringValue.includes(keyword);
    });
  });
});

/**
 * 步驟 3：排序後的資料
 * 邏輯：
 * 1. 如果沒有排序條件，直接返回篩選後的資料
 * 2. 根據排序欄位和方向進行排序
 * 3. 支援字串、數字、布林值的排序
 * 4. 正確處理 null 和 undefined
 */
const sortedData = computed(() => {
  // 如果沒有排序條件，直接返回篩選後的資料
  if (!sortState.value.key || !sortState.value.order) {
    return filteredData.value;
  }

  const { key, order } = sortState.value;

  // 複製陣列以避免修改原始資料
  const sorted = [...filteredData.value];

  // 執行排序
  sorted.sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    // 處理 null 或 undefined（將其排到最後）
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    // 字串比較（使用 localeCompare 支援中文排序）
    if (typeof aValue === "string" && typeof bValue === "string") {
      const comparison = aValue.localeCompare(bValue, "zh-TW");
      return order === "asc" ? comparison : -comparison;
    }

    // 數字比較
    if (typeof aValue === "number" && typeof bValue === "number") {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    }

    // 布林值比較
    if (typeof aValue === "boolean" && typeof bValue === "boolean") {
      const aNum = aValue ? 1 : 0;
      const bNum = bValue ? 1 : 0;
      return order === "asc" ? aNum - bNum : bNum - aNum;
    }

    // 預設：轉為字串後比較
    const aStr = String(aValue);
    const bStr = String(bValue);
    const comparison = aStr.localeCompare(bStr, "zh-TW");
    return order === "asc" ? comparison : -comparison;
  });

  return sorted;
});

/**
 * 步驟 4：分頁後的資料（最終顯示）
 * 邏輯：
 * 1. 計算起始索引和結束索引（currentPage 從 0 開始）
 * 2. 使用 slice 切割資料
 */
const paginatedData = computed(() => {
  const start = currentPage.value * currentPageSize.value;
  const end = start + currentPageSize.value;
  return sortedData.value.slice(start, end);
});

/**
 * 過濾後的總數（用於分頁顯示）
 */
const filteredTotalCount = computed(() => filteredData.value.length);

/**
 * 總頁數
 */
const totalPages = computed(() => {
  return Math.ceil(filteredTotalCount.value / currentPageSize.value);
});

/**
 * 當前頁的起始索引（從 0 開始，用於內部計算）
 * 例如：第 1 頁（currentPage=0）的 startIndex = 0
 */
const startIndex = computed(() => {
  if (filteredTotalCount.value === 0) return 0;
  return currentPage.value * currentPageSize.value;
});

/**
 * 當前頁的結束索引（用於內部計算）
 * 例如：第 1 頁（currentPage=0，pageSize=10）的 endIndex = 10
 */
const endIndex = computed(() => {
  if (filteredTotalCount.value === 0) return 0;
  const end = (currentPage.value + 1) * currentPageSize.value;
  return Math.min(end, filteredTotalCount.value);
});

// ===== 選取功能計算屬性 =====

/**
 * 取得當前頁可選取的項目（排除 disabled 的項目）
 */
const selectablePageData = computed(() => {
  if (!props.isCheckboxDisabled) {
    return paginatedData.value;
  }
  return paginatedData.value.filter((row) => !props.isCheckboxDisabled?.(row));
});

/**
 * 當前頁是否全選
 * 邏輯：當前頁所有項目的 ID 都在 selectedIds 中
 */
const isCurrentPageAllSelected = computed(() => {
  if (!props.showCheckbox || selectablePageData.value.length === 0) {
    return false;
  }

  return selectablePageData.value.every((row) => {
    const id = row[props.rowKey] as string | number;
    return props.selectedIds?.includes(id);
  });
});

/**
 * 是否為半選狀態（部分選中）
 * 邏輯：當前頁有部分項目被選中，但不是全部
 */
const isIndeterminate = computed(() => {
  if (!props.showCheckbox || selectablePageData.value.length === 0) {
    return false;
  }

  const selectedCount = selectablePageData.value.filter((row) => {
    const id = row[props.rowKey] as string | number;
    return props.selectedIds?.includes(id);
  }).length;

  return selectedCount > 0 && selectedCount < selectablePageData.value.length;
});

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
      searchKeyword.value = ""; // 清空搜尋
      currentPage.value = 0; // 回到第一頁（從 0 開始）
    }
  },
  { deep: true, flush: "post" }
);

/**
 * 監聽搜尋關鍵字變化
 * 邏輯：
 * 1. 回到第一頁（保留篩選器條件）
 */
watch(searchKeyword, (newVal, oldVal) => {
  // 只有在真正改變時才回到第一頁（避免初始化時觸發）
  if (oldVal !== undefined && newVal !== oldVal) {
    currentPage.value = 0; // 回到第一頁（從 0 開始）
  }
});

/**
 * 監聽過濾後的資料總數變化
 * 邏輯：
 * 1. 確保當前頁碼不超出範圍
 * 2. 如果超出範圍，則跳到最後一頁（或第一頁）
 */
watch(filteredTotalCount, (newTotal) => {
  // 如果沒有資料，回到第一頁
  if (newTotal === 0) {
    currentPage.value = 0; // 從 0 開始
    return;
  }

  // 計算最大頁數（頁數索引從 0 開始，所以最大索引 = 頁數 - 1）
  const maxPageIndex = Math.ceil(newTotal / currentPageSize.value) - 1;

  // 如果當前頁碼超出範圍，跳到最後一頁
  if (currentPage.value > maxPageIndex) {
    currentPage.value = maxPageIndex;
  }
});

// ===== 事件處理 =====

/**
 * 處理排序變化
 * 邏輯：
 * 1. 更新排序狀態
 * 2. 回到第一頁（從 0 開始）
 * 3. 輸出 debug 訊息
 */
const handleSortChange = (newSortState: SortState) => {
  sortState.value = newSortState;
  currentPage.value = 0; // 回到第一頁（從 0 開始）

  console.log("排序狀態更新:", sortState.value);
  console.log("排序後資料筆數:", sortedData.value.length);
};

/**
 * 處理頁碼變化
 * 邏輯：
 * 1. 直接更新當前頁碼（已經從 table-pagination 傳來正確的值）
 * 2. table-pagination 已經處理了邊界檢查
 */
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

/**
 * 處理每頁筆數變化
 * 邏輯：
 * 1. 更新每頁筆數
 * 2. 回到第一頁（從 0 開始）
 */
const handlePageSizeChange = (size: number) => {
  currentPageSize.value = size;
  currentPage.value = 0; // 回到第一頁（從 0 開始）
};

// ===== 選取功能事件處理（階段三）=====

/**
 * 處理全選/取消全選當前頁
 * 邏輯：
 * 1. 如果當前頁全選，則取消選中當前頁所有項目
 * 2. 如果當前頁未全選，則選中當前頁所有項目
 * 3. 跨頁選取狀態會保留
 */
const handleToggleAll = () => {
  if (!props.selectedIds) return;

  // 只取得可選取的項目 ID
  const selectableIds = selectablePageData.value.map((row) => row[props.rowKey] as string | number);

  // 如果沒有可選取的項目，不做任何事
  if (selectableIds.length === 0) return;

  let newSelectedIds: (string | number)[];

  if (isCurrentPageAllSelected.value) {
    // 取消選中當前頁所有可選取的項目
    newSelectedIds = props.selectedIds.filter((id) => !selectableIds.includes(id));
  } else {
    // 選中當前頁所有可選取的項目
    const otherPageIds = props.selectedIds.filter((id) => !selectableIds.includes(id));
    newSelectedIds = [...otherPageIds, ...selectableIds];
  }

  emit("update:selectedIds", newSelectedIds);
};

/**
 * 處理單行選取/取消選取
 * 邏輯：
 * 1. 如果該行已選中，則取消選中
 * 2. 如果該行未選中，則選中
 * 3. 跨頁選取狀態會保留
 */
const handleToggleRow = (row: Record<string, unknown>) => {
  if (!props.selectedIds) return;

  const id = row[props.rowKey] as string | number;
  const isSelected = props.selectedIds.includes(id);

  let newSelectedIds: (string | number)[];

  if (isSelected) {
    // 取消選中
    newSelectedIds = props.selectedIds.filter((selectedId) => selectedId !== id);
  } else {
    // 選中
    newSelectedIds = [...props.selectedIds, id];
  }

  emit("update:selectedIds", newSelectedIds);
};

/**
 * 處理取消所有選擇
 * 邏輯：清空所有選取狀態（包含跨頁）
 */
const handleCancelSelection = () => {
  emit("update:selectedIds", []);
};

/**
 * 處理批量操作
 * 邏輯：
 * 1. 根據 selectedIds 從完整資料中找到對應的行資料
 * 2. 發出 batch-action 事件，傳遞操作 key 和選中的行資料
 */
const handleBatchAction = (actionKey: string) => {
  if (!props.selectedIds || props.selectedIds.length === 0) return;

  // 從完整資料中找到選中的行
  const selectedRows = props.data.filter((row) => {
    const id = row[props.rowKey] as string | number;
    return props.selectedIds?.includes(id);
  });

  emit("batch-action", actionKey, selectedRows);
};
</script>
