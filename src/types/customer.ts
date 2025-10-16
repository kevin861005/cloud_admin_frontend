/**
 * 客戶相關型別定義
 *
 * 檔案位置：src/types/customer.ts
 */

/**
 * 客戶狀態
 */
export type CustomerStatus = '活躍' | '低活躍' | '未使用'

/**
 * 使用模組
 */
export type CustomerModule = 'Master' | 'GGF'

/**
 * 客戶資料
 */
export interface Customer {
  /** 客戶 ID */
  id: number

  /** 客戶名稱 */
  name: string

  /** 使用狀態 */
  status: CustomerStatus

  /** 最後使用時間（格式：YYYY-MM-DD） */
  lastUsed: string

  /** 使用模組 */
  module: CustomerModule

  /** 業務窗口 */
  sales: string

  /** 產業別 */
  industry: string

  /** 網站連結（不含 https://） */
  link: string
}

/**
 * 客戶列表回應
 * 使用專案的 ApiResponse<T> 格式
 */
export type CustomerListResponse = Customer[]
