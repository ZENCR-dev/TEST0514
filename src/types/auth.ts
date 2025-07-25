import { StandardApiResponse, ApiResponse, ErrorCode } from './api';

/**
 * 定义用户角色类型
 */
export type UserRole = 'doctor' | 'pharmacy' | 'admin' | 'practitioner' | 'pharmacy_operator' | 'patient';

/**
 * 用户类型定义
 * 匹配后端确认的用户对象结构
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/**
 * 登录请求参数
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * 新的登录响应数据类型
 * 匹配后端确认格式：{accessToken, refreshToken, user}
 */
export interface LoginResponseData {
  /** 访问令牌 */
  accessToken: string;
  /** 刷新令牌 */
  refreshToken: string;
  /** 用户信息 */
  user: User;
}

/**
 * 标准化登录API响应类型
 */
export type LoginApiResponse = StandardApiResponse<LoginResponseData>;

/**
 * Token刷新响应数据类型
 */
export interface RefreshTokenResponseData {
  /** 新的访问令牌 */
  accessToken: string;
  /** 新的刷新令牌 */
  refreshToken: string;
}

/**
 * Token刷新API响应类型
 */
export type RefreshTokenApiResponse = StandardApiResponse<RefreshTokenResponseData>;

/**
 * 用户信息API响应类型
 */
export type UserProfileApiResponse = StandardApiResponse<User>;

/**
 * 登录响应类型（向后兼容）
 * @deprecated 请使用 LoginResponseData 和 LoginApiResponse
 */
export interface LoginResponse {
  user: User;
  token: string;
}

/**
 * 认证状态接口
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth?: () => Promise<void>;
}

/**
 * withAuth HOC配置接口
 */
export interface WithAuthOptions {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * 认证相关错误代码枚举
 */
export enum AuthErrorCode {
  /** 邮箱或密码错误 */
  INVALID_CREDENTIALS = 'AUTH_001',
  /** 登录已过期 */
  TOKEN_EXPIRED = 'AUTH_002',
  /** 权限不足 */
  INSUFFICIENT_PERMISSIONS = 'AUTH_003'
}

/**
 * 用户注册请求数据
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

/**
 * 用户注册响应数据类型
 */
export interface RegisterResponseData {
  /** 用户ID */
  userId: string;
  /** 注册成功消息 */
  message: string;
}

/**
 * 用户注册API响应类型
 */
export type RegisterApiResponse = StandardApiResponse<RegisterResponseData>;

/**
 * Token验证请求参数
 */
export interface VerifyTokenRequest {
  /** 要验证的Token */
  token: string;
}

/**
 * Token验证响应数据
 */
export interface VerifyTokenResponseData {
  /** Token是否有效 */
  valid: boolean;
  /** 用户信息（如果Token有效） */
  user?: User;
  /** Token过期时间 */
  expiresAt?: string;
}

/**
 * Token验证API响应类型
 */
export type VerifyTokenApiResponse = StandardApiResponse<VerifyTokenResponseData>; 