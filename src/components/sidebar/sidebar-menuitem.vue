<template>
  <!-- 選單項目 -->
  <div
    class="menu-item"
    :class="{
      'menu-item-active': isActive,
      'menu-item-child': isChild,
    }"
    @click="handleClick"
  >
    <!-- ICON 圖示 -->
    <img v-if="item.icon" :src="getIconPath(item.icon)" :alt="item.label" class="menu-item-icon" />

    <!-- 選單文字 -->
    <span class="menu-item-label" :class="{ 'menu-item-label-child': isChild }">
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

<style scoped>
/**
 * 選單項目容器
 */
.menu-item {
  /* 尺寸：高度 32px（符合 Figma 規範，主選單項目）*/
  height: 32px;
  /* 佈局：水平排列，垂直置中 */
  display: flex;
  align-items: center;
  /* 內距：左 8px，右 0px（符合 Figma 規範，主選單項目）*/
  padding: 0px 0px 0px 8px;
  /* 間距：ICON 和文字之間 8px */
  gap: 8px;
  /* 圓角：6px */
  border-radius: 6px;
  /* 游標：指標 */
  cursor: pointer;
  /* 背景色：預設白色 */
  background-color: #ffffff;
  /* 轉場效果：背景色變化 0.15s */
  transition: background-color 0.15s ease;
}

/**
 * Hover 狀態：背景色變化
 */
.menu-item:hover {
  /* 背景色：#F1F5F9（同選中狀態） */
  background-color: #f1f5f9;
}

/**
 * 選中狀態
 */
.menu-item-active {
  /* 背景色：#F1F5F9 */
  background-color: #f1f5f9;
}

/**
 * 子選單項目（設定群組內的項目）
 */
.menu-item-child {
  /* 高度：28px（符合 Figma 規範，子選單項目）*/
  height: 28px;
  /* 內距：左右都是 8px（符合 Figma 規範，子選單項目）*/
  padding: 0px 8px 0px 8px;
}

/**
 * ICON 圖示
 */
.menu-item-icon {
  /* 尺寸：16x16px */
  width: 16px;
  height: 16px;
  /* 防止圖片縮放變形 */
  flex-shrink: 0;
}

/**
 * 選單文字（主功能項目，例如：總覽、客戶管理、環境管理）
 */
.menu-item-label {
  /* 字體顏色：#1E293B（預設狀態，深色）*/
  color: #1e293b;
  /* 字體：Noto Sans TC */
  font-family: 'Noto Sans TC', sans-serif;
  /* 字體大小：14px */
  font-size: 14px;
  /* 字體樣式：正常 */
  font-style: normal;
  /* 字體粗細：500（Medium） */
  font-weight: 500;
  /* 行高：20px */
  line-height: 20px;
  /* 文字不換行 */
  white-space: nowrap;
  /* 超出時省略 */
  overflow: hidden;
  text-overflow: ellipsis;
}

/**
 * 子選單文字（設定群組內的項目，例如：帳號管理、權限設定）
 */
.menu-item-label-child {
  /* 字體：Inter（符合 Figma 規範）*/
  font-family: 'Noto Sans TC', sans-serif;
  /* 字體粗細：400（Regular） */
  font-weight: 400;
  /* 字母間距：-0.15px */
  letter-spacing: -0.15px;
}

/**
 * 選中狀態下的文字顏色
 *
 * 注意：根據 Figma 規範，選中狀態的文字應該保持深色 #1e293b（slate-800）
 * 而未選中狀態才是中灰色 #475569（slate-600）
 * 因此這裡不需要修改顏色，保持原本的深色即可
 */
.menu-item-active .menu-item-label {
  /* 選中狀態保持深色（與 Figma 規範一致） */
  color: #1e293b;
}
</style>
