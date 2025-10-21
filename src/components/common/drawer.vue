<template>
  <!-- 使用 Teleport 將整個 Drawer 移到 body 最外層 -->
  <Teleport to="body">
    <!-- 背景遮罩 -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[60]"
        style="background: rgba(0, 0, 0, 0.2)"
        @click="handleClose"
      />
    </Transition>

    <!-- Drawer 內容 -->
    <Transition name="slide">
      <div
        v-if="isOpen"
        class="fixed right-0 top-0 bottom-0 z-[70] flex w-[355px] flex-col bg-white shadow-lg"
      >
        <!-- 關閉按鈕 -->
        <button
          class="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          @click="handleClose"
          aria-label="關閉"
        >
          <img src="@/assets/icons/common/close-icon.svg" alt="關閉" class="h-6 w-6" />
        </button>

        <!-- 內容區域 -->
        <div class="flex-1 overflow-y-auto">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const handleClose = () => {
  emit('close')
}

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
