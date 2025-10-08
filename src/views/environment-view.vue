<template>
  <!-- 頁面容器 -->
  <div class="page-container">
    <!-- 頁面標題 -->
    <h1 class="page-title">環境管理</h1>
    
    <!-- 說明文字 -->
    <p class="page-description">
      這是環境管理頁面，目前為測試版本。
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
 * 環境管理頁面
 * 
 * TODO: 未來實作功能
 * - 環境列表顯示
 * - 環境配置管理
 */
</script>

<style scoped>
/**
 * 頁面容器
 */
.page-container {
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100%;
}

/**
 * 頁面標題
 */
.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}

/**
 * 說明文字
 */
.page-description {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
}

/**
 * 頁面內容區域
 */
.page-content {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/**
 * 內容佔位符
 */
.content-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
}
</style>
