/**
 * 中药管理服务
 */
import { Medicine, MedicineCreateData, MedicineSearchParams, MedicineUpdateData, PaginatedMedicines } from '@/types/medicine';
import { delay, generateId } from '@/utils/helpers';
import { initialMedicines } from '@/mocks/medicineData';

// 模拟存储
let allMedicines: Medicine[] = [...initialMedicines];

/**
 * 获取所有中药列表(带分页和筛选)
 */
export async function getAllMedicines(params: MedicineSearchParams = {}): Promise<PaginatedMedicines> {
  await delay(600);
  
  const {
    query = '',
    category,
    property,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
    sortBy = 'chineseName',
    order = 'asc'
  } = params;
  
  // 过滤
  let filtered = [...allMedicines];
  
  if (query) {
    const lowercaseQuery = query.toLowerCase();
    filtered = filtered.filter(med => 
      med.chineseName.toLowerCase().includes(lowercaseQuery) ||
      med.englishName.toLowerCase().includes(lowercaseQuery) ||
      med.pinyinName.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  if (category) {
    filtered = filtered.filter(med => med.category === category);
  }
  
  if (property) {
    filtered = filtered.filter(med => med.property?.includes(property));
  }
  
  if (minPrice !== undefined) {
    filtered = filtered.filter(med => med.pricePerGram >= minPrice);
  }
  
  if (maxPrice !== undefined) {
    filtered = filtered.filter(med => med.pricePerGram <= maxPrice);
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
  
  return {
    data: paged,
    total: totalItems,
    page,
    limit,
    totalPages
  };
}

/**
 * 根据ID获取中药
 */
export async function getMedicineById(id: string): Promise<Medicine | null> {
  await delay(300);
  return allMedicines.find(med => med.id === id) || null;
}

/**
 * 创建新中药
 */
export async function createMedicine(data: MedicineCreateData): Promise<Medicine> {
  await delay(800);
  
  // 检查名称是否已存在
  const existingChinese = allMedicines.find(
    med => med.chineseName === data.chineseName
  );
  
  if (existingChinese) {
    throw new Error(`中药名称 "${data.chineseName}" 已存在`);
  }
  
  const existingPinyin = allMedicines.find(
    med => med.pinyinName === data.pinyinName
  );
  
  if (existingPinyin) {
    throw new Error(`拼音名称 "${data.pinyinName}" 已存在`);
  }
  
  const now = new Date().toISOString();
  const newMedicine: Medicine = {
    id: generateId('med'),
    ...data,
    createdAt: now,
    updatedAt: now
  };
  
  allMedicines.push(newMedicine);
  return newMedicine;
}

/**
 * 更新中药信息
 */
export async function updateMedicine(id: string, data: MedicineUpdateData): Promise<Medicine> {
  await delay(600);
  
  const index = allMedicines.findIndex(med => med.id === id);
  if (index === -1) {
    throw new Error(`中药ID "${id}" 不存在`);
  }
  
  // 检查名称唯一性
  if (data.chineseName) {
    const existingChinese = allMedicines.find(
      med => med.id !== id && med.chineseName === data.chineseName
    );
    
    if (existingChinese) {
      throw new Error(`中药名称 "${data.chineseName}" 已存在`);
    }
  }
  
  if (data.pinyinName) {
    const existingPinyin = allMedicines.find(
      med => med.id !== id && med.pinyinName === data.pinyinName
    );
    
    if (existingPinyin) {
      throw new Error(`拼音名称 "${data.pinyinName}" 已存在`);
    }
  }
  
  const updatedMedicine = {
    ...allMedicines[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  allMedicines[index] = updatedMedicine;
  return updatedMedicine;
}

/**
 * 删除中药
 */
export async function deleteMedicine(id: string): Promise<boolean> {
  await delay(500);
  
  const index = allMedicines.findIndex(med => med.id === id);
  if (index === -1) {
    return false;
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
  
  const now = new Date().toISOString();
  
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
      
      // 创建新中药
      const newMedicine: Medicine = {
        id: generateId('med'),
        ...medicine,
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
 * 批量更新中药价格 (按百分比)
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
  
  const now = new Date().toISOString();
  
  for (const id of ids) {
    try {
      const index = allMedicines.findIndex(med => med.id === id);
      
      if (index === -1) {
        throw new Error(`中药ID "${id}" 不存在`);
      }
      
      const currentPrice = allMedicines[index].pricePerGram;
      const newPrice = currentPrice * (1 + percentageChange / 100);
      
      // 确保价格不为负
      if (newPrice <= 0) {
        throw new Error('价格调整后不能小于或等于0');
      }
      
      allMedicines[index] = {
        ...allMedicines[index],
        pricePerGram: parseFloat(newPrice.toFixed(2)),
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
  
  const now = new Date().toISOString();
  
  for (const update of updates) {
    try {
      const index = allMedicines.findIndex(med => med.id === update.id);
      
      if (index === -1) {
        throw new Error(`中药ID "${update.id}" 不存在`);
      }
      
      const currentStock = allMedicines[index].stock;
      const newStock = currentStock + update.stockChange;
      
      // 确保库存不为负
      if (newStock < 0) {
        throw new Error('库存不能小于0');
      }
      
      allMedicines[index] = {
        ...allMedicines[index],
        stock: newStock,
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
 * 搜索中药（快速搜索，无分页）
 */
export async function searchMedicines(query: string): Promise<Medicine[]> {
  await delay(300);
  
  if (!query || query.trim() === '') {
    return [];
  }
  
  const lowercaseQuery = query.toLowerCase();
  return allMedicines.filter(med => 
    med.isActive && (
      med.chineseName.toLowerCase().includes(lowercaseQuery) ||
      med.englishName.toLowerCase().includes(lowercaseQuery) ||
      med.pinyinName.toLowerCase().includes(lowercaseQuery)
    )
  ).slice(0, 20); // 限制返回20条记录
} 