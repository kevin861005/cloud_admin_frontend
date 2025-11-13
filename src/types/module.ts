/**
 * 模組相關型別定義
 *
 * 檔案位置：src/types/module.ts
 */

/**
 * 模組狀態
 */
export type ModuleStatus = 'ACTIVE' | 'INACTIVE'

/**
 * 模組列表資料
 */
export interface ModuleListItem {
  /** 模組 ID */
  id: number

  /** 模組代號 */
  code: string

  /** 模組名稱 */
  name: string

  /** 狀態 */
  status: ModuleStatus

  /** 建立日期 */
  createdAt: string

  /** 建立者 */
  createdBy: { id: string; name: string } | null
}
