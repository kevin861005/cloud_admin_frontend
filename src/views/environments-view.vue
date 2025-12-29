<template>
  <div>
    <PageTitle title="環境管理" subtitle="刪除作業" />

    <CardContainer>
      <!-- 申請中卡片 -->
      <CardPending />

      <!-- 待刪除卡片 -->
      <CardToDelete />
    </CardContainer>

    <TableContainer>
      <EnvironmentTable ref="tableRef" @row-view="handleView" @batch-action="handleBatchAction" />
    </TableContainer>

    <!-- 環境詳細資訊 Drawer -->
    <EnvironmentDetailDrawer
      :is-open="isDrawerOpen"
      :environment-id="selectedEnvironmentId"
      @close="handleCloseDrawer"
      @delete-success="handleDeleteSuccess"
    />

    <!-- 批次刪除 Dialog -->
    <DialogBatchDeleteEnvironment
      v-model="showBatchDeleteDialog"
      :customer-nos="selectedCustomerNos"
      @delete-success="handleBatchDeleteSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PageTitle, CardContainer } from "@/components/common";
import CardPending from "@/components/environment/card-pending.vue";
import CardToDelete from "@/components/environment/card-to-delete.vue";
import TableContainer from "@/components/table/table-container.vue";
import EnvironmentTable from "@/components/environment/table-environment.vue";
import EnvironmentDetailDrawer from "@/components/environment/drawer-environment-detail.vue";
import DialogBatchDeleteEnvironment from "@/components/environment/dialog-batch-delete-environment.vue";

// ===== 元件參照 =====

/**
 * 表格元件參照（用於呼叫 refresh 等方法）
 */
const tableRef = ref<InstanceType<typeof EnvironmentTable> | null>(null);

// ===== Drawer 狀態 =====

/**
 * 選中的環境 ID
 */
const selectedEnvironmentId = ref<string | null>(null);

/**
 * Drawer 開啟狀態
 */
const isDrawerOpen = ref(false);

// ===== 批次刪除 Dialog 狀態 =====

/**
 * 批次刪除 Dialog 開啟狀態
 */
const showBatchDeleteDialog = ref(false);

/**
 * 選中要刪除的客戶編號陣列
 */
const selectedCustomerNos = ref<string[]>([]);

// ===== 事件處理 =====

/**
 * 處理查看環境
 * 開啟 Drawer 顯示環境詳情
 */
const handleView = (row: Record<string, unknown>) => {
  selectedEnvironmentId.value = String(row.id);
  isDrawerOpen.value = true;
};

/**
 * 處理關閉 Drawer
 */
const handleCloseDrawer = () => {
  isDrawerOpen.value = false;
  // 延遲清空 ID，避免 Drawer 關閉動畫時資料消失
  setTimeout(() => {
    selectedEnvironmentId.value = null;
  }, 300);
};

/**
 * 處理單一刪除成功（從 Drawer 觸發）
 * 刷新表格資料（Toast 由 Drawer 內部透過 URL query 處理）
 */
const handleDeleteSuccess = () => {
  tableRef.value?.refresh();
};

/**
 * 處理批量操作
 * 根據 actionKey 執行對應操作
 */
const handleBatchAction = (actionKey: string, selectedRows: Record<string, unknown>[]) => {
  if (actionKey === "delete") {
    // 取得選中的客戶編號
    selectedCustomerNos.value = selectedRows.map((row) => String(row.customerNo));
    // 開啟批次刪除 Dialog
    showBatchDeleteDialog.value = true;
  }
};

/**
 * 處理批次刪除成功
 * 清空選取狀態並刷新表格（Toast 由 Dialog 內部透過 URL query 處理）
 */
const handleBatchDeleteSuccess = () => {
  // 清空選取狀態
  tableRef.value?.clearSelection();
  // 刷新表格
  tableRef.value?.refresh();
};
</script>
