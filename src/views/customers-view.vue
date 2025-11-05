<template>
  <div>
    <!-- 頁面標題（使用可重用的 PageTitle 元件） -->
    <PageTitle title="客戶管理" subtitle="業績表現、客戶資料、活躍度狀態" />

    <CardContainer>
      <!-- 總客戶數卡片 -->
      <TotalCustomerCard />

      <!-- 活躍客戶卡片 -->
      <ActiveCustomerCard />

      <!-- 需關注客戶卡片 -->
      <AttentionCustomerCard />
    </CardContainer>

    <TableContainer>
      <customer-table
        ref="customerTableRef"
        :show-filters="true"
        :show-search="true"
        :show-add-button="true"
        :show-checkbox="true"
        :show-edit-button="true"
        :show-border="false"
        @add-click="handleAdd"
        @row-edit="handleEdit"
        @row-view="handleView"
        @batch-action="handleBatchAction"
      />
    </TableContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// import { useRouter } from 'vue-router'
import PageTitle from '@/components/common/page-title.vue'
import CardContainer from '@/components/common/card-container.vue'
import TableContainer from '@/components/table/table-container.vue'

// 客戶列表表格元件
import CustomerTable from '@/components/customer/customer-table.vue'

// 總客戶數卡片元件
import TotalCustomerCard from '@/components/customer/total-customer-card.vue'

// 活躍客戶卡片元件
import ActiveCustomerCard from '@/components/customer/active-customer-card.vue'

// 需關注客戶卡片元件
import AttentionCustomerCard from '@/components/customer/attention-customer-card.vue'

// import { batchDeleteCustomers } from '@/services/customer.service'

/**
 * 客戶管理頁面
 *
 * 功能：
 * - 顯示客戶列表（完整版）
 *   - 有篩選器
 *   - 有搜尋框
 *   - 有新增按鈕
 *   - 有選取功能
 *   - 有編輯和查看按鈕
 *   - 有批量操作（環境刪除）
 */

// const router = useRouter()

const containerRef = ref<HTMLElement | null>(null)

/**
 * CustomerTable 元件引用
 * 用於呼叫元件暴露的方法（如 refresh）
 */
const customerTableRef = ref<InstanceType<typeof CustomerTable> | null>(null)

const handleWheel = (event: WheelEvent) => {
  if (!containerRef.value) return
  const canScroll = containerRef.value.scrollWidth > containerRef.value.clientWidth
  if (!canScroll) return
  event.preventDefault()
  containerRef.value.scrollLeft += event.deltaY
}

/**
 * 處理新增客戶
 * 跳轉到新增客戶頁面
 */
const handleAdd = () => {
  console.log('新增客戶')
  // TODO: 確認新增客戶的路由路徑
  // router.push('/customers/create')
  alert('新增客戶功能開發中...')
}

/**
 * 處理編輯客戶
 * 跳轉到編輯客戶頁面
 */
const handleEdit = (row: Record<string, unknown>) => {
  // 安全的型別轉換：先轉為 unknown，再轉為目標型別
  const customer = row as unknown as { id: number; name: string }

  console.log('編輯客戶:', customer)

  // TODO: 確認編輯客戶的路由路徑
  // router.push(`/customers/${customer.id}/edit`)

  alert(`編輯客戶功能開發中...\n客戶：${customer.name}（ID: ${customer.id}）`)
}

/**
 * 處理查看客戶
 * 跳轉到客戶詳情頁
 */
const handleView = (row: Record<string, unknown>) => {
  // 安全的型別轉換：先轉為 unknown，再轉為目標型別
  const customer = row as unknown as { id: number; name: string }

  console.log('查看客戶:', customer)

  // TODO: 確認客戶詳情的路由路徑
  // router.push(`/customers/${customer.id}`)

  alert(`查看客戶功能開發中...\n客戶：${customer.name}（ID: ${customer.id}）`)
}

/**
 * 處理批量操作
 *
 * @param actionKey - 操作類型（'delete'）
 * @param selectedRows - 選中的客戶列表
 */
const handleBatchAction = async (actionKey: string, selectedRows: Record<string, unknown>[]) => {
  console.log('========== 批量操作 ==========')
  console.log('操作類型:', actionKey)
  console.log('選中的項目:', selectedRows)
  console.log('==============================')

  if (actionKey === 'delete') {
    // 安全的型別轉換：先轉為 unknown，再轉為目標型別
    const customers = selectedRows as unknown as Array<{ id: number; name: string }>

    // 執行批量刪除
    try {
      const ids = customers.map((customer) => customer.id)

      // TODO: 等後端 API 完成後，取消註解
      // await batchDeleteCustomers(ids)

      // 開發階段：模擬刪除成功
      const customerNames = customers.map((c) => c.name).join(', ')
      alert(`批量刪除成功！\n已刪除 ${ids.length} 個客戶：${customerNames}`)

      // 清空選取狀態並重新載入資料
      customerTableRef.value?.clearSelection()
      customerTableRef.value?.refresh()
    } catch (error) {
      console.error('批量刪除錯誤:', error)
      alert('批量刪除失敗，請稍後再試。')
    }
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
}
</script>

<style scoped></style>
