<template>
  <div class="flex flex-col" :style="{ width: `${width}px` }">
    <!-- 標題區域（主標題 + 副標題） -->
    <div class="flex flex-col">
      <!-- 主標題 -->
      <h3 class="typo-sm-bold text-neutral-900">
        {{ title }}
      </h3>

      <!-- 副標題（選填，緊貼主標題下方） -->
      <p v-if="subtitle" class="typo-sm-medium text-primary-500">
        {{ subtitle }}
      </p>
    </div>

    <!-- 內容區域（與標題區域間隔 8px） -->
    <div class="flex flex-1 flex-col mt-2" :style="{ gap: `${gap}px` }">
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
  /** 區塊主標題 */
  title?: string

  /** 區塊副標題（選填，不傳則不顯示） */
  subtitle?: string

  /** 區塊寬度 */
  width?: number

  /** 區塊高度 */
  height?: number

  /** 內容區域的元素間距 */
  gap?: number
}

withDefaults(defineProps<Props>(), {
  width: 560,
  gap: 8,
})
</script>
