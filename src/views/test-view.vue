<template>
  <div>
    <button @click="showUpdateDialog = true">更新映像</button>

    <UpdateImageDialog
      v-model="showUpdateDialog"
      :images="mockImages"
      @confirm="handleUpdateConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UpdateImageDialog from '@/components/environment/dialog-update-image.vue'
import type { DockerImage } from '@/types/service'

const showUpdateDialog = ref(false)

// 假資料
const mockImages: DockerImage[] = [
  {
    id: '1',
    name: '映像檔名',
    createdAt: '2025.11.12 上午10:20',
    size: '2.21GB',
    isLatest: true,
  },
  {
    id: '2',
    name: '映像檔名',
    createdAt: '2025.11.12 上午10:20',
    size: '2.21GB',
    isLatest: false,
  },
  {
    id: '3',
    name: '映像檔名',
    createdAt: '2025.11.12 上午10:20',
    size: '2.21GB',
    isLatest: false,
  },
  {
    id: '4',
    name: '映像檔名',
    createdAt: '2025.11.12 上午10:20',
    size: '2.21GB',
    isLatest: false,
  },
  // {
  //   id: '5',
  //   name: '映像檔名（第5個，會滾動）',
  //   createdAt: '2025.11.12 上午10:20',
  //   size: '2.21GB',
  //   isLatest: false,
  // },
]

function handleUpdateConfirm(imageId: string) {
  console.log('選中的映像 ID:', imageId)
  // 之後接進度條邏輯
}
</script>
