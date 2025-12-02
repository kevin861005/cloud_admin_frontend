<template>
  <Drawer :is-open="isOpen" @close="handleClose">
    <!-- 載入狀態 -->
    <Loading v-if="isLoading" message="載入資料中..." :show-spinner="true" />

    <!-- 錯誤狀態 -->
    <Alert v-else-if="error" type="error" title="載入失敗" :description="error" />

    <!-- 資料顯示或編輯 -->
    <div v-else-if="moduleDetail" class="drawer">
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
        <div class="edit">
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
import { isAxiosError } from 'axios'
import Drawer from '@/components/drawer/drawer.vue'
import DrawerHeader from '@/components/drawer/drawer-header.vue'
import DrawerToast from '@/components/drawer/drawer-toast.vue'
import InfoSection from '@/components/drawer/info-section.vue'
import InfoField from '@/components/drawer/info-field.vue'
import Badge from '@/components/common/badge.vue'
import Loading from '@/components/common/loading.vue'
import Alert from '@/components/common/alert.vue'
import Divider from '@/components/common/divider.vue'
import FormSection from '@/components/form/form-section.vue'
import FormInput from '@/components/form/form-input.vue'
import FormRadioGroup from '@/components/form/form-radio-group.vue'
import FormButtonGroup from '@/components/form/form-button-group.vue'
import type { ModuleDetailInfo, UpdateModuleRequest } from '@/types/module'
import type { FieldError } from '@/types/common'
import { moduleService } from '@/services/module.service'

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
    const response = await moduleService.getModuleDetail(props.code)

    if (response.success && response.data) {
      moduleDetail.value = response.data
    } else {
      error.value = response.message || '載入模組資料失敗'
    }
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
  // 清空現有錯誤
  errors.value = {
    name: '',
  }

  // 欄位名稱對應表 (後端 -> 前端)
  const fieldMap: Record<string, keyof typeof errors.value> = {
    name: 'name',
  }

  // Ref 對應表 (後端欄位名稱 -> Ref)
  const fieldRefMap: Record<string, typeof nameInputRef> = {
    name: nameInputRef,
  }

  // 記錄哪些欄位有錯誤
  const fieldsWithErrors = new Set<string>()

  // 遍歷所有欄位錯誤
  fieldErrors.forEach((fieldError) => {
    const frontendField = fieldMap[fieldError.field]

    if (frontendField) {
      // 如果該欄位已經有錯誤訊息，用分號串接
      if (errors.value[frontendField]) {
        errors.value[frontendField] += `; ${fieldError.message}`
      } else {
        errors.value[frontendField] = fieldError.message
      }

      // 記錄有錯誤的欄位 (使用後端欄位名稱)
      fieldsWithErrors.add(fieldError.field)
    }
  })

  // 根據畫面上的欄位順序，找到第一個有錯誤的欄位並 focus
  const fieldOrder = ['name']

  for (const field of fieldOrder) {
    if (fieldsWithErrors.has(field)) {
      const refToFocus = fieldRefMap[field]

      if (refToFocus?.value?.focus && typeof refToFocus.value.focus === 'function') {
        try {
          refToFocus.value.focus()
        } catch (focusError) {
          console.error(`focus 到 ${field} 時發生錯誤:`, focusError)
        }
      }
      break // 只 focus 第一個錯誤欄位
    }
  }
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

    // 呼叫更新 API
    const response = await moduleService.updateModule(props.code, requestData)

    if (response.success && response.data) {
      // 更新成功
      showToast('success', '異動成功')

      // 更新本地的 moduleDetail 資料
      moduleDetail.value = response.data

      // 退出編輯模式
      isEditMode.value = false

      // 發出 updated 事件通知父元件
      emit('updated')
    } else {
      // 更新失敗
      if (response.data && isFieldErrorArray(response.data)) {
        // 有 data：顯示欄位錯誤，不顯示 toast
        handleFieldErrors(response.data)
      } else {
        // 沒有 data：顯示 toast
        showToast('error', response.message || '儲存失敗，請重新嘗試')
      }
    }
  } catch (err: unknown) {
    // 使用 axios 的型別守衛
    if (isAxiosError(err)) {
      const errorResponse = err.response?.data

      // 優先檢查是否有 data（欄位錯誤）
      if (errorResponse?.data && isFieldErrorArray(errorResponse.data)) {
        // 有 data：顯示欄位錯誤，不顯示 toast
        handleFieldErrors(errorResponse.data)
      } else {
        // 沒有 data：顯示 toast
        const errorMessage = errorResponse?.message || '儲存失敗，請重新嘗試'
        showToast('error', errorMessage)
      }
    } else {
      // 非 Axios 錯誤
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
      handleToastClose()
      // 載入資料
      loadModuleDetail()
    }
  },
  { immediate: true },
)
</script>
