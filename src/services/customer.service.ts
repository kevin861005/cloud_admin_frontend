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

    // 如果 API 回傳失敗或沒有資料，拋出錯誤
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得客戶列表失敗')
    }

    return response.data.data
  },

  /**
   * 取得單一客戶詳情（側邊攔）
   * GET /api/customers/{id}
   *
   * 用途:
   * 1. 客戶詳情頁面
   * 2. Drawer 顯示客戶完整資訊
   *
   * @param id - 客戶 ID
   * @returns Promise<CustomerDrawerInfo> 客戶詳情
   */
  async getCustomerById(id: string): Promise<CustomerDrawerInfo> {
    const response = await axios.get<ApiResponse<CustomerDrawerInfo>>(`/customers/${id}`)

    // 如果 API 回傳失敗或沒有資料，拋出錯誤
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得客戶詳情失敗')
    }

    return response.data.data
  },

  /**
   * 取得單一客戶詳情（詳細頁面）
   * GET /api/customers/{id}/detail
   *
   * 用途:
   * 1. 客戶詳情頁面
   * 2. Drawer 顯示客戶完整資訊
   *
   * @param id - 客戶 ID
   * @returns Promise<Customer> 客戶詳情
   */
  async getCustomerDetailById(id: string): Promise<CustomerDetailInfo> {
    const response = await axios.get<ApiResponse<CustomerDetailInfo>>(`/customers/${id}/detail`)

    // 如果 API 回傳失敗或沒有資料，拋出錯誤
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得客戶詳情失敗')
    }

    return response.data.data
  },

  /**
   * 批量刪除客戶
   * DELETE /api/customers/batch
   *
   * 用途:
   * 1. 客戶列表批量刪除功能
   *
   * @param ids - 客戶 ID 陣列
   * @returns Promise<void>
   */
  async batchDeleteCustomers(ids: number[]): Promise<void> {
    const response = await axios.delete<ApiResponse<void>>('/customers/batch', {
      data: { ids },
    })

    // 如果 API 回傳失敗，拋出錯誤
    if (!response.data.success) {
      throw new Error(response.data.message || '批量刪除客戶失敗')
    }
  },
}
