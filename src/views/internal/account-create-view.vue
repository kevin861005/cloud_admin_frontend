<template>
  <div>
    <!-- 頁面標題 -->
    <PageTitle title="新增帳號" />

    <!-- 主要容器 -->
    <div class="flex gap-5 px-10">
      <!-- 填寫資料區域 -->
      <div class="flex w-full flex-col gap-3 rounded-xl bg-white px-5 py-6 shadow-md">
        <!-- 1. 帳號資訊區塊 -->
        <FormSection title="帳號資訊" subtitle="*帳號建立後無法修改" :width="560">
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
        <Divider />

        <!-- 2. 個人資訊區塊 -->
        <FormSection title="個人資訊" :width="560">
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
          :width="560"
          :disabled="isSubmitting"
          @cancel="handleCancel"
          @confirm="handleConfirm"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Divider, PageTitle } from "@/components/common";
import { FormSection, FormInput, FormCheckboxGroup, FormButtonGroup } from "@/components/form";
import { roleService } from "@/services/role.service";
import { userService } from "@/services/user.service";
import type { CreateUserRequest } from "@/types/user";
import type { FieldError } from "@/types/common";
import { ApiError } from "@/types/common";
import { processFieldErrors } from "@/utils/form";

/**
 * 新增帳號頁面
 */

const router = useRouter();

const isSubmitting = ref(false);

// ===== 表單資料 =====
const formData = ref({
  loginId: "",
  password: "",
  roleIds: [] as number[],
  name: "",
  email: "",
});

// ===== 欄位是否必填 =====
const fieldRequired = {
  loginId: false,
  password: false,
  roles: false,
  name: false,
  email: false,
};

const errors = ref({
  loginId: "",
  password: "",
  roles: "",
  name: "",
  email: "",
});

// ===== Template Refs =====
const loginIdInputRef = ref<{ focus: () => void } | null>(null);
const passwordInputRef = ref<{ focus: () => void } | null>(null);
const rolesCheckboxRef = ref<{ focus: () => void } | null>(null);
const nameInputRef = ref<{ focus: () => void } | null>(null);
const emailInputRef = ref<{ focus: () => void } | null>(null);

// ===== 權限選項 (從 API 動態載入) =====
const roleOptions = ref<Array<{ label: string; value: number }>>([]);

/**
 * 從後端 API 載入權限選項
 */
const loadRoleOptions = async () => {
  try {
    const options = await roleService.getRoleOptions(); // 直接回 RoleOption[]

    roleOptions.value = options;
    console.log("權限選項載入成功:", roleOptions.value);
  } catch (err) {
    console.error("載入權限選項錯誤:", err);
    // 使用預設選項作為後備
    roleOptions.value = [];
  }
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
      loginId: "loginId",
      password: "password",
      roleIds: "roles",
      name: "name",
      email: "email",
    },
    fieldRefMap: {
      loginId: loginIdInputRef,
      password: passwordInputRef,
      name: nameInputRef,
      email: emailInputRef,
    },
    fieldOrder: ["loginId", "password", "name", "email"],
  });
};

// ===== 事件處理 =====

/**
 * 取消按鈕
 * 返回帳號管理列表
 */
const handleCancel = () => {
  router.push("/settings/accounts");
};

/**
 * 確認按鈕
 * 提交表單資料
 */
const handleConfirm = async () => {
  // 清空所有錯誤訊息
  errors.value = {
    loginId: "",
    password: "",
    roles: "",
    name: "",
    email: "",
  };

  // 開始提交
  isSubmitting.value = true;

  try {
    // 準備提交的資料
    const requestData: CreateUserRequest = {
      loginId: formData.value.loginId,
      password: formData.value.password,
      name: formData.value.name,
      email: formData.value.email,
      roleIds: formData.value.roleIds,
    };

    // 呼叫 API：成功不回資料，失敗會丟 ApiError
    await userService.createUser(requestData);

    // 成功: 返回列表頁面
    router.push("/settings/accounts?success=新增成功");
  } catch (err: unknown) {
    console.error("新增帳號時發生錯誤:", err);

    if (err instanceof ApiError) {
      // 後端欄位驗證錯誤
      if (err.code === "VALIDATION_ERROR" && err.data) {
        const fieldErrors = err.data as FieldError[];
        handleFieldErrors(fieldErrors);
        return;
      }

      // 帳號已存在
      if (err.code === "USER_002") {
        errors.value.loginId = err.message;
        loginIdInputRef.value?.focus();
        return;
      }

      // 其他業務錯誤
      alert(err.message || "新增帳號時發生錯誤,請稍後再試");
    } else {
      // 非預期錯誤（例如網路問題）
      alert("新增帳號時發生錯誤,請稍後再試");
    }
  } finally {
    isSubmitting.value = false;
  }
};

// ===== 初始化 =====

/**
 * 元件掛載時載入權限選項
 */
onMounted(() => {
  loadRoleOptions();
});
</script>
