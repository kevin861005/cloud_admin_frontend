<template>
  <CardServiceCommon
    :icon="NginxIcon"
    title="NGINX"
    :status-text="nginxInfo.statusText"
    :status="nginxInfo.status"
    :rows="rows"
    :is-expanded="isExpanded"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import CardServiceCommon from "./card-service-common.vue";
import type { NginxServiceInfo } from "@/types/service";
import NginxIcon from "@/assets/icons/card/nginx.svg";

/**
 * Props 定義
 */
interface Props {
  /** NGINX 資訊 */
  nginxInfo: NginxServiceInfo;
  /** 是否展開 */
  isExpanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isExpanded: false,
});

/**
 * 資料列（全部欄位）
 */
const rows = computed(() => [
  { label: "主要域名", value: props.nginxInfo.primaryDomain },
  { label: "轉發目標", value: props.nginxInfo.forwardHost },
  { label: "轉發 Port", value: String(props.nginxInfo.forwardPort) },
  { label: "SSL 狀態", value: props.nginxInfo.sslEnabled ? "已啟用" : "未啟用" },
]);
</script>
