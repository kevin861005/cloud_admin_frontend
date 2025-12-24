<template>
  <div>
    <PageTitle title="經銷商設定" subtitle="資訊" />

    <TableContainer>
      <DealerTable ref="tableRef" @row-view="handleView" @add="handleAdd" />
    </TableContainer>

    <DealerDetailDrawer
      :is-open="isDrawerOpen"
      :code="selectedDealerId"
      @close="closeDrawer"
      @updated="handleDealerUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { PageTitle } from "@/components/common";
import TableContainer from "@/components/table/table-container.vue";
import DealerTable from "@/components/dealer/table-dealer.vue";
import DealerDetailDrawer from "@/components/dealer/drawer-dealer-detail.vue";

// ===== Drawer 狀態 =====
const isDrawerOpen = ref(false);
const selectedDealerId = ref<string | null>(null);

const router = useRouter();

/**
 * 表格元件的 ref（用於呼叫 refresh 方法）
 */
const tableRef = ref<{ refresh: () => Promise<void> } | null>(null);

/**
 * 處理查看按鈕點擊
 * @param row 經銷商資料
 */
const handleView = (dealer: Record<string, unknown>) => {
  console.log("查看經銷商:", dealer);
  selectedDealerId.value = dealer.code as string;
  isDrawerOpen.value = true;
};

/**
 * 關閉 Drawer
 */
const closeDrawer = () => {
  isDrawerOpen.value = false;
  // 延遲清空資料,等動畫結束
  setTimeout(() => {
    selectedDealerId.value = null;
  }, 300);
};

const handleDealerUpdated = () => {
  tableRef.value?.refresh();
};

const handleAdd = () => {
  router.push("/settings/dealers/create");
};
</script>
