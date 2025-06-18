/**
 * 类型适配器
 * 用于处理新旧API类型之间的转换，确保向后兼容性
 */

import { Medicine as NewMedicine, LegacyMedicine } from './medicine';
import { LoginResponseData, LoginResponse } from './auth';
import { StandardApiResponse } from './api';

// ==================== 药品类型适配器 ====================

/**
 * 将新版Medicine转换为旧版格式
 */
export function medicineToLegacy(medicine: NewMedicine): LegacyMedicine {
  return {
    id: medicine.id,
    chineseName: medicine.name, // name -> chineseName
    englishName: medicine.englishName || '',
    pinyinName: medicine.pinyin, // pinyin -> pinyinName
    pricePerGram: medicine.pricePerGram,
    category: medicine.category,
    property: medicine.property,
    stock: medicine.stock,
    properties: medicine.property, // 兼容properties字段
    description: medicine.description,
    imageUrl: medicine.imageUrl,
    isActive: medicine.isActive,
    createdAt: medicine.createdAt,
    updatedAt: medicine.updatedAt
  };
}

/**
 * 将旧版Medicine转换为新版格式
 */
export function legacyToMedicine(legacy: LegacyMedicine): NewMedicine {
  return {
    id: legacy.id,
    sku: legacy.id, // 如果没有sku，使用id作为fallback
    name: legacy.chineseName, // chineseName -> name
    pinyin: legacy.pinyinName || '', // pinyinName -> pinyin
    category: legacy.category || '',
    pricePerGram: legacy.pricePerGram,
    englishName: legacy.englishName,
    property: legacy.property || legacy.properties,
    stock: legacy.stock,
    description: legacy.description,
    imageUrl: legacy.imageUrl,
    isActive: legacy.isActive,
    createdAt: legacy.createdAt,
    updatedAt: legacy.updatedAt
  };
}

// ==================== 认证类型适配器 ====================

/**
 * 将新版LoginResponseData转换为旧版LoginResponse
 */
export function loginResponseToLegacy(loginData: LoginResponseData): LoginResponse {
  return {
    user: loginData.user,
    token: loginData.accessToken // 使用accessToken作为token
  };
}

/**
 * 将标准API响应转换为旧版登录响应
 */
export function apiLoginResponseToLegacy(
  apiResponse: StandardApiResponse<LoginResponseData>
): LoginResponse {
  return loginResponseToLegacy(apiResponse.data);
}

// ==================== 工具函数 ====================

/**
 * 批量转换药品列表到旧版格式
 */
export function medicineListToLegacy(medicines: NewMedicine[]): LegacyMedicine[] {
  return medicines.map(medicineToLegacy);
}

/**
 * 批量转换旧版药品列表到新版格式
 */
export function legacyMedicineListToNew(legacyMedicines: LegacyMedicine[]): NewMedicine[] {
  return legacyMedicines.map(legacyToMedicine);
}

/**
 * 检查是否为新版Medicine类型
 */
export function isNewMedicine(medicine: any): medicine is NewMedicine {
  return medicine && 
         typeof medicine.sku === 'string' && 
         typeof medicine.name === 'string' && 
         typeof medicine.pinyin === 'string';
}

/**
 * 检查是否为旧版Medicine类型
 */
export function isLegacyMedicine(medicine: any): medicine is LegacyMedicine {
  return medicine && 
         typeof medicine.chineseName === 'string' && 
         typeof medicine.pinyinName === 'string';
}

/**
 * 智能转换：自动检测类型并转换为新版格式
 */
export function toNewMedicine(medicine: NewMedicine | LegacyMedicine): NewMedicine {
  if (isNewMedicine(medicine)) {
    return medicine;
  }
  if (isLegacyMedicine(medicine)) {
    return legacyToMedicine(medicine);
  }
  throw new Error('Invalid medicine object');
}

/**
 * 智能转换：自动检测类型并转换为旧版格式
 */
export function toLegacyMedicine(medicine: NewMedicine | LegacyMedicine): LegacyMedicine {
  if (isLegacyMedicine(medicine)) {
    return medicine;
  }
  if (isNewMedicine(medicine)) {
    return medicineToLegacy(medicine);
  }
  throw new Error('Invalid medicine object');
} 