<template>
  <Drawer :is-open="isOpen" @close="handleClose">
    <!-- 載入狀態 -->
    <Loading v-if="isLoading" message="載入資料中..." :show-spinner="true" />

    <!-- 錯誤狀態 -->
    <Alert v-else-if="error" type="error" title="載入失敗" :description="error" />

    <!-- 資料顯示或編輯 -->
    <div v-else-if="dealerDetail" class="drawer">
      <!-- 標題區 -->
      <DrawerHeader :title="dealerDetail.code" />

      <!-- 分隔線 -->
      <Divider />

      <!-- 顯示模式 -->
      <template v-if="!isEditMode">
        <!-- 帳號資訊區塊 -->
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

          <InfoField label="經銷商名稱" :value="dealerDetail.name" />

          <InfoField label="負責業務" :value="dealerDetail.sales.name" />
        </InfoSection>

        <!-- 詳細資訊區塊 -->
        <InfoSection title="詳細資訊">
          <InfoField label="聯絡人" :value="dealerDetail.contactPerson" />

          <InfoField label="聯絡電話" :value="dealerDetail.contactPhone" />

          <InfoField label="電子信箱" :value="dealerDetail.email" />

          <InfoField label="地址" :value="dealerDetail.address" />

          <InfoField label="說明" :value="dealerDetail.description" />
        </InfoSection>
      </template>

      <!-- 編輯模式 -->
      <template v-else>
        <div class="edit">
          <FormSection>
            <FormInput
              ref="nameInputRef"
              v-model="formData.name"
              label="經銷商名稱"
              placeholder="請輸入"
              :error-message="errors.name"
            />

            <FormSelect
              label="負責業務"
              v-model="formData.sales"
              :options="salesOptions"
              :required="true"
              :error-message="errors.sales"
              placeholder="請選擇業務"
            />
          </FormSection>

          <!-- 詳細資訊區塊（編輯） -->
          <FormSection title="詳細資訊">
            <FormInput
              ref="contactPersonInputRef"
              v-model="formData.contactPerson"
              label="聯絡人"
              placeholder="請輸入"
              :error-message="errors.contactPerson"
            />

            <FormInput
              ref="contactPhoneInputRef"
              v-model="formData.contactPhone"
              label="聯絡電話"
              placeholder="請輸入"
              :error-message="errors.contactPhone"
            />

            <FormInput
              ref="emailInputRef"
              v-model="formData.email"
              label="電子信箱"
              type="email"
              placeholder="請輸入"
              :error-message="errors.email"
            />

            <FormInput
              ref="addressInputRef"
              v-model="formData.address"
              label="地址"
              placeholder="請輸入"
              :error-message="errors.address"
            />

            <FormInput
              ref="descriptionInputRef"
              v-model="formData.description"
              label="說明"
              placeholder="請輸入"
              :error-message="errors.description"
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
        <InfoField label="建立日" :value="dealerDetail.createdDate" />
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
import Alert from '@/components/common/alert.vue'
import Loading from '@/components/common/loading.vue'
import Divider from '@/components/common/divider.vue'
import FormSection from '@/components/form/form-section.vue'
import FormInput from '@/components/form/form-input.vue'
import FormSelect from '@/components/form/form-select.vue'
import FormButtonGroup from '@/components/form/form-button-group.vue'
import type { DealerDetailInfo, UpdateDealerRequest } from '@/types/dealer'
import type { SaleListItem } from '@/types/user'
import type { FieldError } from '@/types/common'
import { dealerService } from '@/services/dealer.service'
import { userService } from '@/services/user.service'

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
   * 經銷商代號
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
 * 經銷商詳細資料
 */
const dealerDetail = ref<DealerDetailInfo | null>(null)

/**
 * 業務列表（原始資料）
 */
const salesList = ref<SaleListItem[]>([])

/**
 * 業務選項（轉換為 FormSelect 格式）
 */
const salesOptions = computed(() => {
  return salesList.value.map((sale) => ({
    label: sale.name,
    value: sale.id,
  }))
})

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
  sales: '',
  contactPerson: '',
  contactPhone: '',
  email: '',
  address: '',
  description: '',
})

/**
 * 表單錯誤訊息
 */
const errors = ref({
  name: '',
  sales: '',
  contactPerson: '',
  contactPhone: '',
  email: '',
  address: '',
  description: '',
})

// ===== Template Refs =====
const nameInputRef = ref<{ focus: () => void } | null>(null)
const salesInputRef = ref<{ focus: () => void } | null>(null)
const contactPersonInputRef = ref<{ focus: () => void } | null>(null)
const contactPhoneInputRef = ref<{ focus: () => void } | null>(null)
const emailInputRef = ref<{ focus: () => void } | null>(null)
const addressInputRef = ref<{ focus: () => void } | null>(null)
const descriptionInputRef = ref<{ focus: () => void } | null>(null)

// ===== 選項資料 =====

/**
 * 建立者顯示文字
 */
const createdByText = computed(() => {
  if (!dealerDetail.value || !dealerDetail.value.createdBy) return '-'
  return dealerDetail.value.createdBy.name
})

// ===== 方法 =====

/**
 * 載入經銷商詳細資料
 */
const loadDealerDetail = async () => {
  if (!props.code) return

  isLoading.value = true
  error.value = null
  dealerDetail.value = null

  try {
    const response = await dealerService.getDealerDetail(props.code)

    if (response.success && response.data) {
      dealerDetail.value = response.data
    } else {
      error.value = response.message || '載入經銷商資料失敗'
    }
  } catch (err) {
    console.error('載入經銷商詳細資料錯誤:', err)
    error.value = err instanceof Error ? err.message : '發生未知錯誤，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

/**
 * 載入權限選項
 */
const loadSaleOptions = async () => {
  try {
    const response = await userService.getAllSales()

    if (response.success && response.data) {
      salesList.value = response.data
      console.log('業務選項載入成功:', salesOptions.value)
    } else {
      console.error('載入業務選項失敗:', response.message)
      salesList.value = []
    }
  } catch (error) {
    console.error('載入業務選項錯誤:', error)
    salesList.value = []
  }
}

/**
 * 初始化表單資料
 */
const initFormData = () => {
  if (!dealerDetail.value) return

  formData.value = {
    name: dealerDetail.value.name,
    sales: dealerDetail.value.sales.id,
    contactPerson: dealerDetail.value.contactPerson,
    contactPhone: dealerDetail.value.contactPhone,
    email: dealerDetail.value.email,
    address: dealerDetail.value.address,
    description: dealerDetail.value.description,
  }

  // 清空錯誤訊息
  errors.value = {
    name: '',
    sales: '',
    contactPerson: '',
    contactPhone: '',
    email: '',
    address: '',
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
  // 先載入業務選項
  await loadSaleOptions()

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
  console.log('handleFieldErrors 被呼叫, 收到的錯誤:', fieldErrors)

  // 清空現有錯誤
  errors.value = {
    name: '',
    sales: '',
    contactPerson: '',
    contactPhone: '',
    email: '',
    address: '',
    description: '',
  }

  // 欄位名稱對應表 (後端 -> 前端)
  const fieldMap: Record<string, keyof typeof errors.value> = {
    name: 'name',
    sales: 'sales',
    contactPerson: 'contactPerson',
    contactPhone: 'contactPhone',
    email: 'email',
    address: 'address',
    description: 'description',
  }

  // Ref 對應表 (後端欄位名稱 -> Ref)
  const fieldRefMap: Record<string, typeof nameInputRef> = {
    name: nameInputRef,
    sales: salesInputRef,
    contactPerson: contactPersonInputRef,
    contactPhone: contactPhoneInputRef,
    email: emailInputRef,
    address: addressInputRef,
    description: descriptionInputRef,
  }

  // 記錄哪些欄位有錯誤
  const fieldsWithErrors = new Set<string>()

  // 遍歷所有欄位錯誤
  fieldErrors.forEach((fieldError) => {
    const frontendField = fieldMap[fieldError.field]

    if (frontendField) {
      // 如果該欄位已經有錯誤訊息,用分號串接
      if (errors.value[frontendField]) {
        errors.value[frontendField] += `; ${fieldError.message}`
      } else {
        errors.value[frontendField] = fieldError.message
      }

      // 記錄有錯誤的欄位 (使用後端欄位名稱)
      fieldsWithErrors.add(fieldError.field)
    }
  })

  console.log('有錯誤的欄位:', Array.from(fieldsWithErrors))

  // 根據畫面上的欄位順序,找到第一個有錯誤的欄位並 focus
  const fieldOrder = [
    'name',
    'sales',
    'contactPerson',
    'contactPhone',
    'email',
    'address',
    'description',
  ]

  for (const field of fieldOrder) {
    if (fieldsWithErrors.has(field)) {
      console.log('嘗試 focus 到:', field)
      const refToFocus = fieldRefMap[field]
      console.log('Ref 物件:', refToFocus?.value)

      if (refToFocus?.value?.focus) {
        try {
          // 檢查是否有 focus 方法且為函數
          if (typeof refToFocus.value.focus === 'function') {
            console.log('呼叫 focus()')
            refToFocus.value.focus()
          } else {
            console.warn(`${field} 的 focus 不是函數或不存在`)
          }
        } catch (error) {
          console.error(`focus 到 ${field} 時發生錯誤:`, error)
          // 不中斷流程，繼續執行
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

  console.log('表單資料:', formData.value)

  // 清空所有錯誤訊息
  errors.value = {
    name: '',
    sales: '',
    contactPerson: '',
    contactPhone: '',
    email: '',
    address: '',
    description: '',
  }

  // 開始提交
  isSubmitting.value = true

  try {
    // 準備提交的資料
    const requestData: UpdateDealerRequest = {
      name: formData.value.name,
      sales: formData.value.sales,
      contactPerson: formData.value.contactPerson,
      contactPhone: formData.value.contactPhone,
      email: formData.value.email,
      address: formData.value.address,
      description: formData.value.description,
    }

    // 呼叫更新 API
    const response = await dealerService.updateDealer(props.code, requestData)

    console.log('updateDealer API 回應:', response)

    if (response.success && response.data) {
      // 更新成功
      showToast('success', '異動成功')

      // 更新本地的 userDetail 資料
      dealerDetail.value = response.data

      // 退出編輯模式
      isEditMode.value = false

      // 發出 updated 事件通知父元件
      emit('updated')
    } else {
      console.log('API 失敗 (try 區塊):', {
        hasData: !!response.data,
        isArray: Array.isArray(response.data),
        data: response.data,
      })

      // 更新失敗
      if (response.data && isFieldErrorArray(response.data)) {
        console.log('進入欄位錯誤處理 (try 區塊)')
        // 有 data：顯示欄位錯誤，不顯示 toast
        handleFieldErrors(response.data)
      } else {
        console.log('進入 toast 顯示 (try 區塊)')
        // 沒有 data：顯示 toast
        showToast('error', response.message || '儲存失敗，請重新嘗試')
      }
    }
  } catch (err: unknown) {
    console.error('進入 catch 區塊:', err)

    // 使用 axios 的型別守衛
    if (isAxiosError(err)) {
      const errorResponse = err.response?.data

      console.log('Axios 錯誤回應:', {
        errorResponse,
        hasData: !!errorResponse?.data,
        isArray: Array.isArray(errorResponse?.data),
        checkResult: errorResponse?.data && isFieldErrorArray(errorResponse.data),
      })

      // 優先檢查是否有 data（欄位錯誤）
      if (errorResponse?.data && isFieldErrorArray(errorResponse.data)) {
        console.log('進入欄位錯誤處理 (catch 區塊)')
        // 有 data：顯示欄位錯誤，不顯示 toast
        handleFieldErrors(errorResponse.data)
      } else {
        console.log('進入 toast 顯示 (catch 區塊)')
        // 沒有 data：顯示 toast
        const errorMessage = errorResponse?.message || '儲存失敗，請重新嘗試'
        showToast('error', errorMessage)

        // 特殊處理：如果是 EMAIL 已被使用，額外標記欄位並 focus
        if (errorResponse?.code === 'USER_003') {
          errors.value.email = errorResponse.message
          emailInputRef.value?.focus()
        }
      }
    } else {
      console.log('非 Axios 錯誤')
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
      loadDealerDetail()
    }
  },
  { immediate: true },
)
</script>
