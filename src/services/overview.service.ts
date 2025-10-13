/**
 * Dashboard API Service
 * 提供總覽頁面所需的統計資料
 */

import axios from '@/utils/axios'
import type { ApiResponse } from '@/types/common'
import type { CustomerStats, CustomerGrowthData, AlertListData } from '@/types/overview'

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
export async function getRecentAlerts(limit: number = 3): Promise<AlertListData> {
  const response = await axios.get<ApiResponse<AlertListData>>('/alerts/recent', {
    params: { limit },
  })

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
    ],
    totalCount: 3,
  }
}
