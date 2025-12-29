<template>
  <!-- 背景遮罩 -->
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[80] flex items-center justify-center bg-black/50"
    >
      <!-- 主框框 -->
      <div
        class="w-[400px] rounded-lg bg-white px-[25px] py-5"
        style="box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15)"
      >
        <!-- 內容區域 (gap=5px) -->
        <div class="flex flex-col gap-[5px]">
          <!-- 主標題 -->
          <h2 class="typo-xl-medium text-black">{{ title }}</h2>

          <!-- 副標題 -->
          <p class="typo-sm text-neutral-400">{{ description }}</p>

          <!-- 進度條區域 (gap=12px) -->
          <div class="mt-2 flex items-center gap-3">
            <!-- 進度條 bar -->
            <div class="relative h-2 flex-1 overflow-hidden rounded-[50px] bg-neutral-300">
              <!-- 進度填充 -->
              <div
                class="absolute left-0 top-0 h-full rounded-[50px] bg-primary-500 transition-all duration-300 ease-out"
                :style="{ width: `${clampedProgress}%` }"
              />
            </div>

            <!-- 百分比文字 -->
            <span class="typo-sm-bold w-10 text-right text-primary-500">
              {{ clampedProgress }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";

/**
 * TaskProgressDialog 元件 Props
 */
interface Props {
  /** 控制 Dialog 顯示/隱藏 (v-model) */
  modelValue: boolean;
  /** 主標題（如：映像檔更新中...） */
  title: string;
  /** 副標題（如：此列顯示正在運行的操作） */
  description: string;
  /** 進度百分比 (0-100) */
  progress: number;
}

const props = defineProps<Props>();

/**
 * 確保進度值在 0-100 之間，並取整數
 */
const clampedProgress = computed(() => {
  const value = Math.round(props.progress);
  return Math.max(0, Math.min(100, value));
});
</script>
