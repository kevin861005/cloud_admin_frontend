<template>
  <div class="flex flex-col gap-2">
    <!-- 標籤 -->
    <label class="typo-sm-medium text-neutral-500">
      {{ label }}
      <span v-if="required" class="text-semantic-warning">*</span>
    </label>

    <!-- 輸入框容器 -->
    <div class="relative">
      <input
        ref="inputRef"
        :type="actualInputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete ? 'on' : 'new-password'"
        class="h-9 w-full rounded border border-neutral-500/10 bg-neutral-500/5 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-500"
        :class="{ 'pr-10': isPasswordType && !disabled }"
        @input="handleInput"
      />

      <!-- 密碼顯示/隱藏按鈕 -->
      <button
        v-if="isPasswordType && !disabled"
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600"
        @click="togglePasswordVisibility"
      >
        <img
          v-if="showPassword"
          src="@/assets/icons/common/cm-eye-show.svg"
          alt="隱藏密碼"
          class="h-4 w-4"
        />
        <img v-else src="@/assets/icons/common/cm-eye-hide.svg" alt="顯示密碼" class="h-4 w-4" />
      </button>
    </div>

    <!-- 錯誤訊息 (下方) -->
    <FieldError :message="errorMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { FieldError } from "@/components/form";

/**
 * 表單輸入欄位元件
 * 支援密碼類型自動顯示眼睛切換按鈕
 */

interface Props {
  label: string;
  modelValue: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  autocomplete?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: "請輸入",
  required: false,
  disabled: false,
  autocomplete: true,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

// ===== 密碼顯示/隱藏 =====

/** 是否為密碼類型 */
const isPasswordType = computed(() => props.type === "password");

/** 是否顯示密碼 */
const showPassword = ref(false);

/** 實際的 input type */
const actualInputType = computed(() => {
  if (isPasswordType.value) {
    return showPassword.value ? "text" : "password";
  }
  return props.type;
});

/** 切換密碼顯示/隱藏 */
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// ===== 輸入處理 =====

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

// ===== Refs =====

const inputRef = ref<HTMLInputElement | null>(null);

/**
 * Focus 到輸入框
 * 供父元件呼叫
 */
const focus = () => {
  inputRef.value?.focus();
};

// ===== Expose =====
defineExpose({
  focus,
});
</script>
