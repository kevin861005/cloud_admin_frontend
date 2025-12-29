<template>
  <div class="min-h-screen bg-neutral-100 p-8">
    <h1 class="typo-2xl-medium mb-8 text-neutral-800">Alert 元件測試</h1>

    <div class="max-w-2xl space-y-6">
      <!-- Error 類型 -->
      <div>
        <h2 class="typo-base mb-2 text-neutral-600">Error 類型</h2>
        <Alert
          type="error"
          title="載入失敗"
          description="無法連接到伺服器，請稍後再試"
          closable
          @close="handleClose('error')"
        />
      </div>

      <!-- Warning 類型 -->
      <div>
        <h2 class="typo-base mb-2 text-neutral-600">Warning 類型</h2>
        <Alert
          type="warning"
          title="注意事項"
          description="此操作將會影響所有相關資料，請確認後再執行"
          closable
          @close="handleClose('warning')"
        />
      </div>

      <!-- Success 類型 -->
      <div>
        <h2 class="typo-base mb-2 text-neutral-600">Success 類型</h2>
        <Alert
          type="success"
          title="操作成功"
          description="資料已成功儲存"
          closable
          @close="handleClose('success')"
        />
      </div>

      <!-- Info 類型 -->
      <div>
        <h2 class="typo-base mb-2 text-neutral-600">Info 類型</h2>
        <Alert
          type="info"
          title="系統通知"
          description="系統將於今晚 23:00 進行例行維護"
          closable
          @close="handleClose('info')"
        />
      </div>

      <!-- 帶按鈕的 Alert -->
      <div>
        <h2 class="typo-base mb-2 text-neutral-600">帶按鈕的 Alert</h2>
        <Alert
          type="error"
          title="連線逾時"
          description="與伺服器的連線已中斷"
          show-button
          button-text="重新連線"
          closable
          @button-click="handleButtonClick"
          @close="handleClose('button')"
        />
      </div>

      <!-- 只有標題的 Alert -->
      <div>
        <h2 class="typo-base mb-2 text-neutral-600">只有標題（無描述）</h2>
        <Alert type="info" title="這是一個簡單的通知訊息" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Alert from "@/components/common/alert.vue";

const handleClose = (type: string) => {
  console.log(`關閉 ${type} Alert`);
};

const handleButtonClick = () => {
  console.log("按鈕被點擊");
};
</script>
