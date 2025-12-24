/**
 * 使用者服務層
 *
 * 負責處理所有使用者相關的 API 請求
 */

import apiClient from "@/utils/axios";
import { ApiError } from "@/types/common";
import type { ApiResponse, FieldError } from "@/types/common";
import type {
  UserInfo,
  UserListItem,
  CreateUserRequest,
  UserDetailInfo,
  UpdateUserRequest,
} from "@/types/user";

/**
 * 使用者服務
 */
export const userService = {
  /**
   * 取得當前使用者資訊(包含權限)
   * GET /api/users/me
   */
  async getCurrentUserInfo(): Promise<UserInfo> {
    const response = await apiClient.get<ApiResponse<UserInfo | null>>("/users/me");

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || "取得目前使用者資訊失敗",
        data: response.data.data ?? null,
      });
    }

    return response.data.data;
  },

  /**
   * 取得所有帳號列表
   * GET /api/users
   */
  async getAllUsers(): Promise<UserListItem[]> {
    const response = await apiClient.get<ApiResponse<UserListItem[] | null>>("/users");

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || "取得使用者列表失敗",
        data: response.data.data ?? null,
      });
    }

    return response.data.data;
  },

  /**
   * 取得使用者詳細資訊
   * GET /api/users/{loginId}/detail
   */
  async getUserDetail(loginId: string): Promise<UserDetailInfo> {
    const response = await apiClient.get<ApiResponse<UserDetailInfo | null>>(
      `/users/${loginId}/detail`
    );

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || "取得使用者詳細資訊失敗",
        data: response.data.data ?? null,
      });
    }

    return response.data.data;
  },

  /**
   * 新增使用者
   * POST /api/users
   */
  async createUser(userData: CreateUserRequest): Promise<void> {
    const response = await apiClient.post<ApiResponse<FieldError[] | null>>("/users", userData);

    if (!response.data.success) {
      throw new ApiError<FieldError[] | null>({
        code: response.data.code,
        message: response.data.message || "新增使用者失敗",
        data: response.data.data ?? null,
      });
    }
  },

  /**
   * 更新使用者資料
   * PUT /api/users/{loginId}
   */
  async updateUser(loginId: string, data: UpdateUserRequest): Promise<UserDetailInfo> {
    const response = await apiClient.put<ApiResponse<UserDetailInfo | FieldError[] | null>>(
      `/users/${loginId}`,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new ApiError<FieldError[] | null>({
        code: response.data.code,
        message: response.data.message || "更新使用者資料失敗",
        data: (response.data.data ?? null) as FieldError[] | null,
      });
    }

    return response.data.data as UserDetailInfo;
  },
};
