<template>
  <data-table
    :total-count="environments.length"
    :columns="columns"
    :data="environments"
    :filters="filters"
    :show-search="true"
    :show-add-button="false"
    :loading="isLoading"
    :show-checkbox="true"
    :show-edit-button="false"
    :show-border="true"
    :batch-actions="batchActions"
    title="列表"
    item-name="環境"
    row-key="id"
    v-model:selected-ids="selectedIds"
    @row-view="handleView"
    @batch-action="handleBatchAction"
  >
    <!-- 自訂狀態欄位：使用 Badge 元件 -->
    <template #statusDisplay="{ row }">
      <Badge :text="getStatusText(row)" :type="getStatusType(row)" />
    </template>
  </data-table>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Badge from '@/components/common/badge.vue'
import DataTable from '@/components/table/data-table.vue'
import { environmentService } from '@/services/environment.service'
import type { EnvironmentListItem } from '@/types/environment'
import type { ColumnConfig, FilterConfig, BatchActionConfig } from '@/types/table'

// ===== Emits 定義 =====
const emit = defineEmits<{
  'row-view': [row: Record<string, unknown>] // 查看詳情事件
  'batch-action': [actionKey: string, selectedRows: Record<string, unknown>[]] // 批量操作事件
}>()

// ===== 狀態管理 =====

/**
 * 載入狀態
 */
const isLoading = ref(false)

/**
 * 環境列表資料（原始）
 */
const originEnvironments = ref<EnvironmentListItem[]>([])

/**
 * 選取的環境 ID
 */
const selectedIds = ref<(string | number)[]>([])

// ===== 欄位配置 =====

/**
 * 取得狀態 Badge 類型
 */
const getStatusType = (row: Record<string, unknown>): 'success' | 'error' | 'default' => {
  const status = row.status as string
  if (status === 'NOTIFIED') return 'success'
  if (status === 'TO_BE_DELETED') return 'error'
  return 'default' // PENDING
}

/**
 * 取得狀態顯示文字
 */
const getStatusText = (row: Record<string, unknown>): string => {
  switch (row.status) {
    case 'PENDING':
      return '申請中'
    case 'NOTIFIED':
      return '已通知'
    case 'TO_BE_DELETED':
      return '待刪除'
    default:
      return '-'
  }
}

/**
 * 處理後的環境列表（空日期顯示為 "-"）
 */
const environments = computed(() => {
  return originEnvironments.value.map((env) => ({
    ...env,
    appliedDate: env.appliedDate || '-',
    notifiedDate: env.notifiedDate || '-',
    schedulatedDeleteDate: env.schedulatedDeleteDate || '-',
  }))
})

/**
 * 表格欄位配置
 */
const columns = ref<ColumnConfig[]>([
  {
    key: 'customerName',
    label: '客戶',
    width: '180px',
    sortable: false,
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
    key: 'appliedDate',
    label: '申請日',
    width: '150px',
    sortable: true,
  },
  {
    key: 'notifiedDate',
    label: '通知日',
    width: '150px',
    sortable: true,
  },
  {
    key: 'schedulatedDeleteDate',
    label: '預定刪除日',
    width: '150px',
    sortable: true,
  },
  {
    key: 'applicant',
    label: '申請人',
    width: '120px',
    sortable: true,
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
      { label: '申請中', value: 'PENDING' },
      { label: '已通知', value: 'NOTIFIED' },
      { label: '待刪除', value: 'TO_BE_DELETED' },
    ],
    defaultValue: 'all',
  },
]

// ===== 批量操作配置 =====

/**
 * 批量操作按鈕配置
 */
const batchActions: BatchActionConfig[] = [
  {
    key: 'notify',
    label: '通知寄送狀態',
    type: 'notify',
    confirmMessage: '確定要通知選中的環境嗎？',
  },
  {
    key: 'delete',
    label: '環境刪除',
    type: 'delete',
    confirmMessage: '確定要刪除選中的環境嗎？此操作無法復原。',
  },
]

// ===== 載入資料 =====

/**
 * 載入環境列表
 * 從 API 取得所有環境資料
 *
 * 開發階段：使用 getMockEnvironments() 回傳模擬資料
 * 正式環境：使用 getAllEnvironments() 呼叫後端 API
 */
const loadEnvironments = async () => {
  isLoading.value = true
  try {
    // TODO: 等後端 API 完成後，切換為 getAllEnvironments()
    // const data = await environmentService.getAllEnvironments()

    // 開發階段：使用 Mock 資料
    originEnvironments.value = await environmentService.getMockEnvironments()
  } catch (error) {
    console.error('載入環境列表錯誤:', error)
    // TODO: 顯示錯誤訊息給使用者
  } finally {
    isLoading.value = false
  }
}

// ===== 事件處理 =====

/**
 * 處理查看詳情按鈕點擊
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

// ===== 初始化 =====

/**
 * 元件掛載時自動載入資料
 */
onMounted(() => {
  loadEnvironments()
})

/**
 * 對外暴露方法（供父元件呼叫）
 */
defineExpose({
  /**
   * 重新載入資料
   * 用於新增、編輯、刪除後刷新列表
   */
  refresh: loadEnvironments,

  /**
   * 清空選取狀態
   */
  clearSelection: () => {
    selectedIds.value = []
  },
})
</script>
