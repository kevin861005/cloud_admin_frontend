<template>
  <div class="flex h-full min-h-0 flex-1 flex-col">
    <!-- 載入狀態 -->
    <Loading v-if="isLoading" message="載入資料中..." :show-spinner="true" />

    <!-- 錯誤狀態 -->
    <Alert v-else-if="loadError" type="error" title="載入失敗" :description="loadError" />

    <!-- 編輯表單 -->
    <template v-else>
      <!-- 頁面標題 -->
      <PageTitle title="修改資料" />

      <!-- 主要容器 -->
      <div class="flex min-h-0 flex-1 flex-col gap-2 pb-10 pl-10 pr-10">
        <!-- Tab 導航區塊 -->
        <div class="flex-shrink-0 bg-gray-50">
          <EditTabNav :tabs="tabs" :active-tab="activeTab" @tab-click="handleTabClick" />
        </div>

        <!-- 表單區塊（只有這裡滾動） -->
        <div
          class="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-lg bg-white px-5 py-6 shadow-md"
        >
          <!-- 業務與內部管理 -->
          <div ref="businessSectionRef" class="flex scroll-mt-4 flex-col gap-3 pb-5">
            <FormSectionTitle
              title="業務與內部管理"
              :is-highlighted="highlightedSection === 'business'"
            />
            <div class="grid grid-cols-3 gap-5">
              <FormSelect
                ref="salesPersonIdRef"
                v-model="formData.salesPersonId"
                label="負責業務"
                :options="salesOptions"
                placeholder="請選擇"
                :error-message="errors.salesPersonId"
              />
              <FormSelect
                ref="dealerIdRef"
                v-model="formData.dealerId"
                label="經銷商"
                :options="dealerOptions"
                placeholder="請選擇"
                :error-message="errors.dealerId"
              />
              <!-- 第三欄留空 -->
              <div></div>
            </div>
          </div>

          <!-- 公司基本資料 -->
          <div ref="companySectionRef" class="flex scroll-mt-4 flex-col gap-3 pb-5">
            <FormSectionTitle
              title="公司基本資料"
              :is-highlighted="highlightedSection === 'company'"
            />
            <div class="grid grid-cols-3 gap-5">
              <FormSelect
                ref="industryIdRef"
                v-model="formData.industryId"
                label="產業別"
                :options="industryOptions"
                placeholder="請選擇"
                :required="false"
                :error-message="errors.industryId"
              />
              <FormInput
                ref="taxIdRef"
                v-model="formData.taxId"
                label="統一編號"
                placeholder="請輸入"
                :required="false"
                :error-message="errors.taxId"
              />
              <FormInput
                ref="nameChtRef"
                v-model="formData.nameCht"
                label="中文名稱"
                placeholder="請輸入"
                :required="false"
                :error-message="errors.nameCht"
              />
            </div>

            <div class="grid grid-cols-3 gap-5">
              <FormInput
                ref="nameEngRef"
                v-model="formData.nameEng"
                label="英文名稱"
                placeholder="請輸入"
                :error-message="errors.nameEng"
              />
              <FormInput
                ref="shortNameChtRef"
                v-model="formData.shortNameCht"
                label="中文簡稱"
                placeholder="請輸入"
                :required="false"
                :error-message="errors.shortNameCht"
              />
              <FormInput
                ref="shortNameEngRef"
                v-model="formData.shortNameEng"
                label="英文簡稱"
                placeholder="選填"
                :error-message="errors.shortNameEng"
              />
            </div>

            <div class="grid grid-cols-3 gap-5">
              <!-- 郵遞區號 + 地址 合併佔前兩欄 -->
              <div class="col-span-2 flex gap-5">
                <!-- 郵遞區號較窄 -->
                <div class="w-1/4">
                  <FormInput
                    ref="postalCodeRef"
                    v-model="formData.postalCode"
                    label="郵遞區號"
                    placeholder="請輸入"
                    :error-message="errors.postalCode"
                  />
                </div>
                <!-- 地址填滿剩餘空間 -->
                <div class="flex-1">
                  <FormInput
                    ref="addressRef"
                    v-model="formData.address"
                    label="地址"
                    placeholder="請輸入"
                    :error-message="errors.address"
                  />
                </div>
              </div>
              <!-- 國籍對齊第三欄 -->
              <FormInput
                ref="nationalityRef"
                v-model="formData.nationality"
                label="國籍"
                placeholder="選填"
                :error-message="errors.nationality"
              />
            </div>
          </div>

          <!-- 聯絡人資訊 -->
          <div ref="contactSectionRef" class="flex scroll-mt-4 flex-col gap-3 pb-5">
            <FormSectionTitle
              title="聯絡人資訊"
              :is-highlighted="highlightedSection === 'contact'"
            />
            <div class="grid grid-cols-3 gap-5">
              <FormInput
                ref="contactPersonRef"
                v-model="formData.contactPerson"
                label="聯絡人"
                placeholder="請輸入"
                :error-message="errors.contactPerson"
              />
              <FormInput
                ref="phoneRef"
                v-model="formData.phone"
                label="電話"
                placeholder="請輸入"
                :error-message="errors.phone"
              />
              <FormInput
                ref="mobileRef"
                v-model="formData.mobile"
                label="手機"
                placeholder="請輸入"
                :error-message="errors.mobile"
              />
            </div>

            <div class="grid grid-cols-3 gap-5">
              <FormInput
                ref="emailRef"
                v-model="formData.email"
                label="電子郵件"
                placeholder="請輸入"
                :error-message="errors.email"
              />
              <FormInput
                ref="lineIdRef"
                v-model="formData.lineId"
                label="LINE ID"
                placeholder="選填"
                :error-message="errors.lineId"
              />
              <!-- 第三欄留空 -->
              <div></div>
            </div>
          </div>

          <!-- 合約資訊 -->
          <div ref="contractSectionRef" class="flex scroll-mt-4 flex-col gap-3 pb-5">
            <FormSectionTitle
              title="合約資訊"
              :is-highlighted="highlightedSection === 'contract'"
            />
            <div class="grid grid-cols-3 gap-5">
              <FormDatepicker
                ref="contractStartDateRef"
                v-model="formData.contractStartDate"
                label="合約起日"
                placeholder="請選擇日期"
                :error-message="errors.contractStartDate"
              />
              <FormDatepicker
                ref="contractEndDateRef"
                v-model="formData.contractEndDate"
                label="合約迄日"
                placeholder="請選擇日期"
                :error-message="errors.contractEndDate"
              />
              <!-- 第三欄留空 -->
              <div></div>
            </div>
          </div>

          <!-- 勞健保及其他 -->
          <div ref="insuranceSectionRef" class="flex scroll-mt-4 flex-col gap-3 pb-5">
            <FormSectionTitle
              title="勞健保及其他"
              :is-highlighted="highlightedSection === 'insurance'"
            />
            <div class="grid grid-cols-3 gap-5">
              <FormInput
                ref="laborInsuranceNoRef"
                v-model="formData.laborInsuranceNo"
                label="勞保證號"
                placeholder="請輸入"
                :error-message="errors.laborInsuranceNo"
              />
              <FormInput
                ref="healthInsuranceNoRef"
                v-model="formData.healthInsuranceNo"
                label="健保證號"
                placeholder="請輸入"
                :error-message="errors.healthInsuranceNo"
              />
              <FormInput
                ref="laborPensionSupervisionNoRef"
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
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { Alert, Loading, PageTitle } from "@/components/common";
import {
  FormSelect,
  FormInput,
  FormDatepicker,
  FormSectionTitle,
  FormButtonGroup,
} from "@/components/form";
import EditTabNav from "@/components/customer/edit/edit-tab-nav.vue";
import DialogLeaveConfirm from "@/components/customer/edit/dialog-leave-confirm.vue";
import { customerService } from "@/services/customer.service";
import { selectOptionService } from "@/services/select-option.service";
import type { UpdateCustomerRequest } from "@/types/customer";
import type { FieldError, SelectOption } from "@/types/common";
import { ApiError } from "@/types/common";
import { processFieldErrors } from "@/utils/form";

/**
 * 客戶資料編輯頁面
 */

const route = useRoute();
const router = useRouter();

// ===== Tab 配置 =====
const tabs = [
  { key: "business", label: "業務與內部管理" },
  { key: "company", label: "公司基本資料" },
  { key: "contact", label: "聯絡人資訊" },
  { key: "contract", label: "合約資訊" },
  { key: "insurance", label: "勞健保及其他" },
];

// ===== 狀態管理 =====
const isLoading = ref(true);
const loadError = ref<string | null>(null);
const isSubmitting = ref(false);
const activeTab = ref("business");
const highlightedSection = ref<string | null>(null);
const showLeaveDialog = ref(false);
const isConfirmedLeave = ref(false);

// ===== Section Refs =====
const businessSectionRef = ref<HTMLDivElement | null>(null);
const companySectionRef = ref<HTMLDivElement | null>(null);
const contactSectionRef = ref<HTMLDivElement | null>(null);
const contractSectionRef = ref<HTMLDivElement | null>(null);
const insuranceSectionRef = ref<HTMLDivElement | null>(null);

// ===== 下拉選單選項 =====
const salesOptions = ref<SelectOption[]>([]);
const dealerOptions = ref<SelectOption[]>([]);
const industryOptions = ref<SelectOption[]>([]);

// ===== Template Refs（用於 focus）=====
const salesPersonIdRef = ref<{ focus: () => void } | null>(null);
const dealerIdRef = ref<{ focus: () => void } | null>(null);
const industryIdRef = ref<{ focus: () => void } | null>(null);
const taxIdRef = ref<{ focus: () => void } | null>(null);
const nameChtRef = ref<{ focus: () => void } | null>(null);
const nameEngRef = ref<{ focus: () => void } | null>(null);
const shortNameChtRef = ref<{ focus: () => void } | null>(null);
const shortNameEngRef = ref<{ focus: () => void } | null>(null);
const postalCodeRef = ref<{ focus: () => void } | null>(null);
const addressRef = ref<{ focus: () => void } | null>(null);
const nationalityRef = ref<{ focus: () => void } | null>(null);
const contactPersonRef = ref<{ focus: () => void } | null>(null);
const phoneRef = ref<{ focus: () => void } | null>(null);
const mobileRef = ref<{ focus: () => void } | null>(null);
const emailRef = ref<{ focus: () => void } | null>(null);
const lineIdRef = ref<{ focus: () => void } | null>(null);
const contractStartDateRef = ref<{ focus: () => void } | null>(null);
const contractEndDateRef = ref<{ focus: () => void } | null>(null);
const laborInsuranceNoRef = ref<{ focus: () => void } | null>(null);
const healthInsuranceNoRef = ref<{ focus: () => void } | null>(null);
const laborPensionSupervisionNoRef = ref<{ focus: () => void } | null>(null);

// ===== 表單資料 =====
const formData = reactive({
  salesPersonId: null as string | null,
  dealerId: null as string | null,
  industryId: null as string | null,
  taxId: "",
  nameCht: "",
  nameEng: "",
  shortNameCht: "",
  shortNameEng: "",
  postalCode: "",
  address: "",
  nationality: "",
  contactPerson: "",
  phone: "",
  mobile: "",
  email: "",
  lineId: "",
  contractStartDate: "",
  contractEndDate: "",
  laborInsuranceNo: "",
  healthInsuranceNo: "",
  laborPensionSupervisionNo: "",
});

// ===== 原始資料（用於比對是否有修改）=====
const originalData = ref<string>("");

// ===== 錯誤訊息 =====
const errors = ref({
  salesPersonId: "",
  dealerId: "",
  industryId: "",
  taxId: "",
  nameCht: "",
  nameEng: "",
  shortNameCht: "",
  shortNameEng: "",
  postalCode: "",
  address: "",
  nationality: "",
  contactPerson: "",
  phone: "",
  mobile: "",
  email: "",
  lineId: "",
  contractStartDate: "",
  contractEndDate: "",
  laborInsuranceNo: "",
  healthInsuranceNo: "",
  laborPensionSupervisionNo: "",
});

// ===== 計算屬性 =====

/**
 * 客戶編號（從路由取得）
 */
const customerNo = computed(() => {
  const idParam = route.params.id;
  return (Array.isArray(idParam) ? idParam[0] : idParam) || "";
});

/**
 * 表單是否有修改
 */
const isDirty = computed(() => {
  return JSON.stringify(formData) !== originalData.value;
});

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
    ]);

    salesOptions.value = sales;
    dealerOptions.value = dealers;
    industryOptions.value = industries;
  } catch (err) {
    console.error("載入下拉選單選項失敗:", err);
  }
}

/**
 * 載入客戶編輯資料
 */
async function loadCustomerData() {
  try {
    isLoading.value = true;
    loadError.value = null;

    const data = await customerService.getCustomerEditData(customerNo.value);

    // 填入表單資料
    formData.salesPersonId = data.salesPersonId;
    formData.dealerId = data.dealerId;
    formData.industryId = data.industryId;
    formData.taxId = data.taxId;
    formData.nameCht = data.nameCht;
    formData.nameEng = data.nameEng;
    formData.shortNameCht = data.shortNameCht;
    formData.shortNameEng = data.shortNameEng;
    formData.postalCode = data.postalCode;
    formData.address = data.address;
    formData.nationality = data.nationality;
    formData.contactPerson = data.contactPerson;
    formData.phone = data.phone;
    formData.mobile = data.mobile;
    formData.email = data.email;
    formData.lineId = data.lineId;
    formData.contractStartDate = data.contractStartDate;
    formData.contractEndDate = data.contractEndDate;
    formData.laborInsuranceNo = data.laborInsuranceNo;
    formData.healthInsuranceNo = data.healthInsuranceNo;
    formData.laborPensionSupervisionNo = data.laborPensionSupervisionNo;

    // 儲存原始資料
    originalData.value = JSON.stringify(formData);
  } catch (err) {
    console.error("載入客戶資料失敗:", err);
    loadError.value = err instanceof ApiError ? err.message : "載入失敗，請稍後再試";
  } finally {
    isLoading.value = false;
  }
}

/**
 * Tab 點擊處理
 */
// 在 function 外面定義 timer 變數
let highlightTimer: ReturnType<typeof setTimeout> | null = null;

function handleTabClick(key: string) {
  activeTab.value = key;

  // 取得對應的 section ref
  const sectionRefMap: Record<string, typeof businessSectionRef> = {
    business: businessSectionRef,
    company: companySectionRef,
    contact: contactSectionRef,
    contract: contractSectionRef,
    insurance: insuranceSectionRef,
  };

  const sectionRef = sectionRefMap[key];
  if (sectionRef?.value) {
    // 清除之前的 timer
    if (highlightTimer) {
      clearTimeout(highlightTimer);
      highlightTimer = null;
    }

    // 平滑滾動到該區塊
    sectionRef.value.scrollIntoView({ behavior: "smooth", block: "start" });

    // 立即顯示高亮
    highlightedSection.value = key;

    // 高亮持續 2 秒後消失
    highlightTimer = setTimeout(() => {
      highlightedSection.value = null;
    }, 2000);
  }
}

/**
 * 處理後端回傳的欄位錯誤
 * 將後端的欄位名稱對應到前端的錯誤訊息
 *
 * @param fieldErrors - 後端回傳的欄位錯誤列表
 */
const handleFieldErrors = (fieldErrors: FieldError[]) => {
  processFieldErrors(fieldErrors, {
    errors,
    fieldMap: {
      salesPersonId: "salesPersonId",
      dealerId: "dealerId",
      industryId: "industryId",
      taxId: "taxId",
      nameCht: "nameCht",
      nameEng: "nameEng",
      shortNameCht: "shortNameCht",
      shortNameEng: "shortNameEng",
      postalCode: "postalCode",
      address: "address",
      nationality: "nationality",
      contactPerson: "contactPerson",
      phone: "phone",
      mobile: "mobile",
      email: "email",
      lineId: "lineId",
      contractStartDate: "contractStartDate",
      contractEndDate: "contractEndDate",
      laborInsuranceNo: "laborInsuranceNo",
      healthInsuranceNo: "healthInsuranceNo",
      laborPensionSupervisionNo: "laborPensionSupervisionNo",
    },
    fieldRefMap: {
      salesPersonId: salesPersonIdRef,
      dealerId: dealerIdRef,
      industryId: industryIdRef,
      taxId: taxIdRef,
      nameCht: nameChtRef,
      nameEng: nameEngRef,
      shortNameCht: shortNameChtRef,
      shortNameEng: shortNameEngRef,
      postalCode: postalCodeRef,
      address: addressRef,
      nationality: nationalityRef,
      contactPerson: contactPersonRef,
      phone: phoneRef,
      mobile: mobileRef,
      email: emailRef,
      lineId: lineIdRef,
      contractStartDate: contractStartDateRef,
      contractEndDate: contractEndDateRef,
      laborInsuranceNo: laborInsuranceNoRef,
      healthInsuranceNo: healthInsuranceNoRef,
      laborPensionSupervisionNo: laborPensionSupervisionNoRef,
    },
    fieldOrder: [
      "salesPersonId",
      "dealerId",
      "industryId",
      "taxId",
      "nameCht",
      "nameEng",
      "shortNameCht",
      "shortNameEng",
      "postalCode",
      "address",
      "nationality",
      "contactPerson",
      "phone",
      "mobile",
      "email",
      "lineId",
      "contractStartDate",
      "contractEndDate",
      "laborInsuranceNo",
      "healthInsuranceNo",
      "laborPensionSupervisionNo",
    ],
  });
};

/**
 * 取消按鈕
 */
function handleCancel() {
  if (isDirty.value) {
    showLeaveDialog.value = true;
  } else {
    router.push(`/customers/${customerNo.value}/detail`);
  }
}

/**
 * 確認儲存
 */
async function handleConfirm() {
  // 清空所有錯誤訊息
  errors.value = {
    salesPersonId: "",
    dealerId: "",
    industryId: "",
    taxId: "",
    nameCht: "",
    nameEng: "",
    shortNameCht: "",
    shortNameEng: "",
    postalCode: "",
    address: "",
    nationality: "",
    contactPerson: "",
    phone: "",
    mobile: "",
    email: "",
    lineId: "",
    contractStartDate: "",
    contractEndDate: "",
    laborInsuranceNo: "",
    healthInsuranceNo: "",
    laborPensionSupervisionNo: "",
  };

  isSubmitting.value = true;

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
    };

    console.log("1. 準備呼叫 API");
    await customerService.updateCustomer(customerNo.value, requestData);
    console.log("2. API 呼叫成功");

    // 更新原始資料（避免返回時觸發離開確認）
    originalData.value = JSON.stringify(formData);

    // 設定已確認離開，避免觸發離開確認 dialog
    isConfirmedLeave.value = true;

    console.log("3. 準備跳轉");
    // 返回詳細頁，帶上成功訊息
    router.push(`/customers/${customerNo.value}/detail?success=修改成功`);
    console.log("4. 跳轉完成");
  } catch (err) {
    console.error("更新客戶資料失敗:", err);

    if (err instanceof ApiError) {
      if (err.code === "VALIDATION_ERROR" && err.data) {
        handleFieldErrors(err.data as FieldError[]);
        return;
      }
      alert(err.message || "更新失敗，請稍後再試");
    } else {
      alert("更新失敗，請稍後再試");
    }
  } finally {
    isSubmitting.value = false;
  }
}

/**
 * 確認離開
 */
function confirmLeave() {
  isConfirmedLeave.value = true;
  showLeaveDialog.value = false;
  router.push(`/customers/${customerNo.value}/detail`);
}

/**
 * 取消離開
 */
function cancelLeave() {
  isConfirmedLeave.value = false;
}

// ===== 路由守衛 =====
onBeforeRouteLeave((_to, _from, next) => {
  // 如果已確認離開，直接放行
  if (isConfirmedLeave.value) {
    next();
    return;
  }

  // 如果有未儲存的變更，顯示確認 dialog
  if (isDirty.value) {
    showLeaveDialog.value = true;
    next(false);
  } else {
    next();
  }
});

// ===== 瀏覽器關閉/重整確認 =====
function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (isDirty.value) {
    e.preventDefault();
    e.returnValue = "";
  }
}

// ===== 生命週期 =====
onMounted(async () => {
  window.addEventListener("beforeunload", handleBeforeUnload);
  await loadOptions();
  await loadCustomerData();
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});
</script>
