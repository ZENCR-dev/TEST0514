/**
 * 中药服务单元测试
 */
import { 
  getAllMedicines, 
  getMedicineById, 
  createMedicine, 
  updateMedicine, 
  deleteMedicine,
  importMedicines,
  bulkUpdatePrices,
  bulkUpdateStock,
  searchMedicines
} from '@/services/medicineService';
import { Medicine, MedicineCreateData, MedicineUpdateData, MedicineSearchParams } from '@/types/medicine';
import { initialMedicines } from '@/mocks/medicineData';

// Mock数据使用新的Medicine格式
const mockMedicine: MedicineCreateData = {
  sku: "TCM-001",
  name: "人参",
  pinyin: "renshen",
  category: "补气",
  pricePerGram: 15.0,
  // 向后兼容字段
  chineseName: "人参",
  englishName: "Ginseng",
  pinyinName: "renshen",
  stock: 100,
  description: "补气药",
  properties: "温",
  isActive: true,
  imageUrl: "https://example.com/ginseng.jpg"
};

const mockCreatedMedicine: Medicine = {
  id: "med_001",
  ...mockMedicine,
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z"
};

// 重置模块之间的测试
jest.mock('@/mocks/medicineData', () => ({
  initialMedicines: [
    {
      id: "med_001",
      chineseName: "人参",
      englishName: "Ginseng",
      pinyinName: "renshen",
      pricePerGram: 15.0,
      stock: 5000,
      description: "补气补血，益精安神",
      properties: "温",
      category: "补气",
      isActive: true,
      imageUrl: "/images/medicines/renshen.jpg",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z"
    }
  ]
}));

// 模拟delay函数，加速测试执行
jest.mock('@/utils/helpers', () => ({
  delay: (ms: number) => Promise.resolve(),
  generateId: (prefix: string) => `${prefix}_test_id`,
}));

describe('中药管理服务', () => {
  beforeEach(() => {
    // 重置所有mock
    jest.clearAllMocks();
  });
  
  describe('getAllMedicines', () => {
    it('should return all medicines when no params provided', async () => {
      const result = await getAllMedicines();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // 验证返回的数据结构
      if (result.length > 0) {
        const medicine = result[0];
        expect(medicine).toHaveProperty('id');
        expect(medicine).toHaveProperty('sku');
        expect(medicine).toHaveProperty('name');
        expect(medicine).toHaveProperty('pinyin');
        expect(medicine).toHaveProperty('pricePerGram');
      }
    });

    it('should return empty array when no medicines found', async () => {
      const result = await getAllMedicines({ search: 'nonexistent' });
      expect(result).toEqual([]);
    });

    it('should filter medicines by search term', async () => {
      const result = await getAllMedicines({ search: '人参' });
      
      expect(Array.isArray(result)).toBe(true);
      result.forEach(medicine => {
        const matchesSearch = 
          medicine.name.includes('人参') ||
          (medicine.chineseName && medicine.chineseName.includes('人参')) ||
          (medicine.pinyin && medicine.pinyin.includes('renshen'));
        expect(matchesSearch).toBe(true);
      });
    });

    it('should filter medicines by category', async () => {
      const result = await getAllMedicines({ category: '补气' });
      
      expect(Array.isArray(result)).toBe(true);
      result.forEach(medicine => {
        expect(medicine.category).toBe('补气');
      });
    });

    it('should sort medicines by price', async () => {
      const result1 = await getAllMedicines({ sort: 'pricePerGram:asc' });
      const result2 = await getAllMedicines({ sort: 'pricePerGram:desc' });
      
      expect(Array.isArray(result1)).toBe(true);
      expect(Array.isArray(result2)).toBe(true);
      
      if (result1.length > 1) {
        expect(result1[0].pricePerGram).toBeLessThanOrEqual(result1[1].pricePerGram);
      }
      
      if (result2.length > 1) {
        expect(result2[0].pricePerGram).toBeGreaterThanOrEqual(result2[1].pricePerGram);
      }
    });

    it('should handle pagination parameters', async () => {
      const params: MedicineSearchParams = {
        page: 1,
        limit: 5
      };
      
      const result = await getAllMedicines(params);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(5);
    });
  });
  
  describe('getMedicineById', () => {
    it('should return medicine when valid ID provided', async () => {
      const result = await getMedicineById('med_001');
      
      expect(result).toBeDefined();
      if (result) {
        expect(result.id).toBe('med_001');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('pricePerGram');
      }
    });

    it('should return null when invalid ID provided', async () => {
      const result = await getMedicineById('invalid_id');
      expect(result).toBeNull();
    });
  });
  
  describe('createMedicine', () => {
    it('should create a new medicine', async () => {
      const result = await createMedicine(mockMedicine);
      
      expect(result).toBeDefined();
      expect(result.name).toBe(mockMedicine.name);
      expect(result.sku).toBe(mockMedicine.sku);
      expect(result.pricePerGram).toBe(mockMedicine.pricePerGram);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should throw error when invalid data provided', async () => {
      const invalidMedicine = {
        name: '', // 空名称应该导致错误
        sku: '',
        pinyin: '',
        category: '',
        pricePerGram: -1 // 负价格应该导致错误
      } as MedicineCreateData;

      await expect(createMedicine(invalidMedicine)).rejects.toThrow();
    });
  });
  
  describe('updateMedicine', () => {
    it('should update an existing medicine', async () => {
      const updateData: MedicineUpdateData = {
        name: "更新的人参",
        pricePerGram: 20.0
      };
      
      const result = await updateMedicine('med_001', updateData);
      
      expect(result).toBeDefined();
      expect(result.name).toBe(updateData.name);
      expect(result.pricePerGram).toBe(updateData.pricePerGram);
      expect(result).toHaveProperty('updatedAt');
    });

    it('should throw error when medicine not found', async () => {
      const updateData: MedicineUpdateData = {
        name: "更新的药品"
      };

      await expect(updateMedicine('invalid_id', updateData)).rejects.toThrow();
    });
  });
  
  describe('deleteMedicine', () => {
    it('should delete an existing medicine', async () => {
      const result = await deleteMedicine('med_001');
      expect(result).toBe(true);
    });

    it('should throw error when medicine not found', async () => {
      await expect(deleteMedicine('invalid_id')).rejects.toThrow();
    });
  });
  
  describe('importMedicines', () => {
    it('应该成功批量导入中药', async () => {
      const medicinesList = [
        {
          chineseName: "批量导入药1",
          englishName: "Bulk Import 1",
          pinyinName: "piliangdaoruyao1",
          pricePerGram: 3.0,
          stock: 500,
          properties: "温",
          category: "测试",
          isActive: true
        },
        {
          chineseName: "批量导入药2",
          englishName: "Bulk Import 2",
          pinyinName: "piliangdaoruyao2",
          pricePerGram: 4.0,
          stock: 600,
          properties: "凉",
          category: "测试",
          isActive: true
        }
      ];
      
      const result = await importMedicines(medicinesList as any);
      expect(result.success).toBe(2);
      expect(result.failed).toBe(0);
      expect(result.errors.length).toBe(0);
    });
    
    it('应该正确处理导入失败的情况', async () => {
      const medicinesList = [
        {
          chineseName: "", // 空名称，将导致错误
          englishName: "Invalid Medicine",
          pinyinName: "invalid",
          pricePerGram: 1.0,
          stock: 100,
          isActive: true
        },
        {
          chineseName: "人参", // 重复的名称，将导致错误
          englishName: "Duplicate Ginseng",
          pinyinName: "unique_pinyin_123",
          pricePerGram: 10.0,
          stock: 1000,
          isActive: true
        }
      ];
      
      const result = await importMedicines(medicinesList as any);
      expect(result.success).toBe(0);
      expect(result.failed).toBe(2);
      expect(result.errors.length).toBe(2);
    });
  });
  
  describe('bulkUpdatePrices', () => {
    it('应该成功批量更新价格', async () => {
      // 先创建两个测试中药
      const med1 = await createMedicine({
        ...mockMedicine,
        chineseName: "价格测试药1",
        pinyinName: "jiageceshiyao1",
        pricePerGram: 10.0
      });
      
      const med2 = await createMedicine({
        ...mockMedicine,
        chineseName: "价格测试药2",
        pinyinName: "jiageceshiyao2",
        pricePerGram: 20.0
      });
      
      // 增加10%价格
      const result = await bulkUpdatePrices([med1.id, med2.id], 10);
      expect(result.success).toBe(2);
      expect(result.failed).toBe(0);
      
      // 验证价格更新
      const updatedMed1 = await getMedicineById(med1.id);
      const updatedMed2 = await getMedicineById(med2.id);
      
      expect(updatedMed1?.pricePerGram).toBeCloseTo(11.0);
      expect(updatedMed2?.pricePerGram).toBeCloseTo(22.0);
    });
    
    it('应该正确处理价格更新错误', async () => {
      // 创建测试中药
      const med = await createMedicine({
        ...mockMedicine,
        chineseName: "价格错误测试药",
        pinyinName: "jiagecuowuceshiyao",
        pricePerGram: 10.0
      });
      
      // 尝试减少110%的价格(不合法)
      const result = await bulkUpdatePrices([med.id, "non_existent_id"], -110);
      expect(result.success).toBe(0);
      expect(result.failed).toBe(2);
      expect(result.errors.length).toBe(2);
      
      // 验证价格未变
      const updatedMed = await getMedicineById(med.id);
      expect(updatedMed?.pricePerGram).toBe(10.0);
    });
  });
  
  describe('bulkUpdateStock', () => {
    it('应该成功批量更新库存', async () => {
      // 创建测试中药
      const med = await createMedicine({
        ...mockMedicine,
        chineseName: "库存测试药",
        pinyinName: "kucunceshiyao",
        stock: 1000
      });
      
      // 增加500库存
      const result = await bulkUpdateStock([
        { id: med.id, stockChange: 500 }
      ]);
      
      expect(result.success).toBe(1);
      expect(result.failed).toBe(0);
      
      // 验证库存更新
      const updatedMed = await getMedicineById(med.id);
      expect(updatedMed?.stock).toBe(1500);
    });
    
    it('库存不能减少到负数', async () => {
      // 创建测试中药
      const med = await createMedicine({
        ...mockMedicine,
        chineseName: "库存边界测试药",
        pinyinName: "kucunbianjieceshiyao",
        stock: 100
      });
      
      // 尝试减少200库存(超过现有库存)
      const result = await bulkUpdateStock([
        { id: med.id, stockChange: -200 }
      ]);
      
      expect(result.success).toBe(0);
      expect(result.failed).toBe(1);
      
      // 验证库存未变
      const updatedMed = await getMedicineById(med.id);
      expect(updatedMed?.stock).toBe(100);
    });
  });
  
  describe('searchMedicines', () => {
    it('应该按关键字搜索中药', async () => {
      // 创建一些带有特定关键字的测试中药
      await createMedicine({
        ...mockMedicine,
        chineseName: "搜索测试甘草",
        englishName: "Search Test Licorice",
        pinyinName: "sousuceshigancao",
        isActive: true
      });
      
      await createMedicine({
        ...mockMedicine,
        chineseName: "搜索测试当归",
        englishName: "Search Test Angelica",
        pinyinName: "sousuceshidanggui",
        isActive: true
      });
      
      // 搜索"搜索测试"
      const results = await searchMedicines("搜索测试");
      expect(results.length).toBeGreaterThanOrEqual(2);
      results.forEach(med => {
        expect(med.chineseName).toContain("搜索测试");
      });
      
      // 搜索英文
      const englishResults = await searchMedicines("Search Test");
      expect(englishResults.length).toBeGreaterThanOrEqual(2);
      
      // 搜索拼音
      const pinyinResults = await searchMedicines("sousushi");
      expect(pinyinResults.length).toBeGreaterThanOrEqual(2);
    });
    
    it('空查询应该返回空数组', async () => {
      const results = await searchMedicines("");
      expect(results).toEqual([]);
    });
    
    it('只返回活跃的中药', async () => {
      // 创建一个非活跃的中药
      await createMedicine({
        ...mockMedicine,
        chineseName: "非活跃中药",
        englishName: "Inactive Medicine",
        pinyinName: "feihuoyaozhongyao",
        isActive: false
      });
      
      const results = await searchMedicines("非活跃");
      expect(results.length).toBe(0);
    });
  });
}); 