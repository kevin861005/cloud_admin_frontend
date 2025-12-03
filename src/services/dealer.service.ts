/**
 * 經銷商 API Service
 * 提供經銷商管理相關的 API 呼叫
 *
 * 檔案位置：src/services/dealer.service.ts
 */
import apiClient from '@/utils/axios'
import type { ApiResponse, FieldError } from '@/types/common'
import { ApiError } from '@/types/common'
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
   * @returns  Promise<<DealerListItem[]> 經銷商列表
   */
  async getAllDealers(): Promise<DealerListItem[]> {
    const response = await apiClient.get<ApiResponse<DealerListItem[]>>('/dealers')

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得經銷商列表失敗')
    }

    return response.data.data
  },

  async getDealerDetail(code: string): Promise<DealerDetailInfo> {
    const response = await apiClient.get<ApiResponse<DealerDetailInfo>>(`/dealers/${code}/detail`)

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得經銷商詳情失敗')
    }

    return response.data.data
  },

  async createDealer(dealerData: CreateDealerRequest): Promise<void> {
    const response = await apiClient.post<ApiResponse<FieldError[] | null>>('/dealers', dealerData)

    if (!response.data.success) {
      throw new ApiError<FieldError[] | null>({
        code: response.data.code,
        message: response.data.message || '新增經銷商失敗',
        data: response.data.data ?? null,
      })
    }
  },

  async updateDealer(code: string, data: UpdateDealerRequest): Promise<DealerDetailInfo> {
    const response = await apiClient.put<ApiResponse<DealerDetailInfo | FieldError[] | null>>(
      `/dealers/${code}`,
      data,
    )

    if (!response.data.success || !response.data.data) {
      throw new ApiError<FieldError[] | null>({
        code: response.data.code,
        message: response.data.message || '更新經銷商資料失敗',
        data: (response.data.data ?? null) as FieldError[] | null,
      })
    }

    // 這裡一定是成功情境
    return response.data.data as DealerDetailInfo
  },
}
