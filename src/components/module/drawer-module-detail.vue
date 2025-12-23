<template>
  <Drawer :is-open="isOpen" @close="handleClose">
    <!-- 載入狀態 -->
    <Loading v-if="isLoading" message="載入資料中..." :show-spinner="true" />

    <!-- 錯誤狀態 -->
    <Alert v-else-if="error" type="error" title="載入失敗" :description="error" />

    <!-- 資料顯示或編輯 -->
    <template v-else-if="moduleDetail">
      <!-- 標題區 -->
      <DrawerHeader :title="moduleDetail.code" />

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
              class="h-4 w-4 cursor-pointer"
              @click="handleEdit"
            />
          </template>

          <InfoField label="中文名稱" :value="moduleDetail.name" />

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
            <FormRadioGroup v-model="formData.isActive" label="狀態" :options="statusOptions" />
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
        <InfoField label="建立日" :value="moduleDetail.createdDate" />
      </InfoSection>
    </template>

    <!-- Toast 提示（固定在 Drawer 底部） -->
    <DrawerToast
      :is-visible="toast.isVisible"
      :type="toast.type"
      :message="toast.message"
      @close="hideToast"
    />
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Drawer, DrawerHeader, DrawerToast, InfoSection, InfoField } from '@/components/drawer'
import { Badge, Alert, Divider, Loading } from '@/components/common'
import { FormSection, FormInput, FormRadioGroup, FormButtonGroup } from '@/components/form'
import type { ModuleDetailInfo, UpdateModuleRequest } from '@/types/module'
import type { FieldError } from '@/types/common'
import { moduleService } from '@/services/module.service'
import { ApiError } from '@/types/common'
import { useDrawerToast } from '@/composables/useDrawerToast'
import { processFieldErrors } from '@/utils/form'

/**
 * 模組詳細資訊 Drawer
 * 支援查看與編輯模式
 */

interface Props {
  /**
   * 控制 Drawer 開關狀態
   */
  isOpen: boolean

  /**
   * 模組代號
   */
  code: string | null
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
 * 模組詳細資料
 */
const moduleDetail = ref<ModuleDetailInfo | null>(null)

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
const { toast, showToast, hideToast, resetToast } = useDrawerToast()

// ===== 表單資料 =====

/**
 * 表單資料
 */
const formData = ref({
  name: '',
  isActive: 'true' as string,
})

/**
 * 表單錯誤訊息
 */
const errors = ref({
  name: '',
})

// ===== Template Refs =====
const nameInputRef = ref<{ focus: () => void } | null>(null)

// ===== 選項資料 =====

/**
 * 使用狀態選項
 */
const statusOptions = [
  { label: '停用', value: 'false' },
  { label: '啟用', value: 'true' },
]

// ===== 計算屬性 =====

/**
 * 狀態顯示文字
 */
const statusText = computed(() => {
  if (!moduleDetail.value) return '-'
  return moduleDetail.value.isActive ? '啟用' : '停用'
})

/**
 * 狀態 Badge 類型
 */
const statusType = computed((): 'success' | 'error' => {
  if (!moduleDetail.value) return 'error'
  return moduleDetail.value.isActive ? 'success' : 'error'
})

/**
 * 建立者顯示文字
 */
const createdByText = computed(() => {
  if (!moduleDetail.value || !moduleDetail.value.createdBy) return '-'
  return moduleDetail.value.createdBy.name
})

// ===== 方法 =====

/**
 * 載入模組詳細資料
 */
const loadModuleDetail = async () => {
  if (!props.code) return

  isLoading.value = true
  error.value = null
  moduleDetail.value = null

  try {
    moduleDetail.value = await moduleService.getModuleDetail(props.code)
  } catch (err) {
    console.error('載入模組詳細資料錯誤:', err)
    error.value = err instanceof Error ? err.message : '發生未知錯誤，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

/**
 * 初始化表單資料
 */
const initFormData = () => {
  if (!moduleDetail.value) return

  formData.value = {
    name: moduleDetail.value.name,
    isActive: moduleDetail.value.isActive ? 'true' : 'false',
  }

  // 清空錯誤訊息
  errors.value = {
    name: '',
  }
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
  resetToast()
  emit('close')
}

/**
 * 處理編輯按鈕點擊
 */
const handleEdit = () => {
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
 * 處理後端回傳的欄位錯誤
 * 將後端的欄位名稱對應到前端的錯誤訊息
 *
 * @param fieldErrors - 後端回傳的欄位錯誤列表
 */
const handleFieldErrors = (fieldErrors: FieldError[]) => {
  processFieldErrors(fieldErrors, {
    errors,
    fieldMap: {
      name: 'name',
    },
    fieldRefMap: {
      name: nameInputRef,
    },
    fieldOrder: ['name'],
  })
}

/**
 * 檢查是否為欄位錯誤陣列
 */
const isFieldErrorArray = (data: unknown): data is FieldError[] => {
  if (!Array.isArray(data)) return false
  if (data.length === 0) return true
  return (
    typeof data[0] === 'object' && data[0] !== null && 'field' in data[0] && 'message' in data[0]
  )
}

/**
 * 處理確認編輯
 */
const handleConfirmEdit = async () => {
  if (!props.code) return

  // 清空所有錯誤訊息
  errors.value = {
    name: '',
  }

  // 開始提交
  isSubmitting.value = true

  try {
    // 準備提交的資料
    const requestData: UpdateModuleRequest = {
      name: formData.value.name,
      isActive: formData.value.isActive === 'true',
    }

    // 呼叫更新 API：成功回傳 ModuleDetailInfo，失敗會丟 ApiError
    const updatedModule = await moduleService.updateModule(props.code, requestData)

    // 更新成功
    showToast('success', '異動成功')

    // 更新本地的 moduleDetail 資料
    moduleDetail.value = updatedModule

    // 退出編輯模式
    isEditMode.value = false

    // 發出 updated 事件通知父元件
    emit('updated')
  } catch (err: unknown) {
    console.error('更新模組失敗:', err)

    if (err instanceof ApiError) {
      // 後端欄位驗證錯誤（例如 VALIDATION_ERROR）
      if (err.code === 'VALIDATION_ERROR' && err.data && isFieldErrorArray(err.data)) {
        handleFieldErrors(err.data)
        return
      }

      // 其他業務錯誤
      showToast('error', err.message || '儲存失敗，請重新嘗試')
    } else {
      // 非預期錯誤（例如網路問題）
      showToast('error', '儲存失敗，請重新嘗試')
    }
  } finally {
    isSubmitting.value = false
  }
}

// ===== 監聽 =====

/**
 * 監聽 Drawer 開啟狀態
 * 當 Drawer 開啟且有 code 時，載入模組詳細資料
 */
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.code) {
      // 重置編輯模式
      isEditMode.value = false
      // 關閉 Toast
      resetToast()
      // 載入資料
      loadModuleDetail()
    }
  },
  { immediate: true },
)
</script>
