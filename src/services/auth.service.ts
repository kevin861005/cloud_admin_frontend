/**
 * 認證服務層
 *
 * - Access Token：由 API 回傳，儲存在 localStorage
 * - Refresh Token：由後端設為 HttpOnly Cookie（前端無法存取）
 */

import apiClient from "@/utils/axios";
import { ApiError } from "@/types/common";
import type { ApiResponse } from "@/types/common";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export const authService = {
  /**
   * 使用者登入
   * 成功：回傳 LoginResponse
   * 失敗：丟出 ApiError
   */
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>("/auth/login", loginData);

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || "登入失敗",
        data: response.data.data || null,
      });
    }

    return response.data.data;
  },

  /**
   * 刷新 Access Token
   * 成功：回傳新的 LoginResponse（裡面含新的 accessToken）
   * 失敗：丟出 ApiError
   */
  async refreshToken(): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>("/auth/refresh");

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || "刷新 Token 失敗",
        data: response.data.data || null,
      });
    }

    return response.data.data;
  },

  /**
   * 登出
   * 成功：返回 void
   * 失敗：丟出 ApiError
   */
  async logout(): Promise<void> {
    const response = await apiClient.post<ApiResponse<null>>("/auth/logout");

    if (!response.data.success) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || "登出失敗",
        data: null,
      });
    }

    // 無需回傳任何資料
  },
};
