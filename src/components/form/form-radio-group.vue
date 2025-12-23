<template>
  <div class="flex flex-col gap-2">
    <!-- 標籤 -->
    <label class="typo-sm-medium text-slate-500">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Radio 選項群組 -->
    <div class="flex flex-wrap gap-3">
      <label
        v-for="(option, index) in options"
        :key="option.value"
        class="flex h-9 cursor-pointer items-center gap-1 rounded border bg-slate-500/5 px-3 py-2 typo-sm-medium"
      >
        <button
          :ref="index === 0 ? 'firstRadioRef' : undefined"
          type="button"
          class="flex h-4 w-4 items-center justify-center"
          @click="handleChange(option.value)"
        >
          <img
            :src="isChecked(option.value) ? RadioOnIcon : RadioOffIcon"
            alt="選取"
            class="h-4 w-4 cursor-pointer"
          />
        </button>
        <span class="text-neutral-900">{{ option.label }}</span>
      </label>
    </div>

    <!-- 錯誤訊息 (下方) -->
    <FieldError :message="errorMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FieldError } from '@/components/form'
import RadioOnIcon from '@/assets/icons/common/cm-radio-on.svg'
import RadioOffIcon from '@/assets/icons/common/cm-radio.svg'

/**
 * FormRadioGroup 元件
 * 單選按鈕群組，用於表單中的單選欄位
 * 樣式與 FormCheckboxGroup 保持一致
 */

interface Props {
  /**
   * 欄位標籤
   */
  label: string

  /**
   * 雙向綁定的值
   */
  modelValue: string | number | null

  /**
   * 選項列表
   */
  options: Array<{ label: string; value: string | number }>

  /**
   * 是否必填
   */
  required?: boolean

  /**
   * 錯誤訊息
   */
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  errorMessage: '',
})

const emit = defineEmits<{
  /**
   * 值變更事件
   */
  'update:modelValue': [value: string | number]
}>()

/**
 * 第一個 radio input 元素的 ref（用於 focus）
 */
const firstRadioRef = ref<HTMLInputElement | null>(null)

/**
 * 檢查選項是否被選中
 */
const isChecked = (value: string | number) => {
  return props.modelValue === value
}

/**
 * 處理選項變更
 */
const handleChange = (value: string | number) => {
  emit('update:modelValue', value)
}

/**
 * 提供給父元件呼叫的 focus 方法
 * 聚焦到第一個 radio button
 */
const focus = () => {
  firstRadioRef.value?.focus()
}

// 暴露 focus 方法給父元件
defineExpose({
  focus,
})
</script>
