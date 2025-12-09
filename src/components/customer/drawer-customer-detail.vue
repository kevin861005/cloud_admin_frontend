<template>
  <Drawer :is-open="isOpen" @close="handleClose">
    <!-- 載入狀態 -->
    <Loading v-if="isLoading" message="載入資料中..." :show-spinner="true" />

    <!-- 錯誤狀態 -->
    <Alert v-else-if="error" type="error" title="載入失敗" :description="error" />

    <!-- 資料顯示 -->
    <div v-else-if="customerDetail" class="drawer">
      <DrawerHeader :title="customerDetail.customerName" :subtitle="customerDetail.industry">
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
            :href="customerDetail.autoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-blue-600 hover:underline"
          >
            {{ customerDetail.autoUrl }}
          </a>
        </InfoField>

        <InfoField label="前台連結" :vertical="true">
          <a
            :href="customerDetail.frontendUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-blue-600 hover:underline"
          >
            {{ customerDetail.frontendUrl }}
          </a>
        </InfoField>

        <InfoField label="後台連結" :vertical="true">
          <a
            :href="customerDetail.backendUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-blue-600 hover:underline"
          >
            {{ customerDetail.backendUrl }}
          </a>
        </InfoField>
      </InfoSection>

      <!-- 分隔線 -->
      <Divider />

      <!-- 詳細資訊區塊 -->
      <InfoSection title="詳細資訊" class="mb-2">
        <InfoField label="PinCode" :value="customerDetail.pinCode" />
        <InfoField
          label="環境域名"
          :value="customerDetail.domainName"
          :show-copy="true"
          @copy-success="handleCopySuccess"
          @copy-error="handleCopyError"
        />
        <InfoField label="建立日期" :value="customerDetail.createdAt" />
        <InfoField label="使用時間" :value="customerDetail.usageTime" />
        <InfoField label="模組">
          <Badge v-if="customerDetail.module" :text="customerDetail.module" />
        </InfoField>
        <InfoField label="負責業務" :value="customerDetail.salesPerson" />
      </InfoSection>

      <!-- 分隔線 -->
      <Divider />

      <!-- 客戶資訊區塊 -->
      <InfoSection title="客戶資訊">
        <InfoField label="聯絡人" :value="customerDetail.contactPerson" />
        <InfoField label="電話" :value="customerDetail.phone" />
        <InfoField
          label="E-mail"
          :value="customerDetail.email"
          :show-copy="true"
          @copy-success="handleCopySuccess"
          @copy-error="handleCopyError"
        />
      </InfoSection>
    </div>

    <!-- Toast 提示（固定在 Drawer 底部） -->
    <DrawerToast
      :is-visible="toast.isVisible"
      :type="toast.type"
      :message="toast.message"
      @close="handleToastClose"
    />
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Drawer from '@/components/drawer/drawer.vue'
import DrawerHeader from '@/components/drawer/drawer-header.vue'
import DrawerToast from '@/components/drawer/drawer-toast.vue'
import InfoSection from '@/components/drawer/info-section.vue'
import InfoField from '@/components/drawer/info-field.vue'
import Badge from '@/components/common/badge.vue'
import Alert from '@/components/common/alert.vue'
import Divider from '@/components/common/divider.vue'
import { customerService } from '@/services/customer.service'
import type { CustomerDrawerInfo } from '@/types/customer'

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
  customerId: string | null
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
const customerDetail = ref<CustomerDrawerInfo | null>(null)

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
  if (!customerDetail.value) return ''

  const statusMap = {
    ACTIVE: '活躍',
    INACTIVE: '低活躍',
    UNUSED: '未使用',
  }

  return statusMap[customerDetail.value.status] || customerDetail.value.status
})

/**
 * 狀態 Badge 類型
 */
const statusBadgeType = computed(() => {
  if (!customerDetail.value) return 'default'

  const typeMap = {
    ACTIVE: 'success',
    INACTIVE: 'default',
    UNUSED: 'error',
  }

  return typeMap[customerDetail.value.status] as 'success' | 'error' | 'default'
})

// ===== 方法 =====

/**
 * 載入客戶詳細資料
 */
const loadCustomerDetail = async () => {
  if (!props.customerId) return

  isLoading.value = true
  error.value = null
  customerDetail.value = null

  try {
    // TODO: 上線前切換為實際 API
    customerDetail.value = await customerService.getCustomerById(props.customerId)
  } catch (err) {
    console.error('載入客戶詳細資料錯誤:', err)
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
 * 當 Drawer 開啟且有 customerId 時，載入客戶詳細資料
 */
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.customerId) {
      // 關閉 Toast
      handleToastClose()
      // 載入資料
      loadCustomerDetail()
    }
  },
  { immediate: true },
)
</script>
