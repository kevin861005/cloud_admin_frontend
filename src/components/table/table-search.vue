<template>
  <!-- 搜尋框容器 -->
  <div class="relative flex items-center">
    <!-- 搜尋輸入框 -->
    <input
      v-model="localValue"
      type="text"
      name="table-search"
      autocomplete="off"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'typo-sm h-8 w-full rounded-md border px-3 py-1 placeholder:text-neutral-400',
        disabled
          ? 'cursor-not-allowed border-neutral-100 bg-neutral-50 text-neutral-400'
          : 'border-neutral-200 bg-white focus:border-primary-500',
      ]"
      @input="handleInput"
    />

    <!-- 搜尋圖示（右側） -->
    <img
      :src="searchIcon"
      alt="搜尋"
      :class="['pointer-events-none absolute right-3 h-5 w-5', disabled ? 'opacity-40' : '']"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import searchIcon from "@/assets/icons/table/search.svg";

/**
 * Table 搜尋框元件
 *
 * 功能：
 * 1. 即時搜尋（debounce 500ms）
 * 2. 搜尋圖示顯示在右側
 * 3. 支援 v-model 雙向綁定
 * 4. 支援 disabled 狀態
 *
 * 使用範例：
 * <table-search
 *   v-model="searchKeyword"
 *   placeholder="搜尋客戶名稱、Email..."
 *   :disabled="isDrawerOpen"
 * />
 */

// ===== Props 定義 =====
interface Props {
  modelValue: string; // 搜尋關鍵字
  placeholder?: string; // 提示文字
  disabled?: boolean; // 是否停用
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "搜尋...",
  disabled: false,
});

// ===== Emits 定義 =====
const emit = defineEmits<{
  "update:modelValue": [value: string]; // 搜尋關鍵字改變事件
}>();

// ===== 內部狀態 =====

/**
 * 本地輸入值（即時更新，用於顯示）
 */
const localValue = ref(props.modelValue);

/**
 * Debounce 定時器
 */
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// ===== 監聽外部變化 =====

/**
 * 當外部 modelValue 改變時，同步到本地值
 * 例如：父元件清空搜尋時，輸入框也要清空
 */
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== localValue.value) {
      localValue.value = newValue;
    }
  }
);

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
    clearTimeout(debounceTimer);
  }

  // 設定新的定時器
  debounceTimer = setTimeout(() => {
    emit("update:modelValue", localValue.value.trim());
  }, 500);
};
</script>
