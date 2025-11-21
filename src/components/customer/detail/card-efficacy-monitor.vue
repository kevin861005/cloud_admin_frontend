<template>
  <div class="flex h-full flex-col rounded-lg bg-white p-6 shadow-md gap-8">
    <div class="flex flex-col gap-8">
      <!-- 卡片標題 -->
      <div class="flex items-center gap-3">
        <img :src="EfficacyIcon" alt="系統紀錄" class="h-8 w-8" />
        <h3 class="text-base font-bold text-gray-800">系統紀錄</h3>
      </div>
    </div>

    <!-- 內容區 -->
    <div class="space-y-4">
      <!-- Loading 狀態 -->
      <Loading v-if="loading" message="載入資料中..." :show-spinner="true" />

      <!-- 錯誤狀態 -->
      <Alert v-else-if="error" type="error" title="載入失敗" :description="error" />

      <!-- 效能指標列表 -->
      <div v-else-if="performance" class="space-y-4">
        <div v-for="item in progressItems" :key="item.label" class="space-y-2">
          <!-- 標籤和百分比 -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">
              {{ item.label }}
            </span>
            <span class="text-sm font-bold" :class="getColorClasses(item.value).text">
              {{ item.value }}%
            </span>
          </div>

          <!-- 進度條 -->
          <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              class="h-full rounded-full transition-all duration-300"
              :class="getColorClasses(item.value).progressBg"
              :style="{ width: `${item.value}%` }"
            />
          </div>
        </div>
      </div>

      <!-- 無資料 -->
      <div v-else class="py-8 text-center text-sm text-gray-500">暫無效能監控資料</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PerformanceMetrics } from '@/types/customer'
import { getPerformanceLevel } from '@/types/customer'
import Loading from '@/components/common/loading.vue'
import Alert from '@/components/common/alert.vue'
import EfficacyIcon from '@/assets/icons/card/efficacy.svg'

/**
 * Props 定義
 */
interface Props {
  /** 效能監控資料 */
  performance: PerformanceMetrics | null
  /** 載入狀態 */
  loading?: boolean
  /** 錯誤訊息 */
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
})

/**
 * 進度條項目資料
 */
interface ProgressItem {
  label: string
  value: number
}

/**
 * 進度條列表
 */
const progressItems = computed<ProgressItem[]>(() => {
  if (!props.performance) return []

  return [
    { label: 'CPU 使用率', value: props.performance.cpu },
    { label: '記憶體使用', value: props.performance.memory },
    { label: '磁碟使用', value: props.performance.disk },
  ]
})

/**
 * 根據百分比取得顏色類別
 */
function getColorClasses(percentage: number) {
  const level = getPerformanceLevel(percentage)

  const colorMap = {
    GOOD: {
      text: 'text-green-600',
      progressBg: 'bg-blue-500',
    },
    WARNING: {
      text: 'text-yellow-600',
      progressBg: 'bg-yellow-500',
    },
    CRITICAL: {
      text: 'text-red-600',
      progressBg: 'bg-red-500',
    },
  }

  return colorMap[level]
}
</script>
