<template>
  <div class="h-[150px] bg-white rounded px-5 pt-5 pb-4 flex flex-col gap-3">
    <!-- 標題區：ICON + 服務名稱 + 狀態文字 -->
    <div class="flex items-center gap-3">
      <!-- ICON (20x20px) -->
      <img :src="props.icon" alt="" class="h-5 w-5 flex-shrink-0" />

      <!-- 服務名稱 -->
      <span class="typo-base-bold text-gray-700">{{ props.serviceName }}</span>

      <!-- 狀態文字（根據狀態顯示不同顏色）-->
      <span class="typo-xs" :class="statusColorClass">
        {{ props.statusText }}
      </span>
    </div>

    <!-- 內容區：可選標題 + Badge 樣式內容 -->
    <div class="flex flex-col gap-2">
      <!-- 內容標題（選填）-->
      <div v-if="props.contentTitle" class="typo-xs text-gray-700">
        {{ props.contentTitle }}
      </div>
      <!-- Badge 樣式內容（固定 default 樣式）-->
      <div
        class="inline-flex items-center justify-center self-start rounded bg-gray-100 px-2 py-1 typo-xs text-gray-700"
      >
        {{ props.contentText }}
      </div>
    </div>

    <!-- 按鈕區（使用 named slot）-->
    <div class="mt-auto flex items-center gap-3">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ServiceStatus } from '@/types/customer'

/**
 * 系統環境狀態卡片元件
 *
 * 用途：
 * - 顯示系統服務狀態（Docker、資料庫、DNS、NGINX）
 * - 統一的卡片樣式
 *
 * 特點：
 * - 固定高度 150px，寬度由外層容器決定
 * - 標題區：ICON(20x20) + 服務名稱 + 狀態文字
 * - 內容區：可選標題 + Badge 樣式內容
 * - 按鈕區：最多 2 個 BadgeButton，gap=12px
 *
 * 使用範例：
 * <ServiceCard
 *   :icon="dockerIcon"
 *   service-name="Docker"
 *   status="RUNNING"
 *   status-text="運行中"
 *   content-title="名稱"
 *   content-text="v2.4.1"
 * >
 *   <template #buttons>
 *     <BadgeButton text="更新映像" icon-position="left" :icon="updateIcon" @click="handleUpdate" />
 *     <BadgeButton text="重啟環境" icon-position="left" :icon="restartIcon" @click="handleRestart" />
 *   </template>
 * </ServiceCard>
 *
 * <ServiceCard
 *   :icon="dnsIcon"
 *   service-name="DNS"
 *   status="NORMAL"
 *   status-text="正常"
 *   content-text="DNS紀錄有效"
 * />
 */

/**
 * Props 定義
 */
interface Props {
  /**
   * ICON 路徑（必填）
   * - 固定尺寸 20x20px
   */
  icon: string

  /**
   * 服務名稱（必填）
   * - 例如：Docker、資料庫、DNS、NGINX
   */
  serviceName: string

  /**
   * 服務狀態（必填）
   * - RUNNING: 運行中（藍色）
   * - NORMAL: 正常（藍色）
   * - ERROR: 異常（紅色）
   * - STOPPED: 停止（灰色）
   */
  status: ServiceStatus

  /**
   * 狀態顯示文字（必填）
   * - 例如：運行中、正常、異常、停止
   */
  statusText: string

  /**
   * 內容標題（選填）
   * - 例如：名稱
   * - 如果不提供，則不顯示標題
   */
  contentTitle?: string

  /**
   * 內容文字（必填）
   * - 顯示在 Badge 內
   * - 例如：v2.4.1、Twfood_production、DNS紀錄有效
   */
  contentText: string
}

const props = defineProps<Props>()

/**
 * 根據狀態決定文字顏色
 */
const statusColorClass = computed(() => {
  switch (props.status) {
    case 'RUNNING':
    case 'NORMAL':
      return 'text-blue-600'
    case 'ERROR':
      return 'text-red-600'
    case 'STOPPED':
      return 'text-gray-600'
    default:
      return 'text-gray-600'
  }
})
</script>
