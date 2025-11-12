<template>
  <environment-card
    title="已通知"
    :icon="NotifiedIcon"
    :value="3"
    unit="間"
    subtitle="已寄信通知客戶"
  />
</template>

<script setup lang="ts">
import EnvironmentCard from '../common/card.vue'
import NotifiedIcon from '@/assets/icons/card/card-e-notified.svg'
</script>

<style scoped></style>
