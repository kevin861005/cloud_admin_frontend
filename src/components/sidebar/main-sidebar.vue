<template>
  <!-- 左側選單容器 -->
  <div class="sidebar">
    <!-- 選單標題：功能選單 -->
    <div class="sidebar-header">
      <h2 class="sidebar-title">功能選單</h2>
    </div>

    <!-- 選單項目列表 -->
    <nav class="sidebar-nav">
      <!-- Loading 狀態 -->
      <div v-if="isLoading" class="sidebar-loading">
        <p class="text-sm text-slate-500">載入選單中...</p>
      </div>

      <!-- 錯誤狀態 -->
      <div v-else-if="error" class="sidebar-error">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

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

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router' // 新增：引入路由
import { useAuthStore } from '@/stores/auth.store'
import { useMenuStore } from '@/stores/menu.store'
import { userService } from '@/services/user.service'
import { menuConfig } from '@/config/menu.config'
import SidebarMenuItem from './sidebar-menuitem.vue'
import SidebarGroup from './sidebar-group.vue'
import type { MenuItem } from '@/types/menu'

// ==================== Router ====================
const router = useRouter() // 新增：取得路由實例

// ==================== Stores ====================
const authStore = useAuthStore()
const menuStore = useMenuStore()

// ==================== State ====================

/** 使用者的權限清單 */
const userPermissions = ref<string[]>([])

/** 載入狀態 */
const isLoading = ref(false)

/** 錯誤訊息 */
const error = ref<string | null>(null)

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
  return filterMenuByPermissions(menuConfig, userPermissions.value)
})

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
      if (item.type === 'group' && item.children) {
        // 先過濾子選單
        const filteredChildren = filterMenuByPermissions(item.children, permissions)

        // 如果沒有任何子選單有權限，則不顯示整個群組
        if (filteredChildren.length === 0) {
          return null
        }

        // 返回包含過濾後子選單的群組
        return {
          ...item,
          children: filteredChildren,
        }
      }

      // 檢查是否有權限
      const hasPermission = checkPermission(item.requiredPermissions || [], permissions)

      // 如果沒有權限，返回 null（會被過濾掉）
      return hasPermission ? item : null
    })
    .filter((item): item is MenuItem => item !== null) // 移除 null 項目
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
    return true
  }

  // 只要使用者擁有其中任一權限，就返回 true
  return requiredPermissions.some((permission) => userPermissions.includes(permission))
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
  if (key.includes('divider')) {
    return
  }

  // 更新 Store 中的選中狀態
  menuStore.setActiveMenu(key)

  // 根據選單 key 決定路由路徑
  let routePath = ''

  // 處理設定群組的子選單（例如：settings.accounts）
  if (key.startsWith('settings.')) {
    // 將 settings.accounts 轉換為 /settings/accounts
    routePath = `/${key.replace('.', '/')}`
  } else {
    // 一般選單項目直接對應路由（例如：overview → /overview）
    routePath = `/${key}`
  }

  // 執行路由跳轉
  router.push(routePath)

  console.log(`選單項目被點擊: ${key}，跳轉到: ${routePath}`)
}

/**
 * 取得使用者權限
 */
async function fetchUserPermissions() {
  // 如果未登入，不執行
  if (!authStore.isAuthenticated) {
    error.value = '使用者未登入'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    // 呼叫 API 取得使用者資訊（包含權限）
    const response = await userService.getCurrentUserInfo()

    // 檢查回應是否成功
    if (response.success && response.data) {
      // 儲存權限清單
      userPermissions.value = response.data.permissions

      console.log('使用者權限:', response.data.permissions)
    } else {
      error.value = response.message || '無法取得使用者權限'
    }
  } catch (err) {
    console.error('取得使用者權限失敗:', err)
    error.value = '無法載入選單，請重新整理頁面'
  } finally {
    isLoading.value = false
  }
}

// ==================== Lifecycle ====================

/**
 * 元件掛載時取得使用者權限
 */
onMounted(() => {
  fetchUserPermissions()
})
</script>

<style scoped>
/**
 * 左側選單容器
 */
.sidebar {
  /* 尺寸：固定寬度 256px */
  width: 256px;
  /* 佈局：垂直排列 */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* 背景色：白色 */
  background-color: #ffffff;
  /* 高度：自適應內容，最小高度 684px */
  min-height: 684px;
  /* 邊框：右側淡灰色邊框（符合 Figma 規範：rgba(0, 0, 0, 0.08) */
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

/**
 * 選單標題區域
 */
.sidebar-header {
  /* 內距：上下 8px，左 8px（符合 Figma 規範 */
  padding: 8px 0px 8px 8px;
  /* 寬度：填滿容器 */
  width: 100%;
}

/**
 * 選單標題文字：功能選單
 */
.sidebar-title {
  /* 字體顏色：#1E293B 加上 70% 不透明度（B2 = 70%） */
  color: rgba(30, 41, 59, 0.7);
  /* 字體：Noto Sans TC Bold（符合 Figma 規範 */
  font-family: 'Noto Sans TC', sans-serif;
  /* 字體大小：12px（符合 Figma 規範）*/
  font-size: 12px;
  /* 字體樣式：正常 */
  font-style: normal;
  /* 字體粗細：700（Bold，符合 Figma 規範）*/
  font-weight: 700;
  /* 行高：16px（符合 Figma 規範）*/
  line-height: 16px;
  /* 字間距：0.2px（符合 Figma 規範）*/
  letter-spacing: 0.2px;
  /* 移除預設 margin */
  margin: 0;
  /* 內距：左右 8px（符合 Figma 規範） */
  padding: 0px 8px;
}

/**
 * 選單導航區域
 */
.sidebar-nav {
  /* 寬度：填滿容器 */
  width: 100%;
  /* 佈局：垂直排列 */
  display: flex;
  flex-direction: column;
  /* 項目之間的間距：4px */
  gap: 4px;
  /* 內距：只有左側 8px（符合 Figma 規範）*/
  padding: 0px 0px 0px 8px;
}

/**
 * Loading 狀態
 */
.sidebar-loading {
  padding: 20px;
  text-align: center;
}

/**
 * 錯誤狀態
 */
.sidebar-error {
  padding: 20px;
  text-align: center;
}
</style>
