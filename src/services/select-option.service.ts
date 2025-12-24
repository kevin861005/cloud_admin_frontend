import apiClient from "@/utils/axios";
import type { SelectOption } from "@/types/common";
import { ApiError } from "@/types/common";

/**
 * 下拉選單選項 Service
 * 統一管理所有下拉選單的 API 呼叫
 */
export const selectOptionService = {
  /**
   * 取得產業別下拉選單選項
   * GET /api/options/industries
   */
  async getIndustryOptions(): Promise<SelectOption[]> {
    const response = await apiClient.get("/options/industries");
    if (!response.data.success) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || "取得產業別選項失敗",
      });
    }
    return response.data.data;
  },

  /**
   * 取得經銷商下拉選單選項
   * GET /api/options/dealers
   */
  async getDealerOptions(): Promise<SelectOption[]> {
    const response = await apiClient.get("/options/dealers");
    if (!response.data.success) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || "取得經銷商選項失敗",
      });
    }
    return response.data.data;
  },

  /**
   * 取得業務人員下拉選單選項
   * GET /api/options/sales
   */
  async getSalesOptions(): Promise<SelectOption[]> {
    const response = await apiClient.get("/options/sales");
    if (!response.data.success) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || "取得業務人員選項失敗",
      });
    }
    return response.data.data;
  },
};
