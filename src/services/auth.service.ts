/**
 * 認證服務層
 *
 * 負責處理所有認證相關的 API 請求
 */

import apiClient from '@/utils/axios'
import type { ApiResponse } from '@/types/common'
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/types/auth'

/**
 * 認證服務
 */
export const authService = {
  /**
   * 使用者登入
   * POST /api/auth/login
   *
   * @param loginData 登入資料（帳號、密碼）
   * @returns 登入回應（僅包含 Token，不包含 userInfo）
   */
  async login(loginData: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', loginData)
    return response.data
  },

  /**
   * 刷新 Access Token
   * POST /api/auth/refresh
   *
   * @param refreshToken Refresh Token
   * @returns 新的 Token
   */
  async refreshToken(
    refreshTokenData: RefreshTokenRequest,
  ): Promise<ApiResponse<RefreshTokenResponse>> {
    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
      '/auth/refresh',
      refreshTokenData,
    )
    return response.data
  },

  /**
   * 登出
   * POST /api/auth/logout
   *
   * @param refreshToken Refresh Token（用於撤銷）
   */
  async logout(refreshToken: string): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>('/auth/logout', { refreshToken })
    return response.data
  },
}
