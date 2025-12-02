/**
 * 經銷商 API Service
 * 提供經銷商管理相關的 API 呼叫
 *
 * 檔案位置：src/services/dealer.service.ts
 */
import apiClient from '@/utils/axios'
import type { ApiResponse } from '@/types/common'
import type {
  DealerListItem,
  DealerDetailInfo,
  CreateDealerRequest,
  UpdateDealerRequest,
} from '@/types/dealer'

/**
 * 經銷商服務
 */
export const dealerService = {
  /**
   * 取得所有經銷商列表
   * GET /api/dealers
   *
   * @returns  Promise<ApiResponse<DealerListItem[]>> 經銷商列表
   */
  async getAllDealers(): Promise<ApiResponse<DealerListItem[]>> {
    const response = await apiClient.get<ApiResponse<DealerListItem[]>>('/dealers')

    return response.data
  },

  async getDealerDetail(code: string): Promise<ApiResponse<DealerDetailInfo>> {
    const response = await apiClient.get<ApiResponse<DealerDetailInfo>>(`/dealers/${code}/detail`)
    return response.data
  },

  async createDealer(dealerData: CreateDealerRequest): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>('/dealers', dealerData)
    return response.data
  },

  async updateDealer(
    code: string,
    data: UpdateDealerRequest,
  ): Promise<ApiResponse<DealerDetailInfo>> {
    try {
      const response = await apiClient.put<ApiResponse<DealerDetailInfo>>(`/dealers/${code}`, data)
      return response.data
    } catch (error) {
      console.error('更新經銷商資料失敗:', error)
      throw error
    }
  },
}
