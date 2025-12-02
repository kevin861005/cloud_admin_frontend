/**
 * 認證狀態管理 Store
 *
 * 功能：
 * 1. 管理登入狀態
 * 2. 儲存使用者資訊（從 /api/users/me 取得）
 * 3. 提供權限檢查方法
 *
 * 安全機制：
 * - Access Token：儲存在 localStorage（短期有效）
 * - Refresh Token：由後端設為 HttpOnly Cookie（前端無法存取）
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoginRequest } from '@/types/auth'
import type { ApiResponse } from '@/types/common'
import type { UserInfo } from '@/types/user'
import { authService } from '@/services/auth.service'
import { userService } from '@/services/user.service'
import { useRouter } from 'vue-router'
import type { AxiosError } from 'axios'
import { useMenuStore } from '@/stores/menu.store'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // ==================== State ====================

  /**
   * 使用者資訊（從 /api/users/me 取得）
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

  /**
   * 響應式的 Token 狀態追蹤
   * 用於解決 localStorage 不是響應式的問題
   */
  const hasToken = ref(false)

  // ==================== Getters ====================

  /**
   * 是否已登入
   *
   * 判斷條件：
   * 1. hasToken 為 true（響應式追蹤 localStorage 中的 Access Token）
   * 2. userInfo 不為 null（已呼叫 /api/users/me 取得資訊）
   */
  const isAuthenticated = computed(() => {
    return hasToken.value && userInfo.value !== null
  })

  /**
   * 使用者角色清單
   */
  const userRoles = computed(() => userInfo.value?.roles || [])

  /**
   * 使用者權限清單
   */
  const userPermissions = computed(() => userInfo.value?.permissions || [])

  /**
   * 使用者名稱（用於顯示在 Header）
   */
  const userName = computed(() => userInfo.value?.userName || '')

  // ==================== Actions ====================

  /**
   * 登入
   *
   * 流程：
   * 1. 呼叫 /api/auth/login 取得 Access Token（Refresh Token 由後端設為 HttpOnly Cookie）
   * 2. 儲存 Access Token 到 localStorage
   * 3. 呼叫 /api/users/me 取得使用者資訊
   * 4. 儲存使用者資訊到 Store
   *
   * @param loginData 登入資料（帳號、密碼）
   * @returns 是否登入成功
   */
  async function login(loginData: LoginRequest): Promise<boolean> {
    loading.value = true
    errorMessage.value = null

    console.log('=== Auth Store: 登入流程開始 ===')

    try {
      // 步驟 1: 呼叫登入 API
      console.log('1. 呼叫登入 API')
      const loginResponse = await authService.login(loginData)

      if (!loginResponse.success || !loginResponse.data) {
        errorMessage.value = loginResponse.message || '登入失敗'
        console.log('登入 API 失敗:', errorMessage.value)
        return false
      }

      console.log('登入 API 成功')

      // 步驟 2: 只儲存 Access Token（Refresh Token 由後端設為 HttpOnly Cookie）
      console.log('2. 儲存 Access Token')
      const { accessToken } = loginResponse.data

      localStorage.setItem('accessToken', accessToken)
      hasToken.value = true

      console.log('   Access Token 儲存完成')

      // 步驟 3: 呼叫 /api/users/me 取得使用者資訊
      console.log('3. 呼叫 /api/users/me')
      const userInfoResponse = await userService.getCurrentUserInfo()

      if (!userInfoResponse.success || !userInfoResponse.data) {
        console.log('無法取得使用者資訊')
        localStorage.removeItem('accessToken')
        hasToken.value = false
        errorMessage.value = '無法取得使用者資訊'
        return false
      }

      console.log('取得使用者資訊成功')

      // 步驟 4: 儲存使用者資訊到 Store
      console.log('4. 儲存使用者資訊到 Store')
      userInfo.value = {
        userId: userInfoResponse.data.userId,
        userName: userInfoResponse.data.userName,
        email: userInfoResponse.data.email,
        permissions: userInfoResponse.data.permissions,
        roles: userInfoResponse.data.roles,
      }

      console.log('=== Auth Store: 登入完成 ===')
      return true
    } catch (err) {
      console.error('登入錯誤:', err)

      const error = err as AxiosError<ApiResponse<null>>

      if (error.response?.data?.message) {
        errorMessage.value = error.response.data.message
      } else if (error.message) {
        errorMessage.value = error.message
      } else {
        errorMessage.value = '登入失敗，請稍後再試'
      }

      // 清除 Access Token
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
   *
   * 流程：
   * 1. 呼叫 /api/auth/logout（後端會從 Cookie 讀取並撤銷 Refresh Token，然後清除 Cookie）
   * 2. 清除 localStorage 中的 Access Token
   * 3. 清除 Store 狀態
   * 4. 跳轉到登入頁
   */
  async function logout(): Promise<void> {
    try {
      // 呼叫登出 API（不需要傳參數，Refresh Token 由 Cookie 攜帶）
      await authService.logout()
    } catch (err) {
      console.error('登出錯誤:', err)
    } finally {
      // 清除本地 Access Token
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
   *
   * 用途：頁面重新整理時，如果 localStorage 中有 Access Token，
   * 則呼叫 /api/users/me 重新取得使用者資訊
   */
  async function restoreUserInfo(): Promise<void> {
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
      hasToken.value = false
      return
    }

    hasToken.value = true

    try {
      const userInfoResponse = await userService.getCurrentUserInfo()

      if (userInfoResponse.success && userInfoResponse.data) {
        userInfo.value = {
          userId: userInfoResponse.data.userId,
          userName: userInfoResponse.data.userName,
          email: userInfoResponse.data.email,
          permissions: userInfoResponse.data.permissions,
          roles: userInfoResponse.data.roles,
        }
        console.log('恢復使用者資訊成功:', userInfo.value.userName)
      } else {
        // 無法取得使用者資訊，清除 Access Token
        localStorage.removeItem('accessToken')
        hasToken.value = false
        console.log('恢復使用者資訊失敗')
      }
    } catch (err) {
      console.error('恢復使用者資訊錯誤:', err)
      localStorage.removeItem('accessToken')
      hasToken.value = false
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

  // ==================== Return ====================

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
