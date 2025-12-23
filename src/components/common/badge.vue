<template>
  <span
    :class="[
      'inline-flex items-center justify-center',
      'min-w-[54px] min-h-6 py-1 px-3 rounded border',
      'break-all',
      fontClass,
    ]"
    :style="badgeStyles"
  >
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

/**
 * Badge 元件
 * 用於顯示狀態標籤或一般標籤
 *
 * 特點：
 * - 最小寬度 54px，文字多時自動擴大
 * - 使用 Tailwind CSS
 * - 支援顯示/隱藏邊框
 * - 支援不同類型使用不同字體樣式
 * - 支援 disabled 樣式（文字變淡）
 *
 * @example
 * <!-- 基本使用 -->
 * <Badge text="啟用" type="success" />
 *
 * <!-- 無邊框 -->
 * <Badge text="處理中" type="working" :show-border="false" />
 *
 * <!-- 禁用樣式（文字變淡） -->
 * <Badge text="v.3.5" type="neutral" disabled />
 */

// ========== 型別定義 ==========
type BadgeType = "default" | "success" | "error" | "working" | "neutral";

interface BadgeStyle {
  /** 背景色 */
  bg: string;
  /** 邊框色 */
  border: string;
  /** 文字色 */
  text: string;
  /** 字體 class（Tailwind CSS） */
  font: string;
}

// ========== Props 定義 ==========
interface Props {
  /** 顯示文字 */
  text: string;

  /**
   * 樣式類型
   * - success: 綠色（適合：啟用、成功、活躍、最新）
   * - error: 紅色（適合：停用、錯誤、低活躍）
   * - working: 藍色（適合：處理中、進行中）
   * - info: 藍色（適合：運行中、資訊提示）
   * - neutral: 灰色背景（適合：資料顯示、標籤內容、版本號）
   * - default: 灰色（適合：一般標籤、權限、未使用）
   * @default 'default'
   */
  type?: BadgeType;

  /**
   * 是否顯示邊框
   * @default true
   */
  showBorder?: boolean;

  /**
   * 是否為禁用樣式（文字變淡為 neutral-400）
   * @default false
   */
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "default",
  showBorder: true,
  disabled: false,
});

// ========== 常數 ==========
/** 禁用時的文字顏色 */
const DISABLED_TEXT_COLOR = "#9CA3AF"; // neutral-400

// ========== 樣式配置 ==========
const styleMap: Record<BadgeType, BadgeStyle> = {
  success: {
    bg: "#27BD720D",
    border: "rgba(39, 189, 114, 0.1)",
    text: "#27BD72",
    font: "typo-xs-bold",
  },
  error: {
    bg: "#FD58580D",
    border: "rgba(253, 88, 88, 0.1)",
    text: "#FD5858",
    font: "typo-xs-bold",
  },
  working: {
    bg: "#398FF90D",
    border: "rgba(57, 143, 249, 0.1)",
    text: "#398FF9",
    font: "typo-xs-bold",
  },
  neutral: {
    bg: "#F3F4F6",
    border: "rgba(0, 0, 0, 0.1)",
    text: "#374151",
    font: "typo-xs",
  },
  default: {
    bg: "#0000000D",
    border: "rgba(0, 0, 0, 0.1)",
    text: "rgba(0, 0, 0, 0.8)",
    font: "typo-xs-bold",
  },
};

// ========== Computed ==========
/**
 * Badge 樣式（顏色相關）
 */
const badgeStyles = computed(() => {
  const style = styleMap[props.type];

  return {
    backgroundColor: style.bg,
    borderColor: props.showBorder ? style.border : "transparent",
    color: props.disabled ? DISABLED_TEXT_COLOR : style.text,
  };
});

/**
 * 字體 class
 */
const fontClass = computed(() => {
  return styleMap[props.type].font;
});
</script>
