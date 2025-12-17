/**
 * 產業別 API Service
 */

import apiClient from '@/utils/axios'
import { ApiError } from '@/types/common'
import type { ApiResponse, FieldError } from '@/types/common'
import type {
  IndustryListItem,
  CreateIndustryRequest,
  IndustryDetailInfo,
  UpdateIndustryRequest,
} from '@/types/industry'

export const industryService = {
  /**
   * 取得所有產業別列表
   * GET /industries
   */
  async getAllIndustries(): Promise<IndustryListItem[]> {
    const response = await apiClient.get<ApiResponse<IndustryListItem[]>>('/industries')

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || '取得產業別列表失敗',
        data: response.data.data ?? null,
      })
    }

    return response.data.data
  },

  /**
   * 新增產業別
   * POST /industries
   */
  async createIndustry(industryData: CreateIndustryRequest): Promise<void> {
    const response = await apiClient.post<ApiResponse<FieldError[] | null>>(
      '/industries',
      industryData,
    )

    if (!response.data.success) {
      throw new ApiError<FieldError[] | null>({
        code: response.data.code,
        message: response.data.message || '新增產業別失敗',
        data: response.data.data ?? null,
      })
    }
  },

  /**
   * 更新產業別資料
   * PUT /industries/{code}
   */
  async updateIndustry(code: string, data: UpdateIndustryRequest): Promise<IndustryDetailInfo> {
    const response = await apiClient.put<ApiResponse<IndustryDetailInfo | FieldError[] | null>>(
      `/industries/${code}`,
      data,
    )

    if (!response.data.success || !response.data.data) {
      throw new ApiError<FieldError[] | null>({
        code: response.data.code,
        message: response.data.message || '更新產業別資料失敗',
        data: (response.data.data ?? null) as FieldError[] | null,
      })
    }

    return response.data.data as IndustryDetailInfo
  },

  /**
   * 取得產業別詳細資料
   * GET /industries/{code}/detail
   */
  async getIndustryDetail(code: string): Promise<IndustryDetailInfo> {
    const response = await apiClient.get<ApiResponse<IndustryDetailInfo | null>>(
      `/industries/${code}/detail`,
    )

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || '取得產業別詳情失敗',
        data: response.data.data ?? null,
      })
    }

    return response.data.data
  },
}
