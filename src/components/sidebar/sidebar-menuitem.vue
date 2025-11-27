<template>
  <!-- 選單項目 -->
  <div
    class="flex items-center gap-2 rounded-md cursor-pointer bg-white transition-colors duration-150"
    :class="[isChild ? 'h-7 px-2' : 'h-8 px-2', isActive ? 'bg-slate-100' : 'hover:bg-slate-100']"
    @click="handleClick"
  >
    <!-- ICON 圖示 -->
    <img
      v-if="item.icon"
      :src="getIconPath(item.icon)"
      :alt="item.label"
      class="w-4 h-4 flex-shrink-0"
    />

    <!-- 選單文字 -->
    <span
      class="whitespace-nowrap overflow-hidden text-ellipsis text-slate-800"
      :class="isChild ? 'typo-sm' : 'typo-sm-medium'"
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
 */

import { computed } from 'vue'
import { useMenuStore } from '@/stores/menu.store'
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

// ==================== Stores ====================

const menuStore = useMenuStore()

// ==================== Computed ====================

/**
 * 判斷是否為當前選中的項目
 */
const isActive = computed(() => {
  return menuStore.activeMenuKey === props.item.key
})

// ==================== Methods ====================

/**
 * 取得 ICON 圖示的完整路徑
 *
 * @param iconName ICON 檔名（不含路徑和副檔名）
 * @returns ICON 的完整路徑
 */
function getIconPath(iconName: string): string {
  // ICON 路徑：/src/assets/icons/menu/{iconName}.svg
  return new URL(`../../assets/icons/menu/${iconName}.svg`, import.meta.url).href
}

/**
 * 處理點擊事件
 */
function handleClick() {
  emit('click')
}
</script>

<style scoped></style>
