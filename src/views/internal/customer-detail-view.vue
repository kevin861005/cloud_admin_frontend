<template>
  <div class="flex h-full flex-col">
    <!-- 載入狀態 -->
    <div v-if="isLoading" class="flex flex-1 items-center justify-center">
      <div class="text-center">
        <div
          class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
        ></div>
        <p class="text-sm text-gray-600">載入中...</p>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="flex flex-1 items-center justify-center">
      <div class="text-center">
        <p class="mb-4 text-lg font-medium text-red-600">載入失敗</p>
        <p class="mb-4 text-sm text-gray-600">{{ error }}</p>
        <button
          @click="loadCustomerDetail"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          重新載入
        </button>
      </div>
    </div>

    <!-- 客戶資訊以及環境資訊 -->
    <div v-else-if="customerInfo" class="flex h-full flex-col">
      <!-- Header 區域 -->
      <HeaderCustomerInfo :customer-info="customerInfo" />

      <!-- 內容區域 -->
      <div class="flex-1 overflow-y-auto bg-gray-50">
        <!-- 區塊標題（距離 Header 20px，距離卡片 24px） -->
        <h2 class="px-10 pt-5 text-xl font-bold tracking-[-0.2px] text-gray-800">客戶資訊概覽</h2>

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

        <h2 class="px-10 text-xl font-bold tracking-[-0.2px] text-gray-800">系統環境與運行狀態</h2>

        <CardContainer :height="190" :use-padding-top="true" :padding-top="20" :gap="12">
          <!-- Docker 狀態卡片 -->
          <CardDocker :docker-info="customerInfo.systemEnvironment.docker" />

          <!-- 資料庫狀態卡片 -->
          <CardDatabase :database-info="customerInfo.systemEnvironment.database" />

          <!-- DNS 設定卡片 -->
          <CardDNS :dns-info="customerInfo.systemEnvironment.dns" />

          <!-- NGINX 狀態卡片 -->
          <CardNGINX :nginx-info="customerInfo.systemEnvironment.nginx" />
        </CardContainer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { CustomerDetailInfo } from '@/types/customer'
import { customerService } from '@/services/customer.service'
import HeaderCustomerInfo from '@/components/customer/detail/header-customer-info.vue'
import CardContainer from '@/components/common/card-container.vue'
import CardActivityRecords from '@/components/customer/detail/card-activity-records.vue'
import CardEnvironmentInfo from '@/components/customer/detail/card-environment-info.vue'
import CardContactInfo from '@/components/customer/detail/card-contact-info.vue'
import CardDocker from '@/components/customer/detail/card-docker.vue'
import CardDatabase from '@/components/customer/detail/card-database.vue'
import CardDNS from '@/components/customer/detail/card-dns.vue'
import CardNGINX from '@/components/customer/detail/card-nginx.vue'

/**
 * 客戶詳細頁面
 *
 * 用途：
 * - 顯示單一客戶的完整資訊
 * - 包含客戶基本資料、活動記錄、環境設定、聯絡資訊等
 *
 * 路由參數：
 * - id: 客戶 ID（從 URL 取得）
 *
 * 開發狀態：
 * - ✅ Header 區域已完成
 * - ✅ 客戶資訊概覽（三張卡片）已完成
 * - ⏳ 其他內容區域待實作
 */

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
 * 載入客戶詳細資料
 */
const loadCustomerDetail = async () => {
  try {
    isLoading.value = true
    error.value = null

    // 從路由參數取得客戶 ID
    const customerId = Number(route.params.id)

    // 驗證客戶 ID 是否有效
    if (!customerId || isNaN(customerId)) {
      throw new Error('無效的客戶 ID')
    }

    // 使用 Mock 資料（開發階段）
    customerInfo.value = await customerService.getMockCustomerDetail(customerId)
  } catch (err) {
    console.error('載入客戶詳細資料失敗:', err)
    error.value = err instanceof Error ? err.message : '載入失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

/**
 * 元件掛載時載入資料
 */
onMounted(() => {
  loadCustomerDetail()
})
</script>
