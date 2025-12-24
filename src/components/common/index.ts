/**
 * Common 元件統一匯出
 *
 * 提供通用元件的統一入口
 *
 * @example
 * ```typescript
 * import {
 *   Alert,
 *   Badge,
 *   Loading,
 *   Divider,
 * } from '@/components/common'
 * ```
 */

// 提示元件
export { default as Alert } from "./alert.vue";
export { default as ToastMessage } from "./toast-message.vue";

// 標籤元件
export { default as Badge } from "./badge.vue";
export { default as BadgeButton } from "./badge-button.vue";

// 容器元件
export { default as CardContainer } from "./card-container.vue";
export { default as StatCard } from "./stat-card.vue";

// 互動元件
export { default as CopyButton } from "./copy-button.vue";
export { default as Tooltip } from "./tooltip.vue";
export { default as CloseButton } from "./close-button.vue";
export { default as PaginationButton } from "./pagination-button.vue";

// 狀態元件
export { default as Loading } from "./loading.vue";
export { default as LoadingSpinner } from "./loading-spinner.vue";
export { default as EmptyState } from "./empty-state.vue";

// 佈局元件
export { default as Divider } from "./divider.vue";
export { default as PageTitle } from "./page-title.vue";
