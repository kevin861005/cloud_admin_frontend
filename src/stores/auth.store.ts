/**
 * 認證狀態管理 Store
 *
 * 功能：
 * 1. 管理登入狀態
 * 2. 儲存使用者資訊（從 /api/users/me 取得）
 * 3. 提供權限檢查方法
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
   * ✨ 新增：響應式的 Token 狀態追蹤
   * 用於解決 localStorage 不是響應式的問題
   */
  const hasToken = ref(false)

  // ==================== Getters ====================

  /**
   * 是否已登入
   *
   * 判斷條件：
   * 1. hasToken 為 true（響應式追蹤 localStorage 中的 Token）
   * 2. userInfo 不為 null（已呼叫 /api/users/me 取得資訊）
   */
  const isAuthenticated = computed(() => {
    const authenticated = hasToken.value && userInfo.value !== null

    // 診斷日誌（生產環境可移除）
    console.log('[Auth Store] isAuthenticated 計算:')
    console.log('  hasToken:', hasToken.value)
    console.log('  userInfo:', userInfo.value ? '✅' : '❌')
    console.log('  結果:', authenticated ? '✅ 已認證' : '❌ 未認證')

    return authenticated
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
   * 使用者名稱（用於顯示在 Container）
   */
  const userName = computed(() => userInfo.value?.userName || '')

  // ==================== Actions ====================

  /**
   * 登入
   *
   * 流程：
   * 1. 呼叫 /api/auth/login 取得 Token
   * 2. 儲存 Token 到 localStorage 並更新響應式狀態
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
        console.log('❌ 登入 API 失敗:', errorMessage.value)
        return false
      }

      console.log('✅ 登入 API 成功')

      // 步驟 2: 儲存 Token 到 localStorage 並更新響應式狀態
      console.log('2. 儲存 Token')
      const { accessToken, refreshToken } = loginResponse.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      // ✨ 關鍵：更新響應式狀態
      hasToken.value = true

      console.log('✅ Token 儲存完成')
      console.log('   accessToken:', accessToken.substring(0, 20) + '...')
      console.log('   hasToken.value:', hasToken.value)

      // 步驟 3: 呼叫 /api/users/me 取得使用者資訊
      console.log('3. 呼叫 /api/users/me')
      const userInfoResponse = await userService.getCurrentUserInfo()

      if (!userInfoResponse.success || !userInfoResponse.data) {
        // 如果無法取得使用者資訊，清除 Token 並返回失敗
        console.log('❌ 無法取得使用者資訊')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        hasToken.value = false
        errorMessage.value = '無法取得使用者資訊'
        return false
      }

      console.log('✅ 取得使用者資訊成功')

      // 步驟 4: 儲存使用者資訊到 Store
      console.log('4. 儲存使用者資訊到 Store')
      userInfo.value = {
        userId: userInfoResponse.data.userId,
        userName: userInfoResponse.data.userName,
        email: userInfoResponse.data.email,
        permissions: userInfoResponse.data.permissions,
        roles: userInfoResponse.data.roles,
      }

      console.log('✅ 使用者資訊儲存完成')
      console.log('   userName:', userInfo.value.userName)
      console.log('   permissions:', userInfo.value.permissions.length, '個權限')

      // 驗證最終狀態
      console.log('=== 最終狀態驗證 ===')
      console.log('  hasToken.value:', hasToken.value)
      console.log('  userInfo.value:', userInfo.value ? '✅' : '❌')
      console.log('  isAuthenticated.value:', isAuthenticated.value)
      console.log('=== Auth Store: 登入完成 ===')

      // 登入成功
      return true
    } catch (err) {
      console.error('❌ 登入錯誤:', err)

      // 處理錯誤訊息
      const error = err as AxiosError<ApiResponse<null>>

      if (error.response?.data?.message) {
        errorMessage.value = error.response.data.message
      } else if (error.message) {
        errorMessage.value = error.message
      } else {
        errorMessage.value = '登入失敗，請稍後再試'
      }

      // 清除可能已儲存的 Token
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
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
   * 1. 呼叫 /api/auth/logout 撤銷 Refresh Token
   * 2. 清除 localStorage 中的 Token
   * 3. 清除響應式狀態
   * 4. 清除 userInfo
   * 5. 跳轉到登入頁
   */
  async function logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch (err) {
      console.error('登出錯誤:', err)
      // 即使登出 API 失敗，仍然清除本地資料
    } finally {
      // 清除本地資料
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      hasToken.value = false
      userInfo.value = null

      // 跳轉到登入頁
      router.push('/login')
    }
  }

  /**
   * 從 Token 恢復使用者資訊
   *
   * 用途：頁面重新整理時，如果 localStorage 中有 Token，
   * 則呼叫 /api/users/me 重新取得使用者資訊
   */
  async function restoreUserInfo(): Promise<void> {
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
      hasToken.value = false
      return
    }

    // 有 Token，更新響應式狀態
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
        console.log('✅ 恢復使用者資訊成功:', userInfo.value.userName)
      } else {
        // 如果無法取得使用者資訊，清除 Token
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        hasToken.value = false
        console.log('❌ 恢復使用者資訊失敗')
      }
    } catch (err) {
      console.error('恢復使用者資訊錯誤:', err)
      // 如果 API 呼叫失敗，清除 Token
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      hasToken.value = false
    }
  }

  /**
   * 檢查是否有特定權限
   *
   * @param permission 權限代號（例如：'overview', 'settings.accounts'）
   * @returns true 表示有權限，false 表示無權限
   */
  function hasPermission(permission: string): boolean {
    return userPermissions.value.includes(permission)
  }

  /**
   * 檢查是否有特定角色
   *
   * @param role 角色名稱（例如：'ADMIN', 'USER'）
   * @returns true 表示有角色，false 表示無角色
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
