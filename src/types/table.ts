/**
 * Table 元件相關型別定義
 * 用於通用的資料表格元件
 */

/**
 * 欄位對齊方式
 */
export type ColumnAlign = 'left' | 'center' | 'right'

/**
 * 自訂渲染類型
 */
export type CustomRenderType = 'badge' | 'link' | 'actions' | 'slot'

/**
 * 排序方向
 */
export type SortOrder = 'asc' | 'desc' | null

/**
 * 連結配置
 */
export interface LinkConfig {
  target?: '_blank' | '_self' // 開啟方式（預設 '_blank'）
  showIcon?: boolean // 是否顯示外部連結圖示（預設 false）
}

/**
 * 欄位配置
 */
export interface ColumnConfig {
  key: string // 資料欄位 key（對應 data 中的屬性名稱）
  label: string // 欄位標題（顯示在表格 header）
  width?: string // 欄位寬度（例如：'200px'、'20%'、不設定則自動分配）
  align?: ColumnAlign // 對齊方式（預設 'left'）
  sortable?: boolean // 是否可排序（預設 false）

  // 自訂渲染相關
  customRender?: CustomRenderType // 自訂渲染類型
  linkConfig?: LinkConfig // 連結配置（customRender='link' 時使用）
  slotName?: string // 自訂 slot 名稱（customRender='slot' 時使用）
}

/**
 * 排序狀態
 */
export interface SortState {
  key: string | null // 目前排序的欄位 key
  order: SortOrder // 排序方向
}

/**
 * 篩選器選項
 */
export interface FilterOption {
  label: string // 顯示文字
  value: string | number // 實際值
}

/**
 * 篩選器配置
 */
export interface FilterConfig {
  key: string // 篩選欄位（例如：'status'）
  label: string // 顯示標籤（例如：「狀態:」）
  options: FilterOption[] // 選項列表
  defaultValue?: string | number // 預設值（預設為第一個選項的 value）
}

/**
 * 篩選器值（key-value 對應）
 * 例如：{ status: 'active', module: 'Master' }
 */
export type FilterValues = Record<string, string | number>

/**
 * 批次操作按鈕配置
 */
export interface BatchActionConfig {
  key: string // 操作識別碼
  label: string // 按鈕文字
  icon?: string // 圖示（可選）
  type?: 'primary' | 'danger' | 'default' // 按鈕類型（預設 'default'）
  confirmMessage?: string // 確認訊息（設定後會顯示確認對話框）
}

/**
 * Data Table 主元件的 Props（泛型版本）
 * @template T - 表格資料的型別
 */
export interface DataTableProps<T = Record<string, unknown>> {
  // ===== 1. 標題區 =====
  title: string // 標題文字（例如：「客戶列表」）
  totalCount: number // 總資料數（例如：16）
  showAddButton?: boolean // 是否顯示「新增」按鈕（預設 false）
  addButtonText?: string // 新增按鈕文字（預設：「新增」）

  // ===== 2. 查詢條件（階段二）=====
  filters?: FilterConfig[] // 篩選器配置（可選）

  // ===== 3. 搜尋框（階段二）=====
  searchPlaceholder?: string // 搜尋框提示文字（預設：「搜尋...」）
  searchValue?: string // 搜尋關鍵字（v-model）

  // ===== 4. 表格 =====
  columns: ColumnConfig[] // 欄位配置
  data: T[] // 表格資料（原始完整資料，分頁由元件內部處理）
  loading?: boolean // 載入狀態（預設 false）
  emptyText?: string // 無資料時的提示文字（預設：「暫無資料」）

  // ===== 5. 分頁 =====
  pageSize?: number // 每頁顯示筆數（預設 10）
  pageSizeOptions?: number[] // 筆數選項（預設：[10, 20, 50, 100]）

  // ===== 6. 勾選功能（階段二）=====
  showCheckbox?: boolean // 是否顯示勾選框（預設 false）
  selectedIds?: (string | number)[] // 已選擇的項目 ID（v-model）
  rowKey?: string // 資料的唯一識別欄位（預設 'id'）
  batchActions?: BatchActionConfig[] // 批次操作按鈕配置
}

/**
 * 分頁資訊
 */
export interface PaginationInfo {
  currentPage: number // 目前頁碼（從 0 開始）
  pageSize: number // 每頁顯示筆數
  totalPages: number // 總頁數
  totalElements: number // 總資料數
  startIndex: number // 目前頁的起始索引（從 0 開始）
  endIndex: number // 目前頁的結束索引
}
