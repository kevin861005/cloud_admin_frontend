<template>
  <StatCard
    title="申請中"
    :icon="AppliedIcon"
    :value="pendingCount"
    unit="間"
    subtitle="業務提出申請之案件"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { StatCard } from '@/components/common'
import AppliedIcon from '@/assets/icons/card/card-e-applied.svg'
import { environmentService } from '@/services/environment.service'

/** 申請中客戶數 */
const pendingCount = ref(0)

/**
 * 取得申請中客戶數
 */
const fetchPendingCount = async () => {
  try {
    const data = await environmentService.getPendingCount()
    pendingCount.value = data.total
  } catch (error) {
    console.error('取得申請中客戶數失敗:', error)
  }
}

onMounted(() => {
  fetchPendingCount()
})
</script>
