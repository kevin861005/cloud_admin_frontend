<template>
  <Drawer :is-open="isOpen" @close="handleClose">
    <!-- 載入狀態 -->
    <Loading v-if="isLoading" message="載入資料中..." :show-spinner="true" />

    <!-- 錯誤狀態 -->
    <Alert v-else-if="error" type="error" title="載入失敗" :description="error" />

    <!-- 資料顯示或編輯 -->
    <div v-else-if="industryDetail" class="drawer">
      <!-- 標題區 -->
      <DrawerHeader :title="industryDetail.code" />

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

          <InfoField label="中文名稱" :value="industryDetail.name" />

          <InfoField label="SQL檔名" :value="industryDetail.sqlFile" />

          <InfoField label="說明" :value="industryDetail.description" />
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

            <FormInput
              ref="sqlFileInputRef"
              v-model="formData.sqlFile"
              label="SQL檔名"
              placeholder="請輸入"
              :error-message="errors.name"
            />

            <FormInput
              ref="descriptionInputRef"
              v-model="formData.description"
              label="說明"
              placeholder="請輸入"
              :error-message="errors.name"
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
        <InfoField label="建立日" :value="industryDetail.createdDate" />
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
import Alert from '@/components/common/alert.vue'
import Loading from '@/components/common/loading.vue'
import Divider from '@/components/common/divider.vue'
import FormSection from '@/components/form/form-section.vue'
import FormInput from '@/components/form/form-input.vue'
import FormButtonGroup from '@/components/form/form-button-group.vue'
import type { IndustryDetailInfo, UpdateIndustryRequest } from '@/types/industry'
import type { FieldError } from '@/types/common'
import { industryService } from '@/services/industry.service'
import { ApiError } from '@/types/common'

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
   * 產業別代號
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
 * 產業別詳細資料
 */
const industryDetail = ref<IndustryDetailInfo | null>(null)

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
  sqlFile: '',
  description: '',
})

/**
 * 表單錯誤訊息
 */
const errors = ref({
  name: '',
  sqlFile: '',
  description: '',
})

// ===== Template Refs =====
const nameInputRef = ref<{ focus: () => void } | null>(null)
const sqlFileInputRef = ref<{ focus: () => void } | null>(null)
const descriptionInputRef = ref<{ focus: () => void } | null>(null)

// ===== 計算屬性 =====

/**
 * 建立者顯示文字
 */
const createdByText = computed(() => {
  if (!industryDetail.value || !industryDetail.value.createdBy) return '-'
  return industryDetail.value.createdBy.name
})

// ===== 方法 =====

/**
 * 載入產業別詳細資料
 */
const loadIndustryDetail = async () => {
  if (!props.code) return

  isLoading.value = true
  error.value = null
  industryDetail.value = null

  try {
    industryDetail.value = await industryService.getIndustryDetail(props.code)
  } catch (err) {
    console.error('載入產業別詳細資料錯誤:', err)
    error.value = err instanceof Error ? err.message : '發生未知錯誤，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

/**
 * 初始化表單資料
 */
const initFormData = () => {
  if (!industryDetail.value) return

  formData.value = {
    name: industryDetail.value.name,
    sqlFile: industryDetail.value.sqlFile,
    description: industryDetail.value.description,
  }

  // 清空錯誤訊息
  errors.value = {
    name: '',
    sqlFile: '',
    description: '',
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
 * 處理後端回傳的欄位錯誤
 * 將後端的欄位名稱對應到前端的錯誤訊息
 *
 * @param fieldErrors - 後端回傳的欄位錯誤列表
 */
const handleFieldErrors = (fieldErrors: FieldError[]) => {
  // 清空現有錯誤
  errors.value = {
    name: '',
    sqlFile: '',
    description: '',
  }

  // 欄位名稱對應表 (後端 -> 前端)
  const fieldMap: Record<string, keyof typeof errors.value> = {
    name: 'name',
    sqlFile: 'sqlFile',
    description: 'description',
  }

  // Ref 對應表 (後端欄位名稱 -> Ref)
  const fieldRefMap: Record<string, typeof nameInputRef> = {
    name: nameInputRef,
    sqlFile: sqlFileInputRef,
    description: descriptionInputRef,
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
  const fieldOrder = ['name', 'sqlFile', 'description']

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
    sqlFile: '',
    description: '',
  }

  // 開始提交
  isSubmitting.value = true

  try {
    // 準備提交的資料
    const requestData: UpdateIndustryRequest = {
      name: formData.value.name,
      sqlFile: formData.value.sqlFile,
      description: formData.value.description,
    }

    // 呼叫更新 API：成功回傳 IndustryDetailInfo，失敗會丟 ApiError
    const updatedIndustry = await industryService.updateIndustry(props.code, requestData)

    // 更新成功
    showToast('success', '異動成功')

    // 更新本地的 industryDetail 資料
    industryDetail.value = updatedIndustry

    // 退出編輯模式
    isEditMode.value = false

    // 發出 updated 事件通知父元件
    emit('updated')
  } catch (err: unknown) {
    console.error('更新產業別失敗:', err)

    if (err instanceof ApiError) {
      // 後端欄位驗證錯誤（例如 VALIDATION_ERROR）
      if (err.code === 'VALIDATION_ERROR' && err.data && isFieldErrorArray(err.data)) {
        handleFieldErrors(err.data)
        return
      }

      // 其他業務錯誤：顯示 toast
      showToast('error', err.message || '儲存失敗，請重新嘗試')
    } else {
      // 非預期錯誤（例如網路問題或程式 bug）
      showToast('error', '儲存失敗，請重新嘗試')
    }
  } finally {
    isSubmitting.value = false
  }
}

// ===== 監聽 =====

/**
 * 監聽 Drawer 開啟狀態
 * 當 Drawer 開啟且有 loginId 時，載入使用者詳細資料
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
      loadIndustryDetail()
    }
  },
  { immediate: true },
)
</script>
