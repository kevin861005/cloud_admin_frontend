<template>
  <!-- 遮罩層 -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="handleOverlayClick"
      >
        <!-- Dialog 容器 -->
        <div
          class="relative w-full rounded-lg bg-white shadow-xl"
          :class="widthClass"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
        >
          <!-- ========== Close Section ========== -->
          <div class="flex h-10 items-center justify-end">
            <CloseButton
              v-if="showCloseButton && !loading"
              aria-label="關閉對話框"
              @click="handleClose"
            />
          </div>

          <!-- ========== Body ========== -->
          <div>
            <!-- Header: px-20px, pb-12px, gap-4px -->
            <div v-if="title || subtitle || $slots.header" class="flex flex-col gap-1 px-5 pb-3">
              <slot name="header">
                <!-- Title -->
                <h2 v-if="title" :id="titleId" class="typo-base-bold text-neutral-800">
                  {{ title }}
                </h2>
                <!-- Subtitle -->
                <p v-if="subtitle" class="typo-sm text-neutral-500">
                  {{ subtitle }}
                </p>
              </slot>
            </div>

            <!-- Note (主要內容): px-20px, py-4px -->
            <div class="px-5 py-1">
              <slot />
            </div>

            <!-- Options (選項列表): px-20px -->
            <div v-if="$slots.options" class="px-5">
              <slot name="options" />
            </div>
          </div>

          <!-- ========== Button List ========== -->
          <!-- 有 options slot 時顯示上方陰影 -->
          <div
            v-if="$slots.footer"
            class="flex justify-end gap-2 px-5 py-2"
            :class="{ 'shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]': $slots.options }"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * BaseDialog - 基礎對話框元件
 *
 * 結構：
 * - Close Section: 高度 40px，關閉按鈕點擊區域 40x40
 * - Body
 *   - Header: padding 20px (左右), 12px (下), gap 4px
 *     - Title
 *     - Subtitle
 *   - Note: padding 20px (左右), 4px (上下)
 *   - Options: padding 20px (左右) - 選項列表 slot
 * - Button List: padding 20px (左右), 8px (上下), gap 8px
 *   - 有 options 時上方顯示陰影
 */
import { computed, useId, watch, onUnmounted } from "vue";
import { CloseButton } from "@/components/common";

// ========== Props 定義 ==========
interface Props {
  /** 控制對話框顯示/隱藏 (v-model) */
  modelValue: boolean;
  /** 對話框標題 */
  title?: string;
  /** 對話框副標題 */
  subtitle?: string;
  /** 對話框寬度 */
  width?: "sm" | "md" | "lg" | "xl" | "2xl";
  /** 是否顯示關閉按鈕 */
  showCloseButton?: boolean;
  /** 點擊遮罩是否關閉 */
  closeOnOverlay?: boolean;
  /** 是否為 Loading 狀態（Loading 時禁止關閉） */
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  subtitle: "",
  width: "2xl",
  showCloseButton: true,
  closeOnOverlay: true,
  loading: false,
});

// ========== Emits 定義 ==========
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();

// ========== Computed ==========
/** 產生唯一的標題 ID（無障礙用途） */
const titleId = useId();

/** 寬度 class 對應 */
const widthClass = computed(() => {
  const widthMap: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };
  return widthMap[props.width];
});

// ========== Methods ==========
/** 關閉對話框 */
function handleClose() {
  if (props.loading) return;
  emit("update:modelValue", false);
  emit("close");
}

/** 點擊遮罩處理 */
function handleOverlayClick() {
  if (props.closeOnOverlay && !props.loading) {
    handleClose();
  }
}

/** 監聽 ESC 鍵關閉 Dialog */
function handleEscape(event: KeyboardEvent) {
  if (event.key === "Escape" && !props.loading) {
    handleClose();
  }
}

// ========== 生命週期 ==========
/** 監聽 Dialog 開啟/關閉，處理 body overflow 和鍵盤事件 */
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    }
  }
);

/** 元件卸載時清理 */
onUnmounted(() => {
  document.body.style.overflow = "";
  document.removeEventListener("keydown", handleEscape);
});

// ========== Expose ==========
defineExpose({
  close: handleClose,
});
</script>
