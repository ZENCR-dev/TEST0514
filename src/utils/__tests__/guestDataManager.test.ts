/**
 * guestDataManager TDD测试用例
 * MVP1.9 Guest模式数据管理器测试
 * 
 * 测试覆盖:
 * - CRUD操作：savePrescription, getPrescriptions, clearPrescriptions
 * - 数据隔离：内存存储，无localStorage依赖
 * - ID生成：唯一处方ID生成和验证
 * - 演示标识：isDemo标记验证
 * - 手动清空：clearAfterExport功能
 * - 边界条件：空数据、重复数据处理
 */

import { guestDataManager } from '../guestDataManager';

// Mock数据类型定义 (基于SOP文档规范)
interface MedicineItem {
  medicineId: string;
  pinyinName: string;
  englishName: string;
  chineseName: string;
  weight: number;
  unitPrice: number;
  unit: string;
}

interface LocalPrescription {
  id: string;
  medicines: MedicineItem[];
  instructions: string;
  dosage: number;
  totalAmount: number;
  createdAt: string;
  isDemo: true;
}

// 测试用例数据
const mockMedicine: MedicineItem = {
  medicineId: 'med_001',
  pinyinName: 'gaolishenpian',
  englishName: 'Panax Ginseng',
  chineseName: '高丽参片',
  weight: 10,
  unitPrice: 0.36956,
  unit: 'g'
};

const mockPrescriptionData = {
  medicines: [mockMedicine],
  instructions: '每日三次，饭后服用',
  dosage: 7,
  totalAmount: 25.87
};

describe('guestDataManager', () => {
  beforeEach(() => {
    // 每个测试前清空数据
    guestDataManager.clearPrescriptions();
  });

  describe('初始状态验证', () => {
    it('应该返回空的处方列表', () => {
      const prescriptions = guestDataManager.getPrescriptions();
      expect(prescriptions).toEqual([]);
      expect(prescriptions).toHaveLength(0);
    });

    it('应该是一个单例实例', () => {
      const manager1 = guestDataManager;
      const manager2 = guestDataManager;
      expect(manager1).toBe(manager2);
    });
  });

  describe('savePrescription 功能测试', () => {
    it('应该成功保存处方并返回完整的LocalPrescription对象', () => {
      const savedPrescription = guestDataManager.savePrescription(mockPrescriptionData);
      
      // 验证返回的处方结构
      expect(savedPrescription).toMatchObject({
        medicines: mockPrescriptionData.medicines,
        instructions: mockPrescriptionData.instructions,
        dosage: mockPrescriptionData.dosage,
        totalAmount: mockPrescriptionData.totalAmount,
        isDemo: true
      });
      
      // 验证自动生成的字段
      expect(savedPrescription.id).toBeDefined();
      expect(savedPrescription.id).toMatch(/^guest_\d+_[a-z0-9]+$/);
      expect(savedPrescription.createdAt).toBeDefined();
      expect(new Date(savedPrescription.createdAt)).toBeInstanceOf(Date);
    });

    it('应该生成唯一的处方ID', () => {
      const prescription1 = guestDataManager.savePrescription(mockPrescriptionData);
      const prescription2 = guestDataManager.savePrescription(mockPrescriptionData);
      
      expect(prescription1.id).not.toBe(prescription2.id);
      expect(prescription1.id).toMatch(/^guest_\d+_[a-z0-9]+$/);
      expect(prescription2.id).toMatch(/^guest_\d+_[a-z0-9]+$/);
    });

    it('应该正确设置createdAt时间戳', () => {
      const beforeSave = new Date().toISOString();
      const savedPrescription = guestDataManager.savePrescription(mockPrescriptionData);
      const afterSave = new Date().toISOString();
      
      expect(savedPrescription.createdAt).toBeGreaterThanOrEqual(beforeSave);
      expect(savedPrescription.createdAt).toBeLessThanOrEqual(afterSave);
    });

    it('应该正确标记为演示数据', () => {
      const savedPrescription = guestDataManager.savePrescription(mockPrescriptionData);
      
      expect(savedPrescription.isDemo).toBe(true);
    });

    it('应该支持保存多个处方', () => {
      const prescription1 = guestDataManager.savePrescription(mockPrescriptionData);
      const prescription2 = guestDataManager.savePrescription({
        ...mockPrescriptionData,
        dosage: 14,
        instructions: '每日两次，空腹服用'
      });
      
      const allPrescriptions = guestDataManager.getPrescriptions();
      expect(allPrescriptions).toHaveLength(2);
      expect(allPrescriptions[0]).toEqual(prescription1);
      expect(allPrescriptions[1]).toEqual(prescription2);
    });
  });

  describe('getPrescriptions 功能测试', () => {
    it('应该返回所有保存的处方', () => {
      const prescription1 = guestDataManager.savePrescription(mockPrescriptionData);
      const prescription2 = guestDataManager.savePrescription({
        ...mockPrescriptionData,
        dosage: 21
      });
      
      const allPrescriptions = guestDataManager.getPrescriptions();
      expect(allPrescriptions).toHaveLength(2);
      expect(allPrescriptions).toContain(prescription1);
      expect(allPrescriptions).toContain(prescription2);
    });

    it('空数据时应该返回空数组', () => {
      const prescriptions = guestDataManager.getPrescriptions();
      expect(prescriptions).toEqual([]);
      expect(Array.isArray(prescriptions)).toBe(true);
    });

    it('返回的数组应该是副本，不能直接修改原数据', () => {
      const savedPrescription = guestDataManager.savePrescription(mockPrescriptionData);
      const prescriptions = guestDataManager.getPrescriptions();
      
      // 尝试修改返回的数组
      prescriptions.pop();
      
      // 原数据应该不受影响
      const originalPrescriptions = guestDataManager.getPrescriptions();
      expect(originalPrescriptions).toHaveLength(1);
      expect(originalPrescriptions[0]).toEqual(savedPrescription);
    });
  });

  describe('clearPrescriptions 功能测试', () => {
    it('应该清空所有处方数据', () => {
      // 添加一些处方
      guestDataManager.savePrescription(mockPrescriptionData);
      guestDataManager.savePrescription(mockPrescriptionData);
      
      expect(guestDataManager.getPrescriptions()).toHaveLength(2);
      
      // 清空数据
      guestDataManager.clearPrescriptions();
      
      expect(guestDataManager.getPrescriptions()).toEqual([]);
      expect(guestDataManager.getPrescriptions()).toHaveLength(0);
    });

    it('对空数据调用clearPrescriptions应该正常工作', () => {
      expect(guestDataManager.getPrescriptions()).toHaveLength(0);
      
      // 不应该抛出错误
      expect(() => {
        guestDataManager.clearPrescriptions();
      }).not.toThrow();
      
      expect(guestDataManager.getPrescriptions()).toEqual([]);
    });
  });

  describe('clearAfterExport 功能测试', () => {
    it('应该清空处方数据并输出日志', () => {
      // Mock console.log
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // 添加处方数据
      guestDataManager.savePrescription(mockPrescriptionData);
      expect(guestDataManager.getPrescriptions()).toHaveLength(1);
      
      // 调用clearAfterExport
      guestDataManager.clearAfterExport();
      
      // 验证数据已清空
      expect(guestDataManager.getPrescriptions()).toEqual([]);
      
      // 验证日志输出
      expect(consoleSpy).toHaveBeenCalledWith('处方数据已清空');
      
      // 恢复console.log
      consoleSpy.mockRestore();
    });
  });

  describe('数据完整性测试', () => {
    it('应该正确处理包含多个药品的处方', () => {
      const multiMedicinePrescription = {
        medicines: [
          mockMedicine,
          {
            medicineId: 'med_002',
            pinyinName: 'dangshen',
            englishName: 'Codonopsis',
            chineseName: '党参',
            weight: 15,
            unitPrice: 0.28,
            unit: 'g'
          }
        ],
        instructions: '复方处方，遵医嘱',
        dosage: 10,
        totalAmount: 42.50
      };
      
      const savedPrescription = guestDataManager.savePrescription(multiMedicinePrescription);
      
      expect(savedPrescription.medicines).toHaveLength(2);
      expect(savedPrescription.medicines[0]).toEqual(mockMedicine);
      expect(savedPrescription.medicines[1].chineseName).toBe('党参');
    });

    it('应该正确处理空药品列表的处方', () => {
      const emptyMedicinePrescription = {
        medicines: [],
        instructions: '无药品处方',
        dosage: 0,
        totalAmount: 0
      };
      
      const savedPrescription = guestDataManager.savePrescription(emptyMedicinePrescription);
      
      expect(savedPrescription.medicines).toEqual([]);
      expect(savedPrescription.dosage).toBe(0);
      expect(savedPrescription.totalAmount).toBe(0);
      expect(savedPrescription.isDemo).toBe(true);
    });
  });

  describe('边界条件测试', () => {
    it('应该处理包含特殊字符的处方指导', () => {
      const specialCharsPrescription = {
        medicines: [mockMedicine],
        instructions: '每日3次，饭后30分钟服用。注意：避免与茶、咖啡同服！',
        dosage: 7,
        totalAmount: 25.87
      };
      
      const savedPrescription = guestDataManager.savePrescription(specialCharsPrescription);
      
      expect(savedPrescription.instructions).toBe(specialCharsPrescription.instructions);
    });

    it('应该处理极大的dosage值', () => {
      const largeDosagePrescription = {
        medicines: [mockMedicine],
        instructions: '长期处方',
        dosage: 365,
        totalAmount: 1342.04
      };
      
      const savedPrescription = guestDataManager.savePrescription(largeDosagePrescription);
      
      expect(savedPrescription.dosage).toBe(365);
      expect(savedPrescription.totalAmount).toBe(1342.04);
    });

    it('应该处理浮点数精度问题', () => {
      const precisionPrescription = {
        medicines: [mockMedicine],
        instructions: '精确剂量',
        dosage: 7,
        totalAmount: 0.1 + 0.2 // JavaScript浮点数精度问题
      };
      
      const savedPrescription = guestDataManager.savePrescription(precisionPrescription);
      
      expect(savedPrescription.totalAmount).toBeCloseTo(0.3, 10);
    });
  });

  describe('内存存储验证', () => {
    it('数据应该存储在内存中，不依赖localStorage', () => {
      // Mock localStorage to ensure it's not being used
      const localStorageSpy = jest.spyOn(Storage.prototype, 'setItem');
      
      guestDataManager.savePrescription(mockPrescriptionData);
      
      // 验证localStorage未被调用
      expect(localStorageSpy).not.toHaveBeenCalled();
      
      localStorageSpy.mockRestore();
    });

    it('数据应该在实例重新获取后保持一致', () => {
      const prescription = guestDataManager.savePrescription(mockPrescriptionData);
      
      // 重新获取实例（模拟单例行为）
      const sameInstance = guestDataManager;
      const retrievedPrescriptions = sameInstance.getPrescriptions();
      
      expect(retrievedPrescriptions).toHaveLength(1);
      expect(retrievedPrescriptions[0]).toEqual(prescription);
    });
  });

  describe('并发安全测试', () => {
    it('应该正确处理并发的savePrescription调用', async () => {
      const promises = Array.from({ length: 10 }, (_, index) =>
        Promise.resolve(guestDataManager.savePrescription({
          ...mockPrescriptionData,
          dosage: index + 1
        }))
      );
      
      const results = await Promise.all(promises);
      
      // 验证所有处方都已保存
      expect(guestDataManager.getPrescriptions()).toHaveLength(10);
      
      // 验证每个处方都有唯一ID
      const ids = results.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(10);
    });
  });
});