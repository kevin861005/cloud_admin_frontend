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
          @click="handleUpdateImage"
        >
          <img
            :src="DownloadIcon"
            alt="更新映像"
            :class="['h-4 w-4', !dockerInfo.canUpdateImage && 'opacity-40']"
          />
          更新映像
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
import DialogRestartEnvironment from '@/components/dialog/dialog-restart-environment.vue'
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
  /** 更新映像事件 */
  updateImage: []
  /** 重啟成功事件，回傳最新的 Docker 資訊 */
  restartSuccess: [dockerInfo: DockerServiceInfo]
  /** 重啟失敗事件 */
  restartError: [message: string]
}>()

// ========== Router ==========
const router = useRouter()
const route = useRoute()

// ========== 重啟確認 Dialog 狀態 ==========
const showRestartDialog = ref(false)

// ========== 進度條 Dialog 狀態 ==========
const showProgressDialog = ref(false)
const progressTitle = ref('')
const progressDescription = ref('')
const progressValue = ref(0)

// ========== SSE 連線關閉函數 ==========
let closeSSE: (() => void) | null = null

/**
 * 資料列（全部欄位）
 */
const rows = computed(() => [
  { label: '名稱', value: props.dockerInfo.name },
  { label: '容器ID', value: props.dockerInfo.containerId },
  { label: '映像版本', value: props.dockerInfo.imageVersion },
  { label: 'Port映射', value: props.dockerInfo.portMapping },
])

/**
 * 處理更新映像
 */
function handleUpdateImage() {
  if (props.dockerInfo.canUpdateImage) {
    emit('updateImage')
  }
}

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

  // 2. 開啟進度條 Dialog
  progressTitle.value = '重啟環境中...'
  progressDescription.value = '正在準備...'
  progressValue.value = 0
  showProgressDialog.value = true

  try {
    // 3. 呼叫 API 取得 taskId
    const response = await environmentService.restartEnvironmentWithProgress(props.customerNo)

    if (!response.success || !response.data?.taskId) {
      throw new Error(response.message || '無法啟動重啟任務')
    }

    const { taskId } = response.data

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
    navigateWithMessage('warning', error instanceof Error ? error.message : '啟動重啟任務失敗')
  }
}

/**
 * 處理進度更新
 */
function handleProgress(event: TaskProgressEvent<DockerServiceInfo>) {
  progressDescription.value = event.message
  progressValue.value = event.progress
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

  // 更新畫面資料
  if (event.data) {
    emit('restartSuccess', event.data)
  }

  // 導向成功訊息
  navigateWithMessage('success', '重啟成功')
}

/**
 * 處理任務錯誤
 */
function handleError(event: TaskProgressEvent<DockerServiceInfo>) {
  // 關閉進度條
  showProgressDialog.value = false

  // emit 錯誤事件
  emit('restartError', event.message)

  // 導向警告訊息
  navigateWithMessage('warning', event.message || '重啟失敗，請再試一次')
}

/**
 * 處理 SSE 連線錯誤
 */
function handleConnectionError() {
  // 關閉進度條
  showProgressDialog.value = false

  // emit 錯誤事件
  emit('restartError', '連線中斷，請重新嘗試')

  // 導向警告訊息
  navigateWithMessage('warning', '連線中斷，請重新嘗試')
}

/**
 * 導向並帶上訊息參數
 */
function navigateWithMessage(type: 'success' | 'warning', message: string) {
  router.replace({
    path: route.path,
    query: { [type]: message },
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
