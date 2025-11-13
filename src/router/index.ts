/**
 * Vue Router 配置
 *
 * 路由結構：
 * - /login: 登入頁
 * - /: 主頁佈局（包含 Container + Sidebar）
 *   - /overview: 總覽頁面
 *   - /customers: 客戶管理
 *   - /environment: 環境管理
 *   - /settings/*: 設定相關頁面
 */

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

/**
 * 擴充 RouteMeta 型別
 */
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean // 是否需要登入
    title?: string // 頁面標題
  }
}

/**
 * 路由定義
 */
const routes: RouteRecordRaw[] = [
  /**
   * 登入頁面
   */
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login-view.vue'),
    meta: {
      requiresAuth: false,
      title: '登入',
    },
  },

  /**
   * 主頁佈局（包含 Container + Sidebar）
   */
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home-view.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      /**
       * 根路徑自動跳轉到總覽
       */
      {
        path: '',
        redirect: '/overview',
      },

      /**
       * 總覽頁面
       */
      {
        path: 'overview',
        name: 'Overview',
        component: () => import('@/views/overview-view.vue'),
        meta: {
          requiresAuth: true,
          title: '總覽',
        },
      },

      /**
       * 客戶管理
       */
      {
        path: 'customers',
        name: 'Customers',
        component: () => import('@/views/customers-view.vue'),
        meta: {
          requiresAuth: true,
          title: '客戶管理',
        },
      },

      /**
       * 環境管理
       */
      {
        path: 'environment',
        name: 'Environment',
        component: () => import('@/views/environment-view.vue'),
        meta: {
          requiresAuth: true,
          title: '環境管理',
        },
      },
      /**
       * 環境管理 - 刪除紀錄
       */
      {
        path: '/environment/delete-records',
        name: 'DeleteRecords',
        component: () => import('@/views/internal/environment-delete-records.vue'),
        meta: {
          requiresAuth: true,
        },
      },

      /**
       * 設定相關頁面
       */
      {
        path: 'settings',
        children: [
          /**
           * 帳號管理
           */
          {
            path: 'accounts',
            name: 'SettingsAccounts',
            component: () => import('@/views/settings/accounts-view.vue'),
            meta: {
              requiresAuth: true,
              title: '帳號管理',
            },
          },
          /**
           * 帳號管理 - 新增帳號
           */
          {
            path: '/settings/accounts/create',
            name: 'AccountCreate',
            component: () => import('@/views/internal/account-create-view.vue'),
            meta: {
              requiresAuth: true, //
              requiredPermissions: ['settings.accounts'],
            },
          },
          /**
           * 權限設定
           */
          {
            path: 'roles',
            name: 'SettingsRoles',
            component: () => import('@/views/settings/roles-view.vue'),
            meta: {
              requiresAuth: true,
              title: '權限設定',
            },
          },
          /**
           * 模組設定
           */
          {
            path: 'modules',
            name: 'SettingsModules',
            component: () => import('@/views/settings/modules-view.vue'),
            meta: {
              requiresAuth: true,
              title: '模組設定',
            },
          },
          /**
           * 模組設定 - 新增模組
           */
          {
            path: '/settings/modules/create',
            name: 'ModuleCreate',
            component: () => import('@/views/internal/module-create-view.vue'),
            meta: {
              requiresAuth: true, //
              requiredPermissions: ['settings.modules'],
            },
          },
          /**
           * 產業別設定
           */
          {
            path: 'industries',
            name: 'SettingsIndustries',
            component: () => import('@/views/settings/industries-view.vue'),
            meta: {
              requiresAuth: true,
              title: '產業別設定',
            },
          },
          /**
           * 經銷商設定
           */
          {
            path: 'dealers',
            name: 'SettingsDealers',
            component: () => import('@/views/settings/dealers-view.vue'),
            meta: {
              requiresAuth: true,
              title: '經銷商設定',
            },
          },
        ],
      },
    ],
  },
]

/**
 * 建立 Router 實例
 *
 * 重要：base 必須設定為 '/cloudadmin/' 以匹配後端的 context-path
 * import.meta.env.BASE_URL 會自動讀取 vite.config.ts 中的 base 設定
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/**
 * 全域路由守衛
 *
 * 功能：
 * 1. 設定頁面標題
 * 2. 檢查是否需要登入
 * 3. 已登入時不允許訪問登入頁
 */
router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore()

    // 設定頁面標題
    if (to.meta.title) {
      document.title = `${to.meta.title} - Cloud Admin`
    }

    // 檢查是否需要登入（預設為需要）
    const requiresAuth = to.meta.requiresAuth !== false

    if (requiresAuth) {
      // 如果需要登入但未登入，跳轉到登入頁
      if (!authStore.isAuthenticated) {
        // 如果 localStorage 有 Token，嘗試恢復使用者資訊
        const token = localStorage.getItem('accessToken')
        if (token) {
          try {
            await authStore.restoreUserInfo()
            if (authStore.isAuthenticated) {
              // 恢復成功，繼續前往目標頁面
              next()
              return
            }
          } catch (error) {
            console.error('恢復使用者資訊失敗:', error)
          }
        }

        // 未登入或恢復失敗，跳轉到登入頁
        next({ name: 'Login', query: { redirect: to.fullPath } })
      } else {
        // 已登入，繼續前往目標頁面
        next()
      }
    } else {
      // 不需要登入的頁面
      if (to.name === 'Login' && authStore.isAuthenticated) {
        // 已登入時不允許訪問登入頁，跳轉到首頁
        next({ name: 'Home' })
      } else {
        next()
      }
    }
  },
)

export default router
