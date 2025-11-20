<template>
  <ServiceCard
    :icon="nginxIcon"
    service-name="NGINX"
    status="NORMAL"
    status-text="正常"
    content-text="代理運行"
  />
</template>

<script setup lang="ts">
import ServiceCard from '@/components/customer/detail/card-service-common.vue'
import nginxIcon from '@/assets/icons/nginx.svg'
</script>
