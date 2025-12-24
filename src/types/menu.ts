/**
 * 選單相關型別定義
 */

/**
 * 選單項目類型
 */
export type MenuItemType = "item" | "group" | "divider";

/**
 * 選單項目介面
 */
export interface MenuItem {
  key: string; // 唯一識別碼（例如：'overview', 'customers', 'settings.accounts'）
  label: string; // 顯示名稱（例如：'總覽', '客戶管理'）
  type: MenuItemType; // 項目類型
  icon?: string; // ICON 檔名（例如：'overview.svg'）
  requiredPermissions?: string[]; // 需要的權限代號（例如：['overview']）
  children?: MenuItem[]; // 子選單項目
  defaultExpanded?: boolean; // 是否預設展開（僅 group 類型有效）
}
