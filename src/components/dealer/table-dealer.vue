<template>
  <!-- 權限檢查：如果沒有 settings.dealers 權限，顯示無權限提示 -->
  <EmptyState
    v-if="!hasPermission"
    type="no-permission"
    title="無權限存取"
    description="您沒有權限查看經銷商設定功能"
  />

  <data-table
    v-else
    :total-count="dealers.length"
    :columns="columns"
    :data="dealers"
    :show-search="true"
    :show-add-button="true"
    :loading="isLoading"
    :show-checkbox="false"
    :show-edit-button="false"
    :show-border="true"
    title="列表"
    item-name="經銷商"
    row-key="id"
    empty-text="目前沒有經銷商資料"
    v-model:selected-ids="selectedIds"
    @row-view="handleView"
    @add-click="handleAdd"
  >
  </data-table>

  <!-- 錯誤訊息顯示 -->
  <Alert
    v-if="errorMessage && hasPermission"
    type="error"
    title="載入失敗"
    :description="errorMessage"
    class="mt-4"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import EmptyState from '@/components/common/empty-state.vue'
import DataTable from '@/components/table/data-table.vue'
import { useAuthStore } from '@/stores/auth.store'
import { dealerService } from '@/services/dealer.service'
import type { DealerListItem } from '@/types/dealer'
import type { ColumnConfig } from '@/types/table'

// ===== Emits 定義 =====
const emit = defineEmits<{
  'row-view': [row: Record<string, unknown>] // 查看詳情事件
  add: [] // 新增按鈕點擊事件
}>()

// ===== 狀態管理 =====

/**
 * 載入狀態
 */
const isLoading = ref(false)

/**
 * 認證 Store（用於權限檢查）
 */
const authStore = useAuthStore()

/**
 * 模組列表資料
 */
const dealers = ref<DealerListItem[]>([])

/**
 * 選取的環境 ID
 */
const selectedIds = ref<(string | number)[]>([])

/**
 * 錯誤訊息
 */
const errorMessage = ref<string | null>(null)

// ===== 權限檢查 =====

/**
 * 檢查是否有 settings.accounts 權限
 */
const hasPermission = computed(() => {
  const permissions = authStore.userInfo?.permissions || []
  return permissions.includes('settings.dealers')
})

// ===== 欄位配置 =====

/**
 * 表格欄位配置
 */
const columns = ref<ColumnConfig[]>([
  {
    key: 'code',
    label: '編號',
    width: '120px',
    sortable: true,
  },
  {
    key: 'name',
    label: '經銷商名稱',
    width: '180px',
  },
  {
    key: 'sales',
    label: '負責業務',
    width: '150px',
  },
  {
    key: 'contactPerson',
    label: '聯絡人',
    width: '150px',
  },
  {
    key: 'contactPhone',
    label: '聯絡電話',
    width: '150px',
  },
  {
    key: 'email',
    label: '電子信箱',
    width: '150px',
  },
  {
    key: 'actions',
    label: '操作',
    width: '120px',
    align: 'right',
    customRender: 'actions',
  },
])

// ===== 載入資料 =====

/**
 * 載入產業別列表
 * 從 API 取得所有產業別資料
 *
 * 開發階段：使用 getMockIndustries() 回傳模擬資料
 * 正式環境：使用 getAllIndustries() 呼叫後端 API
 */
const loadDealers = async () => {
  isLoading.value = true
  try {
    // TODO: 等後端 API 完成後，切換為 getAllDealers()
    // const data = await dealerService.getAllDealers()

    // 開發階段：使用 Mock 資料
    dealers.value = await dealerService.getMockDealers()
  } catch (error) {
    console.error('載入經銷商列表錯誤:', error)
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
 * 處理新增按鈕點擊
 * 發出 add 事件,由父元件處理
 */
const handleAdd = () => {
  emit('add')
}

// ===== 初始化 =====

/**
 * 元件掛載時自動載入資料
 */
onMounted(() => {
  loadDealers()
})

/**
 * 對外暴露方法（供父元件呼叫）
 */
defineExpose({
  /**
   * 重新載入資料
   * 用於新增、編輯、刪除後刷新列表
   */
  refresh: loadDealers,

  /**
   * 清空選取狀態
   */
  clearSelection: () => {
    selectedIds.value = []
  },
})
</script>
