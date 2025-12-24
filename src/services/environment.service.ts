/**
 * 環境 API Service
 * 提供環境管理相關的 API 呼叫
 */

import apiClient from "@/utils/axios";
import type { ApiResponse } from "@/types/common";
import type { StartTaskResponse } from "@/types/task";
import { ApiError } from "@/types/common";
import type {
  EnvironmentListItem,
  EnvironmentDetailInfo,
  EnvironmentCountResponse,
  DeleteRecordListItem,
  DeleteRecordDetailInfo,
} from "@/types/environment";
import type { DockerImage } from "@/types/service";

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
  async getAllEnvironments(): Promise<EnvironmentListItem[]> {
    const response = await apiClient.get<ApiResponse<EnvironmentListItem[]>>("/environments");

    if (!response.data.success || !response.data.data) {
      throw new ApiError<null>({
        code: response.data.code,
        message: response.data.message || "取得環境列表失敗",
        data: null,
      });
    }

    return response.data.data;
  },

  /**
   * 取得環境詳細資訊
   * GET /api/environments/:id
   *
   * @param id - 環境 ID
   * @returns Promise<EnvironmentDetailInfo> 環境完整詳情
   */
  async getEnvironmentDetailById(id: string): Promise<EnvironmentDetailInfo> {
    const response = await apiClient.get<ApiResponse<EnvironmentDetailInfo>>(`/environments/${id}`);

    if (!response.data.success || !response.data.data) {
      throw new ApiError<null>({
        code: response.data.code,
        message: response.data.message || "取得環境詳情失敗",
        data: null,
      });
    }

    return response.data.data;
  },

  /**
   * 重啟環境（回傳 taskId，用於 SSE 進度追蹤）
   * @param customerNo 客戶編號
   * @returns 包含 taskId 的回應
   * @throws {ApiError} 當 API 呼叫失敗時
   */
  async restartEnvironmentWithProgress(customerNo: string): Promise<StartTaskResponse> {
    const response = await apiClient.post<ApiResponse<StartTaskResponse>>(
      `/environments/${customerNo}/restart`
    );

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || "啟動重啟任務失敗",
        data: response.data.data ?? null,
      });
    }

    return response.data.data;
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
      { imageId }
    );

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || "啟動更新映像任務失敗",
        data: response.data.data ?? null,
      });
    }

    return response.data.data;
  },

  /**
   * 刪除環境（回傳 taskId，用於 SSE 進度追蹤）
   * @param customerNo 客戶編號
   * @returns 包含 taskId 的回應
   * @throws {ApiError} 當 API 呼叫失敗時
   */
  async deleteEnvironmentWithProgress(customerNo: string): Promise<StartTaskResponse> {
    const response = await apiClient.delete<ApiResponse<StartTaskResponse>>(
      `/environments/${customerNo}/delete`
    );

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || "刪除環境任務失敗",
        data: response.data.data ?? null,
      });
    }

    return response.data.data;
  },

  /**
   * 批次刪除環境（回傳單一 taskId，用於 SSE 進度追蹤）
   * @param customerNos 客戶編號陣列
   * @returns 包含 taskId 的回應
   * @throws {ApiError} 當 API 呼叫失敗時
   */
  async batchDeleteEnvironmentsWithProgress(customerNos: string[]): Promise<StartTaskResponse> {
    const response = await apiClient.post<ApiResponse<StartTaskResponse>>(
      "/environments/batch-delete",
      { customerNos }
    );

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || "批次刪除環境任務失敗",
        data: response.data.data ?? null,
      });
    }

    return response.data.data;
  },

  /**
   * 取得所有可更新的映像檔
   * GET /api/environments/{customerNo}/images
   *
   * @returns  Promise<<DockerImage[]> 可更新的映像檔
   */
  async getAllImages(customerNo: string): Promise<DockerImage[]> {
    const response = await apiClient.get<ApiResponse<DockerImage[]>>(
      `/environments/${customerNo}/images`
    );

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || "取得可更新的映像檔失敗",
        data: response.data.data ?? null,
      });
    }

    return response.data.data;
  },

  /**
   * 取得申請中客戶數
   * @returns 申請中客戶數
   */
  async getPendingCount(): Promise<EnvironmentCountResponse> {
    const response = await apiClient.get<ApiResponse<EnvironmentCountResponse>>(
      "/environments/pending-count"
    );

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || "取得申請中客戶數失敗",
        data: null,
      });
    }

    return response.data.data;
  },

  /**
   * 取得待刪除客戶數
   * @returns 待刪除客戶數
   */
  async getPendingDeletionCount(): Promise<EnvironmentCountResponse> {
    const response = await apiClient.get<ApiResponse<EnvironmentCountResponse>>(
      "/environments/pending-deletion-count"
    );

    if (!response.data.success || !response.data.data) {
      throw new ApiError({
        code: response.data.code,
        message: response.data.message || "取得待刪除客戶數失敗",
        data: null,
      });
    }

    return response.data.data;
  },

  /**
   * 申請環境刪除
   * POST /api/environments/apply-deletion
   *
   * @param customerNos - 客戶編號清單
   */
  async applyDeletion(customerNos: string[]): Promise<void> {
    const response = await apiClient.post<ApiResponse<null>>("/environments/apply-deletion", {
      customerNos,
    });

    if (!response.data.success) {
      throw new ApiError<null>({
        code: response.data.code,
        message: response.data.message || "申請環境刪除失敗",
        data: null,
      });
    }

    // 成功時不需要回傳任何東西
  },

  /**
   * 取得所有刪除紀錄列表
   * GET /api/environments/deletion-records
   *
   * @returns Promise<DeleteRecordListItem[]> 刪除紀錄列表
   */
  async getAllDeleteRecords(): Promise<DeleteRecordListItem[]> {
    const response = await apiClient.get<ApiResponse<DeleteRecordListItem[]>>(
      "/environments/deletion-records"
    );

    if (!response.data.success || !response.data.data) {
      throw new ApiError<null>({
        code: response.data.code,
        message: response.data.message || "取得刪除紀錄列表失敗",
        data: null,
      });
    }

    return response.data.data;
  },

  /**
   * 取得刪除紀錄詳細資訊
   * GET /api/environments/deletion-records/:id
   *
   * @param id - 刪除紀錄 ID
   * @returns Promise<DeleteRecordDetailInfo> 刪除紀錄完整詳情
   */
  async getDeleteRecordDetailById(id: string): Promise<DeleteRecordDetailInfo> {
    const response = await apiClient.get<ApiResponse<DeleteRecordDetailInfo>>(
      `/environments/deletion-records/${id}`
    );

    if (!response.data.success || !response.data.data) {
      throw new ApiError<null>({
        code: response.data.code,
        message: response.data.message || "取得刪除紀錄詳情失敗",
        data: null,
      });
    }

    return response.data.data;
  },
};
