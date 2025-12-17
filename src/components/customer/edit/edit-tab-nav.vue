<template>
  <div class="flex gap-1 rounded-lg bg-slate-100 p-1">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      class="h-9 px-4 rounded-md typo-sm-medium transition-colors"
      :class="
        activeTab === tab.key ? 'bg-primary-500 text-white' : 'text-neutral-600 hover:bg-slate-200'
      "
      @click="handleTabClick(tab.key)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * 編輯頁面 Tab 導航元件
 *
 * 用途：
 * - 顯示編輯頁面的 Tab 導航列
 * - 點擊 Tab 時滾動到對應區塊
 */

interface Tab {
  key: string
  label: string
}

interface Props {
  /** 當前選中的 Tab */
  activeTab: string
  /** Tab 列表 */
  tabs: Tab[]
}

defineProps<Props>()

const emit = defineEmits<{
  'tab-click': [key: string]
}>()

/**
 * Tab 點擊處理
 */
function handleTabClick(key: string) {
  emit('tab-click', key)
}
</script>
