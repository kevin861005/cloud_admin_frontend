/**
 * 客戶相關型別定義
 *
 * 檔案位置：src/types/customer.ts
 */

/**
 * 客戶狀態
 */
export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'UNUSED'

/**
 * 使用模組
 */
export type CustomerModule = 'Master' | 'GGF'

/**
 * 客戶資料
 */
export interface CustomerListItem {
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
export type CustomerListResponse = CustomerListItem[]

export interface CustomerDetailInfo {
  customerName: string // 客戶名稱（例如：橘色測測屋）
  industry: string // 行業類別（例如：餐飲）
  status: CustomerStatus // 客戶狀態（活躍、低活躍、未使用）
  autoUrl: string // 快速自動輸入網址
  frontendUrl: string // 前台連結網址
  backendUrl: string // 後台連結網址
  pinCode: string // PinCode（可能以 0 開頭，使用字串格式）
  domainName: string // 環境域名
  createdAt: string // 建立日期（例如：2025.02.12）
  usageTime: string // 使用時間（例如：4天前）
  module: CustomerModule // 模組類型（Master 或 GGF）
  salesPerson: string // 負責業務
  contactPerson: string // 聯絡人姓名
  phone: string // 聯絡電話
  email: string // 聯絡 E-mail
}
