<template>
  <ServiceCard
    :icon="dockerIcon"
    service-name="Docker"
    status="RUNNING"
    status-text="運行中"
    content-title="名稱"
    content-text="v2.4.1"
  >
    <template #buttons>
      <BadgeButton
        text="更新映像"
        icon-position="left"
        :icon="updateIcon"
        @click="handleUpdateImage"
      />
      <BadgeButton
        text="重啟環境"
        icon-position="left"
        :icon="restartIcon"
        @click="handleRestartEnv"
      />
    </template>
  </ServiceCard>
</template>

<script setup lang="ts">
import ServiceCard from '@/components/customer/detail/card-service-common.vue'
import BadgeButton from '@/components/common/badge-button.vue'
import dockerIcon from '@/assets/icons/card/docker.svg'
import updateIcon from '@/assets/icons/common/cm-download.svg'
import restartIcon from '@/assets/icons/common/cm-restart.svg'

const handleUpdateImage = () => {
  console.log('更新映像')
}

const handleRestartEnv = () => {
  console.log('重啟環境')
}
</script>
