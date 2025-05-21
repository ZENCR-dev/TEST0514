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
import { Medicine, MedicineCreateData } from '@/types/medicine';
import { initialMedicines } from '@/mocks/medicineData';

// 模拟数据
const mockMedicine: MedicineCreateData = {
  chineseName: "测试中药",
  englishName: "Test Medicine",
  pinyinName: "ceshizhongyao",
  pricePerGram: 5.0,
  stock: 1000,
  description: "这是一个测试用的中药",
  properties: "温",
  category: "测试",
  isActive: true,
  imageUrl: "/images/medicines/test.jpg"
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
  
  describe('getAllMedicines', () => {
    it('应该返回所有中药列表', async () => {
      const result = await getAllMedicines();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.total).toBeGreaterThan(0);
    });
    
    it('应该根据查询参数过滤结果', async () => {
      const result = await getAllMedicines({ query: '人参' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].chineseName).toContain('人参');
    });
    
    it('应该根据分类过滤结果', async () => {
      const result = await getAllMedicines({ category: '补气' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].category).toBe('补气');
    });
    
    it('应该根据药性过滤结果', async () => {
      const result = await getAllMedicines({ property: '温' });
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].properties).toContain('温');
    });
    
    it('应该根据价格范围过滤结果', async () => {
      const result = await getAllMedicines({ minPrice: 10, maxPrice: 20 });
      result.data.forEach(med => {
        expect(med.pricePerGram).toBeGreaterThanOrEqual(10);
        expect(med.pricePerGram).toBeLessThanOrEqual(20);
      });
    });
    
    it('应该按指定字段排序结果', async () => {
      // 按价格升序
      const result1 = await getAllMedicines({ sortBy: 'pricePerGram', order: 'asc' });
      for (let i = 1; i < result1.data.length; i++) {
        expect(result1.data[i-1].pricePerGram).toBeLessThanOrEqual(result1.data[i].pricePerGram);
      }
      
      // 按价格降序
      const result2 = await getAllMedicines({ sortBy: 'pricePerGram', order: 'desc' });
      for (let i = 1; i < result2.data.length; i++) {
        expect(result2.data[i-1].pricePerGram).toBeGreaterThanOrEqual(result2.data[i].pricePerGram);
      }
    });
    
    it('应该正确分页结果', async () => {
      const pageSize = 5;
      const result = await getAllMedicines({ limit: pageSize, page: 1 });
      expect(result.data.length).toBeLessThanOrEqual(pageSize);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(pageSize);
    });
  });
  
  describe('getMedicineById', () => {
    it('应该根据ID返回正确的中药', async () => {
      const id = "med_001";
      const medicine = await getMedicineById(id);
      expect(medicine).toBeDefined();
      expect(medicine?.id).toBe(id);
    });
    
    it('当ID不存在时应该返回null', async () => {
      const medicine = await getMedicineById("non_existent_id");
      expect(medicine).toBeNull();
    });
  });
  
  describe('createMedicine', () => {
    it('应该正确创建新的中药', async () => {
      const newMedicine = await createMedicine({
        ...mockMedicine,
        chineseName: "新测试中药",
        pinyinName: "xinceshizhongyao"
      });
      
      expect(newMedicine).toBeDefined();
      expect(newMedicine.id).toContain('med_');
      expect(newMedicine.chineseName).toBe("新测试中药");
      expect(newMedicine.pinyinName).toBe("xinceshizhongyao");
      expect(newMedicine.createdAt).toBeDefined();
      expect(newMedicine.updatedAt).toBeDefined();
    });
    
    it('创建已存在的中药名称应该抛出错误', async () => {
      await expect(createMedicine({
        ...mockMedicine,
        chineseName: "人参", // 已存在的中药名
        pinyinName: "unique_pinyin"
      })).rejects.toThrow(/中药名称.*已存在/);
    });
    
    it('创建已存在的拼音名称应该抛出错误', async () => {
      await expect(createMedicine({
        ...mockMedicine,
        chineseName: "独特中药",
        pinyinName: "renshen" // 已存在的拼音名
      })).rejects.toThrow(/拼音名称.*已存在/);
    });
  });
  
  describe('updateMedicine', () => {
    it('应该正确更新中药信息', async () => {
      const id = "med_001";
      const updatedPrice = 20.0;
      const updatedMedicine = await updateMedicine(id, { pricePerGram: updatedPrice });
      
      expect(updatedMedicine).toBeDefined();
      expect(updatedMedicine.id).toBe(id);
      expect(updatedMedicine.pricePerGram).toBe(updatedPrice);
      expect(updatedMedicine.updatedAt).not.toBe(updatedMedicine.createdAt);
    });
    
    it('更新不存在的中药ID应该抛出错误', async () => {
      await expect(updateMedicine("non_existent_id", { pricePerGram: 10 }))
        .rejects.toThrow(/中药ID.*不存在/);
    });
    
    it('更新为已存在的中药名称应该抛出错误', async () => {
      // 先创建一个新的中药
      const newMed = await createMedicine({
        ...mockMedicine,
        chineseName: "独特中药A",
        pinyinName: "dutazhongyaoa"
      });
      
      // 尝试更新为已存在的名称
      await expect(updateMedicine(newMed.id, { chineseName: "人参" }))
        .rejects.toThrow(/中药名称.*已存在/);
    });
  });
  
  describe('deleteMedicine', () => {
    it('应该正确删除中药', async () => {
      // 先创建一个新的中药
      const newMed = await createMedicine({
        ...mockMedicine,
        chineseName: "待删除中药",
        pinyinName: "daishanchuzhongyao"
      });
      
      // 删除该中药
      const result = await deleteMedicine(newMed.id);
      expect(result).toBe(true);
      
      // 确认无法再次获取
      const medicine = await getMedicineById(newMed.id);
      expect(medicine).toBeNull();
    });
    
    it('删除不存在的中药ID应该返回false', async () => {
      const result = await deleteMedicine("non_existent_id");
      expect(result).toBe(false);
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