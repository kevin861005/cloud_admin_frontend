import type { DockerServiceInfo } from './service'

/**
 * 環境相關型別定義
 *
 * 檔案位置：src/types/environment.ts
 */

/**
 * 環境狀態
 */
export type EnvironmentStatus = 'PENDING' | 'NOTIFIED' | 'TO_BE_DELETED'

/**
 * 使用模組
 */
export type CustomerModule = 'Master' | 'GGF'

/**
 * 環境列表資料
 */
export interface EnvironmentListItem {
  /** 環境 ID */
  id: number

  /** 客戶名稱 */
  customerName: string

  /** 使用狀態 */
  status: EnvironmentStatus

  /** 申請日 */
  appliedDate: string

  /** 通知日 */
  notifiedDate: string

  /** 預定刪除日 */
  schedulatedDeleteDate: string

  /** 申請人 */
  applicant: string
}

export interface EnvironmentDetailInfo {
  customerName: string // 客戶名稱（例如：橘色測測屋）
  industry: string // 行業類別（例如：餐飲）
  status: EnvironmentStatus // 環境狀態（申請中、已通知、待刪除）
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

/**
 * 重啟環境回應
 */
export interface RestartEnvironmentResponse {
  /** 重啟是否成功 */
  success: boolean
  /** 訊息（成功或失敗的描述） */
  message: string
  /** 重啟耗時（毫秒） */
  duration: number | null
  /** Docker 服務資訊（重啟後的最新狀態） */
  docker: DockerServiceInfo | null
}
