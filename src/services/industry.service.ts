/**
 * 產業別 API Service
 * 提供產業別管理相關的 API 呼叫
 */

import axios from '@/utils/axios'
import type { ApiResponse } from '@/types/common'
import type { IndustryListItem } from '@/types/industry'

/**
 * 產業別服務
 */
export const industryService = {
  /**
   * 取得所有產業別列表
   * GET /api/industries
   *
   * @returns Promise<IndustryListItem[]> 產業別列表
   */
  async getAllIndustries(): Promise<IndustryListItem[]> {
    const response = await axios.get<ApiResponse<IndustryListItem[]>>('/industries')

    // 如果 API 回傳失敗或沒有資料，拋出錯誤
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得產業別列表失敗')
    }

    return response.data.data
  },

  async getMockIndustries(): Promise<IndustryListItem[]> {
    // 可選：模擬網路延遲
    // await new Promise(resolve => setTimeout(resolve, 300))

    return [
      {
        id: 1,
        code: 'FB',
        name: '餐飲業',
        description: '提供餐飲服務相關的解決方案',
        sqlFile: 'industry_fb.sql',
        createdAt: '2025.09.15',
        createdBy: { id: 'U001', name: '系統管理員' },
      },
      {
        id: 2,
        code: 'RT',
        name: '零售業',
        description: '零售商品銷售管理系統',
        sqlFile: 'industry_rt.sql',
        createdAt: '2025.09.20',
        createdBy: { id: 'U002', name: '張經理' },
      },
      {
        id: 3,
        code: 'MF',
        name: '製造業',
        description: '生產製造流程管理系統',
        sqlFile: 'industry_mf.sql',
        createdAt: '2025.10.01',
        createdBy: { id: 'U003', name: '李主任' },
      },
      {
        id: 4,
        code: 'SV',
        name: '服務業',
        description: '服務型企業管理系統',
        sqlFile: 'industry_sv.sql',
        createdAt: '2025.10.05',
        createdBy: { id: 'U001', name: '系統管理員' },
      },
    ]
  },
}
