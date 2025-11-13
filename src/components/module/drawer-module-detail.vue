<template>
  <Drawer :is-open="isOpen" @close="handleClose">
    <!-- 載入狀態 -->
    <div v-if="isLoading" class="flex items-center justify-center p-12">
      <div class="text-center">
        <div
          class="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"
        ></div>
        <p class="text-sm text-gray-500">載入中...</p>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="px-5 py-6">
      <Alert type="error" title="載入失敗" :description="error" />
    </div>

    <!-- 資料顯示或編輯 -->
    <div v-else-if="moduleData" class="flex flex-col gap-3 px-5">
      <!-- 標題區 -->
      <DrawerHeader :title="moduleData.code" />

      <!-- 分隔線 -->
      <Divider />

      <!-- 顯示模式 -->
      <template v-if="!isEditMode">
        <InfoSection>
          <!-- 編輯按鈕 -->
          <template #action>
            <img
              src="@/assets/icons/common/cm-edit.svg"
              alt="編輯"
              class="w-4 h-4 cursor-pointer"
              @click="handleEdit"
            />
          </template>

          <InfoField label="中文名稱" :value="moduleData.name" />

          <InfoField label="狀態">
            <Badge :text="statusText" :type="statusType" />
          </InfoField>
        </InfoSection>
      </template>

      <!-- 編輯模式 -->
      <template v-else>
        <div class="flex flex-col gap-3 overflow-x-hidden">
          <FormSection>
            <FormInput
              ref="nameInputRef"
              v-model="formData.name"
              label="中文名稱"
              placeholder="請輸入"
              :error-message="errors.name"
            />

            <!-- 狀態 -->
            <FormRadioGroup
              v-model="formData.status"
              label="狀態"
              :options="statusOptions"
              :error-message="errors.status"
            />
          </FormSection>

          <!-- 按鈕群組 -->
          <FormButtonGroup
            confirm-text="儲存"
            :disabled="isSubmitting"
            @cancel="handleCancelEdit"
            @confirm="handleConfirmEdit"
          />
        </div>
      </template>

      <!-- 分隔線 -->
      <Divider />

      <!-- 異動資訊區塊（始終顯示） -->
      <InfoSection title="異動資訊">
        <InfoField label="建立者" :value="createdByText" />
        <InfoField label="建立日" :value="createdAtText" />
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
import FormSection from '@/components/form/form-section.vue'
import FormInput from '@/components/form/form-input.vue'
import FormRadioGroup from '@/components/form/form-radio-group.vue'
import FormButtonGroup from '@/components/form/form-button-group.vue'
import { formatDateDot } from '@/utils/time'
import type { ModuleListItem } from '@/types/module'

/**
 * 使用者詳細資訊 Drawer
 * 支援查看與編輯模式
 */

interface Props {
  /**
   * 控制 Drawer 開關狀態
   */
  isOpen: boolean

  /**
   * 列表資料
   */
  moduleData: ModuleListItem | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  /**
   * 關閉 Drawer
   */
  close: []

  /**
   * 編輯按鈕點擊
   */
  edit: []

  /**
   * 資料更新成功（用於通知父元件重新載入表格）
   */
  updated: []
}>()

// ===== 狀態管理 =====

/**
 * 載入狀態
 */
const isLoading = ref(false)

/**
 * 錯誤訊息
 */
const error = ref<string | null>(null)

/**
 * 是否為編輯模式
 */
const isEditMode = ref(false)

/**
 * 提交中狀態
 */
const isSubmitting = ref(false)

// ===== Toast 狀態 =====

/**
 * Toast 顯示狀態
 */
const toast = ref({
  isVisible: false,
  type: 'success' as 'success' | 'error',
  message: '',
})

// ===== 表單資料 =====

/**
 * 表單資料
 */
const formData = ref({
  name: '',
  status: '',
})

/**
 * 表單錯誤訊息
 */
const errors = ref({
  name: '',
  status: '',
})

// ===== Template Refs =====
const nameInputRef = ref<{ focus: () => void } | null>(null)

// ===== 選項資料 =====

/**
 * 使用狀態選項
 */
const statusOptions = [
  { label: '停用', value: 'INACTIVE' },
  { label: '啟用', value: 'ACTIVE' },
]

// ===== 計算屬性 =====

/**
 * 狀態顯示文字
 */
const statusText = computed(() => {
  if (!props.moduleData) return ''
  return props.moduleData.status === 'ACTIVE' ? '啟用' : '停用'
})

/**
 * 狀態 Badge 類型
 */
const statusType = computed(() => {
  if (!props.moduleData) return 'default'
  return props.moduleData.status === 'ACTIVE' ? 'success' : 'default'
})

/**
 * 建立者顯示文字
 */
const createdByText = computed(() => {
  if (!props.moduleData || !props.moduleData.createdBy) return '-'
  return props.moduleData.createdBy.name
})

/**
 * 建立日顯示文字
 */
const createdAtText = computed(() => {
  if (!props.moduleData) return '-'
  return formatDateDot(props.moduleData.createdAt)
})

// ===== 方法 =====

/**
 * 初始化表單資料
 */
const initFormData = () => {
  if (!props.moduleData) return

  formData.value = {
    name: props.moduleData.name,
    status: props.moduleData.status,
  }

  // 清空錯誤訊息
  errors.value = {
    name: '',
    status: '',
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
  // 如果在編輯模式，先退出編輯模式
  if (isEditMode.value) {
    isEditMode.value = false
  }
  // 關閉 Toast
  handleToastClose()
  emit('close')
}

/**
 * 處理編輯按鈕點擊
 */
const handleEdit = async () => {
  // 初始化表單資料
  initFormData()

  // 切換到編輯模式
  isEditMode.value = true

  emit('edit')
}

/**
 * 處理取消編輯
 */
const handleCancelEdit = () => {
  // 退出編輯模式
  isEditMode.value = false
}

/**
 * 處理確認編輯
 */
const handleConfirmEdit = async () => {}
// ===== 監聽 =====

/**
 * 監聽 Drawer 開啟狀態
 * 當 Drawer 開啟且有 loginId 時，載入使用者詳細資料
 */
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.moduleData) {
      // 重置編輯模式
      isEditMode.value = false
      // 關閉 Toast
      handleToastClose()
    }
  },
  { immediate: true },
)
</script>
