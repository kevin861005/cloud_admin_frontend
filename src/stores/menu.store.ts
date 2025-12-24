/**
 * 選單狀態管理 Store
 *
 * 功能：
 * 1. 管理展開的群組選單狀態
 * 2. 管理選單收合/展開狀態
 * 3. 儲存群組展開狀態到 localStorage
 */

import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * 選單 Store
 */
export const useMenuStore = defineStore("menu", () => {
  // ==================== State ====================

  /**
   * 展開的群組選單 key 列表
   * 例如：['settings'] 表示設定群組已展開
   */
  const expandedGroups = ref<string[]>(JSON.parse(localStorage.getItem("expandedGroups") || "[]"));

  /**
   * 左側選單是否收合
   * true: 選單完全隱藏
   * false: 選單顯示
   */
  const isCollapsed = ref<boolean>(localStorage.getItem("menuCollapsed") !== "false");

  // ==================== Actions ====================

  /**
   * 切換群組選單的展開/收合狀態
   *
   * @param groupKey 群組選單的 key（例如：'settings'）
   */
  function toggleGroup(groupKey: string) {
    const index = expandedGroups.value.indexOf(groupKey);

    if (index > -1) {
      expandedGroups.value.splice(index, 1);
    } else {
      expandedGroups.value.push(groupKey);
    }

    localStorage.setItem("expandedGroups", JSON.stringify(expandedGroups.value));
  }

  /**
   * 檢查群組是否已展開
   *
   * @param groupKey 群組選單的 key
   * @returns true 表示已展開，false 表示已收合
   */
  function isGroupExpanded(groupKey: string): boolean {
    return expandedGroups.value.includes(groupKey);
  }

  /**
   * 切換選單收合/展開狀態
   */
  function toggleCollapsed() {
    isCollapsed.value = !isCollapsed.value;
    localStorage.setItem("menuCollapsed", JSON.stringify(isCollapsed.value));
  }

  /**
   * 重設選單狀態（清空 localStorage）
   *
   * 用途：登出時呼叫，清除所有選單狀態
   */
  function resetMenuState() {
    expandedGroups.value = [];
    isCollapsed.value = true; // 預設收合
    localStorage.removeItem("expandedGroups");
    localStorage.removeItem("menuCollapsed");
  }

  // ==================== Return ====================

  return {
    // State
    expandedGroups,
    isCollapsed,

    // Actions
    toggleGroup,
    isGroupExpanded,
    toggleCollapsed,
    resetMenuState,
  };
});
