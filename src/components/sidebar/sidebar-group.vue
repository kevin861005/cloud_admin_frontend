<template>
  <!-- 群組選單容器 -->
  <div class="flex flex-col">
    <!-- 群組標題（可點擊展開/收合） -->
    <div
      class="flex h-8 cursor-pointer items-center gap-2 rounded-md bg-white px-2 transition-colors duration-150 hover:bg-slate-100"
      @click="handleToggle"
    >
      <!-- ICON 圖示 -->
      <img
        v-if="item.icon"
        :src="getIconPath(item.icon)"
        :alt="item.label"
        class="h-4 w-4 flex-shrink-0"
      />

      <!-- 群組標題文字 -->
      <span
        class="typo-sm-medium flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-slate-800"
      >
        {{ item.label }}
      </span>
    </div>

    <!-- 子選單列表（展開時顯示） -->
    <div
      v-if="isExpanded"
      class="ml-[15px] mt-1 flex flex-col gap-1 border-l border-slate-200 pl-2"
    >
      <template v-for="child in filteredChildren" :key="child.key">
        <!-- 分隔線（設定檔） -->
        <div v-if="child.type === 'divider'" class="flex h-6 items-center pl-2">
          <span class="typo-xs-medium text-slate-500">
            {{ child.label }}
          </span>
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

import { computed } from "vue";
import { useMenuStore } from "@/stores/menu.store";
import SidebarMenuItem from "./sidebar-menuitem.vue";
import type { MenuItem } from "@/types/menu";

// ==================== Props ====================

interface Props {
  /** 群組選單項目資料 */
  item: MenuItem;
  /** 使用者擁有的權限清單（用於過濾子選單） */
  userPermissions: string[];
}

const props = defineProps<Props>();

// ==================== Emits ====================

const emit = defineEmits<{
  /** 子選單項目被點擊 */
  itemClick: [key: string];
}>();

// ==================== Stores ====================

const menuStore = useMenuStore();

// ==================== Computed ====================

/**
 * 判斷群組是否已展開
 */
const isExpanded = computed(() => {
  return menuStore.isGroupExpanded(props.item.key);
});

/**
 * 根據使用者權限過濾後的子選單
 */
const filteredChildren = computed(() => {
  if (!props.item.children) {
    return [];
  }

  return props.item.children.filter((child) => {
    // 分隔線不需要權限檢查，直接顯示
    if (child.type === "divider") {
      return true;
    }

    // 檢查是否有權限
    const requiredPermissions = child.requiredPermissions || [];
    if (requiredPermissions.length === 0) {
      return true;
    }

    // 只要使用者擁有其中任一權限，就顯示該項目
    return requiredPermissions.some((permission) => props.userPermissions.includes(permission));
  });
});

// ==================== Methods ====================

/**
 * 取得 ICON 圖示的完整路徑
 *
 * @param iconName ICON 檔名（不含路徑和副檔名）
 * @returns ICON 的完整路徑
 */
function getIconPath(iconName: string): string {
  // ICON 路徑：/src/assets/icons/menu/{iconName}.svg
  return new URL(`../../assets/icons/menu/${iconName}.svg`, import.meta.url).href;
}

/**
 * 處理群組標題點擊（展開/收合）
 */
function handleToggle() {
  menuStore.toggleGroup(props.item.key);
}

/**
 * 處理子選單項目點擊
 *
 * @param key 子選單項目的 key
 */
function handleChildClick(key: string) {
  emit("itemClick", key);
}
</script>
