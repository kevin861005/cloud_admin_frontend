<template>
  <!-- 刪除確認 Dialog -->
  <BaseDialog v-model="isVisible" title="刪除環境" :subtitle="subtitle">
    <!-- 說明文字 -->
    <p class="typo-sm-bold text-semantic-error">此操作無法復原，請再次確認</p>

    <!-- 按鈕區域 -->
    <template #footer>
      <!-- 取消按鈕 -->
      <button
        type="button"
        class="typo-sm-bold group relative cursor-pointer rounded-lg bg-gray-100 px-6 py-3 text-neutral-600 transition-colors"
        @click="handleClose"
      >
        <!-- 黑色遮罩層（只影響背景） -->
        <span
          class="absolute inset-0 rounded-lg bg-black opacity-0 transition-opacity group-hover:opacity-10"
        />
        <!-- 按鈕文字（不受影響） -->
        <span class="relative">取消</span>
      </button>

      <!-- 確認刪除按鈕 -->
      <button
        type="button"
        class="typo-sm-bold bg-semantic-error group relative flex cursor-pointer items-center gap-2 rounded-lg px-6 py-3 text-white transition-colors"
        @click="handleConfirm"
      >
        <!-- 黑色遮罩層（只影響背景） -->
        <span
          class="absolute inset-0 rounded-lg bg-black opacity-0 transition-opacity group-hover:opacity-10"
        />
        <!-- 按鈕內容（不受影響） -->
        <span class="relative">確認刪除</span>
      </button>
    </template>
  </BaseDialog>

  <!-- 進度條 Dialog -->
  <TaskProgressDialog
    v-model="showProgressDialog"
    :title="progressTitle"
    :description="progressDescription"
    :progress="progressValue"
  />
</template>

<script setup lang="ts">
/**
 * DialogBatchDeleteEnvironment - 批次環境刪除確認對話框
 *
 * 用於確認是否批次刪除多個環境，並追蹤刪除進度
 * - 刪除成功：透過 URL query 顯示成功 Toast，並刷新頁面
 * - 刪除失敗：透過 URL query 顯示錯誤 Toast
 */
import { ref, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseDialog from "@/components/dialog/base-dialog.vue";
import TaskProgressDialog from "@/components/dialog/task-progress-dialog.vue";
import { environmentService } from "@/services/environment.service";
import { taskService } from "@/services/task.service";
import { ApiError } from "@/types/common";
import type { TaskProgressEvent } from "@/types/task";

// ========== Router ==========
const route = useRoute();
const router = useRouter();

// ========== Props 定義 ==========
interface Props {
  /** 控制 Dialog 顯示/隱藏 (v-model) */
  modelValue: boolean;
  /** 要刪除的客戶編號陣列 */
  customerNos: string[];
}

const props = defineProps<Props>();

// ========== Emits 定義 ==========
const emit = defineEmits<{
  /** 更新 v-model */
  "update:modelValue": [value: boolean];
  /** 刪除成功（通知父元件刷新列表） */
  "delete-success": [];
}>();

// ========== Computed ==========
/** 用 computed 來處理 v-model，避免直接修改 prop */
const isVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

/** Dialog 副標題 */
const subtitle = computed(() => `確定要刪除 ${props.customerNos.length} 個環境嗎？`);

// ========== 進度條 Dialog 狀態 ==========
const showProgressDialog = ref(false);
const progressTitle = ref("");
const progressDescription = ref("");
const progressValue = ref(0);

// ========== 進度更新佇列 ==========
const progressQueue: Array<{ message: string; progress: number }> = [];
let isProcessingQueue = false;
const PROGRESS_ANIMATION_DURATION = 350;

// ========== SSE 連線關閉函數 ==========
let closeSSE: (() => void) | null = null;

// ========== Methods ==========

/**
 * 關閉 Dialog
 */
function handleClose() {
  isVisible.value = false;
}

/**
 * 確認刪除
 */
async function handleConfirm() {
  if (props.customerNos.length === 0) {
    console.error("沒有選擇要刪除的環境");
    return;
  }

  // 1. 關閉確認 Dialog
  isVisible.value = false;

  // 2. 重置進度佇列
  resetProgressQueue();

  // 3. 開啟進度條 Dialog
  progressTitle.value = "批次刪除環境中...";
  progressDescription.value = "正在準備...";
  progressValue.value = 0;
  showProgressDialog.value = true;

  try {
    // 4. 呼叫 API 取得 taskId
    const { taskId } = await environmentService.batchDeleteEnvironmentsWithProgress(
      props.customerNos
    );

    // 5. 建立 SSE 連線
    closeSSE = taskService.subscribeProgress(taskId, {
      onProgress: handleProgress,
      onCompleted: handleCompleted,
      onError: handleError,
      onConnectionError: handleConnectionError,
    });
  } catch (error) {
    console.error("啟動批次刪除環境任務失敗:", error);
    showProgressDialog.value = false;

    // 取得錯誤訊息並透過 URL query 顯示
    const errorMessage = getErrorMessage(error);
    showWarningToast(errorMessage);
  }
}

/**
 * 從錯誤物件中取得錯誤訊息
 */
function getErrorMessage(error: unknown): string {
  // ApiError（自訂業務錯誤）
  if (error instanceof ApiError) {
    return error.message;
  }

  // AxiosError 或其他 Error
  if (error instanceof Error) {
    // 如果是 Axios 錯誤，嘗試取得後端回傳的訊息
    const axiosError = error as { response?: { data?: { message?: string } } };
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    return error.message;
  }

  return "批次刪除環境失敗，請稍後再試";
}

/**
 * 處理進度更新（加入佇列）
 */
function handleProgress(event: TaskProgressEvent) {
  // 將進度加入佇列
  progressQueue.push({
    message: event.message,
    progress: event.progress,
  });

  // 開始處理佇列
  processProgressQueue();
}

/**
 * 依序處理進度佇列
 */
function processProgressQueue() {
  // 如果正在處理中或佇列為空，則返回
  if (isProcessingQueue || progressQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;

  // 取出下一個進度
  const next = progressQueue.shift()!;
  progressDescription.value = next.message;
  progressValue.value = next.progress;

  // 等待動畫完成後處理下一個
  setTimeout(() => {
    isProcessingQueue = false;
    processProgressQueue();
  }, PROGRESS_ANIMATION_DURATION);
}

/**
 * 重置進度佇列
 */
function resetProgressQueue() {
  progressQueue.length = 0;
  isProcessingQueue = false;
  progressValue.value = 0;
  progressDescription.value = "";
}

/**
 * 處理任務完成
 */
function handleCompleted(event: TaskProgressEvent) {
  // 更新進度到 100%
  progressDescription.value = event.message;
  progressValue.value = 100;

  // 短暫延遲後關閉進度條並顯示成功 Toast
  setTimeout(() => {
    showProgressDialog.value = false;

    // 通知父元件刷新列表
    emit("delete-success");

    // 透過 URL query 顯示成功 Toast
    showSuccessToast("批次刪除環境成功");
  }, 500);
}

/**
 * 處理任務錯誤
 */
function handleError(event: TaskProgressEvent) {
  // 關閉進度條
  showProgressDialog.value = false;

  const errorMessage = event.message || "批次刪除環境失敗，請再試一次";
  showWarningToast(errorMessage);
}

/**
 * 處理 SSE 連線錯誤
 */
function handleConnectionError() {
  // 關閉進度條
  showProgressDialog.value = false;

  showWarningToast("連線中斷，請重新嘗試");
}

/**
 * 顯示成功 Toast
 */
function showSuccessToast(message: string) {
  router.replace({
    path: route.path,
    query: {
      success: message,
      t: Date.now(),
    },
  });
}

/**
 * 顯示警告 Toast
 */
function showWarningToast(message: string) {
  router.replace({
    path: route.path,
    query: {
      warning: message,
      t: Date.now(),
    },
  });
}

/**
 * 元件卸載時關閉 SSE 連線
 */
onUnmounted(() => {
  if (closeSSE) {
    closeSSE();
    closeSSE = null;
  }
});
</script>
