/**
 * Axios 配置與攔截器
 * 
 * 功能：
 * 1. 設定 Base URL
 * 2. 自動附加 JWT Token
 * 3. 自動刷新過期的 Token
 * 4. 統一錯誤處理
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, RefreshTokenRequest, RefreshTokenResponse } from '@/types/auth'

/**
 * 建立 Axios 實例
 */
const apiClient = axios.create({
  baseURL: '/cloudadmin/api', // API Base URL
  timeout: 30000, // 請求逾時時間（30 秒）
  headers: {
    'Content-Type': 'application/json',
  },
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
 * 請求攔截器：自動附加 Token
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
 */
apiClient.interceptors.response.use(
  (response) => {
    // 成功回應，直接返回 data
    return response
  },
  async (error: AxiosError<ApiResponse<null>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // 如果是 401 錯誤，且還沒重試過，嘗試刷新 Token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 避免無限循環
      if (originalRequest.url?.includes('/auth/refresh')) {
        // 如果刷新 Token 也失敗，清除登入狀態並跳轉到登入頁
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/cloudadmin/login'
        return Promise.reject(error)
      }

      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true

        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
          // 沒有 Refresh Token，清除登入狀態並跳轉到登入頁
          localStorage.removeItem('accessToken')
          window.location.href = '/cloudadmin/login'
          return Promise.reject(error)
        }

        try {
          // 呼叫刷新 Token API
          const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
            '/cloudadmin/api/auth/refresh',
            { refreshToken } as RefreshTokenRequest,
          )

          if (response.data.success && response.data.data) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data

            // 更新本地儲存的 Token
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', newRefreshToken)

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
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/cloudadmin/login'
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
