<template>
  <ErrorPage
    title="權限不足，無法執行此操作"
    subtitle="若有業務需求，請聯繫您的部門主管或系統管理員申請權限"
    :image-src="forbiddenImage"
  />
</template>

<script setup lang="ts">
import ErrorPage from "@/components/common/error-page.vue";
import forbiddenImage from "@/assets/icons/error/403-forbidden.svg";
</script>
