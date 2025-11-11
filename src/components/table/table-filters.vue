<template>
  <!-- 篩選器容器 -->
  <div v-if="filters.length > 0" class="flex flex-wrap items-center gap-2">
    <!-- 遍歷每個篩選器 -->
    <div v-for="filter in filters" :key="filter.key" class="flex items-center gap-2">
      <!-- 篩選器標籤 -->
      <label class="text-sm font-normal text-gray-700">
        {{ filter.label }}
      </label>

      <!-- 下拉選單 -->
      <select
        :value="modelValue[filter.key] ?? getDefaultValue(filter)"
        @change="handleFilterChange(filter.key, ($event.target as HTMLSelectElement).value)"
        class="h-8 py-1 px-3 border rounded-md border-gray-300 text-sm font-normal text-gray-700 focus:outline-none"
      >
        <option v-for="option in filter.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FilterConfig, FilterValues } from '@/types/table'

/**
 * Table 篩選器元件
 *
 * 功能：
 * 1. 顯示多個下拉式篩選器
 * 2. 每個篩選器對應一個資料欄位
 * 3. 改變時立即觸發 update:modelValue 事件
 * 4. 支援預設值設定
 *
 * 使用範例：
 * <table-filters
 *   :filters="filterConfigs"
 *   :modelValue="filterValues"
 *   @update:modelValue="handleFilterChange"
 * />
 */

// ===== Props 定義 =====
interface Props {
  filters: FilterConfig[] // 篩選器配置列表
  modelValue: FilterValues // 當前篩選值（key-value 對應）
}

const props = defineProps<Props>()

// ===== Emits 定義 =====
const emit = defineEmits<{
  'update:modelValue': [value: FilterValues] // 篩選值改變事件
}>()

// ===== 輔助函數 =====

/**
 * 取得篩選器的預設值
 * 邏輯：
 * 1. 如果有設定 defaultValue，使用該值
 * 2. 否則使用第一個選項的值
 */
const getDefaultValue = (filter: FilterConfig): string | number => {
  if (filter.defaultValue !== undefined) {
    return filter.defaultValue
  }
  return filter.options[0]?.value ?? 'all'
}

// ===== 事件處理 =====

/**
 * 處理篩選器改變
 * 邏輯：
 * 1. 建立新的 filterValues 物件
 * 2. 更新指定 key 的值
 * 3. 觸發 update:modelValue 事件
 */
const handleFilterChange = (key: string, value: string) => {
  const newFilterValues = {
    ...props.modelValue,
    [key]: value,
  }
  emit('update:modelValue', newFilterValues)
}
</script>
