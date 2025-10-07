/**
 * 認證狀態管理 Store
 * 使用 Pinia 管理登入狀態和使用者資訊
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, LoginRequest, ApiResponse } from '@/types/auth'
import { authService } from '@/services/auth.service'
import { useRouter } from 'vue-router'
import type { AxiosError } from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // === State ===

  /**
   * 使用者資訊
   */
  const userInfo = ref<UserInfo | null>(null)

  /**
   * 是否正在載入
   */
  const loading = ref(false)

  /**
   * 錯誤訊息
   */
  const errorMessage = ref<string | null>(null)

  // === Getters ===

  /**
   * 是否已登入
   */
  const isAuthenticated = computed(() => {
    return !!localStorage.getItem('accessToken') && !!userInfo.value
  })

  /**
   * 使用者角色
   */
  const userRoles = computed(() => userInfo.value?.roles || [])

  /**
   * 使用者權限
   */
  const userPermissions = computed(() => userInfo.value?.permissions || [])

  // === Actions ===

  /**
   * 登入
   */
  async function login(loginData: LoginRequest): Promise<boolean> {
    loading.value = true
    errorMessage.value = null

    try {
      const response = await authService.login(loginData)

      if (response.success && response.data) {
        // 儲存 Token 到 localStorage
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)

        // 儲存使用者資訊到 Store
        userInfo.value = response.data.userInfo

        // 登入成功
        return true
      } else {
        errorMessage.value = response.message || '登入失敗'
        return false
      }
    } catch (err) {
      console.error('登入錯誤:', err)

      // 處理錯誤訊息
      const error = err as AxiosError<ApiResponse<null>>

      if (error.response?.data?.message) {
        errorMessage.value = error.response.data.message
      } else if (error.message) {
        errorMessage.value = error.message
      } else {
        errorMessage.value = '登入失敗，請稍後再試'
      }

      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 登出
   */
  async function logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch (err) {
      console.error('登出錯誤:', err)
    } finally {
      // 清除本地資料
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      userInfo.value = null

      // 跳轉到登入頁
      router.push('/login')
    }
  }

  /**
   * 從 localStorage 恢復使用者資訊
   * （頁面重新整理時使用）
   */
  function restoreUserInfo(): void {
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
      // 這裡可以呼叫一個「取得當前使用者資訊」的 API
      // 或者從 Token 中解析（需要安裝 jwt-decode）
      // 暫時先不實作，等後端提供對應 API
    }
  }

  /**
   * 檢查是否有特定權限
   */
  function hasPermission(permission: string): boolean {
    return userPermissions.value.includes(permission)
  }

  /**
   * 檢查是否有特定角色
   */
  function hasRole(role: string): boolean {
    return userRoles.value.includes(role)
  }

  return {
    // State
    userInfo,
    loading,
    errorMessage,

    // Getters
    isAuthenticated,
    userRoles,
    userPermissions,

    // Actions
    login,
    logout,
    restoreUserInfo,
    hasPermission,
    hasRole,
  }
})
