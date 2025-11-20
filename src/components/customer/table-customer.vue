<template>
  <data-table
    :total-count="customers.length"
    :columns="columns"
    :data="customers"
    :filters="filters"
    :show-search="showSearch"
    :show-add-button="showAddButton"
    :loading="isLoading"
    :show-checkbox="showCheckbox"
    :show-edit-button="showEditButton"
    :show-border="showBorder"
    :batch-actions="batchActions"
    :enable-row-click="true"
    title="列表"
    item-name="客戶"
    add-button-text="新增客戶"
    row-key="id"
    v-model:selected-ids="selectedIds"
    @add-click="handleAdd"
    @row-edit="handleEdit"
    @row-view="handleView"
    @row-click="handleRowClick"
    @batch-action="handleBatchAction"
  >
    <!-- 自訂狀態欄位：使用 Badge 元件 -->
    <template #statusDisplay="{ row }">
      <Badge :text="getStatusText(row)" :type="getStatusType(row)" />
    </template>

    <template #moduleDisplay="{ row }">
      <Badge :text="getModuleText(row)" :type="getModuleType(row)" />
    </template>
  </data-table>
</template>

<script setup lang="ts">
import { ref, onMounted, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import Badge from '@/components/common/badge.vue'
import DataTable from '@/components/table/data-table.vue'
import { customerService } from '@/services/customer.service'
import type { CustomerListItem } from '@/types/customer'
import type { ColumnConfig, FilterConfig, BatchActionConfig } from '@/types/table'

// ===== Props 定義 =====
interface Props {
  /** 是否顯示搜尋框（預設：true） */
  showSearch?: boolean

  /** 是否顯示新增按鈕（預設：false） */
  showAddButton?: boolean

  /** 是否顯示選取功能（預設：false） */
  showCheckbox?: boolean

  /** 是否顯示編輯按鈕（預設：true） */
  showEditButton?: boolean

  /** 是否顯示外層邊框（預設：true） */
  showBorder?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSearch: true,
  showAddButton: false,
  showCheckbox: false,
  showEditButton: true,
  showBorder: true,
})

const { showSearch, showAddButton, showCheckbox, showEditButton, showBorder } = toRefs(props)

// ===== Emits 定義 =====
const emit = defineEmits<{
  'add-click': [] // 新增按鈕點擊事件
  'row-edit': [row: Record<string, unknown>] // 編輯按鈕點擊事件
  'row-view': [row: Record<string, unknown>] // 查看按鈕點擊事件
  'batch-action': [actionKey: string, selectedRows: Record<string, unknown>[]] // 批量操作事件
}>()

// ===== 狀態管理 =====

/**
 * 載入狀態
 */
const isLoading = ref(false)

/**
 * 客戶列表資料
 */
const customers = ref<CustomerListItem[]>([])

/**
 * 選取的客戶 ID
 */
const selectedIds = ref<(string | number)[]>([])

/**
 * Router 實例
 */
const router = useRouter()

// ===== 欄位配置 =====

/**
 * 取得狀態 Badge 類型
 */
const getStatusType = (row: Record<string, unknown>): 'success' | 'error' | 'default' => {
  const status = row.status as string
  if (status === 'ACTIVE') return 'success'
  if (status === 'INACTIVE') return 'error'
  return 'default'
}

const getModuleType = (row: Record<string, unknown>): 'default' => {
  return 'default'
}

/**
 * 取得狀態顯示文字
 */
const getStatusText = (row: Record<string, unknown>): string => {
  switch (row.status) {
    case 'ACTIVE':
      return '活躍'
    case 'INACTIVE':
      return '低活躍'
    case 'UNUSED':
      return '未使用'
    default:
      return '-'
  }
}

const getModuleText = (row: Record<string, unknown>): string => {
  return row.module as string
}

/**
 * 表格欄位配置
 * 根據 showEditButton 決定操作欄位的顯示
 */
const columns = ref<ColumnConfig[]>([
  {
    key: 'name',
    label: '客戶',
    width: '180px',
    sortable: true,
  },
  {
    key: 'statusDisplay',
    label: '狀態',
    width: '120px',
    align: 'center',
    sortable: true,
    customRender: 'slot',
    slotName: 'statusDisplay',
    sortKey: 'status',
  },
  {
    key: 'lastUsed',
    label: '使用時間',
    width: '150px',
    sortable: true,
  },
  {
    key: 'module',
    label: '模組',
    width: '120px',
    align: 'center',
    sortable: true,
    customRender: 'slot',
    slotName: 'moduleDisplay',
    sortKey: 'module',
  },
  {
    key: 'sales',
    label: '負責業務',
    width: '120px',
    sortable: true,
  },
  {
    key: 'industry',
    label: '產業',
    width: '120px',
    sortable: true,
  },
  {
    key: 'link',
    label: '前台連結',
    width: '200px',
    customRender: 'link',
    linkConfig: {
      target: '_blank',
      showIcon: false,
    },
  },
  {
    key: 'actions',
    label: '操作',
    width: '100px',
    align: 'center',
    customRender: 'actions',
  },
])

// ===== 篩選器配置 =====

/**
 * 篩選器配置
 */
const filters: FilterConfig[] = [
  {
    key: 'status',
    label: '狀態:',
    options: [
      { label: '全部', value: 'all' },
      { label: '活躍', value: 'ACTIVE' },
      { label: '低活躍', value: 'INACTIVE' },
      { label: '未使用', value: 'UNUSED' },
    ],
    defaultValue: 'all',
  },
  {
    key: 'module',
    label: '模組:',
    options: [
      { label: '全部', value: 'all' },
      { label: 'Master', value: 'Master' },
      { label: 'GGF', value: 'GGF' },
    ],
    defaultValue: 'all',
  },
  {
    key: 'sales',
    label: '業務:',
    options: [
      { label: '全部', value: 'all' },
      { label: '周經理', value: '周經理' },
      { label: '林經理', value: '林經理' },
      { label: '陳經理', value: '陳經理' },
    ],
    defaultValue: 'all',
  },
]

// ===== 批量操作配置 =====

/**
 * 批量操作按鈕配置
 * 只在 showCheckbox 為 true 時有效
 */
const batchActions: BatchActionConfig[] = [
  {
    key: 'notify',
    label: '通知寄送狀態',
    type: 'notify',
    confirmMessage: '通知',
  },
  {
    key: 'delete',
    label: '環境刪除',
    type: 'delete',
    confirmMessage: '確定要刪除選中的項目嗎？此操作無法復原。',
  },
]

// ===== 載入資料 =====

/**
 * 載入客戶列表
 * 從 API 取得所有客戶資料
 *
 * 開發階段：使用 getMockCustomers() 回傳模擬資料
 * 正式環境：使用 getAllCustomers() 呼叫後端 API
 */
const loadCustomers = async () => {
  isLoading.value = true
  try {
    // TODO: 等後端 API 完成後，切換為 getAllCustomers()
    // const data = await getAllCustomers()

    // 開發階段：使用 Mock 資料
    customers.value = await customerService.getMockCustomers()
  } catch (error) {
    console.error('載入客戶列表錯誤:', error)
    // TODO: 顯示錯誤訊息給使用者
  } finally {
    isLoading.value = false
  }
}

// ===== 事件處理 =====

/**
 * 處理新增按鈕點擊
 * 發出 add-click 事件，由父元件處理
 */
const handleAdd = () => {
  emit('add-click')
}

/**
 * 處理編輯按鈕點擊
 * 發出 row-edit 事件，由父元件處理
 *
 * 注意：這裡不做型別斷言，讓父元件自行處理型別轉換
 */
const handleEdit = (row: Record<string, unknown>) => {
  emit('row-edit', row)
}

/**
 * 處理查看按鈕點擊
 * 發出 row-view 事件，由父元件處理
 */
const handleView = (row: Record<string, unknown>) => {
  emit('row-view', row)
}

/**
 * 處理批量操作
 * 發出 batch-action 事件，由父元件處理
 */
const handleBatchAction = (actionKey: string, selectedRows: Record<string, unknown>[]) => {
  emit('batch-action', actionKey, selectedRows)
}

/**
 * 處理整列點擊
 * 跳轉到客戶詳細頁面
 */
const handleRowClick = (row: Record<string, unknown>) => {
  router.push(`/customers/${row.id}/detail`)
}

// ===== 初始化 =====

/**
 * 元件掛載時自動載入資料
 */
onMounted(() => {
  loadCustomers()
})

/**
 * 對外暴露方法（供父元件呼叫）
 */
defineExpose({
  /**
   * 重新載入資料
   * 用於新增、編輯、刪除後刷新列表
   */
  refresh: loadCustomers,

  /**
   * 清空選取狀態
   */
  clearSelection: () => {
    selectedIds.value = []
  },
})
</script>
