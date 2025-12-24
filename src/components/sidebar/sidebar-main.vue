<template>
  <!-- 左側選單容器 -->
  <div class="flex min-h-[684px] w-64 flex-col items-start border-r border-black/[0.08] bg-white">
    <!-- 選單標題：功能選單 -->
    <div class="w-full p-2">
      <h2 class="typo-xs-bold m-0 px-2 text-slate-800/70">功能選單</h2>
    </div>

    <!-- 選單項目列表 -->
    <nav class="flex w-full flex-col gap-1 px-2">
      <!-- Loading 狀態 -->
      <Loading v-if="isLoading" message="載入選單中..." />

      <!-- 錯誤狀態 -->
      <Alert v-else-if="error" type="error" title="載入失敗" :description="error" />

      <!-- 選單項目 -->
      <template v-else>
        <template v-for="item in filteredMenu" :key="item.key">
          <!-- 一般選單項目 -->
          <SidebarMenuItem
            v-if="item.type === 'item'"
            :item="item"
            @click="handleMenuClick(item.key)"
          />

          <!-- 群組選單（例如：設定） -->
          <SidebarGroup
            v-else-if="item.type === 'group'"
            :item="item"
            :user-permissions="userPermissions"
            @item-click="handleMenuClick"
          />
        </template>
      </template>
    </nav>
  </div>
</template>

<script setup lang="ts">
/**
 * 左側功能選單元件
 *
 * 功能：
 * 1. 顯示功能選單標題
 * 2. 根據使用者權限動態過濾選單項目
 * 3. 處理選單項目點擊事件並執行路由跳轉
 */

import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { userService } from "@/services/user.service";
import { menuConfig } from "@/config/menu.config";
import { Alert, Loading } from "@/components/common";
import SidebarMenuItem from "./sidebar-menuitem.vue";
import SidebarGroup from "./sidebar-group.vue";
import type { MenuItem } from "@/types/menu";

// ==================== Router ====================
const router = useRouter();

// ==================== Stores ====================
const authStore = useAuthStore();

// ==================== State ====================

/** 使用者的權限清單 */
const userPermissions = ref<string[]>([]);

/** 載入狀態 */
const isLoading = ref(false);

/** 錯誤訊息 */
const error = ref<string | null>(null);

// ==================== Computed ====================

/**
 * 根據使用者權限過濾後的選單
 *
 * 過濾規則：
 * 1. 檢查每個選單項目的 requiredPermissions
 * 2. 只要使用者擁有其中任一權限，就顯示該項目
 * 3. 如果是群組選單，還需要檢查是否有任何子選單項目有權限
 */
const filteredMenu = computed(() => {
  return filterMenuByPermissions(menuConfig, userPermissions.value);
});

// ==================== Methods ====================

/**
 * 根據權限過濾選單項目
 *
 * @param menuItems 選單項目列表
 * @param permissions 使用者擁有的權限清單
 * @returns 過濾後的選單項目列表
 */
function filterMenuByPermissions(menuItems: MenuItem[], permissions: string[]): MenuItem[] {
  return menuItems
    .map((item) => {
      // 如果是群組選單，需要遞迴過濾子選單
      if (item.type === "group" && item.children) {
        // 先過濾子選單
        const filteredChildren = filterMenuByPermissions(item.children, permissions);

        // 檢查是否有任何「非 divider」的子選單項目
        // 如果只剩下 divider，則不顯示整個群組
        const hasVisibleChildren = filteredChildren.some((child) => child.type !== "divider");

        if (!hasVisibleChildren) {
          return null;
        }

        // 返回包含過濾後子選單的群組
        return {
          ...item,
          children: filteredChildren,
        };
      }

      // 檢查是否有權限
      const hasPermission = checkPermission(item.requiredPermissions || [], permissions);

      // 如果沒有權限，返回 null（會被過濾掉）
      return hasPermission ? item : null;
    })
    .filter((item): item is MenuItem => item !== null); // 移除 null 項目
}

/**
 * 檢查使用者是否擁有所需的權限
 *
 * @param requiredPermissions 所需的權限清單
 * @param userPermissions 使用者擁有的權限清單
 * @returns true 表示有權限，false 表示無權限
 */
function checkPermission(requiredPermissions: string[], userPermissions: string[]): boolean {
  // 如果不需要任何權限（例如分隔線），直接返回 true
  if (requiredPermissions.length === 0) {
    return true;
  }

  // 只要使用者擁有其中任一權限，就返回 true
  return requiredPermissions.some((permission) => userPermissions.includes(permission));
}

/**
 * 處理選單項目點擊事件
 *
 * 功能：
 * 1. 更新 Store 中的選中狀態
 * 2. 執行路由跳轉
 *
 * @param key 選單項目的 key（例如：overview, customers, settings.accounts）
 */
function handleMenuClick(key: string) {
  // 如果是分隔線，不執行任何操作
  if (key.includes("divider")) {
    return;
  }

  // 根據選單 key 決定路由路徑
  let routePath = "";

  // 處理設定群組的子選單（例如：settings.accounts）
  if (key.startsWith("settings.")) {
    // 將 settings.accounts 轉換為 /settings/accounts
    routePath = `/${key.replace(".", "/")}`;
  } else {
    // 一般選單項目直接對應路由（例如：overview → /overview）
    routePath = `/${key}`;
  }

  // 執行路由跳轉
  router.push(routePath);

  console.log(`選單項目被點擊: ${key}，跳轉到: ${routePath}`);
}

/**
 * 取得使用者權限
 */
async function fetchUserPermissions() {
  // 如果未登入，不執行
  if (!authStore.isAuthenticated) {
    error.value = "使用者未登入";
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    // 直接拿回 UserInfo，若失敗會丟 ApiError
    const userInfo = await userService.getCurrentUserInfo();

    // 儲存權限清單
    userPermissions.value = userInfo.permissions;

    console.log("使用者權限:", userInfo.permissions);
  } catch (err) {
    console.error("取得使用者權限失敗:", err);
    error.value = "無法載入選單，請重新整理頁面";
  } finally {
    isLoading.value = false;
  }
}

// ==================== Lifecycle ====================

/**
 * 元件掛載時取得使用者權限
 */
onMounted(() => {
  fetchUserPermissions();
});
</script>
