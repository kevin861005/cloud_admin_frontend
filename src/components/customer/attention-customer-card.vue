<template>
  <customer-card
    title="需關注客戶"
    :icon="AttentionCustomerIcon"
    :value="8"
    unit="間"
    subtitle="需追蹤使用狀況"
  />
</template>

<script setup lang="ts">
import CustomerCard from './customer-card.vue'
import AttentionCustomerIcon from '@/assets/icons/card/card-c-user-warning.svg'
</script>

<style scoped></style>
