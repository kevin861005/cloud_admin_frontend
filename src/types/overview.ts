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
 * 警示類型（）
 */
export type AlertType =
  | 'RUNTIME_ERROR' // 運行異常
  | 'CREATE_FAILED' // 建立失敗

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

/**
 * 需關注客戶單筆資料
 */
export interface AttentionCustomer {
  id: string // 客戶 ID
  customerName: string // 客戶名稱
  lastUsedTime: string // 最後使用時間（相對時間，例如：4天前）
  salesPerson: string // 負責業務
}

/**
 * 需關注客戶列表回應（data 部分）
 */
export interface AttentionCustomersData {
  customers: AttentionCustomer[] // 需關注客戶列表
  totalCount: number // 總筆數
}

export interface ModuleUsageDataPoint {
  label: string
  master: number
  ggf: number
  hr: number
  esg: number
}

export interface ModuleUsageData {
  weekly: ModuleUsageDataPoint[]
  monthly: ModuleUsageDataPoint[]
}

export type ChartViewType = 'weekly' | 'monthly'

/**
 * CardList 元件相關型別定義
 * 用於 @/types/overview.ts
 */

/**
 * CardList 欄位配置
 */
export interface CardListColumn {
  /** 欄位 key（對應資料物件的屬性名稱） */
  key: string

  /** 欄位顯示標籤 */
  label: string

  /** Flex 比例（預設 1，表示平均分配） */
  flex?: number

  /** 是否可排序（預設 false） */
  sortable?: boolean

  /** 是否顯示 tooltip（預設 false） */
  showTooltip?: boolean

  /** 文字對齊方式（預設 left） */
  align?: 'left' | 'center' | 'right'
}

/**
 * 排序狀態
 */
export interface CardListSortState {
  /** 當前排序的欄位 key */
  key: string | null

  /** 排序方向: asc(升冪) | desc(降冪) | null(無排序) */
  order: 'asc' | 'desc' | null
}

/**
 * CardList Props
 */
export interface CardListProps<T = unknown> {
  /** 卡片標題 */
  title: string

  /** 資料陣列 */
  data: T[]

  /** 欄位定義 */
  columns: CardListColumn[]

  /** 每頁顯示筆數（預設 6） */
  pageSize?: number

  /** 卡片高度（預設 '396px'） */
  height?: string

  /** 載入狀態（預設 false） */
  loading?: boolean

  /** 錯誤訊息 */
  error?: string

  /** 空資料標題 */
  emptyTitle?: string

  /** 空資料描述 */
  emptyDescription?: string
}
