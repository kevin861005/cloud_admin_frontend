<template>
  <!-- 群組選單容器 -->
  <div class="menu-group">
    <!-- 群組標題（可點擊展開/收合） -->
    <div
      class="menu-group-header"
      :class="{ 'menu-group-header-expanded': isExpanded }"
      @click="handleToggle"
    >
      <!-- ICON 圖示 -->
      <img
        v-if="item.icon"
        :src="getIconPath(item.icon)"
        :alt="item.label"
        class="menu-group-icon"
      />

      <!-- 群組標題文字 -->
      <span class="menu-group-label">{{ item.label }}</span>
    </div>

    <!-- 子選單列表（展開時顯示） -->
    <div v-if="isExpanded" class="menu-group-children">
      <template v-for="child in filteredChildren" :key="child.key">
        <!-- 分隔線（設定檔） -->
        <div v-if="child.type === 'divider'" class="menu-divider">
          <span class="menu-divider-label">{{ child.label }}</span>
        </div>

        <!-- 子選單項目 -->
        <SidebarMenuItem
          v-else
          :item="child"
          :is-child="true"
          @click="handleChildClick(child.key)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 群組選單元件
 *
 * 用於顯示可展開/收合的選單群組（例如：設定）
 */

import { computed } from 'vue'
import { useMenuStore } from '@/stores/menu.store'
import SidebarMenuItem from './sidebar-menuitem.vue'
import type { MenuItem } from '@/types/menu'

// ==================== Props ====================

interface Props {
  /** 群組選單項目資料 */
  item: MenuItem
  /** 使用者擁有的權限清單（用於過濾子選單） */
  userPermissions: string[]
}

const props = defineProps<Props>()

// ==================== Emits ====================

const emit = defineEmits<{
  /** 子選單項目被點擊 */
  itemClick: [key: string]
}>()

// ==================== Stores ====================

const menuStore = useMenuStore()

// ==================== Computed ====================

/**
 * 判斷群組是否已展開
 */
const isExpanded = computed(() => {
  return menuStore.isGroupExpanded(props.item.key)
})

/**
 * 根據使用者權限過濾後的子選單
 */
const filteredChildren = computed(() => {
  if (!props.item.children) {
    return []
  }

  return props.item.children.filter((child) => {
    // 分隔線不需要權限檢查，直接顯示
    if (child.type === 'divider') {
      return true
    }

    // 檢查是否有權限
    const requiredPermissions = child.requiredPermissions || []
    if (requiredPermissions.length === 0) {
      return true
    }

    // 只要使用者擁有其中任一權限，就顯示該項目
    return requiredPermissions.some((permission) => props.userPermissions.includes(permission))
  })
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
 * 處理群組標題點擊（展開/收合）
 */
function handleToggle() {
  menuStore.toggleGroup(props.item.key)
}

/**
 * 處理子選單項目點擊
 *
 * @param key 子選單項目的 key
 */
function handleChildClick(key: string) {
  emit('itemClick', key)
}
</script>

<style scoped>
/**
 * 群組選單容器
 */
.menu-group {
  /* 佈局：垂直排列 */
  display: flex;
  flex-direction: column;
}

/**
 * 群組標題（可點擊展開/收合）
 */
.menu-group-header {
  /* 尺寸：高度 32px（符合 Figma 規範）*/
  height: 32px;
  /* 佈局：水平排列，垂直置中 */
  display: flex;
  align-items: center;
  /* 內距：左 8px，右 8px（符合 Figma 規範）*/
  padding: 0px 8px 0px 8px;
  /* 間距：ICON、文字、箭頭之間 8px */
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
.menu-group-header:hover {
  /* 背景色：#F1F5F9 */
  background-color: #f1f5f9;
}


/**
 * 群組 ICON 圖示
 */
.menu-group-icon {
  /* 尺寸：16x16px */
  width: 16px;
  height: 16px;
  /* 防止圖片縮放變形 */
  flex-shrink: 0;
}

/**
 * 群組標題文字
 */
.menu-group-label {
  /* 自動填滿剩餘空間 */
  flex: 1;
  /* 字體顏色：#1E293B */
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
 * 子選單列表容器
 */
.menu-group-children {
  /* 佈局：垂直排列 */
  display: flex;
  flex-direction: column;
  /* 項目之間的間距：4px */
  gap: 4px;
  /* 上外距：4px */
  margin-top: 4px;
  /* 左側邊框：整個子選單容器統一的 border */
  border-left: 1px solid #e2e8f0;
  /* 左外距：15px（符合 Figma 規範）*/
  margin-left: 15px;
  /* 左內距：8px（符合 Figma 規範）*/
  padding-left: 8px;
}

/**
 * 分隔線容器（設定檔）
 */
.menu-divider {
  /* 高度：24px（符合 Figma 規範） */
  height: 24px;
  /* 佈局：垂直置中 */
  display: flex;
  align-items: center;
  /* 內距：只有左側 8px（符合 Figma 規範）*/
  padding-left: 8px;
}

/**
 * 分隔線文字（設定檔）
 */
.menu-divider-label {
  /* 字體顏色：#64748B（slate-500） */
  color: #64748b;
  /* 字體：Inter Medium（符合 Figma 規範）*/
  font-family: 'Noto Sans TC', sans-serif;
  /* 字體大小：12px */
  font-size: 12px;
  /* 字體樣式：正常 */
  font-style: normal;
  /* 字體粗細：500（Medium） */
  font-weight: 500;
  /* 行高：16px */
  line-height: 16px;
}
</style>
