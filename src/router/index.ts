/**
 * Vue Router 配置
 *
 * 路由結構：
 * - /login: 登入頁
 * - /: 主頁佈局（包含 Container + Sidebar）
 *   - /overview: 總覽頁面
 *   - /customers: 客戶管理
 *   - /customers/:id/detail: 客戶詳細頁面
 *   - /customers/:id/edit: 客戶編輯頁面
 *   - /environments: 環境管理
 *   - /environments/delete-records: 環境刪除紀錄
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
    requiresAuth?: boolean
    requiredPermissions?: string[]
    title?: string
  }
}

/**
 * 路由定義
 */
const routes: RouteRecordRaw[] = [
  // ===== 登入頁面 =====
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login-view.vue'),
    meta: {
      requiresAuth: false,
      title: '登入',
    },
  },

  // ===== 主頁佈局 =====
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home-view.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      // 根路徑自動跳轉到總覽
      {
        path: '',
        redirect: '/overview',
      },

      // ----- 總覽 -----
      {
        path: 'overview',
        name: 'Overview',
        component: () => import('@/views/overview-view.vue'),
        meta: {
          requiresAuth: true,
          title: '總覽',
        },
      },

      // ----- 客戶管理 -----
      {
        path: 'customers',
        name: 'Customers',
        component: () => import('@/views/customers-view.vue'),
        meta: {
          requiresAuth: true,
          title: '客戶管理',
        },
      },
      {
        path: 'customers/:id/detail',
        name: 'CustomerDetail',
        component: () => import('@/views/internal/customer-detail-view.vue'),
        meta: {
          requiresAuth: true,
          title: '客戶詳細資訊',
        },
      },
      {
        path: 'customers/:id/edit',
        name: 'CustomerEdit',
        component: () => import('@/views/internal/customer-edit-view.vue'),
        meta: {
          requiresAuth: true,
          title: '修改客戶資料',
        },
      },

      // ----- 環境管理 -----
      {
        path: 'environments',
        name: 'Environments',
        component: () => import('@/views/environments-view.vue'),
        meta: {
          requiresAuth: true,
          title: '環境管理',
        },
      },
      {
        path: 'environments/delete-records',
        name: 'DeleteRecords',
        component: () => import('@/views/internal/environment-delete-records.vue'),
        meta: {
          requiresAuth: true,
          title: '刪除紀錄',
        },
      },

      // ----- 設定 -----
      {
        path: 'settings',
        children: [
          // 帳號管理
          {
            path: 'accounts',
            name: 'SettingsAccounts',
            component: () => import('@/views/settings/accounts-view.vue'),
            meta: {
              requiresAuth: true,
              title: '帳號管理',
            },
          },
          {
            path: 'accounts/create',
            name: 'AccountCreate',
            component: () => import('@/views/internal/account-create-view.vue'),
            meta: {
              requiresAuth: true,
              requiredPermissions: ['settings.accounts'],
              title: '新增帳號',
            },
          },

          // 模組設定
          {
            path: 'modules',
            name: 'SettingsModules',
            component: () => import('@/views/settings/modules-view.vue'),
            meta: {
              requiresAuth: true,
              title: '模組設定',
            },
          },
          {
            path: 'modules/create',
            name: 'ModuleCreate',
            component: () => import('@/views/internal/module-create-view.vue'),
            meta: {
              requiresAuth: true,
              requiredPermissions: ['settings.modules'],
              title: '新增模組',
            },
          },

          // 產業別設定
          {
            path: 'industries',
            name: 'SettingsIndustries',
            component: () => import('@/views/settings/industries-view.vue'),
            meta: {
              requiresAuth: true,
              title: '產業別設定',
            },
          },
          {
            path: 'industries/create',
            name: 'IndustryCreate',
            component: () => import('@/views/internal/industry-create-view.vue'),
            meta: {
              requiresAuth: true,
              requiredPermissions: ['settings.industries'],
              title: '新增產業別',
            },
          },

          // 經銷商設定
          {
            path: 'dealers',
            name: 'SettingsDealers',
            component: () => import('@/views/settings/dealers-view.vue'),
            meta: {
              requiresAuth: true,
              title: '經銷商設定',
            },
          },
          {
            path: 'dealers/create',
            name: 'DealerCreate',
            component: () => import('@/views/internal/dealer-create-view.vue'),
            meta: {
              requiresAuth: true,
              requiredPermissions: ['settings.dealers'],
              title: '新增經銷商',
            },
          },
        ],
      },
    ],
  },
]

/**
 * 建立 Router 實例
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/**
 * 全域路由守衛
 */
router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore()

    // 設定頁面標題
    if (to.meta.title) {
      document.title = `${to.meta.title} - Cloud Admin`
    }

    // 檢查是否需要登入
    const requiresAuth = to.meta.requiresAuth !== false

    if (requiresAuth) {
      if (!authStore.isAuthenticated) {
        // 嘗試從 localStorage 恢復登入狀態
        const token = localStorage.getItem('accessToken')
        if (token) {
          try {
            await authStore.restoreUserInfo()
            if (authStore.isAuthenticated) {
              next()
              return
            }
          } catch (error) {
            console.error('恢復使用者資訊失敗:', error)
          }
        }

        // 未登入，跳轉到登入頁
        next({ name: 'Login', query: { redirect: to.fullPath } })
      } else {
        next()
      }
    } else {
      // 已登入時不允許訪問登入頁
      if (to.name === 'Login' && authStore.isAuthenticated) {
        next({ name: 'Home' })
      } else {
        next()
      }
    }
  },
)

export default router
