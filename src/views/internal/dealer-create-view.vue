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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/components/common/page-title.vue'
import FormSection from '@/components/form/form-section.vue'
import FormInput from '@/components/form/form-input.vue'
import FormSelect from '@/components/form/form-select.vue'
import FormButtonGroup from '@/components/form/form-button-group.vue'

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
  code: true,
  name: true,
  sales: true,
  contactPerson: true,
  contactPhone: true,
  email: true,
  address: true,
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

const salesOptions = [
  { label: '陳奶輪', value: 'kevin' },
  { label: '猴靜安', value: 'andy' },
  { label: '王責剩', value: 'kelvin' },
  { label: '黃剩父', value: 'max' },
  { label: '無信溶', value: 'richard' },
]

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
 * 取消按鈕
 * 返回經銷商設定列表
 */
const handleCancel = () => {
  router.push('/settings/dealers')
}

const handleConfirm = async () => {}
</script>

<style scoped></style>
