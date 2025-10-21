/**
 * 使用者相關型別定義
 */

/**
 * 使用者資訊
 *
 * 用途：
 * 1. API 回應：GET /api/users/me
 * 2. Store 狀態：authStore.userInfo
 */
export interface UserInfo {
  userId: string // 使用者 ID
  userName: string // 使用者名稱
  email: string // Email
  permissions: string[] // 功能權限代號清單
  roles: string[] // 角色清單
}

export interface UserListItem {
  // 新增（列表用）
  loginId: string
  name: string
  email: string
  roles: string[]
  status: string
  statusCode: string
  createdAt: string
  updatedAt: string
}

/**
 * 新增使用者請求
 */
export interface CreateUserRequest {
  /** 登入帳號 */
  loginId: string
  /** 密碼 */
  password: string
  /** 姓名 */
  name: string
  /** Email */
  email: string
  /** 角色 ID 列表 */
  roleIds: number[]
}
