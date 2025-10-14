/**
 * Dashboard API Service
 * 提供總覽頁面所需的統計資料
 */

import axios from '@/utils/axios'
import type { ApiResponse } from '@/types/common'
import type {
  CustomerStats,
  CustomerGrowthData,
  AlertListData,
  AttentionCustomersData,
  ModuleUsageData,
} from '@/types/overview'

/**
 * 取得客戶統計資料
 *
 * @returns Promise<CustomerStats> 客戶統計資料
 *
 * @description
 * 後端 API Endpoint: GET /cloudAdmin/api/dashboard/customer-stats
 *
 * 回應格式範例：
 * {
 *   "success": true,
 *   "message": "查詢成功",
 *   "timestamp": "2025-10-13T06:30:45.123Z",
 *   "data": {
 *     "totalCustomers": 16,
 *     "activeCount": 15,
 *     "activePercentage": 37.5,
 *     "lowActiveCount": 15,
 *     "lowActivePercentage": 37.5,
 *     "inactiveCount": 15,
 *     "inactivePercentage": 37.5
 *   }
 * }
 */
export async function getCustomerStats(): Promise<CustomerStats> {
  const response = await axios.get<ApiResponse<CustomerStats>>('/dashboard/customer-stats')

  // 如果 API 回傳失敗或沒有資料，拋出錯誤
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '取得客戶統計資料失敗')
  }

  return response.data.data
}

/**
 * Mock Data - 開發階段使用
 * 等後端 API 完成後，可以移除這個函數
 */
export function getMockCustomerStats(): CustomerStats {
  return {
    totalCustomers: 16,
    activeCount: 15,
    activePercentage: 37.5,
    lowActiveCount: 10,
    lowActivePercentage: 20,
    inactiveCount: 15,
    inactivePercentage: 37.5,
  }
}

/**
 * 取得月度成長資料
 *
 * @returns Promise<CustomerGrowthData> 客戶統計資料
 *
 * @description
 * 後端 API Endpoint: GET /cloudAdmin/api/dashboard/customer-growth
 *
 * 回應格式範例：
 * {
 *   "success": true,
 *   "message": "查詢成功",
 *   "timestamp": "2025-10-13T06:30:45.123Z",
 *   "data": {
 *     "growthRate": 8.5,
 *     "currentMonthCount": 15,
 *     "lastMonthCount": 9
 *   }
 * }
 */
export async function getCustomerGrowthData(): Promise<CustomerGrowthData> {
  const response = await axios.get<ApiResponse<CustomerGrowthData>>(
    '/dashboard/customer-customer-growth',
  )

  // 如果 API 回傳失敗或沒有資料，拋出錯誤
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '取得月度成長資料失敗')
  }

  return response.data.data
}

/**
 * Mock Data - 開發階段使用
 * 等後端 API 完成後，可以移除這個函數
 */
export function getMockCustomerGrowthData(): CustomerGrowthData {
  return {
    growthRate: 3.8,
    currentMonthCount: 8,
    lastMonthCount: 15,
  }
}

/**
 * 取得最近的警示列表
 *
 * @param limit 要取得的筆數（預設 3 筆）
 * @returns Promise<AlertListData> 警示列表資料
 *
 * @description
 * 後端 API Endpoint: GET /cloudAdmin/api/alerts/recent?limit=3
 *
 * 回應格式範例：
 * {
 *   "success": true,
 *   "message": "查詢成功",
 *   "timestamp": "2025-10-13T06:30:45.123Z",
 *   "data": {
 *     "alerts": [
 *       {
 *         "id": "alert_001",
 *         "type": "RUNTIME_ERROR",
 *         "customerName": "CityTasty",
 *         "occurredAt": "2024.09.12 14:30"
 *       }
 *     ],
 *     "totalCount": 3
 *   }
 * }
 */
export async function getRecentAlerts(): Promise<AlertListData> {
  const response = await axios.get<ApiResponse<AlertListData>>('/alerts/recent')

  // 如果 API 回傳失敗或沒有資料，拋出錯誤
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '取得警示列表失敗')
  }

  return response.data.data
}

/**
 * Mock Data - 開發階段使用
 * 等後端 API 完成後，可以移除這個函數
 */
export function getMockRecentAlerts(): AlertListData {
  return {
    alerts: [
      {
        id: 'alert_001',
        type: 'RUNTIME_ERROR',
        customerName: 'CityTasty',
        occurredAt: '2024.09.12 14:30',
      },
      {
        id: 'alert_002',
        type: 'CREATE_FAILED',
        customerName: '合夥旅食',
        occurredAt: '2024.09.11 08:23',
      },
      {
        id: 'alert_003',
        type: 'RUNTIME_ERROR',
        customerName: '乾杯股份有限公司',
        occurredAt: '2024.09.08 20:42',
      },
      {
        id: 'alert_004',
        type: 'CREATE_FAILED',
        customerName: '乃綸股份有限公司',
        occurredAt: '2024.09.08 20:41',
      },
    ],
    totalCount: 4,
  }
}

/**
 * 取得需關注客戶列表
 *
 * @returns Promise<AttentionCustomersData> 需關注客戶列表資料
 *
 * @description
 * 後端 API Endpoint: GET /cloudAdmin/api/dashboard/attention-customers
 *
 * 回應格式範例：
 * {
 *   "success": true,
 *   "message": "查詢成功",
 *   "timestamp": "2025-10-13T06:30:45.123Z",
 *   "data": {
 *     "customers": [
 *       {
 *         "id": "cust_001",
 *         "customerName": "橘色涮涮屋",
 *         "lastUsedTime": "4天前",
 *         "salesPerson": "周經理"
 *       }
 *     ],
 *     "totalCount": 8
 *   }
 * }
 *
 * @note
 * 需關注客戶的定義由後端處理，前端僅負責顯示
 * 資料量通常不會很大（< 100 筆），因此使用前端分頁即可
 */
export async function getAttentionCustomers(): Promise<AttentionCustomersData> {
  const response = await axios.get<ApiResponse<AttentionCustomersData>>(
    '/dashboard/attention-customers',
  )

  // 如果 API 回傳失敗或沒有資料，拋出錯誤
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '取得需關注客戶列表失敗')
  }

  return response.data.data
}

/**
 * Mock Data - 開發階段使用
 * 等後端 API 完成後，可以移除這個函數
 *
 * @returns AttentionCustomersData Mock 資料（包含 10 筆測試資料，用於測試分頁）
 */
export function getMockAttentionCustomers(): AttentionCustomersData {
  return {
    customers: [
      {
        id: 'cust_001',
        customerName: '橘色涮涮屋',
        lastUsedTime: '4天前',
        salesPerson: '周經理',
      },
      {
        id: 'cust_002',
        customerName: '字太多用tiphover測試顯示效果',
        lastUsedTime: '4天前',
        salesPerson: '周經理',
      },
      {
        id: 'cust_003',
        customerName: '乾杯股份有限公司',
        lastUsedTime: '5天前',
        salesPerson: '李經理',
      },
      {
        id: 'cust_004',
        customerName: '合夥旅食',
        lastUsedTime: '5天前',
        salesPerson: '陳經理',
      },
      {
        id: 'cust_005',
        customerName: 'CityTasty 餐飲集團',
        lastUsedTime: '6天前',
        salesPerson: '王經理',
      },
      {
        id: 'cust_006',
        customerName: '饗食天堂',
        lastUsedTime: '6天前',
        salesPerson: '張經理',
      },
      {
        id: 'cust_007',
        customerName: '鼎泰豐',
        lastUsedTime: '7天前',
        salesPerson: '劉經理',
      },
      {
        id: 'cust_008',
        customerName: '王品集團',
        lastUsedTime: '7天前',
        salesPerson: '黃經理',
      },
      {
        id: 'cust_009',
        customerName: '瓦城泰統',
        lastUsedTime: '8天前',
        salesPerson: '林經理',
      },
      {
        id: 'cust_010',
        customerName: '添好運',
        lastUsedTime: '8天前',
        salesPerson: '吳經理',
      },
    ],
    totalCount: 10,
  }
}

/**
 * 取得模組使用量資料（週報 + 月報）
 *
 * @returns Promise<ModuleUsageData> 模組使用量資料
 *
 * @description
 * 後端 API Endpoint: GET /cloudAdmin/api/dashboard/module-usage
 *
 * 回應格式範例：
 * {
 *   "success": true,
 *   "message": "查詢成功",
 *   "timestamp": "2025-10-13T06:30:45.123Z",
 *   "data": {
 *     "weekly": [
 *       { "label": "24/09/16", "master": 4, "ggf": 5, "hr": 3, "esg": 4 }
 *     ],
 *     "monthly": [
 *       { "label": "1月", "master": 18, "ggf": 15, "hr": 12, "esg": 10 }
 *     ]
 *   }
 * }
 */
export async function getModuleUsageData(): Promise<ModuleUsageData> {
  const response = await axios.get<ApiResponse<ModuleUsageData>>('/dashboard/module-usage')

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '取得模組使用量資料失敗')
  }

  return response.data.data
}

/**
 * Mock Data - 模組使用量
 */
export function getMockModuleUsageData(): ModuleUsageData {
  return {
    weekly: [
      { label: '24/09/16', master: 4, ggf: 5, hr: 3, esg: 4 },
      { label: '24/09/17', master: 5, ggf: 5, hr: 3, esg: 3 },
      { label: '24/09/18', master: 6, ggf: 5, hr: 2, esg: 3 },
      { label: '24/09/19', master: 7, ggf: 4, hr: 3, esg: 2 },
      { label: '24/09/20', master: 6, ggf: 5, hr: 2, esg: 3 },
      { label: '24/09/21', master: 5, ggf: 5, hr: 3, esg: 3 },
      { label: '24/09/22', master: 6, ggf: 4, hr: 3, esg: 3 },
    ],
    monthly: [
      { label: '1月', master: 18, ggf: 15, hr: 12, esg: 10 },
      { label: '2月', master: 20, ggf: 16, hr: 13, esg: 11 },
      { label: '3月', master: 22, ggf: 17, hr: 14, esg: 12 },
      { label: '4月', master: 19, ggf: 16, hr: 13, esg: 11 },
      { label: '5月', master: 21, ggf: 17, hr: 14, esg: 12 },
      { label: '6月', master: 23, ggf: 18, hr: 15, esg: 13 },
      { label: '7月', master: 20, ggf: 17, hr: 14, esg: 12 },
      { label: '8月', master: 22, ggf: 18, hr: 15, esg: 13 },
      { label: '9月', master: 24, ggf: 19, hr: 16, esg: 14 },
      { label: '10月', master: 21, ggf: 17, hr: 14, esg: 12 },
      { label: '11月', master: 23, ggf: 18, hr: 15, esg: 13 },
      { label: '12月', master: 25, ggf: 20, hr: 17, esg: 15 },
    ],
  }
}
