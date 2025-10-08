<template>
  <!-- 頁面容器 -->
  <div class="page-container">
    <!-- 頁面標題 -->
    <h1 class="page-title">客戶管理</h1>
    
    <!-- 說明文字 -->
    <p class="page-description">
      這是客戶管理頁面，目前為測試版本。
    </p>
    
    <!-- 功能區塊（暫時空白，未來實作） -->
    <div class="page-content">
      <div class="content-placeholder">
        <p class="text-slate-400">頁面內容開發中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 客戶管理頁面
 * 
 * TODO: 未來實作功能
 * - 客戶列表顯示
 * - 搜尋功能
 * - 新增/編輯/刪除客戶
 */
</script>

<style scoped>
/**
 * 頁面容器
 */
.page-container {
  /* 內距：上下左右各 24px */
  padding: 24px;
  /* 背景色：淡灰色 */
  background-color: #f8fafc;
  /* 最小高度：填滿整個內容區域 */
  min-height: 100%;
}

/**
 * 頁面標題
 */
.page-title {
  /* 字體大小：24px */
  font-size: 24px;
  /* 字體粗細：粗體 */
  font-weight: 700;
  /* 字體顏色：深色 */
  color: #1e293b;
  /* 下方間距：16px */
  margin-bottom: 16px;
}

/**
 * 說明文字
 */
.page-description {
  /* 字體大小：14px */
  font-size: 14px;
  /* 字體顏色：中灰色 */
  color: #64748b;
  /* 下方間距：24px */
  margin-bottom: 24px;
}

/**
 * 頁面內容區域
 */
.page-content {
  /* 背景色：白色 */
  background-color: #ffffff;
  /* 圓角：8px */
  border-radius: 8px;
  /* 內距：32px */
  padding: 32px;
  /* 陰影 */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/**
 * 內容佔位符
 */
.content-placeholder {
  /* 佈局：置中 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* 最小高度：200px */
  min-height: 200px;
  /* 邊框：虛線 */
  border: 2px dashed #e2e8f0;
  /* 圓角：8px */
  border-radius: 8px;
}
</style>
