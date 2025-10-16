<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mx-auto max-w-7xl">
      <!-- 頁面標題 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Table 元件測試（階段三）</h1>
        <p class="mt-1 text-sm text-gray-600">測試篩選器、搜尋框、排序、分頁、選取功能</p>
      </div>

      <!-- 選取狀態顯示（開發輔助）-->
      <div
        v-if="selectedIds.length > 0"
        class="mb-4 rounded-lg border border-green-200 bg-green-50 p-4"
      >
        <h3 class="mb-2 font-semibold text-green-900">📊 選取狀態（開發輔助）</h3>
        <div class="text-sm text-green-800">
          <p class="mb-1">
            已選擇 <strong>{{ selectedIds.length }}</strong> 個項目
          </p>
          <p class="font-mono text-xs">選中的 ID: {{ selectedIds.join(', ') }}</p>
        </div>
      </div>

      <!-- Data Table 元件 -->
      <data-table
        title="客戶列表"
        :total-count="customers.length"
        :columns="columns"
        :data="customers"
        :filters="filters"
        :show-search="true"
        search-placeholder="搜尋客戶名稱、模組、產業..."
        :show-add-button="true"
        add-button-text="新增客戶"
        :show-checkbox="true"
        v-model:selected-ids="selectedIds"
        row-key="id"
        :batch-actions="batchActions"
        @add-click="handleAdd"
        @row-edit="handleEdit"
        @row-view="handleView"
        @batch-action="handleBatchAction"
      />

      <!-- 測試說明 -->
      <div class="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 class="mb-2 font-semibold text-blue-900">✅ 測試重點</h3>
        <ul class="space-y-1 text-sm text-blue-800">
          <li>1. <strong>篩選器</strong>：改變篩選器後會清空搜尋框並回到第一頁</li>
          <li>
            2. <strong>搜尋框</strong>：輸入搜尋關鍵字後會在篩選後的資料中搜尋（debounce 500ms）
          </li>
          <li>3. <strong>組合使用</strong>：可先用篩選器縮小範圍，再用搜尋框找特定內容</li>
          <li>4. <strong>排序功能</strong>：點擊欄位標題可排序</li>
          <li>5. <strong>分頁功能</strong>：切換頁碼或調整每頁筆數</li>
          <li>6. <strong>操作按鈕</strong>：點擊編輯/查看按鈕會在 Console 顯示該列資料</li>
          <li>
            7. <strong>選取功能（新增）</strong>：
            <ul class="ml-4 mt-1 space-y-1">
              <li>• 點擊 Checkbox 選取/取消選取單行</li>
              <li>• 點擊表頭 Checkbox 全選/取消全選當前頁</li>
              <li>• 選中的行會顯示藍色背景</li>
              <li>• 選中項目後會顯示「已選擇 X 個項目」和批量操作按鈕</li>
              <li>• 跨頁保持選取狀態（第1頁選的項目切到第2頁仍保持選中）</li>
              <li>• 批量刪除會顯示確認對話框</li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- 功能測試步驟 -->
      <div class="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
        <h3 class="mb-2 font-semibold text-purple-900">🧪 測試步驟建議</h3>
        <ol class="space-y-1 text-sm text-purple-800">
          <li>
            <strong>步驟 1：基本選取</strong>
            <ul class="ml-4 mt-1">
              <li>• 勾選第 1、2、3 行（應該看到藍色背景）</li>
              <li>• 上方應該顯示「已選擇 3 個項目」</li>
              <li>• 點擊「取消選擇」，所有選取應該清空</li>
            </ul>
          </li>
          <li>
            <strong>步驟 2：全選功能</strong>
            <ul class="ml-4 mt-1">
              <li>• 點擊表頭的 Checkbox（應該選中當前頁所有項目）</li>
              <li>• 再次點擊表頭的 Checkbox（應該取消選中所有項目）</li>
            </ul>
          </li>
          <li>
            <strong>步驟 3：跨頁選取</strong>
            <ul class="ml-4 mt-1">
              <li>• 在第 1 頁勾選 3 個項目</li>
              <li>• 切換到第 2 頁（第 1 頁的 3 個項目應該仍保持選中）</li>
              <li>• 在第 2 頁再勾選 2 個項目（總共應該選中 5 個）</li>
              <li>• 切回第 1 頁（之前選的 3 個應該還是選中狀態）</li>
            </ul>
          </li>
          <li>
            <strong>步驟 4：批量操作</strong>
            <ul class="ml-4 mt-1">
              <li>• 勾選幾個項目</li>
              <li>• 點擊「環境刪除」按鈕（應該顯示確認對話框）</li>
              <li>• 點擊「批量匯出」按鈕（應該直接執行，在 Console 看到訊息）</li>
            </ul>
          </li>
          <li>
            <strong>步驟 5：與篩選/搜尋結合</strong>
            <ul class="ml-4 mt-1">
              <li>• 勾選幾個項目</li>
              <li>• 改變篩選器（選取狀態應該保持）</li>
              <li>• 輸入搜尋關鍵字（選取狀態應該保持）</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataTable from '@/components/table/data-table.vue'
import type { ColumnConfig, FilterConfig, BatchActionConfig } from '@/types/table'

/**
 * Table 元件測試頁面（階段三：選取功能）
 *
 * 測試功能：
 * 1. 3 個篩選器（狀態、模組、業務）
 * 2. 即時搜尋（debounce 500ms）
 * 3. 篩選 + 搜尋組合使用
 * 4. 排序功能
 * 5. 分頁功能
 * 6. 操作按鈕（編輯、查看）
 * 7. Checkbox 選取功能（新增）
 * 8. 批量操作（刪除、匯出）
 */

// ===== 選取狀態（階段三新增）=====
const selectedIds = ref<(string | number)[]>([])

// ===== 欄位配置 =====
const columns: ColumnConfig[] = [
  {
    key: 'name',
    label: '客戶名稱',
    width: '180px',
    sortable: true,
  },
  {
    key: 'status',
    label: '使用狀態',
    width: '120px',
    align: 'center',
    sortable: true,
    customRender: 'badge',
    badgeConfig: {
      colorMap: {
        活躍: {
          bg: 'bg-green-100',
          text: 'text-green-700',
        },
        低活躍: {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
        },
        未使用: {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
        },
      },
    },
  },
  {
    key: 'lastUsed',
    label: '最後使用',
    width: '150px',
    sortable: true,
  },
  {
    key: 'module',
    label: '使用模組',
    width: '120px',
    sortable: true,
  },
  {
    key: 'sales',
    label: '業務窗口',
    width: '120px',
    sortable: true,
  },
  {
    key: 'industry',
    label: '產業別',
    width: '120px',
  },
  {
    key: 'link',
    label: '網站連結',
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
]

// ===== 篩選器配置（階段二）=====
const filters: FilterConfig[] = [
  {
    key: 'status',
    label: '狀態:',
    options: [
      { label: '全部', value: 'all' },
      { label: '活躍', value: '活躍' },
      { label: '低活躍', value: '低活躍' },
      { label: '未使用', value: '未使用' },
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

// ===== 批量操作配置（階段三新增）=====
const batchActions: BatchActionConfig[] = [
  {
    key: 'delete',
    label: '環境刪除',
    type: 'danger',
    confirmMessage: '確定要刪除選中的項目嗎？此操作無法復原。',
  },
  {
    key: 'export',
    label: '批量匯出',
    type: 'default',
  },
]

// ===== 測試資料（16 筆）=====
const customers = ref([
  {
    id: 1,
    name: '橘色科技',
    status: '活躍',
    lastUsed: '2025-10-14',
    module: 'Master',
    sales: '周經理',
    industry: '科技業',
    link: 'orange-tech.com',
  },
  {
    id: 2,
    name: '藍天餐飲',
    status: '低活躍',
    lastUsed: '2025-09-20',
    module: 'GGF',
    sales: '林經理',
    industry: '餐飲業',
    link: 'blue-sky-food.com',
  },
  {
    id: 3,
    name: '綠光企業',
    status: '活躍',
    lastUsed: '2025-10-13',
    module: 'Master',
    sales: '周經理',
    industry: '製造業',
    link: 'green-light.com',
  },
  {
    id: 4,
    name: '紅葉商店',
    status: '未使用',
    lastUsed: '2025-05-10',
    module: 'GGF',
    sales: '陳經理',
    industry: '零售業',
    link: 'red-leaf-shop.com',
  },
  {
    id: 5,
    name: '黃金地產',
    status: '活躍',
    lastUsed: '2025-10-12',
    module: 'Master',
    sales: '林經理',
    industry: '房地產',
    link: 'golden-estate.com',
  },
  {
    id: 6,
    name: '紫羅蘭服飾',
    status: '低活躍',
    lastUsed: '2025-08-15',
    module: 'GGF',
    sales: '周經理',
    industry: '服飾業',
    link: 'violet-fashion.com',
  },
  {
    id: 7,
    name: '白雲旅行社',
    status: '活躍',
    lastUsed: '2025-10-11',
    module: 'Master',
    sales: '陳經理',
    industry: '旅遊業',
    link: 'white-cloud-travel.com',
  },
  {
    id: 8,
    name: '黑貓物流',
    status: '活躍',
    lastUsed: '2025-10-14',
    module: 'GGF',
    sales: '林經理',
    industry: '物流業',
    link: 'black-cat-logistics.com',
  },
  {
    id: 9,
    name: '粉紅醫美',
    status: '低活躍',
    lastUsed: '2025-09-05',
    module: 'Master',
    sales: '周經理',
    industry: '醫療業',
    link: 'pink-beauty.com',
  },
  {
    id: 10,
    name: '灰色設計',
    status: '未使用',
    lastUsed: '2025-04-20',
    module: 'GGF',
    sales: '陳經理',
    industry: '設計業',
    link: 'grey-design.com',
  },
  {
    id: 11,
    name: '銀河金融',
    status: '活躍',
    lastUsed: '2025-10-13',
    module: 'Master',
    sales: '林經理',
    industry: '金融業',
    link: 'galaxy-finance.com',
  },
  {
    id: 12,
    name: '青草茶飲',
    status: '低活躍',
    lastUsed: '2025-08-30',
    module: 'GGF',
    sales: '周經理',
    industry: '餐飲業',
    link: 'green-tea-shop.com',
  },
  {
    id: 13,
    name: '棕櫚建設',
    status: '活躍',
    lastUsed: '2025-10-10',
    module: 'Master',
    sales: '陳經理',
    industry: '建築業',
    link: 'palm-construction.com',
  },
  {
    id: 14,
    name: '深藍科技',
    status: '活躍',
    lastUsed: '2025-10-14',
    module: 'GGF',
    sales: '林經理',
    industry: '科技業',
    link: 'deep-blue-tech.com',
  },
  {
    id: 15,
    name: '淺綠農場',
    status: '未使用',
    lastUsed: '2025-06-15',
    module: 'Master',
    sales: '周經理',
    industry: '農業',
    link: 'light-green-farm.com',
  },
  {
    id: 16,
    name: '深紫律師',
    status: '低活躍',
    lastUsed: '2025-09-10',
    module: 'GGF',
    sales: '陳經理',
    industry: '法律業',
    link: 'deep-purple-law.com',
  },
])

// ===== 事件處理 =====

/**
 * 處理新增按鈕點擊
 */
const handleAdd = () => {
  console.log('點擊新增客戶按鈕')
  alert('新增客戶功能（開發中）')
}

/**
 * 處理編輯按鈕點擊
 */
const handleEdit = (row: Record<string, unknown>) => {
  console.log('點擊編輯按鈕，資料：', row)
  alert(`編輯客戶：${row.name}（ID: ${row.id}）`)
}

/**
 * 處理查看按鈕點擊
 */
const handleView = (row: Record<string, unknown>) => {
  console.log('點擊查看按鈕，資料：', row)
  alert(`查看客戶：${row.name}（ID: ${row.id}）`)
}

/**
 * 處理批量操作（階段三新增）
 */
const handleBatchAction = (actionKey: string, selectedRows: Record<string, unknown>[]) => {
  console.log('========== 批量操作 ==========')
  console.log('操作類型:', actionKey)
  console.log('選中的項目數量:', selectedRows.length)
  console.log('選中的項目:', selectedRows)
  console.log(
    '選中的 ID:',
    selectedRows.map((row) => row.id),
  )
  console.log('==============================')

  if (actionKey === 'delete') {
    // 模擬批量刪除
    alert(
      `批量刪除成功！\n刪除了 ${selectedRows.length} 個客戶：\n${selectedRows.map((r) => r.name).join(', ')}`,
    )
    // 清空選取狀態
    selectedIds.value = []
    // TODO: 實際開發時，這裡應該呼叫 API 刪除，然後重新載入資料
  } else if (actionKey === 'export') {
    // 模擬批量匯出
    alert(
      `批量匯出成功！\n匯出了 ${selectedRows.length} 個客戶：\n${selectedRows.map((r) => r.name).join(', ')}`,
    )
    // TODO: 實際開發時，這裡應該呼叫 API 匯出
  }
}
</script>
