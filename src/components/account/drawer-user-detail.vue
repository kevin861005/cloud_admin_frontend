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
    <div v-else-if="userDetail" class="flex flex-col gap-3 px-5">
      <!-- 標題區 -->
      <DrawerHeader :title="userDetail.userName" :subtitle="userDetail.userId" />

      <!-- 分隔線 -->
      <Divider />

      <!-- 顯示模式 -->
      <template v-if="!isEditMode">
        <!-- 帳號資訊區塊 -->
        <InfoSection title="帳號資訊">
          <!-- 編輯按鈕 -->
          <template #action>
            <img
              src="@/assets/icons/common/cm-edit.svg"
              alt="編輯"
              class="w-4 h-4 cursor-pointer"
              @click="handleEdit"
            />
          </template>

          <InfoField label="密碼" :value="userDetail.password" />

          <InfoField label="權限">
            <Badge
              v-for="(role, index) in userDetail.roles"
              :key="index"
              :text="role"
              type="default"
            />
          </InfoField>

          <InfoField label="使用狀態">
            <Badge :text="statusText" :type="statusType" />
          </InfoField>
        </InfoSection>

        <!-- 個人資訊區塊 -->
        <InfoSection title="個人資訊">
          <InfoField label="姓名" :value="userDetail.userName" />

          <InfoField label="電子信箱" :value="userDetail.email" />
        </InfoSection>
      </template>

      <!-- 編輯模式 -->
      <template v-else>
        <div class="flex flex-col gap-3 overflow-x-hidden">
          <!-- 帳號資訊區塊（編輯） -->
          <FormSection title="帳號資訊">
            <!-- 密碼（唯讀） -->
            <FormInput
              v-model="formData.password"
              label="密碼"
              type="password"
              placeholder="請輸入"
              :disabled="true"
              :error-message="errors.password"
            />

            <!-- 權限 -->
            <FormCheckboxGroup
              v-model="formData.roleIds"
              label="權限"
              :options="roleOptions"
              :error-message="errors.roles"
            />

            <!-- 使用狀態 -->
            <FormRadioGroup
              v-model="formData.statusCode"
              label="使用狀態"
              :options="statusOptions"
              :error-message="errors.status"
            />
          </FormSection>

          <!-- 個人資訊區塊（編輯） -->
          <FormSection title="個人資訊">
            <!-- 姓名 -->
            <FormInput
              ref="nameInputRef"
              v-model="formData.name"
              label="姓名"
              placeholder="請輸入"
              :error-message="errors.name"
            />

            <!-- 電子信箱 -->
            <FormInput
              ref="emailInputRef"
              v-model="formData.email"
              label="電子信箱"
              type="email"
              placeholder="請輸入"
              :error-message="errors.email"
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
        <InfoField label="最後異動者" :value="updatedByText" />
        <InfoField label="最後異動時間" :value="updatedAtText" />
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
import Alert from '@/components/common/alert.vue'
import Divider from '@/components/common/divider.vue'
import FormSection from '@/components/form/form-section.vue'
import FormInput from '@/components/form/form-input.vue'
import FormCheckboxGroup from '@/components/form/form-checkbox-group.vue'
import FormRadioGroup from '@/components/form/form-radio-group.vue'
import FormButtonGroup from '@/components/form/form-button-group.vue'
import { userService } from '@/services/user.service'
import { roleService } from '@/services/role.service'
import { formatDateDot, formatDateTimeWithPeriod } from '@/utils/time'
import type { UserDetailInfo, UpdateUserRequest } from '@/types/user'
import type { FieldError } from '@/types/common'

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
   * 使用者登入帳號（用於呼叫 API）
   */
  loginId: string | null
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
 * 使用者詳細資料
 */
const userDetail = ref<UserDetailInfo | null>(null)

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
  password: '',
  roleIds: [] as number[],
  statusCode: '',
  name: '',
  email: '',
})

/**
 * 表單錯誤訊息
 */
const errors = ref({
  password: '',
  roles: '',
  status: '',
  name: '',
  email: '',
})

// ===== Template Refs =====
const nameInputRef = ref<{ focus: () => void } | null>(null)
const emailInputRef = ref<{ focus: () => void } | null>(null)

// ===== 選項資料 =====

/**
 * 權限選項（從 API 載入）
 */
const roleOptions = ref<Array<{ label: string; value: number }>>([])

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
  if (!userDetail.value) return ''
  return userDetail.value.statusCode === 'ACTIVE' ? '啟用' : '停用'
})

/**
 * 狀態 Badge 類型
 */
const statusType = computed(() => {
  if (!userDetail.value) return 'default'
  return userDetail.value.statusCode === 'ACTIVE' ? 'success' : 'default'
})

/**
 * 建立者顯示文字
 */
const createdByText = computed(() => {
  if (!userDetail.value || !userDetail.value.createdBy) return '-'
  return userDetail.value.createdBy.name
})

/**
 * 建立日顯示文字
 */
const createdAtText = computed(() => {
  if (!userDetail.value) return '-'
  return formatDateDot(userDetail.value.createdAt)
})

/**
 * 最後異動者顯示文字
 */
const updatedByText = computed(() => {
  if (!userDetail.value || !userDetail.value.updatedBy) return '-'
  return userDetail.value.updatedBy.name
})

/**
 * 最後異動時間顯示文字
 */
const updatedAtText = computed(() => {
  if (!userDetail.value || !userDetail.value.updatedAt) return '-'
  return formatDateTimeWithPeriod(userDetail.value.updatedAt)
})

// ===== 方法 =====

/**
 * 載入使用者詳細資料
 */
const loadUserDetail = async () => {
  if (!props.loginId) return

  isLoading.value = true
  error.value = null
  userDetail.value = null

  try {
    const response = await userService.getUserDetail(props.loginId)

    if (response.success && response.data) {
      userDetail.value = response.data
    } else {
      error.value = response.message || '載入使用者資料失敗'
    }
  } catch (err) {
    console.error('載入使用者詳細資料錯誤:', err)
    error.value = err instanceof Error ? err.message : '發生未知錯誤，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

/**
 * 載入權限選項
 */
const loadRoleOptions = async () => {
  try {
    const response = await roleService.getRoleOptions()

    if (response.success && response.data) {
      roleOptions.value = response.data
      console.log('權限選項載入成功:', roleOptions.value)
    } else {
      console.error('載入權限選項失敗:', response.message)
      roleOptions.value = []
    }
  } catch (error) {
    console.error('載入權限選項錯誤:', error)
    roleOptions.value = []
  }
}

/**
 * 初始化表單資料
 */
const initFormData = () => {
  if (!userDetail.value) return

  formData.value = {
    password: userDetail.value.password,
    roleIds: userDetail.value.roleIds || [],
    statusCode: userDetail.value.statusCode,
    name: userDetail.value.userName,
    email: userDetail.value.email,
  }

  // 清空錯誤訊息
  errors.value = {
    password: '',
    roles: '',
    status: '',
    name: '',
    email: '',
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
  // 先載入權限選項
  await loadRoleOptions()

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
    password: '',
    roles: '',
    status: '',
    name: '',
    email: '',
  }

  // 欄位名稱對應表 (後端 -> 前端)
  const fieldMap: Record<string, keyof typeof errors.value> = {
    password: 'password',
    roleIds: 'roles',
    statusCode: 'status',
    name: 'name',
    email: 'email',
  }

  // Ref 對應表 (後端欄位名稱 -> Ref)
  const fieldRefMap: Record<string, typeof nameInputRef> = {
    name: nameInputRef,
    email: emailInputRef,
  }

  console.log('Ref 對應表:', {
    name: nameInputRef.value,
    email: emailInputRef.value,
  })

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
  const fieldOrder = ['name', 'email']

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
  if (!props.loginId) return

  console.log('表單資料:', formData.value)

  // 清空所有錯誤訊息
  errors.value = {
    password: '',
    roles: '',
    status: '',
    name: '',
    email: '',
  }

  // 開始提交
  isSubmitting.value = true

  try {
    // 準備提交的資料
    const requestData: UpdateUserRequest = {
      name: formData.value.name,
      email: formData.value.email,
      roleIds: formData.value.roleIds,
      statusCode: formData.value.statusCode as 'ACTIVE' | 'INACTIVE',
    }

    // 呼叫更新 API
    const response = await userService.updateUser(props.loginId, requestData)

    console.log('updateUser API 回應:', response)

    if (response.success && response.data) {
      // 更新成功
      showToast('success', '異動成功')

      // 更新本地的 userDetail 資料
      userDetail.value = response.data

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

        // 特殊處理：如果是 EMAIL 已被使用，額外標記欄位並 focus
        if (response.code === 'USER_003') {
          errors.value.email = response.message
          emailInputRef.value?.focus()
        }
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
    if (isOpen && props.loginId) {
      // 重置編輯模式
      isEditMode.value = false
      // 關閉 Toast
      handleToastClose()
      // 載入資料
      loadUserDetail()
    }
  },
  { immediate: true },
)
</script>
