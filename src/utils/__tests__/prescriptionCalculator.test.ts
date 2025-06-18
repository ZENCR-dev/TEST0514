/**
 * 处方计算工具单元测试
 */

import {
  findMedicineById,
  findMedicineByName,
  calculateWholesaleAndCostPrices,
  toPharmacyMedicineInfo,
  calculatePrescription,
  formatPrice,
  calculateProfitMargin
} from '../prescriptionCalculator';
import { PrescriptionQRData } from '@/types/prescription';

describe('prescriptionCalculator', () => {
  
  describe('findMedicineById', () => {
    it('应该根据ID找到药品', () => {
      const medicine = findMedicineById('med_001');
      expect(medicine).toBeTruthy();
      expect(medicine?.id).toBe('med_001');
      expect(medicine?.chineseName).toBe('人参');
    });

    it('应该在ID不存在时返回null', () => {
      const medicine = findMedicineById('non_existent_id');
      expect(medicine).toBeNull();
    });
  });

  describe('findMedicineByName', () => {
    it('应该根据中文名找到药品', () => {
      const medicine = findMedicineByName('人参');
      expect(medicine).toBeTruthy();
      expect(medicine?.chineseName).toBe('人参');
    });

    it('应该根据英文名找到药品', () => {
      const medicine = findMedicineByName('Ginseng');
      expect(medicine).toBeTruthy();
      expect(medicine?.englishName).toBe('Ginseng');
    });

    it('应该根据拼音名找到药品', () => {
      const medicine = findMedicineByName('renshen');
      expect(medicine).toBeTruthy();
      expect(medicine?.pinyinName).toBe('renshen');
    });

    it('应该忽略大小写', () => {
      const medicine = findMedicineByName('GINSENG');
      expect(medicine).toBeTruthy();
      expect(medicine?.englishName).toBe('Ginseng');
    });

    it('应该在名称不存在时返回null', () => {
      const medicine = findMedicineByName('不存在的药品');
      expect(medicine).toBeNull();
    });
  });

  describe('calculateWholesaleAndCostPrices', () => {
    it('应该正确计算批发价和成本价', () => {
      const result = calculateWholesaleAndCostPrices(10.00);
      
      expect(result.wholesalePrice).toBe(7.50); // 75%
      expect(result.costPrice).toBe(5.50); // 55%
    });

    it('应该处理小数价格', () => {
      const result = calculateWholesaleAndCostPrices(15.33);
      
      expect(result.wholesalePrice).toBe(11.50); // 四舍五入到两位小数
      expect(result.costPrice).toBe(8.43);
    });

    it('应该处理零价格', () => {
      const result = calculateWholesaleAndCostPrices(0);
      
      expect(result.wholesalePrice).toBe(0);
      expect(result.costPrice).toBe(0);
    });
  });

  describe('toPharmacyMedicineInfo', () => {
    it('应该转换有效药品信息', () => {
      const medicine = findMedicineById('med_001');
      const result = toPharmacyMedicineInfo(medicine);
      
      expect(result.found).toBe(true);
      expect(result.id).toBe('med_001');
      expect(result.chineseName).toBe('人参');
      expect(result.wholesalePrice).toBeGreaterThan(0);
      expect(result.costPrice).toBeGreaterThan(0);
      expect(result.wholesalePrice).toBeLessThan(result.pricePerGram);
      expect(result.costPrice).toBeLessThan(result.wholesalePrice);
    });

    it('应该处理未找到的药品', () => {
      const result = toPharmacyMedicineInfo(null, false);
      
      expect(result.found).toBe(false);
      expect(result.id).toBe('');
      expect(result.chineseName).toBe('');
      expect(result.pricePerGram).toBe(0);
      expect(result.wholesalePrice).toBe(0);
      expect(result.costPrice).toBe(0);
    });
  });

  describe('calculatePrescription', () => {
    const validPrescriptionData: PrescriptionQRData = {
      prescriptionId: 'test_prescription_001',
      items: [
        { id: 'med_001', name: '人参', quantity: 15 },
        { id: 'med_002', name: '当归', quantity: 12 }
      ],
      copies: 7,
      instructions: '每日1剂，水煎服，早晚各1次，饭后温服'
    };

    it('应该正确计算有效处方', () => {
      const result = calculatePrescription(validPrescriptionData);
      
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.medicineDetails).toHaveLength(2);
      expect(result.copies).toBe(7);
      expect(result.instructions).toBe('每日1剂，水煎服，早晚各1次，饭后温服');
      
      // 检查价格计算
      expect(result.singleDoseRetailTotal).toBeGreaterThan(0);
      expect(result.singleDoseWholesaleTotal).toBeGreaterThan(0);
      expect(result.singleDoseCostTotal).toBeGreaterThan(0);
      
      // 检查总价计算
      expect(result.totalRetailPrice).toBe(result.singleDoseRetailTotal * 7);
      expect(result.totalWholesalePrice).toBe(result.singleDoseWholesaleTotal * 7);
      expect(result.totalCostPrice).toBe(result.singleDoseCostTotal * 7);
      
      // 检查价格关系
      expect(result.singleDoseWholesaleTotal).toBeLessThan(result.singleDoseRetailTotal);
      expect(result.singleDoseCostTotal).toBeLessThan(result.singleDoseWholesaleTotal);
    });

    it('应该处理包含未找到药品的处方', () => {
      const prescriptionWithMissingMedicine: PrescriptionQRData = {
        prescriptionId: 'test_prescription_002',
        items: [
          { id: 'med_001', name: '人参', quantity: 15 },
          { id: 'med_999', name: '不存在的药品', quantity: 10 }
        ],
        copies: 3,
        instructions: '测试处方'
      };

      const result = calculatePrescription(prescriptionWithMissingMedicine);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('未找到以下药品');
      expect(result.notFoundMedicines).toHaveLength(1);
      expect(result.notFoundMedicines[0]).toContain('不存在的药品');
      expect(result.medicineDetails).toHaveLength(2);
      
      // 第一个药品应该找到
      expect(result.medicineDetails[0].found).toBe(true);
      // 第二个药品应该未找到
      expect(result.medicineDetails[1].found).toBe(false);
    });

    it('应该通过名称查找药品（当ID不匹配时）', () => {
      const prescriptionWithNameMatch: PrescriptionQRData = {
        prescriptionId: 'test_prescription_003',
        items: [
          { id: 'wrong_id', name: '人参', quantity: 10 }
        ],
        copies: 1,
        instructions: '测试'
      };

      const result = calculatePrescription(prescriptionWithNameMatch);
      
      expect(result.success).toBe(true);
      expect(result.medicineDetails[0].found).toBe(true);
      expect(result.medicineDetails[0].chineseName).toBe('人参');
    });

    it('应该正确处理单个药品处方', () => {
      const singleMedicinePrescription: PrescriptionQRData = {
        prescriptionId: 'test_prescription_004',
        items: [
          { id: 'med_001', name: '人参', quantity: 20 }
        ],
        copies: 5,
        instructions: '单药处方测试'
      };

      const result = calculatePrescription(singleMedicinePrescription);
      
      expect(result.success).toBe(true);
      expect(result.medicineDetails).toHaveLength(1);
      expect(result.copies).toBe(5);
      
      // 验证价格计算
      const medicine = result.medicineDetails[0];
      const expectedSingleDoseRetail = 20 * medicine.pricePerGram;
      const expectedTotalRetail = expectedSingleDoseRetail * 5;
      
      expect(result.singleDoseRetailTotal).toBe(expectedSingleDoseRetail);
      expect(result.totalRetailPrice).toBe(expectedTotalRetail);
    });

    it('应该正确四舍五入价格', () => {
      // 使用会产生小数的药品和用量
      const prescriptionWithDecimals: PrescriptionQRData = {
        prescriptionId: 'test_prescription_005',
        items: [
          { id: 'med_001', name: '人参', quantity: 1.33 } // 可能产生小数价格
        ],
        copies: 1,
        instructions: '小数测试'
      };

      const result = calculatePrescription(prescriptionWithDecimals);
      
      expect(result.success).toBe(true);
      
      // 检查所有价格都是两位小数
      expect(Number.isInteger(result.singleDoseRetailTotal * 100)).toBe(true);
      expect(Number.isInteger(result.singleDoseWholesaleTotal * 100)).toBe(true);
      expect(Number.isInteger(result.singleDoseCostTotal * 100)).toBe(true);
    });
  });

  describe('formatPrice', () => {
    it('应该格式化价格为默认货币', () => {
      expect(formatPrice(10.5)).toBe('$10.50');
      expect(formatPrice(0)).toBe('$0.00');
      expect(formatPrice(123.456)).toBe('$123.46');
    });

    it('应该支持自定义货币符号', () => {
      expect(formatPrice(10.5, '¥')).toBe('¥10.50');
      expect(formatPrice(10.5, 'NZ$')).toBe('NZ$10.50');
    });
  });

  describe('calculateProfitMargin', () => {
    it('应该正确计算利润率', () => {
      expect(calculateProfitMargin(10, 5)).toBe(100); // 100%利润率
      expect(calculateProfitMargin(15, 10)).toBe(50); // 50%利润率
      expect(calculateProfitMargin(11, 10)).toBe(10); // 10%利润率
    });

    it('应该处理零成本价', () => {
      expect(calculateProfitMargin(10, 0)).toBe(0);
    });

    it('应该处理相等的零售价和成本价', () => {
      expect(calculateProfitMargin(10, 10)).toBe(0);
    });

    it('应该四舍五入到整数', () => {
      expect(calculateProfitMargin(10.5, 7.3)).toBe(44); // 43.84% -> 44%
    });
  });

  describe('集成测试', () => {
    it('应该完整处理真实的处方计算流程', () => {
      // 使用真实的药品数据创建处方
      const realPrescription: PrescriptionQRData = {
        prescriptionId: 'test_prescription_006',
        items: [
          { id: 'med_001', name: '人参', quantity: 15 },
          { id: 'med_002', name: '当归', quantity: 12 },
          { id: 'med_003', name: '黄芪', quantity: 20 }
        ],
        copies: 7,
        instructions: '每日1剂，水煎服，早晚各1次，饭后温服'
      };

      const result = calculatePrescription(realPrescription);
      
      // 验证基本成功
      expect(result.success).toBe(true);
      expect(result.medicineDetails).toHaveLength(3);
      expect(result.notFoundMedicines).toHaveLength(0);
      
      // 验证所有药品都被找到
      result.medicineDetails.forEach(medicine => {
        expect(medicine.found).toBe(true);
        expect(medicine.pricePerGram).toBeGreaterThan(0);
        expect(medicine.wholesalePrice).toBeGreaterThan(0);
        expect(medicine.costPrice).toBeGreaterThan(0);
      });
      
      // 验证价格关系
      expect(result.totalWholesalePrice).toBeLessThan(result.totalRetailPrice);
      expect(result.totalCostPrice).toBeLessThan(result.totalWholesalePrice);
      
      // 验证帖数计算
      expect(result.totalRetailPrice).toBe(result.singleDoseRetailTotal * 7);
      
      // 验证格式化价格
      const formattedRetail = formatPrice(result.totalRetailPrice, 'NZ$');
      const formattedWholesale = formatPrice(result.totalWholesalePrice, 'NZ$');
      
      expect(formattedRetail).toMatch(/^NZ\$\d+\.\d{2}$/);
      expect(formattedWholesale).toMatch(/^NZ\$\d+\.\d{2}$/);
    });
  });
}); 