<template>
  <div class="flex flex-col gap-2">
    <!-- 標籤 -->
    <label class="typo-sm-medium text-slate-500">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Checkbox 選項 -->
    <div class="flex flex-wrap gap-3">
      <label
        v-for="(option, index) in options"
        :key="option.value"
        class="flex h-9 items-center gap-1 rounded border border-slate-500/10 bg-slate-500/5 px-3 py-2 typo-sm-medium"
        :class="{ 'border-blue-500 bg-blue-50': isChecked(option.value) }"
      >
        <button
          :ref="index === 0 ? 'firstCheckboxRef' : undefined"
          type="button"
          class="flex h-4 w-4 items-center justify-center"
          @click="handleChange(option.value)"
        >
          <img
            :src="isChecked(option.value) ? CheckboxOnIcon : CheckboxOffIcon"
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
import CheckboxOnIcon from '@/assets/icons/common/cm-checkbox-on.svg'
import CheckboxOffIcon from '@/assets/icons/common/cm-checkbox.svg'

/**
 * Checkbox 群組元件
 */

interface CheckboxOption {
  label: string
  value: string | number
}

interface Props {
  label: string
  modelValue: Array<string | number>
  options: CheckboxOption[]
  required?: boolean
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: Array<string | number>]
}>()

const isChecked = (value: string | number) => {
  return props.modelValue.includes(value)
}

const handleChange = (value: string | number) => {
  const newValue = [...props.modelValue]
  const index = newValue.indexOf(value)

  if (index > -1) {
    newValue.splice(index, 1)
  } else {
    newValue.push(value)
  }

  emit('update:modelValue', newValue)
}

const firstCheckboxRef = ref<HTMLInputElement | null>(null)

/**
 * Focus 到第一個 checkbox
 * 供父元件呼叫
 */
const focus = () => {
  firstCheckboxRef.value?.focus()
}

// ===== Expose =====
defineExpose({
  focus,
})
</script>
