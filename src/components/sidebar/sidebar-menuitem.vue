<template>
  <!-- 選單項目 -->
  <div
    class="flex items-center gap-2 rounded-md cursor-pointer bg-white"
    :class="[isChild ? 'h-7 px-2' : 'h-8 px-2', isActive ? '' : 'hover-bg']"
    @click="handleClick"
  >
    <!-- ICON 圖示 -->
    <img
      v-if="item.icon"
      :src="getIconPath(item.icon)"
      :alt="item.label"
      class="w-4 h-4 flex-shrink-0"
      :class="isActive ? 'icon-active' : ''"
    />

    <!-- 選單文字 -->
    <span
      class="whitespace-nowrap overflow-hidden text-ellipsis"
      :class="[
        isChild ? 'typo-sm' : 'typo-sm-medium',
        isActive ? 'text-primary-500' : 'text-neutral-800',
      ]"
    >
      {{ item.label }}
    </span>
  </div>
</template>

<script setup lang="ts">
/**
 * 選單項目元件
 *
 * 用於顯示單一選單項目（例如：總覽、客戶管理、帳號管理等）
 * Active 狀態根據當前路由自動判斷
 */

import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { MenuItem } from '@/types/menu'

// ==================== Props ====================

interface Props {
  /** 選單項目資料 */
  item: MenuItem
  /** 是否為子選單項目 */
  isChild?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isChild: false,
})

// ==================== Emits ====================

const emit = defineEmits<{
  /** 選單項目被點擊 */
  click: []
}>()

// ==================== Composables ====================

const route = useRoute()

// ==================== Computed ====================

/**
 * 判斷是否為當前選中的項目
 * 根據當前路由路徑判斷，支援子頁面
 *
 * 邏輯：
 * 1. 將 item.key 轉換為路徑格式（settings.accounts → /settings/accounts）
 * 2. 檢查當前路由是否以該路徑開頭
 *
 * 範例：
 * - item.key: 'customers'，當前路由: '/customers/11111/detail' → active
 * - item.key: 'settings.accounts'，當前路由: '/settings/accounts/create' → active
 */
const isActive = computed(() => {
  const currentPath = route.path

  // 將 item.key 轉換為路徑格式
  // 'overview' → '/overview'
  // 'customers' → '/customers'
  // 'settings.accounts' → '/settings/accounts'
  const menuPath = '/' + props.item.key.replace(/\./g, '/')

  // 檢查當前路由是否完全匹配或以該路徑開頭（子頁面）
  return currentPath === menuPath || currentPath.startsWith(menuPath + '/')
})

// ==================== Methods ====================

/**
 * 取得 ICON 圖示的完整路徑
 *
 * @param iconName ICON 檔名（不含路徑和副檔名）
 * @returns ICON 的完整路徑
 */
function getIconPath(iconName: string): string {
  return new URL(`../../assets/icons/menu/${iconName}.svg`, import.meta.url).href
}

/**
 * 處理點擊事件
 */
function handleClick() {
  emit('click')
}
</script>

<style scoped>
.icon-active {
  filter: brightness(0) saturate(100%) invert(52%) sepia(52%) saturate(2758%) hue-rotate(196deg)
    brightness(100%) contrast(96%);
}
</style>
