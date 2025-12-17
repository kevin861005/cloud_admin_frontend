<template>
  <div
    class="relative z-10 border-b border-gray-200 bg-white px-10 pt-8 pb-10 shadow-[1px_3px_4px_0_rgba(0,0,0,0.10)]"
  >
    <!-- 第一行：客戶名稱 + 狀態標籤 + 修改資料按鈕 -->
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <h1 class="typo-2xl-bold text-neutral-800">
          {{ customerInfo.customerName }}
        </h1>
        <Badge :text="statusText" :type="badgeType" />
      </div>

      <!-- 修改資料按鈕 -->
      <button
        class="group inline-flex items-center justify-center gap-1 h-9 pr-4 pl-3 rounded typo-xs-bold text-neutral-600 cursor-pointer hover:text-primary-500 hover:border-primary-500 transition-colors"
        @click="handleEditClick"
      >
        <img
          :src="EditIcon"
          alt="修改資料"
          class="icon-neutral icon-neutral-hover-primary h-4 w-4"
        />
        <span>修改資料</span>
      </button>
    </div>

    <!-- 產業別 -->
    <p class="mb-4 typo-sm text-neutral-600">
      {{ customerInfo.industry }}
    </p>

    <!-- 次要資訊（使用時間、模組、負責業務、建立日期）-->
    <div class="flex items-center gap-3 typo-sm-medium text-neutral-600">
      <span>使用時間：{{ customerInfo.usageTime }}</span>
      <Divider direction="vertical" color="light" />
      <span class="flex items-center gap-2">
        模組：<Badge
          v-if="customerInfo.module"
          :text="customerInfo.module"
          :type="getModuleType()"
        />
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
import { useRouter } from 'vue-router'
import type { CustomerDetailInfo } from '@/types/customer'
import Badge from '@/components/common/badge.vue'
import Divider from '@/components/common/divider.vue'
import EditIcon from '@/assets/icons/common/cm-edit.svg'

/**
 * 客戶資訊卡片元件
 *
 * 用途：
 * - 顯示客戶詳細頁面頂部的基本資訊
 * - 包含客戶名稱、狀態、產業、使用時間等關鍵資訊
 * - 提供修改資料按鈕，點擊後跳轉至編輯頁面
 */

interface Props {
  /**
   * 客戶詳細資訊
   */
  customerInfo: CustomerDetailInfo
}

const props = defineProps<Props>()

const router = useRouter()

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
      return 'success'
    case 'INACTIVE':
      return 'error'
    case 'UNUSED':
      return 'default'
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

/**
 * 點擊修改資料按鈕，跳轉到編輯頁面
 */
function handleEditClick() {
  router.push(`/customers/${props.customerInfo.customerNo}/edit`)
}
</script>
