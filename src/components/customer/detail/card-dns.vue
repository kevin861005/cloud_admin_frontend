<template>
  <ServiceCard
    :icon="dnsIcon"
    service-name="DNS"
    status="NORMAL"
    status-text="正常"
    content-text="DNS紀錄有效"
  />
</template>

<script setup lang="ts">
import ServiceCard from '@/components/customer/detail/card-service-common.vue'
import dnsIcon from '@/assets/icons/dns.svg'
</script>
