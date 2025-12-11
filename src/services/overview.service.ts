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
    const response = await axios.get<ApiResponse<CustomerStats>>('/dashboard/customer-stats')

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得客戶統計資料失敗')
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
    const response = await axios.get<ApiResponse<CustomerGrowthData>>('/dashboard/customer-growth')

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得月度成長資料失敗')
    }

    return response.data.data
  },

  /**
   * 取得最近的警示列表
   * GET /cloudAdmin/api/alerts/recent
   *
   * @param limit 要取得的筆數（預設 3 筆）
   * @returns Promise<AlertListData> 警示列表資料
   */
  async getRecentAlerts(): Promise<AlertListData> {
    const response = await axios.get<ApiResponse<AlertListData>>('/alerts/recent')

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得警示列表失敗')
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
    const response = await axios.get<ApiResponse<AttentionCustomersData>>(
      '/dashboard/attention-customers',
    )

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得需關注客戶列表失敗')
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
    const response = await axios.get<ApiResponse<ModuleUsageData>>('/dashboard/module-usage')

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得模組使用量資料失敗')
    }

    return response.data.data
  },

  // ===== Mock 資料（開發階段使用） =====

  /**
   * Mock Data - 警示列表
   * 等後端 API 完成後，可以移除這個方法
   */
  getMockRecentAlerts(): AlertListData {
    return {
      alerts: [
        // {
        //   id: 'alert_001',
        //   type: 'RUNTIME_ERROR',
        //   customerName: 'CityTasty',
        //   occurredAt: '2024.09.12 14:30',
        // },
        // {
        //   id: 'alert_002',
        //   type: 'CREATE_FAILED',
        //   customerName: '合夥旅食',
        //   occurredAt: '2024.09.11 08:23',
        // },
        // {
        //   id: 'alert_003',
        //   type: 'RUNTIME_ERROR',
        //   customerName: '乾杯股份有限公司',
        //   occurredAt: '2024.09.08 20:42',
        // },
        // {
        //   id: 'alert_004',
        //   type: 'CREATE_FAILED',
        //   customerName: '乃綸股份有限公司',
        //   occurredAt: '2024.09.08 20:41',
        // },
      ],
      totalCount: 0,
    }
  },

  /**
   * Mock Data - 模組使用量資料
   * 等後端 API 完成後，可以移除這個方法
   */
  getMockModuleUsageData(): ModuleUsageData {
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
  },
}
