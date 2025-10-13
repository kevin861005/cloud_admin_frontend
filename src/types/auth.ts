/**
 * 認證相關型別定義
 */

/**
 * 登入請求
 */
export interface LoginRequest {
  loginId: string
  password: string
}

/**
 * 登入回應（調整後：不包含 userInfo）
 */
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

/**
 * Refresh Token 請求
 */
export interface RefreshTokenRequest {
  refreshToken: string
}

/**
 * Refresh Token 回應
 */
export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}
