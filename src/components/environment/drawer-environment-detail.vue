<template>
  <Drawer :is-open="isOpen" @close="handleClose">
    <!-- 載入狀態 -->
    <Loading v-if="isLoading" message="載入資料中..." :show-spinner="true" />

    <!-- 錯誤狀態 -->
    <Alert v-else-if="error" type="error" title="載入失敗" :description="error" />

    <!-- 資料顯示 -->
    <template v-else-if="environmentDetail">
      <DrawerHeader :title="environmentDetail.customerName" :subtitle="environmentDetail.industry">
        <template #badge>
          <Badge :text="statusText" :type="statusBadgeType" />
        </template>
      </DrawerHeader>

      <!-- 分隔線 -->
      <Divider />

      <!-- 申請資訊區塊 -->
      <InfoSection title="申請資訊" class="mb-2">
        <InfoField label="申請日" :value="environmentDetail.appliedDate" />
        <InfoField label="通知日" :value="environmentDetail.appliedDate" />
        <InfoField label="預定刪除日" :value="environmentDetail.scheduledDeleteDate" />
      </InfoSection>

      <!-- 分隔線 -->
      <Divider />

      <!-- 環境網址區塊 -->
      <InfoSection title="環境網址" class="mb-2">
        <InfoField label="快速自動輸入" :vertical="true">
          <a
            :href="`https://${environmentDetail.autoUrl}`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-primary-500 hover:underline"
          >
            {{ environmentDetail.autoUrl }}
          </a>
        </InfoField>

        <InfoField label="前台連結" :vertical="true">
          <a
            :href="`https://${environmentDetail.frontendUrl}`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-primary-500 hover:underline"
          >
            {{ environmentDetail.frontendUrl }}
          </a>
        </InfoField>

        <InfoField label="後台連結" :vertical="true">
          <a
            :href="`https://${environmentDetail.backendUrl}`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-primary-500 hover:underline"
          >
            {{ environmentDetail.backendUrl }}
          </a>
        </InfoField>
      </InfoSection>

      <!-- 分隔線 -->
      <Divider />

      <!-- 詳細資訊區塊 -->
      <InfoSection title="詳細資訊" class="mb-2">
        <InfoField label="PinCode" :value="environmentDetail.pinCode" />
        <InfoField
          label="環境域名"
          :value="environmentDetail.domainName"
          :show-copy="true"
          @copy-success="handleCopySuccess"
          @copy-error="handleCopyError"
        />
        <InfoField label="建立日期" :value="environmentDetail.createdAt" />
        <InfoField label="使用時間" :value="environmentDetail.usageTime" />
        <InfoField label="模組">
          <Badge :text="environmentDetail.module" />
        </InfoField>
        <InfoField label="負責業務" :value="environmentDetail.salesPerson" />
      </InfoSection>

      <!-- 分隔線 -->
      <Divider />

      <!-- 客戶資訊區塊 -->
      <InfoSection title="客戶資訊">
        <InfoField label="聯絡人" :value="environmentDetail.contactPerson" />
        <InfoField label="電話" :value="environmentDetail.phone" />
        <InfoField
          label="E-mail"
          :value="environmentDetail.email"
          :show-copy="true"
          @copy-success="handleCopySuccess"
          @copy-error="handleCopyError"
        />
      </InfoSection>
    </template>

    <!-- Toast 提示（浮動在按鈕上方） -->
    <DrawerToast
      :is-visible="toast.isVisible"
      :type="toast.type"
      :message="toast.message"
      :has-button="showDeleteButton"
      @close="hideToast"
    />

    <!-- Button（固定在底部） -->
    <template #footer>
      <DrawerButton
        v-if="showDeleteButton"
        button-text="刪除環境"
        button-type="error"
        @click="handleOpenDeleteDialog"
      />
    </template>
  </Drawer>

  <!-- 刪除確認 Dialog -->
  <DialogSingleDeleteEnvironment
    v-model="showDeleteDialog"
    :customer-no="environmentDetail?.customerNo ?? ''"
    :customer-name="environmentDetail?.customerName ?? ''"
    @delete-success="handleDeleteSuccess"
    @delete-error="handleDeleteError"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  Drawer,
  DrawerHeader,
  DrawerToast,
  DrawerButton,
  InfoSection,
  InfoField,
} from "@/components/drawer";
import { Badge, Alert, Divider, Loading } from "@/components/common";
import DialogSingleDeleteEnvironment from "@/components/environment/dialog-single-delete-environment.vue";
import { environmentService } from "@/services/environment.service";
import type { EnvironmentDetailInfo } from "@/types/environment";
import { useAuthStore } from "@/stores/auth.store";
import { useDrawerToast } from "@/composables/useDrawerToast";

const authStore = useAuthStore();

/**
 * 環境詳細資訊 Drawer
 * 支援查看環境資訊和刪除環境功能
 */

interface Props {
  /**
   * 控制 Drawer 開關狀態
   */
  isOpen: boolean;

  /**
   * 環境 ID（用於呼叫 API）
   */
  environmentId: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /**
   * 關閉 Drawer
   */
  close: [];
  /**
   * 刪除成功（通知父元件刷新列表）
   */
  "delete-success": [];
}>();

// ===== 狀態管理 =====

/**
 * 環境詳細資料
 */
const environmentDetail = ref<EnvironmentDetailInfo | null>(null);

/**
 * 載入狀態
 */
const isLoading = ref(false);

/**
 * 錯誤訊息
 */
const error = ref<string | null>(null);

// ===== Toast 狀態 =====
const { toast, showToast, hideToast, resetToast } = useDrawerToast();

/**
 * 是否顯示刪除按鈕
 * 條件：管理員 且 狀態為待刪除（TO_BE_DELETED）
 */
const showDeleteButton = computed(() => {
  return authStore.isAdmin && environmentDetail.value?.status === "TO_BE_DELETED";
});

// ===== 刪除確認 Dialog 狀態 =====
const showDeleteDialog = ref(false);

// ===== 計算屬性 =====

/**
 * 狀態顯示文字
 */
const statusText = computed(() => {
  if (!environmentDetail.value) return "";

  const statusMap: Record<string, string> = {
    TO_BE_DELETED: "待刪除",
    PENDING: "申請中",
  };

  return statusMap[environmentDetail.value.status] || environmentDetail.value.status;
});

/**
 * 狀態 Badge 類型
 */
const statusBadgeType = computed(() => {
  if (!environmentDetail.value) return "default";

  const typeMap: Record<string, "success" | "error" | "default"> = {
    TO_BE_DELETED: "error",
    PENDING: "default",
  };

  return typeMap[environmentDetail.value.status] || "default";
});

// ===== Toast 方法 =====

/**
 * 處理複製成功
 */
const handleCopySuccess = () => {
  showToast("success", "已複製到剪貼簿");
};

/**
 * 處理複製失敗
 */
const handleCopyError = (errorMsg: string) => {
  showToast("error", errorMsg);
};

// ===== 載入資料 =====

/**
 * 載入環境詳細資料
 */
const loadEnvironmentDetail = async () => {
  if (!props.environmentId) return;

  isLoading.value = true;
  error.value = null;
  environmentDetail.value = null;

  try {
    const response = await environmentService.getEnvironmentDetailById(props.environmentId);
    environmentDetail.value = response;
  } catch (err) {
    console.error("載入環境詳細資料錯誤:", err);
    error.value = err instanceof Error ? err.message : "發生未知錯誤，請稍後再試";
  } finally {
    isLoading.value = false;
  }
};

// ===== Drawer 關閉 =====

/**
 * 處理關閉 Drawer
 */
const handleClose = () => {
  resetToast();
  emit("close");
};

// ===== 刪除環境功能 =====

/**
 * 開啟刪除確認 Dialog
 */
const handleOpenDeleteDialog = () => {
  showDeleteDialog.value = true;
};

/**
 * 刪除成功處理
 * 關閉 Drawer 並通知父元件刷新列表
 */
const handleDeleteSuccess = () => {
  emit("delete-success");
  emit("close");
};

/**
 * 刪除失敗處理
 * 顯示錯誤 Toast
 */
const handleDeleteError = (message: string) => {
  showToast("error", message);
};

// ===== 監聽 =====

/**
 * 監聽 Drawer 開啟狀態
 */
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.environmentId) {
      resetToast();
      loadEnvironmentDetail();
    }
  },
  { immediate: true }
);
</script>
