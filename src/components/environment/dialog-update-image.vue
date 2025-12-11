<template>
  <BaseDialog
    v-model="isVisible"
    title="更新映像"
    subtitle="請選擇要更新的版本"
    :loading="isUpdating"
    :close-on-overlay="!isUpdating && !isLoading"
    @update:model-value="handleDialogChange"
  >
    <!-- 提醒語 -->
    <p class="typo-sm-bold text-semantic-warning">更新大約1-2分鐘，操作期間服務暫時無法使用</p>

    <!-- 選項列表 -->
    <template #options>
      <!-- 載入中 -->
      <Loading v-if="isLoading" message="載入映像列表中..." />

      <!-- 載入錯誤 -->
      <Alert v-else-if="loadError" type="error" :title="loadError" description="請關閉後重新嘗試" />

      <!-- 映像列表 -->
      <div v-else class="max-h-[280px] space-y-2 overflow-y-auto py-2">
        <button
          v-for="image in images"
          :key="image.id"
          type="button"
          class="flex w-full flex-col gap-1 rounded border px-3 py-2 text-left transition-colors"
          :class="
            selectedImageId === image.id
              ? 'border-primary-500 bg-neutral-100'
              : 'border-neutral-200 bg-white hover:border-primary-500'
          "
          @click="handleSelectImage(image.id)"
        >
          <!-- Header：檔名 + 最新標籤 -->
          <div class="flex items-center justify-between">
            <span class="typo-sm-bold text-neutral-600">{{ image.name }}</span>
            <Badge v-if="image.isLatest" text="最新" type="success" />
          </div>

          <!-- Content：時間 + 容量 -->
          <div class="flex items-center justify-between">
            <span class="typo-xs text-neutral-500">{{ image.createdAt }}</span>
            <span class="typo-xs text-neutral-500">容量:{{ image.size }}</span>
          </div>
        </button>
      </div>
    </template>

    <!-- 按鈕區域 -->
    <template #footer>
      <!-- 取消按鈕 -->
      <button
        type="button"
        :disabled="isUpdating"
        class="group relative rounded-lg bg-neutral-100 px-6 py-3 typo-sm-bold text-neutral-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        @click="handleClose"
      >
        <!-- 黑色遮罩層（只影響背景） -->
        <span
          class="absolute inset-0 rounded-lg bg-black opacity-0 transition-opacity group-hover:opacity-10 group-disabled:opacity-0"
        />
        <!-- 按鈕文字（不受影響） -->
        <span class="relative">取消</span>
      </button>

      <!-- 更新按鈕 -->
      <button
        type="button"
        :disabled="!canConfirm"
        class="group relative rounded-lg bg-primary-500 px-6 py-3 typo-sm-bold text-white transition-colors disabled:cursor-not-allowed disabled:bg-neutral-300"
        @click="handleConfirm"
      >
        <!-- 黑色遮罩層（只影響背景） -->
        <span
          class="absolute inset-0 rounded-lg bg-black opacity-0 transition-opacity group-hover:opacity-10 disabled:group-hover:opacity-0"
        />
        <!-- 按鈕文字（不受影響） -->
        <span class="relative">更新</span>
      </button>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
/**
 * UpdateImageDialog - 更新映像對話框
 *
 * 功能：
 * - 開啟時自動呼叫 API 取得映像列表
 * - 顯示載入中狀態
 * - 顯示錯誤訊息
 * - 選擇映像並確認更新
 */
import { ref, computed, watch } from 'vue'
import BaseDialog from '@/components/dialog/base-dialog.vue'
import Badge from '@/components/common/badge.vue'
import Loading from '@/components/common/loading.vue'
import Alert from '@/components/common/alert.vue'
import { environmentService } from '@/services/environment.service'
import type { DockerImage } from '@/types/service'

// ========== Props 定義 ==========
interface Props {
  /** 控制 Dialog 顯示/隱藏 (v-model) */
  modelValue: boolean
  /** 客戶編號（用於 API 呼叫） */
  customerNo: string
  /** 是否正在更新中 */
  isUpdating?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isUpdating: false,
})

// ========== Emits 定義 ==========
const emit = defineEmits<{
  /** 更新 v-model */
  'update:modelValue': [value: boolean]
  /** 確認更新，回傳選中的映像 ID */
  confirm: [imageId: string]
}>()

// ========== 狀態 ==========
/** 映像列表 */
const images = ref<DockerImage[]>([])

/** 選中的映像 ID */
const selectedImageId = ref<string | null>(null)

/** 載入中狀態 */
const isLoading = ref(false)

/** 載入錯誤訊息 */
const loadError = ref<string | null>(null)

// ========== Computed ==========
/** 用 computed 來處理 v-model */
const isVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

/** 是否可以點擊確認按鈕 */
const canConfirm = computed(() => {
  return selectedImageId.value && !props.isUpdating && !isLoading.value && !loadError.value
})

// ========== Watch ==========
/**
 * 監聽 Dialog 開啟，自動載入映像列表
 */
watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue) {
      await fetchImages()
    }
  },
)

// ========== Methods ==========
/**
 * 取得映像列表
 */
async function fetchImages() {
  isLoading.value = true
  loadError.value = null
  selectedImageId.value = null
  images.value = []

  try {
    images.value = await environmentService.getAllImages(props.customerNo)
  } catch (error) {
    console.error('取得映像列表失敗:', error)
    loadError.value = error instanceof Error ? error.message : '取得映像列表失敗'
  } finally {
    isLoading.value = false
  }
}

/**
 * 選擇映像
 */
function handleSelectImage(imageId: string) {
  selectedImageId.value = imageId
}

/**
 * Dialog 關閉/開啟變化時的處理
 */
function handleDialogChange(value: boolean) {
  if (!value) {
    // 關閉時重置狀態
    resetState()
  }
}

/**
 * 關閉 Dialog
 */
function handleClose() {
  if (!props.isUpdating) {
    isVisible.value = false
  }
}

/**
 * 確認更新
 */
function handleConfirm() {
  if (selectedImageId.value && canConfirm.value) {
    emit('confirm', selectedImageId.value)
  }
}

/**
 * 重置狀態
 */
function resetState() {
  selectedImageId.value = null
  images.value = []
  loadError.value = null
  isLoading.value = false
}
</script>
