<template>
  <BaseDialog
    v-model="isVisible"
    title="重啟環境"
    :subtitle="`是否重啟「${customerName}」的環境嗎？`"
    :loading="isRestarting"
    :close-on-overlay="!isRestarting"
  >
    <!-- 說明文字 -->
    <p class="typo-sm-bold text-semantic-warning">更新大約1-2分鐘，操作期間服務暫時無法使用</p>

    <!-- 按鈕區域 -->
    <template #footer>
      <!-- 取消按鈕 -->
      <button
        type="button"
        :disabled="isRestarting"
        class="rounded-lg bg-neutral-100 px-6 py-3 typo-sm-bold text-neutral-600 transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
        @click="handleClose"
      >
        取消
      </button>

      <!-- 確認重啟按鈕 -->
      <button
        type="button"
        :disabled="isRestarting"
        class="flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-3 typo-sm-bold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
        @click="handleConfirm"
      >
        <LoadingSpinner v-if="isRestarting" class="h-4 w-4" />
        {{ isRestarting ? '重啟中...' : '確認重啟' }}
      </button>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
/**
 * RestartDialog - 重啟環境確認對話框
 *
 * 用於確認是否重啟指定客戶的環境
 */
import { ref, computed } from 'vue'
import BaseDialog from '@/components/dialog/base-dialog.vue'
import LoadingSpinner from '@/components/common/loading-spinner.vue'
import { environmentService } from '@/services/environment.service'
import type { DockerServiceInfo } from '@/types/service'

// ========== Props 定義 ==========
interface Props {
  /** 控制 Dialog 顯示/隱藏 (v-model) */
  modelValue: boolean
  /** 客戶名稱（顯示用） */
  customerName: string
  /** 客戶編號（API 用） */
  customerNo: string
}

const props = defineProps<Props>()

// ========== Emits 定義 ==========
const emit = defineEmits<{
  /** 更新 v-model */
  'update:modelValue': [value: boolean]
  /** 重啟成功，回傳最新的 Docker 資訊 */
  success: [docker: DockerServiceInfo]
  /** 重啟失敗，回傳錯誤訊息 */
  error: [message: string]
}>()

// ========== 狀態 ==========
/** 是否正在重啟中 */
const isRestarting = ref(false)

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
  if (!isRestarting.value) {
    isVisible.value = false
  }
}

/**
 * 確認重啟
 */
async function handleConfirm() {
  if (!props.customerNo) {
    console.error('缺少 customerNo')
    return
  }

  try {
    isRestarting.value = true

    // 呼叫重啟 API
    const response = await environmentService.restartEnvironment(props.customerNo)

    if (response.success && response.data?.success && response.data.docker) {
      // 重啟成功，回傳最新的 Docker 資訊
      emit('success', response.data.docker)
      isVisible.value = false
    } else {
      // 重啟失敗
      const errorMessage = response.data?.message ?? response.message ?? '重啟失敗，請稍後再試'
      emit('error', errorMessage)
    }
  } catch (error) {
    console.error('重啟環境失敗:', error)
    emit('error', error instanceof Error ? error.message : '系統錯誤，請聯繫管理員')
  } finally {
    isRestarting.value = false
  }
}
</script>
