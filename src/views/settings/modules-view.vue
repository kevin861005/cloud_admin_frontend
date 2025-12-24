<template>
  <div>
    <PageTitle title="模組設定" subtitle="使用模組" />

    <TableContainer>
      <ModuleTable ref="tableRef" @row-view="handleView" @add="handleAdd" />
    </TableContainer>

    <ModuleDetailDrawer
      :is-open="isDrawerOpen"
      :code="selectedCode"
      @close="handleCloseDrawer"
      @updated="handleModuleUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { PageTitle } from "@/components/common";
import TableContainer from "@/components/table/table-container.vue";
import ModuleTable from "@/components/module/table-module.vue";
import ModuleDetailDrawer from "@/components/module/drawer-module-detail.vue";

const router = useRouter();

const tableRef = ref<{ refresh: () => Promise<void> } | null>(null);

/**
 * 選中的模組 ID
 */
const selectedCode = ref<string | null>(null);

/**
 * Drawer 開啟狀態
 */
const isDrawerOpen = ref(false);

/**
 * 處理查看模組
 * 開啟 Drawer 顯示模組詳情
 */
const handleView = (module: Record<string, unknown>) => {
  console.log("查看模組:", module);

  // 設定選中的模組資料並開啟 Drawer
  selectedCode.value = module.code as string;
  isDrawerOpen.value = true;
};

/**
 * 處理關閉 Drawer
 */
const handleCloseDrawer = () => {
  isDrawerOpen.value = false;
  // 延遲清空資料，避免 Drawer 關閉動畫時資料消失
  setTimeout(() => {
    selectedCode.value = null;
  }, 300);
};

/**
 * 處理模組更新成功
 * 重新載入表格資料
 */
const handleModuleUpdated = () => {
  // 重新載入表格
  tableRef.value?.refresh();
};

/**
 * 處理新增模組
 * 跳轉到新增模組頁面
 */
const handleAdd = () => {
  console.log("跳轉到新增模組頁面");
  router.push("/settings/modules/create");
};
</script>
