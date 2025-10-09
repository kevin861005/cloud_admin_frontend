/**
 * Dashboard 相關的 TypeScript 型別定義
 */

/**
 * 客戶統計資料
 */
export interface CustomerStats {
  /** 總客戶數 */
  totalCustomers: number
  /** 活躍客戶數 (3天內使用) */
  activeCount: number
  /** 活躍客戶百分比 */
  activePercentage: number
  /** 低活躍客戶數 (4-7天內使用) */
  lowActiveCount: number
  /** 低活躍客戶百分比 */
  lowActivePercentage: number
  /** 未使用客戶數 (7天以上未使用) */
  inactiveCount: number
  /** 未使用客戶百分比 */
  inactivePercentage: number
}

/**
 * API 統一回應格式 (泛型)
 */
export interface ApiResponse<T> {
  success: boolean
  message: string
  code?: string
  data: T | null
}
