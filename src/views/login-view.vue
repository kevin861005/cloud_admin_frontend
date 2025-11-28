<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4"
  >
    <!-- 登入卡片 -->
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <!-- Logo 和標題 -->
      <div class="text-center mb-8">
        <div
          class="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4"
        >
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-neutral-900">歡迎回來</h2>
        <p class="text-neutral-600 mt-2">請登入您的帳號</p>
      </div>

      <!-- 登入表單 -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- 帳號輸入框 -->
        <div>
          <label for="loginId" class="block text-sm font-medium text-neutral-700 mb-2">
            帳號
          </label>
          <input
            id="loginId"
            v-model="form.loginId"
            type="text"
            autocomplete="username"
            :disabled="isLoading || isSubmitting"
            :class="[
              'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors',
              formErrors.loginId ? 'border-red-500' : 'border-gray-300',
            ]"
            placeholder="請輸入帳號"
          />
          <!-- 帳號驗證錯誤訊息 -->
          <p v-if="formErrors.loginId" class="mt-1 text-sm text-red-600">
            {{ formErrors.loginId }}
          </p>
        </div>

        <!-- 密碼輸入框 -->
        <div>
          <label for="password" class="block text-sm font-medium text-neutral-700 mb-2">
            密碼
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              :disabled="isLoading || isSubmitting"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors pr-12',
                formErrors.password ? 'border-red-500' : 'border-gray-300',
              ]"
              placeholder="請輸入密碼"
            />
            <!-- 顯示/隱藏密碼按鈕 -->
            <button
              type="button"
              @click="togglePasswordVisibility"
              :disabled="isLoading || isSubmitting"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
            >
              <svg
                v-if="!showPassword"
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            </button>
          </div>
          <!-- 密碼驗證錯誤訊息 -->
          <p v-if="formErrors.password" class="mt-1 text-sm text-red-600">
            {{ formErrors.password }}
          </p>
        </div>

        <!-- API 錯誤訊息 -->
        <div
          v-if="authStore.errorMessage"
          class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start"
        >
          <svg
            class="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-sm">{{ authStore.errorMessage }}</span>
        </div>

        <!-- 登入按鈕 -->
        <button
          type="submit"
          :disabled="!isFormValid || isLoading || isSubmitting"
          :class="[
            'w-full py-3 px-4 rounded-lg font-medium text-white transition-colors',
            isFormValid && !isLoading && !isSubmitting
              ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300'
              : 'bg-gray-300 cursor-not-allowed',
          ]"
        >
          <!-- Loading 狀態 -->
          <span v-if="isLoading || isSubmitting" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
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
          <!-- 正常狀態 -->
          <span v-else>登入</span>
        </button>
      </form>

      <!-- 其他連結（可選） -->
      <div class="mt-6 text-center">
        <a href="#" class="text-sm text-indigo-600 hover:text-indigo-700"> 忘記密碼？ </a>
      </div>

      <!-- 除錯資訊 (開發階段使用，生產環境請移除) -->
      <div v-if="true" class="mt-6 p-4 bg-gray-100 rounded-lg text-xs font-mono space-y-1">
        <div class="font-bold text-neutral-700 mb-2">🔍 除錯資訊</div>
        <div>
          <span class="text-neutral-600">isAuthenticated:</span> {{ authStore.isAuthenticated }}
        </div>
        <div><span class="text-neutral-600">isLoading:</span> {{ isLoading }}</div>
        <div><span class="text-neutral-600">isSubmitting:</span> {{ isSubmitting }}</div>
        <div>
          <span class="text-neutral-600">userName:</span>
          {{ authStore.userInfo?.userName || 'null' }}
        </div>
        <div>
          <span class="text-neutral-600">當前路由:</span> {{ router.currentRoute.value.path }}
        </div>
        <div><span class="text-neutral-600">hasToken:</span> {{ hasToken }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 登入頁面
 *
 * 功能：
 * 1. 使用者輸入帳號密碼
 * 2. 表單驗證
 * 3. 呼叫登入 API
 * 4. 顯示 Loading 狀態
 * 5. 錯誤處理
 * 6. 登入成功後跳轉到首頁
 */
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

// === Composables ===
const router = useRouter()
const authStore = useAuthStore()

// === State ===

/**
 * 表單資料
 */
const form = ref({
  loginId: '',
  password: '',
})

/**
 * 表單驗證錯誤
 */
const formErrors = ref({
  loginId: '',
  password: '',
})

/**
 * 是否顯示密碼
 */
const showPassword = ref(false)

/**
 * 防止重複提交
 */
const isSubmitting = ref(false)

// === Computed ===

/**
 * 表單是否有效
 */
const isFormValid = computed(() => {
  return form.value.loginId.trim() !== '' && form.value.password.trim() !== ''
})

/**
 * 是否正在載入（兼容 loading 和 isLoading）
 */
const isLoading = computed(() => {
  // 使用 in 操作符安全地檢查屬性是否存在
  const hasIsLoading = 'isLoading' in authStore
  const hasLoading = 'loading' in authStore

  if (hasIsLoading) {
    return Boolean((authStore as unknown as Record<string, unknown>).isLoading)
  }

  if (hasLoading) {
    return Boolean((authStore as unknown as Record<string, unknown>).loading)
  }

  return false
})

/**
 * 檢查是否有 Token（供 template 使用）
 */
const hasToken = computed(() => {
  return !!localStorage.getItem('accessToken')
})

// === Methods ===

/**
 * 驗證表單
 */
function validateForm(): boolean {
  let isValid = true

  // 重置錯誤訊息
  formErrors.value = {
    loginId: '',
    password: '',
  }

  // 驗證帳號
  if (!form.value.loginId.trim()) {
    formErrors.value.loginId = '請輸入帳號'
    isValid = false
  }

  // 驗證密碼
  if (!form.value.password.trim()) {
    formErrors.value.password = '請輸入密碼'
    isValid = false
  }

  return isValid
}

/**
 * 處理登入
 */
async function handleLogin(): Promise<void> {
  console.log('╔════════════════════════════════════════╗')
  console.log('║     登入流程開始 - login-view.vue     ║')
  console.log('╚════════════════════════════════════════╝')
  console.log('1. handleLogin 函數被呼叫')
  console.log('   帳號:', form.value.loginId)
  console.log('   密碼長度:', form.value.password.length)

  // 防止重複提交
  if (isSubmitting.value) {
    console.log('⚠️  登入進行中，忽略重複提交')
    return
  }

  // 驗證表單
  console.log('2. 開始表單驗證')
  if (!validateForm()) {
    console.log('❌ 表單驗證失敗')
    console.log('   錯誤:', formErrors.value)
    return
  }
  console.log('✅ 表單驗證通過')

  try {
    isSubmitting.value = true
    console.log('3. 設置 isSubmitting = true')

    // 呼叫登入 API
    console.log('4. 準備呼叫 authStore.login')
    console.log('   傳入參數:', {
      loginId: form.value.loginId,
      password: '******',
    })

    const success = await authStore.login({
      loginId: form.value.loginId,
      password: form.value.password,
    })

    console.log('5. authStore.login 執行完成')
    console.log('   ├─ 返回值 success:', success)
    console.log('   ├─ authStore.isAuthenticated:', authStore.isAuthenticated)
    console.log('   ├─ authStore.userInfo:', authStore.userInfo)
    console.log('   └─ localStorage Token:', !!localStorage.getItem('accessToken'))

    // 登入成功，跳轉到首頁
    if (success) {
      console.log('6. ✅ 登入成功分支')
      console.log('7. 等待 nextTick 確保狀態更新')

      await nextTick()

      console.log('8. nextTick 完成，再次確認狀態:')
      console.log('   ├─ isAuthenticated:', authStore.isAuthenticated)
      console.log('   ├─ userInfo:', authStore.userInfo)
      console.log('   └─ 當前路由:', router.currentRoute.value.path)

      console.log('9. 準備執行路由跳轉')
      console.log('   目標路由: /overview')

      // 使用 replace 避免返回到登入頁
      const result = await router.replace('/overview')

      console.log('10. 路由跳轉完成')
      console.log('    ├─ 跳轉結果:', result)
      console.log('    ├─ 新路由路徑:', router.currentRoute.value.path)
      console.log('    └─ 新路由名稱:', router.currentRoute.value.name)

      console.log('╔════════════════════════════════════════╗')
      console.log('║         ✅ 登入流程成功完成            ║')
      console.log('╚════════════════════════════════════════╝')
    } else {
      console.log('6. ❌ 登入失敗分支')
      console.log('   錯誤訊息:', authStore.errorMessage)
      console.log('╔════════════════════════════════════════╗')
      console.log('║         ❌ 登入流程失敗                ║')
      console.log('╚════════════════════════════════════════╝')
    }
  } catch (error) {
    console.error('╔════════════════════════════════════════╗')
    console.error('║      ⚠️  handleLogin 捕獲錯誤         ║')
    console.error('╚════════════════════════════════════════╝')
    console.error('錯誤詳情:', error)
    console.error('錯誤堆疊:', (error as Error).stack)
  } finally {
    isSubmitting.value = false
    console.log('11. 清理: isSubmitting = false')
    console.log('═══════════════════════════════════════════')
  }
}

/**
 * 切換密碼顯示/隱藏
 */
function togglePasswordVisibility(): void {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>
/* 如果需要額外的樣式可以在這裡加 */
</style>
