<template>
  <div
    class="relative z-10 border-b border-gray-200 bg-white px-10 pt-8 pb-10 shadow-[1px_3px_4px_0_rgba(0,0,0,0.10)]"
  >
    <!-- 客戶名稱 + 狀態標籤 -->
    <div class="mb-3 flex items-center gap-3">
      <h1 class="text-2xl font-bold tracking-[-0.2px] text-gray-800">
        {{ customerInfo.customerName }}
      </h1>
      <Badge :text="statusText" :type="badgeType" />
    </div>

    <!-- 產業別 -->
    <p class="mb-4 text-sm font-normal tracking-[0.2px] text-gray-600">
      {{ customerInfo.industry }}
    </p>

    <!-- 次要資訊（使用時間、模組、負責業務、建立日期）-->
    <div class="flex items-center gap-3 text-sm font-medium text-gray-600">
      <span>使用時間：{{ customerInfo.usageTime }}</span>
      <Divider direction="vertical" color="light" />
      <span class="flex items-center gap-2">
        模組：<Badge :text="customerInfo.module" :type="getModuleType()" />
      </span>
      <Divider direction="vertical" color="light" />
      <span>負責業務：{{ customerInfo.salesPerson }}</span>
      <Divider direction="vertical" color="light" />
      <span>建立日：{{ customerInfo.createdAt }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CustomerDetailInfo } from '@/types/customer'
import Badge from '@/components/common/badge.vue'
import Divider from '@/components/common/divider.vue'

/**
 * 客戶資訊卡片元件
 *
 * 用途：
 * - 顯示客戶詳細頁面頂部的基本資訊
 * - 包含客戶名稱、狀態、產業、使用時間等關鍵資訊
 *
 * 特點：
 * - 純展示用途，無互動功能
 * - 使用 Badge 元件顯示狀態
 * - 符合 UI/UX 設計規範
 */

interface Props {
  /**
   * 客戶詳細資訊
   */
  customerInfo: CustomerDetailInfo
}

const props = defineProps<Props>()

/**
 * 狀態文字（根據狀態代碼轉換為中文）
 */
const statusText = computed(() => {
  switch (props.customerInfo.status) {
    case 'ACTIVE':
      return '活躍'
    case 'INACTIVE':
      return '低活躍'
    case 'UNUSED':
      return '未使用'
    default:
      return '未知'
  }
})

/**
 * Badge 類型（根據狀態代碼映射到 Badge 元件的 type）
 */
const badgeType = computed<'success' | 'default' | 'error'>(() => {
  switch (props.customerInfo.status) {
    case 'ACTIVE':
      return 'success' // 綠色 - 活躍
    case 'INACTIVE':
      return 'default' // 灰色 - 低活躍
    case 'UNUSED':
      return 'error' // 紅色 - 未使用
    default:
      return 'default'
  }
})

/**
 * 模組 Badge 類型（根據模組類型映射顏色）
 */
const getModuleType = (): 'default' => {
  return 'default'
}
</script>
