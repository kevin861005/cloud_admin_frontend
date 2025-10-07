/**
 * 認證相關的 TypeScript 型別定義
 */

/**
 * 登入請求
 */
export interface LoginRequest {
  loginId: string
  password: string
}

/**
 * 登入回應
 */
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  userInfo: UserInfo
}

/**
 * 使用者資訊
 */
export interface UserInfo {
  loginId: string
  name: string
  email: string
  roles: string[]
  permissions: string[]
}

/**
 * API 統一回應格式
 * 使用泛型 T，不提供預設值，避免使用 any
 */
export interface ApiResponse<T> {
  success: boolean
  message: string
  code?: string
  data: T | null
}

/**
 * Refresh Token 請求
 */
export interface RefreshTokenRequest {
  refreshToken: string
}

/**
 * API 錯誤回應
 */
export interface ApiErrorResponse {
  success: false
  message: string
  code: string
  data: null
}

/**
 * Axios 錯誤型別
 */
export interface ApiError {
  response?: {
    data: ApiErrorResponse
    status: number
    statusText: string
  }
  message: string
  code?: string
}
