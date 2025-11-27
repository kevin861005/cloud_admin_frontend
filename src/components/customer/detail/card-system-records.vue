<template>
  <div class="flex h-full flex-col rounded-xl bg-white py-6 px-5 shadow-md gap-4">
    <div class="flex flex-col gap-8">
      <!-- 卡片標題 -->
      <div class="flex items-center gap-3">
        <img :src="SystemIcon" alt="系統紀錄" class="h-8 w-8" />
        <h3 class="typo-base-bold text-gray-700">系統紀錄</h3>
      </div>

      <!-- 活動列表 -->
      <div class="flex-1 space-y-[4px] overflow-y-auto">
        <div
          v-for="(systemLog, index) in systemLogs"
          :key="index"
          class="flex items-center h-9 gap-3 typo-sm-medium text-gray-700 py-[1px]"
        >
          <!-- 左側 frame（日期時間 + 模組標籤） -->
          <div class="flex items-center gap-[12px] flex-shrink-0">
            <!-- 日期時間 -->
            <span class="w-36">
              {{ systemLog.datetime }}
            </span>

            <!-- 模組標籤 -->
            <Badge :text="systemLog.service" :type="getModuleType()" />
          </div>

          <!-- 右側 subtext -->
          <span class="flex-1 text-right">
            {{ systemLog.message }}
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
import type { SystemLog } from '@/types/customer'
import SystemIcon from '@/assets/icons/card/system.svg'
import Badge from '@/components/common/badge.vue'
import BadgeButton from '@/components/common/badge-button.vue'

interface Props {
  /**
   * 活動記錄陣列
   */
  systemLogs: SystemLog[]
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
const getModuleType = (): 'default' => {
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
