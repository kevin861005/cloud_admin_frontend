<template>
  <div class="flex h-[256px] flex-col rounded-lg bg-white p-6 shadow-md">
    <!--
      Contents-Text: 文字內容區域
      - flex-1 + min-h-0 + overflow-hidden：限制高度不超出
    -->
    <div class="flex min-h-0 flex-1 flex-col gap-8">
      <!--
        Card-Top: 頂部區域 (標題 + 總數)
      -->
      <div class="flex flex-shrink-0 items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-8 w-8 flex-col items-start rounded-md">
            <img
              src="@/assets/icons/card/card-d-warning-filled.svg"
              alt="異常警示"
              class="h-full w-full"
            />
          </div>
          <span class="typo-base-bold text-neutral-700">異常警示</span>
        </div>

        <span v-if="alertData.totalCount > 0" class="typo-2xl-bold text-neutral-800">
          {{ alertData.totalCount }}筆
        </span>
      </div>

      <!--
        Item-Text Section: 異常警示列表 / 無資料狀態
        - flex-1 + min-h-0：允許內容區域縮小
      -->
      <div class="min-h-0 flex-1">
        <template v-if="alertData.alerts.length > 0">
          <div class="flex flex-col gap-2">
            <div
              v-for="alert in alertData.alerts.slice(0, 3)"
              :key="alert.id"
              class="hover-bg flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <span
                  class="typo-xs-bold inline-flex h-6 items-center justify-center whitespace-nowrap rounded border px-3"
                  :style="{
                    backgroundColor: getAlertStyle(alert.type).bgColor,
                    borderColor: getAlertStyle(alert.type).borderColor,
                    color: getAlertStyle(alert.type).textColor,
                  }"
                >
                  {{ getAlertStyle(alert.type).label }}
                </span>

                <span class="typo-sm-medium text-right text-neutral-700">
                  {{ alert.occurredAt }}
                </span>
              </div>

              <span class="typo-sm-medium text-neutral-700">
                {{ alert.customerName }}
              </span>
            </div>
          </div>
        </template>

        <!-- 無資料狀態：使用 h-full 填滿可用空間並置中 -->
        <div v-else class="flex h-full items-center justify-center">
          <EmptyState variant="inline" type="no-data" title="暫無異常警示" description="" />
        </div>
      </div>
    </div>

    <!--
      Bottom BAR: 底部區域（更新時間 + 更多按鈕）
      - flex-shrink-0：確保不會被壓縮
      - mt-5：與上方內容保持間距
    -->
    <div class="mt-5 flex h-6 flex-shrink-0 items-center justify-between">
      <div class="flex h-6 items-center gap-2">
        <span class="typo-sm-medium text-neutral-600">更新時間：</span>
        <span class="typo-sm-medium text-neutral-600">
          {{ updateTime }}
        </span>
      </div>

      <BadgeButton v-if="alertData.totalCount > 3" text="更多" @click="handleMoreClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { overviewService } from "@/services/overview.service";
import type { AlertListData, AlertType } from "@/types/overview";
import { BadgeButton, EmptyState } from "@/components/common";

/**
 * 異常警示資料
 */
const alertData = ref<AlertListData>({
  alerts: [],
  totalCount: 0,
});

/**
 * 更新時間
 */
const updateTime = ref<string>("--:--");

/**
 * 根據異常類型返回對應的標籤樣式和文字
 */
const getAlertStyle = (type: AlertType) => {
  const config = {
    CREATE_FAILED: {
      label: "建立失敗",
      bgColor: "#FD58580D",
      borderColor: "#FD58581A",
      textColor: "#FD5858",
    },
    RUNTIME_ERROR: {
      label: "運行異常",
      bgColor: "#F3F4F6",
      borderColor: "#E4E6EA",
      textColor: "#6B7280",
    },
  };

  return config[type] || config.RUNTIME_ERROR;
};

/**
 * 格式化時間
 */
const formatUpdateTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("時間格式化失敗:", error);
    return "--:--";
  }
};

/**
 * 點擊「更多」按鈕
 */
const handleMoreClick = () => {
  alert("跳轉到完整異常警示列表（尚未實作）");
};

onMounted(async () => {
  alertData.value = await overviewService.getRecentAlerts();
  updateTime.value = formatUpdateTime(new Date().toISOString());
});
</script>
