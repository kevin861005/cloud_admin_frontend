<template>
  <BaseDialog
    v-model="isVisible"
    title="刪除環境"
    subtitle="請確認是否要刪除此環境"
    :loading="isDeleting"
  >
    <!-- 說明文字 -->
    <p class="typo-sm-bold text-semantic-warning">此操作無法復原</p>

    <!-- 按鈕區域 -->
    <template #footer>
      <!-- 取消按鈕 -->
      <button
        type="button"
        :disabled="isDeleting"
        class="rounded-lg bg-gray-100 px-6 py-3 typo-sm-bold text-neutral-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        @click="handleClose"
      >
        取消
      </button>

      <!-- 確認刪除按鈕 -->
      <button
        type="button"
        :disabled="isDeleting"
        class="flex items-center gap-2 rounded-lg bg-semantic-warning px-6 py-3 typo-sm-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        @click="handleConfirm"
      >
        <LoadingSpinner v-if="isDeleting" class="h-4 w-4" />
        {{ isDeleting ? '刪除中...' : '確認刪除' }}
      </button>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
/**
 * DeleteDialog - 刪除環境確認對話框
 *
 * 用於確認是否刪除指定客戶的環境
 */
import { computed } from 'vue'
import BaseDialog from '@/components/dialog/base-dialog.vue'
import LoadingSpinner from '@/components/common/loading-spinner.vue'

// ========== Props 定義 ==========
interface Props {
  /** 控制 Dialog 顯示/隱藏 (v-model) */
  modelValue: boolean
  /** 是否正在刪除中 */
  isDeleting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDeleting: false,
})

// ========== Emits 定義 ==========
const emit = defineEmits<{
  /** 更新 v-model */
  'update:modelValue': [value: boolean]
  /** 確認刪除 */
  confirm: []
}>()

// ========== Computed ==========
/** 用 computed 來處理 v-model，避免直接修改 prop */
const isVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

// ========== Methods ==========
/**
 * 關閉 Dialog
 */
function handleClose() {
  if (!props.isDeleting) {
    isVisible.value = false
  }
}

/**
 * 確認刪除
 */
function handleConfirm() {
  emit('confirm')
}
</script>
