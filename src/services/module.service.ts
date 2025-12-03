/**
 * 模組 API Service
 * 提供模組管理相關的 API 呼叫
 */

import apiClient from '@/utils/axios'
import { ApiError } from '@/types/common'
import type { ApiResponse } from '@/types/common'
import type {
  ModuleListItem,
  CreateModuleRequest,
  ModuleDetailInfo,
  UpdateModuleRequest,
} from '@/types/module'

export const moduleService = {
  /**
   * 取得所有模組列表
   * GET /modules
   */
  async getAllModules(): Promise<ModuleListItem[]> {
    const response = await apiClient.get<ApiResponse<ModuleListItem[]>>('/modules')

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || '取得模組列表失敗',
        data: response.data.data ?? null,
      })
    }

    return response.data.data
  },

  /**
   * 新增模組
   * POST /modules
   */
  async createModule(moduleData: CreateModuleRequest): Promise<void> {
    const response = await apiClient.post<ApiResponse<void>>('/modules', moduleData)

    if (!response.data.success) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || '新增模組失敗',
        data: null,
      })
    }
  },

  /**
   * 更新模組
   * PUT /modules/{code}
   */
  async updateModule(code: string, data: UpdateModuleRequest): Promise<ModuleDetailInfo> {
    const response = await apiClient.put<ApiResponse<ModuleDetailInfo | null>>(
      `/modules/${code}`,
      data,
    )

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || '更新模組資料失敗',
        data: response.data.data ?? null,
      })
    }

    return response.data.data
  },

  /**
   * 取得模組詳情
   * GET /modules/{code}/detail
   */
  async getModuleDetail(code: string): Promise<ModuleDetailInfo> {
    const response = await apiClient.get<ApiResponse<ModuleDetailInfo | null>>(
      `/modules/${code}/detail`,
    )

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || '取得模組詳情失敗',
        data: response.data.data ?? null,
      })
    }

    return response.data.data
  },
}
