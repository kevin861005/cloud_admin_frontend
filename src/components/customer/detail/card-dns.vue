<template>
  <CardServiceCommon
    :icon="DnsIcon"
    title="DNS"
    :status-text="dnsInfo.statusText"
    :status="dnsInfo.status"
    :rows="rows"
    :is-expanded="isExpanded"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import CardServiceCommon from "./card-service-common.vue";
import type { DnsServiceInfo } from "@/types/service";
import DnsIcon from "@/assets/icons/card/dns.svg";

/**
 * Props 定義
 */
interface Props {
  /** DNS 資訊 */
  dnsInfo: DnsServiceInfo;
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
  { label: "域名", value: props.dnsInfo.domainName },
  { label: "紀錄類型", value: props.dnsInfo.recordType },
  { label: "記錄值", value: props.dnsInfo.recordValue },
  { label: "TTL", value: `${props.dnsInfo.ttl} 秒` },
]);
</script>
