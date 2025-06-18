/**
 * 药品相关类型定义
 * 基于后端团队确认的 Supabase Medicine 表结构规范
 * 
 * @version 2.0
 * @date 2025-01-21
 * @description 完全匹配后端 Supabase medicines 表结构
 */

import { StandardApiResponse, PaginatedApiResponse, PaginationParams } from './api';

/**
 * 药品基础接口 - 匹配后端 Supabase medicines 表结构
 * 
 * @interface Medicine
 * @description 所有字段都是必填的，与后端 Supabase 表结构100%一致
 */
export interface Medicine {
  /** 主键ID (cuid格式) */
  id: string;
  
  /** 药品名称 (通常与chineseName相同) */
  name: string;
  
  /** 中文名称 (必填) */
  chineseName: string;
  
  /** 英文名称 (必填) */
  englishName: string;
  
  /** 拼音名称 (自动生成) */
  pinyinName: string;
  
  /** SKU代码 (基于拼音首字母，如: DG, CX, SDH) */
  sku: string;
  
  /** 描述信息 */
  description: string;
  
  /** 药品分类 (补益药, 活血药, 理气药等) */
  category: string;
  
  /** 计量单位 (默认: "g") */
  unit: string;
  
  /** 是否需要处方 (boolean类型) */
  requiresPrescription: boolean;
  
  /** 基础价格 (number类型，单位: 元/克) */
  basePrice: number;
  
  /** 元数据 (JSON格式) */
  metadata: object | null;
  
  /** 状态 (默认: "active") */
  status: string;
  
  /** 创建时间 (ISO 8601格式) */
  createdAt: Date;
  
  /** 更新时间 (ISO 8601格式) */
  updatedAt: Date;
}

/**
 * 向后兼容的药品接口 (已废弃)
 * @deprecated 请使用新的 Medicine 接口
 */
export interface LegacyMedicine {
  id: string;
  chineseName: string;
  englishName: string;
  pinyinName: string;
  pricePerGram: number;
  properties?: string;
  category?: string;
  sku?: string;
  name?: string;
  pinyin?: string;
  basePrice?: number;
}

/**
 * 药品数据验证函数
 * 基于后端团队提供的验证逻辑
 */
export function validateMedicineData(medicine: any): medicine is Medicine {
  return (
    typeof medicine.id === 'string' &&
    typeof medicine.name === 'string' &&
    typeof medicine.chineseName === 'string' &&
    typeof medicine.englishName === 'string' &&
    typeof medicine.pinyinName === 'string' &&
    typeof medicine.sku === 'string' &&
    typeof medicine.description === 'string' &&
    typeof medicine.category === 'string' &&
    typeof medicine.unit === 'string' &&
    typeof medicine.basePrice === 'number' &&
    typeof medicine.requiresPrescription === 'boolean' &&
    typeof medicine.status === 'string' &&
    medicine.unit === 'g' &&
    medicine.status === 'active'
  );
}

/**
 * SKU 格式验证函数
 * 验证 SKU 是否符合拼音首字母格式
 */
export function validateSkuFormat(sku: string): boolean {
  // SKU 应该是 1-4 个大写字母，基于拼音首字母
  const skuPattern = /^[A-Z]{1,4}$/;
  return skuPattern.test(sku);
}

/**
 * 药品分类标准枚举
 * 基于后端确认的分类标准
 */
export enum MedicineCategory {
  TONIFYING = "补益药",          // tonifying medicines
  BLOOD_ACTIVATING = "活血药",   // blood-activating medicines
  QI_REGULATING = "理气药",      // qi-regulating medicines
  PHLEGM_RESOLVING = "化痰药",   // phlegm-resolving medicines
  OTHER_TCM = "其他中药"         // other TCM medicines
}

/**
 * 药品创建数据接口
 */
export interface MedicineCreateData {
  name: string;
  chineseName: string;
  englishName: string;
  pinyinName: string;
  sku: string;
  description: string;
  category: string;
  unit?: string;                 // 默认 "g"
  requiresPrescription?: boolean; // 默认 false
  basePrice: number;
  metadata?: object | null;       // 默认 null
  status?: string;               // 默认 "active"
}

/**
 * 药品更新数据接口
 */
export interface MedicineUpdateData {
  name?: string;
  chineseName?: string;
  englishName?: string;
  pinyinName?: string;
  sku?: string;
  description?: string;
  category?: string;
  unit?: string;
  requiresPrescription?: boolean;
  basePrice?: number;
  metadata?: object | null;
  status?: string;
}

/**
 * 药品搜索参数接口
 */
export interface MedicineSearchParams extends PaginationParams {
  /** 搜索关键词(中文名、拼音、英文) */
  search?: string;
  /** 按分类筛选 */
  category?: string;
  /** 最低价格 */
  minPrice?: number;
  /** 最高价格 */
  maxPrice?: number;
  /** 是否需要处方 */
  requiresPrescription?: boolean;
  /** 状态筛选 */
  status?: string;
}

/**
 * 药品搜索响应数据类型
 * 匹配后端确认的嵌套数据结构
 */
export interface MedicineSearchResponseData {
  /** 药品列表 */
  data: Medicine[];
  /** 分页元数据 */
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

/**
 * 药品搜索API响应类型
 */
export type MedicineSearchApiResponse = StandardApiResponse<MedicineSearchResponseData>;

/**
 * 药品详情API响应类型
 */
export type MedicineDetailApiResponse = StandardApiResponse<Medicine>;

/**
 * 药品列表API响应类型（分页）
 */
export type MedicineListApiResponse = PaginatedApiResponse<Medicine>;

/**
 * 药品创建API响应类型
 */
export type MedicineCreateApiResponse = StandardApiResponse<Medicine>;

/**
 * 药品更新API响应类型
 */
export type MedicineUpdateApiResponse = StandardApiResponse<Medicine>;

/**
 * 药品删除API响应类型
 */
export interface MedicineDeleteResponseData {
  id: string;
  message: string;
}

export type MedicineDeleteApiResponse = StandardApiResponse<MedicineDeleteResponseData>;

/**
 * 药品批量操作响应数据
 */
export interface MedicineBatchResponseData {
  successful: string[];
  failed: {
    id: string;
    error: string;
  }[];
  total: number;
  successCount: number;
  failureCount: number;
}

export type MedicineBatchApiResponse = StandardApiResponse<MedicineBatchResponseData>;

/**
 * 药品导入结果
 */
export interface MedicineImportResult {
  successful: number;
  failed: number;
  errors: {
    row: number;
    message: string;
    data?: any;
  }[];
}

export type MedicineImportApiResponse = StandardApiResponse<MedicineImportResult>;

/**
 * 药品导出格式枚举
 */
export enum MedicineExportFormat {
  CSV = 'csv',
  EXCEL = 'excel',
  JSON = 'json'
}

/**
 * 药品统计数据
 */
export interface MedicineStats {
  total: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
}

export type MedicineStatsApiResponse = StandardApiResponse<MedicineStats>; 