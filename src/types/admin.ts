import { User, UserRole } from './auth';
import type { PaginatedResult } from './common';

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

/**
 * 管理员统计数据
 */
export interface AdminStats {
  /** 总用户数 */
  totalUsers: number;
  /** 活跃用户数 */
  activeUsers: number;
  /** 待审核用户数 */
  pendingUsers: number;
  /** 医师数量 */
  doctorCount: number;
  /** 药房数量 */
  pharmacyCount: number;
  /** 今日新增用户 */
  todayNewUsers: number;
  /** 月活跃用户 */
  monthlyActiveUsers: number;
}

/**
 * 管理员药品统计数据
 */
export interface AdminMedicineStats {
  /** 总药品数量 */
  totalMedicines: number;
  /** 有库存药品数量 */
  inStockMedicines: number;
  /** 缺货药品数量 */
  outOfStockMedicines: number;
  /** 低库存药品数量 */
  lowStockMedicines: number;
  /** 今日新增药品 */
  todayNewMedicines: number;
  /** 平均价格 */
  averagePrice: number;
}

/**
 * 系统统计数据
 */
export interface SystemStats {
  /** 用户统计 */
  users: AdminStats;
  /** 药品统计 */
  medicines: AdminMedicineStats;
} 