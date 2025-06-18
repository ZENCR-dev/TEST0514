/**
 * 数据格式适配器
 * 新旧 Medicine 接口之间的转换工具
 * 
 * @version 2.0
 * @date 2025-01-21
 * @description 支持新的 Supabase Medicine 格式与旧格式的双向转换
 */

import { Medicine, LegacyMedicine } from './medicine';
import { generateSku, convertLegacySku } from '../utils/skuGenerator';

// ==================== 药品类型适配器 ====================

/**
 * 将旧格式药品数据转换为新格式
 * @param legacy 旧格式药品数据
 * @returns 新格式药品数据
 */
export function legacyToNewMedicine(legacy: LegacyMedicine): Medicine {
  // 生成或转换 SKU
  const sku = legacy.sku 
    ? convertLegacySku(legacy.sku, legacy.chineseName, legacy.pinyinName)
    : generateSku(legacy.chineseName, legacy.pinyinName);

  return {
    id: legacy.id,
    name: legacy.name || legacy.chineseName, // 使用 name 字段，回退到 chineseName
    chineseName: legacy.chineseName,
    englishName: legacy.englishName,
    pinyinName: legacy.pinyinName,
    sku: sku,
    description: `${legacy.chineseName}的描述信息`, // 提供默认描述
    category: legacy.category || '其他中药', // 提供默认分类
    unit: 'g', // 默认单位
    requiresPrescription: false, // 默认不需要处方
    basePrice: legacy.basePrice || legacy.pricePerGram, // 优先使用 basePrice，回退到 pricePerGram
    metadata: {
      // 保留旧格式中的有用信息
      ...(legacy.properties && { properties: legacy.properties }),
      ...(legacy.stock && { stock: legacy.stock }),
      ...(legacy.imageUrl && { imageUrl: legacy.imageUrl }),
      ...(legacy.isActive !== undefined && { isActive: legacy.isActive })
    },
    status: legacy.isActive === false ? 'inactive' : 'active',
    createdAt: legacy.createdAt ? new Date(legacy.createdAt) : new Date(),
    updatedAt: legacy.updatedAt ? new Date(legacy.updatedAt) : new Date()
  };
}

/**
 * 将新格式药品数据转换为旧格式
 * @param medicine 新格式药品数据
 * @returns 旧格式药品数据
 */
export function newToLegacyMedicine(medicine: Medicine): LegacyMedicine {
  return {
    id: medicine.id,
    chineseName: medicine.chineseName,
    englishName: medicine.englishName,
    pinyinName: medicine.pinyinName,
    pricePerGram: medicine.basePrice, // 映射 basePrice 到 pricePerGram
    category: medicine.category,
    sku: medicine.sku,
    name: medicine.name,
    pinyin: medicine.pinyinName, // 兼容性字段
    basePrice: medicine.basePrice,
    // 从 metadata 中提取旧格式字段
    properties: medicine.metadata && typeof medicine.metadata === 'object' 
      ? (medicine.metadata as any).properties 
      : undefined,
    stock: medicine.metadata && typeof medicine.metadata === 'object' 
      ? (medicine.metadata as any).stock 
      : undefined,
    description: medicine.description,
    imageUrl: medicine.metadata && typeof medicine.metadata === 'object' 
      ? (medicine.metadata as any).imageUrl 
      : undefined,
    isActive: medicine.status === 'active',
    createdAt: medicine.createdAt.toISOString(),
    updatedAt: medicine.updatedAt.toISOString()
  };
}

/**
 * 批量转换旧格式到新格式
 * @param legacyMedicines 旧格式药品数组
 * @returns 新格式药品数组
 */
export function batchLegacyToNew(legacyMedicines: LegacyMedicine[]): Medicine[] {
  return legacyMedicines.map(legacyToNewMedicine);
}

/**
 * 批量转换新格式到旧格式
 * @param medicines 新格式药品数组
 * @returns 旧格式药品数组
 */
export function batchNewToLegacy(medicines: Medicine[]): LegacyMedicine[] {
  return medicines.map(newToLegacyMedicine);
}

/**
 * 检测数据是否为新格式
 * @param data 待检测的数据
 * @returns 是否为新格式
 */
export function isNewFormat(data: any): data is Medicine {
  return (
    data &&
    typeof data.basePrice === 'number' &&
    typeof data.requiresPrescription === 'boolean' &&
    typeof data.unit === 'string' &&
    typeof data.status === 'string' &&
    data.createdAt instanceof Date &&
    data.updatedAt instanceof Date
  );
}

/**
 * 检测数据是否为旧格式
 * @param data 待检测的数据
 * @returns 是否为旧格式
 */
export function isLegacyFormat(data: any): data is LegacyMedicine {
  return (
    data &&
    typeof data.pricePerGram === 'number' &&
    typeof data.chineseName === 'string' &&
    typeof data.englishName === 'string' &&
    typeof data.pinyinName === 'string' &&
    (!data.basePrice || typeof data.basePrice === 'number') &&
    (data.requiresPrescription === undefined || typeof data.requiresPrescription === 'boolean')
  );
}

/**
 * 智能转换器 - 自动检测格式并转换为新格式
 * @param data 任意格式的药品数据
 * @returns 新格式药品数据
 */
export function smartConvertToNew(data: any): Medicine {
  if (isNewFormat(data)) {
    return data;
  }
  
  if (isLegacyFormat(data)) {
    return legacyToNewMedicine(data);
  }
  
  throw new Error('无法识别的数据格式，无法转换为新格式');
}

/**
 * 智能转换器 - 自动检测格式并转换为旧格式
 * @param data 任意格式的药品数据
 * @returns 旧格式药品数据
 */
export function smartConvertToLegacy(data: any): LegacyMedicine {
  if (isLegacyFormat(data)) {
    return data;
  }
  
  if (isNewFormat(data)) {
    return newToLegacyMedicine(data);
  }
  
  throw new Error('无法识别的数据格式，无法转换为旧格式');
}

/**
 * 数据完整性验证 - 转换前后数据对比
 * @param original 原始数据
 * @param converted 转换后数据
 * @returns 验证结果
 */
export function validateConversion(original: any, converted: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // 检查核心字段是否保持一致
  if (original.id !== converted.id) {
    errors.push('ID 字段不匹配');
  }
  
  if (original.chineseName !== converted.chineseName) {
    errors.push('中文名称不匹配');
  }
  
  if (original.englishName !== converted.englishName) {
    errors.push('英文名称不匹配');
  }
  
  if (original.pinyinName !== converted.pinyinName) {
    errors.push('拼音名称不匹配');
  }
  
  // 检查价格字段
  const originalPrice = original.basePrice || original.pricePerGram;
  const convertedPrice = converted.basePrice || converted.pricePerGram;
  if (originalPrice !== convertedPrice) {
    errors.push('价格字段不匹配');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 迁移状态追踪接口
 */
export interface MigrationState {
  totalItems: number;
  convertedItems: number;
  failedItems: number;
  errors: Array<{
    index: number;
    error: string;
    data: any;
  }>;
}

/**
 * 渐进式迁移工具
 * @param data 待迁移的数据数组
 * @param batchSize 批次大小
 * @returns 迁移状态和结果
 */
export function progressiveMigration(
  data: any[], 
  batchSize: number = 10
): {
  state: MigrationState;
  results: Medicine[];
} {
  const state: MigrationState = {
    totalItems: data.length,
    convertedItems: 0,
    failedItems: 0,
    errors: []
  };
  
  const results: Medicine[] = [];
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    
    batch.forEach((item, index) => {
      try {
        const converted = smartConvertToNew(item);
        results.push(converted);
        state.convertedItems++;
      } catch (error) {
        state.failedItems++;
        state.errors.push({
          index: i + index,
          error: error instanceof Error ? error.message : '未知错误',
          data: item
        });
      }
    });
  }
  
  return { state, results };
}

/**
 * 中间件函数 - 自动格式转换
 * 可用于 API 调用前的数据预处理
 */
export const autoConvertMiddleware = {
  /**
   * 请求前转换为新格式
   */
  beforeRequest: (data: any): Medicine => {
    return smartConvertToNew(data);
  },
  
  /**
   * 响应后转换为旧格式（如需要）
   */
  afterResponse: (data: Medicine, needLegacy: boolean = false): Medicine | LegacyMedicine => {
    return needLegacy ? newToLegacyMedicine(data) : data;
  }
};

 