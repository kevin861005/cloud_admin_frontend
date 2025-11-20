<template>
  <ServiceCard
    :icon="databaseIcon"
    service-name="資料庫"
    status="NORMAL"
    status-text="正常"
    content-title="名稱"
    content-text="Twfood_production"
  />
</template>

<script setup lang="ts">
import ServiceCard from '@/components/customer/detail/card-service-common.vue'
import databaseIcon from '@/assets/icons/database.svg'
</script>
