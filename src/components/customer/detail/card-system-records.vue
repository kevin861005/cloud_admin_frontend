<template>
  <div class="flex flex-col rounded-xl bg-white px-5 py-6 shadow-md">
    <!-- 卡片標題 -->
    <div class="flex items-center gap-3">
      <img :src="SystemIcon" alt="系統紀錄" class="h-8 w-8" />
      <h3 class="typo-base-bold text-neutral-700">系統紀錄</h3>
    </div>

    <!-- 活動列表 -->
    <div class="mt-8 flex-1 space-y-1 overflow-y-auto">
      <!-- 有資料 -->
      <template v-if="systemLogs && systemLogs.length > 0">
        <div
          v-for="(systemLog, index) in systemLogs"
          :key="index"
          class="flex h-9 items-center gap-3 py-[1px] typo-sm-medium text-neutral-700"
        >
          <!-- 左側 frame（日期時間 + 模組標籤） -->
          <div class="flex flex-shrink-0 items-center gap-3">
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
      </template>

      <!-- 無資料：使用 EmptyState 元件 -->
      <EmptyState
        v-else
        variant="inline"
        type="no-data"
        title=""
        description="目前沒有任何系統紀錄"
      />
    </div>

    <!-- 更多按鈕（固定在底部） -->
    <div v-if="systemLogs && systemLogs.length > 0" class="mt-4 flex justify-end">
      <BadgeButton text="更多" @click="handleMoreClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SystemLog } from '@/types/customer'
import SystemIcon from '@/assets/icons/card/system.svg'
import { Badge, EmptyState, BadgeButton } from '@/components/common'

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
