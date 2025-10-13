/**
 * 使用者服務層
 *
 * 負責處理所有使用者相關的 API 請求
 */

import apiClient from '@/utils/axios'
import type { ApiResponse } from '@/types/common'
import type { UserInfo } from '@/types/user'

/**
 * 使用者服務
 */
export const userService = {
  /**
   * 取得當前使用者資訊（包含權限）
   * GET /api/users/me
   *
   * 用途：
   * 1. 登入後取得使用者完整資訊
   * 2. 取得功能權限清單，供前端動態過濾選單
   * 3. 頁面重新整理時恢復使用者資訊
   *
   * @returns 使用者資訊（包含 userId, userName, email, permissions, roles）
   */
  async getCurrentUserInfo(): Promise<ApiResponse<UserInfo>> {
    const response = await apiClient.get<ApiResponse<UserInfo>>('/users/me')
    return response.data
  },
}
