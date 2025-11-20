<template>
  <div class="flex h-full flex-col rounded-xl bg-white py-6 px-5 shadow-md gap-4">
    <div class="flex flex-col gap-8">
      <!-- 卡片標題 -->
      <div class="flex items-center gap-2">
        <img :src="ActivityIcon" alt="活動記錄" class="h-6 w-6" />
        <h3 class="text-base font-bold text-gray-700">最新活動記錄</h3>
      </div>

      <!-- 活動列表 -->
      <div class="flex-1 space-y-[4px] overflow-y-auto">
        <div
          v-for="(activity, index) in activities"
          :key="index"
          class="flex items-center h-9 gap-3 text-sm font-medium text-gray-700 py-[1px]"
        >
          <!-- 左側 frame（日期時間 + 模組標籤） -->
          <div class="flex items-center gap-[12px] flex-shrink-0">
            <!-- 日期時間 -->
            <span class="w-36">
              {{ activity.datetime }}
            </span>

            <!-- 模組標籤 -->
            <Badge :text="activity.module" :type="getModuleType(activity)" />
          </div>

          <!-- 右側 subtext -->
          <span class="flex-1 text-right">
            {{ activity.action }}
          </span>
        </div>
      </div>
    </div>

    <!-- 更多按鈕（暫不實作功能） -->
    <div class="flex justify-end">
      <BadgeButton text="更多" @click="handleMoreClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActivityRecord } from '@/types/customer'
import ActivityIcon from '@/assets/icons/card/activity.svg'
import Badge from '@/components/common/badge.vue'
import BadgeButton from '@/components/common/badge-button.vue'

/**
 * 最新活動記錄卡片
 *
 * 用途：
 * - 顯示客戶最近的系統操作記錄
 * - 包含時間、模組、操作名稱
 *
 * 特點：
 * - 最多顯示 5 筆記錄
 * - 支援垂直滾動（如果內容超出）
 * - 更多按鈕（暫未實作功能）
 */

interface Props {
  /**
   * 活動記錄陣列
   */
  activities: ActivityRecord[]
}

defineProps<Props>()

/**
 * Emits 定義
 */
const emit = defineEmits<{
  /**
   * 更多按鈕點擊事件
   */
  moreClick: []
}>()

/**
 * 模組 Badge 類型（根據模組類型映射顏色）
 */
const getModuleType = (row: ActivityRecord): 'default' => {
  return 'default'
}

/**
 * 處理更多按鈕點擊
 * 將事件向上傳遞給父元件
 */
const handleMoreClick = () => {
  emit('moreClick')
}
</script>
