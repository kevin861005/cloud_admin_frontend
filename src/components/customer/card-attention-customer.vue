<template>
  <StatCard
    title="需關注客戶"
    :icon="AttentionCustomerIcon"
    :value="stats.total"
    unit="間"
    subtitle="需追蹤使用狀況"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { StatCard } from "@/components/common";
import AttentionCustomerIcon from "@/assets/icons/card/card-c-user-warning.svg";
import { customerService } from "@/services/customer.service";
import { ApiError } from "@/types/common";
import type { AttentionCustomerCountResponse } from "@/types/customer";

/** 載入狀態 */
const isLoading = ref(false);

/** 錯誤訊息 */
const errorMessage = ref("");

/**
 * 需關注客戶統計資料
 */
const stats = ref<AttentionCustomerCountResponse>({
  total: 0,
});

/**
 * 載入需關注客戶數資料
 */
async function loadAttentionCustomerCount() {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    stats.value = await customerService.getAttentionCustomerCount();
  } catch (error) {
    console.error("載入需關注客戶數失敗:", error);
    errorMessage.value = error instanceof ApiError ? error.message : "載入失敗，請稍後再試";
  } finally {
    isLoading.value = false;
  }
}

/**
 * 元件掛載時載入資料
 */
onMounted(() => {
  loadAttentionCustomerCount();
});
</script>
