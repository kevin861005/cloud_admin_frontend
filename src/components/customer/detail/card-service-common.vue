<template>
  <div
    class="flex min-w-[200px] flex-shrink-0 flex-col gap-3 rounded-xl shadow-md border border-gray-200 bg-white p-5 pb-4"
  >
    <!-- CardTitle：圖標 + 標題 + 狀態 -->
    <div class="flex items-center">
      <!-- 圖標 -->
      <img :src="icon" :alt="title" class="h-5 w-5 flex-shrink-0" />

      <!-- 標題（與圖標間距 8px） -->
      <span class="ml-2 typo-base-bold text-neutral-800">{{ title }}</span>

      <!-- 狀態標籤（與標題間距 12px） -->
      <span v-if="statusText" class="ml-3 typo-xs-medium" :class="statusColorClass">
        {{ statusText }}
      </span>
    </div>

    <!-- system/item：資料列區域 -->
    <div class="flex flex-1 flex-col gap-3">
      <div v-for="(row, index) in visibleRows" :key="index" class="flex flex-col gap-1">
        <!-- 標題 -->
        <span class="typo-xs-regular text-neutral-400">{{ row.label }}</span>

        <!-- 內容（有背景樣式） -->
        <span
          class="inline-block self-start break-all rounded bg-neutral-100 px-2 py-0.5 typo-sm-medium text-neutral-800"
        >
          {{ row.value }}
        </span>
      </div>
    </div>

    <!-- button list：底部按鈕區域（Slot） -->
    <div v-if="hasFooter" class="mt-auto">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { ServiceStatus } from '@/types/service'

/**
 * 資料列定義
 */
interface DataRow {
  label: string
  value: string
}

/**
 * Props 定義
 */
interface Props {
  /** 卡片圖標 */
  icon: string
  /** 卡片標題 */
  title: string
  /** 狀態文字（例如：運行中、正常） */
  statusText?: string
  /** 服務狀態，決定顏色 */
  status?: ServiceStatus
  /** 資料列 */
  rows: DataRow[]
  /** 是否展開（預設 false 收合） */
  isExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  statusText: '',
  status: 'NORMAL',
  isExpanded: false,
})

const slots = useSlots()

/**
 * 是否有底部內容
 */
const hasFooter = computed(() => !!slots.footer)

/**
 * 根據展開狀態決定顯示的資料列
 * - 展開：顯示全部
 * - 收合：只顯示第一筆
 */
const visibleRows = computed(() => {
  if (props.isExpanded) {
    return props.rows
  }
  // 收合時只顯示第一筆
  return props.rows.slice(0, 1)
})

/**
 * 狀態顏色樣式
 */
const statusColorClass = computed(() => {
  switch (props.status) {
    case 'RUNNING':
      return 'text-primary-500'
    case 'NORMAL':
      return 'text-primary-500'
    case 'ERROR':
      return 'text-semantic-warning'
    case 'EXITED':
      return 'text-semantic-warning'
    default:
      return 'text-primary-500'
  }
})
</script>
