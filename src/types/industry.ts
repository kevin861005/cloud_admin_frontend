/**
 * 產業別相關型別定義
 *
 * 檔案位置：src/types/industry.ts
 */

/**
 * 產業別列表資料
 */
export interface IndustryListItem {
  /** 產業別 ID */
  id: number

  /** 代號 */
  code: string

  /** 名稱 */
  name: string

  /** SQL 檔名 */
  sqlFile: string

  /** 建立日期 */
  createdAt: string

  /** 建立者 */
  createdBy: { id: string; name: string } | null

  /** 說明 */
  description: string
}
