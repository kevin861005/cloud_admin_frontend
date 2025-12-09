/**
 * 客戶 API Service
 * 提供客戶管理相關的 API 呼叫
 */

import axios from '@/utils/axios'
import type { ApiResponse } from '@/types/common'
import type { CustomerListItem, CustomerDrawerInfo, CustomerDetailInfo } from '@/types/customer'

/**
 * 客戶服務
 */
export const customerService = {
  /**
   * 取得所有客戶列表
   * GET /api/customers
   *
   * @returns Promise<CustomerListItem[]> 客戶列表
   */
  async getAllCustomers(): Promise<CustomerListItem[]> {
    const response = await axios.get<ApiResponse<CustomerListItem[]>>('/customers')

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得客戶列表失敗')
    }

    return response.data.data
  },

  /**
   * 取得客戶基本資訊（用於 Drawer）
   * GET /api/customers/:id
   *
   * @param id - 客戶 ID
   * @returns Promise<CustomerDrawerInfo> 客戶基本資訊
   */
  async getCustomerById(id: string): Promise<CustomerDrawerInfo> {
    const response = await axios.get<ApiResponse<CustomerDrawerInfo>>(`/customers/${id}`, {
      params: { includeSystemInfo: false },
    })

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得客戶詳情失敗')
    }

    return response.data.data
  },

  /**
   * 取得客戶完整詳情（含系統環境資訊，用於詳情頁）
   * GET /api/customers/:id?includeSystemInfo=true
   *
   * @param id - 客戶 ID
   * @returns Promise<CustomerDetailInfo> 客戶完整詳情
   */
  async getCustomerDetailById(id: string): Promise<CustomerDetailInfo> {
    const response = await axios.get<ApiResponse<CustomerDetailInfo>>(`/customers/${id}`, {
      params: { includeSystemInfo: true },
    })

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得客戶詳情失敗')
    }

    return response.data.data
  },

  /**
   * 批量刪除客戶
   * DELETE /api/customers/batch
   *
   * @param ids - 客戶 ID 陣列
   * @returns Promise<void>
   */
  async batchDeleteCustomers(ids: number[]): Promise<void> {
    const response = await axios.delete<ApiResponse<void>>('/customers/batch', {
      data: { ids },
    })

    if (!response.data.success) {
      throw new Error(response.data.message || '批量刪除客戶失敗')
    }
  },
}
