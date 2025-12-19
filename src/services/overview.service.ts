/**
 * Dashboard API Service
 * 提供總覽頁面所需的統計資料
 */

import apiClient from '@/utils/axios'
import { ApiError } from '@/types/common'
import type { ApiResponse } from '@/types/common'
import type {
  CustomerStats,
  CustomerGrowthData,
  AlertListData,
  AttentionCustomersData,
  ModuleUsageData,
} from '@/types/overview'

/**
 * 總覽頁面服務
 */
export const overviewService = {
  /**
   * 取得客戶統計資料
   * GET /cloudAdmin/api/dashboard/customer-stats
   *
   * @returns Promise<CustomerStats> 客戶統計資料
   */
  async getCustomerStats(): Promise<CustomerStats> {
    const response = await apiClient.get<ApiResponse<CustomerStats>>('/dashboard/customer-stats')

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || '取得客戶統計資料失敗',
        data: response.data.data ?? null,
      })
    }

    return response.data.data
  },

  /**
   * 取得月度成長資料
   * GET /cloudAdmin/api/dashboard/customer-growth
   *
   * @returns Promise<CustomerGrowthData> 客戶統計資料
   */
  async getCustomerGrowthData(): Promise<CustomerGrowthData> {
    const response = await apiClient.get<ApiResponse<CustomerGrowthData>>(
      '/dashboard/customer-growth',
    )

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || '取得月度成長資料失敗',
        data: response.data.data ?? null,
      })
    }

    return response.data.data
  },

  /**
   * 取得最近的警示列表
   * GET /cloudAdmin/api/dashboard/alerts/recent
   *
   * @param limit 要取得的筆數（預設 3 筆）
   * @returns Promise<AlertListData> 警示列表資料
   */
  async getRecentAlerts(): Promise<AlertListData> {
    const response = await apiClient.get<ApiResponse<AlertListData>>('/dashboard/alerts/recent')

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || '取得警示列表失敗',
        data: response.data.data ?? null,
      })
    }

    return response.data.data
  },

  /**
   * 取得需關注客戶列表
   * GET /cloudAdmin/api/dashboard/attention-customers
   *
   * @returns Promise<AttentionCustomersData> 需關注客戶列表資料
   */
  async getAttentionCustomers(): Promise<AttentionCustomersData> {
    const response = await apiClient.get<ApiResponse<AttentionCustomersData>>(
      '/dashboard/attention-customers',
    )

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || '取得需關注客戶列表失敗',
        data: response.data.data ?? null,
      })
    }

    return response.data.data
  },

  /**
   * 取得模組使用量資料（週報 + 月報）
   * GET /cloudAdmin/api/dashboard/module-usage
   *
   * @returns Promise<ModuleUsageData> 模組使用量資料
   */
  async getModuleUsageData(): Promise<ModuleUsageData> {
    const response = await apiClient.get<ApiResponse<ModuleUsageData>>('/dashboard/module-usage')

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || '取得模組使用量資料失敗',
        data: response.data.data ?? null,
      })
    }

    return response.data.data
  },
}
