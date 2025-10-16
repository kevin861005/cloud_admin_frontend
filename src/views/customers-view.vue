<template>
  <!-- 頁面容器 -->
  <div class="page-container">
    <!-- 頁面標題 -->
    <h1 class="page-title">客戶管理</h1>

    <!-- 說明文字 -->
    <p class="page-description">管理所有客戶資料，包含新增、編輯、查看和批量操作功能。</p>

    <!-- 客戶列表 -->
    <div class="page-content">
      <customer-table
        ref="customerTableRef"
        :show-filters="true"
        :show-search="true"
        :show-add-button="true"
        :show-checkbox="true"
        :show-edit-button="true"
        @add-click="handleAdd"
        @row-edit="handleEdit"
        @row-view="handleView"
        @batch-action="handleBatchAction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { useRouter } from 'vue-router'
import CustomerTable from '@/components/business/customer-table.vue'
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

/**
 * CustomerTable 元件引用
 * 用於呼叫元件暴露的方法（如 refresh）
 */
const customerTableRef = ref<InstanceType<typeof CustomerTable> | null>(null)

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
}
</script>

<style scoped>
/**
 * 頁面容器
 */
.page-container {
  /* 內距：上下左右各 24px */
  padding: 24px;
  /* 背景色：淡灰色 */
  background-color: #f8fafc;
  /* 最小高度：填滿整個內容區域 */
  min-height: 100%;
}

/**
 * 頁面標題
 */
.page-title {
  /* 字體大小：24px */
  font-size: 24px;
  /* 字體粗細：粗體 */
  font-weight: 700;
  /* 字體顏色：深色 */
  color: #1e293b;
  /* 下方間距：16px */
  margin-bottom: 16px;
}

/**
 * 說明文字
 */
.page-description {
  /* 字體大小：14px */
  font-size: 14px;
  /* 字體顏色：中灰色 */
  color: #64748b;
  /* 下方間距：24px */
  margin-bottom: 24px;
}

/**
 * 頁面內容區域
 */
.page-content {
  /* 背景色：白色 */
  background-color: #ffffff;
  /* 圓角：8px */
  border-radius: 8px;
  /* 內距：24px（減少內距，因為 DataTable 內部已有 padding） */
  padding: 24px;
  /* 陰影 */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
</style>
