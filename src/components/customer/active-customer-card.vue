<template>
  <customer-card
    title="活躍客戶"
    :icon="ActiveCustomerIcon"
    :value="8"
    unit="間"
    subtitle="活躍度37.5%"
  />
</template>

<script setup lang="ts">
import CustomerCard from './customer-card.vue'
import ActiveCustomerIcon from '@/assets/icons/card/card-c-user-growth.svg'
</script>

<style scoped></style>
