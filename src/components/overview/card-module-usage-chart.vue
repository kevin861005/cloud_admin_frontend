<template>
  <div class="relative flex-1 h-[396px] bg-white rounded-lg shadow-md p-6 flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between h-[32px] px-6 mb-6">
      <h3 class="typo-base-bold text-neutral-700">模組使用量</h3>

      <!-- Toggle Switch -->
      <div class="flex items-center gap-2">
        <button
          @click="currentView = 'weekly'"
          class="px-4 py-2 typo-sm-medium rounded-lg transition-colors"
          :class="
            currentView === 'weekly'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-neutral-600 hover:bg-gray-200'
          "
        >
          週報
        </button>
        <button
          @click="currentView = 'monthly'"
          class="px-4 py-2 typo-sm-medium rounded-lg transition-colors"
          :class="
            currentView === 'monthly'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-neutral-600 hover:bg-gray-200'
          "
        >
          月報
        </button>
      </div>
    </div>

    <!-- 圖表區域 -->
    <div class="flex-1 min-h-0">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import { overviewService } from '@/services/overview.service'
import type { ModuleUsageData, ChartViewType } from '@/types/overview'

Chart.register(...registerables)

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const currentView = ref<ChartViewType>('weekly')

// 一開始沒有資料，等 API 回來再塞
const chartData = ref<ModuleUsageData | null>(null)

async function loadChartData() {
  try {
    const data = await overviewService.getModuleUsageData()
    chartData.value = data

    // 有舊圖表先銷毀
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }

    createChart()
  } catch (err) {
    console.error('載入模組使用量資料失敗:', err)
  }
}

function createChart() {
  if (!chartRef.value || !chartData.value) return

  const data = currentView.value === 'weekly' ? chartData.value.weekly : chartData.value.monthly

  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels: data.map((d) => d.label),
      datasets: [
        {
          label: 'Master',
          data: data.map((d) => d.master),
          backgroundColor: '#374151',
          barPercentage: 0.8,
        },
        {
          label: 'GGF',
          data: data.map((d) => d.ggf),
          backgroundColor: '#6B7280',
          barPercentage: 0.8,
        },
        {
          label: 'HR',
          data: data.map((d) => d.hr),
          backgroundColor: '#9CA3AF',
          barPercentage: 0.8,
        },
        {
          label: 'ESG',
          data: data.map((d) => d.esg),
          backgroundColor: '#D1D5DB',
          barPercentage: 0.8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          max: currentView.value === 'weekly' ? 20 : 80,
          ticks: { stepSize: 5 },
          grid: { color: '#E5E7EB' },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          align: 'end',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            font: { size: 12 },
          },
        },
      },
    },
  })
}

function updateChart() {
  if (!chartInstance || !chartData.value) return

  const data = currentView.value === 'weekly' ? chartData.value.weekly : chartData.value.monthly

  chartInstance.data.labels = data.map((d) => d.label)
  chartInstance.data.datasets[0]!.data = data.map((d) => d.master)
  chartInstance.data.datasets[1]!.data = data.map((d) => d.ggf)
  chartInstance.data.datasets[2]!.data = data.map((d) => d.hr)
  chartInstance.data.datasets[3]!.data = data.map((d) => d.esg)

  // 更新 Y 軸最大值
  if (chartInstance.options.scales?.y && typeof chartInstance.options.scales.y === 'object') {
    chartInstance.options.scales.y.max = currentView.value === 'weekly' ? 20 : 80
  }

  chartInstance.update()
}

onMounted(() => {
  loadChartData()
})

watch(currentView, () => {
  updateChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>
