/**
 * 環境相關型別定義
 *
 * 檔案位置：src/types/environment.ts
 */

/**
 * 環境狀態
 */
export type EnvironmentStatus = "PENDING" | "TO_BE_DELETED";

/**
 * 使用模組
 */
export type CustomerModule = "Master" | "GGF";

/**
 * 環境列表資料
 */
export interface EnvironmentListItem {
  /** 環境 ID */
  id: number;

  /** 客戶名稱 */
  customerName: string;

  /** 使用狀態 */
  status: EnvironmentStatus;

  /** 申請日 */
  appliedDate: string;

  /** 預定刪除日 */
  schedulatedDeleteDate: string;

  /** 申請人 */
  applicant: string;
}

/**
 * 刪除詳細資訊
 * 用於環境管理的刪除紀錄彈窗顯示
 */
export interface DeleteRecordDetailInfo {
  // ===== 基本資訊 =====
  /** 客戶名稱（例如：橘色涮涮屋） */
  customerName: string;

  /** 產業類別（例如：餐飲） */
  industry: string;

  // ===== 詳細資訊 =====
  /** PinCode（可能以 0 開頭，使用字串格式，例如：01283012） */
  pinCode: string;

  /** 客戶代號（例如：we912323.ceqowe） */
  customerNo: string;

  /** PORT（例如：970909） */
  port: string;

  /** ID */
  id: number;

  /** 合約起日（例如：2025.02.12） */
  contractStartDate: string;

  /** 合約迄日（例如：2025.02.20） */
  contractEndDate: string;

  /** 環境域名（例如：www.123923710.example.ocm） */
  domainName: string;

  // ===== 刪除操作 =====
  /** 通知日（例如：2025.10.08） */
  notifiedDate: string;

  /** 刪除日（例如：2025.10.08） */
  deleteDate: string;

  /** 刪除時間（例如：13:20:20） */
  deleteTime: string;

  /** 刪除人（例如：廖建榛） */
  deletedBy: string;
}

/**
 * 統計數量回應型別
 */
export interface EnvironmentCountResponse {
  total: number;
}

export interface EnvironmentDetailInfo {
  customerNo: string; // 客戶代號
  customerName: string; // 客戶名稱（例如：橘色測測屋）
  industry: string; // 行業類別（例如：餐飲）
  status: EnvironmentStatus; // 環境狀態（申請中、已通知、待刪除）
  autoUrl: string; // 快速自動輸入網址
  frontendUrl: string; // 前台連結網址
  backendUrl: string; // 後台連結網址
  pinCode: string; // PinCode（可能以 0 開頭，使用字串格式）
  domainName: string; // 環境域名
  createdAt: string; // 建立日期（例如：2025.02.12）
  scheduledDeleteDate: string; // 預定刪除日（例如：2025.10.08）
  appliedDate: string; // 申請日（例如：2025.10.08）
  usageTime: string; // 使用時間（例如：4天前）
  module: CustomerModule; // 模組類型（Master 或 GGF）
  salesPerson: string; // 負責業務
  contactPerson: string; // 聯絡人姓名
  phone: string; // 聯絡電話
  email: string; // 聯絡 E-mail
}

/**
 * 刪除紀錄列表項目
 * 用於環境管理 - 刪除紀錄列表頁面顯示
 */
export interface DeleteRecordListItem {
  /** 唯一識別碼（用於 rowKey） */
  id: string | number;

  /** 訂單編號（例如：12102382190） */
  orderNo: string;

  /** 客戶名稱（例如：橘色涮涮屋） */
  customerName: string;

  /** 產業類別（例如：餐飲、科技軟體業） */
  industry: string;

  /** 環境域名（例如：citytasty.example.com） */
  domainName: string;

  /** 通知日（例如：2025.10.04，可為空） */
  notifiedDate: string;

  /** 刪除日（例如：2025.10.08，可為空） */
  deleteDate: string;

  /** 刪除人（例如：廖建榛） */
  deletedBy: string;
}
