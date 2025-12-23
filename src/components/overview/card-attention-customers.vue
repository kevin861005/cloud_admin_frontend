<template>
  <!--
    需關注客戶卡片 (使用 CardList 元件)

    功能:
    1. 顯示需關注的客戶列表(4-7天內使用的客戶)
    2. 使用 CardList 元件處理分頁、排序、顯示
    3. 只負責資料載入邏輯
  -->

  <CardList
    title="需關注客戶"
    :data="allCustomers"
    :columns="columns"
    :page-size="6"
    height="396px"
    :loading="isLoading"
    :error="errorMessage"
    empty-title="目前沒有需要關注的客戶"
    empty-description="暫時沒有 4-7 天內使用的客戶"
    @row-click="handleRowClick"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CardList from '@/components/overview/card-list.vue'
import { overviewService } from '@/services/overview.service'
import type { AttentionCustomer, CardListColumn } from '@/types/overview'

// ==================== Router ====================

const router = useRouter()

// ==================== 狀態管理 ====================

/** 所有需關注客戶資料 */
const allCustomers = ref<AttentionCustomer[]>([])

/** 載入狀態 */
const isLoading = ref(false)

/** 錯誤訊息 */
const errorMessage = ref('')

// ==================== 欄位配置 ====================

/**
 * 欄位定義
 *
 * 說明:
 * - customerName: flex: 2 表示佔 50% 寬度，可排序，支援 tooltip
 * - lastUsedTime: flex: 1 表示佔 25% 寬度，可排序，文字置中
 * - salesPerson: flex: 1 表示佔 25% 寬度，可排序，文字置中
 */
const columns: CardListColumn[] = [
  {
    key: 'customerName',
    label: '客戶',
    flex: 2,
    sortable: true,
    showTooltip: true,
    align: 'left',
  },
  {
    key: 'lastUsedTime',
    label: '使用時間',
    flex: 1,
    sortable: true,
    align: 'center',
  },
  {
    key: 'salesPerson',
    label: '負責業務',
    flex: 1,
    sortable: true,
    align: 'center',
  },
]

// ==================== 方法 ====================

/**
 * 載入需關注客戶資料
 */
async function loadAttentionCustomers() {
  try {
    isLoading.value = true
    errorMessage.value = ''

    // TODO: 等後端 API 完成後，改用真實 API
    const data = await overviewService.getAttentionCustomers()

    allCustomers.value = data.customers
  } catch (error) {
    console.error('載入需關注客戶失敗:', error)
    errorMessage.value = error instanceof Error ? error.message : '載入失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

// ==================== 事件處理 ====================

/**
 * 處理行點擊事件，跳轉到客戶詳細頁面
 */
function handleRowClick(item: AttentionCustomer) {
  router.push(`/customers/${item.id}/detail`)
}

// ==================== Lifecycle ====================

/**
 * 元件掛載時載入資料
 */
onMounted(() => {
  loadAttentionCustomers()
})
</script>
