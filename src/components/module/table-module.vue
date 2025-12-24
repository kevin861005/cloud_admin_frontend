<template>
  <!-- 權限檢查：如果沒有 settings.modules 權限，顯示無權限提示 -->
  <EmptyState
    v-if="!hasPermission"
    type="no-permission"
    title="無權限存取"
    description="您沒有權限查看模組管理功能"
  />

  <data-table
    v-else
    :total-count="modules.length"
    :columns="columns"
    :data="modules"
    :show-search="true"
    :show-add-button="true"
    :loading="isLoading"
    :show-checkbox="false"
    :show-edit-button="false"
    :show-border="true"
    title="列表"
    item-name="模組"
    row-key="code"
    empty-text="目前沒有模組資料"
    @row-view="handleView"
    @add-click="handleAdd"
  >
    <!-- 自訂狀態欄位：使用 Badge 元件 -->
    <template #statusDisplay="{ row }">
      <Badge :text="getStatusText(row)" :type="getStatusType(row)" />
    </template>
  </data-table>

  <!-- 錯誤訊息顯示 -->
  <Alert
    v-if="errorMessage && hasPermission"
    type="error"
    title="載入失敗"
    :description="errorMessage"
    class="mt-4"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Badge, Alert, EmptyState } from "@/components/common";
import DataTable from "@/components/table/data-table.vue";
import { useAuthStore } from "@/stores/auth.store";
import { moduleService } from "@/services/module.service";
import type { ModuleListItem } from "@/types/module";
import type { ColumnConfig } from "@/types/table";

// ===== Emits 定義 =====
const emit = defineEmits<{
  "row-view": [row: Record<string, unknown>]; // 查看詳情事件
  add: []; // 新增按鈕點擊事件
}>();

// ===== 狀態管理 =====

/**
 * 載入狀態
 */
const isLoading = ref(false);

/**
 * 認證 Store（用於權限檢查）
 */
const authStore = useAuthStore();

/**
 * 模組列表資料
 */
const modules = ref<ModuleListItem[]>([]);

/**
 * 錯誤訊息
 */
const errorMessage = ref<string | null>(null);

// ===== 權限檢查 =====

/**
 * 檢查是否有 settings.accounts 權限
 */
const hasPermission = computed(() => {
  const permissions = authStore.userInfo?.permissions || [];
  return permissions.includes("settings.modules");
});

// ===== 欄位配置 =====

/**
 * 取得狀態 Badge 類型
 */
const getStatusType = (row: Record<string, unknown>): "success" | "error" => {
  return row.isActive === true ? "success" : "error";
};

/**
 * 取得狀態顯示文字
 */
const getStatusText = (row: Record<string, unknown>): string => {
  console.log("row.isActive:", row.isActive);
  return row.isActive === true ? "啟用" : "停用";
};

/**
 * 表格欄位配置
 */
const columns = ref<ColumnConfig[]>([
  {
    key: "code",
    label: "代號",
    width: "120px",
    sortable: true,
  },
  {
    key: "name",
    label: "中文名稱",
    width: "180px",
    sortable: false,
  },
  {
    key: "statusDisplay",
    label: "狀態",
    width: "120px",
    align: "center",
    sortable: true,
    customRender: "slot",
    slotName: "statusDisplay",
    sortKey: "status",
  },
  {
    key: "createdDate",
    label: "建立日",
    width: "150px",
    sortable: false,
  },
  {
    key: "actions",
    label: "操作",
    width: "120px",
    align: "center",
    customRender: "actions",
  },
]);

// ===== 載入資料 =====

/**
 * 載入模組列表
 * 從 API 取得所有模組資料
 *
 */
const loadModules = async () => {
  if (!hasPermission.value) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  try {
    modules.value = await moduleService.getAllModules();
  } catch (error) {
    console.error("載入模組列表錯誤:", error);
    // TODO: 顯示錯誤訊息給使用者
  } finally {
    isLoading.value = false;
  }
};

// ===== 事件處理 =====

/**
 * 處理查看詳情按鈕點擊
 * 發出 row-view 事件，由父元件處理
 */
const handleView = (row: Record<string, unknown>) => {
  emit("row-view", row);
};

/**
 * 處理新增按鈕點擊
 * 發出 add 事件,由父元件處理
 */
const handleAdd = () => {
  emit("add");
};

// ===== 初始化 =====

/**
 * 元件掛載時自動載入資料
 */
onMounted(() => {
  loadModules();
});

/**
 * 對外暴露方法（供父元件呼叫）
 */
defineExpose({
  /**
   * 重新載入資料
   * 用於新增、編輯、刪除後刷新列表
   */
  refresh: loadModules,
});
</script>
