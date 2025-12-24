<template>
  <StatCard
    title="待刪除"
    :icon="DeleteIcon"
    :value="pendingDeletionCount"
    unit="間"
    subtitle="通知後+3日"
    button-text="刪除紀錄"
    @button-click="handleViewDetails"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { StatCard } from "@/components/common";
import DeleteIcon from "@/assets/icons/card/card-e-pending-delete.svg";
import { environmentService } from "@/services/environment.service";

const router = useRouter();

/** 待刪除客戶數 */
const pendingDeletionCount = ref(0);

/**
 * 取得待刪除客戶數
 */
const fetchPendingDeletionCount = async () => {
  try {
    const data = await environmentService.getPendingDeletionCount();
    pendingDeletionCount.value = data.total;
  } catch (error) {
    console.error("取得待刪除客戶數失敗:", error);
  }
};

/**
 * 查看詳情按鈕點擊處理
 */
const handleViewDetails = () => {
  router.push("/environments/delete-records");
};

onMounted(() => {
  fetchPendingDeletionCount();
});
</script>
