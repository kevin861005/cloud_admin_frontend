<template>
  <div>
    <!-- 頁面標題 -->
    <PageTitle title="客戶管理" subtitle="業績表現、客戶資料、活躍度狀態" />

    <CardContainer>
      <TotalCustomerCard />
      <ActiveCustomerCard />
      <AttentionCustomerCard />
    </CardContainer>

    <TableContainer>
      <customer-table
        ref="customerTableRef"
        :show-filters="true"
        :show-search="true"
        :show-add-button="false"
        :show-checkbox="true"
        :show-edit-button="false"
        :show-border="false"
        @row-view="handleView"
        @batch-action="handleBatchAction"
      />
    </TableContainer>

    <!-- 客戶詳細資訊 Drawer -->
    <CustomerDetailDrawer
      :is-open="isDrawerOpen"
      :customer-id="selectedCustomerId"
      @close="handleCloseDrawer"
    />

    <!-- 批次刪除環境 Dialog -->
    <BatchDeleteEnvironmentDialog
      v-model="showBatchDeleteDialog"
      :customer-nos="selectedCustomerNos"
      @deleted="handleBatchDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import PageTitle from '@/components/common/page-title.vue'
import CardContainer from '@/components/common/card-container.vue'
import TableContainer from '@/components/table/table-container.vue'
import CustomerDetailDrawer from '@/components/customer/drawer-customer-detail.vue'
import BatchDeleteEnvironmentDialog from '@/components/environment/dialog-batch-delete-environment.vue'

// 客戶列表表格元件
import CustomerTable from '@/components/customer/table-customer.vue'

// 卡片元件
import TotalCustomerCard from '@/components/customer/card-total-customer.vue'
import ActiveCustomerCard from '@/components/customer/card-active-customer.vue'
import AttentionCustomerCard from '@/components/customer/card-attention-customer.vue'

const containerRef = ref<HTMLElement | null>(null)

/**
 * Drawer 開啟狀態
 */
const isDrawerOpen = ref(false)

/**
 * 選中的客戶 ID
 */
const selectedCustomerId = ref<string | null>(null)

/**
 * CustomerTable 元件引用
 */
const customerTableRef = ref<InstanceType<typeof CustomerTable> | null>(null)

/**
 * 批次刪除 Dialog 顯示狀態
 */
const showBatchDeleteDialog = ref(false)

/**
 * 選中要刪除的客戶編號清單
 */
const selectedCustomerNos = ref<string[]>([])

const handleWheel = (event: WheelEvent) => {
  if (!containerRef.value) return
  const canScroll = containerRef.value.scrollWidth > containerRef.value.clientWidth
  if (!canScroll) return
  event.preventDefault()
  containerRef.value.scrollLeft += event.deltaY
}

/**
 * 處理查看客戶
 */
const handleView = (row: Record<string, unknown>) => {
  const customer = row as unknown as { id: string; name: string }
  console.log('查看客戶:', customer)

  selectedCustomerId.value = customer.id
  isDrawerOpen.value = true
}

/**
 * 處理關閉 Drawer
 */
const handleCloseDrawer = () => {
  isDrawerOpen.value = false
  setTimeout(() => {
    selectedCustomerId.value = null
  }, 300)
}

/**
 * 處理批量操作
 */
const handleBatchAction = (actionKey: string, selectedRows: Record<string, unknown>[]) => {
  console.log('========== 批量操作 ==========')
  console.log('操作類型:', actionKey)
  console.log('選中的項目:', selectedRows)
  console.log('==============================')

  if (actionKey === 'delete') {
    // 取得選中的客戶編號
    const customers = selectedRows as unknown as Array<{ id: string; name: string }>
    selectedCustomerNos.value = customers.map((c) => String(c.id))

    // 開啟批次刪除 Dialog
    showBatchDeleteDialog.value = true
  }

  if (actionKey === 'applied') {
    // TODO: 處理申請刪除邏輯
    console.log('申請環境刪除')
  }
}

/**
 * 批次刪除成功後的處理
 */
const handleBatchDeleted = () => {
  // 清空選取狀態
  customerTableRef.value?.clearSelection()

  // 重新載入資料
  customerTableRef.value?.refresh()

  // 清空選中的客戶編號
  selectedCustomerNos.value = []
}

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('wheel', handleWheel, { passive: false })
  }
})

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('wheel', handleWheel)
  }
})
</script>

<style scoped></style>
