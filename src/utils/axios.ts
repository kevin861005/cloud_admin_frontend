/**
 * Axios 配置與攔截器
 *
 * 功能：
 * 1. 設定 Base URL
 * 2. 自動附加 JWT Token（Access Token）
 * 3. 自動刷新過期的 Token（Refresh Token 由 HttpOnly Cookie 攜帶）
 * 4. 統一錯誤處理
 *
 * 安全機制：
 * - Access Token：儲存在 localStorage，每次請求自動附加
 * - Refresh Token：由後端設為 HttpOnly Cookie，前端無法存取，瀏覽器自動攜帶
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types/common'
import type { LoginResponse } from '@/types/auth'

/**
 * 建立 Axios 實例
 */
const apiClient = axios.create({
  baseURL: '/cloudadmin/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  // 允許跨域請求攜帶 Cookie（HttpOnly Cookie 需要此設定）
  withCredentials: true,
})

/**
 * 是否正在刷新 Token
 */
let isRefreshing = false

/**
 * 等待刷新的請求佇列
 */
let refreshSubscribers: ((token: string) => void)[] = []

/**
 * 訂閱 Token 刷新
 */
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

/**
 * 通知所有訂閱者 Token 已刷新
 */
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

/**
 * 清除登入狀態並跳轉到登入頁
 */
function clearAuthAndRedirect() {
  localStorage.removeItem('accessToken')
  window.location.href = '/cloudadmin/login'
}

/**
 * 請求攔截器：自動附加 Access Token
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')

    // 如果有 Token，加到 Authorization header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

/**
 * 回應攔截器：自動刷新 Token
 *
 * 當 Access Token 過期（401 錯誤）時，自動呼叫 /auth/refresh
 * Refresh Token 會由瀏覽器自動從 HttpOnly Cookie 中攜帶
 */
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError<ApiResponse<null>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // 如果是 401 錯誤，且還沒重試過，嘗試刷新 Token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 避免無限循環：刷新 Token API 本身失敗時不再重試
      if (originalRequest.url?.includes('/auth/refresh')) {
        clearAuthAndRedirect()
        return Promise.reject(error)
      }

      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true

        try {
          // 呼叫刷新 Token API（不需要傳參數，Refresh Token 由 Cookie 自動攜帶）
          const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/refresh')

          if (response.data.success && response.data.data) {
            const { accessToken } = response.data.data

            // 更新本地儲存的 Access Token
            localStorage.setItem('accessToken', accessToken)

            // 通知所有等待的請求
            onTokenRefreshed(accessToken)

            // 重試原本的請求
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`
            }

            return apiClient(originalRequest)
          } else {
            throw new Error('Token 刷新失敗')
          }
        } catch (refreshError) {
          // Token 刷新失敗，清除登入狀態並跳轉到登入頁
          clearAuthAndRedirect()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      } else {
        // 如果正在刷新，等待刷新完成
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(apiClient(originalRequest))
          })
        })
      }
    }

    // 其他錯誤，直接拋出
    return Promise.reject(error)
  },
)

export default apiClient
