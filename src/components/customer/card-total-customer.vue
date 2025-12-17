<template>
  <customer-card
    title="總客戶數"
    :icon="TotalCustomerIcon"
    :value="stats.total"
    unit="間"
    :subtitle="subtitleText"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CustomerCard from '../common/card.vue'
import TotalCustomerIcon from '@/assets/icons/card/card-c-user-total.svg'
import { customerService } from '@/services/customer.service'
import { ApiError } from '@/types/common'
import type { CustomerCountResponse } from '@/types/customer'

/** 載入狀態 */
const isLoading = ref(false)

/** 錯誤訊息 */
const errorMessage = ref('')

/**
 * 總客戶數統計資料
 */
const stats = ref<CustomerCountResponse>({
  total: 0,
  rate: 0,
})

/**
 * 計算副標題文字
 * 根據成長率顯示正負號
 */
const subtitleText = computed(() => {
  const rate = stats.value.rate
  const sign = rate >= 0 ? '+' : ''
  return `${sign}${rate}%相較上個月`
})

/**
 * 載入總客戶數資料
 */
async function loadCustomerTotalCount() {
  try {
    isLoading.value = true
    errorMessage.value = ''

    stats.value = await customerService.getCustomerTotalCount()
  } catch (error) {
    console.error('載入總客戶數失敗:', error)
    errorMessage.value = error instanceof ApiError ? error.message : '載入失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

/**
 * 元件掛載時載入資料
 */
onMounted(() => {
  loadCustomerTotalCount()
})
</script>

<style scoped></style>
