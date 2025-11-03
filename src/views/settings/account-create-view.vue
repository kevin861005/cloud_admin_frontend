<template>
  <div class="space-y-6">
    <!-- 頁面標題 -->
    <PageTitle title="新增帳號" subtitle="帳號名稱新增後無法變更" />

    <!-- 主要容器 -->
    <div class="flex gap-3 rounded-xl bg-white p-6 shadow-md">
      <!-- 左側：填寫資料區域 -->
      <div class="flex flex-col w-[560px]" style="gap: 12px">
        <!-- 1. 帳號資訊區塊 -->
        <FormSection title="帳號資訊">
          <FormInput
            ref="loginIdInputRef"
            v-model="formData.loginId"
            label="帳號"
            placeholder="請輸入"
            :required="fieldRequired.loginId"
            :error-message="errors.loginId"
          />
          <FormInput
            ref="passwordInputRef"
            v-model="formData.password"
            label="密碼"
            type="password"
            placeholder="請輸入"
            :required="fieldRequired.password"
            :error-message="errors.password"
          />
          <FormCheckboxGroup
            ref="rolesCheckboxRef"
            v-model="formData.roleIds"
            label="權限"
            :options="roleOptions"
            :required="fieldRequired.roles"
            :error-message="errors.roles"
          />
        </FormSection>

        <!-- 分隔線 -->
        <div style="width: 560px; height: 0px; border: 1px solid #e5ecff; opacity: 1"></div>

        <!-- 2. 個人資訊區塊 -->
        <FormSection title="個人資訊">
          <FormInput
            ref="nameInputRef"
            v-model="formData.name"
            label="姓名"
            placeholder="請輸入"
            :required="fieldRequired.name"
            :error-message="errors.name"
          />
          <FormInput
            ref="emailInputRef"
            v-model="formData.email"
            label="電子信箱"
            type="email"
            placeholder="請輸入"
            :required="fieldRequired.email"
            :error-message="errors.email"
          />
        </FormSection>

        <!-- 3. 按鈕群組 -->
        <FormButtonGroup
          confirm-text="送出"
          :disabled="isSubmitting"
          @cancel="handleCancel"
          @confirm="handleConfirm"
        />
      </div>

      <!-- 右側：空白區域 -->
      <div class="flex items-center justify-center w-[560px] h-[516px]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/components/common/page-title.vue'
import FormSection from '@/components/form/form-section.vue'
import FormInput from '@/components/form/form-input.vue'
import FormCheckboxGroup from '@/components/form/form-checkbox-group.vue'
import FormButtonGroup from '@/components/form/form-button-group.vue'
import { getRoleOptions } from '@/services/role.service'
import { createUser } from '@/services/user.service'
import type { CreateUserRequest } from '@/types/user'
import type { FieldError } from '@/types/common'

/**
 * 新增帳號頁面
 */

const router = useRouter()

// ===== 表單資料 =====
const formData = ref({
  loginId: '',
  password: '',
  roleIds: [] as number[],
  name: '',
  email: '',
})

// ===== 欄位是否必填 =====
const fieldRequired = {
  loginId: false,
  password: false,
  roles: false,
  name: false,
  email: false,
}

const errors = ref({
  loginId: '',
  password: '',
  roles: '',
  name: '',
  email: '',
})

const isSubmitting = ref(false)

// ===== Template Refs =====
const loginIdInputRef = ref<{ focus: () => void } | null>(null)
const passwordInputRef = ref<{ focus: () => void } | null>(null)
const rolesCheckboxRef = ref<{ focus: () => void } | null>(null)
const nameInputRef = ref<{ focus: () => void } | null>(null)
const emailInputRef = ref<{ focus: () => void } | null>(null)

// ===== 權限選項 (從 API 動態載入) =====
const roleOptions = ref<Array<{ label: string; value: number }>>([])

/**
 * 從後端 API 載入權限選項
 */
const loadRoleOptions = async () => {
  try {
    const response = await getRoleOptions()

    if (response.success && response.data) {
      roleOptions.value = response.data
      console.log('權限選項載入成功:', roleOptions.value)
    } else {
      console.error('載入權限選項失敗:', response.message)
      // 使用預設選項作為後備
      roleOptions.value = []
    }
  } catch (error) {
    console.error('載入權限選項錯誤:', error)
    // 使用預設選項作為後備
    roleOptions.value = []
  }
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
    loginId: '',
    password: '',
    roles: '',
    name: '',
    email: '',
  }

  // 欄位名稱對應表 (後端 -> 前端)
  const fieldMap: Record<string, keyof typeof errors.value> = {
    loginId: 'loginId',
    password: 'password',
    roleIds: 'roles',
    name: 'name',
    email: 'email',
  }

  // Ref 對應表 (後端欄位名稱 -> Ref)
  const fieldRefMap: Record<string, typeof loginIdInputRef> = {
    loginId: loginIdInputRef,
    password: passwordInputRef,
    roleIds: rolesCheckboxRef,
    name: nameInputRef,
    email: emailInputRef,
  }

  console.log('Ref 對應表:', {
    loginId: loginIdInputRef.value,
    password: passwordInputRef.value,
    roleIds: rolesCheckboxRef.value,
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
  const fieldOrder = ['loginId', 'password', 'roleIds', 'name', 'email']

  for (const field of fieldOrder) {
    if (fieldsWithErrors.has(field)) {
      console.log('嘗試 focus 到:', field)
      const refToFocus = fieldRefMap[field]
      console.log('Ref 物件:', refToFocus?.value)

      if (refToFocus?.value?.focus) {
        console.log('呼叫 focus()')
        refToFocus.value.focus()
      } else {
        console.log('focus 方法不存在')
      }
      break // 只 focus 第一個錯誤欄位
    }
  }
}

// ===== 事件處理 =====

/**
 * 取消按鈕
 * 返回帳號管理列表
 */
const handleCancel = () => {
  router.push('/settings/accounts')
}

/**
 * 確認按鈕
 * 提交表單資料
 */
const handleConfirm = async () => {
  // 清空所有錯誤訊息
  errors.value = {
    loginId: '',
    password: '',
    roles: '',
    name: '',
    email: '',
  }

  // 開始提交
  isSubmitting.value = true

  try {
    // 準備提交的資料
    const requestData: CreateUserRequest = {
      loginId: formData.value.loginId,
      password: formData.value.password,
      name: formData.value.name,
      email: formData.value.email,
      roleIds: formData.value.roleIds,
    }

    // 呼叫 API
    const response = await createUser(requestData)

    if (response.success) {
      // 成功:返回列表頁面
      router.push('/settings/accounts?success=新增成功')
    } else {
      // 失敗:檢查是否為欄位驗證錯誤
      if (response.code === 'VALIDATION_ERROR' && response.data) {
        // 後端欄位驗證錯誤
        const fieldErrors = response.data as FieldError[]
        handleFieldErrors(fieldErrors)
      } else if (response.code === 'USER_002') {
        // 帳號已存在
        errors.value.loginId = response.message
        loginIdInputRef.value?.focus()
      }
    }
  } catch (error) {
    console.error('新增帳號時發生錯誤:', error)
    alert('新增帳號時發生錯誤,請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}

// ===== 初始化 =====

/**
 * 元件掛載時載入權限選項
 */
onMounted(() => {
  loadRoleOptions()
})
</script>

<style scoped></style>
