<template>
  <BaseDialog
    v-model="visible"
    title="確認離開"
    subtitle="您有未儲存的變更"
    width="sm"
    :close-on-overlay="false"
  >
    <p class="typo-sm text-neutral-600">離開此頁面將會遺失所有未儲存的變更，確定要離開嗎？</p>

    <template #footer>
      <button
        type="button"
        class="typo-sm-medium h-9 rounded border border-slate-300 px-4 text-neutral-600 transition-colors hover:bg-gray-50"
        @click="handleCancel"
      >
        取消
      </button>
      <button
        type="button"
        class="typo-sm-medium hover:bg-primary-600 h-9 rounded bg-primary-500 px-4 text-white transition-colors"
        @click="handleConfirm"
      >
        確定離開
      </button>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseDialog from "@/components/dialog/base-dialog.vue";

/**
 * 離開確認對話框
 */

interface Props {
  /** 控制對話框顯示/隱藏 (v-model) */
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
  cancel: [];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

/**
 * 取消離開
 */
function handleCancel() {
  emit("cancel");
  visible.value = false;
}

/**
 * 確認離開 - 只 emit 事件，由父元件控制關閉
 */
function handleConfirm() {
  emit("confirm");
  // 移除 visible.value = false，由父元件在導航完成後關閉
}
</script>
