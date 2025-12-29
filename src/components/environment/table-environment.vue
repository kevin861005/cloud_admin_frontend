<template>
  <data-table
    :total-count="environments.length"
    :columns="columns"
    :data="environments"
    :filters="filters"
    :show-search="true"
    :show-add-button="false"
    :loading="isLoading"
    :show-checkbox="authStore.isAdmin"
    :show-edit-button="false"
    :show-border="true"
    :batch-actions="batchActions"
    :is-checkbox-disabled="isCheckboxDisabled"
    :checkbox-disabled-tooltip="getCheckboxDisabledTooltip"
    title="列表"
    item-name="環境"
    row-key="id"
    v-model:selected-ids="selectedIds"
    @row-view="handleView"
    @batch-action="handleBatchAction"
  >
    <!-- 自訂狀態欄位：使用 Badge 元件 -->
    <template #statusDisplay="{ row }">
      <Badge :text="getStatusText(row)" :type="getStatusType(row)" />
    </template>
  </data-table>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { Badge } from "@/components/common";
import DataTable from "@/components/table/data-table.vue";
import { environmentService } from "@/services/environment.service";
import type { EnvironmentListItem } from "@/types/environment";
import type { ColumnConfig, FilterConfig, BatchActionConfig } from "@/types/table";

// ===== 權限判斷 =====

const authStore = useAuthStore();

// ===== Emits 定義 =====
const emit = defineEmits<{
  "row-view": [row: Record<string, unknown>]; // 查看詳情事件
  "batch-action": [actionKey: string, selectedRows: Record<string, unknown>[]]; // 批量操作事件
}>();

// ===== 狀態管理 =====

/**
 * 載入狀態
 */
const isLoading = ref(false);

/**
 * 環境列表資料（原始）
 */
const environments = ref<EnvironmentListItem[]>([]);

/**
 * 選取的環境 ID
 */
const selectedIds = ref<(string | number)[]>([]);

// ===== 動態篩選器選項 =====

/**
 * 從資料中取得不重複的值作為篩選選項
 * @param key - 資料欄位名稱
 * @param labelMap - 值與顯示文字的對應（可選）
 */
const getDistinctOptions = (
  key: keyof EnvironmentListItem,
  labelMap?: Record<string, string>
): { label: string; value: string }[] => {
  // 取得所有不重複的值
  const values = [...new Set(environments.value.map((item) => item[key]))];

  // 轉換為選項格式
  const options = values.map((value) => {
    const strValue = value === null || value === undefined || value === "" ? "" : String(value);
    const label = strValue === "" ? "(空白)" : (labelMap?.[strValue] ?? strValue);
    return { label, value: strValue };
  });

  // 排序：空白放最後，其他按字母排序
  options.sort((a, b) => {
    if (a.value === "") return 1;
    if (b.value === "") return -1;
    return a.label.localeCompare(b.label, "zh-TW");
  });

  // 加入「全部」選項
  return [{ label: "全部", value: "all" }, ...options];
};

/**
 * 狀態值與顯示文字的對應
 */
const statusLabelMap: Record<string, string> = {
  PENDING: "申請中",
  NOTIFIED: "已通知",
  TO_BE_DELETED: "待刪除",
};

/**
 * 動態篩選器配置
 * 根據 environments 資料動態產生選項
 */
const filters = computed<FilterConfig[]>(() => [
  {
    key: "status",
    label: "狀態:",
    options: getDistinctOptions("status", statusLabelMap),
    defaultValue: "all",
  },
  {
    key: "applicant",
    label: "申請人:",
    options: getDistinctOptions("applicant"),
    defaultValue: "all",
  },
]);

// ===== 欄位配置 =====

/**
 * 取得狀態 Badge 類型
 */
const getStatusType = (row: Record<string, unknown>): "success" | "error" | "default" => {
  const status = row.status as string;
  if (status === "NOTIFIED") return "success";
  if (status === "TO_BE_DELETED") return "error";
  return "default"; // PENDING
};

/**
 * 取得狀態顯示文字
 */
const getStatusText = (row: Record<string, unknown>): string => {
  switch (row.status) {
    case "PENDING":
      return "申請中";
    case "TO_BE_DELETED":
      return "待刪除";
    default:
      return "-";
  }
};

/**
 * 表格欄位配置
 */
const columns = ref<ColumnConfig[]>([
  {
    key: "customerName",
    label: "客戶",
    width: "18%",
    sortable: false,
  },
  {
    key: "statusDisplay",
    label: "狀態",
    width: "10%",
    align: "center",
    sortable: true,
    customRender: "slot",
    slotName: "statusDisplay",
    sortKey: "status",
  },
  {
    key: "appliedDate",
    label: "申請日",
    width: "14%",
    sortable: true,
  },
  {
    key: "notifiedDate",
    label: "通知日",
    width: "14%",
    sortable: true,
  },
  {
    key: "scheduledDeleteDate",
    label: "預定刪除日",
    width: "14%",
    sortable: true,
  },
  {
    key: "applicant",
    label: "申請人",
    width: "12%",
    sortable: true,
  },
  {
    key: "actions",
    label: "操作",
    width: "8%",
    align: "center",
    customRender: "actions",
  },
]);

// ===== 批量操作配置 =====

/**
 * 批量操作按鈕配置
 * 只保留環境刪除功能
 */
const batchActions: BatchActionConfig[] = [
  {
    key: "delete",
    label: "環境刪除",
    type: "delete",
    confirmMessage: "確定要刪除選中的環境嗎？此操作無法復原。",
  },
];

// ===== Checkbox Disabled 功能 =====

/**
 * 判斷 checkbox 是否 disabled
 * status=PENDING 的項目不可選取（尚未到預定刪除日）
 */
const isCheckboxDisabled = (row: Record<string, unknown>): boolean => {
  return row.status === "PENDING";
};

/**
 * 取得 checkbox disabled 時的提示文字
 * 顯示預定刪除日期
 */
const getCheckboxDisabledTooltip = (row: Record<string, unknown>): string => {
  const deleteDate = row.scheduledDeleteDate as string;
  if (deleteDate && deleteDate !== "-") {
    return `尚未到預定刪除日 ${deleteDate}，不可刪除`;
  }
  return "尚未到預定刪除日，不可刪除";
};

// ===== 載入資料 =====

/**
 * 載入環境列表
 * 從 API 取得所有環境資料
 */
const loadEnvironments = async () => {
  isLoading.value = true;
  try {
    environments.value = await environmentService.getAllEnvironments();
  } catch (error) {
    console.error("載入環境列表錯誤:", error);
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
 * 處理批量操作
 * 發出 batch-action 事件，由父元件處理
 */
const handleBatchAction = (actionKey: string, selectedRows: Record<string, unknown>[]) => {
  emit("batch-action", actionKey, selectedRows);
};

// ===== 初始化 =====

/**
 * 元件掛載時自動載入資料
 */
onMounted(() => {
  loadEnvironments();
});

/**
 * 對外暴露方法（供父元件呼叫）
 */
defineExpose({
  /**
   * 重新載入資料
   * 用於新增、編輯、刪除後刷新列表
   */
  refresh: loadEnvironments,

  /**
   * 清空選取狀態
   */
  clearSelection: () => {
    selectedIds.value = [];
  },
});
</script>
