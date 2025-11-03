<template>
  <!--
    Card-Dashboard: 卡片主容器
    - 白色背景、圓角、陰影
    - padding: 24px
    - gap: 20px (使用 space-y-5)
    - flex: 1 0 0 (使用 flex-1)
  -->
  <div class="flex-shrink-0 h-[272px] bg-white rounded-lg shadow-md p-6 flex flex-col gap-5">
    <!--
      Contents-Text: 文字內容區域
      - gap: 48px (使用 space-y-12)
    -->
    <div class="flex flex-col gap-12">
      <!--
        Card-Top: 頂部區域 (標題 + 總數)
        - justify-content: space-between
        - align-items: center
      -->
      <div class="flex justify-between items-center">
        <!--
          Card-top-Title: 左側標題區 (Icon + 文字)
          - gap: 12px
        -->
        <div class="flex items-center gap-3">
          <!--
            Card-top-Title-Icon-dashboard: 圖示
            - 尺寸: 32x32px
          -->
          <div class="flex flex-col items-start w-8 h-8 rounded-md">
            <img
              src="@/assets/icons/card/card-d-warning-filled.svg"
              alt="異常警示"
              class="w-full h-full"
            />
          </div>

          <!--
            Card-top-Title-Text: 標題文字
            - font-family: Noto Sans TC
            - font-size: 16px
            - font-weight: 700
            - line-height: 22px
          -->
          <span
            class="text-black text-base font-bold leading-[22px]"
            style="font-family: 'Noto Sans TC', sans-serif"
          >
            異常警示
          </span>
        </div>

        <!--
          Card-top-Text: 右側總筆數
          - font-family: Noto Sans TC
          - font-size: 24px
          - font-weight: 700
          - line-height: 30px
          - letter-spacing: -0.2px
        -->
        <span
          class="text-black text-2xl font-bold leading-[30px] tracking-[-0.2px]"
          style="font-family: 'Noto Sans TC', sans-serif"
        >
          {{ alertData.totalCount }}筆
        </span>
      </div>

      <!--
        Item-Text Section: 異常警示列表
        - gap: 8px (使用 space-y-2)
        - 只顯示前 3 筆資料
      -->
      <div class="flex flex-col gap-2">
        <!--
          Alert Item: 單一警示項目
          - 每個項目包含：類型標籤、日期時間、客戶名稱
          - 使用 slice(0, 3) 限制只顯示前 3 筆
        -->
        <div
          v-for="alert in alertData.alerts.slice(0, 3)"
          :key="alert.id"
          class="flex justify-between items-center"
        >
          <!-- 左側：類型標籤 + 日期時間 -->
          <div class="flex items-center gap-2">
            <!--
              Alert Type Badge: 異常類型標籤
              - width: auto (依內容調整，最小 73px)
              - height: 24px
              - border-radius: 4px
              - border-width: 1px
              - padding: 4px 12px
              - 根據類型顯示不同顏色
            -->
            <span
              class="inline-flex items-center justify-center h-6 px-3 rounded border text-xs font-medium whitespace-nowrap"
              :style="{
                backgroundColor: getAlertStyle(alert.type).bgColor,
                borderColor: getAlertStyle(alert.type).borderColor,
                color: getAlertStyle(alert.type).textColor,
                fontFamily: 'Noto Sans TC, sans-serif',
              }"
            >
              {{ getAlertStyle(alert.type).label }}
            </span>

            <!--
              Alert Time: 異常發生時間
              - font-family: Inter
              - font-size: 14px
              - font-weight: 400
              - color: #000000
            -->
            <span
              class="text-sm text-black"
              style="font-family: 'Inter', sans-serif; font-weight: 400"
            >
              {{ alert.occurredAt }}
            </span>
          </div>

          <!-- 右側：客戶名稱 -->
          <!--
            Customer Name: 客戶名稱
            - font-family: Noto Sans TC
            - font-size: 14px
            - font-weight: 400
            - color: #000000
            - text-align: right
          -->
          <span
            class="text-sm text-black text-right"
            style="font-family: 'Noto Sans TC', sans-serif; font-weight: 400"
          >
            {{ alert.customerName }}
          </span>
        </div>
      </div>
    </div>

    <!--
      Bottom BAR: 底部區域（更新時間 + 更多按鈕）
      - height: 24px
      - justify-content: space-between
      - align-items: center
      - 當總筆數 > 3 時才顯示「更多」按鈕
    -->
    <div class="flex justify-between items-center h-6">
      <!--
        Update Time: 更新時間
        - width: 107px (auto，依內容調整)
        - height: 24px
        - gap: 8px (左側文字與時間之間的間距)
      -->
      <div class="flex items-center gap-2 h-6">
        <span
          class="text-sm text-slate-500"
          style="font-family: 'Noto Sans TC', sans-serif; font-weight: 400"
        >
          更新時間：
        </span>
        <span
          class="text-sm text-slate-500"
          style="font-family: 'Noto Sans TC', sans-serif; font-weight: 400"
        >
          {{ updateTime }}
        </span>
      </div>

      <!--
        More Button: 更多按鈕
        - width: 41px (auto，依內容調整)
        - height: 24px
        - border-radius: 4px
        - border-width: 1px
        - padding: 4px 8px
        - background: #0000000D
        - border: 1px solid #0000001A
        - 只在 totalCount > 3 時顯示
      -->
      <button
        v-if="alertData.totalCount > 3"
        class="inline-flex items-center justify-center h-6 px-2 rounded border text-xs cursor-pointer hover:bg-opacity-80 transition-colors"
        style="
          background-color: #0000000d;
          border-color: #0000001a;
          font-family: 'Noto Sans TC', sans-serif;
          font-weight: 400;
        "
        @click="handleMoreClick"
      >
        更多
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMockRecentAlerts } from '@/services/overview.service'
import type { AlertListData, AlertType } from '@/types/overview'

/**
 * 異常警示資料
 * 目前使用 Mock Data，等後端 API 完成後改為呼叫 getRecentAlerts()
 */
const alertData = ref<AlertListData>({
  alerts: [],
  totalCount: 0,
})

/**
 * 更新時間（從 ApiResponse 的 timestamp 取得）
 * 格式：HH:mm（例如：11:10）
 */
const updateTime = ref<string>('--:--')

/**
 * 根據異常類型返回對應的標籤樣式和文字
 * @param type 異常類型
 */
const getAlertStyle = (type: AlertType) => {
  const config = {
    CREATE_FAILED: {
      label: '建立失敗',
      bgColor: '#FD58580D',
      borderColor: '#FD58581A',
      textColor: '#FD5858',
    },
    RUNTIME_ERROR: {
      label: '運行異常',
      bgColor: '#0000000D',
      borderColor: '#0000001A',
      textColor: '#000000',
    },
  }

  return config[type] || config.RUNTIME_ERROR
}

/**
 * 格式化 ISO 8601 時間戳記為 HH:mm 格式
 * @param isoString ISO 8601 格式的時間字串（UTC）
 * @returns 本地時間的 HH:mm 格式（例如：14:30）
 */
const formatUpdateTime = (isoString: string): string => {
  try {
    const date = new Date(isoString)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  } catch (error) {
    console.error('時間格式化失敗:', error)
    return '--:--'
  }
}

/**
 * 點擊「更多」按鈕的處理函數
 * 目前先使用 alert 提示，未來可改為跳轉到完整列表頁面
 */
const handleMoreClick = () => {
  alert('跳轉到完整異常警示列表（尚未實作）')
  // TODO: 未來可改為：
  // router.push('/alerts')
}

/**
 * 元件掛載時載入資料
 */
onMounted(() => {
  // 目前使用 Mock Data
  alertData.value = getMockRecentAlerts()

  // 設定更新時間為當前時間（模擬 API 回應的 timestamp）
  updateTime.value = formatUpdateTime(new Date().toISOString())

  // TODO: 等後端 API 完成後，改為以下程式碼：
  // try {
  //   const response = await axios.get<ApiResponse<AlertListData>>('/alerts/recent', {
  //     params: { limit: 3 }
  //   })
  //
  //   if (response.data.success && response.data.data) {
  //     alertData.value = response.data.data
  //     // 從 ApiResponse 的 timestamp 取得更新時間
  //     updateTime.value = formatUpdateTime(response.data.timestamp)
  //   }
  // } catch (error) {
  //   console.error('載入異常警示資料失敗:', error)
  //   // 可以顯示錯誤訊息給使用者
  // }
})
</script>

<style scoped>
/*
  此元件完全使用 Tailwind CSS 和 inline styles
  不需要額外的 CSS 樣式
*/
</style>
