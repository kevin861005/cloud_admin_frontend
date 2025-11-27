<template>
  <div
    class="rounded-xl bg-white p-6 shadow-[1px_3px_4px_0px_rgba(0,0,0,0.1)]"
    :style="{ height: `${props.height}px` }"
  >
    <!-- 卡片內容容器 -->
    <div class="flex h-full flex-col justify-between gap-12">
      <!-- 頂部區域：標題 + ICON -->
      <div class="flex items-center justify-between">
        <!-- 標題 -->
        <h3 class="typo-base-bold text-gray-700">
          {{ props.title }}
        </h3>

        <!-- ICON -->
        <img :src="props.icon" :alt="`${props.title} icon`" class="h-4 w-4" />
      </div>

      <!-- 底部區域：數值 + 副內容 -->
      <div class="flex flex-col gap-3">
        <!-- 主要數值 + 單位 -->
        <div class="flex items-baseline gap-1">
          <span class="typo-2xl-bold text-gray-800">
            {{ props.value }}
          </span>
          <span class="typo-2xl-bold text-gray-800">
            {{ props.unit }}
          </span>
        </div>

        <!-- 副內容 + 按鈕 -->
        <div class="flex items-center justify-between">
          <!-- 副內容 -->
          <p class="typo-sm-medium text-gray-400">
            {{ props.subtitle }}
          </p>

          <!-- 按鈕（選填） -->
          <button
            v-if="props.buttonText"
            class="rounded px-2 typo-sm"
            style="color: #4b5563"
            @click="emit('button-click')"
          >
            {{ props.buttonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 客戶統計卡片元件
 * 用於總覽頁面顯示各項客戶統計資訊
 */

/**
 * Props 定義
 */
interface Props {
  /** 卡片標題 */
  title: string
  /** ICON 路徑（如 '@/assets/icons/card/growth-up.svg'） */
  icon: string
  /** 主要數值 */
  value: number
  /** 數值單位（如「間」） */
  unit: string
  /** 底部副內容（如「+12%相較上個月」） */
  subtitle: string
  /** 卡片高度（選填，預設 176px） */
  height?: number
  /** 按鈕文字（選填，未提供則不顯示按鈕） */
  buttonText?: string
}

/**
 * 接收 Props，設定預設值
 */
const props = withDefaults(defineProps<Props>(), {
  height: 176,
})

/**
 * Emits 定義
 */
const emit = defineEmits<{
  /** 按鈕點擊事件 */
  'button-click': []
}>()
</script>

<style scoped></style>
