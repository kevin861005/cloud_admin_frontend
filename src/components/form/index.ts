/**
 * Form 元件統一匯出
 *
 * 提供表單相關元件的統一入口
 *
 * @example
 * ```typescript
 * import {
 *   FormSection,
 *   FormInput,
 *   FormSelect,
 *   FormButtonGroup,
 * } from '@/components/form'
 * ```
 */

// 表單容器
export { default as FormSection } from "./form-section.vue";
export { default as FormSectionTitle } from "./form-section-title.vue";

// 表單輸入元件
export { default as FormInput } from "./form-input.vue";
export { default as FormSelect } from "./form-select.vue";
export { default as FormDatepicker } from "./form-datepicker.vue";
export { default as FormCheckboxGroup } from "./form-checkbox-group.vue";
export { default as FormRadioGroup } from "./form-radio-group.vue";

// 表單輔助元件
export { default as FormButtonGroup } from "./form-button-group.vue";
export { default as FieldError } from "./field-error.vue";
