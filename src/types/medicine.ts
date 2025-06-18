/**
 * 中药管理系统数据模型
 * 更新版本：支持后端确认的API格式
 */

import { StandardApiResponse, PaginatedApiResponse, PaginationParams } from './api';

/**
 * 中药分类枚举
 */
export enum MedicineCategory {
  TONIFYING_QI = "补气", // 补气药
  TONIFYING_BLOOD = "补血", // 补血药
  TONIFYING_YIN = "补阴", // 补阴药
  TONIFYING_YANG = "补阳", // 补阳药
  DISPELLING_WIND = "祛风", // 祛风药
  CLEARING_HEAT = "清热", // 清热药
  DISPELLING_DAMPNESS = "祛湿", // 祛湿药
  RESOLVING_PHLEGM = "化痰", // 化痰药
  REGULATING_QI = "理气", // 理气药
  PROMOTING_DIGESTION = "消导", // 消食药
  WARMING_INTERIOR = "温里", // 温里药
  PROMOTING_BLOOD = "活血", // 活血化瘀药
  STOPPING_BLEEDING = "止血", // 止血药
  CALMING_LIVER = "平肝", // 平肝药
  ASTRINGENT = "收敛", // 收敛药
  TRANQUILIZING = "安神", // 安神药
  AROMATIC_OPENING = "芳香开窍", // 芳香开窍药
  EXPELLING_PARASITES = "驱虫", // 驱虫药
  EXTERNAL_USE = "外用", // 外用药
  OTHER = "其他" // 其他类别
}

/**
 * 中药药性枚举
 */
export enum MedicineProperty {
  WARM = "温", // 温性
  HOT = "热", // 热性
  COLD = "寒", // 寒性
  COOL = "凉", // 凉性
  NEUTRAL = "平" // 平性
}

/**
 * 药品类型定义（新版本）
 * 匹配后端确认的药品对象结构：{id, sku, name, pinyin, category, pricePerGram}
 * 同时保持向后兼容性
 */
export interface Medicine {
  /** 药品唯一标识符 */
  id: string;
  /** 药品SKU编码 */
  sku: string;
  /** 中文名称（主要显示名称） */
  name: string;
  /** 拼音名称，用于搜索 */
  pinyin: string;
  /** 药品分类 */
  category: string;
  /** 每克价格（必须为数字类型） */
  pricePerGram: number;
  
  // 向后兼容字段
  /** @deprecated 使用 name 字段 */
  chineseName?: string;
  /** @deprecated 使用 pinyin 字段 */
  pinyinName?: string;
  /** @deprecated 使用 property 字段 */
  properties?: string;
  
  // 可选的扩展字段
  /** 英文名称（可选） */
  englishName?: string;
  /** 药性（可选） */
  property?: string;
  /** 库存量（克）（可选） */
  stock?: number;
  /** 药品描述（可选） */
  description?: string;
  /** 药品图片URL（可选） */
  imageUrl?: string;
  /** 是否启用（可选） */
  isActive?: boolean;
  /** 创建时间（可选） */
  createdAt?: string;
  /** 更新时间（可选） */
  updatedAt?: string;
}

/**
 * 药品类型定义（向后兼容）
 * @deprecated 请使用新的 Medicine 接口
 */
export interface LegacyMedicine {
  id: string;
  chineseName: string;  // 中文名
  englishName: string;  // 英文名
  pinyinName: string;   // 拼音名
  pricePerGram: number; // 零售价（元/克）
  category?: string;    // 分类（可选）
  property?: string;    // 药性（可选）
  
  // 新增字段
  stock?: number;        // 库存量（克）
  properties?: string;   // 药性（与property字段兼容）
  description?: string;  // 药品描述
  imageUrl?: string;     // 药品图片URL
  isActive?: boolean;    // 是否启用
  createdAt?: string;    // 创建时间
  updatedAt?: string;    // 更新时间
}

/**
 * 中药创建接口
 */
export type MedicineCreateData = Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * 中药更新接口
 */
export type MedicineUpdateData = Partial<Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * 中药搜索参数（新版本）
 * 匹配后端API参数格式
 */
export interface MedicineSearchParams extends PaginationParams {
  /** 搜索关键词(中文名、拼音、英文) */
  search?: string;
  /** 按分类筛选 */
  category?: string;
  /** 按药性筛选 */
  property?: string;
  /** 最低价格 */
  minPrice?: number;
  /** 最高价格 */
  maxPrice?: number;
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
      totalItems: number;
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
 * 中药搜索参数（向后兼容）
 * @deprecated 请使用 MedicineSearchParams
 */
export interface LegacyMedicineSearchParams {
  query?: string;       // 搜索关键词(中文名、拼音、英文)
  category?: string;    // 按分类筛选
  property?: string;    // 按药性筛选
  minPrice?: number;    // 最低价格
  maxPrice?: number;    // 最高价格
  page?: number;        // 页码
  limit?: number;       // 每页数量
  sortBy?: 'chineseName' | 'pricePerGram' | 'createdAt'; // 排序字段
  order?: 'asc' | 'desc'; // 排序方向
}

/**
 * 中药分页结果（向后兼容）
 * @deprecated 请使用 MedicineSearchResponseData
 */
export interface PaginatedMedicines {
  data: Medicine[];     // 数据
  total: number;        // 总数
  page: number;         // 当前页
  limit: number;        // 每页数量
  totalPages: number;   // 总页数
}

/**
 * 中药导入结果
 */
export interface MedicineImportResult {
  success: number;      // 成功数量
  failed: number;       // 失败数量
  errors: {             // 错误信息
    index: number;      // 错误行索引
    message: string;    // 错误信息
  }[];
}

/**
 * 中药导出格式
 */
export enum MedicineExportFormat {
  CSV = 'csv',
  EXCEL = 'excel',
  JSON = 'json',
  MARKDOWN = 'markdown'
} 