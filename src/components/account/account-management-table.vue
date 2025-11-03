<template>
  <div>
    <!-- 權限檢查：如果沒有 settings.accounts 權限，顯示無權限提示 -->
    <div
      v-if="!hasPermission"
      class="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-12 shadow-sm"
    >
      <div class="text-center">
        <svg
          class="mx-auto h-16 w-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <h3
          class="mt-4 text-lg font-semibold text-gray-900"
          style="font-family: 'Noto Sans TC', sans-serif"
        >
          無權限存取
        </h3>
        <p class="mt-2 text-sm text-gray-500" style="font-family: 'Noto Sans TC', sans-serif">
          您沒有權限查看帳號管理功能
        </p>
      </div>
    </div>

    <!-- 表格元件:有權限時顯示 -->
    <data-table
      v-else
      title="帳號列表"
      :total-count="users.length"
      :columns="columns"
      :data="users"
      :show-search="true"
      search-placeholder="搜尋..."
      :show-add-button="true"
      :show-edit-button="false"
      :show-checkbox="false"
      :show-border="false"
      :loading="isLoading"
      empty-text="目前沒有帳號資料"
      @row-view="handleView"
      @add-click="handleAdd"
    >
      <!-- 自訂狀態欄位：使用 Badge 元件 -->
      <template #statusDisplay="{ row }">
        <Badge :text="getStatusText(row)" :type="getStatusType(row)" />
      </template>

      <!-- 自訂權限欄位：多個 badge 並排顯示 -->
      <template #rolesDisplay="{ row }">
        <div class="flex flex-wrap gap-2">
          <Badge v-for="(role, index) in row.roles" :key="index" :text="role" type="default" />
        </div>
      </template>
    </data-table>

    <!-- 錯誤訊息顯示 -->
    <div
      v-if="errorMessage && hasPermission"
      class="mt-4 rounded-lg border border-red-200 bg-red-50 p-4"
    >
      <div class="flex items-start">
        <svg class="h-5 w-5 flex-shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="ml-3">
          <h3
            class="text-sm font-medium text-red-800"
            style="font-family: 'Noto Sans TC', sans-serif"
          >
            載入失敗
          </h3>
          <p class="mt-1 text-sm text-red-700" style="font-family: 'Noto Sans TC', sans-serif">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Badge from '@/components/common/badge.vue'
import DataTable from '@/components/table/data-table.vue'
import { userService } from '@/services/user.service'
import { useAuthStore } from '@/stores/auth.store'
import type { UserListItem } from '@/types/user'
import type { ColumnConfig } from '@/types/table'
import { formatDateDot } from '@/utils/time'

/**
 * 帳號管理表格元件
 *
 * 功能：
 * - 顯示所有帳號列表
 * - 權限檢查（需要 settings.accounts 權限）
 * - 自動載入資料
 * - 支援搜尋
 * - 點擊「查看」按鈕發出事件
 *
 * 使用範例：
 * <account-management-table @row-view="handleViewUser" />
 */

// ===== Emits 定義 =====
const emit = defineEmits<{
  'row-view': [row: Record<string, unknown>] // 查看按鈕點擊事件
  add: [] // 新增按鈕點擊事件
}>()

// ===== 狀態管理 =====

/**
 * 認證 Store（用於權限檢查）
 */
const authStore = useAuthStore()

/**
 * 載入狀態
 */
const isLoading = ref(false)

/**
 * 錯誤訊息
 */
const errorMessage = ref<string | null>(null)

/**
 * 帳號列表資料
 * 注意：資料會被格式化，新增 createdAtFormatted 欄位
 */
const users = ref<Array<UserListItem & { createdAtFormatted: string }>>([])

// ===== 權限檢查 =====

/**
 * 檢查是否有 settings.accounts 權限
 */
const hasPermission = computed(() => {
  const permissions = authStore.userInfo?.permissions || []
  return permissions.includes('settings.accounts')
})

/**
 * 取得狀態 Badge 類型（型別安全）
 */
const getStatusType = (row: Record<string, unknown>): 'success' | 'default' => {
  return row.statusCode === 'ACTIVE' ? 'success' : 'default'
}

/**
 * 取得狀態文字（型別安全）
 */
const getStatusText = (row: Record<string, unknown>): string => {
  return row.statusCode === 'ACTIVE' ? '啟用' : '停用'
}

// ===== 欄位配置 =====

/**
 * 表格欄位配置
 * 根據 FIGMA 設計規範配置欄位寬度和對齊方式
 *
 * 重要修正：
 * 1. 狀態欄位使用 customRender: 'badge' 搭配 badgeConfig（綠色/灰色）
 * 2. 角色欄位也使用 customRender: 'badge'（灰色標籤）
 * 3. 建立日期使用 createdAtFormatted（已格式化為 YYYY.MM.DD）
 * 4. 操作欄位設定 align: 'right' 讓按鈕靠右
 */
const columns = ref<ColumnConfig[]>([
  {
    key: 'name',
    label: '姓名',
    width: '120px',
    align: 'left',
    sortable: true,
  },
  {
    key: 'loginId',
    label: '帳號',
    width: '120px',
    align: 'left',
    sortable: false,
  },
  {
    key: 'rolesDisplay',
    label: '權限',
    width: '200px',
    align: 'center',
    sortable: false,
    customRender: 'slot', // 使用 slot 來顯示多個 badge
    slotName: 'rolesDisplay',
  },
  {
    key: 'statusDisplay',
    label: '狀態',
    width: '160px',
    align: 'center',
    sortable: true,
    customRender: 'slot',
    slotName: 'statusDisplay',
  },
  {
    key: 'createdAtFormatted',
    label: '建立日',
    width: '120px',
    align: 'left',
    sortable: false,
  },
  {
    key: 'actions',
    label: '操作',
    width: '120px',
    align: 'right',
    customRender: 'actions',
  },
])

// ===== 載入資料 =====

/**
 * 載入帳號列表
 * 從 API 取得所有帳號資料
 *
 * 邏輯：
 * 1. 檢查權限，如果沒有權限則不呼叫 API
 * 2. 呼叫 userService.getAllUsers()
 * 3. 處理成功/失敗情況
 * 4. 格式化日期
 * 5. 顯示錯誤訊息（如果失敗）
 */
const loadUsers = async () => {
  // 如果沒有權限，不呼叫 API
  if (!hasPermission.value) {
    return
  }

  isLoading.value = true
  errorMessage.value = null

  try {
    const response = await userService.getAllUsers()

    console.log('getAllUsers response:' + JSON.stringify(response))

    if (response.success && response.data) {
      // 格式化資料：格式化建立日期為 YYYY.MM.DD
      users.value = response.data.map((user) => ({
        ...user,
        // 格式化建立日期為 YYYY.MM.DD
        createdAtFormatted: formatDateDot(user.createdAt),
      }))
    } else {
      errorMessage.value = response.message || '載入帳號列表失敗'
    }
  } catch (error) {
    console.error('載入帳號列表錯誤:', error)
    errorMessage.value = error instanceof Error ? error.message : '發生未知錯誤，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

// ===== 事件處理 =====

/**
 * 處理查看按鈕點擊
 * 發出 row-view 事件，由父元件處理
 *
 * @param row 帳號資料
 */
const handleView = (row: Record<string, unknown>) => {
  emit('row-view', row)
}

/**
 * 處理新增按鈕點擊
 * 發出 add 事件,由父元件處理
 */
const handleAdd = () => {
  emit('add')
}

// ===== 初始化 =====

/**
 * 元件掛載時自動載入資料
 */
onMounted(() => {
  loadUsers()
})

/**
 * 對外暴露方法（供父元件呼叫）
 */
defineExpose({
  /**
   * 重新載入資料
   * 用於新增、編輯、刪除後刷新列表
   */
  refresh: loadUsers,
})
</script>
