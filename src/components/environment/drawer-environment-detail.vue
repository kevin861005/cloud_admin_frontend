<template>
  <Drawer :is-open="isOpen" @close="handleClose">
    <!-- 載入狀態 -->
    <Loading v-if="isLoading" message="載入資料中..." :show-spinner="true" />

    <!-- 錯誤狀態 -->
    <Alert v-else-if="error" type="error" title="載入失敗" :description="error" />

    <!-- 資料顯示 -->
    <div v-else-if="environmentDetail" class="drawer">
      <DrawerHeader :title="environmentDetail.customerName" :subtitle="environmentDetail.industry">
        <template #badge>
          <Badge :text="statusText" :type="statusBadgeType" />
        </template>
      </DrawerHeader>

      <!-- 分隔線 -->
      <Divider />

      <!-- 申請資訊區塊 -->
      <InfoSection title="申請資訊" class="mb-2">
        <InfoField label="申請日" :value="environmentDetail.appliedDate" />
        <InfoField label="通知日" :value="environmentDetail.appliedDate" />
        <InfoField label="預定刪除日" :value="environmentDetail.scheduledDeleteDate" />
      </InfoSection>

      <!-- 分隔線 -->
      <Divider />

      <!-- 環境網址區塊 -->
      <InfoSection title="環境網址" class="mb-2">
        <InfoField label="快速自動輸入" :vertical="true">
          <a
            :href="environmentDetail.autoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-primary-500 hover:underline"
          >
            {{ environmentDetail.autoUrl }}
          </a>
        </InfoField>

        <InfoField label="前台連結" :vertical="true">
          <a
            :href="environmentDetail.frontendUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-primary-500 hover:underline"
          >
            {{ environmentDetail.frontendUrl }}
          </a>
        </InfoField>

        <InfoField label="後台連結" :vertical="true">
          <a
            :href="environmentDetail.backendUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-primary-500 hover:underline"
          >
            {{ environmentDetail.backendUrl }}
          </a>
        </InfoField>
      </InfoSection>

      <!-- 分隔線 -->
      <Divider />

      <!-- 詳細資訊區塊 -->
      <InfoSection title="詳細資訊" class="mb-2">
        <InfoField label="PinCode" :value="environmentDetail.pinCode" />
        <InfoField
          label="環境域名"
          :value="environmentDetail.domainName"
          :show-copy="true"
          @copy-success="handleCopySuccess"
          @copy-error="handleCopyError"
        />
        <InfoField label="建立日期" :value="environmentDetail.createdAt" />
        <InfoField label="使用時間" :value="environmentDetail.usageTime" />
        <InfoField label="模組">
          <Badge :text="environmentDetail.module" />
        </InfoField>
        <InfoField label="負責業務" :value="environmentDetail.salesPerson" />
      </InfoSection>

      <!-- 分隔線 -->
      <Divider />

      <!-- 客戶資訊區塊 -->
      <InfoSection title="客戶資訊">
        <InfoField label="聯絡人" :value="environmentDetail.contactPerson" />
        <InfoField label="電話" :value="environmentDetail.phone" />
        <InfoField
          label="E-mail"
          :value="environmentDetail.email"
          :show-copy="true"
          @copy-success="handleCopySuccess"
          @copy-error="handleCopyError"
        />
      </InfoSection>
    </div>

    <!-- Toast 提示（浮動在按鈕上方） -->
    <DrawerToast
      :is-visible="toast.isVisible"
      :type="toast.type"
      :message="toast.message"
      :has-button="!!buttonText"
      @close="handleToastClose"
    />

    <!-- Button（固定在底部） -->
    <DrawerButton
      v-if="showDeleteButton"
      :button-text="buttonText"
      button-type="error"
      :loading="isDeleting"
      @click="handleOpenDeleteDialog"
    />
  </Drawer>

  <!-- 刪除確認 Dialog -->
  <BaseDialog v-model="showDeleteDialog" title="刪除環境" subtitle="請確認是否要刪除此環境">
    <!-- 說明文字 -->
    <p class="typo-sm-bold text-semantic-warning">此操作無法復原</p>

    <!-- 按鈕區域 -->
    <template #footer>
      <!-- 取消按鈕 -->
      <button
        type="button"
        class="group relative rounded-lg bg-gray-100 px-6 py-3 typo-sm-bold text-neutral-600 transition-colors cursor-pointer"
        @click="handleCloseDeleteDialog"
      >
        <span
          class="absolute inset-0 rounded-lg bg-black opacity-0 transition-opacity group-hover:opacity-10"
        />
        <span class="relative">取消</span>
      </button>

      <!-- 確認刪除按鈕 -->
      <button
        type="button"
        class="group relative flex items-center gap-2 rounded-lg bg-semantic-warning px-6 py-3 typo-sm-bold text-white transition-colors cursor-pointer"
        @click="handleConfirmDelete"
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
import { ref, computed, watch, onUnmounted } from 'vue'
import Drawer from '@/components/drawer/drawer.vue'
import DrawerHeader from '@/components/drawer/drawer-header.vue'
import DrawerToast from '@/components/drawer/drawer-toast.vue'
import DrawerButton from '@/components/drawer/drawer-button.vue'
import InfoSection from '@/components/drawer/info-section.vue'
import InfoField from '@/components/drawer/info-field.vue'
import Badge from '@/components/common/badge.vue'
import Loading from '@/components/common/loading.vue'
import Alert from '@/components/common/alert.vue'
import Divider from '@/components/common/divider.vue'
import BaseDialog from '@/components/dialog/base-dialog.vue'
import TaskProgressDialog from '@/components/dialog/task-progress-dialog.vue'
import { environmentService } from '@/services/environment.service'
import { taskService } from '@/services/task.service'
import { ApiError } from '@/types/common'
import type { EnvironmentDetailInfo } from '@/types/environment'
import type { TaskProgressEvent } from '@/types/task'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

/**
 * 環境詳細資訊 Drawer
 * 支援查看環境資訊和刪除環境功能
 */

interface Props {
  /**
   * 控制 Drawer 開關狀態
   */
  isOpen: boolean

  /**
   * 環境 ID（用於呼叫 API）
   */
  environmentId: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  /**
   * 關閉 Drawer
   */
  close: []
  /**
   * 刪除成功（通知父元件刷新列表）
   */
  'delete-success': []
}>()

// ===== 按鈕狀態 =====
const buttonText = ref('刪除環境')
const isDeleting = ref(false)

// ===== 狀態管理 =====

/**
 * 環境詳細資料
 */
const environmentDetail = ref<EnvironmentDetailInfo | null>(null)

/**
 * 載入狀態
 */
const isLoading = ref(false)

/**
 * 錯誤訊息
 */
const error = ref<string | null>(null)

// ===== Toast 狀態 =====

/**
 * Toast 顯示狀態
 */
const toast = ref({
  isVisible: false,
  type: 'success' as 'success' | 'error',
  message: '',
})

/**
 * 是否顯示刪除按鈕
 * 條件：管理員 且 狀態為待刪除（TO_BE_DELETED）
 */
const showDeleteButton = computed(() => {
  return authStore.isAdmin && environmentDetail.value?.status === 'TO_BE_DELETED'
})

// ===== 刪除確認 Dialog 狀態 =====
const showDeleteDialog = ref(false)

// ===== 進度條 Dialog 狀態 =====
const showProgressDialog = ref(false)
const progressTitle = ref('')
const progressDescription = ref('')
const progressValue = ref(0)

// ===== 進度更新佇列 =====
const progressQueue: Array<{ message: string; progress: number }> = []
let isProcessingQueue = false
const PROGRESS_ANIMATION_DURATION = 350

// ===== SSE 連線關閉函數 =====
let closeSSE: (() => void) | null = null

// ===== 計算屬性 =====

/**
 * 狀態顯示文字
 */
const statusText = computed(() => {
  if (!environmentDetail.value) return ''

  const statusMap: Record<string, string> = {
    TO_BE_DELETED: '待刪除',
    PENDING: '申請中',
  }

  return statusMap[environmentDetail.value.status] || environmentDetail.value.status
})

/**
 * 狀態 Badge 類型
 */
const statusBadgeType = computed(() => {
  if (!environmentDetail.value) return 'default'

  const typeMap: Record<string, 'success' | 'error' | 'default'> = {
    TO_BE_DELETED: 'error',
    PENDING: 'default',
  }

  return typeMap[environmentDetail.value.status] || 'default'
})

// ===== Toast 方法 =====

/**
 * 顯示 Toast 提示
 */
const showToast = (type: 'success' | 'error', message: string) => {
  toast.value = {
    isVisible: true,
    type,
    message,
  }
}

/**
 * 處理複製成功
 */
const handleCopySuccess = () => {
  showToast('success', '已複製到剪貼簿')
}

/**
 * 處理複製失敗
 */
const handleCopyError = (errorMsg: string) => {
  showToast('error', errorMsg)
}

/**
 * 關閉 Toast
 */
const handleToastClose = () => {
  toast.value.isVisible = false
}

// ===== 載入資料 =====

/**
 * 載入環境詳細資料
 */
const loadEnvironmentDetail = async () => {
  if (!props.environmentId) return

  isLoading.value = true
  error.value = null
  environmentDetail.value = null

  try {
    const response = await environmentService.getEnvironmentDetailById(props.environmentId)
    environmentDetail.value = response
  } catch (err) {
    console.error('載入環境詳細資料錯誤:', err)
    error.value = err instanceof Error ? err.message : '發生未知錯誤，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

// ===== Drawer 關閉 =====

/**
 * 處理關閉 Drawer
 */
const handleClose = () => {
  handleToastClose()
  emit('close')
}

// ===== 刪除環境功能 =====

/**
 * 開啟刪除確認 Dialog
 */
const handleOpenDeleteDialog = () => {
  showDeleteDialog.value = true
}

/**
 * 關閉刪除確認 Dialog
 */
const handleCloseDeleteDialog = () => {
  showDeleteDialog.value = false
}

/**
 * 確認刪除
 */
const handleConfirmDelete = async () => {
  if (!props.environmentId) {
    console.error('缺少環境 ID')
    return
  }

  // 1. 關閉確認 Dialog
  showDeleteDialog.value = false

  // 2. 重置進度佇列
  resetProgressQueue()

  // 3. 開啟進度條 Dialog
  progressTitle.value = '刪除環境中...'
  progressDescription.value = '正在準備...'
  progressValue.value = 0
  showProgressDialog.value = true

  // 4. 設定按鈕載入狀態
  isDeleting.value = true

  try {
    // 5. 呼叫 API 取得 taskId
    const { taskId } = await environmentService.deleteEnvironmentWithProgress(props.environmentId)

    // 6. 建立 SSE 連線
    closeSSE = taskService.subscribeProgress(taskId, {
      onProgress: handleProgress,
      onCompleted: handleCompleted,
      onError: handleError,
      onConnectionError: handleConnectionError,
    })
  } catch (err) {
    console.error('啟動刪除環境任務失敗:', err)
    showProgressDialog.value = false
    isDeleting.value = false

    // 顯示錯誤 Toast
    const errorMessage = getErrorMessage(err)
    showToast('error', errorMessage)
  }
}

/**
 * 從錯誤物件中取得錯誤訊息
 */
function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    return err.message
  }

  if (err instanceof Error) {
    const axiosError = err as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message
    }
    return err.message
  }

  return '刪除環境失敗，請稍後再試'
}

// ===== 進度處理 =====

/**
 * 處理進度更新（加入佇列）
 */
function handleProgress(event: TaskProgressEvent) {
  progressQueue.push({
    message: event.message,
    progress: event.progress,
  })
  processProgressQueue()
}

/**
 * 依序處理進度佇列
 */
function processProgressQueue() {
  if (isProcessingQueue || progressQueue.length === 0) {
    return
  }

  isProcessingQueue = true

  const next = progressQueue.shift()!
  progressDescription.value = next.message
  progressValue.value = next.progress

  setTimeout(() => {
    isProcessingQueue = false
    processProgressQueue()
  }, PROGRESS_ANIMATION_DURATION)
}

/**
 * 重置進度佇列
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
function handleCompleted(event: TaskProgressEvent) {
  progressDescription.value = event.message
  progressValue.value = 100

  setTimeout(() => {
    showProgressDialog.value = false
    isDeleting.value = false

    // 關閉 Drawer 並通知父元件刷新列表
    emit('delete-success')
    emit('close')
  }, 500)
}

/**
 * 處理任務錯誤
 */
function handleError(event: TaskProgressEvent) {
  showProgressDialog.value = false
  isDeleting.value = false

  const errorMessage = event.message || '刪除環境失敗，請再試一次'
  showToast('error', errorMessage)
}

/**
 * 處理 SSE 連線錯誤
 */
function handleConnectionError() {
  showProgressDialog.value = false
  isDeleting.value = false

  showToast('error', '連線中斷，請重新嘗試')
}

// ===== 監聽 =====

/**
 * 監聽 Drawer 開啟狀態
 */
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.environmentId) {
      handleToastClose()
      loadEnvironmentDetail()
    }
  },
  { immediate: true },
)

// ===== 生命週期 =====

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
