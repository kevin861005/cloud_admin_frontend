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
    @success="handleRestartSuccess"
    @error="handleRestartError"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CardServiceCommon from './card-service-common.vue'
import DialogRestartEnvironment from '@/components/dialog/dialog-restart-environment.vue'
import type { DockerServiceInfo } from '@/types/service'
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

/**
 * 是否顯示重啟確認 Dialog
 */
const showRestartDialog = ref(false)

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
 * 重啟成功處理
 */
function handleRestartSuccess(dockerInfo: DockerServiceInfo) {
  emit('restartSuccess', dockerInfo)
}

/**
 * 重啟失敗處理
 */
function handleRestartError(message: string) {
  emit('restartError', message)
}
</script>
