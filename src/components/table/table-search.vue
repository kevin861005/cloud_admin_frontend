<template>
  <!-- 搜尋框容器 -->
  <div class="relative flex items-center">
    <!-- 搜尋圖示 -->
    <svg
      class="pointer-events-none absolute left-3 h-5 w-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>

    <!-- 搜尋輸入框 -->
    <input
      v-model="localValue"
      type="text"
      :placeholder="placeholder"
      class="w-full rounded-md border-gray-300 py-2 pl-10 pr-10 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      @input="handleInput"
    />

    <!-- 清除按鈕（有內容時才顯示）-->
    <button
      v-if="localValue"
      type="button"
      class="absolute right-3 text-gray-400 transition-colors hover:text-gray-600"
      title="清除搜尋"
      @click="handleClear"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

/**
 * Table 搜尋框元件
 *
 * 功能：
 * 1. 即時搜尋（debounce 500ms）
 * 2. 顯示搜尋圖示和清除按鈕
 * 3. 支援 v-model 雙向綁定
 *
 * 使用範例：
 * <table-search
 *   v-model="searchKeyword"
 *   placeholder="搜尋客戶名稱、Email..."
 * />
 */

// ===== Props 定義 =====
interface Props {
  modelValue: string // 搜尋關鍵字
  placeholder?: string // 提示文字
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜尋...',
})

// ===== Emits 定義 =====
const emit = defineEmits<{
  'update:modelValue': [value: string] // 搜尋關鍵字改變事件
}>()

// ===== 內部狀態 =====

/**
 * 本地輸入值（即時更新，用於顯示）
 */
const localValue = ref(props.modelValue)

/**
 * Debounce 定時器
 */
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// ===== 監聽外部變化 =====

/**
 * 當外部 modelValue 改變時，同步到本地值
 * 例如：父元件清空搜尋時，輸入框也要清空
 */
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== localValue.value) {
      localValue.value = newValue
    }
  },
)

// ===== 事件處理 =====

/**
 * 處理輸入事件（Debounce 500ms）
 * 邏輯：
 * 1. 清除之前的定時器
 * 2. 設定新的定時器（500ms 後觸發）
 * 3. 時間到後才觸發 update:modelValue
 */
const handleInput = () => {
  // 清除之前的定時器
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // 設定新的定時器
  debounceTimer = setTimeout(() => {
    emit('update:modelValue', localValue.value.trim())
  }, 500)
}

/**
 * 處理清除按鈕點擊
 * 邏輯：
 * 1. 清空本地值
 * 2. 清除定時器
 * 3. 立即觸發 update:modelValue（傳空字串）
 */
const handleClear = () => {
  localValue.value = ''

  // 清除定時器
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }

  // 立即清空搜尋
  emit('update:modelValue', '')
}
</script>
