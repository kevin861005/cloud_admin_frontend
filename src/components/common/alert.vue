<template>
  <div :class="containerClasses">
    <div class="flex items-start">
      <!-- 圖示 -->
      <component :is="iconComponent" :class="iconClasses" />

      <!-- 內容 -->
      <div class="ml-3 flex-1">
        <!-- 標題 -->
        <h3 :class="titleClasses">
          {{ title }}
        </h3>

        <!-- 描述 -->
        <p v-if="description" :class="descriptionClasses" class="mt-1">
          {{ description }}
        </p>

        <!-- 動作按鈕（可選） -->
        <div v-if="showButton" class="mt-4">
          <button type="button" :class="buttonClasses" @click="handleButtonClick">
            {{ buttonText }}
          </button>
        </div>
      </div>

      <!-- 關閉按鈕（可選） -->
      <button v-if="closable" type="button" :class="closeButtonClasses" @click="handleClose">
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from "vue";

/**
 * 警告/錯誤/成功訊息元件
 *
 * 功能：
 * - 顯示不同類型的訊息（error, warning, success, info）
 * - 支援可關閉
 * - 支援動作按鈕
 *
 * 使用範例：
 * <Alert
 *   type="error"
 *   title="載入失敗"
 *   description="無法連接到伺服器，請稍後再試"
 *   closable
 * />
 */

// ===== Props 定義 =====
interface Props {
  /**
   * 類型
   * - error: 錯誤（紅色）
   * - warning: 警告（黃色）
   * - success: 成功（綠色）
   * - info: 資訊（藍色）
   */
  type?: "error" | "warning" | "success" | "info";

  /**
   * 標題文字
   */
  title: string;

  /**
   * 描述文字（可選）
   */
  description?: string;

  /**
   * 是否可關閉
   */
  closable?: boolean;

  /**
   * 是否顯示動作按鈕
   */
  showButton?: boolean;

  /**
   * 按鈕文字
   */
  buttonText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "info",
  closable: false,
  showButton: false,
  buttonText: "確定",
});

// ===== Emits 定義 =====
const emit = defineEmits<{
  close: [];
  "button-click": [];
}>();

// ===== 樣式配置 =====

/**
 * 容器樣式（根據類型）
 */
const containerClasses = computed(() => {
  const baseClasses = "rounded-lg border p-4";
  const typeClasses = {
    error: "border-red-200 bg-red-50",
    warning: "border-yellow-200 bg-yellow-50",
    success: "border-green-200 bg-green-50",
    info: "border-blue-200 bg-blue-50",
  };
  return `${baseClasses} ${typeClasses[props.type]}`;
});

/**
 * 圖示樣式（根據類型）
 */
const iconClasses = computed(() => {
  const baseClasses = "h-5 w-5 flex-shrink-0";
  const typeClasses = {
    error: "text-red-400",
    warning: "text-yellow-400",
    success: "text-green-400",
    info: "text-blue-400",
  };
  return `${baseClasses} ${typeClasses[props.type]}`;
});

/**
 * 標題文字樣式（根據類型）
 */
const titleClasses = computed(() => {
  const baseClasses = "typo-sm-medium";
  const typeClasses = {
    error: "text-red-800",
    warning: "text-yellow-800",
    success: "text-green-800",
    info: "text-blue-800",
  };
  return `${baseClasses} ${typeClasses[props.type]}`;
});

/**
 * 描述文字樣式（根據類型）
 */
const descriptionClasses = computed(() => {
  const baseClasses = "text-sm";
  const typeClasses = {
    error: "text-red-700",
    warning: "text-yellow-700",
    success: "text-green-700",
    info: "text-blue-700",
  };
  return `${baseClasses} ${typeClasses[props.type]}`;
});

/**
 * 按鈕樣式（根據類型）
 */
const buttonClasses = computed(() => {
  const baseClasses =
    "inline-flex items-center rounded-md px-3 py-2 typo-sm-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const typeClasses = {
    error: "bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500",
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500",
    success: "bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500",
    info: "bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500",
  };
  return `${baseClasses} ${typeClasses[props.type]}`;
});

/**
 * 關閉按鈕樣式（根據類型）
 */
const closeButtonClasses = computed(() => {
  const baseClasses =
    "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const typeClasses = {
    error: "text-red-500 hover:bg-red-100 focus:ring-red-500",
    warning: "text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-500",
    success: "text-green-500 hover:bg-green-100 focus:ring-green-500",
    info: "text-blue-500 hover:bg-blue-100 focus:ring-blue-500",
  };
  return `${baseClasses} ${typeClasses[props.type]}`;
});

// ===== 圖示映射 =====

/**
 * 根據類型返回對應的 SVG 圖示元件
 */
const iconComponent = computed(() => {
  const icons = {
    // 錯誤圖示（X 圓圈）
    error: () =>
      h("svg", { fill: "currentColor", viewBox: "0 0 20 20" }, [
        h("path", {
          "fill-rule": "evenodd",
          d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
          "clip-rule": "evenodd",
        }),
      ]),

    // 警告圖示（驚嘆號三角形）
    warning: () =>
      h("svg", { fill: "currentColor", viewBox: "0 0 20 20" }, [
        h("path", {
          "fill-rule": "evenodd",
          d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
          "clip-rule": "evenodd",
        }),
      ]),

    // 成功圖示（打勾圓圈）
    success: () =>
      h("svg", { fill: "currentColor", viewBox: "0 0 20 20" }, [
        h("path", {
          "fill-rule": "evenodd",
          d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
          "clip-rule": "evenodd",
        }),
      ]),

    // 資訊圖示（i 圓圈）
    info: () =>
      h("svg", { fill: "currentColor", viewBox: "0 0 20 20" }, [
        h("path", {
          "fill-rule": "evenodd",
          d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
          "clip-rule": "evenodd",
        }),
      ]),
  };

  return icons[props.type];
});

// ===== 事件處理 =====

/**
 * 處理關閉按鈕點擊
 */
const handleClose = () => {
  emit("close");
};

/**
 * 處理動作按鈕點擊
 */
const handleButtonClick = () => {
  emit("button-click");
};
</script>
