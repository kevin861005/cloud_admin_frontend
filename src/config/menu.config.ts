/**
 * 選單配置檔案
 *
 * 這裡定義了所有的選單項目結構
 * 前端會根據使用者的權限清單動態過濾這些選單項目
 */

import type { MenuItem } from '@/types/menu'

/**
 * 完整的選單配置
 *
 * 注意事項：
 * 1. ICON 檔名不含路徑和副檔名，例如 'overview' 對應 /src/assets/icons/menu/overview.svg
 * 2. requiredPermissions 是權限代號陣列，只要使用者擁有其中任一權限即可顯示該項目
 * 3. 群組選單（type='group'）的 requiredPermissions 用於判斷是否顯示整個群組
 * 4. 子選單項目也需要各自檢查 requiredPermissions
 */
export const menuConfig: MenuItem[] = [
  // ==================== 主功能 ====================
  {
    key: 'overview',
    label: '總覽',
    type: 'item',
    icon: 'menu-dashboard',
    requiredPermissions: ['overview'],
  },
  {
    key: 'customers',
    label: '客戶管理',
    type: 'item',
    icon: 'menu-customer',
    requiredPermissions: ['customers'],
  },
  {
    key: 'environment',
    label: '環境管理',
    type: 'item',
    icon: 'menu-environment',
    requiredPermissions: ['environment'],
  },

  // ==================== 設定群組 ====================
  {
    key: 'settings',
    label: '設定',
    type: 'group',
    icon: 'menu-setting',
    // 只要有 settings 權限就顯示整個群組
    requiredPermissions: ['settings'],
    // 預設收合
    defaultExpanded: false,
    children: [
      // 帳號管理
      {
        key: 'settings.accounts',
        label: '帳號管理',
        type: 'item',
        icon: 'menu-account',
        requiredPermissions: ['settings.accounts'],
      },
      // 設定檔（分隔線，不可點擊，不需要權限）
      {
        key: 'settings.divider',
        label: '設定檔',
        type: 'divider',
        // 分隔線不需要權限檢查
        requiredPermissions: [],
      },
      // 權限設定
      // {
      //   key: 'settings.roles',
      //   label: '權限設定',
      //   type: 'item',
      //   icon: 'roles',
      //   requiredPermissions: ['settings.roles'],
      // },
      // 模組設定
      {
        key: 'settings.modules',
        label: '模組設定',
        type: 'item',
        icon: 'modules',
        requiredPermissions: ['settings.modules'],
      },
      // 產業別設定
      {
        key: 'settings.industries',
        label: '產業別設定',
        type: 'item',
        icon: 'industries',
        requiredPermissions: ['settings.industries'],
      },
      // 經銷商設定
      {
        key: 'settings.dealers',
        label: '經銷商設定',
        type: 'item',
        icon: 'dealers',
        requiredPermissions: ['settings.dealers'],
      },
    ],
  },
]
