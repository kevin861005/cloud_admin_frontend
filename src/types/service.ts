/**
 * 服務運行狀態
 */
export type ServiceStatus = 'RUNNING' | 'NORMAL' | 'ERROR' | 'EXITED'

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
  /** 可否更新映像檔 */
  canUpdateImage: boolean
  /** 可否重啟環境 */
  canRestart: boolean
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
  /** 完整域名（例如：demo.twfood.com） */
  domainName: string
  /** 紀錄類型（A、CNAME、TXT 等） */
  recordType: string
  /** 紀錄值（IP 位址或域名） */
  recordValue: string
  /** TTL 存活時間（秒） */
  ttl: number
}

/**
 * NGINX 服務資訊
 */
export interface NginxServiceInfo {
  /** 運行狀態 */
  status: ServiceStatus
  /** 狀態描述（例如：運行中） */
  statusText: string
  /** 主要域名（例如：demo.twfood.com） */
  primaryDomain: string
  /** 轉發目標 IP 或域名（例如：192.168.1.100） */
  forwardHost: string
  /** 轉發 Port（例如：8080） */
  forwardPort: number
  /** SSL 是否啟用 */
  sslEnabled: boolean
}

/**
 * Docker 映像資訊
 */
export interface DockerImage {
  /** 映像 ID */
  id: string
  /** 映像檔名 */
  name: string
  /** 建立時間 */
  createdAt: string
  /** 容量（已格式化，如 "2.21GB"） */
  size: string
  /** 是否為最新版本 */
  isLatest: boolean
}
