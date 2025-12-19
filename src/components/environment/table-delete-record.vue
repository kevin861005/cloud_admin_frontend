<template>
  <data-table
    :total-count="deleteRecords.length"
    :columns="columns"
    :data="deleteRecords"
    :filters="filters"
    :show-search="true"
    :show-add-button="false"
    :loading="isLoading"
    :show-checkbox="false"
    :show-edit-button="false"
    :show-border="true"
    title="列表"
    item-name="紀錄"
    row-key="id"
    @row-view="handleView"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DataTable from '@/components/table/data-table.vue'
import { environmentService } from '@/services/environment.service'
import type { DeleteRecordListItem } from '@/types/environment'
import type { ColumnConfig, FilterConfig } from '@/types/table'

// ===== Emits 定義 =====
const emit = defineEmits<{
  'row-view': [row: Record<string, unknown>] // 查看詳情事件
}>()

// ===== 狀態管理 =====

/**
 * 載入狀態
 */
const isLoading = ref(false)

/**
 * 刪除紀錄列表資料（原始）
 */
const deleteRecords = ref<DeleteRecordListItem[]>([])

// ===== 動態篩選器選項 =====

/**
 * 從資料中取得不重複的值作為篩選選項
 * @param key - 資料欄位名稱
 */
const getDistinctOptions = (
  key: keyof DeleteRecordListItem,
): { label: string; value: string }[] => {
  // 取得所有不重複的值
  const values = [...new Set(deleteRecords.value.map((item) => item[key]))]

  // 轉換為選項格式
  const options = values.map((value) => {
    const strValue = value === null || value === undefined || value === '' ? '' : String(value)
    const label = strValue === '' ? '(空白)' : strValue
    return { label, value: strValue }
  })

  // 排序：空白放最後，其他按字母排序
  options.sort((a, b) => {
    if (a.value === '') return 1
    if (b.value === '') return -1
    return a.label.localeCompare(b.label, 'zh-TW')
  })

  // 加入「全部」選項
  return [{ label: '全部', value: 'all' }, ...options]
}

/**
 * 動態篩選器配置
 * 根據 deleteRecords 資料動態產生選項
 */
const filters = computed<FilterConfig[]>(() => [
  {
    key: 'industry',
    label: '產業:',
    options: getDistinctOptions('industry'),
    defaultValue: 'all',
  },
  {
    key: 'deletedBy',
    label: '刪除人:',
    options: getDistinctOptions('deletedBy'),
    defaultValue: 'all',
  },
])

/**
 * 表格欄位配置
 */
const columns = ref<ColumnConfig[]>([
  {
    key: 'orderNo',
    label: '訂單編號',
    width: '14%',
    sortable: true,
  },
  {
    key: 'customerName',
    label: '客戶',
    width: '15%',
    sortable: false,
  },
  {
    key: 'industry',
    label: '產業',
    width: '10%',
    align: 'center',
    sortable: true,
  },
  {
    key: 'domainName',
    label: '環境域名',
    width: '19%',
    sortable: false,
  },
  {
    key: 'notifiedDate',
    label: '通知日',
    width: '12%',
    sortable: true,
  },
  {
    key: 'deleteDate',
    label: '刪除日',
    width: '12%',
    sortable: true,
  },
  {
    key: 'deletedBy',
    label: '刪除人',
    width: '10%',
    sortable: false,
  },
  {
    key: 'actions',
    label: '操作',
    width: '8%',
    align: 'center',
    customRender: 'actions',
  },
])

// ===== 載入資料 =====

/**
 * 載入刪除紀錄列表
 * 從 API 取得所有刪除紀錄資料
 */
const loadDeleteRecords = async () => {
  isLoading.value = true
  try {
    deleteRecords.value = await environmentService.getAllDeleteRecords()
  } catch (error) {
    console.error('載入刪除紀錄列表錯誤:', error)
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

// ===== 初始化 =====

/**
 * 元件掛載時自動載入資料
 */
onMounted(() => {
  loadDeleteRecords()
})

/**
 * 對外暴露方法（供父元件呼叫）
 */
defineExpose({
  /**
   * 重新載入資料
   * 用於刪除後刷新列表
   */
  refresh: loadDeleteRecords,
})
</script>
