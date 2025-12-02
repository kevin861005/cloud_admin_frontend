/**
 * 產業別 API Service
 * 提供產業別管理相關的 API 呼叫
 */

import apiClient from '@/utils/axios'
import type { ApiResponse } from '@/types/common'
import type {
  IndustryListItem,
  CreateIndustryRequest,
  IndustryDetailInfo,
  UpdateIndustryRequest,
} from '@/types/industry'

/**
 * 產業別服務
 */
export const industryService = {
  /**
   * 取得所有產業別列表
   * GET /api/industries
   *
   * @returns Promise<ApiResponse<IndustryListItem[]>> 產業別列表
   */
  async getAllIndustries(): Promise<ApiResponse<IndustryListItem[]>> {
    const response = await apiClient.get<ApiResponse<IndustryListItem[]>>('/industries')

    return response.data
  },

  async createIndustry(industryData: CreateIndustryRequest): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>('/industries', industryData)
    return response.data
  },

  async updateIndustry(
    code: string,
    data: UpdateIndustryRequest,
  ): Promise<ApiResponse<IndustryDetailInfo>> {
    try {
      const response = await apiClient.put<ApiResponse<IndustryDetailInfo>>(
        `/industries/${code}`,
        data,
      )
      return response.data
    } catch (error) {
      console.error('更新產業別資料失敗:', error)
      throw error
    }
  },

  async getIndustryDetail(code: string): Promise<ApiResponse<IndustryDetailInfo>> {
    const response = await apiClient.get<ApiResponse<IndustryDetailInfo>>(
      `/industries/${code}/detail`,
    )
    return response.data
  },
}
