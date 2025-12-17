<template>
  <customer-card
    title="活躍客戶"
    :icon="ActiveCustomerIcon"
    :value="stats.total"
    unit="間"
    :subtitle="subtitleText"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CustomerCard from '../common/card.vue'
import ActiveCustomerIcon from '@/assets/icons/card/card-c-user-growth.svg'
import { customerService } from '@/services/customer.service'
import { ApiError } from '@/types/common'
import type { ActiveCustomerCountResponse } from '@/types/customer'

/** 載入狀態 */
const isLoading = ref(false)

/** 錯誤訊息 */
const errorMessage = ref('')

/**
 * 活躍客戶統計資料
 */
const stats = ref<ActiveCustomerCountResponse>({
  total: 0,
  rate: 0,
})

/**
 * 計算副標題文字
 * 顯示活躍度百分比
 */
const subtitleText = computed(() => {
  return `活躍度${stats.value.rate}%`
})

/**
 * 載入活躍客戶數資料
 */
async function loadActiveCustomerCount() {
  try {
    isLoading.value = true
    errorMessage.value = ''

    stats.value = await customerService.getActiveCustomerCount()
  } catch (error) {
    console.error('載入活躍客戶數失敗:', error)
    errorMessage.value = error instanceof ApiError ? error.message : '載入失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

/**
 * 元件掛載時載入資料
 */
onMounted(() => {
  loadActiveCustomerCount()
})
</script>

<style scoped></style>
