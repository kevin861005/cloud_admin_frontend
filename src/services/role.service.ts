/**
 * 角色管理 Service
 * 提供角色相關的 API 呼叫
 */

import apiClient from '@/utils/axios'
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
   * GET /api/roles
   *
   * 用途:
   * 1. 角色管理頁面的列表資料
   * 2. 取得完整的角色資訊（含 ID、名稱、描述、權限）
   *
   * @returns Promise<ApiResponse<Role[]>> 角色列表
   */
  async getAllRoles(): Promise<ApiResponse<Role[]>> {
    const response = await apiClient.get<ApiResponse<Role[]>>('/roles')
    return response.data
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
   * @returns Promise<ApiResponse<RoleOption[]>> 角色選項列表
   *
   * @example
   * // 使用範例
   * const response = await roleService.getRoleOptions()
   * if (response.success && response.data) {
   *   roleOptions.value = response.data
   *   // roleOptions = [
   *   //   { label: '系統管理員', value: 1 },
   *   //   { label: '一般使用者', value: 2 }
   *   // ]
   * }
   */
  async getRoleOptions(): Promise<ApiResponse<RoleOption[]>> {
    const response = await this.getAllRoles()

    if (!response.success || !response.data) {
      return {
        success: false,
        message: response.message || '取得角色選項失敗',
        code: response.code,
        data: null,
        timestamp: new Date().toISOString(),
      }
    }

    const options: RoleOption[] = response.data.map((role: Role) => ({
      label: role.description,
      value: role.id,
    }))

    return {
      success: true,
      message: '取得角色選項成功',
      data: options,
      timestamp: new Date().toISOString(),
    }
  },
}
