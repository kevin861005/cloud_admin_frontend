<template>
  <Drawer :is-open="isOpen" @close="handleClose">
    <!-- 載入狀態 -->
    <Loading v-if="isLoading" message="載入資料中..." :show-spinner="true" />

    <!-- 錯誤狀態 -->
    <Alert v-else-if="error" type="error" title="載入失敗" :description="error" />

    <!-- 資料顯示或編輯 -->
    <template v-else-if="dealerDetail">
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
              class="h-4 w-4 cursor-pointer"
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
        <div class="flex flex-col gap-3 overflow-x-hidden">
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
    </template>

    <!-- Toast 提示（固定在 Drawer 底部） -->
    <DrawerToast
      :is-visible="toast.isVisible"
      :type="toast.type"
      :message="toast.message"
      @close="hideToast"
    />
  </Drawer>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Drawer, DrawerHeader, DrawerToast, InfoSection, InfoField } from "@/components/drawer";
import { Alert, Divider, Loading } from "@/components/common";
import { FormSection, FormInput, FormSelect, FormButtonGroup } from "@/components/form";
import type { DealerDetailInfo, UpdateDealerRequest } from "@/types/dealer";
import type { FieldError, SelectOption } from "@/types/common";
import { dealerService } from "@/services/dealer.service";
import { selectOptionService } from "@/services/select-option.service";
import { ApiError } from "@/types/common";
import { useDrawerToast } from "@/composables/useDrawerToast";
import { processFieldErrors } from "@/utils/form";

/**
 * 使用者詳細資訊 Drawer
 * 支援查看與編輯模式
 */

interface Props {
  /**
   * 控制 Drawer 開關狀態
   */
  isOpen: boolean;

  /**
   * 經銷商代號
   */
  code: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /**
   * 關閉 Drawer
   */
  close: [];

  /**
   * 編輯按鈕點擊
   */
  edit: [];

  /**
   * 資料更新成功（用於通知父元件重新載入表格）
   */
  updated: [];
}>();

// ===== 狀態管理 =====

/**
 * 經銷商詳細資料
 */
const dealerDetail = ref<DealerDetailInfo | null>(null);

/**
 * 業務選項
 */
const salesOptions = ref<SelectOption[]>([]);

/**
 * 載入狀態
 */
const isLoading = ref(false);

/**
 * 錯誤訊息
 */
const error = ref<string | null>(null);

/**
 * 是否為編輯模式
 */
const isEditMode = ref(false);

/**
 * 提交中狀態
 */
const isSubmitting = ref(false);

// ===== Toast 狀態 =====
const { toast, showToast, hideToast, resetToast } = useDrawerToast();

// ===== 表單資料 =====

/**
 * 表單資料
 */
const formData = ref({
  name: "",
  sales: "",
  contactPerson: "",
  contactPhone: "",
  email: "",
  address: "",
  description: "",
});

/**
 * 表單錯誤訊息
 */
const errors = ref({
  name: "",
  sales: "",
  contactPerson: "",
  contactPhone: "",
  email: "",
  address: "",
  description: "",
});

// ===== Template Refs =====
const nameInputRef = ref<{ focus: () => void } | null>(null);
const salesInputRef = ref<{ focus: () => void } | null>(null);
const contactPersonInputRef = ref<{ focus: () => void } | null>(null);
const contactPhoneInputRef = ref<{ focus: () => void } | null>(null);
const emailInputRef = ref<{ focus: () => void } | null>(null);
const addressInputRef = ref<{ focus: () => void } | null>(null);
const descriptionInputRef = ref<{ focus: () => void } | null>(null);

// ===== 選項資料 =====

/**
 * 建立者顯示文字
 */
const createdByText = computed(() => {
  if (!dealerDetail.value || !dealerDetail.value.createdBy) return "-";
  return dealerDetail.value.createdBy.name;
});

// ===== 方法 =====

/**
 * 載入經銷商詳細資料
 */
const loadDealerDetail = async () => {
  if (!props.code) return;

  isLoading.value = true;
  error.value = null;
  dealerDetail.value = null;

  try {
    dealerDetail.value = await dealerService.getDealerDetail(props.code);
  } catch (err) {
    console.error("載入經銷商詳細資料錯誤:", err);
    error.value = err instanceof ApiError ? err.message : "發生未知錯誤，請稍後再試";
  } finally {
    isLoading.value = false;
  }
};

/**
 * 載入業務選項
 */
const loadSaleOptions = async () => {
  try {
    salesOptions.value = await selectOptionService.getSalesOptions();
    console.log("業務選項載入成功:", salesOptions.value);
  } catch (err) {
    console.error("載入業務選項錯誤:", err);
    salesOptions.value = [];
  }
};

/**
 * 初始化表單資料
 */
const initFormData = () => {
  if (!dealerDetail.value) return;

  formData.value = {
    name: dealerDetail.value.name,
    sales: dealerDetail.value.sales.id,
    contactPerson: dealerDetail.value.contactPerson,
    contactPhone: dealerDetail.value.contactPhone,
    email: dealerDetail.value.email,
    address: dealerDetail.value.address,
    description: dealerDetail.value.description,
  };

  // 清空錯誤訊息
  errors.value = {
    name: "",
    sales: "",
    contactPerson: "",
    contactPhone: "",
    email: "",
    address: "",
    description: "",
  };
};

/**
 * 處理關閉 Drawer
 */
const handleClose = () => {
  // 如果在編輯模式，先退出編輯模式
  if (isEditMode.value) {
    isEditMode.value = false;
  }
  // 關閉 Toast
  resetToast();
  emit("close");
};

/**
 * 處理編輯按鈕點擊
 */
const handleEdit = async () => {
  // 先載入業務選項
  await loadSaleOptions();

  // 初始化表單資料
  initFormData();

  // 切換到編輯模式
  isEditMode.value = true;

  emit("edit");
};

/**
 * 處理取消編輯
 */
const handleCancelEdit = () => {
  // 退出編輯模式
  isEditMode.value = false;
};

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
      name: "name",
      sales: "sales",
      contactPerson: "contactPerson",
      contactPhone: "contactPhone",
      email: "email",
      address: "address",
      description: "description",
    },
    fieldRefMap: {
      name: nameInputRef,
      sales: salesInputRef,
      contactPerson: contactPersonInputRef,
      contactPhone: contactPhoneInputRef,
      email: emailInputRef,
      address: addressInputRef,
      description: descriptionInputRef,
    },
    fieldOrder: [
      "name",
      "sales",
      "contactPerson",
      "contactPhone",
      "email",
      "address",
      "description",
    ],
  });
};

/**
 * 檢查是否為欄位錯誤陣列
 */
const isFieldErrorArray = (data: unknown): data is FieldError[] => {
  if (!Array.isArray(data)) return false;
  if (data.length === 0) return true;
  return (
    typeof data[0] === "object" && data[0] !== null && "field" in data[0] && "message" in data[0]
  );
};

/**
 * 處理確認編輯
 */
const handleConfirmEdit = async () => {
  if (!props.code) return;

  console.log("表單資料:", formData.value);

  // 清空所有錯誤訊息
  errors.value = {
    name: "",
    sales: "",
    contactPerson: "",
    contactPhone: "",
    email: "",
    address: "",
    description: "",
  };

  // 開始提交
  isSubmitting.value = true;

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
    };

    // 呼叫更新 API：成功就回 DealerDetailInfo，失敗會丟 ApiError
    const updatedDealer = await dealerService.updateDealer(props.code, requestData);

    console.log("updateDealer API 回應:", updatedDealer);

    // 更新成功
    showToast("success", "異動成功");

    // 更新本地的 dealerDetail 資料
    dealerDetail.value = updatedDealer;

    // 退出編輯模式
    isEditMode.value = false;

    // 發出 updated 事件通知父元件
    emit("updated");
  } catch (err: unknown) {
    console.error("進入 catch 區塊:", err);

    if (err instanceof ApiError) {
      // 1. 欄位驗證錯誤（例如 VALIDATION_ERROR）
      if (err.code === "VALIDATION_ERROR" && err.data && isFieldErrorArray(err.data)) {
        console.log("進入欄位錯誤處理 (catch 區塊)");
        handleFieldErrors(err.data);
        return;
      }

      // 2. 其他業務錯誤
      showToast("error", err.message || "儲存失敗，請重新嘗試");
    } else {
      // 非預期錯誤（像網路異常或程式 bug）
      console.log("非 ApiError 錯誤");
      showToast("error", "儲存失敗，請重新嘗試");
    }
  } finally {
    isSubmitting.value = false;
  }
};

// ===== 監聽 =====

/**
 * 監聯 Drawer 開啟狀態
 * 當 Drawer 開啟且有 code 時，載入經銷商詳細資料
 */
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.code) {
      // 重置編輯模式
      isEditMode.value = false;
      // 關閉 Toast
      resetToast();
      // 載入資料
      loadDealerDetail();
    }
  },
  { immediate: true }
);
</script>
