/**
 * 時間工具函數
 */

/**
 * 格式化為上午/下午時間格式
 *
 * @param isoString ISO 8601 格式的時間字串（UTC）
 * @returns 格式化後的時間字串（上午/下午 HH:MM 格式）
 *
 * @example
 * formatTimeWithPeriod('2025-12-26T08:22:15.574Z')
 * // 輸出（假設本地時區為 UTC+8）：
 * // "下午 04:22"
 *
 * formatTimeWithPeriod('2025-12-26T01:30:00.000Z')
 * // 輸出（假設本地時區為 UTC+8）：
 * // "上午 09:30"
 */
export function formatTimeWithPeriod(isoString: string): string {
  try {
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // 判斷上午/下午
    const period = hours < 12 ? "上午" : "下午";

    // 轉換為 12 小時制
    const hours12 = hours % 12 || 12;
    const hoursStr = String(hours12).padStart(2, "0");

    return `${period} ${hoursStr}:${minutes}`;
  } catch (error) {
    console.error("時間格式化失敗:", error);
    return "--:--";
  }
}
