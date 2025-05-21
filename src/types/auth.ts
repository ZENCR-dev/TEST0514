/**
 * 定义用户角色类型
 */
export type UserRole = 'doctor' | 'pharmacy' | 'admin';

/**
 * 用户类型定义
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
 * 登录响应类型
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

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
} 