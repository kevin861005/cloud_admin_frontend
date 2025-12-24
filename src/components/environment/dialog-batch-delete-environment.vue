<template>
  <!-- 批次刪除確認 Dialog -->
  <BaseDialog
    v-model="isVisible"
    :title="`刪除 ${customerNos.length} 個環境`"
    subtitle="請確認是否要刪除所選的環境"
  >
    <!-- 說明文字 -->
    <p class="typo-sm-bold text-semantic-warning">此操作無法復原</p>

    <!-- 按鈕區域 -->
    <template #footer>
      <!-- 取消按鈕 -->
      <button
        type="button"
        class="typo-sm-bold group relative cursor-pointer rounded-lg bg-gray-100 px-6 py-3 text-neutral-600 transition-colors"
        @click="handleClose"
      >
        <span
          class="absolute inset-0 rounded-lg bg-black opacity-0 transition-opacity group-hover:opacity-10"
        />
        <span class="relative">取消</span>
      </button>

      <!-- 確認刪除按鈕 -->
      <button
        type="button"
        class="typo-sm-bold group relative flex cursor-pointer items-center gap-2 rounded-lg bg-semantic-warning px-6 py-3 text-white transition-colors"
        @click="handleConfirm"
      >
        <span
          class="absolute inset-0 rounded-lg bg-black opacity-0 transition-opacity group-hover:opacity-10"
        />
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
 * BatchDeleteEnvironmentDialog - 批次刪除環境確認對話框
 *
 * 用於確認是否批次刪除多個客戶的環境，並追蹤刪除進度
 * 刪除成功後會發出 deleted 事件，由父元件刷新列表
 */
import { ref, computed, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseDialog from "@/components/dialog/base-dialog.vue";
import TaskProgressDialog from "@/components/dialog/task-progress-dialog.vue";
import { environmentService } from "@/services/environment.service";
import { taskService } from "@/services/task.service";
import { ApiError } from "@/types/common";
import type { TaskProgressEvent } from "@/types/task";

// ========== Props 定義 ==========
interface Props {
  /** 控制 Dialog 顯示/隱藏 (v-model) */
  modelValue: boolean;
  /** 客戶編號陣列 */
  customerNos: string[];
}

const props = defineProps<Props>();

// ========== Emits 定義 ==========
const emit = defineEmits<{
  /** 更新 v-model */
  "update:modelValue": [value: boolean];
  /** 刪除成功 */
  deleted: [];
}>();

// ========== Router ==========
const router = useRouter();
const route = useRoute();

// ========== Computed ==========

/** 用 computed 來處理 v-model */
const isVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

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
    console.error("缺少客戶編號");
    return;
  }

  // 1. 關閉確認 Dialog
  isVisible.value = false;

  // 2. 重置進度佇列
  resetProgressQueue();

  // 3. 開啟進度條 Dialog
  progressTitle.value = `刪除 ${props.customerNos.length} 個環境中...`;
  progressDescription.value = "正在準備...";
  progressValue.value = 0;
  showProgressDialog.value = true;

  try {
    // 4. 呼叫批次刪除 API 取得 taskId
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

    const errorMessage = getErrorMessage(error);
    navigateWithWarning(errorMessage);
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
  progressQueue.push({
    message: event.message,
    progress: event.progress,
  });
  processProgressQueue();
}

/**
 * 依序處理進度佇列
 */
function processProgressQueue() {
  if (isProcessingQueue || progressQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;

  const next = progressQueue.shift()!;
  progressDescription.value = next.message;
  progressValue.value = next.progress;

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
  progressDescription.value = event.message;
  progressValue.value = 100;

  setTimeout(() => {
    showProgressDialog.value = false;

    // 發出事件，讓父元件刷新列表
    emit("deleted");

    // 顯示成功訊息
    navigateWithSuccess("批次刪除環境成功");
  }, 500);
}

/**
 * 處理任務錯誤
 */
function handleError(event: TaskProgressEvent) {
  showProgressDialog.value = false;

  const errorMessage = event.message || "批次刪除環境失敗，請再試一次";
  navigateWithWarning(errorMessage);
}

/**
 * 處理 SSE 連線錯誤
 */
function handleConnectionError() {
  showProgressDialog.value = false;
  navigateWithWarning("連線中斷，請重新嘗試");
}

/**
 * 留在當前頁面並顯示警告訊息
 */
function navigateWithWarning(message: string) {
  router.replace({
    path: route.path,
    query: {
      warning: message,
      t: Date.now(),
    },
  });
}

/**
 * 留在當前頁面並顯示成功訊息
 */
function navigateWithSuccess(message: string) {
  router.replace({
    path: route.path,
    query: {
      success: message,
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
