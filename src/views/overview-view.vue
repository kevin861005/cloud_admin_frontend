<template>
  <!-- 
    總覽頁面
    
    功能：
    1. 顯示客戶統計卡片
    2. 顯示月度成長卡片
    3. 顯示異常警示卡片
    4. 顯示需關注客戶列表
    5. 顯示模組使用量圖表
    6. 顯示客戶列表表格
    
    目前狀態：基本框架，詳細內容待實作
  -->
  <div class="space-y-6">
    <!-- 頁面標題 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">總覽</h1>
      <p class="mt-2 text-sm text-gray-500">關鍵指標和客戶活動狀況</p>
    </div>

    <!-- 暫時顯示占位區塊 -->
    <div class="rounded-lg border border-gray-200 bg-white p-8 text-center">
      <div class="space-y-4">
        <div class="text-6xl">📊</div>
        <h2 class="text-xl font-semibold text-gray-700">總覽頁面</h2>
        <p class="text-sm text-gray-500">
          詳細內容（統計卡片、圖表、表格）待實作<br />
          目前先確認 Container 和佈局是否正確
        </p>
        <div class="mt-6 text-left text-sm text-gray-600">
          <p class="font-semibold">待實作項目：</p>
          <ul class="mt-2 list-inside list-disc space-y-1">
            <li>客戶統計卡片（活躍、低活躍、未使用）</li>
            <li>月度成長卡片</li>
            <li>異常警示卡片</li>
            <li>需關注客戶列表</li>
            <li>模組使用量圖表（週報/月報）</li>
            <li>客戶列表表格（分頁、篩選、搜尋）</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 
      TODO: 實作 dashboard.pdf 的詳細內容
      
      根據設計稿，需要實作以下區塊：
      
      1. 統計卡片區（第一行）
         - 客戶統計卡片（活躍、低活躍、未使用）
         - 月度成長卡片
         - 異常警示卡片
      
      2. 需關注客戶 + 圖表區（第二行）
         - 左側：需關注客戶列表（含分頁）
         - 右側：模組使用量圖表（週報/月報切換）
      
      3. 客戶列表表格（第三行）
         - 篩選器（狀態、模組、業務）
         - 搜尋框
         - 表格（含分頁）
         - 操作按鈕（查看、編輯等）
    -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// ==================== Lifecycle ====================

/**
 * 元件掛載時：可以在這裡呼叫 API 取得資料
 */
onMounted(() => {
  console.log('總覽頁面已載入')
  // TODO: 呼叫 API 取得統計資料
})
</script>

<style scoped>
/* 
  總覽頁面樣式
  
  使用 Tailwind CSS 的 utility classes
  避免自定義 CSS
*/
</style>
