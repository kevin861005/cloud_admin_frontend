/**
 * Vue Router 配置
 */
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    title?: string
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login-view.vue'),
    meta: {
      requiresAuth: false,
      title: '登入',
    },
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home-view.vue'),
    meta: {
      requiresAuth: true,
      title: '首頁',
    },
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
 */
router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore()

    if (to.meta.title) {
      document.title = `${to.meta.title} - Cloud Admin`
    }

    const requiresAuth = to.meta.requiresAuth !== false

    if (requiresAuth && !authStore.isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else if (to.name === 'Login' && authStore.isAuthenticated) {
      next({ name: 'Home' })
    } else {
      next()
    }
  },
)

export default router
