/**
 * 選單狀態管理 Store
 * 
 * 功能：
 * 1. 管理當前選中的選單項目
 * 2. 管理展開的群組選單狀態
 * 3. 管理選單收合/展開狀態（新增）
 * 4. 儲存到 localStorage，重新整理後保持狀態
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 選單 Store
 */
export const useMenuStore = defineStore('menu', () => {
  // ==================== State ====================

  /**
   * 當前選中的選單項目 key
   * 例如：'overview', 'customers', 'settings.accounts'
   */
  const activeMenuKey = ref<string | null>(
    // 從 localStorage 讀取，如果沒有則預設為 'overview'
    localStorage.getItem('activeMenuKey') || 'overview',
  )

  /**
   * 展開的群組選單 key 列表
   * 例如：['settings'] 表示設定群組已展開
   */
  const expandedGroups = ref<string[]>(
    // 從 localStorage 讀取，如果沒有則預設為空陣列（全部收合）
    JSON.parse(localStorage.getItem('expandedGroups') || '[]'),
  )

  /**
   * 左側選單是否收合
   * true: 選單完全隱藏
   * false: 選單顯示
   */
  const isCollapsed = ref<boolean>(
    // 從 localStorage 讀取，如果沒有則預設為 false（顯示）
    JSON.parse(localStorage.getItem('menuCollapsed') || 'false'),
  )

  // ==================== Actions ====================

  /**
   * 設定當前選中的選單項目
   * 
   * @param key 選單項目的 key
   */
  function setActiveMenu(key: string) {
    activeMenuKey.value = key
    // 儲存到 localStorage
    localStorage.setItem('activeMenuKey', key)
  }

  /**
   * 切換群組選單的展開/收合狀態
   * 
   * @param groupKey 群組選單的 key（例如：'settings'）
   */
  function toggleGroup(groupKey: string) {
    const index = expandedGroups.value.indexOf(groupKey)

    if (index > -1) {
      // 如果已展開，則收合
      expandedGroups.value.splice(index, 1)
    } else {
      // 如果已收合，則展開
      expandedGroups.value.push(groupKey)
    }

    // 儲存到 localStorage
    localStorage.setItem('expandedGroups', JSON.stringify(expandedGroups.value))
  }

  /**
   * 檢查群組是否已展開
   * 
   * @param groupKey 群組選單的 key
   * @returns true 表示已展開，false 表示已收合
   */
  function isGroupExpanded(groupKey: string): boolean {
    return expandedGroups.value.includes(groupKey)
  }

  /**
   * 切換選單收合/展開狀態
   * 
   * 用途：點擊 Container 左側的收合按鈕時呼叫
   */
  function toggleCollapsed() {
    isCollapsed.value = !isCollapsed.value
    // 儲存到 localStorage
    localStorage.setItem('menuCollapsed', JSON.stringify(isCollapsed.value))
  }

  /**
   * 重設選單狀態（清空 localStorage）
   * 
   * 用途：登出時呼叫，清除所有選單狀態
   */
  function resetMenuState() {
    activeMenuKey.value = 'overview'
    expandedGroups.value = []
    isCollapsed.value = false
    localStorage.removeItem('activeMenuKey')
    localStorage.removeItem('expandedGroups')
    localStorage.removeItem('menuCollapsed')
  }

  // ==================== Return ====================

  return {
    // State
    activeMenuKey,
    expandedGroups,
    isCollapsed,

    // Actions
    setActiveMenu,
    toggleGroup,
    isGroupExpanded,
    toggleCollapsed,
    resetMenuState,
  }
})
