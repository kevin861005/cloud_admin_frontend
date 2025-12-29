<template>
  <div class="flex flex-col gap-2">
    <!-- 標籤 -->
    <label class="typo-sm-medium text-slate-500">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- 日期輸入框 -->
    <div ref="containerRef" class="relative w-full">
      <button
        ref="triggerRef"
        type="button"
        :disabled="disabled"
        class="flex h-9 w-full items-center justify-between rounded border border-slate-500/10 bg-slate-500/5 px-3 py-2 text-left text-sm disabled:bg-neutral-100 disabled:text-neutral-500"
        @click="toggleCalendar"
      >
        <span :class="displayValue ? 'text-neutral-900' : 'text-neutral-400'">
          {{ displayValue || placeholder }}
        </span>
        <!-- 日曆圖示 -->
        <svg class="h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      <!-- 日曆下拉面板 -->
      <div
        v-show="isOpen"
        class="absolute z-50 mt-1 w-[280px] rounded border border-slate-200 bg-white p-3 shadow-lg"
      >
        <!-- 月份導航 -->
        <div class="mb-3 flex items-center justify-between">
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
            @click="prevMonth"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <span class="typo-sm-medium text-neutral-800">
            {{ currentYear }} 年 {{ currentMonth + 1 }} 月
          </span>

          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
            @click="nextMonth"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <!-- 星期標題 -->
        <div class="mb-2 grid grid-cols-7 gap-1">
          <div
            v-for="day in weekDays"
            :key="day"
            class="flex h-8 items-center justify-center text-xs text-neutral-500"
          >
            {{ day }}
          </div>
        </div>

        <!-- 日期網格 -->
        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="(day, index) in calendarDays"
            :key="index"
            type="button"
            :disabled="!day.isCurrentMonth"
            class="flex h-8 w-8 items-center justify-center rounded text-sm transition-colors"
            :class="getDayClasses(day)"
            @click="selectDate(day)"
          >
            {{ day.date }}
          </button>
        </div>

        <!-- 快捷按鈕 -->
        <div class="mt-3 flex justify-between border-t border-slate-200 pt-3">
          <button
            type="button"
            class="typo-xs hover:text-primary-600 text-primary-500"
            @click="selectToday"
          >
            今天
          </button>
          <button
            type="button"
            class="typo-xs text-neutral-500 hover:text-neutral-600"
            @click="clearDate"
          >
            清除
          </button>
        </div>
      </div>
    </div>

    <!-- 錯誤訊息 -->
    <FieldError :message="errorMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { FieldError } from "@/components/form";

/**
 * 日期選擇器元件
 *
 * 功能：
 * - 日曆面板選擇日期
 * - 支援月份切換
 * - 今天快捷按鈕
 * - 清除按鈕
 * - 點擊外部自動關閉
 */

// ===== 型別定義 =====
interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

interface Props {
  /** 欄位標籤 */
  label: string;
  /** 綁定值 (格式: YYYY/MM/DD) */
  modelValue: string;
  /** 佔位提示文字 */
  placeholder?: string;
  /** 是否必填 */
  required?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 錯誤訊息 */
  errorMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "請選擇日期",
  required: false,
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

// ===== 常數 =====
const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

// ===== 狀態管理 =====
const isOpen = ref(false);
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());
const containerRef = ref<HTMLDivElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);

// ===== 計算屬性 =====

/**
 * 顯示的日期值
 */
const displayValue = computed(() => {
  return props.modelValue || "";
});

/**
 * 解析 modelValue 為日期物件
 */
const selectedDate = computed(() => {
  if (!props.modelValue) return null;
  const parts = props.modelValue.split("/");
  if (parts.length !== 3) return null;

  const yearStr = parts[0];
  const monthStr = parts[1];
  const dateStr = parts[2];

  if (!yearStr || !monthStr || !dateStr) return null;

  return {
    year: parseInt(yearStr, 10),
    month: parseInt(monthStr, 10) - 1,
    date: parseInt(dateStr, 10),
  };
});

/**
 * 產生日曆日期陣列
 */
const calendarDays = computed((): CalendarDay[] => {
  const days: CalendarDay[] = [];
  const today = new Date();

  // 取得當月第一天
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const startDayOfWeek = firstDay.getDay();

  // 取得當月最後一天
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  const daysInMonth = lastDay.getDate();

  // 取得上個月最後幾天
  const prevMonthLastDay = new Date(currentYear.value, currentMonth.value, 0);
  const daysInPrevMonth = prevMonthLastDay.getDate();

  // 填充上個月的日期
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = daysInPrevMonth - i;
    const month = currentMonth.value - 1;
    const year = month < 0 ? currentYear.value - 1 : currentYear.value;
    const actualMonth = month < 0 ? 11 : month;

    days.push({
      date,
      month: actualMonth,
      year,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
    });
  }

  // 填充當月的日期
  for (let date = 1; date <= daysInMonth; date++) {
    const isToday =
      date === today.getDate() &&
      currentMonth.value === today.getMonth() &&
      currentYear.value === today.getFullYear();

    const isSelected =
      selectedDate.value !== null &&
      date === selectedDate.value.date &&
      currentMonth.value === selectedDate.value.month &&
      currentYear.value === selectedDate.value.year;

    days.push({
      date,
      month: currentMonth.value,
      year: currentYear.value,
      isCurrentMonth: true,
      isToday,
      isSelected,
    });
  }

  // 填充下個月的日期（補滿 6 行 = 42 天）
  const remainingDays = 42 - days.length;
  for (let date = 1; date <= remainingDays; date++) {
    const month = currentMonth.value + 1;
    const year = month > 11 ? currentYear.value + 1 : currentYear.value;
    const actualMonth = month > 11 ? 0 : month;

    days.push({
      date,
      month: actualMonth,
      year,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
    });
  }

  return days;
});

// ===== 方法 =====

/**
 * 切換日曆顯示/隱藏
 */
const toggleCalendar = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;

  // 開啟時，如果有選中日期，跳轉到該月份
  if (isOpen.value && selectedDate.value) {
    currentYear.value = selectedDate.value.year;
    currentMonth.value = selectedDate.value.month;
  }
};

/**
 * 上個月
 */
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

/**
 * 下個月
 */
const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

/**
 * 選擇日期
 */
const selectDate = (day: CalendarDay) => {
  if (!day.isCurrentMonth) return;

  const year = day.year;
  const month = String(day.month + 1).padStart(2, "0");
  const date = String(day.date).padStart(2, "0");
  const dateString = `${year}/${month}/${date}`;

  emit("update:modelValue", dateString);
  isOpen.value = false;
};

/**
 * 選擇今天
 */
const selectToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");
  const dateString = `${year}/${month}/${date}`;

  emit("update:modelValue", dateString);
  isOpen.value = false;
};

/**
 * 清除日期
 */
const clearDate = () => {
  emit("update:modelValue", "");
  isOpen.value = false;
};

/**
 * 取得日期格子的樣式
 */
const getDayClasses = (day: CalendarDay): string => {
  const classes: string[] = [];

  if (!day.isCurrentMonth) {
    classes.push("text-neutral-300 cursor-default");
  } else if (day.isSelected) {
    classes.push("bg-primary-500 text-white hover:bg-primary-600");
  } else if (day.isToday) {
    classes.push("border border-primary-500 text-primary-500 hover:bg-primary-50");
  } else {
    classes.push("text-neutral-700 hover:bg-gray-100 cursor-pointer");
  }

  return classes.join(" ");
};

/**
 * 關閉日曆
 */
const closeCalendar = () => {
  isOpen.value = false;
};

/**
 * 處理點擊外部事件
 */
const handleClickOutside = (event: MouseEvent) => {
  if (!containerRef.value) return;

  const target = event.target as Node;
  if (!containerRef.value.contains(target)) {
    closeCalendar();
  }
};

/**
 * Focus 到觸發按鈕
 * 供父元件呼叫
 */
const focus = () => {
  triggerRef.value?.focus();
};

// ===== 生命週期 =====

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// ===== Expose =====
defineExpose({
  focus,
});
</script>
