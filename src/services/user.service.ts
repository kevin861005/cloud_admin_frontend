/**
 * 使用者服務層
 *
 * 負責處理所有使用者相關的 API 請求
 */

import apiClient from '@/utils/axios'
import type { ApiResponse } from '@/types/common'
import type {
  UserInfo,
  UserListItem,
  CreateUserRequest,
  UserDetailInfo,
  UpdateUserRequest,
} from '@/types/user'

/**
 * 使用者服務
 */
export const userService = {
  /**
   * 取得當前使用者資訊(包含權限)
   * GET /api/users/me
   *
   * 用途:
   * 1. 登入後取得使用者完整資訊
   * 2. 取得功能權限清單,供前端動態過濾選單
   * 3. 頁面重新整理時恢復使用者資訊
   *
   * @returns 使用者資訊(包含 userId, userName, email, permissions, roles)
   */
  async getCurrentUserInfo(): Promise<ApiResponse<UserInfo>> {
    const response = await apiClient.get<ApiResponse<UserInfo>>('/users/me')
    return response.data
  },

  /**
   * 取得所有帳號列表
   * GET /api/users
   *
   * 用途:
   * 1. 帳號管理頁面的表格資料
   * 2. 後端回傳全部資料(不分頁)
   * 3. 前端在瀏覽器端進行搜尋、篩選、排序、分頁
   *
   * 權限要求:
   * - 需要 settings.accounts 權限(僅系統管理員可存取)
   *
   * @returns 帳號列表(包含 loginId, name, email, roles, status, createdAt, updatedAt)
   */
  async getAllUsers(): Promise<ApiResponse<UserListItem[]>> {
    const response = await apiClient.get<ApiResponse<UserListItem[]>>('/users')
    return response.data
  },

  /**
   * 取得使用者詳細資訊
   * GET /api/users/{loginId}/detail
   *
   * 用途:
   * 1. Drawer 顯示使用者完整資訊
   * 2. 包含建立者、更新者、完整權限清單
   *
   * 權限要求:
   * - 需要 settings.accounts 權限
   *
   * @param loginId - 使用者登入帳號
   * @returns 使用者詳細資訊
   */
  async getUserDetail(loginId: string): Promise<ApiResponse<UserDetailInfo>> {
    const response = await apiClient.get<ApiResponse<UserDetailInfo>>(`/users/${loginId}/detail`)
    return response.data
  },

  /**
   * 新增使用者
   * POST /api/users
   *
   * 用途:
   * 1. 新增帳號頁面建立新使用者
   * 2. 包含帳號、密碼、姓名、Email、角色權限
   *
   * 權限要求:
   * - 需要 settings.accounts 權限
   *
   * @param userData - 新增使用者資料
   * @returns 建立成功的回應
   */
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>('/users', userData)
    return response.data
  },

  /**
   * 更新使用者資料
   * PUT /api/users/{loginId}
   *
   * 用途:
   * 1. Drawer 編輯模式更新使用者資訊
   * 2. 可更新姓名、Email、角色權限、狀態
   *
   * 權限要求:
   * - 需要 settings.accounts 權限
   *
   * @param loginId - 使用者登入帳號
   * @param data - 更新的使用者資料
   * @returns 更新後的使用者詳細資訊
   */
  async updateUser(loginId: string, data: UpdateUserRequest): Promise<ApiResponse<UserDetailInfo>> {
    try {
      const response = await apiClient.put<ApiResponse<UserDetailInfo>>(`/users/${loginId}`, data)
      return response.data
    } catch (error) {
      console.error('更新使用者資料失敗:', error)
      throw error
    }
  },
}
