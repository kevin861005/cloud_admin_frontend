/**
 * 時間工具函數
 */

/**
 * 格式化 ISO 8601 時間為本地時間字串
 *
 * @param isoString ISO 8601 格式的時間字串（UTC）
 * @returns 格式化後的本地時間字串
 *
 * @example
 * formatTimestamp('2025-10-13T06:30:45.123Z')
 * // 輸出（假設本地時區為 UTC+8）：
 * // "2025/10/13 14:30:45"
 */
export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString)

  // 格式化為本地時間
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 格式化為相對時間（例如：「3 分鐘前」）
 *
 * @param isoString ISO 8601 格式的時間字串（UTC）
 * @returns 相對時間字串
 *
 * @example
 * formatRelativeTime('2025-10-13T06:27:45.123Z')
 * // 輸出（假設現在是 06:30:45）：
 * // "3 分鐘前"
 */
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) {
    return '剛剛'
  } else if (diffMin < 60) {
    return `${diffMin} 分鐘前`
  } else if (diffHour < 24) {
    return `${diffHour} 小時前`
  } else if (diffDay < 7) {
    return `${diffDay} 天前`
  } else {
    return formatTimestamp(isoString)
  }
}

/**
 * 格式化為簡短的日期時間（用於卡片顯示）
 *
 * @param isoString ISO 8601 格式的時間字串（UTC）
 * @returns 簡短的日期時間字串
 *
 * @example
 * formatShortDateTime('2025-10-13T06:30:45.123Z')
 * // 輸出（假設本地時區為 UTC+8）：
 * // "10/13 14:30"
 */
export function formatShortDateTime(isoString: string): string {
  const date = new Date(isoString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${month}/${day} ${hours}:${minutes}`
}

/**
 * 格式化為時間（只顯示小時和分鐘）
 *
 * @param isoString ISO 8601 格式的時間字串（UTC）
 * @returns 時間字串（HH:MM 格式）
 *
 * @example
 * formatTimeOnly('2025-10-13T06:30:45.123Z')
 * // 輸出（假設本地時區為 UTC+8）：
 * // "14:30"
 *
 * formatTimeOnly('2025-10-13T01:05:00.000Z')
 * // 輸出（假設本地時區為 UTC+8）：
 * // "09:05"
 */
export function formatTimeOnly(isoString: string): string {
  const date = new Date(isoString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}
