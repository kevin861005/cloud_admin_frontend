/**
 * useDrawerToast - Drawer Toast 訊息管理
 *
 * 用於 Drawer 元件內的 Toast 提示訊息管理
 * 統一處理 Toast 的顯示、關閉邏輯
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useDrawerToast } from '@/composables/useDrawerToast'
 *
 * const { toast, showToast, hideToast, resetToast } = useDrawerToast()
 *
 * // 顯示成功訊息
 * showToast('success', '儲存成功')
 *
 * // 顯示錯誤訊息
 * showToast('error', '儲存失敗，請重新嘗試')
 *
 * // Drawer 關閉時重置
 * resetToast()
 * </script>
 *
 * <template>
 *   <DrawerToast
 *     :is-visible="toast.isVisible"
 *     :type="toast.type"
 *     :message="toast.message"
 *     @close="hideToast"
 *   />
 * </template>
 * ```
 */

import { ref } from 'vue'

/**
 * Toast 類型
 */
export type ToastType = 'success' | 'error'

/**
 * Toast 狀態介面
 */
export interface ToastState {
  isVisible: boolean
  type: ToastType
  message: string
}

/**
 * Drawer Toast 管理 Composable
 */
export function useDrawerToast() {
  /**
   * Toast 狀態
   */
  const toast = ref<ToastState>({
    isVisible: false,
    type: 'success',
    message: '',
  })

  /**
   * 顯示 Toast 訊息
   * @param type - 訊息類型（success/error）
   * @param message - 訊息內容
   */
  const showToast = (type: ToastType, message: string) => {
    toast.value = {
      isVisible: true,
      type,
      message,
    }
  }

  /**
   * 隱藏 Toast（用於 @close 事件）
   */
  const hideToast = () => {
    toast.value.isVisible = false
  }

  /**
   * 重置 Toast 狀態（用於 Drawer 關閉時）
   */
  const resetToast = () => {
    toast.value = {
      isVisible: false,
      type: 'success',
      message: '',
    }
  }

  /**
   * 顯示成功訊息的快捷方法
   * @param message - 訊息內容
   */
  const showSuccess = (message: string) => {
    showToast('success', message)
  }

  /**
   * 顯示錯誤訊息的快捷方法
   * @param message - 訊息內容
   */
  const showError = (message: string) => {
    showToast('error', message)
  }

  return {
    toast,
    showToast,
    hideToast,
    resetToast,
    showSuccess,
    showError,
  }
}
