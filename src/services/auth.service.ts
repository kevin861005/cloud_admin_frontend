/**
 * 認證相關的 API 服務
 * 負責與後端 API 溝通
 */
import axios from '@/utils/axios'
import type { LoginRequest, LoginResponse, RefreshTokenRequest, ApiResponse } from '@/types/auth'

/**
 * 認證服務
 */
export const authService = {
  /**
   * 登入
   * @param data 登入請求資料（帳號、密碼）
   * @returns 登入回應（包含 Token 和使用者資訊）
   */
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await axios.post<ApiResponse<LoginResponse>>('/auth/login', data)
    return response.data
  },

  /**
   * 刷新 Token
   * @param data Refresh Token
   * @returns 新的 Token
   */
  async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await axios.post<ApiResponse<LoginResponse>>('/auth/refresh', data)
    return response.data
  },

  /**
   * 登出
   * @param refreshToken Refresh Token
   */
  async logout(refreshToken: string): Promise<ApiResponse<null>> {
    const response = await axios.post<ApiResponse<null>>('/auth/logout', { refreshToken })
    return response.data
  },
}
