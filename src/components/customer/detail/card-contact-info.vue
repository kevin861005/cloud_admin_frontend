<template>
  <div class="flex h-full flex-col rounded-xl bg-white py-6 px-5 shadow-md gap-8">
    <div class="flex flex-col gap-8">
      <!-- 卡片標題 -->
      <div class="flex items-center gap-2">
        <img :src="ContactIcon" alt="聯絡資訊" class="h-6 w-6" />
        <h3 class="text-base font-bold text-gray-700">聯絡資訊</h3>
      </div>

      <!-- 聯絡資訊列表 -->
      <div class="flex-1 space-y-1">
        <!-- 聯絡人 -->
        <div class="flex h-9 items-center justify-between">
          <span class="text-sm font-medium text-gray-700">聯絡人</span>
          <span class="text-sm font-medium text-gray-800">
            {{ contactInfo.contactPerson }}
          </span>
        </div>

        <!-- 聯絡電話 -->
        <div class="flex h-9 items-center justify-between">
          <span class="text-sm font-medium text-gray-700">聯絡電話</span>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-800">
              {{ contactInfo.phone }}
            </span>
            <img
              :src="copyIcon"
              alt="複製"
              class="h-4 w-4 cursor-pointer text-gray-400 transition-opacity hover:opacity-70"
              title="點擊複製 PinCode"
              @click="copyToClipboard(contactInfo.phone)"
            />
          </div>
        </div>

        <!-- 電子信箱 -->
        <div class="flex h-9 items-center justify-between">
          <span class="text-sm font-medium text-gray-700">電子信箱</span>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-800">
              {{ contactInfo.email }}
            </span>
            <img
              :src="copyIcon"
              alt="複製"
              class="h-4 w-4 cursor-pointer text-gray-400 transition-opacity hover:opacity-70"
              title="點擊複製 PinCode"
              @click="copyToClipboard(contactInfo.email)"
            />
          </div>
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
import ContactIcon from '@/assets/icons/card/contact.svg'
import BadgeButton from '@/components/common/badge-button.vue'
import copyIcon from '@/assets/icons/common/cm-copy.svg'

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
const emit = defineEmits<{
  /**
   * 更多按鈕點擊事件
   */
  moreClick: []
}>()

/**
 * 複製文字到剪貼簿
 */
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // 不顯示提示訊息（依照需求）
  } catch (err) {
    console.error('複製失敗:', err)
  }
}

/**
 * 處理更多按鈕點擊
 * 將事件向上傳遞給父元件
 */
const handleMoreClick = () => {
  emit('moreClick')
}
</script>
