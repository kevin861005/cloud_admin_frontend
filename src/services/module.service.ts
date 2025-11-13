/**
 * 模組 API Service
 * 提供模組管理相關的 API 呼叫
 */

import axios from '@/utils/axios'
import type { ApiResponse } from '@/types/common'
import type { ModuleListItem } from '@/types/module'

/**
 * 模組服務
 */
export const moduleService = {
  /**
   * 取得所有模組列表
   * GET /api/modules
   *
   * @returns Promise<ModuleListItem[]> 模組列表
   */
  async getAllModules(): Promise<ModuleListItem[]> {
    const response = await axios.get<ApiResponse<ModuleListItem[]>>('/modules')

    // 如果 API 回傳失敗或沒有資料，拋出錯誤
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得模組列表失敗')
    }

    return response.data.data
  },

  async getMockModules(): Promise<ModuleListItem[]> {
    // 可選：模擬網路延遲
    // await new Promise(resolve => setTimeout(resolve, 300))

    return [
      {
        id: 1,
        code: 'HR',
        name: '棉花糖',
        status: 'ACTIVE',
        createdAt: '2025.10.01',
        createdBy: { id: 'U001', name: '系統管理員' },
      },
      {
        id: 2,
        code: 'GGF',
        name: '夠簡單',
        status: 'INACTIVE',
        createdAt: '2025.10.01',
        createdBy: { id: 'U002', name: '張經理' },
      },
      {
        id: 3,
        code: 'Master',
        name: '店長管理大師',
        status: 'INACTIVE',
        createdAt: '2025.10.01',
        createdBy: { id: 'U003', name: '李主任' },
      },
      {
        id: 4,
        code: 'ESG',
        name: 'ESG',
        status: 'ACTIVE',
        createdAt: '2025.10.01',
        createdBy: { id: 'U001', name: '系統管理員' },
      },
    ]
  },
}
