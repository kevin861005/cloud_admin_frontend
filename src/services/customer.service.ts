/**
 * 客戶 API Service
 * 提供客戶管理相關的 API 呼叫
 */

import axios from '@/utils/axios'
import type { ApiResponse } from '@/types/common'
import type { Customer } from '@/types/customer'

/**
 * 取得所有客戶列表
 *
 * @returns Promise<Customer[]> 客戶列表
 *
 * @description
 * 後端 API Endpoint: GET /cloudAdmin/api/customers
 *
 * 回應格式範例：
 * {
 *   "success": true,
 *   "message": "查詢成功",
 *   "timestamp": "2025-10-16T08:30:45.123Z",
 *   "data": [
 *     {
 *       "id": 1,
 *       "name": "橘色科技",
 *       "status": "活躍",
 *       "lastUsed": "2025-10-14",
 *       "module": "Master",
 *       "sales": "周經理",
 *       "industry": "科技業",
 *       "link": "orange-tech.com"
 *     }
 *   ]
 * }
 */
export async function getAllCustomers(): Promise<Customer[]> {
  const response = await axios.get<ApiResponse<Customer[]>>('/customers')

  // 如果 API 回傳失敗或沒有資料，拋出錯誤
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '取得客戶列表失敗')
  }

  return response.data.data
}

/**
 * Mock Data - 客戶列表
 * 開發階段使用，等後端 API 完成後可以移除
 *
 * @returns Customer[] 包含 16 筆測試客戶資料
 */
export function getMockCustomers(): Customer[] {
  return [
    {
      id: 1,
      name: '橘色科技',
      status: '活躍',
      lastUsed: '2025-10-14',
      module: 'Master',
      sales: '周經理',
      industry: '科技業',
      link: 'orange-tech.com',
    },
    {
      id: 2,
      name: '藍天餐飲',
      status: '低活躍',
      lastUsed: '2025-09-20',
      module: 'GGF',
      sales: '林經理',
      industry: '餐飲業',
      link: 'blue-sky-food.com',
    },
    {
      id: 3,
      name: '綠光企業',
      status: '活躍',
      lastUsed: '2025-10-13',
      module: 'Master',
      sales: '周經理',
      industry: '製造業',
      link: 'green-light.com',
    },
    {
      id: 4,
      name: '紅葉商店',
      status: '未使用',
      lastUsed: '2025-05-10',
      module: 'GGF',
      sales: '陳經理',
      industry: '零售業',
      link: 'red-leaf-shop.com',
    },
    {
      id: 5,
      name: '黃金地產',
      status: '活躍',
      lastUsed: '2025-10-12',
      module: 'Master',
      sales: '林經理',
      industry: '房地產',
      link: 'golden-estate.com',
    },
    {
      id: 6,
      name: '紫羅蘭服飾',
      status: '低活躍',
      lastUsed: '2025-08-15',
      module: 'GGF',
      sales: '周經理',
      industry: '服飾業',
      link: 'violet-fashion.com',
    },
    {
      id: 7,
      name: '白雲旅行社',
      status: '活躍',
      lastUsed: '2025-10-11',
      module: 'Master',
      sales: '陳經理',
      industry: '旅遊業',
      link: 'white-cloud-travel.com',
    },
    {
      id: 8,
      name: '黑貓物流',
      status: '活躍',
      lastUsed: '2025-10-14',
      module: 'GGF',
      sales: '林經理',
      industry: '物流業',
      link: 'black-cat-logistics.com',
    },
    {
      id: 9,
      name: '粉紅醫美',
      status: '低活躍',
      lastUsed: '2025-09-05',
      module: 'Master',
      sales: '周經理',
      industry: '醫療業',
      link: 'pink-beauty.com',
    },
    {
      id: 10,
      name: '灰色設計',
      status: '未使用',
      lastUsed: '2025-04-20',
      module: 'GGF',
      sales: '陳經理',
      industry: '設計業',
      link: 'grey-design.com',
    },
    {
      id: 11,
      name: '銀河金融',
      status: '活躍',
      lastUsed: '2025-10-13',
      module: 'Master',
      sales: '林經理',
      industry: '金融業',
      link: 'galaxy-finance.com',
    },
    {
      id: 12,
      name: '青草茶飲',
      status: '低活躍',
      lastUsed: '2025-08-30',
      module: 'GGF',
      sales: '周經理',
      industry: '餐飲業',
      link: 'green-tea-shop.com',
    },
    {
      id: 13,
      name: '棕櫚建設',
      status: '活躍',
      lastUsed: '2025-10-10',
      module: 'Master',
      sales: '陳經理',
      industry: '建築業',
      link: 'palm-construction.com',
    },
    {
      id: 14,
      name: '深藍科技',
      status: '活躍',
      lastUsed: '2025-10-14',
      module: 'GGF',
      sales: '林經理',
      industry: '科技業',
      link: 'deep-blue-tech.com',
    },
    {
      id: 15,
      name: '淺綠農場',
      status: '未使用',
      lastUsed: '2025-06-15',
      module: 'Master',
      sales: '周經理',
      industry: '農業',
      link: 'light-green-farm.com',
    },
    {
      id: 16,
      name: '深紫律師',
      status: '低活躍',
      lastUsed: '2025-09-10',
      module: 'GGF',
      sales: '陳經理',
      industry: '法律業',
      link: 'deep-purple-law.com',
    },
  ]
}

/**
 * 取得單一客戶詳情（預留）
 *
 * @param id 客戶 ID
 * @returns Promise<Customer> 客戶詳情
 *
 * @description
 * 後端 API Endpoint: GET /cloudAdmin/api/customers/{id}
 */
export async function getCustomerById(id: number): Promise<Customer> {
  const response = await axios.get<ApiResponse<Customer>>(`/customers/${id}`)

  // 如果 API 回傳失敗或沒有資料,拋出錯誤
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '取得客戶詳情失敗')
  }

  return response.data.data
}

/**
 * 批量刪除客戶（預留）
 *
 * @param ids 客戶 ID 陣列
 * @returns Promise<void>
 *
 * @description
 * 後端 API Endpoint: DELETE /cloudAdmin/api/customers/batch
 * Request Body: { "ids": [1, 2, 3] }
 */
export async function batchDeleteCustomers(ids: number[]): Promise<void> {
  const response = await axios.delete<ApiResponse<void>>('/customers/batch', {
    data: { ids },
  })

  // 如果 API 回傳失敗，拋出錯誤
  if (!response.data.success) {
    throw new Error(response.data.message || '批量刪除客戶失敗')
  }
}
