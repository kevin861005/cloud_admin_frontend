/**
 * 環境 API Service
 * 提供環境管理相關的 API 呼叫
 */

import apiClient from '@/utils/axios'
import type { ApiResponse } from '@/types/common'
import type { StartTaskResponse } from '@/types/task'
import { ApiError } from '@/types/common'
import type { EnvironmentListItem, EnvironmentDetailInfo } from '@/types/environment'
import type { DockerImage } from '@/types/service'

/**
 * 環境服務
 */
export const environmentService = {
  /**
   * 取得所有環境列表
   * GET /api/environments
   *
   * @returns Promise<EnvironmentListItem[]> 環境列表
   */
  // async getAllEnvironments(): Promise<EnvironmentListItem[]> {
  //   const response = await axios.get<ApiResponse<EnvironmentListItem[]>>('/environments')

  //   // 如果 API 回傳失敗或沒有資料，拋出錯誤
  //   if (!response.data.success || !response.data.data) {
  //     throw new Error(response.data.message || '取得環境列表失敗')
  //   }

  //   return response.data.data
  // },

  /**
   * 重啟環境（回傳 taskId，用於 SSE 進度追蹤）
   * @param customerNo 客戶編號
   * @returns 包含 taskId 的回應
   * @throws {ApiError} 當 API 呼叫失敗時
   */
  async restartEnvironmentWithProgress(customerNo: string): Promise<StartTaskResponse> {
    const response = await apiClient.post<ApiResponse<StartTaskResponse>>(
      `/environments/${customerNo}/restart`,
    )

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || '啟動重啟任務失敗',
        data: response.data.data ?? null,
      })
    }

    return response.data.data
  },

  /**
   * 更新映像檔（回傳 taskId，用於 SSE 進度追蹤）
   * @param customerNo 客戶編號
   * @param imageId 映像檔 ID
   * @returns 包含 taskId 的回應
   * @throws {ApiError} 當 API 呼叫失敗時
   */
  async updateImageWithProgress(customerNo: string, imageId: string): Promise<StartTaskResponse> {
    const response = await apiClient.post<ApiResponse<StartTaskResponse>>(
      `/environments/${customerNo}/update-image`,
      { imageId },
    )

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || '啟動更新映像任務失敗',
        data: response.data.data ?? null,
      })
    }

    return response.data.data
  },

  /**
   * 取得所有可更新的映像檔
   * GET /api/environments/{customerNo}/images
   *
   * @returns  Promise<<DockerImage[]> 可更新的映像檔
   */
  async getAllImages(customerNo: string): Promise<DockerImage[]> {
    const response = await apiClient.get<ApiResponse<DockerImage[]>>(
      `/environments/${customerNo}/images`,
    )

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得可更新的映像檔失敗')
    }

    return response.data.data
  },

  // ===== Mock 資料（開發階段使用） =====

  /**
   * Mock Data - 環境列表
   *
   * 注意：此方法僅用於開發階段
   * 上線前請切換為 getAllEnvironments() 方法
   *
   * @returns Promise<EnvironmentListItem[]> 包含 16 筆測試環境資料
   */
  async getMockEnvironments(): Promise<EnvironmentListItem[]> {
    // 可選：模擬網路延遲
    // await new Promise(resolve => setTimeout(resolve, 300))

    return [
      {
        id: 1,
        customerName: '橘色科技',
        status: 'PENDING',
        appliedDate: '2025-10-01',
        notifiedDate: '',
        schedulatedDeleteDate: '',
        applicant: '周經理',
      },
      {
        id: 2,
        customerName: '藍天餐飲',
        status: 'NOTIFIED',
        appliedDate: '2025-09-15',
        notifiedDate: '2025-10-10',
        schedulatedDeleteDate: '',
        applicant: '林經理',
      },
      {
        id: 3,
        customerName: '綠光企業',
        status: 'TO_BE_DELETED',
        appliedDate: '2025-08-20',
        notifiedDate: '2025-09-25',
        schedulatedDeleteDate: '2025-11-15',
        applicant: '周經理',
      },
      {
        id: 4,
        customerName: '紅葉商店',
        status: 'PENDING',
        appliedDate: '2025-10-05',
        notifiedDate: '',
        schedulatedDeleteDate: '',
        applicant: '陳經理',
      },
      {
        id: 5,
        customerName: '黃金地產',
        status: 'NOTIFIED',
        appliedDate: '2025-09-10',
        notifiedDate: '2025-10-08',
        schedulatedDeleteDate: '',
        applicant: '林經理',
      },
      {
        id: 6,
        customerName: '紫羅蘭服飾',
        status: 'TO_BE_DELETED',
        appliedDate: '2025-08-05',
        notifiedDate: '2025-09-15',
        schedulatedDeleteDate: '2025-11-20',
        applicant: '周經理',
      },
      {
        id: 7,
        customerName: '白雲旅行社',
        status: 'PENDING',
        appliedDate: '2025-10-08',
        notifiedDate: '',
        schedulatedDeleteDate: '',
        applicant: '陳經理',
      },
      {
        id: 8,
        customerName: '黑貓物流',
        status: 'NOTIFIED',
        appliedDate: '2025-09-20',
        notifiedDate: '2025-10-12',
        schedulatedDeleteDate: '',
        applicant: '林經理',
      },
      {
        id: 9,
        customerName: '粉紅醫美',
        status: 'TO_BE_DELETED',
        appliedDate: '2025-08-10',
        notifiedDate: '2025-09-20',
        schedulatedDeleteDate: '2025-11-25',
        applicant: '周經理',
      },
      {
        id: 10,
        customerName: '灰色設計',
        status: 'PENDING',
        appliedDate: '2025-10-10',
        notifiedDate: '',
        schedulatedDeleteDate: '',
        applicant: '陳經理',
      },
      {
        id: 11,
        customerName: '銀河金融',
        status: 'NOTIFIED',
        appliedDate: '2025-09-25',
        notifiedDate: '2025-10-13',
        schedulatedDeleteDate: '',
        applicant: '林經理',
      },
      {
        id: 12,
        customerName: '青草茶飲',
        status: 'TO_BE_DELETED',
        appliedDate: '2025-08-15',
        notifiedDate: '2025-09-28',
        schedulatedDeleteDate: '2025-11-30',
        applicant: '周經理',
      },
      {
        id: 13,
        customerName: '棕櫚建設',
        status: 'PENDING',
        appliedDate: '2025-10-12',
        notifiedDate: '',
        schedulatedDeleteDate: '',
        applicant: '陳經理',
      },
      {
        id: 14,
        customerName: '深藍科技',
        status: 'NOTIFIED',
        appliedDate: '2025-09-28',
        notifiedDate: '2025-10-14',
        schedulatedDeleteDate: '',
        applicant: '林經理',
      },
      {
        id: 15,
        customerName: '淺綠農場',
        status: 'TO_BE_DELETED',
        appliedDate: '2025-08-25',
        notifiedDate: '2025-10-01',
        schedulatedDeleteDate: '2025-12-05',
        applicant: '周經理',
      },
      {
        id: 16,
        customerName: '深紫律師',
        status: 'PENDING',
        appliedDate: '2025-10-14',
        notifiedDate: '',
        schedulatedDeleteDate: '',
        applicant: '陳經理',
      },
    ]
  },

  /**
   * Mock Data - 環境詳細資料
   *
   * 注意：此方法僅用於開發階段
   * 上線前請切換為實際的 API 方法
   *
   * @param environmentId - 客戶 ID
   * @returns Promise<EnvironmentDetailInfo> 環境詳細資料
   */
  async getMockEnvironmentDetail(environmentId: number): Promise<EnvironmentDetailInfo> {
    // 模擬網路延遲
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock 資料映射表（對應 getMockCustomers 的 16 筆資料）
    const mockData: Record<number, EnvironmentDetailInfo> = {
      1: {
        customerName: '橘色科技',
        industry: '科技業',
        status: 'PENDING',
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
      },
      2: {
        customerName: '藍天餐飲',
        industry: '餐飲業',
        status: 'NOTIFIED',
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
      },
      3: {
        customerName: '綠光企業',
        industry: '製造業',
        status: 'TO_BE_DELETED',
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
      },
      4: {
        customerName: '紅葉商店',
        industry: '零售業',
        status: 'PENDING',
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
      },
      5: {
        customerName: '黃金地產',
        industry: '房地產',
        status: 'NOTIFIED',
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
      },
      6: {
        customerName: '紫羅蘭服飾',
        industry: '服飾業',
        status: 'TO_BE_DELETED',
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
      },
      7: {
        customerName: '白雲旅行社',
        industry: '旅遊業',
        status: 'PENDING',
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
      },
      8: {
        customerName: '黑貓物流',
        industry: '物流業',
        status: 'NOTIFIED',
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
      },
      9: {
        customerName: '粉紅醫美',
        industry: '醫療業',
        status: 'TO_BE_DELETED',
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
      },
      10: {
        customerName: '灰色設計',
        industry: '設計業',
        status: 'PENDING',
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
      },
      11: {
        customerName: '銀河金融',
        industry: '金融業',
        status: 'NOTIFIED',
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
      },
      12: {
        customerName: '青草茶飲',
        industry: '餐飲業',
        status: 'TO_BE_DELETED',
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
      },
      13: {
        customerName: '棕櫚建設',
        industry: '建築業',
        status: 'PENDING',
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
      },
      14: {
        customerName: '深藍科技',
        industry: '科技業',
        status: 'NOTIFIED',
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
      },
      15: {
        customerName: '淺綠農場',
        industry: '農業',
        status: 'TO_BE_DELETED',
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
      },
      16: {
        customerName: '深紫律師',
        industry: '法律業',
        status: 'PENDING',
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
      },
    }

    // 根據 ID 返回對應的客戶資料
    const environmentDetail = mockData[environmentId]

    if (!environmentDetail) {
      throw new Error(`找不到 ID 為 ${environmentId} 的環境資料`)
    }

    return environmentDetail
  },
}
