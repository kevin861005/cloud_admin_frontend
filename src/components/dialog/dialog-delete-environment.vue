<template>
  <!-- 遮罩層 -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="handleClose"
      >
        <!-- Dialog 容器 -->
        <div
          class="relative w-full max-w-2xl rounded-lg bg-white shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
        >
          <!-- 關閉按鈕 -->
          <button
            type="button"
            class="absolute right-6 top-6 text-neutral-400 transition-colors hover:text-neutral-600"
            @click="handleClose"
            aria-label="關閉對話框"
          >
            <img :src="CloseIcon" alt="關閉" class="h-4 w-4" />
          </button>

          <!-- 內容區域 -->
          <div class="px-12 pb-8 pt-12">
            <!-- 標題 -->
            <h2 id="dialog-title" class="mb-6 typo-base-bold text-neutral-800">刪除環境確認</h2>

            <!-- 說明文字 -->
            <div class="space-y-4">
              <!-- 第一段：灰色說明 -->
              <p class="typo-sm text-neutral-500">
                此操作將會刪除整個系統環境，包含Docker容器、資料庫、DNS設定和NGINX配置
              </p>

              <!-- 第二段：紅色警告 -->
              <p class="typo-sm-bold text-red-600">此操作無法復原，請謹慎確認</p>
            </div>

            <!-- 按鈕區域 -->
            <div class="mt-8 flex justify-end gap-3">
              <!-- 取消按鈕 -->
              <button
                type="button"
                class="rounded-lg bg-gray-100 px-6 py-3 typo-sm-bold text-neutral-600 transition-colors hover:bg-gray-200"
                @click="handleClose"
              >
                取消
              </button>

              <!-- 確認刪除按鈕 -->
              <button
                type="button"
                class="rounded-lg bg-red-600 px-6 py-3 typo-sm-bold text-white transition-colors hover:bg-red-700"
                :disabled="isDeleting"
                @click="handleConfirm"
              >
                {{ isDeleting ? '刪除中...' : '確認刪除' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import CloseIcon from '@/assets/icons/common/cm-close.svg'

/**
 * Props 定義
 */
interface Props {
  /** 控制 Dialog 顯示/隱藏 */
  modelValue: boolean
  /** 環境 ID（用於刪除 API） */
  environmentId?: string
}

const props = defineProps<Props>()

/**
 * Emits 定義
 */
const emit = defineEmits<{
  /** 更新 modelValue */
  'update:modelValue': [value: boolean]
  /** 刪除成功 */
  deleted: []
}>()

/**
 * 是否正在刪除
 */
const isDeleting = ref(false)

/**
 * 關閉 Dialog
 */
function handleClose() {
  if (isDeleting.value) return // 刪除中不允許關閉
  emit('update:modelValue', false)
}

/**
 * 確認刪除
 */
async function handleConfirm() {
  if (!props.environmentId) {
    console.error('缺少 environmentId')
    return
  }

  try {
    isDeleting.value = true

    // TODO: 呼叫刪除環境 API
    // await environmentService.deleteEnvironment(props.environmentId)

    // 模擬 API 呼叫（開發時使用）
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 刪除成功
    emit('deleted')
    emit('update:modelValue', false)

    // TODO: 顯示成功訊息（可使用 Toast）
    console.log('環境刪除成功')
  } catch (error) {
    console.error('刪除環境失敗:', error)
    // TODO: 顯示錯誤訊息
  } finally {
    isDeleting.value = false
  }
}

/**
 * 監聽 ESC 鍵關閉 Dialog
 */
function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue) {
    handleClose()
  }
}

/**
 * 監聽 Dialog 開啟/關閉，控制背景滾動
 */
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      // Dialog 開啟：阻止背景滾動
      document.body.style.overflow = 'hidden'
      // 監聽 ESC 鍵
      document.addEventListener('keydown', handleEscape)
    } else {
      // Dialog 關閉：恢復背景滾動
      document.body.style.overflow = ''
      // 移除 ESC 鍵監聽
      document.removeEventListener('keydown', handleEscape)
    }
  },
)
</script>
