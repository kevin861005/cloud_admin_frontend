/**
 * 表單相關工具函數
 */

import type { FieldError } from "@/types/common";
import type { Ref } from "vue";

/**
 * 可 Focus 的元素介面
 */
interface Focusable {
  focus: () => void;
}

/**
 * 處理欄位錯誤的設定
 */
export interface FieldErrorConfig<T extends Record<string, string>> {
  /** 錯誤狀態物件 */
  errors: Ref<T>;
  /** 後端欄位名 -> 前端欄位名 對應 */
  fieldMap: Record<string, keyof T>;
  /** 後端欄位名 -> Input Ref 對應（用於 focus） */
  fieldRefMap?: Record<string, Ref<Focusable | null | undefined>>;
  /** 欄位順序（用於決定 focus 哪個欄位） */
  fieldOrder?: string[];
}

/**
 * 處理後端回傳的欄位錯誤
 *
 * @param fieldErrors - 後端回傳的欄位錯誤列表
 * @param config - 設定選項
 *
 * @example
 * ```typescript
 * import { processFieldErrors } from '@/utils/form'
 *
 * const errors = ref({ name: '', email: '' })
 * const nameInputRef = ref<HTMLInputElement | null>(null)
 *
 * processFieldErrors(fieldErrors, {
 *   errors,
 *   fieldMap: { name: 'name', email: 'email' },
 *   fieldRefMap: { name: nameInputRef },
 *   fieldOrder: ['name', 'email'],
 * })
 * ```
 */
export function processFieldErrors<T extends Record<string, string>>(
  fieldErrors: FieldError[],
  config: FieldErrorConfig<T>
): void {
  const { errors, fieldMap, fieldRefMap, fieldOrder } = config;

  // 1. 清空現有錯誤
  for (const key in errors.value) {
    errors.value[key] = "" as T[typeof key];
  }

  // 2. 記錄哪些欄位有錯誤
  const fieldsWithErrors = new Set<string>();

  // 3. 遍歷所有欄位錯誤
  fieldErrors.forEach((fieldError) => {
    const frontendField = fieldMap[fieldError.field];
    if (frontendField) {
      const currentError = errors.value[frontendField];
      // 如果該欄位已經有錯誤訊息，用分號串接
      if (currentError) {
        errors.value[frontendField] =
          `${currentError}; ${fieldError.message}` as T[typeof frontendField];
      } else {
        errors.value[frontendField] = fieldError.message as T[typeof frontendField];
      }
      // 記錄有錯誤的欄位
      fieldsWithErrors.add(fieldError.field);
    }
  });

  // 4. 根據欄位順序，focus 到第一個有錯誤的欄位
  if (fieldRefMap && fieldOrder) {
    for (const field of fieldOrder) {
      if (fieldsWithErrors.has(field)) {
        const refToFocus = fieldRefMap[field];
        if (refToFocus?.value?.focus && typeof refToFocus.value.focus === "function") {
          try {
            refToFocus.value.focus();
          } catch (e) {
            console.warn(`無法 focus 欄位 ${field}:`, e);
          }
          break;
        }
      }
    }
  }
}

/**
 * 建立空的錯誤物件
 *
 * @param fields - 欄位名稱陣列
 * @returns 初始化的錯誤物件
 *
 * @example
 * ```typescript
 * const errors = ref(createEmptyErrors(['name', 'email', 'phone']))
 * // { name: '', email: '', phone: '' }
 * ```
 */
export function createEmptyErrors<T extends string>(fields: T[]): Record<T, string> {
  return fields.reduce(
    (acc, field) => {
      acc[field] = "";
      return acc;
    },
    {} as Record<T, string>
  );
}

/**
 * 檢查是否有任何錯誤
 *
 * @param errors - 錯誤物件
 * @returns 是否有錯誤
 */
export function hasAnyError(errors: Record<string, string>): boolean {
  return Object.values(errors).some((error) => error !== "");
}

/**
 * 清空所有錯誤
 *
 * @param errors - 錯誤物件 Ref
 */
export function clearErrors<T extends Record<string, string>>(errors: Ref<T>): void {
  for (const key in errors.value) {
    errors.value[key] = "" as T[typeof key];
  }
}
