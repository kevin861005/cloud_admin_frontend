<template>
  <!-- 權限檢查：如果沒有 settings.industries 權限，顯示無權限提示 -->
  <EmptyState
    v-if="!hasPermission"
    type="no-permission"
    title="無權限存取"
    description="您沒有權限查看產業別管理功能"
  />

  <data-table
    v-else
    :total-count="industries.length"
    :columns="columns"
    :data="industries"
    :show-search="true"
    :show-add-button="true"
    :loading="isLoading"
    :show-checkbox="false"
    :show-edit-button="false"
    :show-border="true"
    title="列表"
    item-name="產業別"
    row-key="code"
    empty-text="目前沒有產業別資料"
    @row-view="handleView"
    @add-click="handleAdd"
  >
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
import { Alert, EmptyState } from "@/components/common";
import DataTable from "@/components/table/data-table.vue";
import { useAuthStore } from "@/stores/auth.store";
import { industryService } from "@/services/industry.service";
import type { IndustryListItem } from "@/types/industry";
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
const industries = ref<IndustryListItem[]>([]);

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
  return permissions.includes("settings.industries");
});

// ===== 欄位配置 =====

/**
 * 表格欄位配置
 */
const columns = ref<ColumnConfig[]>([
  {
    key: "code",
    label: "編號",
    width: "15%",
    sortable: true,
  },
  {
    key: "name",
    label: "中文名稱",
    width: "25%",
    sortable: false,
  },
  {
    key: "sqlFile",
    label: "SQL檔名",
    width: "25%",
  },
  {
    key: "createdDate",
    label: "建立日",
    width: "20%",
    sortable: false,
  },
  {
    key: "actions",
    label: "操作",
    width: "15%",
    align: "center",
    customRender: "actions",
  },
]);

// ===== 載入資料 =====

/**
 * 載入產業別列表
 * 從 API 取得所有產業別資料
 *
 * 開發階段：使用 getMockIndustries() 回傳模擬資料
 * 正式環境：使用 getAllIndustries() 呼叫後端 API
 */
const loadIndustries = async () => {
  isLoading.value = true;
  try {
    industries.value = await industryService.getAllIndustries();
  } catch (error) {
    console.error("載入產業別列表錯誤:", error);
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
  loadIndustries();
});

/**
 * 對外暴露方法（供父元件呼叫）
 */
defineExpose({
  /**
   * 重新載入資料
   * 用於新增、編輯、刪除後刷新列表
   */
  refresh: loadIndustries,
});
</script>
