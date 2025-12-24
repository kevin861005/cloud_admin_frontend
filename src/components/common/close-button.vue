<template>
  <button
    type="button"
    class="flex h-10 w-10 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-600"
    :aria-label="ariaLabel"
    @click="$emit('click')"
  >
    <img :src="CloseIcon" alt="關閉" class="h-4 w-4" />
  </button>
</template>

<script setup lang="ts">
import CloseIcon from "@/assets/icons/common/cm-close.svg";

interface Props {
  /** 無障礙標籤 */
  ariaLabel?: string;
}

withDefaults(defineProps<Props>(), {
  ariaLabel: "關閉",
});

defineEmits<{
  click: [];
}>();
</script>
