<template>
  <PageTitle title="新增產業別" />

  <!-- 主要容器 -->
  <div class="flex gap-5 px-10">
    <!-- 填寫資料區域 -->
    <div class="flex flex-col w-full gap-3 px-5 py-6 rounded-xl bg-white shadow-md">
      <FormSection>
        <FormInput
          ref="codeInputRef"
          v-model="formData.code"
          label="編號"
          placeholder="請輸入"
          :required="fieldRequired.code"
          :error-message="errors.code"
        />

        <FormInput
          ref="nameInputRef"
          v-model="formData.name"
          label="經銷商名稱"
          placeholder="請輸入"
          :required="fieldRequired.name"
          :error-message="errors.name"
        />

        <FormSelect
          ref="salesInputRef"
          label="負責業務"
          v-model="formData.sales"
          :options="salesOptions"
          :required="true"
          :error-message="errors.sales"
          placeholder="請選擇業務"
        />
      </FormSection>

      <Divider />

      <FormSection title="詳細資訊">
        <FormInput
          ref="contactPersonInputRef"
          v-model="formData.contactPerson"
          label="聯絡人"
          placeholder="請輸入"
          :required="fieldRequired.contactPerson"
          :error-message="errors.contactPerson"
        />

        <FormInput
          ref="contactPhoneInputRef"
          v-model="formData.contactPhone"
          label="連絡電話"
          placeholder="請輸入"
          :required="fieldRequired.contactPhone"
          :error-message="errors.contactPhone"
        />

        <FormInput
          ref="emailInputRef"
          v-model="formData.email"
          label="電子信箱"
          placeholder="請輸入"
          :required="fieldRequired.email"
          :error-message="errors.email"
        />

        <FormInput
          ref="addressInputRef"
          v-model="formData.address"
          label="地址"
          placeholder="請輸入"
          :required="fieldRequired.address"
          :error-message="errors.address"
        />

        <FormInput
          ref="descriptionInputRef"
          v-model="formData.description"
          label="說明（選填）"
          placeholder="請輸入"
          :required="fieldRequired.description"
          :error-message="errors.description"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/components/common/page-title.vue'
import FormSection from '@/components/form/form-section.vue'
import FormInput from '@/components/form/form-input.vue'
import FormSelect from '@/components/form/form-select.vue'
import FormButtonGroup from '@/components/form/form-button-group.vue'
import type { CreateDealerRequest } from '@/types/dealer'
import type { SaleListItem } from '@/types/user'
import type { FieldError } from '@/types/common'
import { dealerService } from '@/services/dealer.service'
import { userService } from '@/services/user.service'
import { ApiError } from '@/types/common'

const router = useRouter()

const isSubmitting = ref(false)

// ===== 表單資料 =====
const formData = ref({
  code: '',
  name: '',
  sales: '',
  contactPerson: '',
  contactPhone: '',
  email: '',
  address: '',
  description: '',
})

// ===== 欄位是否必填 =====
const fieldRequired = {
  code: false,
  name: false,
  sales: false,
  contactPerson: false,
  contactPhone: false,
  email: false,
  address: false,
  description: false,
}

const errors = ref({
  code: '',
  name: '',
  sales: '',
  contactPerson: '',
  contactPhone: '',
  email: '',
  address: '',
  description: '',
})

// ===== 生命週期 =====

onMounted(() => {
  loadSaleOptions()
})

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

// ===== Template Refs =====
const codeInputRef = ref<{ focus: () => void } | null>(null)
const nameInputRef = ref<{ focus: () => void } | null>(null)
const salesInputRef = ref<{ focus: () => void } | null>(null)
const contactPersonInputRef = ref<{ focus: () => void } | null>(null)
const contactPhoneInputRef = ref<{ focus: () => void } | null>(null)
const emailInputRef = ref<{ focus: () => void } | null>(null)
const addressInputRef = ref<{ focus: () => void } | null>(null)
const descriptionInputRef = ref<{ focus: () => void } | null>(null)

// ===== 事件處理 =====

/**
 * 載入權限選項
 */
const loadSaleOptions = async () => {
  try {
    // 直接取得業務清單
    const sales = await userService.getAllSales()

    salesList.value = sales
    console.log('業務選項載入成功:', salesList.value)
  } catch (err) {
    console.error('載入業務選項錯誤:', err)

    // fallback
    salesList.value = []
  }
}

const handleFieldErrors = (fieldErrors: FieldError[]) => {
  console.log('handleFieldErrors 被呼叫, 收到的錯誤:', fieldErrors)

  // 清空現有錯誤
  errors.value = {
    code: '',
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
    code: 'code',
    name: 'name',
    sales: 'sales',
    contactPerson: 'contactPerson',
    contactPhone: 'contactPhone',
    email: 'email',
    address: 'address',
    description: 'description',
  }

  // Ref 對應表 (後端欄位名稱 -> Ref)
  const fieldRefMap: Record<string, typeof codeInputRef> = {
    code: codeInputRef,
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
    'code',
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
 * 返回經銷商設定列表
 */
const handleCancel = () => {
  router.push('/settings/dealers')
}

const handleConfirm = async () => {
  // 先清空欄位錯誤
  errors.value = {
    code: '',
    name: '',
    sales: '',
    contactPerson: '',
    contactPhone: '',
    email: '',
    address: '',
    description: '',
  }

  isSubmitting.value = true

  try {
    const requestData: CreateDealerRequest = {
      code: formData.value.code,
      name: formData.value.name,
      sales: formData.value.sales,
      contactPerson: formData.value.contactPerson,
      contactPhone: formData.value.contactPhone,
      email: formData.value.email,
      address: formData.value.address,
      description: formData.value.description,
    }

    // 成功就不會丟錯
    await dealerService.createDealer(requestData)

    // 成功：回列表
    router.push('/settings/dealers?success=新增成功')
  } catch (error) {
    console.error('新增經銷商時發生錯誤:', error)

    if (error instanceof ApiError) {
      // 後端欄位驗證錯誤
      if (error.code === 'VALIDATION_ERROR' && error.data) {
        const fieldErrors = error.data as FieldError[]
        handleFieldErrors(fieldErrors)
        return
      }

      // 經銷商已存在
      if (error.code === 'DEALER_002') {
        errors.value.code = error.message
        codeInputRef.value?.focus()
        return
      }

      // 其他業務錯誤
      alert(error.message || '新增經銷商時發生錯誤,請稍後再試')
      return
    }

    // 非預期錯誤（像網路異常、程式 bug）
    alert('新增經銷商時發生錯誤,請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped></style>
