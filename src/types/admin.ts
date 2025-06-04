import { User, UserRole } from './auth';

/**
 * 扩展用户类型，添加管理所需的字段
 */
export interface ExtendedUser extends User {
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
  phone?: string;
  address?: string;
  // 医生特定字段
  hpiNumber?: string;
  apcCertificate?: string;
}

/**
 * 创建用户的数据结构
 */
export interface UserCreateData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  address?: string;
}

/**
 * 更新用户的数据结构
 */
export interface UserUpdateData {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: 'active' | 'inactive';
  phone?: string;
  address?: string;
  hpiNumber?: string;
}

/**
 * 药房账户创建数据结构
 */
export interface PharmacyCreateData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
}

/**
 * 医生注册数据结构
 */
export interface DoctorRegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  hpiNumber: string;
  apcCertificate: File | null;
}

/**
 * 用户搜索参数
 */
export interface UserSearchParams {
  query?: string;
  role?: UserRole;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
}

/**
 * 分页结果接口
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 用户列表响应
 */
export type PaginatedUsers = PaginatedResult<ExtendedUser>;

/**
 * 为dashboard预留的接口
 */
export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  usersByRole: Record<UserRole, number>;
  recentLogins: Array<{userId: string, username: string, time: string}>;
} 