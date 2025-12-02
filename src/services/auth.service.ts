/**
 * 認證服務層
 *
 * 負責處理所有認證相關的 API 請求
 *
 * 安全機制：
 * - Access Token：由 API 回傳，儲存在 localStorage
 * - Refresh Token：由後端設為 HttpOnly Cookie，前端無法存取
 */

import apiClient from '@/utils/axios'
import type { ApiResponse } from '@/types/common'
import type { LoginRequest, LoginResponse } from '@/types/auth'

/**
 * 認證服務
 */
export const authService = {
  /**
   * 使用者登入
   * POST /api/auth/login
   *
   * 後端會：
   * 1. 回傳 Access Token
   * 2. 將 Refresh Token 設為 HttpOnly Cookie
   *
   * @param loginData 登入資料（帳號、密碼）
   * @returns 登入回應（僅包含 Access Token）
   */
  async login(loginData: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', loginData)
    return response.data
  },

  /**
   * 刷新 Access Token
   * POST /api/auth/refresh
   *
   * Refresh Token 由瀏覽器自動從 HttpOnly Cookie 中攜帶，不需要傳參數
   *
   * @returns 新的 Access Token
   */
  async refreshToken(): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/refresh')
    return response.data
  },

  /**
   * 登出
   * POST /api/auth/logout
   *
   * 後端會：
   * 1. 從 Cookie 讀取 Refresh Token 並撤銷
   * 2. 清除 HttpOnly Cookie
   *
   * 前端不需要傳任何參數
   */
  async logout(): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>('/auth/logout')
    return response.data
  },
}
