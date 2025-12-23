<template>
  <div class="flex h-full flex-col rounded-xl bg-white py-6 px-5 shadow-md gap-8">
    <div class="flex flex-col gap-8">
      <!-- 卡片標題 -->
      <div class="flex items-center gap-2">
        <img :src="ContactIcon" alt="聯絡資訊" class="h-6 w-6" />
        <h3 class="typo-base-bold text-neutral-700">聯絡資訊</h3>
      </div>

      <!-- 聯絡資訊列表 -->
      <div class="flex-1 space-y-1">
        <!-- 聯絡人 -->
        <div class="flex h-9 items-center justify-between">
          <span class="typo-sm-medium text-neutral-700">聯絡人</span>
          <span class="typo-sm-medium text-neutral-800">
            {{ contactInfo.contactPerson }}
          </span>
        </div>

        <!-- 聯絡電話 -->
        <div class="flex h-9 items-center justify-between">
          <span class="typo-sm-medium text-neutral-700">聯絡電話</span>
          <div class="flex items-center gap-2">
            <span class="typo-sm-medium text-neutral-800">
              {{ contactInfo.phone }}
            </span>
            <CopyButton :value="contactInfo.phone" />
          </div>
        </div>

        <!-- 電子信箱 -->
        <div class="flex h-9 items-center justify-between">
          <span class="typo-sm-medium text-neutral-700">電子信箱</span>
          <div class="flex items-center gap-2">
            <span class="typo-sm-medium text-neutral-800">
              {{ contactInfo.email }}
            </span>
            <CopyButton :value="contactInfo.email" />
          </div>
        </div>
      </div>
    </div>

    <!-- 更多按鈕（暫不實作功能） -->
    <!-- <div class="flex justify-end">
      <BadgeButton text="更多" @click="handleMoreClick" />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import ContactIcon from '@/assets/icons/card/contact.svg'
// import BadgeButton from '@/components/common/badge-button.vue'
import { CopyButton } from '@/components/common'

/**
 * 聯絡資訊卡片
 *
 * 用途：
 * - 顯示客戶的聯絡人資訊
 * - 提供快速複製功能
 *
 * 特點：
 * - 支援複製電話和信箱
 * - 更多按鈕（暫未實作功能）
 */

interface Props {
  contactInfo: {
    contactPerson: string
    phone: string
    email: string
  }
}

defineProps<Props>()

/**
 * Emits 定義
 */
// const emit = defineEmits<{
//   /**
//    * 更多按鈕點擊事件
//    */
//   moreClick: []
// }>()

/**
 * 處理更多按鈕點擊
 * 將事件向上傳遞給父元件
 */
// const handleMoreClick = () => {
//   emit('moreClick')
// }
</script>
