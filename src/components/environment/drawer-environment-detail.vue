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

      <!-- 環境網址區塊 -->
      <InfoSection title="環境網址" class="mb-2">
        <InfoField label="快速自動輸入" :vertical="true">
          <a
            :href="environmentDetail.autoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-blue-600 hover:underline"
          >
            {{ environmentDetail.autoUrl }}
          </a>
        </InfoField>

        <InfoField label="前台連結" :vertical="true">
          <a
            :href="environmentDetail.frontendUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-blue-600 hover:underline"
          >
            {{ environmentDetail.frontendUrl }}
          </a>
        </InfoField>

        <InfoField label="後台連結" :vertical="true">
          <a
            :href="environmentDetail.backendUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-blue-600 hover:underline"
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
      :button-text="buttonText"
      button-type="error"
      :loading="isDeleting"
      @click="handleDeleteEnvironment"
    />
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
import { environmentService } from '@/services/environment.service'
import type { EnvironmentDetailInfo } from '@/types/environment'

const buttonText = ref('刪除環境')

const isDeleting = ref(false)

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
const handleCopyError = (error: string) => {
  showToast('error', error)
}

/**
 * 客戶詳細資訊 Drawer
 * 僅支援查看模式（無編輯功能）
 */

interface Props {
  /**
   * 控制 Drawer 開關狀態
   */
  isOpen: boolean

  /**
   * 客戶 ID（用於呼叫 API）
   */
  environmentId: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  /**
   * 關閉 Drawer
   */
  close: []
}>()

// ===== 狀態管理 =====

/**
 * 客戶詳細資料
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

// ===== 計算屬性 =====

/**
 * 狀態顯示文字
 */
const statusText = computed(() => {
  if (!environmentDetail.value) return ''

  const statusMap = {
    NOTIFIED: '已通知',
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

  const typeMap = {
    NOTIFIED: 'success',
    TO_BE_DELETED: 'error',
    PENDING: 'default',
  }

  return typeMap[environmentDetail.value.status] as 'success' | 'error' | 'default'
})

// ===== 方法 =====

/**
 * 載入客戶詳細資料
 */
const loadEnvironmentDetail = async () => {
  if (!props.environmentId) return

  isLoading.value = true
  error.value = null
  environmentDetail.value = null

  try {
    // TODO: 上線前切換為實際 API
    // const response = await environmentService.getMockEnvironmentDetail(props.environmentId)
    const response = await environmentService.getMockEnvironmentDetail(props.environmentId)
    environmentDetail.value = response
  } catch (err) {
    console.error('載入環境詳細資料錯誤:', err)
    error.value = err instanceof Error ? err.message : '發生未知錯誤，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

/**
 * 關閉 Toast
 */
const handleToastClose = () => {
  toast.value.isVisible = false
}

/**
 * 處理關閉 Drawer
 */
const handleClose = () => {
  // 關閉 Toast
  handleToastClose()
  emit('close')
}

// ===== 監聽 =====

/**
 * 監聽 Drawer 開啟狀態
 * 當 Drawer 開啟且有 environmentId 時，載入客戶詳細資料
 */
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.environmentId) {
      // 關閉 Toast
      handleToastClose()
      // 載入資料
      loadEnvironmentDetail()
    }
  },
  { immediate: true },
)

/**
 * 處理刪除環境（測試版本）
 * 模擬 API 呼叫：loading 5 秒後顯示成功
 */
const handleDeleteEnvironment = async () => {
  try {
    isDeleting.value = true

    // 模擬 API 呼叫：等待 5 秒
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // 顯示成功 Toast
    showToast('success', '刪除成功')

    // Toast 顯示 3 秒後關閉 Drawer
    setTimeout(() => {
      emit('close')
    }, 3000)
  } catch (error) {
    // 顯示失敗 Toast
    showToast('error', error as unknown as string)
  } finally {
    isDeleting.value = false
  }
}
</script>
