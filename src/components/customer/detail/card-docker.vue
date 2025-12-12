<template>
  <CardServiceCommon
    :icon="DockerIcon"
    title="Docker"
    :status-text="dockerInfo.statusText"
    :status="dockerInfo.status"
    :rows="rows"
    :is-expanded="isExpanded"
  >
    <template #footer>
      <div class="flex gap-2">
        <!-- 更新映像按鈕 -->
        <button
          :disabled="!dockerInfo.canUpdateImage"
          :class="[
            'inline-flex h-8 items-center gap-1 rounded border px-3 typo-xs-medium transition-colors focus:outline-none',
            dockerInfo.canUpdateImage
              ? 'cursor-pointer border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              : 'cursor-not-allowed border-neutral-100 bg-neutral-50 text-neutral-300',
          ]"
          @click="openUpdateImageDialog"
        >
          <img
            :src="DownloadIcon"
            alt="切換版本"
            :class="['h-4 w-4', !dockerInfo.canUpdateImage && 'opacity-40']"
          />
          切換版本
        </button>

        <!-- 重啟環境按鈕 -->
        <button
          :disabled="!dockerInfo.canRestart"
          :class="[
            'inline-flex h-8 items-center gap-1 rounded border px-3 typo-xs-medium transition-colors focus:outline-none',
            dockerInfo.canRestart
              ? 'cursor-pointer border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              : 'cursor-not-allowed border-neutral-100 bg-neutral-50 text-neutral-300',
          ]"
          @click="openRestartDialog"
        >
          <img
            :src="ReStartIcon"
            alt="重啟環境"
            :class="['h-4 w-4', !dockerInfo.canRestart && 'opacity-40']"
          />
          重啟環境
        </button>
      </div>
    </template>
  </CardServiceCommon>

  <!-- 更新映像 Dialog -->
  <DialogUpdateImage
    v-model="showUpdateImageDialog"
    :customer-no="customerNo"
    :current-version="dockerInfo.imageVersion"
    :is-updating="isUpdatingImage"
    @confirm="handleUpdateImageConfirm"
  />

  <!-- 重啟環境確認 Dialog -->
  <DialogRestartEnvironment
    v-model="showRestartDialog"
    :customer-name="customerName"
    :customer-no="customerNo"
    @confirm="handleRestartConfirm"
  />

  <!-- 進度條 Dialog -->
  <TaskProgressDialog
    v-model="showProgressDialog"
    :title="progressTitle"
    :description="progressDescription"
    :progress="progressValue"
  />
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CardServiceCommon from './card-service-common.vue'
import DialogRestartEnvironment from '@/components/environment/dialog-restart-environment.vue'
import DialogUpdateImage from '@/components/environment/dialog-update-image.vue'
import TaskProgressDialog from '@/components/dialog/task-progress-dialog.vue'
import { environmentService } from '@/services/environment.service'
import { taskService } from '@/services/task.service'
import type { DockerServiceInfo } from '@/types/service'
import type { TaskProgressEvent } from '@/types/task'
import DockerIcon from '@/assets/icons/card/docker.svg'
import DownloadIcon from '@/assets/icons/common/cm-download.svg'
import ReStartIcon from '@/assets/icons/common/cm-restart.svg'

/**
 * Props 定義
 */
interface Props {
  /** Docker 資訊 */
  dockerInfo: DockerServiceInfo
  /** 客戶名稱（用於 Dialog 顯示） */
  customerName: string
  /** 客戶編號（用於 API 呼叫） */
  customerNo: string
  /** 是否展開 */
  isExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isExpanded: false,
})

/**
 * Emits 定義
 */
const emit = defineEmits<{
  /** 重啟成功事件，回傳最新的 Docker 資訊 */
  restartSuccess: [dockerInfo: DockerServiceInfo]
  /** 重啟失敗事件 */
  restartError: [message: string]
  /** 更新映像成功事件，回傳最新的 Docker 資訊 */
  updateImageSuccess: [dockerInfo: DockerServiceInfo]
  /** 更新映像失敗事件 */
  updateImageError: [message: string]
}>()

// ========== Router ==========
const router = useRouter()
const route = useRoute()

// ========== 更新映像 Dialog 狀態 ==========
const showUpdateImageDialog = ref(false)
const isUpdatingImage = ref(false)

// ========== 重啟確認 Dialog 狀態 ==========
const showRestartDialog = ref(false)

// ========== 進度條 Dialog 狀態 ==========
const showProgressDialog = ref(false)
const progressTitle = ref('')
const progressDescription = ref('')
const progressValue = ref(0)

// ========== 進度更新佇列 ==========
const progressQueue: Array<{ message: string; progress: number }> = []
let isProcessingQueue = false
const PROGRESS_ANIMATION_DURATION = 350 // 動畫時間 + 一點緩衝

// ========== SSE 連線關閉函數 ==========
let closeSSE: (() => void) | null = null

// ========== 當前任務類型（用於區分回調處理） ==========
type TaskType = 'restart' | 'updateImage'
let currentTaskType: TaskType | null = null

/**
 * 資料列（全部欄位）
 */
const rows = computed(() => [
  { label: '名稱', value: props.dockerInfo.name },
  { label: '容器ID', value: props.dockerInfo.containerId },
  { label: '映像版本', value: props.dockerInfo.imageName + ':' + props.dockerInfo.imageVersion },
  { label: 'Port映射', value: props.dockerInfo.portMapping },
])

// ========== 更新映像相關 ==========

/**
 * 開啟更新映像 Dialog
 */
function openUpdateImageDialog() {
  if (props.dockerInfo.canUpdateImage) {
    showUpdateImageDialog.value = true
  }
}

/**
 * 確認更新映像
 */
async function handleUpdateImageConfirm(imageId: string) {
  console.log('選擇的映像 ID:', imageId)

  // 1. 設定更新中狀態
  isUpdatingImage.value = true

  // 2. 關閉選擇 Dialog
  showUpdateImageDialog.value = false

  // 重置進度佇列
  resetProgressQueue()

  // 3. 開啟進度條 Dialog
  currentTaskType = 'updateImage'
  progressTitle.value = '更新映像中...'
  progressDescription.value = '正在準備...'
  progressValue.value = 0
  showProgressDialog.value = true

  try {
    // 4. 呼叫 API 取得 taskId
    const { taskId } = await environmentService.updateImageWithProgress(props.customerNo, imageId)

    // 5. 建立 SSE 連線
    closeSSE = taskService.subscribeProgress<DockerServiceInfo>(taskId, {
      onProgress: handleProgress,
      onCompleted: handleCompleted,
      onError: handleError,
      onConnectionError: handleConnectionError,
    })
  } catch (error) {
    console.error('啟動更新映像任務失敗:', error)
    showProgressDialog.value = false
    isUpdatingImage.value = false

    const errorMessage = error instanceof Error ? error.message : '啟動更新映像任務失敗'
    navigateWithMessage('warning', errorMessage)
  }
}

// ========== 重啟環境相關 ==========

/**
 * 開啟重啟確認 Dialog
 */
function openRestartDialog() {
  if (props.dockerInfo.canRestart) {
    showRestartDialog.value = true
  }
}

/**
 * 重啟確認後的處理
 */
async function handleRestartConfirm() {
  // 1. 關閉確認 Dialog
  showRestartDialog.value = false

  // 重置進度佇列
  resetProgressQueue()

  // 2. 開啟進度條 Dialog
  currentTaskType = 'restart'
  progressTitle.value = '重啟環境中...'
  progressDescription.value = '正在準備...'
  progressValue.value = 0
  showProgressDialog.value = true

  try {
    // 3. 呼叫 API 取得 taskId
    const { taskId } = await environmentService.restartEnvironmentWithProgress(props.customerNo)

    // 4. 建立 SSE 連線
    closeSSE = taskService.subscribeProgress<DockerServiceInfo>(taskId, {
      onProgress: handleProgress,
      onCompleted: handleCompleted,
      onError: handleError,
      onConnectionError: handleConnectionError,
    })
  } catch (error) {
    console.error('啟動重啟任務失敗:', error)
    showProgressDialog.value = false

    const errorMessage = error instanceof Error ? error.message : '啟動重啟任務失敗'
    navigateWithMessage('warning', errorMessage)
  }
}

// ========== SSE 回調處理（共用） ==========

/**
 * 處理進度更新（加入佇列）
 */
function handleProgress(event: TaskProgressEvent<DockerServiceInfo>) {
  // 將進度加入佇列
  progressQueue.push({
    message: event.message,
    progress: event.progress,
  })

  // 開始處理佇列
  processProgressQueue()
}

/**
 * 依序處理進度佇列
 */
function processProgressQueue() {
  // 如果正在處理中或佇列為空，則返回
  if (isProcessingQueue || progressQueue.length === 0) {
    return
  }

  isProcessingQueue = true

  // 取出下一個進度
  const next = progressQueue.shift()!
  progressDescription.value = next.message
  progressValue.value = next.progress

  // 等待動畫完成後處理下一個
  setTimeout(() => {
    isProcessingQueue = false
    processProgressQueue()
  }, PROGRESS_ANIMATION_DURATION)
}

/**
 * 重置進度佇列（在任務開始或結束時呼叫）
 */
function resetProgressQueue() {
  progressQueue.length = 0
  isProcessingQueue = false
  progressValue.value = 0
  progressDescription.value = ''
}

/**
 * 處理任務完成
 */
function handleCompleted(event: TaskProgressEvent<DockerServiceInfo>) {
  // 更新進度到 100%
  progressDescription.value = event.message
  progressValue.value = 100

  // 關閉進度條
  showProgressDialog.value = false

  // 根據任務類型處理
  if (currentTaskType === 'updateImage') {
    isUpdatingImage.value = false

    if (event.data) {
      emit('updateImageSuccess', event.data)
    }
    navigateWithMessage('success', '更新映像成功')
  } else if (currentTaskType === 'restart') {
    if (event.data) {
      emit('restartSuccess', event.data)
    }
    navigateWithMessage('success', '重啟成功')
  }

  // 重置任務類型
  currentTaskType = null
}

/**
 * 處理任務錯誤
 */
function handleError(event: TaskProgressEvent<DockerServiceInfo>) {
  // 關閉進度條
  showProgressDialog.value = false

  const errorMessage = event.message || '操作失敗，請再試一次'

  // 根據任務類型處理
  if (currentTaskType === 'updateImage') {
    isUpdatingImage.value = false
    emit('updateImageError', errorMessage)
    navigateWithMessage('warning', errorMessage)
  } else if (currentTaskType === 'restart') {
    emit('restartError', errorMessage)
    navigateWithMessage('warning', errorMessage)
  }

  // 重置任務類型
  currentTaskType = null
}

/**
 * 處理 SSE 連線錯誤
 */
function handleConnectionError() {
  // 關閉進度條
  showProgressDialog.value = false

  const errorMessage = '連線中斷，請重新嘗試'

  // 根據任務類型處理
  if (currentTaskType === 'updateImage') {
    isUpdatingImage.value = false
    emit('updateImageError', errorMessage)
  } else if (currentTaskType === 'restart') {
    emit('restartError', errorMessage)
  }

  navigateWithMessage('warning', errorMessage)

  // 重置任務類型
  currentTaskType = null
}

/**
 * 導向並帶上訊息參數
 */
function navigateWithMessage(type: 'success' | 'warning', message: string) {
  router.replace({
    path: route.path,
    query: {
      [type]: message,
      t: Date.now(),
    },
  })
}

/**
 * 元件卸載時關閉 SSE 連線
 */
onUnmounted(() => {
  if (closeSSE) {
    closeSSE()
    closeSSE = null
  }
})
</script>
