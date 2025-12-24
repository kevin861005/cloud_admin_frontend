/**
 * Task Service - SSE 進度連線管理
 *
 * 用於建立和管理 SSE 連線，接收後端推送的任務進度
 */

import type { TaskProgressEvent, TaskProgressCallbacks } from "@/types/task";

/**
 * SSE 連線基礎 URL
 */
const SSE_BASE_URL = "/cloudadmin/api";

/**
 * Task Service
 */
export const taskService = {
  /**
   * 建立 SSE 進度連線
   * @param taskId 任務 ID
   * @param callbacks 回調函數
   * @returns 關閉連線的函數
   */
  subscribeProgress<T = unknown>(taskId: string, callbacks: TaskProgressCallbacks<T>): () => void {
    const url = `${SSE_BASE_URL}/progress/${taskId}`;
    const eventSource = new EventSource(url);

    /**
     * 處理進度事件
     */
    eventSource.addEventListener("progress", (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as TaskProgressEvent<T>;

        // 根據狀態呼叫對應的回調
        switch (data.status) {
          case "completed":
            callbacks.onCompleted?.(data);
            // 完成後關閉連線
            eventSource.close();
            break;

          case "error":
            callbacks.onError?.(data);
            // 錯誤後關閉連線
            eventSource.close();
            break;

          case "running":
          default:
            callbacks.onProgress?.(data);
            break;
        }
      } catch (error) {
        console.error("解析 SSE 進度事件失敗:", error);
      }
    });

    /**
     * 處理連線錯誤
     */
    eventSource.onerror = () => {
      console.error("SSE 連線錯誤");
      callbacks.onConnectionError?.();
      eventSource.close();
    };

    /**
     * 回傳關閉連線的函數
     */
    return () => {
      eventSource.close();
    };
  },
};
