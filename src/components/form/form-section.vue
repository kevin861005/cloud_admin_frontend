<template>
  <div class="flex flex-col" :style="{ width: `${width}px`, gap: `${gap}px` }">
    <!-- 區塊標題 -->
    <h3 class="text-sm font-bold text-gray-900">
      {{ title }}
    </h3>

    <!-- 區塊內容 (使用 slot) -->
    <div class="flex flex-1 flex-col" :style="{ gap: `${gap}px` }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 表單區塊容器元件
 *
 * 用途：包裝表單的各個區塊 (帳號資訊、個人資訊等)
 */

interface Props {
  title: string
  width?: number
  height?: number
  gap?: number
}

withDefaults(defineProps<Props>(), {
  width: 560,
  gap: 8,
})
</script>
