<template>
  <BaseDialog
    v-model="isVisible"
    title="申請環境刪除"
    :subtitle="`已選擇${props.customerNos.length}個客戶，送出後系統將自動寄信`"
    :loading="isSubmitting"
    :close-on-overlay="!isSubmitting"
    @update:model-value="handleDialogChange"
  >
    <!-- 提示文字 -->
    <p class="typo-xs-bold text-semantic-error">「環境管理」可查看申請進度</p>

    <!-- 按鈕區域 -->
    <template #footer>
      <!-- 取消按鈕 -->
      <button
        type="button"
        :disabled="isSubmitting"
        class="typo-sm-bold group relative rounded-lg bg-neutral-100 px-6 py-3 text-neutral-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        @click="handleClose"
      >
        <span
          class="absolute inset-0 rounded-lg bg-black opacity-0 transition-opacity group-hover:opacity-10 group-disabled:opacity-0"
        />
        <span class="relative">取消</span>
      </button>

      <!-- 送出申請按鈕 -->
      <button
        type="button"
        :disabled="isSubmitting || props.customerNos.length === 0"
        class="typo-sm-bold group relative rounded-lg bg-primary-500 px-6 py-3 text-white transition-colors disabled:cursor-not-allowed disabled:bg-neutral-300"
        @click="handleSubmit"
      >
        <span
          class="absolute inset-0 rounded-lg bg-black opacity-0 transition-opacity group-hover:opacity-10 disabled:group-hover:opacity-0"
        />
        <span class="relative">{{ isSubmitting ? "送出中..." : "送出申請" }}</span>
      </button>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
/**
 * ApplyDeleteDialog - 申請環境刪除對話框
 *
 * 功能：
 * - 顯示已選擇的客戶數量
 * - 送出申請後呼叫 API
 * - 成功後關閉 Dialog 並更新網址參數
 */
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import BaseDialog from "@/components/dialog/base-dialog.vue";
import { environmentService } from "@/services/environment.service";
import { ApiError } from "@/types/common";

// ========== Props 定義 ==========
interface Props {
  /** 控制 Dialog 顯示/隱藏 (v-model) */
  modelValue: boolean;
  /** 選中的客戶編號清單 */
  customerNos: string[];
}

const props = defineProps<Props>();

// ========== Emits 定義 ==========
const emit = defineEmits<{
  /** 更新 v-model */
  "update:modelValue": [value: boolean];
  /** 申請成功事件 */
  success: [];
}>();

// ========== Router ==========
const router = useRouter();

// ========== 狀態 ==========
/** 送出中狀態 */
const isSubmitting = ref(false);

/** 錯誤訊息 */
const errorMessage = ref<string | null>(null);

// ========== Computed ==========
/** 用 computed 來處理 v-model */
const isVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

// ========== Methods ==========
/**
 * Dialog 關閉/開啟變化時的處理
 */
function handleDialogChange(value: boolean) {
  if (!value) {
    resetState();
  }
}

/**
 * 關閉 Dialog
 */
function handleClose() {
  if (!isSubmitting.value) {
    isVisible.value = false;
  }
}

/**
 * 送出申請
 */
async function handleSubmit() {
  if (isSubmitting.value || props.customerNos.length === 0) return;

  isSubmitting.value = true;
  errorMessage.value = null;

  try {
    await environmentService.applyDeletion(props.customerNos);

    // 關閉 Dialog
    isVisible.value = false;

    // 更新網址參數
    router.replace({
      query: { success: "申請成功" },
    });

    // 發出成功事件
    emit("success");
  } catch (error) {
    if (error instanceof ApiError) {
      errorMessage.value = error.message;
      console.error("申請環境刪除失敗:", error.message);
    } else {
      errorMessage.value = "發生未預期的錯誤";
      console.error("申請環境刪除錯誤:", error);
    }
    // TODO: 可加入錯誤提示 Toast
  } finally {
    isSubmitting.value = false;
  }
}

/**
 * 重置狀態
 */
function resetState() {
  isSubmitting.value = false;
  errorMessage.value = null;
}
</script>
