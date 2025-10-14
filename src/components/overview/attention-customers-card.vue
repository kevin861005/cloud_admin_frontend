<template>
  <!--
    需關注客戶卡片 (Card-Dashboard)

    尺寸規格：
    - Card-Dashboard: 387x396px (含 padding 24px)
    - Contents-Text: 339x296px
    - Card-top: 339x24px
    - Frame1: 339x248px (固定高度)
    - Pagination: 339x32px

    功能：
    1. 顯示需關注的客戶列表（4-7天內使用的客戶）
    2. 支援前端分頁（每頁 6 筆）
    3. 客戶名稱過長時顯示 tooltip
    4. 顯示最後使用時間和負責業務
  -->
  <div
    class="relative flex-shrink-0 w-[387px] h-[396px] bg-white 24px rounded-lg shadow-md p-6 flex flex-col"
  >
    <!-- Contents-Text: 339x296px, gap: 24px -->
    <div class="flex flex-col h-full">
      <!-- Card-top: 339x24px -->
      <div class="flex items-center h-6 mb-6">
        <!-- Title: 116x24px, gap: 12px -->
        <div class="flex items-center gap-3">
          <!-- Text: 需關注客戶 (80x22px) -->
          <h3
            class="text-base font-bold leading-[22px] text-black"
            style="font-family: 'Noto Sans TC', sans-serif"
          >
            需關注客戶
          </h3>

          <!-- Button-small: 24x24px -->
          <span
            class="inline-flex items-center justify-center min-w-[24px] h-6 px-2 py-1 text-xs font-medium leading-4 rounded"
            style="background: #398ff90d; border: 1px solid #398ff91a; color: #398ff9"
          >
            {{ totalCount }}
          </span>
        </div>
      </div>

      <!-- Frame1: 339x248px (固定高度), gap: 12px -->
      <div class="flex flex-col h-[248px]">
        <!-- Frame1-Title (表頭): 339x20px, gap: 20px -->
        <!-- 表頭下方有 border -->
        <div
          class="flex items-center h-5 gap-5 pb-3 mb-3"
          style="border-bottom: 1px solid #0000001a"
        >
          <!-- 第一個表頭: 147x20px -->
          <div
            class="flex items-center w-[147px] h-5 gap-1 text-sm font-medium leading-5 text-gray-600"
            style="font-family: 'Noto Sans TC', sans-serif"
          >
            客戶
          </div>

          <!-- 第二個表頭: 76x20px -->
          <div
            class="flex items-center w-[76px] h-5 gap-1 text-sm font-medium leading-5 text-gray-600"
            style="font-family: 'Noto Sans TC', sans-serif"
          >
            使用時間
            <!-- 排序箭頭: 16x16px -->
            <ArrowsUpDownIcon class="w-4 h-4 text-gray-500" />
          </div>

          <!-- 第三個表頭: 76x20px -->
          <div
            class="flex items-center w-[76px] h-5 gap-1 text-sm font-medium leading-5 text-gray-600"
            style="font-family: 'Noto Sans TC', sans-serif"
          >
            負責業務
            <!-- 排序箭頭: 16x16px -->
            <ArrowsUpDownIcon class="w-4 h-4 text-gray-500" />
          </div>
        </div>

        <!-- 客戶列表區域 (固定高度，即使資料不足 6 筆) -->
        <div class="flex-1 min-h-0">
          <!-- 資料載入中 -->
          <div v-if="isLoading" class="flex items-center justify-center h-full">
            <div
              class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"
            ></div>
          </div>

          <!-- 錯誤訊息 -->
          <div v-else-if="errorMessage" class="flex flex-col items-center justify-center h-full">
            <svg
              class="w-12 h-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="mt-2 text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <!-- 無資料 -->
          <div
            v-else-if="paginatedCustomers.length === 0"
            class="flex flex-col items-center justify-center h-full"
          >
            <svg
              class="w-12 h-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p class="mt-2 text-sm text-gray-500">目前沒有需要關注的客戶</p>
          </div>

          <!-- 客戶列表（每頁最多 6 筆，間距 12px）-->
          <!-- 整個列表容器下方有 border -->
          <div v-else class="space-y-3 pb-3" style="border-bottom: 1px solid #0000001a">
            <div
              v-for="customer in paginatedCustomers"
              :key="customer.id"
              class="flex items-center gap-5 py-1 hover:bg-gray-50 transition-colors"
            >
              <!-- 客戶名稱: 147px -->
              <div class="w-[147px] text-sm text-gray-900 truncate" :title="customer.customerName">
                {{ customer.customerName }}
              </div>

              <!-- 使用時間: 76px -->
              <div class="w-[76px] text-sm text-gray-600">
                {{ customer.lastUsedTime }}
              </div>

              <!-- 負責業務: 76px -->
              <div class="w-[76px] text-sm text-gray-600">
                {{ customer.salesPerson }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination: 339x32px (固定在底部) -->
      <div
        v-if="!isLoading && !errorMessage && totalPages > 1"
        class="flex items-center justify-between h-8 mt-auto pt-6"
      >
        <!-- Pagination-Text: 86x24px -->
        <div
          class="text-sm font-medium leading-5 text-gray-600"
          style="font-family: 'Noto Sans TC', sans-serif"
        >
          第{{ currentPage }}頁，共{{ totalPages }}頁
        </div>

        <!-- Pagination-Container: 84x32px, gap: 8px -->
        <div class="flex gap-2">
          <!-- 上一頁按鈕: 38x32px -->
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="flex items-center justify-center w-[38px] h-8 rounded-md border transition-colors"
            :class="
              currentPage === 1
                ? 'opacity-50 cursor-not-allowed bg-[#F8F9FF] border-[#00000014]'
                : 'bg-[#F8F9FF] border-[#00000014] hover:bg-gray-100'
            "
          >
            <svg
              class="w-4 h-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <!-- 下一頁按鈕: 38x32px -->
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="flex items-center justify-center w-[38px] h-8 rounded-md border transition-colors"
            :class="
              currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed bg-[#F8F9FF] border-[#00000014]'
                : 'bg-[#F8F9FF] border-[#00000014] hover:bg-gray-100'
            "
          >
            <svg
              class="w-4 h-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getMockAttentionCustomers } from '@/services/overview.service'
import type { AttentionCustomer } from '@/types/overview'
import { ArrowsUpDownIcon } from '@heroicons/vue/24/outline'

// ==================== 狀態管理 ====================

/** 所有需關注客戶資料（一次載入全部） */
const allCustomers = ref<AttentionCustomer[]>([])

/** 總筆數 */
const totalCount = ref(0)

/** 當前頁碼（從 1 開始） */
const currentPage = ref(1)

/** 每頁顯示筆數 */
const PAGE_SIZE = 6

/** 載入狀態 */
const isLoading = ref(false)

/** 錯誤訊息 */
const errorMessage = ref('')

// ==================== 計算屬性 ====================

/**
 * 計算總頁數
 */
const totalPages = computed(() => {
  return Math.ceil(totalCount.value / PAGE_SIZE)
})

/**
 * 計算當前頁要顯示的資料（前端分頁）
 */
const paginatedCustomers = computed(() => {
  const startIndex = (currentPage.value - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE
  return allCustomers.value.slice(startIndex, endIndex)
})

// ==================== 方法 ====================

/**
 * 載入需關注客戶資料
 */
async function loadAttentionCustomers() {
  try {
    isLoading.value = true
    errorMessage.value = ''

    // TODO: 等後端 API 完成後，改用真實 API
    // const data = await getAttentionCustomers()

    // 目前使用 Mock Data
    const data = getMockAttentionCustomers()

    allCustomers.value = data.customers
    totalCount.value = data.totalCount

    // 如果當前頁超過總頁數，重置到第一頁
    if (currentPage.value > totalPages.value) {
      currentPage.value = 1
    }
  } catch (error) {
    console.error('載入需關注客戶失敗:', error)
    errorMessage.value = error instanceof Error ? error.message : '載入失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

/**
 * 上一頁
 */
function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

/**
 * 下一頁
 */
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// ==================== Lifecycle ====================

/**
 * 元件掛載時載入資料
 */
onMounted(() => {
  loadAttentionCustomers()
})
</script>

<style scoped>
/* 使用 Tailwind CSS 和 inline styles，無需額外樣式 */
</style>
