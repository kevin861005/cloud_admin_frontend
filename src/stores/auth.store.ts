/**
 * 認證狀態管理 Store
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoginRequest } from '@/types/auth'
import type { UserInfo } from '@/types/user'
import { authService } from '@/services/auth.service'
import { userService } from '@/services/user.service'
import { useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { ApiError } from '@/types/common'
import { useMenuStore } from '@/stores/menu.store'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // ==================== State ====================

  const userInfo = ref<UserInfo | null>(null)
  const loading = ref(false)
  const errorMessage = ref<string | null>(null)
  const hasToken = ref(false)

  // ==================== Getters ====================

  const isAuthenticated = computed(() => {
    return hasToken.value && userInfo.value !== null
  })

  const userRoles = computed(() => userInfo.value?.roles || [])
  const userPermissions = computed(() => userInfo.value?.permissions || [])
  const userName = computed(() => userInfo.value?.userName || '')

  // ==================== Actions ====================

  /**
   * 登入
   */
  async function login(loginData: LoginRequest): Promise<boolean> {
    loading.value = true
    errorMessage.value = null

    console.log('=== Auth Store: 登入流程開始 ===')

    try {
      // 步驟 1: 呼叫登入 API（成功回傳 LoginResponse，失敗丟 ApiError）
      console.log('1. 呼叫登入 API')
      const loginResult = await authService.login(loginData)
      console.log('登入 API 成功')

      // 步驟 2: 儲存 Access Token
      console.log('2. 儲存 Access Token')
      const { accessToken } = loginResult

      localStorage.setItem('accessToken', accessToken)
      hasToken.value = true
      console.log('   Access Token 儲存完成')

      // 步驟 3: 呼叫 /api/users/me 取得使用者資訊（成功回 UserInfo，失敗丟 ApiError）
      console.log('3. 呼叫 /api/users/me')
      const currentUser = await userService.getCurrentUserInfo()
      console.log('取得使用者資訊成功')

      // 步驟 4: 儲存使用者資訊到 Store
      console.log('4. 儲存使用者資訊到 Store')
      userInfo.value = {
        userId: currentUser.userId,
        userName: currentUser.userName,
        email: currentUser.email,
        permissions: currentUser.permissions,
        roles: currentUser.roles,
      }

      console.log('=== Auth Store: 登入完成 ===')
      return true
    } catch (err: unknown) {
      console.error('登入錯誤:', err)

      if (err instanceof ApiError) {
        // 後端業務錯誤（例如帳密錯誤）
        errorMessage.value = err.message || '登入失敗，請稍後再試'
      } else if (isAxiosError(err)) {
        // Axios 層級錯誤（例如網路問題）
        const errorResponse = err.response?.data as { message?: string } | undefined

        if (errorResponse?.message) {
          errorMessage.value = errorResponse.message
        } else if (err.message) {
          errorMessage.value = err.message
        } else {
          errorMessage.value = '登入失敗，請稍後再試'
        }
      } else {
        // 其他非預期錯誤
        errorMessage.value = '登入失敗，請稍後再試'
      }

      // 清除 Access Token 與使用者資訊
      localStorage.removeItem('accessToken')
      hasToken.value = false
      userInfo.value = null

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
      await authService.logout()
    } catch (err) {
      console.error('登出錯誤:', err)
    } finally {
      localStorage.removeItem('accessToken')
      hasToken.value = false
      userInfo.value = null

      const menuStore = useMenuStore()
      menuStore.resetMenuState()

      router.push('/login')
    }
  }

  /**
   * 從 Token 恢復使用者資訊
   */
  async function restoreUserInfo(): Promise<void> {
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
      hasToken.value = false
      return
    }

    hasToken.value = true

    try {
      const currentUser = await userService.getCurrentUserInfo()

      userInfo.value = {
        userId: currentUser.userId,
        userName: currentUser.userName,
        email: currentUser.email,
        permissions: currentUser.permissions,
        roles: currentUser.roles,
      }
      console.log('恢復使用者資訊成功:', userInfo.value.userName)
    } catch (err) {
      console.error('恢復使用者資訊錯誤:', err)
      localStorage.removeItem('accessToken')
      hasToken.value = false
      userInfo.value = null
    }
  }

  function hasPermission(permission: string): boolean {
    return userPermissions.value.includes(permission)
  }

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
    userName,

    // Actions
    login,
    logout,
    restoreUserInfo,
    hasPermission,
    hasRole,
  }
})
