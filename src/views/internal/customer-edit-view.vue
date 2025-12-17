<template>
  <div class="flex h-full flex-col">
    <!-- 載入狀態 -->
    <Loading v-if="isLoading" message="載入資料中..." :show-spinner="true" />

    <!-- 錯誤狀態 -->
    <Alert v-else-if="loadError" type="error" title="載入失敗" :description="loadError" />

    <!-- 編輯表單 -->
    <template v-else>
      <!-- 頁面標題 -->
      <PageTitle title="修改資料" />

      <!-- 主要容器 -->
      <div class="flex-1 overflow-y-auto px-10 pb-10">
        <!-- Tab 導航 -->
        <div class="sticky top-0 z-10 bg-gray-50 py-4">
          <EditTabNav :tabs="tabs" :active-tab="activeTab" @tab-click="handleTabClick" />
        </div>

        <!-- 表單容器 -->
        <div class="rounded-xl bg-white px-5 py-6 shadow-md">
          <!-- 業務與內部管理 -->
          <div ref="businessSectionRef" class="mb-6">
            <FormSectionTitle
              title="業務與內部管理"
              :is-highlighted="highlightedSection === 'business'"
            />
            <div class="grid grid-cols-2 gap-x-6 gap-y-4">
              <FormSelect
                v-model="formData.salesPersonId"
                label="負責業務"
                :options="salesOptions"
                placeholder="請選擇"
                :error-message="errors.salesPersonId"
              />
              <FormSelect
                v-model="formData.dealerId"
                label="經銷商"
                :options="dealerOptions"
                placeholder="請選擇"
                :error-message="errors.dealerId"
              />
            </div>
          </div>

          <Divider class="my-6" />

          <!-- 公司基本資料 -->
          <div ref="companySectionRef" class="mb-6">
            <FormSectionTitle
              title="公司基本資料"
              :is-highlighted="highlightedSection === 'company'"
            />
            <div class="grid grid-cols-3 gap-x-6 gap-y-4">
              <FormSelect
                v-model="formData.industryId"
                label="產業別"
                :options="industryOptions"
                placeholder="請選擇"
                :required="true"
                :error-message="errors.industryId"
              />
              <FormInput
                v-model="formData.taxId"
                label="統一編號"
                placeholder="請輸入"
                :required="true"
                :error-message="errors.taxId"
              />
              <FormInput
                v-model="formData.nameCht"
                label="中文名稱"
                placeholder="請輸入"
                :required="true"
                :error-message="errors.nameCht"
              />
              <FormInput
                v-model="formData.nameEng"
                label="英文名稱"
                placeholder="請輸入"
                :error-message="errors.nameEng"
              />
              <FormInput
                v-model="formData.shortNameCht"
                label="中文簡稱"
                placeholder="請輸入"
                :required="true"
                :error-message="errors.shortNameCht"
              />
              <FormInput
                v-model="formData.shortNameEng"
                label="英文簡稱"
                placeholder="選填"
                :error-message="errors.shortNameEng"
              />
              <FormInput
                v-model="formData.postalCode"
                label="郵遞區號"
                placeholder="請輸入"
                :error-message="errors.postalCode"
              />
              <div class="col-span-2">
                <FormInput
                  v-model="formData.address"
                  label="地址"
                  placeholder="請輸入"
                  :error-message="errors.address"
                />
              </div>
              <FormInput
                v-model="formData.nationality"
                label="國籍"
                placeholder="選填"
                :error-message="errors.nationality"
              />
            </div>
          </div>

          <Divider class="my-6" />

          <!-- 聯絡人資訊 -->
          <div ref="contactSectionRef" class="mb-6">
            <FormSectionTitle
              title="聯絡人資訊"
              :is-highlighted="highlightedSection === 'contact'"
            />
            <div class="grid grid-cols-3 gap-x-6 gap-y-4">
              <FormInput
                v-model="formData.contactPerson"
                label="聯絡人"
                placeholder="請輸入"
                :error-message="errors.contactPerson"
              />
              <FormInput
                v-model="formData.phone"
                label="電話"
                placeholder="請輸入"
                :error-message="errors.phone"
              />
              <FormInput
                v-model="formData.mobile"
                label="手機"
                placeholder="請輸入"
                :error-message="errors.mobile"
              />
              <FormInput
                v-model="formData.email"
                label="電子信箱"
                type="email"
                placeholder="請輸入"
                :error-message="errors.email"
              />
              <FormInput
                v-model="formData.lineId"
                label="LineID"
                placeholder="選填"
                :error-message="errors.lineId"
              />
            </div>
          </div>

          <Divider class="my-6" />

          <!-- 合約資訊 -->
          <div ref="contractSectionRef" class="mb-6">
            <FormSectionTitle
              title="合約資訊"
              :is-highlighted="highlightedSection === 'contract'"
            />
            <div class="grid grid-cols-2 gap-x-6 gap-y-4">
              <FormDatepicker
                v-model="formData.contractStartDate"
                label="合約起日"
                placeholder="請選擇日期"
                :error-message="errors.contractStartDate"
              />
              <FormDatepicker
                v-model="formData.contractEndDate"
                label="合約迄日"
                placeholder="請選擇日期"
                :error-message="errors.contractEndDate"
              />
            </div>
          </div>

          <Divider class="my-6" />

          <!-- 勞健保及其他 -->
          <div ref="insuranceSectionRef" class="mb-6">
            <FormSectionTitle
              title="勞健保及其他"
              :is-highlighted="highlightedSection === 'insurance'"
            />
            <div class="grid grid-cols-3 gap-x-6 gap-y-4">
              <FormInput
                v-model="formData.laborInsuranceNo"
                label="勞保證號"
                placeholder="請輸入"
                :error-message="errors.laborInsuranceNo"
              />
              <FormInput
                v-model="formData.healthInsuranceNo"
                label="健保證號"
                placeholder="請輸入"
                :error-message="errors.healthInsuranceNo"
              />
              <FormInput
                v-model="formData.laborPensionSupervisionNo"
                label="勞退金監督管理委員會證號"
                placeholder="請輸入"
                :error-message="errors.laborPensionSupervisionNo"
              />
            </div>
          </div>

          <!-- 按鈕群組 -->
          <FormButtonGroup
            confirm-text="儲存"
            :disabled="isSubmitting"
            @cancel="handleCancel"
            @confirm="handleConfirm"
          />
        </div>
      </div>
    </template>

    <!-- 離開確認 Dialog -->
    <DialogLeaveConfirm v-model="showLeaveDialog" @confirm="confirmLeave" @cancel="cancelLeave" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import PageTitle from '@/components/common/page-title.vue'
import Divider from '@/components/common/divider.vue'
import Loading from '@/components/common/loading.vue'
import Alert from '@/components/common/alert.vue'
import FormInput from '@/components/form/form-input.vue'
import FormSelect from '@/components/form/form-select.vue'
import FormDatepicker from '@/components/form/form-datepicker.vue'
import FormButtonGroup from '@/components/form/form-button-group.vue'
import FormSectionTitle from '@/components/form/form-section-title.vue'
import EditTabNav from '@/components/customer/edit/edit-tab-nav.vue'
import DialogLeaveConfirm from '@/components/customer/edit/dialog-leave-confirm.vue'
import { customerService } from '@/services/customer.service'
import { selectOptionService } from '@/services/select-option.service'
import type { UpdateCustomerRequest } from '@/types/customer'
import type { FieldError, SelectOption } from '@/types/common'
import { ApiError } from '@/types/common'

/**
 * 客戶資料編輯頁面
 */

const route = useRoute()
const router = useRouter()

// ===== Tab 配置 =====
const tabs = [
  { key: 'business', label: '業務與內部管理' },
  { key: 'company', label: '公司基本資料' },
  { key: 'contact', label: '聯絡人資訊' },
  { key: 'contract', label: '合約資訊' },
  { key: 'insurance', label: '勞健保及其他' },
]

// ===== 狀態管理 =====
const isLoading = ref(true)
const loadError = ref<string | null>(null)
const isSubmitting = ref(false)
const activeTab = ref('business')
const highlightedSection = ref<string | null>(null)
const showLeaveDialog = ref(false)
const isConfirmedLeave = ref(false)

// ===== Section Refs =====
const businessSectionRef = ref<HTMLDivElement | null>(null)
const companySectionRef = ref<HTMLDivElement | null>(null)
const contactSectionRef = ref<HTMLDivElement | null>(null)
const contractSectionRef = ref<HTMLDivElement | null>(null)
const insuranceSectionRef = ref<HTMLDivElement | null>(null)

// ===== 下拉選單選項 =====
const salesOptions = ref<SelectOption[]>([])
const dealerOptions = ref<SelectOption[]>([])
const industryOptions = ref<SelectOption[]>([])

// ===== 表單資料 =====
const formData = reactive({
  salesPersonId: null as string | null,
  dealerId: null as string | null,
  industryId: null as string | null,
  taxId: '',
  nameCht: '',
  nameEng: '',
  shortNameCht: '',
  shortNameEng: '',
  postalCode: '',
  address: '',
  nationality: '',
  contactPerson: '',
  phone: '',
  mobile: '',
  email: '',
  lineId: '',
  contractStartDate: '',
  contractEndDate: '',
  laborInsuranceNo: '',
  healthInsuranceNo: '',
  laborPensionSupervisionNo: '',
})

// ===== 原始資料（用於比對是否有修改）=====
const originalData = ref<string>('')

// ===== 錯誤訊息 =====
const errors = reactive({
  salesPersonId: '',
  dealerId: '',
  industryId: '',
  taxId: '',
  nameCht: '',
  nameEng: '',
  shortNameCht: '',
  shortNameEng: '',
  postalCode: '',
  address: '',
  nationality: '',
  contactPerson: '',
  phone: '',
  mobile: '',
  email: '',
  lineId: '',
  contractStartDate: '',
  contractEndDate: '',
  laborInsuranceNo: '',
  healthInsuranceNo: '',
  laborPensionSupervisionNo: '',
})

// ===== 計算屬性 =====

/**
 * 客戶編號（從路由取得）
 */
const customerNo = computed(() => {
  const idParam = route.params.id
  return (Array.isArray(idParam) ? idParam[0] : idParam) || ''
})

/**
 * 表單是否有修改
 */
const isDirty = computed(() => {
  return JSON.stringify(formData) !== originalData.value
})

// ===== 方法 =====

/**
 * 載入下拉選單選項
 */
async function loadOptions() {
  try {
    const [sales, dealers, industries] = await Promise.all([
      selectOptionService.getSalesOptions(),
      selectOptionService.getDealerOptions(),
      selectOptionService.getIndustryOptions(),
    ])

    salesOptions.value = sales
    dealerOptions.value = dealers
    industryOptions.value = industries
  } catch (err) {
    console.error('載入下拉選單選項失敗:', err)
  }
}

/**
 * 載入客戶編輯資料
 */
async function loadCustomerData() {
  try {
    isLoading.value = true
    loadError.value = null

    const data = await customerService.getCustomerEditData(customerNo.value)

    // 填入表單資料
    formData.salesPersonId = data.salesPersonId
    formData.dealerId = data.dealerId
    formData.industryId = data.industryId
    formData.taxId = data.taxId
    formData.nameCht = data.nameCht
    formData.nameEng = data.nameEng
    formData.shortNameCht = data.shortNameCht
    formData.shortNameEng = data.shortNameEng
    formData.postalCode = data.postalCode
    formData.address = data.address
    formData.nationality = data.nationality
    formData.contactPerson = data.contactPerson
    formData.phone = data.phone
    formData.mobile = data.mobile
    formData.email = data.email
    formData.lineId = data.lineId
    formData.contractStartDate = data.contractStartDate
    formData.contractEndDate = data.contractEndDate
    formData.laborInsuranceNo = data.laborInsuranceNo
    formData.healthInsuranceNo = data.healthInsuranceNo
    formData.laborPensionSupervisionNo = data.laborPensionSupervisionNo

    // 儲存原始資料
    originalData.value = JSON.stringify(formData)
  } catch (err) {
    console.error('載入客戶資料失敗:', err)
    loadError.value = err instanceof ApiError ? err.message : '載入失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

/**
 * Tab 點擊處理
 */
function handleTabClick(key: string) {
  activeTab.value = key

  // 取得對應的 section ref
  const sectionRefMap: Record<string, typeof businessSectionRef> = {
    business: businessSectionRef,
    company: companySectionRef,
    contact: contactSectionRef,
    contract: contractSectionRef,
    insurance: insuranceSectionRef,
  }

  const sectionRef = sectionRefMap[key]
  if (sectionRef?.value) {
    // 平滑滾動到該區塊
    sectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })

    // 高亮區塊標題 2 秒
    highlightedSection.value = key
    setTimeout(() => {
      highlightedSection.value = null
    }, 2000)
  }
}

/**
 * 清空錯誤訊息
 */
function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })
}

/**
 * 處理後端欄位錯誤
 */
function handleFieldErrors(fieldErrors: FieldError[]) {
  clearErrors()

  fieldErrors.forEach((fieldError) => {
    const field = fieldError.field as keyof typeof errors
    if (field in errors) {
      errors[field] = fieldError.message
    }
  })
}

/**
 * 取消按鈕
 */
function handleCancel() {
  if (isDirty.value) {
    showLeaveDialog.value = true
  } else {
    router.push(`/customers/${customerNo.value}/detail`)
  }
}

/**
 * 確認儲存
 */
async function handleConfirm() {
  clearErrors()
  isSubmitting.value = true

  try {
    const requestData: UpdateCustomerRequest = {
      salesPersonId: formData.salesPersonId,
      dealerId: formData.dealerId,
      industryId: formData.industryId,
      taxId: formData.taxId,
      nameCht: formData.nameCht,
      nameEng: formData.nameEng,
      shortNameCht: formData.shortNameCht,
      shortNameEng: formData.shortNameEng,
      postalCode: formData.postalCode,
      address: formData.address,
      nationality: formData.nationality,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      mobile: formData.mobile,
      email: formData.email,
      lineId: formData.lineId,
      contractStartDate: formData.contractStartDate,
      contractEndDate: formData.contractEndDate,
      laborInsuranceNo: formData.laborInsuranceNo,
      healthInsuranceNo: formData.healthInsuranceNo,
      laborPensionSupervisionNo: formData.laborPensionSupervisionNo,
    }

    await customerService.updateCustomer(customerNo.value, requestData)

    // 更新原始資料（避免返回時觸發離開確認）
    originalData.value = JSON.stringify(formData)

    // 返回詳細頁
    router.push(`/customers/${customerNo.value}/detail`)
  } catch (err) {
    console.error('更新客戶資料失敗:', err)

    if (err instanceof ApiError) {
      if (err.code === 'VALIDATION_ERROR' && err.data) {
        handleFieldErrors(err.data as FieldError[])
        return
      }
      alert(err.message || '更新失敗，請稍後再試')
    } else {
      alert('更新失敗，請稍後再試')
    }
  } finally {
    isSubmitting.value = false
  }
}

/**
 * 確認離開
 */
function confirmLeave() {
  isConfirmedLeave.value = true
  showLeaveDialog.value = false
  router.push(`/customers/${customerNo.value}/detail`)
}

/**
 * 取消離開
 */
function cancelLeave() {
  isConfirmedLeave.value = false
}

// ===== 路由守衛 =====
onBeforeRouteLeave((_to, _from, next) => {
  // 如果已確認離開，直接放行
  if (isConfirmedLeave.value) {
    next()
    return
  }

  // 如果有未儲存的變更，顯示確認 dialog
  if (isDirty.value) {
    showLeaveDialog.value = true
    next(false)
  } else {
    next()
  }
})

// ===== 瀏覽器關閉/重整確認 =====
function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (isDirty.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

// ===== 生命週期 =====
onMounted(async () => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  await loadOptions()
  await loadCustomerData()
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>
