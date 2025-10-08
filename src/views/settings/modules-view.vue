<template>
  <!-- 頁面容器 -->
  <div class="page-container">
    <!-- 頁面標題 -->
    <h1 class="page-title">模組設定</h1>
    
    <!-- 說明文字 -->
    <p class="page-description">
      這是模組設定頁面，目前為測試版本。
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
 * 模組設定頁面
 * 
 * TODO: 未來實作功能
 * - 模組列表顯示
 * - 模組啟用/停用管理
 */
</script>

<style scoped>
.page-container {
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100%;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}

.page-description {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
}

.page-content {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.content-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
}
</style>
