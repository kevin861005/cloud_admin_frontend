<template>
  <Drawer :is-open="isOpen" @close="handleClose">
    <!-- 載入狀態 -->
    <Loading v-if="isLoading" message="載入資料中..." :show-spinner="true" />

    <!-- 錯誤狀態 -->
    <Alert v-else-if="error" type="error" title="載入失敗" :description="error" />

    <!-- 資料顯示 -->
    <template v-else-if="deleteRecordDetail">
      <DrawerHeader
        :title="deleteRecordDetail.customerName"
        :subtitle="deleteRecordDetail.industry"
      />

      <!-- 分隔線 -->
      <Divider />

      <!-- 詳細資訊區塊 -->
      <InfoSection title="詳細資訊" class="mb-2">
        <InfoField label="PinCode" :value="deleteRecordDetail.pinCode" />
        <InfoField label="客戶代號" :value="deleteRecordDetail.customerNo" />
        <InfoField label="PORT" :value="deleteRecordDetail.port" />
        <InfoField label="ID" :value="String(deleteRecordDetail.id)" />
        <InfoField label="合約起日" :value="deleteRecordDetail.contractStartDate" />
        <InfoField label="合約迄日" :value="deleteRecordDetail.contractEndDate" />
        <InfoField label="環境域名" :value="deleteRecordDetail.domainName" />
      </InfoSection>

      <!-- 分隔線 -->
      <Divider />

      <!-- 刪除操作區塊 -->
      <InfoSection title="刪除操作">
        <InfoField label="通知日" :value="deleteRecordDetail.notifiedDate" />
        <InfoField label="刪除日" :value="deleteRecordDetail.deleteDate" />
        <InfoField label="刪除時間" :value="deleteRecordDetail.deleteTime" />
        <InfoField label="刪除人" :value="deleteRecordDetail.deletedBy" />
      </InfoSection>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Drawer, DrawerHeader, InfoSection, InfoField } from "@/components/drawer";
import { Alert, Divider, Loading } from "@/components/common";
import { environmentService } from "@/services/environment.service";
import type { DeleteRecordDetailInfo } from "@/types/environment";

/**
 * 刪除紀錄詳細資訊 Drawer
 * 僅支援查看模式（無編輯功能）
 */

interface Props {
  /**
   * 控制 Drawer 開關狀態
   */
  isOpen: boolean;

  /**
   * 刪除紀錄 ID（用於呼叫 API）
   */
  deleteRecordId: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /**
   * 關閉 Drawer
   */
  close: [];
}>();

// ===== 狀態管理 =====

/**
 * 刪除紀錄詳細資料
 */
const deleteRecordDetail = ref<DeleteRecordDetailInfo | null>(null);

/**
 * 載入狀態
 */
const isLoading = ref(false);

/**
 * 錯誤訊息
 */
const error = ref<string | null>(null);

// ===== 方法 =====

/**
 * 載入刪除紀錄詳細資料
 */
const loadDeleteRecordDetail = async () => {
  if (!props.deleteRecordId) return;

  isLoading.value = true;
  error.value = null;
  deleteRecordDetail.value = null;

  try {
    const response = await environmentService.getDeleteRecordDetailById(props.deleteRecordId);
    deleteRecordDetail.value = response;
  } catch (err) {
    console.error("載入刪除紀錄詳細資料錯誤:", err);
    error.value = err instanceof Error ? err.message : "發生未知錯誤，請稍後再試";
  } finally {
    isLoading.value = false;
  }
};

/**
 * 處理關閉 Drawer
 */
const handleClose = () => {
  emit("close");
};

// ===== 監聽 =====

/**
 * 監聽 Drawer 開啟狀態
 * 當 Drawer 開啟且有 deleteRecordId 時，載入刪除紀錄詳細資料
 */
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.deleteRecordId) {
      loadDeleteRecordDetail();
    }
  },
  { immediate: true }
);
</script>
