<template>
  <PageTitle title="新增模組" />

  <!-- 主要容器 -->
  <div class="flex gap-5 px-10">
    <!-- 填寫資料區域 -->
    <div class="flex w-full flex-col gap-3 rounded-xl bg-white px-5 py-6 shadow-md">
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { PageTitle } from "@/components/common";
import { FormSection, FormInput, FormButtonGroup } from "@/components/form";
import type { CreateModuleRequest } from "@/types/module";
import type { FieldError } from "@/types/common";
import { moduleService } from "@/services/module.service";
import { ApiError } from "@/types/common";
import { processFieldErrors } from "@/utils/form";

const router = useRouter();

const isSubmitting = ref(false);

// ===== 表單資料 =====
const formData = ref({
  code: "",
  name: "",
});

// ===== 欄位是否必填 =====
const fieldRequired = {
  code: false,
  name: false,
};

const errors = ref({
  code: "",
  name: "",
});

// ===== Template Refs =====
const codeInputRef = ref<{ focus: () => void } | null>(null);
const nameInputRef = ref<{ focus: () => void } | null>(null);

// ===== 事件處理 =====

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
      code: "code",
      name: "name",
    },
    fieldRefMap: {
      code: codeInputRef,
      name: nameInputRef,
    },
    fieldOrder: ["code", "name"],
  });
};

/**
 * 取消按鈕
 * 返回帳號管理列表
 */
const handleCancel = () => {
  router.push("/settings/modules");
};

const handleConfirm = async () => {
  errors.value = {
    code: "",
    name: "",
  };

  // 開始提交
  isSubmitting.value = true;

  try {
    // 準備提交的資料
    const requestData: CreateModuleRequest = {
      code: formData.value.code,
      name: formData.value.name,
    };

    // 呼叫 API：成功不回資料，失敗會丟 ApiError
    await moduleService.createModule(requestData);

    // 成功：返回列表頁面
    router.push("/settings/modules?success=新增成功");
  } catch (err: unknown) {
    console.error("新增模組時發生錯誤:", err);

    if (err instanceof ApiError) {
      // 後端欄位驗證錯誤
      if (err.code === "VALIDATION_ERROR" && err.data) {
        const fieldErrors = err.data as FieldError[];
        handleFieldErrors(fieldErrors);
        return;
      }

      // 模組已存在
      if (err.code === "MODULE_002") {
        errors.value.code = err.message;
        codeInputRef.value?.focus();
        return;
      }

      // 其他業務錯誤
      alert(err.message || "新增模組時發生錯誤,請稍後再試");
    } else {
      // 非預期錯誤（例如網路問題）
      alert("新增模組時發生錯誤,請稍後再試");
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
