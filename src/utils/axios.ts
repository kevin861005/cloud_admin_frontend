/**
 * Axios 全域配置
 */
import axios from 'axios'
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, LoginResponse } from '@/types/auth'
import { useAuthStore } from '@/stores/auth.store'

/**
 * API Base URL
 *
 * 開發環境：透過 Vite proxy 代理到 http://localhost:8080/cloudadmin/api
 * 生產環境：直接使用相對路徑 /cloudadmin/api
 */
const axiosInstance = axios.create({
  baseURL: '/cloudadmin/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

interface ExtendedRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

/**
 * 請求攔截器
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken')

    if (
      accessToken &&
      !config.url?.includes('/auth/login') &&
      !config.url?.includes('/auth/refresh')
    ) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

/**
 * 回應攔截器
 */
axiosInstance.interceptors.response.use(
  <T>(response: AxiosResponse<ApiResponse<T>>) => {
    return response
  },
  async (error: AxiosError<ApiResponse<null>>) => {
    const originalRequest = error.config as ExtendedRequestConfig

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const response = await axios.post<ApiResponse<LoginResponse>>(
          '/cloudadmin/api/auth/refresh',
          { refreshToken },
        )

        if (response.data.success && response.data.data) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', newRefreshToken)

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }

          return axiosInstance(originalRequest)
        }
      } catch (refreshError) {
        const authStore = useAuthStore()
        authStore.logout()
        window.location.href = '/cloudadmin/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
