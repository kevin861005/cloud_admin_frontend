/**
 * 經銷商 API Service
 * 提供經銷商管理相關的 API 呼叫
 *
 * 檔案位置：src/services/dealer.service.ts
 */

import axios from '@/utils/axios'
import type { ApiResponse } from '@/types/common'
import type { DealerListItem, DealerDetailInfo } from '@/types/dealer'

/**
 * 經銷商服務
 */
export const dealerService = {
  /**
   * 取得所有經銷商列表
   * GET /api/dealers
   *
   * @returns Promise<DealerListItem[]> 經銷商列表
   */
  async getAllDealers(): Promise<DealerListItem[]> {
    const response = await axios.get<ApiResponse<DealerListItem[]>>('/dealers')

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得經銷商列表失敗')
    }

    return response.data.data
  },

  /**
   * 取得模擬經銷商資料（測試用）
   */
  async getMockDealers(): Promise<DealerListItem[]> {
    return [
      {
        id: 1,
        code: 'D001',
        name: '台北總經銷',
        sales: '王小明',
        contactPerson: '李經理',
        contactPhone: '02-2345-6789',
        email: 'taipei@dealer.com',
      },
      {
        id: 2,
        code: 'D002',
        name: '台中區經銷商',
        sales: '陳大華',
        contactPerson: '張主任',
        contactPhone: '04-2234-5678',
        email: 'taichung@dealer.com',
      },
      {
        id: 3,
        code: 'D003',
        name: '高雄南區代理',
        sales: '林美玲',
        contactPerson: '黃副理',
        contactPhone: '07-3456-7890',
        email: 'kaohsiung@dealer.com',
      },
      {
        id: 4,
        code: 'D004',
        name: '桃園北區經銷',
        sales: '劉志明',
        contactPerson: '吳經理',
        contactPhone: '03-4567-8901',
        email: 'taoyuan@dealer.com',
      },
    ]
  },

  /**
   * 取得經銷商詳細資訊
   * GET /api/dealers/:id
   *
   * @param id 經銷商 ID
   * @returns Promise<DealerDetailInfo> 經銷商詳細資訊
   */
  async getDealerDetail(id: number): Promise<DealerDetailInfo> {
    const response = await axios.get<ApiResponse<DealerDetailInfo>>(`/dealers/${id}`)

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || '取得經銷商詳細資訊失敗')
    }

    return response.data.data
  },

  /**
   * 取得模擬經銷商詳細資料（測試用）
   */
  async getMockDealerDetails(): Promise<Record<number, DealerDetailInfo>> {
    return {
      1: {
        code: 'D001',
        name: '台北總經銷',
        sales: { id: 'kevin', name: '陳奶輪' },
        contactPerson: '李經理',
        contactPhone: '02-2345-6789',
        email: 'taipei@dealer.com',
        address: '台北市信義區信義路五段7號15樓',
        description:
          '負責台北市及新北市地區的產品銷售與客戶服務，擁有專業的技術團隊及完善的售後服務體系，是本公司在北部地區最重要的合作夥伴。',
        createdAt: '2024.01.15',
        createdBy: { id: 'U001', name: '系統管理員' },
      },
      2: {
        code: 'D002',
        name: '台中區經銷商',
        sales: { id: 'andy', name: '猴靜安' },
        contactPerson: '張主任',
        contactPhone: '04-2234-5678',
        email: 'taichung@dealer.com',
        address: '台中市西屯區台灣大道三段99號8樓',
        description:
          '服務範圍涵蓋台中市、彰化縣及南投縣，深耕中部市場多年，具備豐富的產業客戶資源及市場經驗，提供客製化的解決方案。',
        createdAt: '2024.02.20',
        createdBy: { id: 'U002', name: '張經理' },
      },
      3: {
        code: 'D003',
        name: '高雄南區代理',
        sales: { id: 'max', name: '黃剩父' },
        contactPerson: '黃副理',
        contactPhone: '07-3456-7890',
        email: 'kaohsiung@dealer.com',
        address: '高雄市前鎮區中華五路1234號12樓',
        description:
          '主要負責高雄市、台南市及屏東縣的業務推廣，擁有完整的倉儲物流系統，能夠快速回應客戶需求，提供即時的技術支援服務。',
        createdAt: '2024.03.10',
        createdBy: { id: 'U003', name: '李主任' },
      },
      4: {
        code: 'D004',
        name: '桃園北區經銷',
        sales: { id: 'kelvin', name: '王責剩' },
        contactPerson: '吳經理',
        contactPhone: '03-4567-8901',
        email: 'taoyuan@dealer.com',
        address: '桃園市中壢區中華路一段450號6樓',
        description:
          '專注於桃園市、新竹縣市及苗栗縣的市場開發，與多家科技園區企業建立長期合作關係，提供全方位的產品諮詢及技術整合服務。',
        createdAt: '2024.04.05',
        createdBy: { id: 'U001', name: '系統管理員' },
      },
    }
  },
}
