<template>
  <environment-card
    title="待刪除"
    :icon="DeleteIcon"
    :value="3"
    unit="間"
    subtitle="通知後+3日"
    button-text="刪除紀錄"
    @button-click="handleViewDetails"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import EnvironmentCard from '../common/card.vue'
import DeleteIcon from '@/assets/icons/card/card-e-pending-delete.svg'

const router = useRouter()

/**
 * 查看詳情按鈕點擊處理
 */
const handleViewDetails = () => {
  console.log('查看刪除紀錄')

  router.push('/environments/delete-records')
}
</script>

<style scoped></style>
