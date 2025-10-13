/**
 * 總覽相關的 TypeScript 型別定義
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
 * 月度成長資料
 */
export interface CustomerGrowthData {
  /** 成長百分比 */
  growthRate: number
  /** 當月客戶數 */
  currentMonthCount: number
  /** 上月客戶數 */
  lastMonthCount: number
}

/**
 * 警示類型（保留彈性，未來可擴充）
 */
export type AlertType =
  | 'RUNTIME_ERROR' // 運行異常
  | 'CREATE_FAILED' // 建立失敗
// 未來可新增其他類型，例如：
// | 'CONNECTION_LOST'  // 連線中斷
// | 'DATA_SYNC_ERROR'  // 資料同步失敗
// | 'LICENSE_EXPIRED'  // 授權過期

/**
 * 警示項目
 */
export interface AlertItem {
  id: string // 警示 ID
  type: AlertType // 警示類型
  customerName: string // 客戶名稱
  occurredAt: string // 異常發生時間（已格式化：2024.09.12 14:30）
}

/**
 * 警示列表回應（data 部分）
 */
export interface AlertListData {
  alerts: AlertItem[] // 警示列表
  totalCount: number // 總筆數
}
