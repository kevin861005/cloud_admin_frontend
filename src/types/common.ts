/**
 * 通用型別定義
 * 存放整個專案共用的基礎型別
 */

/**
 * API 統一回應格式 (泛型)
 */
export interface ApiResponse<T> {
  /** 請求是否成功 */
  success: boolean

  /** 回應訊息 */
  message: string

  /** 錯誤代碼（選填） */
  code?: string

  /** 回應資料（泛型） */
  data: T | null

  /** 伺服器回應時間戳記（ISO 8601 格式，UTC 時區）
   * 範例：2025-10-13T06:30:45.123Z
   */
  timestamp: string
}
