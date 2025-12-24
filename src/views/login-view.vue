<template>
  <div class="relative min-h-screen w-full overflow-hidden">
    <!-- ========== 背景層 ========== -->
    <!-- 上方 2/3 藍色背景 -->
    <div class="absolute inset-x-0 top-0 h-2/3">
      <img
        src="@/assets/icons/login/background.svg"
        alt="background"
        class="h-full w-full object-cover"
      />
    </div>
    <!-- 下方 1/3 白色背景 -->
    <div class="absolute inset-x-0 bottom-0 h-1/3 bg-neutral-100"></div>

    <!-- ========== 內容層 ========== -->
    <div class="relative z-10 flex min-h-screen flex-col">
      <!-- 標題區塊：Logo -->
      <header class="px-5 py-8 min-[376px]:px-10">
        <img src="@/assets/icons/login/logo.svg" alt="interinfo" class="h-6" />
      </header>

      <!-- 內容區塊 -->
      <!-- 電腦版：左右佈局 / 平板手機版：上下佈局 -->
      <main
        class="flex flex-1 flex-col px-5 pt-8 min-[376px]:px-[100px] min-[376px]:pt-12 lg:flex-row lg:justify-between lg:pt-[120px]"
      >
        <!-- 左側：Welcome + 火箭圖片 -->
        <div class="mb-10 flex lg:mb-0 lg:flex-1">
          <!-- 文字區 -->
          <div class="flex flex-col gap-1">
            <h1 class="text-[32px] font-bold text-white min-[376px]:text-[40px] lg:text-[48px]">
              Welcome
            </h1>
            <p class="typo-base-medium text-white min-[376px]:text-lg lg:text-xl">
              英特內軟體內部環境管理系統
            </p>
          </div>

          <!-- 火箭圖片：僅電腦版顯示 -->
          <div class="hidden lg:-ml-10 lg:-mt-10 lg:block">
            <img
              src="@/assets/icons/login/img-login.svg"
              alt="rocket"
              class="h-[368px] w-[368px]"
            />
          </div>
        </div>

        <!-- 右側：登入卡片 -->
        <!-- 電腦版：靠右 / 平板手機版：置中佔滿寬度 -->
        <div class="flex w-full items-start justify-center lg:w-auto lg:justify-end">
          <div
            class="w-full rounded-xl bg-white px-5 pb-10 pt-8 shadow-lg min-[376px]:px-10 min-[376px]:pb-20 min-[376px]:pt-10 md:w-[440px]"
          >
            <!-- 卡片標題 -->
            <div class="mb-5 flex flex-col gap-1">
              <p class="text-base font-normal text-neutral-900">
                歡迎使用
                <span class="font-bold text-primary-500">環境管理系統</span>
              </p>
              <h2
                class="text-[28px] font-bold leading-tight text-neutral-900 min-[376px]:text-[32px]"
              >
                登入
              </h2>
            </div>

            <!-- 登入表單 -->
            <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
              <div class="flex flex-col gap-1">
                <!-- 帳號輸入框 -->
                <div class="flex flex-col gap-1">
                  <label for="loginId" class="text-base text-neutral-800">帳號</label>
                  <input
                    id="loginId"
                    v-model="form.loginId"
                    type="text"
                    autocomplete="username"
                    :disabled="isLoading || isSubmitting"
                    :class="[
                      'w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none',
                      formErrors.loginId
                        ? 'border-semantic-warning focus:border-semantic-warning'
                        : 'border-neutral-200 focus:border-primary-500',
                    ]"
                    placeholder="請輸入帳號"
                  />
                  <!-- 帳號專屬錯誤（只顯示「請輸入帳號」） -->
                  <p v-if="formErrors.loginId" class="typo-xs-bold text-semantic-warning">
                    {{ formErrors.loginId }}
                  </p>
                </div>

                <!-- 密碼輸入框 -->
                <div class="flex flex-col gap-1">
                  <label for="password" class="text-base text-neutral-800">密碼</label>
                  <div class="relative">
                    <input
                      ref="passwordInputRef"
                      id="password"
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      autocomplete="current-password"
                      :disabled="isLoading || isSubmitting"
                      :class="[
                        'w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none',
                        formErrors.password || authStore.errorMessage || sessionExpired
                          ? 'border-semantic-warning focus:border-semantic-warning'
                          : 'border-neutral-200 focus:border-primary-500',
                      ]"
                      placeholder="請輸入密碼"
                    />
                    <!-- 顯示/隱藏密碼按鈕 -->
                    <button
                      type="button"
                      @click="togglePasswordVisibility"
                      :disabled="isLoading || isSubmitting"
                      class="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600"
                    >
                      <img
                        v-if="showPassword"
                        src="@/assets/icons/common/cm-eye-show.svg"
                        alt="顯示密碼"
                        class="h-5 w-5"
                      />
                      <img
                        v-else
                        src="@/assets/icons/common/cm-eye-hide.svg"
                        alt="隱藏密碼"
                        class="h-5 w-5"
                      />
                    </button>
                  </div>
                  <!-- 錯誤訊息（密碼驗證 + 後端錯誤 + 登入失效都顯示在這） -->
                  <p
                    v-if="formErrors.password || authStore.errorMessage || sessionExpired"
                    class="typo-xs-bold text-semantic-warning"
                  >
                    {{
                      formErrors.password ||
                      authStore.errorMessage ||
                      (sessionExpired ? "您的登入已失效，請重新登入" : "")
                    }}
                  </p>
                </div>
              </div>

              <!-- 登入按鈕 -->
              <button
                type="submit"
                :disabled="!isFormValid || isLoading || isSubmitting"
                :class="[
                  'typo-base-medium mt-4 w-full rounded-lg py-3 transition-colors',
                  isFormValid && !isLoading && !isSubmitting
                    ? 'bg-primary-500 text-white hover:bg-blue-600'
                    : 'cursor-not-allowed bg-neutral-200 text-neutral-400',
                ]"
              >
                <span v-if="isLoading || isSubmitting" class="flex items-center justify-center">
                  <svg
                    class="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  登入中...
                </span>
                <span v-else>登入</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 登入頁面
 */
import { ref, computed, nextTick, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

// === Composables ===
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// === State ===

/**
 * 表單資料
 */
const form = ref({
  loginId: "",
  password: "",
});

/**
 * 表單驗證錯誤
 */
const formErrors = ref({
  loginId: "",
  password: "",
});

/**
 * 是否顯示密碼
 */
const showPassword = ref(false);

/**
 * 防止重複提交
 */
const isSubmitting = ref(false);

/**
 * 密碼輸入框 ref
 */
const passwordInputRef = ref<HTMLInputElement | null>(null);

// === Computed ===

/**
 * 表單是否有效（帳號密碼都有值才可按登入）
 */
const isFormValid = computed(() => {
  return form.value.loginId.trim() !== "" && form.value.password.trim() !== "";
});

/**
 * 是否正在載入
 */
const isLoading = computed(() => {
  const hasIsLoading = "isLoading" in authStore;
  const hasLoading = "loading" in authStore;

  if (hasIsLoading) {
    return Boolean((authStore as unknown as Record<string, unknown>).isLoading);
  }

  if (hasLoading) {
    return Boolean((authStore as unknown as Record<string, unknown>).loading);
  }

  return false;
});

/**
 * 登入已失效（從 URL 參數讀取）
 */
const sessionExpired = ref(false);

// === Methods ===

/**
 * 驗證表單
 */
function validateForm(): boolean {
  let isValid = true;

  formErrors.value = {
    loginId: "",
    password: "",
  };

  if (!form.value.loginId.trim()) {
    formErrors.value.loginId = "請輸入帳號";
    isValid = false;
  }

  if (!form.value.password.trim()) {
    formErrors.value.password = "請輸入密碼";
    isValid = false;
  }

  return isValid;
}

/**
 * 處理登入
 */
async function handleLogin(): Promise<void> {
  if (isSubmitting.value) {
    return;
  }

  if (!validateForm()) {
    return;
  }

  let shouldFocusPassword = false;

  try {
    isSubmitting.value = true;

    const success = await authStore.login({
      loginId: form.value.loginId,
      password: form.value.password,
    });

    if (success) {
      await nextTick();
      await router.replace("/overview");
    } else {
      // 登入失敗，標記需要 focus
      shouldFocusPassword = true;
    }
  } catch (error) {
    console.error("登入錯誤:", error);
    // 發生錯誤，標記需要 focus
    shouldFocusPassword = true;
  } finally {
    isSubmitting.value = false;
  }

  // 在 isSubmitting 設為 false 後再 focus
  if (shouldFocusPassword) {
    await nextTick();
    passwordInputRef.value?.focus();
  }
}

/**
 * 切換密碼顯示/隱藏
 */
function togglePasswordVisibility(): void {
  showPassword.value = !showPassword.value;
}

/**
 * 檢查 URL 參數並設定對應狀態
 */
function checkUrlReason(): void {
  const warning = route.query.warning as string | undefined;

  if (warning) {
    sessionExpired.value = true;

    // 清除 URL 參數（避免重新整理時再次顯示）
    router.replace({ path: route.path, query: {} });

    // focus 到密碼欄位
    nextTick(() => {
      passwordInputRef.value?.focus();
    });
  }
}

// === Lifecycle ===
onMounted(() => {
  checkUrlReason();
});
</script>
