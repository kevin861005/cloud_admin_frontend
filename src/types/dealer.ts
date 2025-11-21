/**
 * 經銷商相關型別定義
 *
 * 檔案位置：src/types/dealer.ts
 */

/**
 * 經銷商列表資料
 */
export interface DealerListItem {
  /** 經銷商 ID */
  id: number

  /** 經銷商編號 */
  code: string

  /** 經銷商名稱 */
  name: string

  /** 業務窗口 */
  sales: string

  /** 聯絡人 */
  contactPerson: string

  /** 連絡電話 */
  contactPhone: string

  /** 電子信箱 */
  email: string
}

export interface DealerDetailInfo {
  /** 經銷商編號 */
  code: string

  /** 經銷商名稱 */
  name: string

  /** 業務窗口 */
  sales: { id: string; name: string }

  /** 聯絡人 */
  contactPerson: string

  /** 連絡電話 */
  contactPhone: string

  /** 電子信箱 */
  email: string

  /** 地址 */
  address: string

  /** 說明 */
  description: string

  /** 建立日期 */
  createdAt: string

  /** 建立者 */
  createdBy: { id: string; name: string } | null
}
