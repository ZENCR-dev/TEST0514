/**
 * 药品管理服务
 * 基于后端团队确认的 Supabase Medicine 表结构规范
 * 
 * @version 2.0
 * @date 2025-01-21
 */
import { 
  Medicine, 
  MedicineCreateData, 
  MedicineSearchParams, 
  MedicineUpdateData,
  MedicineSearchApiResponse,
  MedicineDetailApiResponse,
  validateMedicineData 
} from '@/types/medicine';
import { delay, generateId } from '@/utils/helpers';
import { mockMedicines } from '@/mocks/medicineData';
import { smartConvertToNew, legacyToNewMedicine } from '@/types/adapters';

// 模拟存储
let allMedicines: Medicine[] = [...mockMedicines];

/**
 * 获取所有药品列表(带分页和筛选)
 */
export async function getAllMedicines(params: MedicineSearchParams = {}): Promise<Medicine[]> {
  await delay(600);
  
  const {
    search = '',
    category,
    minPrice,
    maxPrice,
    requiresPrescription,
    status,
    page = 1,
    limit = 10,
    sort = 'name:asc'
  } = params;
  
  // 解析排序参数
  const [sortBy = 'name', order = 'asc'] = sort.split(':') as ['name' | 'basePrice' | 'createdAt', 'asc' | 'desc'];
  
  // 过滤
  let filtered = [...allMedicines];
  
  if (search) {
    const lowercaseQuery = search.toLowerCase();
    filtered = filtered.filter(med => 
      med.name.toLowerCase().includes(lowercaseQuery) ||
      med.chineseName.toLowerCase().includes(lowercaseQuery) ||
      med.englishName.toLowerCase().includes(lowercaseQuery) ||
      med.pinyinName.toLowerCase().includes(lowercaseQuery) ||
      med.sku.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  if (category) {
    filtered = filtered.filter(med => med.category === category);
  }
  
  if (requiresPrescription !== undefined) {
    filtered = filtered.filter(med => med.requiresPrescription === requiresPrescription);
  }
  
  if (status) {
    filtered = filtered.filter(med => med.status === status);
  }
  
  if (minPrice !== undefined) {
    filtered = filtered.filter(med => med.basePrice >= minPrice);
  }
  
  if (maxPrice !== undefined) {
    filtered = filtered.filter(med => med.basePrice <= maxPrice);
  }
  
  // 排序
  filtered.sort((a, b) => {
    const aVal = a[sortBy as keyof Medicine];
    const bVal = b[sortBy as keyof Medicine];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return order === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }
    
    if (aVal instanceof Date && bVal instanceof Date) {
      return order === 'asc' 
        ? aVal.getTime() - bVal.getTime() 
        : bVal.getTime() - aVal.getTime();
    }
    
    return order === 'asc' 
      ? Number(aVal) - Number(bVal) 
      : Number(bVal) - Number(aVal);
  });
  
  // 计算分页
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paged = filtered.slice(start, end);
  
  return paged;
}

/**
 * 根据ID获取药品
 */
export async function getMedicineById(id: string): Promise<Medicine | null> {
  await delay(300);
  return allMedicines.find(med => med.id === id) || null;
}

/**
 * 创建新药品
 */
export async function createMedicine(data: MedicineCreateData): Promise<Medicine> {
  await delay(800);
  
  // 验证必需字段
  if (!data.name || !data.sku || !data.pinyinName) {
    throw new Error('缺少必需字段: name, sku, pinyinName');
  }
  
  if (!data.chineseName || !data.englishName) {
    throw new Error('缺少必需字段: chineseName, englishName');
  }
  
  if (data.basePrice <= 0) {
    throw new Error('价格必须大于0');
  }
  
  // 检查SKU是否已存在
  const existingSku = allMedicines.find(med => med.sku === data.sku);
  if (existingSku) {
    throw new Error(`SKU "${data.sku}" 已存在`);
  }
  
  // 检查名称是否已存在
  const existingName = allMedicines.find(med => med.name === data.name);
  if (existingName) {
    throw new Error(`药品名称 "${data.name}" 已存在`);
  }
  
  const now = new Date();
  const newMedicine: Medicine = {
    id: generateId('med'),
    name: data.name,
    chineseName: data.chineseName,
    englishName: data.englishName,
    pinyinName: data.pinyinName,
    sku: data.sku,
    description: data.description,
    category: data.category,
    unit: data.unit || 'g',
    requiresPrescription: data.requiresPrescription || false,
    basePrice: data.basePrice,
    metadata: data.metadata || null,
    status: data.status || 'active',
    createdAt: now,
    updatedAt: now
  };
  
  // 验证创建的数据
  if (!validateMedicineData(newMedicine)) {
    throw new Error('创建的药品数据不符合规范');
  }
  
  allMedicines.push(newMedicine);
  return newMedicine;
}

/**
 * 更新药品信息
 */
export async function updateMedicine(id: string, data: MedicineUpdateData): Promise<Medicine> {
  await delay(600);
  
  const index = allMedicines.findIndex(med => med.id === id);
  if (index === -1) {
    throw new Error(`药品ID "${id}" 不存在`);
  }
  
  // 检查SKU唯一性
  if (data.sku) {
    const existingSku = allMedicines.find(med => med.id !== id && med.sku === data.sku);
    if (existingSku) {
      throw new Error(`SKU "${data.sku}" 已存在`);
    }
  }
  
  // 检查名称唯一性
  if (data.name) {
    const existingName = allMedicines.find(med => med.id !== id && med.name === data.name);
    if (existingName) {
      throw new Error(`药品名称 "${data.name}" 已存在`);
    }
  }
  
  const updatedMedicine: Medicine = {
    ...allMedicines[index],
    ...data,
    updatedAt: new Date()
  };
  
  // 验证更新后的数据
  if (!validateMedicineData(updatedMedicine)) {
    throw new Error('更新后的药品数据不符合规范');
  }
  
  allMedicines[index] = updatedMedicine;
  return updatedMedicine;
}

/**
 * 删除药品
 */
export async function deleteMedicine(id: string): Promise<boolean> {
  await delay(500);
  
  const index = allMedicines.findIndex(med => med.id === id);
  if (index === -1) {
    throw new Error(`药品ID "${id}" 不存在`);
  }
  
  allMedicines.splice(index, 1);
  return true;
}

/**
 * 批量导入中药
 */
export async function importMedicines(
  medicines: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>[]
): Promise<{
  success: number;
  failed: number;
  errors: { index: number; message: string }[];
}> {
  await delay(1500);
  
  const result = {
    success: 0,
    failed: 0,
    errors: [] as { index: number; message: string }[]
  };
  
  const now = new Date();
  
  for (let i = 0; i < medicines.length; i++) {
    const medicine = medicines[i];
    
    try {
      // 检查必填字段
      if (!medicine.chineseName || !medicine.englishName || !medicine.pinyinName) {
        throw new Error('缺少必填字段：中文名、英文名或拼音名');
      }
      
      // 检查名称唯一性
      const existingChinese = allMedicines.find(
        med => med.chineseName === medicine.chineseName
      );
      
      if (existingChinese) {
        throw new Error(`中药名称 "${medicine.chineseName}" 已存在`);
      }
      
      const existingPinyin = allMedicines.find(
        med => med.pinyinName === medicine.pinyinName
      );
      
      if (existingPinyin) {
        throw new Error(`拼音名称 "${medicine.pinyinName}" 已存在`);
      }
      
      // 创建新药品
      const newMedicine: Medicine = {
        id: generateId('med'),
        name: medicine.name,
        chineseName: medicine.chineseName,
        englishName: medicine.englishName,
        pinyinName: medicine.pinyinName,
        sku: medicine.sku,
        description: medicine.description,
        category: medicine.category,
        unit: medicine.unit,
        requiresPrescription: medicine.requiresPrescription ?? false,
        basePrice: medicine.basePrice,
        metadata: medicine.metadata,
        status: medicine.status ?? 'active',
        createdAt: now,
        updatedAt: now
      };
      
      allMedicines.push(newMedicine);
      result.success++;
    } catch (error) {
      result.failed++;
      result.errors.push({
        index: i,
        message: (error as Error).message
      });
    }
  }
  
  return result;
}

/**
 * 批量更新药品价格 (按百分比)
 */
export async function bulkUpdatePrices(
  ids: string[],
  percentageChange: number
): Promise<{
  success: number;
  failed: number;
  errors: { id: string; message: string }[];
}> {
  await delay(1000);
  
  const result = {
    success: 0,
    failed: 0,
    errors: [] as { id: string; message: string }[]
  };
  
  const now = new Date();
  
  for (const id of ids) {
    try {
      const index = allMedicines.findIndex(med => med.id === id);
      
      if (index === -1) {
        throw new Error(`中药ID "${id}" 不存在`);
      }
      
      const currentPrice = allMedicines[index].basePrice;
      const newPrice = currentPrice * (1 + percentageChange / 100);
      
      // 确保价格不为负
      if (newPrice <= 0) {
        throw new Error('价格调整后不能小于或等于0');
      }
      
      allMedicines[index] = {
        ...allMedicines[index],
        basePrice: parseFloat(newPrice.toFixed(2)),
        updatedAt: now
      };
      
      result.success++;
    } catch (error) {
      result.failed++;
      result.errors.push({
        id,
        message: (error as Error).message
      });
    }
  }
  
  return result;
}

/**
 * 批量更新库存
 */
export async function bulkUpdateStock(
  updates: { id: string; stockChange: number }[]
): Promise<{
  success: number;
  failed: number;
  errors: { id: string; message: string }[];
}> {
  await delay(1000);
  
  const result = {
    success: 0,
    failed: 0,
    errors: [] as { id: string; message: string }[]
  };
  
  const now = new Date();
  
  for (const update of updates) {
    try {
      const index = allMedicines.findIndex(med => med.id === update.id);
      
      if (index === -1) {
        throw new Error(`中药ID "${update.id}" 不存在`);
      }
      
      // 检查药品是否有库存字段（在 metadata 中），并且是否为数字，否则默认为0
      const currentStock = (allMedicines[index].metadata && typeof allMedicines[index].metadata === 'object' && (allMedicines[index].metadata as any).stock) || 0;
      const newStock = currentStock + update.stockChange;
      
      // 确保库存不为负
      if (newStock < 0) {
        throw new Error('库存不能小于0');
      }
      
      allMedicines[index] = {
        ...allMedicines[index],
        metadata: {
          ...((allMedicines[index].metadata as any) || {}),
          stock: newStock
        },
        updatedAt: now
      };
      
      result.success++;
    } catch (error) {
      result.failed++;
      result.errors.push({
        id: update.id,
        message: (error as Error).message
      });
    }
  }
  
  return result;
}

/**
 * 搜索药品（快速搜索，无分页）
 */
export async function searchMedicines(query: string): Promise<Medicine[]> {
  await delay(300);
  
  if (!query || query.trim() === '') {
    return [];
  }
  
  const lowercaseQuery = query.toLowerCase();
  return allMedicines.filter(med => 
    med.status === 'active' && (
      med.name.toLowerCase().includes(lowercaseQuery) ||
      med.chineseName.toLowerCase().includes(lowercaseQuery) ||
      med.englishName.toLowerCase().includes(lowercaseQuery) ||
      med.pinyinName.toLowerCase().includes(lowercaseQuery) ||
      med.sku.toLowerCase().includes(lowercaseQuery)
    )
  ).slice(0, 20); // 限制返回20条记录
} 