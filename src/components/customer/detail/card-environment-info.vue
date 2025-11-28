<template>
  <div class="flex h-full flex-col rounded-xl bg-white py-6 px-5 shadow-md gap-8">
    <div class="flex flex-col gap-8">
      <!-- 卡片標題 -->
      <div class="flex items-center gap-2">
        <img :src="EnvironmentIcon" alt="環境設定" class="h-6 w-6" />
        <h3 class="typo-base-bold text-neutral-700">環境設定資訊</h3>
      </div>

      <!-- 環境連結區塊 -->
      <div class="flex-1 space-y-1">
        <!-- 前台連結 -->
        <div class="flex h-9 items-center justify-between">
          <span class="typo-sm-medium text-neutral-700">前台連結</span>
          <BadgeButton text="前往" :icon="linkIcon" @click="openUrl(environmentInfo.frontendUrl)" />
        </div>

        <!-- 後台連結 -->
        <div class="flex h-9 items-center justify-between">
          <span class="typo-sm-medium text-neutral-700">後台連結</span>
          <BadgeButton text="前往" :icon="linkIcon" @click="openUrl(environmentInfo.backendUrl)" />
        </div>

        <!-- 快速自動導入 -->
        <div class="flex h-9 items-center justify-between">
          <span class="typo-sm-medium text-neutral-700">快速自動導入</span>
          <BadgeButton text="前往" :icon="linkIcon" @click="openUrl(environmentInfo.autoUrl)" />
        </div>

        <!-- PinCode -->
        <div class="flex h-9 items-center justify-between">
          <span class="typo-sm-medium text-neutral-700">PinCode</span>
          <div class="flex items-center gap-2">
            <span class="typo-sm-medium text-neutral-800">
              {{ environmentInfo.pinCode }}
            </span>
            <img
              :src="copyIcon"
              alt="複製"
              class="h-4 w-4 cursor-pointer text-neutral-400 transition-opacity hover:opacity-70"
              title="點擊複製 PinCode"
              @click="copyToClipboard(environmentInfo.pinCode)"
            />
          </div>
        </div>

        <!-- 客戶代號 -->
        <div class="flex h-9 items-center justify-between">
          <span class="typo-sm-medium text-neutral-700">客戶代號</span>
          <div class="flex items-center gap-2">
            <span class="typo-sm-medium text-neutral-800">
              {{ environmentInfo.domainName }}
            </span>
            <img
              :src="copyIcon"
              alt="複製"
              class="h-4 w-4 cursor-pointer text-neutral-400 transition-opacity hover:opacity-70"
              title="點擊複製客戶代號"
              @click="copyToClipboard(environmentInfo.domainName)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BadgeButton from '@/components/common/badge-button.vue'
import EnvironmentIcon from '@/assets/icons/card/environment.svg'
import linkIcon from '@/assets/icons/common/cm-link.svg'
import copyIcon from '@/assets/icons/common/cm-copy.svg'

/**
 * 環境設定資訊卡片
 *
 * 用途：
 * - 顯示客戶的環境連結和基本設定資訊
 * - 提供快速訪問和複製功能
 *
 * 特點：
 * - 連結以新分頁開啟
 * - 支援複製 PinCode 和客戶代號
 * - 使用 BadgeButton 元件統一按鈕樣式
 * - 每條 list 固定高度 36px
 */

interface Props {
  environmentInfo: {
    frontendUrl: string
    backendUrl: string
    autoUrl: string
    pinCode: string
    domainName: string
  }
}

defineProps<Props>()

/**
 * 在新分頁開啟 URL
 */
const openUrl = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

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
</script>
