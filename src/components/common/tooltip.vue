<template>
  <div
    ref="triggerRef"
    class="relative inline-flex"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 觸發區域（slot 內容） -->
    <slot />

    <!-- 提示框（使用 Teleport 到 body，避免被 overflow 裁切） -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-150"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showTip && text"
          class="typo-xs-bold fixed z-[9999] whitespace-nowrap rounded bg-neutral-600/80 px-2 py-1 text-white"
          :style="tooltipStyle"
        >
          <!-- 箭頭 -->
          <div :class="arrowClass" />
          {{ text }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * Tooltip - 通用提示元件
 *
 * 功能：
 * - Hover 時顯示提示文字
 * - 支援四個方向：top、right、bottom、left
 * - 使用 Teleport 避免被容器 overflow 裁切
 * - 帶有指向觸發元素的箭頭
 *
 * 樣式規格：
 * - border-radius: 4px
 * - padding: 4px 8px
 * - background: neutral-600/80
 * - text: white, typo-xs-bold
 */
import { ref, reactive, computed } from "vue";

// ========== Props 定義 ==========
interface Props {
  /** 提示文字 */
  text: string;
  /** 顯示方向，預設為 right */
  position?: "top" | "right" | "bottom" | "left";
}

const props = withDefaults(defineProps<Props>(), {
  position: "right",
});

// ========== 狀態 ==========
/** 是否顯示提示 */
const showTip = ref(false);

/** 觸發元素的參考 */
const triggerRef = ref<HTMLElement | null>(null);

/** tooltip 的位置樣式 */
const tooltipStyle = reactive({
  top: "0px",
  left: "0px",
});

// ========== Computed ==========
/**
 * 根據 position 決定箭頭的 class
 */
const arrowClass = computed(() => {
  const baseClass = "absolute border-4 border-transparent";

  switch (props.position) {
    case "top":
      // 箭頭在 tooltip 下方，指向下
      return `${baseClass} top-full left-1/2 -translate-x-1/2 border-t-neutral-600/80`;
    case "bottom":
      // 箭頭在 tooltip 上方，指向上
      return `${baseClass} bottom-full left-1/2 -translate-x-1/2 border-b-neutral-600/80`;
    case "left":
      // 箭頭在 tooltip 右側，指向右
      return `${baseClass} left-full top-1/2 -translate-y-1/2 border-l-neutral-600/80`;
    case "right":
    default:
      // 箭頭在 tooltip 左側，指向左
      return `${baseClass} right-full top-1/2 -translate-y-1/2 border-r-neutral-600/80`;
  }
});

// ========== 事件處理 ==========
/** tooltip 與觸發元素的間距 */
const OFFSET = 8;

/**
 * 滑鼠進入時計算 tooltip 位置
 */
const handleMouseEnter = () => {
  if (!triggerRef.value) return;

  const rect = triggerRef.value.getBoundingClientRect();

  switch (props.position) {
    case "top":
      // 顯示在上方，水平置中
      tooltipStyle.top = `${rect.top - OFFSET}px`;
      tooltipStyle.left = `${rect.left + rect.width / 2}px`;
      // 需要 transform 來置中，這裡透過額外的 style 處理
      Object.assign(tooltipStyle, { transform: "translate(-50%, -100%)" });
      break;
    case "bottom":
      // 顯示在下方，水平置中
      tooltipStyle.top = `${rect.bottom + OFFSET}px`;
      tooltipStyle.left = `${rect.left + rect.width / 2}px`;
      Object.assign(tooltipStyle, { transform: "translateX(-50%)" });
      break;
    case "left":
      // 顯示在左側，垂直置中
      tooltipStyle.top = `${rect.top + rect.height / 2}px`;
      tooltipStyle.left = `${rect.left - OFFSET}px`;
      Object.assign(tooltipStyle, { transform: "translate(-100%, -50%)" });
      break;
    case "right":
    default:
      // 顯示在右側，垂直置中
      tooltipStyle.top = `${rect.top + rect.height / 2}px`;
      tooltipStyle.left = `${rect.right + OFFSET}px`;
      Object.assign(tooltipStyle, { transform: "translateY(-50%)" });
      break;
  }

  showTip.value = true;
};

/**
 * 滑鼠離開時隱藏 tooltip
 */
const handleMouseLeave = () => {
  showTip.value = false;
};
</script>
