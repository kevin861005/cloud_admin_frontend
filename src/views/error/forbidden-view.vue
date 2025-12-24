<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-50">
    <div class="text-center">
      <!-- 403 圖示 -->
      <div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
        <svg
          class="h-12 w-12 text-semantic-warning"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <!-- 錯誤訊息 -->
      <h1 class="typo-4xl-bold mb-2 text-neutral-900">403</h1>
      <h2 class="typo-xl-medium mb-4 text-neutral-700">存取權限不足</h2>
      <p class="mb-8 text-neutral-500">
        抱歉，您沒有權限存取此頁面。<br />
        請聯繫系統管理員取得相關權限。
      </p>

      <!-- 返回按鈕 -->
      <div class="flex justify-center gap-4">
        <button
          class="rounded-lg bg-primary-500 px-6 py-2 text-white hover:bg-blue-700"
          @click="goToOverview"
        >
          返回總覽
        </button>
        <button
          class="rounded-lg border border-neutral-300 bg-white px-6 py-2 text-neutral-700 hover:bg-neutral-50"
          @click="goBack"
        >
          返回上一頁
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goToOverview = () => {
  router.push("/overview");
};

const goBack = () => {
  router.back();
};
</script>
