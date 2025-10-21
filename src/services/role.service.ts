import apiClient from '@/utils/axios'
import type { ApiResponse } from '@/types/common'
import type { Role } from '@/types/role'

/**
 * 角色管理 Service (Functional Style)
 */

/**
 * 角色選項介面
 */
interface RoleOption {
  label: string
  value: number
}

/**
 * 取得所有角色列表
 * 用於新增/編輯使用者時選擇角色
 */
export async function getAllRoles(): Promise<ApiResponse<Role[]>> {
  const response = await apiClient.get<ApiResponse<Role[]>>('/roles')
  return response.data
}

/**
 * 取得可用的角色選項 (簡化版,僅用於下拉選單/checkbox)
 */
export async function getRoleOptions(): Promise<ApiResponse<RoleOption[]>> {
  const response = await getAllRoles()

  if (!response.success || !response.data) {
    return {
      success: false,
      message: response.message || '取得角色選項失敗',
      code: response.code,
      data: null,
      timestamp: new Date().toISOString(),
    }
  }

  const options: RoleOption[] = response.data.map((role: Role) => {
    return {
      label: role.description,
      value: role.id,
    }
  })

  return {
    success: true,
    message: '取得角色選項成功',
    data: options,
    timestamp: new Date().toISOString(),
  }
}
