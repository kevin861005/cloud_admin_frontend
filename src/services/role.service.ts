/**
 * 角色管理 Service
 * 提供角色相關的 API 呼叫
 */

import apiClient from '@/utils/axios'
import { ApiError } from '@/types/common'
import type { ApiResponse } from '@/types/common'
import type { Role } from '@/types/role'

/**
 * 角色選項介面
 * 用於表單的下拉選單或 checkbox 選項
 */
export interface RoleOption {
  label: string // 顯示文字（角色描述）
  value: number // 角色 ID
}

/**
 * 角色服務
 */
export const roleService = {
  /**
   * 取得所有角色列表
   * GET /roles
   *
   * 用途:
   * 1. 角色管理頁面的列表資料
   * 2. 取得完整的角色資訊（含 ID、名稱、描述、權限）
   *
   * @returns Promise<Role[]> 角色列表
   */
  async getAllRoles(): Promise<Role[]> {
    const response = await apiClient.get<ApiResponse<Role[]>>('/roles')

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || '取得角色列表失敗',
        data: response.data.data ?? null,
      })
    }

    return response.data.data
  },

  /**
   * 取得可用的角色選項（簡化版）
   * 用於新增/編輯使用者時選擇角色
   *
   * 用途:
   * 1. 新增使用者頁面的角色 checkbox
   * 2. 編輯使用者 Drawer 的角色 checkbox
   * 3. 任何需要角色下拉選單的地方
   *
   * @returns Promise<RoleOption[]> 角色選項列表
   */
  async getRoleOptions(): Promise<RoleOption[]> {
    // 直接沿用 getAllRoles()，失敗會丟 ApiError
    const roles = await this.getAllRoles()

    const options: RoleOption[] = roles.map((role: Role) => ({
      label: role.description,
      value: role.id,
    }))

    return options
  },
}
