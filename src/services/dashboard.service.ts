/**
 * Dashboard API Service
 * 提供總覽頁面所需的統計資料
 */

import axios from '@/utils/axios'
import type { ApiResponse, CustomerStats } from '@/types/dashboard'

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
