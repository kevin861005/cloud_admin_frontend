<template>
  <div class="flex flex-col gap-2">
    <!-- 標籤 -->
    <label
      class="text-sm font-medium leading-5 text-slate-500"
      style="font-family: 'Noto Sans TC', sans-serif; letter-spacing: 0%"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- 輸入框 -->
    <input
      ref="inputRef"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="h-9 rounded border border-slate-500/10 bg-slate-500/5 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-500 w-[280px] focus:outline-none"
      style="font-family: 'Noto Sans TC', sans-serif"
      @input="handleInput"
    />

    <!-- 錯誤訊息 (下方) -->
    <span
      v-if="errorMessage"
      class="inline-block rounded py-1 text-white"
      style="
        font-family: 'Noto Sans TC';
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.2%;
        color: #fd5858;
        background: #ffffff;
      "
    >
      {{ errorMessage }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/**
 * 表單輸入欄位元件
 */

interface Props {
  label: string
  modelValue: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  errorMessage?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '請輸入',
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const inputRef = ref<HTMLInputElement | null>(null)

/**
 * Focus 到輸入框
 * 供父元件呼叫
 */
const focus = () => {
  inputRef.value?.focus()
}

// ===== Expose =====
defineExpose({
  focus,
})
</script>
