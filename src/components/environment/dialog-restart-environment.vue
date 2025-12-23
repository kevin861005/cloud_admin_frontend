<template>
  <BaseDialog
    v-model="isVisible"
    title="重啟環境"
    :subtitle="`是否重啟「${customerName}」的環境？`"
    :close-on-overlay="true"
  >
    <!-- 說明文字 -->
    <p class="typo-sm-bold text-semantic-warning">更新大約1-2分鐘，操作期間服務暫時無法使用</p>

    <!-- 按鈕區域 -->
    <template #footer>
      <!-- 取消按鈕 -->
      <button
        type="button"
        class="group relative rounded-lg bg-neutral-100 px-6 py-3 typo-sm-bold text-neutral-600 transition-colors"
        @click="handleClose"
      >
        <!-- 黑色遮罩層（只影響背景） -->
        <span
          class="absolute inset-0 rounded-lg bg-black opacity-0 transition-opacity group-hover:opacity-10"
        />
        <!-- 按鈕文字（不受影響） -->
        <span class="relative">取消</span>
      </button>

      <!-- 確認重啟按鈕 -->
      <button
        type="button"
        class="group relative rounded-lg bg-primary-500 px-6 py-3 typo-sm-bold text-white transition-colors"
        @click="handleConfirm"
      >
        <!-- 黑色遮罩層（只影響背景） -->
        <span
          class="absolute inset-0 rounded-lg bg-black opacity-0 transition-opacity group-hover:opacity-10"
        />
        <!-- 按鈕文字（不受影響） -->
        <span class="relative">確認重啟</span>
      </button>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
/**
 * DialogRestartEnvironment - 重啟環境確認對話框
 *
 * 用於確認是否重啟指定客戶的環境
 * 點擊確認後會 emit confirm 事件，由父元件處理後續流程
 */
import { computed } from 'vue'
import BaseDialog from '@/components/dialog/base-dialog.vue'

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
  /** 使用者確認重啟 */
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
  isVisible.value = false
}

/**
 * 確認重啟
 */
function handleConfirm() {
  emit('confirm')
}
</script>
