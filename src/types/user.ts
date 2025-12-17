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
  isAdmin: boolean // 是否為系統管理員
  isSales: boolean // 是否為業務人員
  isManager: boolean // 是否為主管
}

export interface UserListItem {
  // 新增（列表用）
  loginId: string
  name: string
  email: string
  roles: string[]
  statusCode: 'ACTIVE' | 'INACTIVE'
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

/**
 * 使用者詳細資訊
 * 用於 Drawer 顯示
 */
export interface UserDetailInfo {
  userId: string // 使用者 ID（登入帳號）
  userName: string // 使用者名稱
  password: string // 密碼
  email: string // Email
  statusCode: 'ACTIVE' | 'INACTIVE' // 狀態碼
  permissions: string[] // 功能權限代號清單
  roleIds: number[] // 角色 ID 清單
  roles: string[] // 角色名稱清單
  createdBy: { id: string; name: string } | null // 建立者
  updatedBy: { id: string; name: string } | null // 更新者
  createdAt: string // 建立時間
  updatedAt: string | null // 更新時間
}

/**
 * 更新使用者請求
 */
export interface UpdateUserRequest {
  /** 使用者姓名 */
  name: string
  /** Email */
  email: string
  /** 角色 ID 列表 */
  roleIds: number[]
  /** 使用狀態 */
  statusCode: 'ACTIVE' | 'INACTIVE'
}
