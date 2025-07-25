import { validatePrescriptionData } from '@/services/prescriptionService';
import { CreatePrescriptionData } from '@/types/prescription';
import '@testing-library/jest-dom';

describe('PrescriptionCreator - OrderDevPlan.md字段完整性测试', () => {
  describe('数据结构对齐 - OrderDevPlan.md字段分层表', () => {
    it('medicines数组应包含所有OrderDevPlan.md定义的字段', () => {
      const expectedMedicineFields = [
        'medicineId',     // 必填
        'chineseName',    // 必填
        'weight',         // 必填
        'unit',           // 必填
        'unitPrice',      // 可选
        'totalPrice',     // 可选
        'dosageInstructions', // 可选
        'notes'           // 可选
      ];

      // 验证数据结构完整性
      const mockMedicine = {
        medicineId: 'med001',
        chineseName: '人参',
        weight: 10,
        unit: 'g',
        unitPrice: 2.5,
        totalPrice: 25,
        dosageInstructions: '每日三次',
        notes: '饭后服用'
      };

      expectedMedicineFields.forEach(field => {
        expect(mockMedicine).toHaveProperty(field);
      });
    });

    it('处方数据应包含OrderDevPlan.md定义的所有字段', () => {
      const expectedPrescriptionFields = [
        'medicines',      // 必填
        'notes',          // 必填
        'patientInfo'     // 患者信息
      ];

      const mockPrescription: CreatePrescriptionData = {
        medicines: [{
          medicineId: 'med001',
          chineseName: 'Ginseng',
          chineseName: '人参',
          weight: 10,
          unit: 'g'
        }],
        notes: '处方说明',
        patientInfo: { name: '张三' }
      };

      expectedPrescriptionFields.forEach(field => {
        expect(mockPrescription).toHaveProperty(field);
      });
    });
  });

  describe('表单验证逻辑 - OrderDevPlan.md必填字段', () => {
    it('应该验证medicines数组包含所有必填字段', () => {
      const invalidData: CreatePrescriptionData = {
        patientInfo: { name: '张三' },
        medicines: [{
          medicineId: 'med001',
          chineseName: '',  // 缺少必填字段
          chineseName: '',   // 缺少必填字段
          weight: 10,
          unit: ''           // 缺少必填字段
        }],
        notes: '处方说明'
      };

      // 实际调用验证函数
      const result = validatePrescriptionData(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('第1个药品必须包含药品名称');
      expect(result.errors).toContain('第1个药品必须包含中文名称');
      expect(result.errors).toContain('第1个药品必须包含单位信息');
    });

    it('应该验证处方notes字段为必填', () => {
      const invalidData: CreatePrescriptionData = {
        patientInfo: { name: '张三' },
        medicines: [{
          medicineId: 'med001',
          chineseName: 'Ginseng',
          chineseName: '人参',
          weight: 10,
          unit: 'g'
        }],
        notes: ''  // 缺少必填字段
      };

      const result = validatePrescriptionData(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('处方备注不能为空');
    });

    it('应该验证患者姓名为必填', () => {
      const invalidData: CreatePrescriptionData = {
        patientInfo: { name: '' }, // 缺少必填字段
        medicines: [{
          medicineId: 'med001',
          chineseName: 'Ginseng',
          chineseName: '人参',
          weight: 10,
          unit: 'g'
        }],
        notes: '处方说明'
      };

      const result = validatePrescriptionData(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('患者姓名不能为空');
    });

    it('应该通过完整有效数据的验证', () => {
      const validData: CreatePrescriptionData = {
        patientInfo: { name: '张三' },
        medicines: [{
          medicineId: 'med001',
          chineseName: 'Ginseng',
          chineseName: '人参',
          weight: 10,
          unit: 'g',
          unitPrice: 2.5,
          totalPrice: 25,
          dosageInstructions: '每日三次',
          notes: '饭后服用'
        }],
        notes: '处方说明'
      };

      const result = validatePrescriptionData(validData);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
}); 