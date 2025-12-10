<template>
  <CardServiceCommon
    :icon="DatabaseIcon"
    title="資料庫"
    :status-text="databaseInfo.statusText"
    :status="databaseInfo.status"
    :rows="rows"
    :is-expanded="isExpanded"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CardServiceCommon from './card-service-common.vue'
import type { DatabaseServiceInfo } from '@/types/service'
import DatabaseIcon from '@/assets/icons/card/database.svg'

/**
 * Props 定義
 */
interface Props {
  /** 資料庫資訊 */
  databaseInfo: DatabaseServiceInfo
  /** 是否展開 */
  isExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isExpanded: false,
})

/**
 * 資料列（全部欄位）
 */
const rows = computed(() => [
  { label: '名稱', value: props.databaseInfo.name },
  { label: '伺服器ID', value: props.databaseInfo.serverId },
  { label: '資料庫容量', value: props.databaseInfo.capacity },
])
</script>
