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
          label="中文名稱"
          placeholder="請輸入"
          :required="fieldRequired.name"
          :error-message="errors.name"
        />

        <FormInput
          ref="sqlFileInputRef"
          v-model="formData.sqlFile"
          label="SQL檔名"
          placeholder="請輸入"
          :required="fieldRequired.name"
          :error-message="errors.name"
        />

        <FormInput
          ref="descriptionInputRef"
          v-model="formData.description"
          label="SQL檔名"
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

const router = useRouter()

const isSubmitting = ref(false)

// ===== 表單資料 =====
const formData = ref({
  code: '',
  name: '',
  sqlFile: '',
  description: '',
})

// ===== 欄位是否必填 =====
const fieldRequired = {
  code: false,
  name: false,
  sqlFile: false,
  description: false,
}

const errors = ref({
  code: '',
  name: '',
  sqlFile: '',
  description: '',
})

// ===== Template Refs =====
const codeInputRef = ref<{ focus: () => void } | null>(null)
const nameInputRef = ref<{ focus: () => void } | null>(null)
const sqlFileInputRef = ref<{ focus: () => void } | null>(null)
const descriptionInputRef = ref<{ focus: () => void } | null>(null)

// ===== 事件處理 =====

/**
 * 取消按鈕
 * 返回帳號管理列表
 */
const handleCancel = () => {
  router.push('/settings/industries')
}

const handleConfirm = async () => {}
</script>

<style scoped></style>
