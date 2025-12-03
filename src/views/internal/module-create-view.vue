<template>
  <PageTitle title="新增模組" />

  <!-- 主要容器 -->
  <div class="flex gap-5 px-10">
    <!-- 填寫資料區域 -->
    <div class="flex flex-col w-full gap-3 px-5 py-6 rounded-xl bg-white shadow-md">
      <FormSection>
        <FormInput
          ref="codeInputRef"
          v-model="formData.code"
          label="代號"
          placeholder="請輸入"
          :required="fieldRequired.code"
          :error-message="errors.code"
        />
        <FormInput
          ref="nameInputRef"
          v-model="formData.name"
          label="中文名稱"
          placeholder="請輸入"
          :required="fieldRequired.name"
          :error-message="errors.name"
        />
      </FormSection>

      <FormButtonGroup
        confirm-text="送出"
        :disabled="isSubmitting"
        @cancel="handleCancel"
        @confirm="handleConfirm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/components/common/page-title.vue'
import FormSection from '@/components/form/form-section.vue'
import FormInput from '@/components/form/form-input.vue'
import FormButtonGroup from '@/components/form/form-button-group.vue'
import type { CreateModuleRequest } from '@/types/module'
import type { FieldError } from '@/types/common'
import { moduleService } from '@/services/module.service'
import { ApiError } from '@/types/common'

const router = useRouter()

const isSubmitting = ref(false)

// ===== 表單資料 =====
const formData = ref({
  code: '',
  name: '',
})

// ===== 欄位是否必填 =====
const fieldRequired = {
  code: false,
  name: false,
}

const errors = ref({
  code: '',
  name: '',
})

// ===== Template Refs =====
const codeInputRef = ref<{ focus: () => void } | null>(null)
const nameInputRef = ref<{ focus: () => void } | null>(null)

// ===== 事件處理 =====

const handleFieldErrors = (fieldErrors: FieldError[]) => {
  console.log('handleFieldErrors 被呼叫, 收到的錯誤:', fieldErrors)

  // 清空現有錯誤
  errors.value = {
    code: '',
    name: '',
  }

  // 欄位名稱對應表 (後端 -> 前端)
  const fieldMap: Record<string, keyof typeof errors.value> = {
    code: 'code',
    name: 'name',
  }

  // Ref 對應表 (後端欄位名稱 -> Ref)
  const fieldRefMap: Record<string, typeof codeInputRef> = {
    code: codeInputRef,
    name: nameInputRef,
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
  const fieldOrder = ['code', 'name']

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

/**
 * 取消按鈕
 * 返回帳號管理列表
 */
const handleCancel = () => {
  router.push('/settings/modules')
}

const handleConfirm = async () => {
  errors.value = {
    code: '',
    name: '',
  }

  // 開始提交
  isSubmitting.value = true

  try {
    // 準備提交的資料
    const requestData: CreateModuleRequest = {
      code: formData.value.code,
      name: formData.value.name,
    }

    // 呼叫 API：成功不回資料，失敗會丟 ApiError
    await moduleService.createModule(requestData)

    // 成功：返回列表頁面
    router.push('/settings/modules?success=新增成功')
  } catch (err: unknown) {
    console.error('新增模組時發生錯誤:', err)

    if (err instanceof ApiError) {
      // 後端欄位驗證錯誤
      if (err.code === 'VALIDATION_ERROR' && err.data) {
        const fieldErrors = err.data as FieldError[]
        handleFieldErrors(fieldErrors)
        return
      }

      // 模組已存在
      if (err.code === 'MODULE_002') {
        errors.value.code = err.message
        codeInputRef.value?.focus()
        return
      }

      // 其他業務錯誤
      alert(err.message || '新增模組時發生錯誤,請稍後再試')
    } else {
      // 非預期錯誤（例如網路問題）
      alert('新增模組時發生錯誤,請稍後再試')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped></style>
