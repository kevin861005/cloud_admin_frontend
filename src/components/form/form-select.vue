<template>
  <div class="flex flex-col gap-2">
    <!-- 標籤 -->
    <label class="typo-sm-medium text-slate-500">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- 下拉選擇器 -->
    <div ref="selectContainerRef" class="relative w-full">
      <!-- 主輸入框 -->
      <button
        ref="triggerRef"
        type="button"
        :disabled="disabled"
        class="flex h-9 w-full items-center justify-between rounded border border-slate-500/10 bg-slate-500/5 px-3 py-2 text-left text-sm disabled:bg-gray-100 disabled:text-neutral-500 focus:outline-none"
        @click="toggleDropdown"
      >
        <span :class="selectedLabel ? 'text-neutral-900' : 'text-neutral-400'">
          {{ selectedLabel || placeholder }}
        </span>
        <!-- 下拉箭頭 -->
        <svg
          class="h-4 w-4 transition-transform"
          :class="{ 'rotate-180': isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <!-- 下拉選單 -->
      <div
        v-show="isOpen"
        class="absolute z-50 mt-1 w-full rounded border border-slate-200 bg-white shadow-lg"
      >
        <!-- 搜尋框 -->
        <div class="border-b border-slate-200 p-2">
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="搜尋..."
            class="h-8 w-full rounded border border-slate-300 px-2 text-sm focus:border-blue-500 focus:outline-none"
            @click.stop
          />
        </div>

        <!-- 選項列表 -->
        <div class="max-h-60 overflow-y-auto">
          <template v-if="filteredOptions.length > 0">
            <button
              v-for="option in filteredOptions"
              :key="option.value"
              type="button"
              class="flex w-full items-center px-3 py-2 text-left typo-sm-medium hover:bg-blue-50"
              :class="{
                'bg-blue-100 text-blue-700': isSelected(option.value),
                'text-neutral-900': !isSelected(option.value),
              }"
              @click="selectOption(option)"
            >
              {{ option.label }}
            </button>
          </template>

          <!-- 無選項提示 -->
          <div v-else class="px-3 py-4 text-center text-sm text-neutral-500">無選項</div>
        </div>
      </div>
    </div>

    <!-- 錯誤訊息 -->
    <FieldError :message="errorMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import FieldError from '@/components/form/field-error.vue'

/**
 * 下拉選單元件（單選）
 *
 * 功能：
 * - 單選下拉
 * - 支援搜尋過濾
 * - 點擊外部自動關閉
 * - 選擇後自動關閉
 */

// ===== 型別定義 =====
interface SelectOption {
  label: string
  value: string | number
}

interface Props {
  /** 欄位標籤 */
  label: string
  /** 綁定值 */
  modelValue: string | number | null
  /** 選項列表 */
  options: SelectOption[]
  /** 佔位提示文字 */
  placeholder?: string
  /** 是否必填 */
  required?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 錯誤訊息 */
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '請選擇',
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

// ===== 狀態管理 =====

/** 是否展開下拉選單 */
const isOpen = ref(false)

/** 搜尋關鍵字 */
const searchQuery = ref('')

/** 下拉容器 ref */
const selectContainerRef = ref<HTMLDivElement | null>(null)

/** 觸發按鈕 ref */
const triggerRef = ref<HTMLButtonElement | null>(null)

/** 搜尋輸入框 ref */
const searchInputRef = ref<HTMLInputElement | null>(null)

// ===== 計算屬性 =====

/**
 * 當前選中選項的標籤
 */
const selectedLabel = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) {
    return ''
  }
  const selected = props.options.find((opt) => opt.value === props.modelValue)
  return selected?.label || ''
})

/**
 * 過濾後的選項列表
 */
const filteredOptions = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.options
  }

  const query = searchQuery.value.toLowerCase().trim()
  return props.options.filter((option) => option.label.toLowerCase().includes(query))
})

// ===== 方法 =====

/**
 * 切換下拉選單顯示/隱藏
 */
const toggleDropdown = () => {
  if (props.disabled) return

  isOpen.value = !isOpen.value

  // 展開時清空搜尋並 focus 搜尋框
  if (isOpen.value) {
    searchQuery.value = ''
    // 使用 nextTick 確保 DOM 更新後再 focus
    setTimeout(() => {
      searchInputRef.value?.focus()
    }, 50)
  }
}

/**
 * 選擇選項
 */
const selectOption = (option: SelectOption) => {
  emit('update:modelValue', option.value)
  isOpen.value = false // 選擇後自動關閉
  searchQuery.value = '' // 清空搜尋
}

/**
 * 判斷選項是否被選中
 */
const isSelected = (value: string | number) => {
  return props.modelValue === value
}

/**
 * 關閉下拉選單
 */
const closeDropdown = () => {
  isOpen.value = false
  searchQuery.value = ''
}

/**
 * 處理點擊外部事件
 */
const handleClickOutside = (event: MouseEvent) => {
  if (!selectContainerRef.value) return

  const target = event.target as Node
  if (!selectContainerRef.value.contains(target)) {
    closeDropdown()
  }
}

/**
 * Focus 到觸發按鈕
 * 供父元件呼叫
 */
const focus = () => {
  triggerRef.value?.focus()
}

// ===== 生命週期 =====

onMounted(() => {
  // 監聽全域點擊事件
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  // 移除全域點擊事件監聽
  document.removeEventListener('click', handleClickOutside)
})

// 當 disabled 變為 true 時，關閉下拉選單
watch(
  () => props.disabled,
  (newValue) => {
    if (newValue) {
      closeDropdown()
    }
  },
)

// ===== Expose =====
defineExpose({
  focus,
})
</script>
