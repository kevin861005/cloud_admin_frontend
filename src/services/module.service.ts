/**
 * 模組 API Service
 * 提供模組管理相關的 API 呼叫
 */

import apiClient from '@/utils/axios'
import type { ApiResponse } from '@/types/common'
import type {
  ModuleListItem,
  CreateModuleRequest,
  ModuleDetailInfo,
  UpdateModuleRequest,
} from '@/types/module'

/**
 * 模組服務
 */
export const moduleService = {
  /**
   * 取得所有模組列表
   * GET /api/modules
   *
   * @returns Promise<ApiResponse<ModuleListItem[]>> 模組列表
   */
  async getAllModules(): Promise<ApiResponse<ModuleListItem[]>> {
    const response = await apiClient.get<ApiResponse<ModuleListItem[]>>('/modules')

    return response.data
  },

  async createModule(moduleData: CreateModuleRequest): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>('/modules', moduleData)
    return response.data
  },

  async updateModule(
    code: string,
    data: UpdateModuleRequest,
  ): Promise<ApiResponse<ModuleDetailInfo>> {
    try {
      const response = await apiClient.put<ApiResponse<ModuleDetailInfo>>(`/modules/${code}`, data)
      return response.data
    } catch (error) {
      console.error('更新模組資料失敗:', error)
      throw error
    }
  },

  async getModuleDetail(code: string): Promise<ApiResponse<ModuleDetailInfo>> {
    const response = await apiClient.get<ApiResponse<ModuleDetailInfo>>(`/modules/${code}/detail`)
    return response.data
  },
}
