/**
 * 客戶 API Service
 * 提供客戶管理相關的 API 呼叫
 */

import axios from '@/utils/axios'
import type { ApiResponse } from '@/types/common'
import type { CustomerListItem, CustomerDetailInfo } from '@/types/customer'

/**
 * 客戶服務
 */
export const customerService = {
  /**
   * 取得所有客戶列表
   * GET /api/customers
   *
   * @returns Promise<CustomerListItem[]> 客戶列表
   */
  async getAllCustomers(): Promise<CustomerListItem[]> {
    const response = await axios.get<ApiResponse<CustomerListItem[]>>('/customers')

    // 如果 API 回傳失敗或沒有資料，拋出錯誤
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得客戶列表失敗')
    }

    return response.data.data
  },

  /**
   * 取得單一客戶詳情
   * GET /api/customers/{id}
   *
   * 用途:
   * 1. 客戶詳情頁面
   * 2. Drawer 顯示客戶完整資訊
   *
   * @param id - 客戶 ID
   * @returns Promise<Customer> 客戶詳情
   */
  async getCustomerById(id: number): Promise<CustomerListItem> {
    const response = await axios.get<ApiResponse<CustomerListItem>>(`/customers/${id}`)

    // 如果 API 回傳失敗或沒有資料，拋出錯誤
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得客戶詳情失敗')
    }

    return response.data.data
  },

  /**
   * 批量刪除客戶
   * DELETE /api/customers/batch
   *
   * 用途:
   * 1. 客戶列表批量刪除功能
   *
   * @param ids - 客戶 ID 陣列
   * @returns Promise<void>
   */
  async batchDeleteCustomers(ids: number[]): Promise<void> {
    const response = await axios.delete<ApiResponse<void>>('/customers/batch', {
      data: { ids },
    })

    // 如果 API 回傳失敗，拋出錯誤
    if (!response.data.success) {
      throw new Error(response.data.message || '批量刪除客戶失敗')
    }
  },

  // ===== Mock 資料（開發階段使用） =====

  /**
   * Mock Data - 客戶列表
   *
   * 注意：此方法僅用於開發階段
   * 上線前請切換為 getAllCustomers() 方法
   *
   * @returns Promise<CustomerListItem[]> 包含 16 筆測試客戶資料
   */
  async getMockCustomers(): Promise<CustomerListItem[]> {
    // 可選：模擬網路延遲
    // await new Promise(resolve => setTimeout(resolve, 300))

    return [
      {
        id: 1,
        name: '橘色科技',
        status: 'ACTIVE',
        lastUsed: '2025-10-14',
        module: 'Master',
        sales: '周經理',
        industry: '科技業',
        link: 'orange-tech.com',
      },
      {
        id: 2,
        name: '藍天餐飲',
        status: 'INACTIVE',
        lastUsed: '2025-09-20',
        module: 'GGF',
        sales: '林經理',
        industry: '餐飲業',
        link: 'blue-sky-food.com',
      },
      {
        id: 3,
        name: '綠光企業',
        status: 'ACTIVE',
        lastUsed: '2025-10-13',
        module: 'Master',
        sales: '周經理',
        industry: '製造業',
        link: 'green-light.com',
      },
      {
        id: 4,
        name: '紅葉商店',
        status: 'UNUSED',
        lastUsed: '2025-05-10',
        module: 'GGF',
        sales: '陳經理',
        industry: '零售業',
        link: 'red-leaf-shop.com',
      },
      {
        id: 5,
        name: '黃金地產',
        status: 'ACTIVE',
        lastUsed: '2025-10-12',
        module: 'Master',
        sales: '林經理',
        industry: '房地產',
        link: 'golden-estate.com',
      },
      {
        id: 6,
        name: '紫羅蘭服飾',
        status: 'INACTIVE',
        lastUsed: '2025-08-15',
        module: 'GGF',
        sales: '周經理',
        industry: '服飾業',
        link: 'violet-fashion.com',
      },
      {
        id: 7,
        name: '白雲旅行社',
        status: 'ACTIVE',
        lastUsed: '2025-10-11',
        module: 'Master',
        sales: '陳經理',
        industry: '旅遊業',
        link: 'white-cloud-travel.com',
      },
      {
        id: 8,
        name: '黑貓物流',
        status: 'ACTIVE',
        lastUsed: '2025-10-14',
        module: 'GGF',
        sales: '林經理',
        industry: '物流業',
        link: 'black-cat-logistics.com',
      },
      {
        id: 9,
        name: '粉紅醫美',
        status: 'INACTIVE',
        lastUsed: '2025-09-05',
        module: 'Master',
        sales: '周經理',
        industry: '醫療業',
        link: 'pink-beauty.com',
      },
      {
        id: 10,
        name: '灰色設計',
        status: 'UNUSED',
        lastUsed: '2025-04-20',
        module: 'GGF',
        sales: '陳經理',
        industry: '設計業',
        link: 'grey-design.com',
      },
      {
        id: 11,
        name: '銀河金融',
        status: 'ACTIVE',
        lastUsed: '2025-10-13',
        module: 'Master',
        sales: '林經理',
        industry: '金融業',
        link: 'galaxy-finance.com',
      },
      {
        id: 12,
        name: '青草茶飲',
        status: 'INACTIVE',
        lastUsed: '2025-08-30',
        module: 'GGF',
        sales: '周經理',
        industry: '餐飲業',
        link: 'green-tea-shop.com',
      },
      {
        id: 13,
        name: '棕櫚建設',
        status: 'ACTIVE',
        lastUsed: '2025-10-10',
        module: 'Master',
        sales: '陳經理',
        industry: '建築業',
        link: 'palm-construction.com',
      },
      {
        id: 14,
        name: '深藍科技',
        status: 'ACTIVE',
        lastUsed: '2025-10-14',
        module: 'GGF',
        sales: '林經理',
        industry: '科技業',
        link: 'deep-blue-tech.com',
      },
      {
        id: 15,
        name: '淺綠農場',
        status: 'UNUSED',
        lastUsed: '2025-06-15',
        module: 'Master',
        sales: '周經理',
        industry: '農業',
        link: 'light-green-farm.com',
      },
      {
        id: 16,
        name: '深紫律師',
        status: 'INACTIVE',
        lastUsed: '2025-09-10',
        module: 'GGF',
        sales: '陳經理',
        industry: '法律業',
        link: 'deep-purple-law.com',
      },
    ]
  },

  /**
   * Mock Data - 客戶詳細資料
   *
   * 注意：此方法僅用於開發階段
   * 上線前請切換為實際的 API 方法
   *
   * @param customerId - 客戶 ID
   * @returns Promise<CustomerDetailInfo> 客戶詳細資料
   */
  async getMockCustomerDetail(customerId: number): Promise<CustomerDetailInfo> {
    // 模擬網路延遲
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock 資料映射表（對應 getMockCustomers 的 16 筆資料）
    const mockData: Record<number, CustomerDetailInfo> = {
      1: {
        customerName: '橘色科技',
        industry: '科技業',
        status: 'ACTIVE',
        autoUrl: 'https://www.orange-tech.com/auto',
        frontendUrl: 'https://www.orange-tech.com',
        backendUrl: 'https://admin.orange-tech.com',
        pinCode: '01283012',
        domainName: 'orange-tech.example.com',
        createdAt: '2025.02.12',
        usageTime: '2天前',
        module: 'Master',
        salesPerson: '周經理',
        contactPerson: '張先生',
        phone: '02-12345678',
        email: 'contact@orange-tech.com',
        activities: [
          {
            datetime: '2024.09.12 下午14:30',
            module: '人事管理',
            action: '新增員工資料',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '工作站管理',
            action: '更新設備狀態',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '排崗作業',
            action: '發布新班表',
          },
          {
            datetime: '2024.09.11 下午16:20',
            module: '考勤管理',
            action: '匯入打卡記錄',
          },
        ],
        systemEnvironment: {
          docker: {
            serviceName: 'Docker',
            status: 'RUNNING',
            statusText: '運行中',
            details: 'v2.4.1',
          },
          database: {
            serviceName: '資料庫',
            status: 'NORMAL',
            statusText: '正常',
            details: 'OrangeTech_production',
          },
          dns: {
            serviceName: 'DNS',
            status: 'NORMAL',
            statusText: 'DNS紀錄有效',
            details: '',
          },
          nginx: {
            serviceName: 'NGINX',
            status: 'RUNNING',
            statusText: '代理運行',
            details: '',
          },
          performance: {
            cpu: 45,
            memory: 52,
            disk: 38,
          },
          systemLogs: [
            {
              datetime: '2024.09.12 下午14:30',
              service: 'DNS',
              message: '解析更新完成',
            },
            {
              datetime: '2024.09.12 下午14:30',
              service: '資料庫',
              message: '容器健康檢查通過',
            },
            {
              datetime: '2024.09.12 下午14:30',
              service: 'NGINX',
              message: 'Nginx 配置重新載入',
            },
          ],
        },
      },
      2: {
        customerName: '藍天餐飲',
        industry: '餐飲業',
        status: 'INACTIVE',
        autoUrl: 'https://www.blue-sky-food.com/auto',
        frontendUrl: 'https://www.blue-sky-food.com',
        backendUrl: 'https://admin.blue-sky-food.com',
        pinCode: '02938475',
        domainName: 'blue-sky-food.example.com',
        createdAt: '2025.01.15',
        usageTime: '55天前',
        module: 'GGF',
        salesPerson: '林經理',
        contactPerson: '李小姐',
        phone: '02-23456789',
        email: 'info@blue-sky-food.com',
        activities: [
          {
            datetime: '2024.09.12 下午14:30',
            module: '人事管理',
            action: '新增員工資料',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '工作站管理',
            action: '更新設備狀態',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '排崗作業',
            action: '發布新班表',
          },
          {
            datetime: '2024.09.11 下午16:20',
            module: '考勤管理',
            action: '匯入打卡記錄',
          },
        ],
        systemEnvironment: {
          docker: {
            serviceName: 'Docker',
            status: 'RUNNING',
            statusText: '運行中',
            details: 'v2.3.8',
          },
          database: {
            serviceName: '資料庫',
            status: 'NORMAL',
            statusText: '正常',
            details: 'BlueSky_production',
          },
          dns: {
            serviceName: 'DNS',
            status: 'NORMAL',
            statusText: 'DNS紀錄有效',
            details: '',
          },
          nginx: {
            serviceName: 'NGINX',
            status: 'RUNNING',
            statusText: '代理運行',
            details: '',
          },
          performance: {
            cpu: 68,
            memory: 72,
            disk: 55,
          },
          systemLogs: [
            {
              datetime: '2024.09.10 上午10:15',
              service: 'NGINX',
              message: '連線逾時警告已解決',
            },
            {
              datetime: '2024.09.10 上午10:10',
              service: '資料庫',
              message: '查詢效能優化完成',
            },
            {
              datetime: '2024.09.09 下午16:30',
              service: 'DNS',
              message: 'DNS 記錄更新',
            },
          ],
        },
      },
      3: {
        customerName: '綠光企業',
        industry: '製造業',
        status: 'ACTIVE',
        autoUrl: 'https://www.green-light.com/auto',
        frontendUrl: 'https://www.green-light.com',
        backendUrl: 'https://admin.green-light.com',
        pinCode: '03847261',
        domainName: 'green-light.example.com',
        createdAt: '2025.02.10',
        usageTime: '3天前',
        module: 'Master',
        salesPerson: '周經理',
        contactPerson: '王經理',
        phone: '03-34567890',
        email: 'contact@green-light.com',
        activities: [
          {
            datetime: '2024.09.12 下午14:30',
            module: '人事管理',
            action: '新增員工資料',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '工作站管理',
            action: '更新設備狀態',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '排崗作業',
            action: '發布新班表',
          },
          {
            datetime: '2024.09.11 下午16:20',
            module: '考勤管理',
            action: '匯入打卡記錄',
          },
        ],
        systemEnvironment: {
          docker: {
            serviceName: 'Docker',
            status: 'RUNNING',
            statusText: '運行中',
            details: 'v2.4.1',
          },
          database: {
            serviceName: '資料庫',
            status: 'NORMAL',
            statusText: '正常',
            details: 'GreenLight_production',
          },
          dns: {
            serviceName: 'DNS',
            status: 'NORMAL',
            statusText: 'DNS紀錄有效',
            details: '',
          },
          nginx: {
            serviceName: 'NGINX',
            status: 'RUNNING',
            statusText: '代理運行',
            details: '',
          },
          performance: {
            cpu: 38,
            memory: 42,
            disk: 35,
          },
          systemLogs: [
            {
              datetime: '2024.09.12 下午15:10',
              service: 'Docker',
              message: '系統檢查完成',
            },
            {
              datetime: '2024.09.12 下午15:05',
              service: '資料庫',
              message: '索引優化完成',
            },
            {
              datetime: '2024.09.12 下午15:00',
              service: 'NGINX',
              message: 'SSL 憑證更新',
            },
          ],
        },
      },
      4: {
        customerName: '紅葉商店',
        industry: '零售業',
        status: 'UNUSED',
        autoUrl: 'https://www.red-leaf-shop.com/auto',
        frontendUrl: 'https://www.red-leaf-shop.com',
        backendUrl: 'https://admin.red-leaf-shop.com',
        pinCode: '04756382',
        domainName: 'red-leaf-shop.example.com',
        createdAt: '2024.12.20',
        usageTime: '216天前',
        module: 'GGF',
        salesPerson: '陳經理',
        contactPerson: '陳店長',
        phone: '04-45678901',
        email: 'shop@red-leaf.com',
        activities: [
          {
            datetime: '2024.09.12 下午14:30',
            module: '人事管理',
            action: '新增員工資料',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '工作站管理',
            action: '更新設備狀態',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '排崗作業',
            action: '發布新班表',
          },
          {
            datetime: '2024.09.11 下午16:20',
            module: '考勤管理',
            action: '匯入打卡記錄',
          },
        ],
        systemEnvironment: {
          docker: {
            serviceName: 'Docker',
            status: 'STOPPED',
            statusText: '已停止',
            details: 'v2.2.5',
          },
          database: {
            serviceName: '資料庫',
            status: 'STOPPED',
            statusText: '已停止',
            details: 'RedLeaf_production',
          },
          dns: {
            serviceName: 'DNS',
            status: 'ERROR',
            statusText: 'DNS紀錄過期',
            details: '',
          },
          nginx: {
            serviceName: 'NGINX',
            status: 'STOPPED',
            statusText: '代理已停止',
            details: '',
          },
          performance: {
            cpu: 0,
            memory: 0,
            disk: 88,
          },
          systemLogs: [
            {
              datetime: '2024.06.15 上午09:00',
              service: 'Docker',
              message: '容器已停止',
            },
            {
              datetime: '2024.06.15 上午08:55',
              service: '資料庫',
              message: '連線中斷',
            },
            {
              datetime: '2024.06.15 上午08:50',
              service: 'NGINX',
              message: '服務停止',
            },
          ],
        },
      },
      5: {
        customerName: '黃金地產',
        industry: '房地產',
        status: 'ACTIVE',
        autoUrl: 'https://www.golden-estate.com/auto',
        frontendUrl: 'https://www.golden-estate.com',
        backendUrl: 'https://admin.golden-estate.com',
        pinCode: '05665493',
        domainName: 'golden-estate.example.com',
        createdAt: '2025.02.08',
        usageTime: '4天前',
        module: 'Master',
        salesPerson: '林經理',
        contactPerson: '黃總',
        phone: '02-56789012',
        email: 'info@golden-estate.com',
        activities: [
          {
            datetime: '2024.09.12 下午14:30',
            module: '人事管理',
            action: '新增員工資料',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '工作站管理',
            action: '更新設備狀態',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '排崗作業',
            action: '發布新班表',
          },
          {
            datetime: '2024.09.11 下午16:20',
            module: '考勤管理',
            action: '匯入打卡記錄',
          },
        ],
        systemEnvironment: {
          docker: {
            serviceName: 'Docker',
            status: 'RUNNING',
            statusText: '運行中',
            details: 'v2.4.0',
          },
          database: {
            serviceName: '資料庫',
            status: 'NORMAL',
            statusText: '正常',
            details: 'Golden_production',
          },
          dns: {
            serviceName: 'DNS',
            status: 'NORMAL',
            statusText: 'DNS紀錄有效',
            details: '',
          },
          nginx: {
            serviceName: 'NGINX',
            status: 'RUNNING',
            statusText: '代理運行',
            details: '',
          },
          performance: {
            cpu: 55,
            memory: 48,
            disk: 62,
          },
          systemLogs: [
            {
              datetime: '2024.09.12 下午16:00',
              service: 'NGINX',
              message: '負載平衡配置更新',
            },
            {
              datetime: '2024.09.12 下午15:55',
              service: '資料庫',
              message: '連線池擴充完成',
            },
            {
              datetime: '2024.09.12 下午15:50',
              service: 'DNS',
              message: 'CDN 設定更新',
            },
          ],
        },
      },
      6: {
        customerName: '紫羅蘭服飾',
        industry: '服飾業',
        status: 'INACTIVE',
        autoUrl: 'https://www.violet-fashion.com/auto',
        frontendUrl: 'https://www.violet-fashion.com',
        backendUrl: 'https://admin.violet-fashion.com',
        pinCode: '06574604',
        domainName: 'violet-fashion.example.com',
        createdAt: '2025.01.05',
        usageTime: '90天前',
        module: 'GGF',
        salesPerson: '周經理',
        contactPerson: '紫小姐',
        phone: '02-67890123',
        email: 'contact@violet-fashion.com',
        activities: [
          {
            datetime: '2024.09.12 下午14:30',
            module: '人事管理',
            action: '新增員工資料',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '工作站管理',
            action: '更新設備狀態',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '排崗作業',
            action: '發布新班表',
          },
          {
            datetime: '2024.09.11 下午16:20',
            module: '考勤管理',
            action: '匯入打卡記錄',
          },
        ],
        systemEnvironment: {
          docker: {
            serviceName: 'Docker',
            status: 'RUNNING',
            statusText: '運行中',
            details: 'v2.3.6',
          },
          database: {
            serviceName: '資料庫',
            status: 'NORMAL',
            statusText: '正常',
            details: 'Violet_production',
          },
          dns: {
            serviceName: 'DNS',
            status: 'NORMAL',
            statusText: 'DNS紀錄有效',
            details: '',
          },
          nginx: {
            serviceName: 'NGINX',
            status: 'ERROR',
            statusText: '連線異常',
            details: '',
          },
          performance: {
            cpu: 75,
            memory: 82,
            disk: 68,
          },
          systemLogs: [
            {
              datetime: '2024.09.08 上午11:30',
              service: 'NGINX',
              message: '連線逾時錯誤',
            },
            {
              datetime: '2024.09.08 上午11:25',
              service: 'NGINX',
              message: '嘗試重新連線',
            },
            {
              datetime: '2024.09.08 上午11:20',
              service: '資料庫',
              message: '查詢回應緩慢',
            },
          ],
        },
      },
      7: {
        customerName: '白雲旅行社',
        industry: '旅遊業',
        status: 'ACTIVE',
        autoUrl: 'https://www.white-cloud-travel.com/auto',
        frontendUrl: 'https://www.white-cloud-travel.com',
        backendUrl: 'https://admin.white-cloud-travel.com',
        pinCode: '07483715',
        domainName: 'white-cloud-travel.example.com',
        createdAt: '2025.02.01',
        usageTime: '5天前',
        module: 'Master',
        salesPerson: '陳經理',
        contactPerson: '白經理',
        phone: '02-78901234',
        email: 'travel@white-cloud.com',
        activities: [
          {
            datetime: '2024.09.12 下午14:30',
            module: '人事管理',
            action: '新增員工資料',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '工作站管理',
            action: '更新設備狀態',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '排崗作業',
            action: '發布新班表',
          },
          {
            datetime: '2024.09.11 下午16:20',
            module: '考勤管理',
            action: '匯入打卡記錄',
          },
        ],
        systemEnvironment: {
          docker: {
            serviceName: 'Docker',
            status: 'RUNNING',
            statusText: '運行中',
            details: 'v2.4.1',
          },
          database: {
            serviceName: '資料庫',
            status: 'NORMAL',
            statusText: '正常',
            details: 'WhiteCloud_production',
          },
          dns: {
            serviceName: 'DNS',
            status: 'NORMAL',
            statusText: 'DNS紀錄有效',
            details: '',
          },
          nginx: {
            serviceName: 'NGINX',
            status: 'RUNNING',
            statusText: '代理運行',
            details: '',
          },
          performance: {
            cpu: 42,
            memory: 38,
            disk: 45,
          },
          systemLogs: [
            {
              datetime: '2024.09.12 下午17:00',
              service: 'DNS',
              message: 'HTTPS 憑證自動更新',
            },
            {
              datetime: '2024.09.12 下午16:55',
              service: 'NGINX',
              message: '快取清理完成',
            },
            {
              datetime: '2024.09.12 下午16:50',
              service: '資料庫',
              message: '定期維護完成',
            },
          ],
        },
      },
      8: {
        customerName: '黑貓物流',
        industry: '物流業',
        status: 'ACTIVE',
        autoUrl: 'https://www.black-cat-logistics.com/auto',
        frontendUrl: 'https://www.black-cat-logistics.com',
        backendUrl: 'https://admin.black-cat-logistics.com',
        pinCode: '08392826',
        domainName: 'black-cat-logistics.example.com',
        createdAt: '2025.02.12',
        usageTime: '2天前',
        module: 'GGF',
        salesPerson: '林經理',
        contactPerson: '黑先生',
        phone: '02-89012345',
        email: 'logistics@black-cat.com',
        activities: [
          {
            datetime: '2024.09.12 下午14:30',
            module: '人事管理',
            action: '新增員工資料',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '工作站管理',
            action: '更新設備狀態',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '排崗作業',
            action: '發布新班表',
          },
          {
            datetime: '2024.09.11 下午16:20',
            module: '考勤管理',
            action: '匯入打卡記錄',
          },
        ],
        systemEnvironment: {
          docker: {
            serviceName: 'Docker',
            status: 'RUNNING',
            statusText: '運行中',
            details: 'v2.4.1',
          },
          database: {
            serviceName: '資料庫',
            status: 'NORMAL',
            statusText: '正常',
            details: 'BlackCat_production',
          },
          dns: {
            serviceName: 'DNS',
            status: 'NORMAL',
            statusText: 'DNS紀錄有效',
            details: '',
          },
          nginx: {
            serviceName: 'NGINX',
            status: 'RUNNING',
            statusText: '代理運行',
            details: '',
          },
          performance: {
            cpu: 58,
            memory: 65,
            disk: 52,
          },
          systemLogs: [
            {
              datetime: '2024.09.12 下午18:00',
              service: '資料庫',
              message: '批次資料處理完成',
            },
            {
              datetime: '2024.09.12 下午17:55',
              service: 'NGINX',
              message: 'API 限流規則更新',
            },
            {
              datetime: '2024.09.12 下午17:50',
              service: 'Docker',
              message: '記憶體配置調整',
            },
          ],
        },
      },
      9: {
        customerName: '粉紅醫美',
        industry: '醫療業',
        status: 'INACTIVE',
        autoUrl: 'https://www.pink-beauty.com/auto',
        frontendUrl: 'https://www.pink-beauty.com',
        backendUrl: 'https://admin.pink-beauty.com',
        pinCode: '09201937',
        domainName: 'pink-beauty.example.com',
        createdAt: '2024.12.15',
        usageTime: '130天前',
        module: 'Master',
        salesPerson: '周經理',
        contactPerson: '粉醫師',
        phone: '02-90123456',
        email: 'beauty@pink-clinic.com',
        activities: [
          {
            datetime: '2024.09.12 下午14:30',
            module: '人事管理',
            action: '新增員工資料',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '工作站管理',
            action: '更新設備狀態',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '排崗作業',
            action: '發布新班表',
          },
          {
            datetime: '2024.09.11 下午16:20',
            module: '考勤管理',
            action: '匯入打卡記錄',
          },
        ],
        systemEnvironment: {
          docker: {
            serviceName: 'Docker',
            status: 'RUNNING',
            statusText: '運行中',
            details: 'v2.3.2',
          },
          database: {
            serviceName: '資料庫',
            status: 'NORMAL',
            statusText: '正常',
            details: 'Pink_production',
          },
          dns: {
            serviceName: 'DNS',
            status: 'NORMAL',
            statusText: 'DNS紀錄有效',
            details: '',
          },
          nginx: {
            serviceName: 'NGINX',
            status: 'RUNNING',
            statusText: '代理運行',
            details: '',
          },
          performance: {
            cpu: 82,
            memory: 78,
            disk: 85,
          },
          systemLogs: [
            {
              datetime: '2024.07.20 下午15:30',
              service: '資料庫',
              message: '磁碟空間不足警告',
            },
            {
              datetime: '2024.07.20 下午15:25',
              service: 'Docker',
              message: 'CPU 使用率持續偏高',
            },
            {
              datetime: '2024.07.20 下午15:20',
              service: 'NGINX',
              message: '回應時間超過閾值',
            },
          ],
        },
      },
      10: {
        customerName: '灰色設計',
        industry: '設計業',
        status: 'UNUSED',
        autoUrl: 'https://www.grey-design.com/auto',
        frontendUrl: 'https://www.grey-design.com',
        backendUrl: 'https://admin.grey-design.com',
        pinCode: '01110048',
        domainName: 'grey-design.example.com',
        createdAt: '2024.11.20',
        usageTime: '235天前',
        module: 'GGF',
        salesPerson: '陳經理',
        contactPerson: '灰設計師',
        phone: '03-01234567',
        email: 'design@grey.com',
        activities: [
          {
            datetime: '2024.09.12 下午14:30',
            module: '人事管理',
            action: '新增員工資料',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '工作站管理',
            action: '更新設備狀態',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '排崗作業',
            action: '發布新班表',
          },
          {
            datetime: '2024.09.11 下午16:20',
            module: '考勤管理',
            action: '匯入打卡記錄',
          },
        ],
        systemEnvironment: {
          docker: {
            serviceName: 'Docker',
            status: 'STOPPED',
            statusText: '已停止',
            details: 'v2.1.8',
          },
          database: {
            serviceName: '資料庫',
            status: 'STOPPED',
            statusText: '已停止',
            details: 'Grey_production',
          },
          dns: {
            serviceName: 'DNS',
            status: 'ERROR',
            statusText: 'DNS紀錄失效',
            details: '',
          },
          nginx: {
            serviceName: 'NGINX',
            status: 'STOPPED',
            statusText: '代理已停止',
            details: '',
          },
          performance: {
            cpu: 0,
            memory: 0,
            disk: 92,
          },
          systemLogs: [
            {
              datetime: '2024.04.10 下午17:00',
              service: 'Docker',
              message: '容器停止運行',
            },
            {
              datetime: '2024.04.10 下午16:55',
              service: '資料庫',
              message: '最後備份完成',
            },
            {
              datetime: '2024.04.10 下午16:50',
              service: 'NGINX',
              message: '服務終止',
            },
          ],
        },
      },
      11: {
        customerName: '銀河金融',
        industry: '金融業',
        status: 'ACTIVE',
        autoUrl: 'https://www.galaxy-finance.com/auto',
        frontendUrl: 'https://www.galaxy-finance.com',
        backendUrl: 'https://admin.galaxy-finance.com',
        pinCode: '01219159',
        domainName: 'galaxy-finance.example.com',
        createdAt: '2025.02.10',
        usageTime: '3天前',
        module: 'Master',
        salesPerson: '林經理',
        contactPerson: '銀總監',
        phone: '02-11234567',
        email: 'finance@galaxy.com',
        activities: [
          {
            datetime: '2024.09.12 下午14:30',
            module: '人事管理',
            action: '新增員工資料',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '工作站管理',
            action: '更新設備狀態',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '排崗作業',
            action: '發布新班表',
          },
          {
            datetime: '2024.09.11 下午16:20',
            module: '考勤管理',
            action: '匯入打卡記錄',
          },
        ],
        systemEnvironment: {
          docker: {
            serviceName: 'Docker',
            status: 'RUNNING',
            statusText: '運行中',
            details: 'v2.4.1',
          },
          database: {
            serviceName: '資料庫',
            status: 'NORMAL',
            statusText: '正常',
            details: 'Galaxy_production',
          },
          dns: {
            serviceName: 'DNS',
            status: 'NORMAL',
            statusText: 'DNS紀錄有效',
            details: '',
          },
          nginx: {
            serviceName: 'NGINX',
            status: 'RUNNING',
            statusText: '代理運行',
            details: '',
          },
          performance: {
            cpu: 35,
            memory: 40,
            disk: 32,
          },
          systemLogs: [
            {
              datetime: '2024.09.12 下午19:00',
              service: '資料庫',
              message: '加密備份完成',
            },
            {
              datetime: '2024.09.12 下午18:55',
              service: 'NGINX',
              message: '安全性掃描通過',
            },
            {
              datetime: '2024.09.12 下午18:50',
              service: 'Docker',
              message: '安全更新套用完成',
            },
          ],
        },
      },
      12: {
        customerName: '青草茶飲',
        industry: '餐飲業',
        status: 'INACTIVE',
        autoUrl: 'https://www.green-tea-shop.com/auto',
        frontendUrl: 'https://www.green-tea-shop.com',
        backendUrl: 'https://admin.green-tea-shop.com',
        pinCode: '01328260',
        domainName: 'green-tea-shop.example.com',
        createdAt: '2025.01.10',
        usageTime: '105天前',
        module: 'GGF',
        salesPerson: '周經理',
        contactPerson: '青老闆',
        phone: '04-23456789',
        email: 'tea@green-shop.com',
        activities: [
          {
            datetime: '2024.09.12 下午14:30',
            module: '人事管理',
            action: '新增員工資料',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '工作站管理',
            action: '更新設備狀態',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '排崗作業',
            action: '發布新班表',
          },
          {
            datetime: '2024.09.11 下午16:20',
            module: '考勤管理',
            action: '匯入打卡記錄',
          },
        ],
        systemEnvironment: {
          docker: {
            serviceName: 'Docker',
            status: 'RUNNING',
            statusText: '運行中',
            details: 'v2.3.5',
          },
          database: {
            serviceName: '資料庫',
            status: 'ERROR',
            statusText: '連線異常',
            details: 'GreenTea_production',
          },
          dns: {
            serviceName: 'DNS',
            status: 'NORMAL',
            statusText: 'DNS紀錄有效',
            details: '',
          },
          nginx: {
            serviceName: 'NGINX',
            status: 'RUNNING',
            statusText: '代理運行',
            details: '',
          },
          performance: {
            cpu: 72,
            memory: 85,
            disk: 78,
          },
          systemLogs: [
            {
              datetime: '2024.08.15 下午13:30',
              service: '資料庫',
              message: '連線逾時錯誤',
            },
            {
              datetime: '2024.08.15 下午13:25',
              service: '資料庫',
              message: '嘗試重新連線',
            },
            {
              datetime: '2024.08.15 下午13:20',
              service: 'Docker',
              message: '記憶體使用率達85%',
            },
          ],
        },
      },
      13: {
        customerName: '棕櫚建設',
        industry: '建築業',
        status: 'ACTIVE',
        autoUrl: 'https://www.palm-construction.com/auto',
        frontendUrl: 'https://www.palm-construction.com',
        backendUrl: 'https://admin.palm-construction.com',
        pinCode: '01437371',
        domainName: 'palm-construction.example.com',
        createdAt: '2025.02.05',
        usageTime: '6天前',
        module: 'Master',
        salesPerson: '陳經理',
        contactPerson: '棕總',
        phone: '07-34567890',
        email: 'construction@palm.com',
        activities: [
          {
            datetime: '2024.09.12 下午14:30',
            module: '人事管理',
            action: '新增員工資料',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '工作站管理',
            action: '更新設備狀態',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '排崗作業',
            action: '發布新班表',
          },
          {
            datetime: '2024.09.11 下午16:20',
            module: '考勤管理',
            action: '匯入打卡記錄',
          },
        ],
        systemEnvironment: {
          docker: {
            serviceName: 'Docker',
            status: 'RUNNING',
            statusText: '運行中',
            details: 'v2.4.0',
          },
          database: {
            serviceName: '資料庫',
            status: 'NORMAL',
            statusText: '正常',
            details: 'Palm_production',
          },
          dns: {
            serviceName: 'DNS',
            status: 'NORMAL',
            statusText: 'DNS紀錄有效',
            details: '',
          },
          nginx: {
            serviceName: 'NGINX',
            status: 'RUNNING',
            statusText: '代理運行',
            details: '',
          },
          performance: {
            cpu: 48,
            memory: 55,
            disk: 42,
          },
          systemLogs: [
            {
              datetime: '2024.09.12 下午20:00',
              service: 'Docker',
              message: '映像版本更新',
            },
            {
              datetime: '2024.09.12 下午19:55',
              service: '資料庫',
              message: '效能調校完成',
            },
            {
              datetime: '2024.09.12 下午19:50',
              service: 'NGINX',
              message: 'Gzip 壓縮啟用',
            },
          ],
        },
      },
      14: {
        customerName: '深藍科技',
        industry: '科技業',
        status: 'ACTIVE',
        autoUrl: 'https://www.deep-blue-tech.com/auto',
        frontendUrl: 'https://www.deep-blue-tech.com',
        backendUrl: 'https://admin.deep-blue-tech.com',
        pinCode: '01546482',
        domainName: 'deep-blue-tech.example.com',
        createdAt: '2025.02.12',
        usageTime: '2天前',
        module: 'GGF',
        salesPerson: '林經理',
        contactPerson: '藍博士',
        phone: '03-45678901',
        email: 'tech@deep-blue.com',
        activities: [
          {
            datetime: '2024.09.12 下午14:30',
            module: '人事管理',
            action: '新增員工資料',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '工作站管理',
            action: '更新設備狀態',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '排崗作業',
            action: '發布新班表',
          },
          {
            datetime: '2024.09.11 下午16:20',
            module: '考勤管理',
            action: '匯入打卡記錄',
          },
        ],
        systemEnvironment: {
          docker: {
            serviceName: 'Docker',
            status: 'RUNNING',
            statusText: '運行中',
            details: 'v2.4.1',
          },
          database: {
            serviceName: '資料庫',
            status: 'NORMAL',
            statusText: '正常',
            details: 'DeepBlue_production',
          },
          dns: {
            serviceName: 'DNS',
            status: 'NORMAL',
            statusText: 'DNS紀錄有效',
            details: '',
          },
          nginx: {
            serviceName: 'NGINX',
            status: 'RUNNING',
            statusText: '代理運行',
            details: '',
          },
          performance: {
            cpu: 52,
            memory: 58,
            disk: 48,
          },
          systemLogs: [
            {
              datetime: '2024.09.12 下午21:00',
              service: 'NGINX',
              message: 'WebSocket 連線穩定',
            },
            {
              datetime: '2024.09.12 下午20:55',
              service: '資料庫',
              message: 'Redis 快取命中率98%',
            },
            {
              datetime: '2024.09.12 下午20:50',
              service: 'Docker',
              message: '容器健康檢查正常',
            },
          ],
        },
      },
      15: {
        customerName: '淺綠農場',
        industry: '農業',
        status: 'UNUSED',
        autoUrl: 'https://www.light-green-farm.com/auto',
        frontendUrl: 'https://www.light-green-farm.com',
        backendUrl: 'https://admin.light-green-farm.com',
        pinCode: '01655593',
        domainName: 'light-green-farm.example.com',
        createdAt: '2024.11.15',
        usageTime: '180天前',
        module: 'Master',
        salesPerson: '周經理',
        contactPerson: '綠場長',
        phone: '05-56789012',
        email: 'farm@light-green.com',
        activities: [
          {
            datetime: '2024.09.12 下午14:30',
            module: '人事管理',
            action: '新增員工資料',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '工作站管理',
            action: '更新設備狀態',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '排崗作業',
            action: '發布新班表',
          },
          {
            datetime: '2024.09.11 下午16:20',
            module: '考勤管理',
            action: '匯入打卡記錄',
          },
        ],
        systemEnvironment: {
          docker: {
            serviceName: 'Docker',
            status: 'STOPPED',
            statusText: '已停止',
            details: 'v2.2.1',
          },
          database: {
            serviceName: '資料庫',
            status: 'STOPPED',
            statusText: '已停止',
            details: 'LightGreen_production',
          },
          dns: {
            serviceName: 'DNS',
            status: 'ERROR',
            statusText: 'DNS紀錄過期',
            details: '',
          },
          nginx: {
            serviceName: 'NGINX',
            status: 'STOPPED',
            statusText: '代理已停止',
            details: '',
          },
          performance: {
            cpu: 0,
            memory: 0,
            disk: 95,
          },
          systemLogs: [
            {
              datetime: '2024.05.20 上午10:00',
              service: 'Docker',
              message: '服務停止',
            },
            {
              datetime: '2024.05.20 上午09:55',
              service: '資料庫',
              message: '資料封存完成',
            },
            {
              datetime: '2024.05.20 上午09:50',
              service: 'NGINX',
              message: '代理服務終止',
            },
          ],
        },
      },
      16: {
        customerName: '深紫律師',
        industry: '法律業',
        status: 'INACTIVE',
        autoUrl: 'https://www.deep-purple-law.com/auto',
        frontendUrl: 'https://www.deep-purple-law.com',
        backendUrl: 'https://admin.deep-purple-law.com',
        pinCode: '01764604',
        domainName: 'deep-purple-law.example.com',
        createdAt: '2025.01.08',
        usageTime: '95天前',
        module: 'GGF',
        salesPerson: '陳經理',
        contactPerson: '紫律師',
        phone: '02-67890123',
        email: 'law@deep-purple.com',
        activities: [
          {
            datetime: '2024.09.12 下午14:30',
            module: '人事管理',
            action: '新增員工資料',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '工作站管理',
            action: '更新設備狀態',
          },
          {
            datetime: '2024.09.12 下午14:30',
            module: '排崗作業',
            action: '發布新班表',
          },
          {
            datetime: '2024.09.11 下午16:20',
            module: '考勤管理',
            action: '匯入打卡記錄',
          },
        ],
        systemEnvironment: {
          docker: {
            serviceName: 'Docker',
            status: 'RUNNING',
            statusText: '運行中',
            details: 'v2.3.7',
          },
          database: {
            serviceName: '資料庫',
            status: 'NORMAL',
            statusText: '正常',
            details: 'DeepPurple_production',
          },
          dns: {
            serviceName: 'DNS',
            status: 'NORMAL',
            statusText: 'DNS紀錄有效',
            details: '',
          },
          nginx: {
            serviceName: 'NGINX',
            status: 'RUNNING',
            statusText: '代理運行',
            details: '',
          },
          performance: {
            cpu: 78,
            memory: 82,
            disk: 72,
          },
          systemLogs: [
            {
              datetime: '2024.08.05 下午14:30',
              service: 'Docker',
              message: 'CPU 使用率偏高',
            },
            {
              datetime: '2024.08.05 下午14:25',
              service: '資料庫',
              message: '記憶體使用率82%',
            },
            {
              datetime: '2024.08.05 下午14:20',
              service: 'NGINX',
              message: '回應時間增加',
            },
          ],
        },
      },
    }

    // 根據 ID 返回對應的客戶資料
    const customerDetail = mockData[customerId]

    if (!customerDetail) {
      throw new Error(`找不到 ID 為 ${customerId} 的客戶資料`)
    }

    return customerDetail
  },
}
