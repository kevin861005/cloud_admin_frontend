<template>
  <environment-card
    title="申請中"
    :icon="AppliedIcon"
    :value="3"
    unit="間"
    subtitle="業務提出申請之案件"
  />
</template>

<script setup lang="ts">
import EnvironmentCard from '../common/card.vue'
import AppliedIcon from '@/assets/icons/card/card-e-applied.svg'
</script>

<style scoped></style>
