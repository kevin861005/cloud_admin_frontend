/**
 * 任務進度相關型別定義
 */

/**
 * 任務狀態
 */
export type TaskStatus = 'running' | 'completed' | 'error'

/**
 * SSE 進度事件資料
 */
export interface TaskProgressEvent<T = unknown> {
  /** 當前步驟編號（從 1 開始） */
  step: number
  /** 總步驟數 */
  totalSteps: number
  /** 當前步驟描述 */
  message: string
  /** 任務狀態 */
  status: TaskStatus
  /** 進度百分比 (0-100) */
  progress: number
  /** 完成時的回傳資料 */
  data: T | null
}

/**
 * 啟動任務的 API 回應
 */
export interface StartTaskResponse {
  /** 任務 ID，用於建立 SSE 連線 */
  taskId: string
}

/**
 * SSE 連線回調函數
 */
export interface TaskProgressCallbacks<T = unknown> {
  /** 收到進度更新時 */
  onProgress?: (event: TaskProgressEvent<T>) => void
  /** 任務完成時 */
  onCompleted?: (event: TaskProgressEvent<T>) => void
  /** 任務錯誤時 */
  onError?: (event: TaskProgressEvent<T>) => void
  /** SSE 連線錯誤時 */
  onConnectionError?: () => void
}
