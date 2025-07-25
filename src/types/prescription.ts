import type { PaginatedResult } from './common';

/**
 * 处方相关类型定义
 * 用于药房端QR码解析和数据处理
 */

/**
 * QR码中包含的药品项目信息
 */
export interface PrescriptionQRItem {
  /** 药品ID，对应Medicine.id */
  id: string;
  /** 用量（克） */
  quantity: number;
  /** 药品中文名称（可选，药房端通过ID查找） */
  name?: string;
}

/**
 * QR码中包含的完整处方数据
 * 必须与医师端PrescriptionPreview.tsx中的格式保持一致
 */
export interface PrescriptionQRData {
  /** 处方ID */
  prescriptionId: string;
  /** 药品列表 */
  items: PrescriptionQRItem[];
  /** 帖数 */
  copies: number;
  /** 用法用量说明 */
  instructions: string;
}

/**
 * QR码解析结果
 */
export interface QRParseResult {
  /** 解析是否成功 */
  success: boolean;
  /** 解析后的数据（成功时存在） */
  data?: PrescriptionQRData;
  /** 错误信息（失败时存在） */
  error?: string;
  /** 错误类型 */
  errorType?: 'INVALID_JSON' | 'INVALID_FORMAT' | 'MISSING_FIELDS' | 'INVALID_DATA';
}

/**
 * 处方解析状态
 */
export type PrescriptionParseStatus = 'idle' | 'parsing' | 'success' | 'error';

/**
 * 处方状态（旧名称，兼容性）
 * @deprecated 请使用 PrescriptionParseStatus
 */
export type PrescriptionStatus = PrescriptionParseStatus;

/**
 * 处方状态常量（用于测试和类型检查）
 */
export const PRESCRIPTION_STATUS = {
  IDLE: 'idle' as const,
  PARSING: 'parsing' as const,
  SUCCESS: 'success' as const,
  ERROR: 'error' as const
} as const;

/**
 * 处方状态枚举（实际可用的状态值）
 */
export enum PrescriptionStatusEnum {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

// ==================== 医师工作站扩展类型定义 ====================

/**
 * 处方项目（用于历史记录和模板）
 */
export interface PrescriptionItem {
  /** 药品ID */
  medicineId: string;
  /** 药品中文名称 */
  medicineName: string;
  /** 药品英文名称 */
  medicineEnglishName?: string;
  /** 英文名称（兼容字段） */
  englishName?: string;
  /** 中文名称（兼容字段） */
  chineseName?: string;
  /** 用量（克） */
  quantity: number;
  /** 重量（克，兼容字段） */
  weight?: number;
  /** 单价（元/克） */
  pricePerGram: number;
  /** 基础价格（元/克，兼容字段） */
  basePrice?: number;
  /** 小计（元） */
  subtotal: number;
  /** 备注 */
  notes?: string;
}

/**
 * 处方历史记录
 */
export interface PrescriptionHistory {
  /** 历史记录ID */
  id: string;
  /** 处方ID */
  prescriptionId: string;
  /** 患者姓名 */
  patientName: string;
  /** 患者ID */
  patientId: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
  /** 处方状态 */
  status: 'completed' | 'cancelled' | 'expired' | 'pending';
  /** 总价（元） */
  totalPrice: number;
  /** 药品种类数量 */
  itemCount: number;
  /** 帖数 */
  copies: number;
  /** 药品列表 */
  items: PrescriptionItem[];
  /** 用法用量说明 */
  instructions: string;
  /** 医师备注 */
  notes?: string;
  /** 处方费（元） */
  prescriptionFee?: number;
}

/**
 * 模板药品项目
 */
export interface TemplateItem {
  /** 药品ID */
  medicineId: string;
  /** 药品中文名称 */
  medicineName: string;
  /** 药品英文名称 */
  medicineEnglishName?: string;
  /** 默认用量（克） */
  defaultQuantity: number;
  /** 备注说明 */
  notes?: string;
}

/**
 * 处方模板
 */
export interface PrescriptionTemplate {
  /** 模板ID */
  id: string;
  /** 模板名称 */
  name: string;
  /** 模板描述 */
  description?: string;
  /** 分类 */
  category: string;
  /** 模板药品列表 */
  items: TemplateItem[];
  /** 默认用法用量说明 */
  defaultInstructions?: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
  /** 使用次数 */
  usageCount: number;
  /** 是否为默认模板 */
  isDefault: boolean;
  /** 创建者ID */
  creatorId: string;
  /** 创建者姓名 */
  creatorName: string;
}

/**
 * 历史记录搜索参数
 */
export interface HistorySearchParams {
  /** 搜索关键词（患者姓名、处方ID等） */
  query?: string;
  /** 搜索关键词（兼容字段） */
  search?: string;
  /** 状态筛选 */
  status?: PrescriptionHistory['status'];
  /** 开始日期 */
  startDate?: string;
  /** 结束日期 */
  endDate?: string;
  /** 页码 */
  page?: number;
  /** 每页条数 */
  limit?: number;
}

/**
 * 模板搜索参数
 */
export interface TemplateSearchParams {
  /** 搜索关键词（模板名称、描述等） */
  query?: string;
  /** 分类筛选 */
  category?: string;
  /** 是否只显示默认模板 */
  defaultOnly?: boolean;
  /** 页码 */
  page?: number;
  /** 每页条数 */
  limit?: number;
}

/**
 * 创建模板数据
 */
export interface CreateTemplateData {
  /** 模板名称 */
  name: string;
  /** 模板描述 */
  description?: string;
  /** 分类 */
  category: string;
  /** 模板药品列表 */
  items: Omit<TemplateItem, 'medicineEnglishName'>[];
  /** 默认用法用量说明 */
  defaultInstructions?: string;
  /** 是否为默认模板 */
  isDefault?: boolean;
}

/**
 * 更新模板数据
 */
export interface UpdateTemplateData extends Partial<CreateTemplateData> {}

/**
 * 处方类型（旧名称，兼容性）
 * @deprecated 请使用 PrescriptionHistory
 */
export type Prescription = PrescriptionHistory;

/**
 * 处方搜索参数（旧名称，兼容性）
 * @deprecated 请使用 HistorySearchParams
 */
export type PrescriptionSearchParams = HistorySearchParams;

/**
 * 处方药品（旧名称，兼容性）
 * @deprecated 请使用 PrescriptionItem
 */
export type PrescriptionMedicine = PrescriptionItem; 