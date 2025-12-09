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
 * 服務運行狀態
 */
export type ServiceStatus = 'RUNNING' | 'NORMAL' | 'ERROR' | 'STOPPED'

/**
 * 客戶列表資料
 */
export interface CustomerListItem {
  /** 客戶 ID */
  id: string

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

export interface CustomerDrawerInfo {
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

  /** 最新活動記錄（最多顯示 4 筆） */
  activities: ActivityRecord[]

  /** 系統環境與運行狀態 */
  systemEnvironment: SystemEnvironment
}

/**
 * 活動記錄項目
 */
export interface ActivityRecord {
  /** 日期時間（例如：2024.09.12 下午14:30） */
  datetime: string
  /** 模組類別（例如：人事管理） */
  module: string
  /** 操作名稱（例如：新增員工資料） */
  action: string
}

/**
 * Docker 服務資訊
 */
export interface DockerServiceInfo {
  /** 運行狀態 */
  status: ServiceStatus
  /** 狀態描述（例如：運行中） */
  statusText: string
  /** 名稱（例如：v2.4.1） */
  name: string
  /** 容器 ID（例如：C1923hC3e） */
  containerId: string
  /** 映像版本（例如：v2.4.1） */
  imageVersion: string
  /** Port 對射（例如：8080 → 80） */
  portMapping: string
}

/**
 * 資料庫服務資訊
 */
export interface DatabaseServiceInfo {
  /** 運行狀態 */
  status: ServiceStatus
  /** 狀態描述（例如：正常） */
  statusText: string
  /** 名稱（例如：Twfood_production） */
  name: string
  /** 伺服器 ID（例如：192.168.1100） */
  serverId: string
  /** 資料庫容量（例如：2.4GB） */
  capacity: string
}

/**
 * DNS 服務資訊
 */
export interface DnsServiceInfo {
  /** 運行狀態 */
  status: ServiceStatus
  /** 狀態描述（例如：DNS紀錄有效） */
  statusText: string
  /** 主要伺服器（例如：8.8.8.8） */
  primaryServer: string
  /** 次要伺服器（例如：8.8.4.4） */
  secondaryServer: string
  /** 最後檢查時間（例如：2024.01.15下午14:30） */
  lastChecked: string
}

/**
 * NGINX 服務資訊
 */
export interface NginxServiceInfo {
  /** 運行狀態 */
  status: ServiceStatus
  /** 狀態描述（例如：代理運行） */
  statusText: string
  /** 版本（例如：1.34.2） */
  version: string
  /** 配置狀態（例如：有效） */
  configStatus: string
  /** 最後重載時間（例如：2024.01.15下午14:30） */
  lastReload: string
}

/**
 * 系統環境與運行狀態
 */
export interface SystemEnvironment {
  /** Docker 服務狀態 */
  docker: DockerServiceInfo

  /** 資料庫服務狀態 */
  database: DatabaseServiceInfo

  /** DNS 服務狀態 */
  dns: DnsServiceInfo

  /** NGINX 服務狀態 */
  nginx: NginxServiceInfo

  /** 效能監控資料 */
  performance: PerformanceMetrics

  /** 系統紀錄（預設顯示最新 5 筆） */
  systemLogs: SystemLog[]
}

/**
 * 效能監控指標
 */
export interface PerformanceMetrics {
  /** CPU 使用率（0-100） */
  cpu: number

  /** 記憶體使用率（0-100） */
  memory: number

  /** 磁碟使用率（0-100） */
  disk: number
}

/**
 * 系統紀錄項目
 */
export interface SystemLog {
  /** 日期時間（例如：2024.09.12 下午14:30） */
  datetime: string

  /** 服務名稱（例如：DNS、資料庫、NGINX） */
  service: string

  /** 紀錄內容（例如：解析更新完成、容器健康檢查通過） */
  message: string
}

/**
 * 效能監控等級（根據百分比判斷）
 */
export type PerformanceLevel = 'GOOD' | 'WARNING' | 'CRITICAL'

/**
 * 根據百分比取得效能等級
 */
export function getPerformanceLevel(percentage: number): PerformanceLevel {
  if (percentage <= 60) return 'GOOD'
  if (percentage <= 80) return 'WARNING'
  return 'CRITICAL'
}
