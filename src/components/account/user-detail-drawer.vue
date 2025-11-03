<template>
  <Drawer :is-open="isOpen" @close="handleClose">
    <!-- 載入狀態 -->
    <div v-if="isLoading" class="flex items-center justify-center p-12">
      <div class="text-center">
        <div
          class="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"
        ></div>
        <p class="text-sm text-gray-500" style="font-family: 'Noto Sans TC', sans-serif">
          載入中...
        </p>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="px-5 py-6">
      <div class="rounded-lg border border-red-200 bg-red-50 p-4">
        <div class="flex items-start">
          <svg class="h-5 w-5 flex-shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="ml-3">
            <h3
              class="text-sm font-medium text-red-800"
              style="font-family: 'Noto Sans TC', sans-serif"
            >
              載入失敗
            </h3>
            <p class="mt-1 text-sm text-red-700" style="font-family: 'Noto Sans TC', sans-serif">
              {{ error }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 資料顯示或編輯 -->
    <div v-else-if="userDetail" class="flex flex-col gap-3 px-5">
      <!-- 標題區 -->
      <DrawerHeader :title="userDetail.userName" :subtitle="userDetail.userId" />

      <!-- 分隔線 -->
      <div class="w-[315px] border-t" style="border-color: #e4e6ea"></div>

      <!-- 顯示模式 -->
      <template v-if="!isEditMode">
        <!-- 帳號資訊區塊 -->
        <InfoSection title="帳號資訊">
          <!-- 編輯按鈕 -->
          <template #action>
            <IconFrame
              :show-frame="false"
              :icon-size="16"
              :icon="editIcon"
              icon-alt="編輯"
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
              ref="rolesCheckboxRef"
              v-model="formData.roleIds"
              label="權限"
              :options="roleOptions"
              :error-message="errors.roles"
            />

            <!-- 使用狀態 -->
            <FormRadioGroup
              ref="statusRadioRef"
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
      <div class="w-[315px] border-t" style="border-color: #e4e6ea"></div>

      <!-- 異動資訊區塊（始終顯示） -->
      <InfoSection title="異動資訊">
        <InfoField label="建立者" :value="createdByText" />
        <InfoField label="建立日" :value="createdAtText" />
        <InfoField label="最後異動者" :value="updatedByText" />
        <InfoField label="最後異動時間" :value="updatedAtText" />
      </InfoSection>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Drawer from '@/components/drawer/drawer.vue'
import DrawerHeader from '@/components/drawer/drawer-header.vue'
import InfoSection from '@/components/drawer/info-section.vue'
import InfoField from '@/components/drawer/info-field.vue'
import Badge from '@/components/common/badge.vue'
import IconFrame from '@/components/common/icon-frame.vue'
import FormSection from '@/components/form/form-section.vue'
import FormInput from '@/components/form/form-input.vue'
import FormCheckboxGroup from '@/components/form/form-checkbox-group.vue'
import FormRadioGroup from '@/components/form/form-radio-group.vue'
import FormButtonGroup from '@/components/form/form-button-group.vue'
import editIcon from '@/assets/icons/common/cm-edit.svg'
import { userService } from '@/services/user.service'
import { getRoleOptions } from '@/services/role.service'
import { formatDateDot, formatDateTimeWithPeriod } from '@/utils/time'
import type { UserDetailInfo } from '@/types/user'

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
const rolesCheckboxRef = ref<{ focus: () => void } | null>(null)
const statusRadioRef = ref<{ focus: () => void } | null>(null)
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
    const response = await getRoleOptions()

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
 * 處理關閉 Drawer
 */
const handleClose = () => {
  // 如果在編輯模式，先退出編輯模式
  if (isEditMode.value) {
    isEditMode.value = false
  }
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
 * 處理確認編輯
 * 這裡暫時只處理 UI 切換，實際儲存邏輯後續實作
 */
const handleConfirmEdit = () => {
  console.log('表單資料:', formData.value)
  // TODO: 實作儲存邏輯
  // 暫時先退出編輯模式
  isEditMode.value = false
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
      // 載入資料
      loadUserDetail()
    }
  },
  { immediate: true },
)
</script>
