<template>
  <customer-card
    title="總客戶數"
    :icon="TotalCustomerIcon"
    :value="16"
    unit="間"
    subtitle="+12%相較上個月"
  />
</template>

<script setup lang="ts">
import CustomerCard from './customer-card.vue'
import TotalCustomerIcon from '@/assets/icons/card/card-c-user-total.svg'
</script>

<style scoped></style>
