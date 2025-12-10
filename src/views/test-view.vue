<template>
  <div>
    <!-- 測試按鈕 -->
    <button @click="startTask">開始任務</button>

    <!-- 進度條 Dialog -->
    <TaskProgressDialog
      v-model="showProgress"
      title="映像檔更新中..."
      description="此列顯示正在運行的操作"
      :progress="currentProgress"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TaskProgressDialog from '@/components/dialog/task-progress-dialog.vue'

const showProgress = ref(false)
const currentProgress = ref(0)

const startTask = () => {
  showProgress.value = true
  currentProgress.value = 0

  // 模擬進度更新
  const interval = setInterval(() => {
    currentProgress.value += 5
    if (currentProgress.value >= 100) {
      clearInterval(interval)
      // 完成後關閉 Dialog
      setTimeout(() => {
        showProgress.value = false
      }, 500)
    }
  }, 200)
}
</script>
