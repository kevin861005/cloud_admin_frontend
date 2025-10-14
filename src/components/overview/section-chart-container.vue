<template>
  <div
    ref="containerRef"
    class="flex items-center gap-5 overflow-x-auto overflow-y-hidden py-5 px-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden h-[436px]"
  >
    <AttentionCustomersCard />

    <ModuleUsageChartCard />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AttentionCustomersCard from './attention-customers-card.vue'
import ModuleUsageChartCard from './module-usage-chart-card.vue'

const containerRef = ref<HTMLElement | null>(null)

const handleWheel = (event: WheelEvent) => {
  if (!containerRef.value) return
  const canScroll = containerRef.value.scrollWidth > containerRef.value.clientWidth
  if (!canScroll) return
  event.preventDefault()
  containerRef.value.scrollLeft += event.deltaY
}

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('wheel', handleWheel, { passive: false })
  }
})

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('wheel', handleWheel)
  }
})
</script>

<style scoped></style>
