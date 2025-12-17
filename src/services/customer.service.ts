/**
 * 客戶 API Service
 * 提供客戶管理相關的 API 呼叫
 *
 * 檔案位置：src/services/customer.service.ts
 */

import apiClient from '@/utils/axios'
import type { ApiResponse, FieldError } from '@/types/common'
import { ApiError } from '@/types/common'
import type {
  CustomerListItem,
  CustomerDrawerInfo,
  CustomerDetailInfo,
  CustomerEditData,
  UpdateCustomerRequest,
  CustomerCountResponse,
  ActiveCustomerCountResponse,
  AttentionCustomerCountResponse,
} from '@/types/customer'

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
    const response = await apiClient.get<ApiResponse<CustomerListItem[]>>('/customers')

    if (!response.data.success || !response.data.data) {
      throw new ApiError<null>({
        code: response.data.code,
        message: response.data.message || '取得客戶列表失敗',
        data: null,
      })
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
    const response = await apiClient.get<ApiResponse<CustomerDrawerInfo>>(`/customers/${id}`, {
      params: { includeSystemInfo: false },
    })

    if (!response.data.success || !response.data.data) {
      throw new ApiError<null>({
        code: response.data.code,
        message: response.data.message || '取得客戶詳情失敗',
        data: null,
      })
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
    const response = await apiClient.get<ApiResponse<CustomerDetailInfo>>(`/customers/${id}`, {
      params: { includeSystemInfo: true },
    })

    if (!response.data.success || !response.data.data) {
      throw new ApiError<null>({
        code: response.data.code,
        message: response.data.message || '取得客戶詳情失敗',
        data: null,
      })
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
    const response = await apiClient.delete<ApiResponse<void>>('/customers/batch', {
      data: { ids },
    })

    if (!response.data.success) {
      throw new ApiError<null>({
        code: response.data.code,
        message: response.data.message || '批量刪除客戶失敗',
        data: null,
      })
    }
  },

  /**
   * 取得客戶編輯資料
   * GET /api/customers/:customerNo/edit
   *
   * @param customerNo - 客戶編號
   * @returns Promise<CustomerEditData> 客戶編輯資料
   */
  async getCustomerEditData(customerNo: string): Promise<CustomerEditData> {
    const response = await apiClient.get<ApiResponse<CustomerEditData>>(
      `/customers/${customerNo}/edit`,
    )

    if (!response.data.success || !response.data.data) {
      throw new ApiError<null>({
        code: response.data.code,
        message: response.data.message || '取得客戶編輯資料失敗',
        data: null,
      })
    }

    return response.data.data
  },

  /**
   * 更新客戶資料
   * PUT /api/customers/:customerNo
   *
   * @param customerNo - 客戶編號
   * @param data - 更新資料
   * @returns Promise<CustomerDetailInfo> 更新後的客戶資料
   */
  async updateCustomer(
    customerNo: string,
    data: UpdateCustomerRequest,
  ): Promise<CustomerDetailInfo> {
    const response = await apiClient.put<ApiResponse<CustomerDetailInfo | FieldError[] | null>>(
      `/customers/${customerNo}`,
      data,
    )

    if (!response.data.success || !response.data.data) {
      throw new ApiError<FieldError[] | null>({
        code: response.data.code,
        message: response.data.message || '更新客戶資料失敗',
        data: (response.data.data ?? null) as FieldError[] | null,
      })
    }

    return response.data.data as CustomerDetailInfo
  },

  /**
   * 取得總客戶數和成長比例
   * @returns 總客戶數、與上月相比的成長比例
   */
  async getCustomerTotalCount(): Promise<CustomerCountResponse> {
    const response = await apiClient.get<ApiResponse<CustomerCountResponse>>(
      '/customers/customer-count',
    )

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || '取得總客戶數失敗',
        data: null,
      })
    }

    return response.data.data
  },

  /**
   * 取得活躍客戶數和活躍度比例
   * @returns 活躍客戶數、活躍度比例
   */
  async getActiveCustomerCount(): Promise<ActiveCustomerCountResponse> {
    const response = await apiClient.get<ApiResponse<ActiveCustomerCountResponse>>(
      '/customers/active-customer-count',
    )

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || '取得活躍客戶數失敗',
        data: null,
      })
    }

    return response.data.data
  },

  /**
   * 取得需關注客戶數
   * @returns 需關注客戶數
   */
  async getAttentionCustomerCount(): Promise<AttentionCustomerCountResponse> {
    const response = await apiClient.get<ApiResponse<AttentionCustomerCountResponse>>(
      '/customers/attention-customer-count',
    )

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || '取得需關注客戶數失敗',
        data: null,
      })
    }

    return response.data.data
  },
}
