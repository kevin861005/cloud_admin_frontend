/**
 * 模組相關型別定義
 *
 * 檔案位置：src/types/module.ts
 */

/**
 * 模組列表資料
 */
export interface ModuleListItem {
  /** 模組代號 */
  code: string

  /** 模組名稱 */
  name: string

  /** 狀態 */
  isActive: boolean

  /** 建立日期 */
  createdDate: string
}

export interface ModuleDetailInfo {
  /** 模組代號 */
  code: string

  /** 模組名稱 */
  name: string

  /** 狀態 */
  isActive: boolean

  /** 建立日期 */
  createdDate: string

  /** 建立者 */
  createdBy: { id: string; name: string } | null
}

export interface CreateModuleRequest {
  /** 代號 */
  code: string

  /** 名稱 */
  name: string
}

export interface UpdateModuleRequest {
  /** 名稱 */
  name: string

  /** 狀態 */
  isActive: boolean
}
