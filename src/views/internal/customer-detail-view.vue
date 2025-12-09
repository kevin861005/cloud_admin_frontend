<template>
  <div class="flex h-full flex-col">
    <!-- 載入狀態 -->
    <Loading v-if="isLoading" message="載入資料中..." :show-spinner="true" />

    <!-- 錯誤狀態 -->
    <Alert v-else-if="error" type="error" title="載入失敗" :description="error" />

    <!-- 客戶資訊以及環境資訊 -->
    <div v-else-if="customerInfo" class="flex h-full flex-col">
      <!-- Header 區域 -->
      <HeaderCustomerInfo :customer-info="customerInfo" />

      <!-- 內容區域 -->
      <div class="flex-1 overflow-y-auto bg-gray-50">
        <!-- 區塊標題（距離 Header 20px，距離卡片 24px） -->
        <h2 class="px-10 pt-5 typo-xl-bold text-neutral-800">客戶資訊概覽</h2>

        <!-- 三張卡片容器 -->
        <CardContainer :height="360" :use-padding-top="true">
          <!-- 最新活動記錄卡片 -->
          <CardActivityRecords :activities="customerInfo.activities" />

          <!-- 環境設定資訊卡片 -->
          <CardEnvironmentInfo
            :environment-info="{
              frontendUrl: customerInfo.frontendUrl,
              backendUrl: customerInfo.backendUrl,
              autoUrl: customerInfo.autoUrl,
              pinCode: customerInfo.pinCode,
              domainName: customerInfo.domainName,
            }"
          />

          <!-- 聯絡資訊卡片 -->
          <CardContactInfo
            :contact-info="{
              contactPerson: customerInfo.contactPerson,
              phone: customerInfo.phone,
              email: customerInfo.email,
            }"
          />
        </CardContainer>

        <div class="flex flex-1 items-center justify-between px-10">
          <h2 class="typo-xl-bold text-neutral-800">系統環境與運行狀態</h2>

          <button
            class="inline-flex items-center justify-center gap-1 h-7 pr-3 pl-2 rounded typo-xs-bold text-neutral-600 cursor-pointer hover:bg-opacity-80 transition-colors"
            @click="openDeleteDialog(customerInfo.customerName)"
          >
            <img :src="TrashIcon" alt="刪除環境" class="h-4 w-4" />

            <span>刪除環境</span>
          </button>
        </div>

        <CardContainer :height="190" :use-padding-top="true" :padding-top="20" :gap="12">
          <!-- Docker 狀態卡片 -->
          <CardDocker
            v-if="customerInfo.systemEnvironment"
            :docker-info="customerInfo.systemEnvironment.docker"
          />

          <!-- 資料庫狀態卡片 -->
          <CardDatabase
            v-if="customerInfo.systemEnvironment"
            :database-info="customerInfo.systemEnvironment.database"
          />

          <!-- DNS 設定卡片 -->
          <CardDNS
            v-if="customerInfo.systemEnvironment"
            :dns-info="customerInfo.systemEnvironment.dns"
          />

          <!-- NGINX 狀態卡片 -->
          <CardNGINX
            v-if="customerInfo.systemEnvironment"
            :nginx-info="customerInfo.systemEnvironment.nginx"
          />
        </CardContainer>

        <CardContainer :width-ratios="[1, 2]" :height="268" :use-padding-bottom="false">
          <!-- 需關注客戶卡片 -->
          <CardEfficacyMonitor
            v-if="customerInfo.systemEnvironment"
            :performance="customerInfo.systemEnvironment.performance"
          />

          <!-- 模組使用量卡片 -->
          <CardSystemRecords
            v-if="customerInfo.systemEnvironment"
            :systemLogs="customerInfo.systemEnvironment.systemLogs"
          />
        </CardContainer>
      </div>
    </div>
  </div>

  <!-- 刪除環境確認 Dialog -->
  <delete-environment-dialog
    v-model="showDeleteDialog"
    :environment-id="selectedEnvironmentId"
    @deleted="handleDeleted"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { customerService } from '@/services/customer.service'
import type { CustomerDetailInfo } from '@/types/customer'
import Alert from '@/components/common/alert.vue'
import Loading from '@/components/common/loading.vue'
import HeaderCustomerInfo from '@/components/customer/detail/header-customer-info.vue'
import CardContainer from '@/components/common/card-container.vue'
import CardActivityRecords from '@/components/customer/detail/card-activity-records.vue'
import CardEnvironmentInfo from '@/components/customer/detail/card-environment-info.vue'
import CardContactInfo from '@/components/customer/detail/card-contact-info.vue'
import CardDocker from '@/components/customer/detail/card-docker.vue'
import CardDatabase from '@/components/customer/detail/card-database.vue'
import CardDNS from '@/components/customer/detail/card-dns.vue'
import CardNGINX from '@/components/customer/detail/card-nginx.vue'
import CardSystemRecords from '@/components/customer/detail/card-system-records.vue'
import CardEfficacyMonitor from '@/components/customer/detail/card-efficacy-monitor.vue'
import DeleteEnvironmentDialog from '@/components/dialog/dialog-delete-environment.vue'
import TrashIcon from '@/assets/icons/common/cm-trash.svg'

const route = useRoute()

/**
 * 客戶詳細資訊
 */
const customerInfo = ref<CustomerDetailInfo | null>(null)

/**
 * 載入狀態
 */
const isLoading = ref(false)

/**
 * 錯誤訊息
 */
const error = ref<string | null>(null)

/**
 * 是否顯示刪除確認 Dialog
 */
const showDeleteDialog = ref(false)

/**
 * 載入客戶詳細資料
 */
const loadCustomerDetail = async () => {
  try {
    isLoading.value = true
    error.value = null

    const idParam = route.params.id
    const customerId = Array.isArray(idParam) ? idParam[0] : idParam

    if (!customerId) {
      throw new Error('無效的客戶 ID')
    }

    customerInfo.value = await customerService.getCustomerDetailById(customerId)
  } catch (err) {
    console.error('載入客戶詳細資料失敗:', err)
    error.value = err instanceof Error ? err.message : '載入失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

/**
 * 選中的環境 ID
 */
const selectedEnvironmentId = ref<string>()

/**
 * 元件掛載時載入資料
 */
onMounted(() => {
  loadCustomerDetail()
})

/**
 * 開啟刪除確認 Dialog
 */
function openDeleteDialog(environmentId: string) {
  selectedEnvironmentId.value = environmentId
  showDeleteDialog.value = true
}

/**
 * 刪除成功後的處理
 */
function handleDeleted() {
  console.log('執行刪除')
}
</script>
