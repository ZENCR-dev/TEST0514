/**
 * 标准化API响应类型定义
 * 新西兰中医处方平台 - 前端API类型系统
 * 
 * 基于后端团队确认的响应格式规范
 * 版本：v1.0
 * 更新日期：2025年6月19日
 */

// ==================== 分页元数据类型 ====================

/**
 * 分页元数据接口
 * 匹配后端确认的分页格式
 */
export interface PaginationMeta {
  /** 当前页码，从1开始 */
  page: number;
  /** 每页条数 */
  limit: number;
  /** 总条数 */
  total: number;
  /** 总页数 */
  totalPages: number;
  /** 是否有下一页 */
  hasNextPage: boolean;
  /** 是否有上一页 */
  hasPrevPage: boolean;
}

// ==================== API响应元数据类型 ====================

/**
 * API响应元数据接口
 */
export interface ApiMeta {
  /** ISO 8601格式的时间戳 */
  timestamp: string;
  /** 分页信息（可选） */
  pagination?: PaginationMeta;
}

// ==================== 标准化API响应类型 ====================

/**
 * 标准化成功响应接口
 * 所有成功的API响应都应遵循此格式
 * 
 * @template T 响应数据的类型
 */
export interface StandardApiResponse<T> {
  /** 请求成功标识 */
  success: true;
  /** 响应数据 */
  data: T;
  /** 响应元数据 */
  meta: ApiMeta;
}

/**
 * API错误详情接口
 */
export interface ApiErrorDetails {
  /** 错误相关字段 */
  field?: string;
  /** 错误提示信息 */
  hint?: string;
  /** 其他错误详情 */
  [key: string]: any;
}

/**
 * API错误响应接口
 * 所有错误的API响应都应遵循此格式
 */
export interface ApiError {
  /** 请求失败标识 */
  success: false;
  /** 错误信息 */
  error: {
    /** 标准化错误代码 */
    code: string;
    /** 错误消息 */
    message: string;
    /** 错误详情（可选） */
    details?: ApiErrorDetails;
    /** ISO 8601格式的时间戳 */
    timestamp: string;
  };
}

// ==================== 联合类型定义 ====================

/**
 * API响应联合类型
 * 表示API可能返回的成功或错误响应
 * 
 * @template T 成功响应数据的类型
 */
export type ApiResponse<T> = StandardApiResponse<T> | ApiError;

// ==================== 错误代码枚举 ====================

/**
 * 标准化错误代码枚举
 * 基于前端定义并经后端确认的22种错误类型
 */
export enum ErrorCode {
  // 认证相关错误
  AUTH_001 = 'AUTH_001', // 邮箱或密码错误
  AUTH_002 = 'AUTH_002', // 登录已过期
  AUTH_003 = 'AUTH_003', // 权限不足
  
  // 网络相关错误
  NETWORK_001 = 'NETWORK_001', // 网络连接失败
  NETWORK_002 = 'NETWORK_002', // 请求超时
  NETWORK_003 = 'NETWORK_003', // 网络错误
  
  // 验证相关错误
  VALIDATION_001 = 'VALIDATION_001', // 请求数据格式不正确
  VALIDATION_002 = 'VALIDATION_002', // 数据已存在
  VALIDATION_003 = 'VALIDATION_003', // 数据验证失败
  
  // 服务器相关错误
  SERVER_001 = 'SERVER_001', // 服务器内部错误
  SERVER_002 = 'SERVER_002', // 服务暂时不可用
  SERVER_003 = 'SERVER_003', // 请求过于频繁
  
  // 业务相关错误
  BUSINESS_001 = 'BUSINESS_001', // 业务逻辑错误
  BUSINESS_002 = 'BUSINESS_002', // 资源不存在
  BUSINESS_003 = 'BUSINESS_003', // 操作不被允许
  
  // 数据相关错误
  DATA_001 = 'DATA_001', // 数据格式错误
  DATA_002 = 'DATA_002', // 数据完整性错误
  DATA_003 = 'DATA_003', // 数据版本冲突
  
  // 系统相关错误
  SYSTEM_001 = 'SYSTEM_001', // 系统维护中
  SYSTEM_002 = 'SYSTEM_002', // 系统配置错误
  SYSTEM_003 = 'SYSTEM_003', // 系统资源不足
  
  // 未知错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR' // 未知错误
}

// ==================== 工具类型定义 ====================

/**
 * 提取API响应数据类型的工具类型
 * 
 * @template T API响应类型
 */
export type ExtractApiData<T> = T extends StandardApiResponse<infer U> ? U : never;

/**
 * 检查是否为成功响应的类型守卫
 * 
 * @param response API响应
 * @returns 是否为成功响应
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is StandardApiResponse<T> {
  return response.success === true;
}

/**
 * 检查是否为错误响应的类型守卫
 * 
 * @param response API响应
 * @returns 是否为错误响应
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ApiError {
  return response.success === false;
}

// ==================== 分页相关工具类型 ====================

/**
 * 分页请求参数接口
 */
export interface PaginationParams {
  /** 页码，从1开始 */
  page?: number;
  /** 每页条数，默认20，最大100 */
  limit?: number;
  /** 排序字段，格式如"created_at:desc" */
  sort?: string;
}

/**
 * 分页响应数据接口
 * 
 * @template T 列表项的类型
 */
export interface PaginatedData<T> {
  /** 数据列表 */
  data: T[];
  /** 分页元数据 */
  meta: {
    pagination: PaginationMeta;
  };
}

/**
 * 分页API响应类型
 * 
 * @template T 列表项的类型
 */
export type PaginatedApiResponse<T> = StandardApiResponse<PaginatedData<T>>;

// 所有类型和函数已通过上面的 export 关键字导出，无需重复导出 