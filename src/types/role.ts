/**
 * 權限/角色相關型別定義
 */

/**
 * 角色資料
 */
export interface Role {
  /** 角色 ID */
  id: number;
  /** 角色名稱 (例如: "ADMIN", "USER") */
  name: string;
  /** 角色描述 (例如: "系統管理員") */
  description: string;
}

/**
 * 角色列表回應
 */
export interface RoleListResponse {
  roles: Role[];
}
