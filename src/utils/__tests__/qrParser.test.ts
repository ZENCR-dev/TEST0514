/**
 * QR码解析工具单元测试
 */

import { 
  parseQrText, 
  isPossiblePrescriptionQR, 
  createSamplePrescriptionQR, 
  prescriptionDataToQRString 
} from '../qrParser';
import { PrescriptionQRData } from '@/types/prescription';

describe('qrParser', () => {
  
  // 测试用的有效处方数据
  const validPrescriptionData: PrescriptionQRData = {
    prescriptionId: 'test_prescription_qr_001',
    items: [
      { id: 'med_001', name: '人参', quantity: 15 },
      { id: 'med_002', name: '当归', quantity: 12 }
    ],
    copies: 7,
    instructions: '每日1剂，水煎服，早晚各1次，饭后温服'
  };

  const validQRString = JSON.stringify(validPrescriptionData);

  describe('parseQrText', () => {
    describe('成功案例', () => {
      it('应该正确解析有效的QR码内容', () => {
        const result = parseQrText(validQRString);
        
        expect(result.success).toBe(true);
        expect(result.data).toEqual(validPrescriptionData);
        expect(result.error).toBeUndefined();
      });

      it('应该处理包含空格的QR码内容', () => {
        const qrWithSpaces = `  ${validQRString}  `;
        const result = parseQrText(qrWithSpaces);
        
        expect(result.success).toBe(true);
        expect(result.data).toEqual(validPrescriptionData);
      });

      it('应该处理单个药品的处方', () => {
        const singleItemData = {
          items: [{ id: 'med_001', name: '人参', quantity: 10 }],
          copies: 3,
          instructions: '每日1剂'
        };
        const qrString = JSON.stringify(singleItemData);
        const result = parseQrText(qrString);
        
        expect(result.success).toBe(true);
        expect(result.data).toEqual(singleItemData);
      });

      it('应该处理小数用量', () => {
        const decimalData = {
          items: [{ id: 'med_001', name: '人参', quantity: 0.5 }],
          copies: 1,
          instructions: '测试'
        };
        const qrString = JSON.stringify(decimalData);
        const result = parseQrText(qrString);
        
        expect(result.success).toBe(true);
        expect(result.data?.items[0].quantity).toBe(0.5);
      });
    });

    describe('失败案例 - 输入验证', () => {
      it('应该拒绝空字符串', () => {
        const result = parseQrText('');
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_FORMAT');
        expect(result.error).toContain('为空');
      });

      it('应该拒绝null输入', () => {
        const result = parseQrText(null as any);
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_FORMAT');
        expect(result.error).toContain('无效');
      });

      it('应该拒绝undefined输入', () => {
        const result = parseQrText(undefined as any);
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_FORMAT');
      });

      it('应该拒绝只有空格的字符串', () => {
        const result = parseQrText('   ');
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_FORMAT');
      });
    });

    describe('失败案例 - JSON格式错误', () => {
      it('应该拒绝无效的JSON', () => {
        const result = parseQrText('这不是JSON');
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_JSON');
        expect(result.error).toContain('JSON');
      });

      it('应该拒绝截断的JSON', () => {
        const truncatedJson = validQRString.slice(0, -10);
        const result = parseQrText(truncatedJson);
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_JSON');
      });

      it('应该拒绝格式错误的JSON', () => {
        const malformedJson = validQRString.replace(',', '');
        const result = parseQrText(malformedJson);
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_JSON');
      });
    });

    describe('失败案例 - 数据格式错误', () => {
      it('应该拒绝缺少items字段', () => {
        const invalidData = { copies: 7, instructions: '测试' };
        const result = parseQrText(JSON.stringify(invalidData));
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_FORMAT');
      });

      it('应该拒绝空的items数组', () => {
        const invalidData = { items: [], copies: 7, instructions: '测试' };
        const result = parseQrText(JSON.stringify(invalidData));
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_FORMAT');
        expect(result.error).toContain('至少一个药品');
      });

      it('应该拒绝负数用量', () => {
        const invalidData = {
          items: [{ id: 'med_001', name: '人参', quantity: -5 }],
          copies: 7,
          instructions: '测试'
        };
        const result = parseQrText(JSON.stringify(invalidData));
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_FORMAT');
        expect(result.error).toContain('大于0');
      });

      it('应该拒绝零用量', () => {
        const invalidData = {
          items: [{ id: 'med_001', name: '人参', quantity: 0 }],
          copies: 7,
          instructions: '测试'
        };
        const result = parseQrText(JSON.stringify(invalidData));
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_FORMAT');
      });

      it('应该拒绝负数帖数', () => {
        const invalidData = {
          items: [{ id: 'med_001', name: '人参', quantity: 10 }],
          copies: -1,
          instructions: '测试'
        };
        const result = parseQrText(JSON.stringify(invalidData));
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_FORMAT');
      });

      it('应该拒绝小数帖数', () => {
        const invalidData = {
          items: [{ id: 'med_001', name: '人参', quantity: 10 }],
          copies: 1.5,
          instructions: '测试'
        };
        const result = parseQrText(JSON.stringify(invalidData));
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_FORMAT');
      });

      it('应该拒绝空的药品ID', () => {
        const invalidData = {
          items: [{ id: '', name: '人参', quantity: 10 }],
          copies: 1,
          instructions: '测试'
        };
        const result = parseQrText(JSON.stringify(invalidData));
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_FORMAT');
      });

      it('应该拒绝空的药品名称', () => {
        const invalidData = {
          items: [{ id: 'med_001', name: '', quantity: 10 }],
          copies: 1,
          instructions: '测试'
        };
        const result = parseQrText(JSON.stringify(invalidData));
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_FORMAT');
      });

      it('应该拒绝空的用法说明', () => {
        const invalidData = {
          items: [{ id: 'med_001', name: '人参', quantity: 10 }],
          copies: 1,
          instructions: ''
        };
        const result = parseQrText(JSON.stringify(invalidData));
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_FORMAT');
      });
    });

    describe('失败案例 - 业务规则验证', () => {
      it('应该拒绝过多的帖数', () => {
        const invalidData = {
          items: [{ id: 'med_001', name: '人参', quantity: 10 }],
          copies: 31,
          instructions: '测试'
        };
        const result = parseQrText(JSON.stringify(invalidData));
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_DATA');
        expect(result.error).toContain('30帖');
      });

      it('应该拒绝过大的用量', () => {
        const invalidData = {
          items: [{ id: 'med_001', name: '人参', quantity: 1001 }],
          copies: 1,
          instructions: '测试'
        };
        const result = parseQrText(JSON.stringify(invalidData));
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_DATA');
        expect(result.error).toContain('1000克');
      });

      it('应该拒绝过小的用量', () => {
        const invalidData = {
          items: [{ id: 'med_001', name: '人参', quantity: 0.05 }],
          copies: 1,
          instructions: '测试'
        };
        const result = parseQrText(JSON.stringify(invalidData));
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_DATA');
        expect(result.error).toContain('0.1克');
      });

      it('应该拒绝过多的药品种类', () => {
        const tooManyItems = Array.from({ length: 51 }, (_, i) => ({
          id: `med_${String(i + 1).padStart(3, '0')}`,
          name: `药品${i + 1}`,
          quantity: 10
        }));
        const invalidData = {
          items: tooManyItems,
          copies: 1,
          instructions: '测试'
        };
        const result = parseQrText(JSON.stringify(invalidData));
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_DATA');
        expect(result.error).toContain('50种');
      });

      it('应该拒绝过长的用法说明', () => {
        const longInstructions = 'A'.repeat(501);
        const invalidData = {
          items: [{ id: 'med_001', name: '人参', quantity: 10 }],
          copies: 1,
          instructions: longInstructions
        };
        const result = parseQrText(JSON.stringify(invalidData));
        
        expect(result.success).toBe(false);
        expect(result.errorType).toBe('INVALID_DATA');
        expect(result.error).toContain('500字符');
      });
    });
  });

  describe('isPossiblePrescriptionQR', () => {
    it('应该识别有效的处方QR码', () => {
      expect(isPossiblePrescriptionQR(validQRString)).toBe(true);
    });

    it('应该拒绝空字符串', () => {
      expect(isPossiblePrescriptionQR('')).toBe(false);
    });

    it('应该拒绝null输入', () => {
      expect(isPossiblePrescriptionQR(null as any)).toBe(false);
    });

    it('应该拒绝非JSON格式', () => {
      expect(isPossiblePrescriptionQR('这不是JSON')).toBe(false);
    });

    it('应该拒绝缺少关键字段的JSON', () => {
      const incompleteJson = '{"name":"test"}';
      expect(isPossiblePrescriptionQR(incompleteJson)).toBe(false);
    });

    it('应该识别包含所有关键字段的JSON', () => {
      const validJson = '{"items":[],"copies":1,"instructions":"test"}';
      expect(isPossiblePrescriptionQR(validJson)).toBe(true);
    });
  });

  describe('createSamplePrescriptionQR', () => {
    it('应该创建有效的示例数据', () => {
      const sample = createSamplePrescriptionQR();
      const qrString = prescriptionDataToQRString(sample);
      const parseResult = parseQrText(qrString);
      
      expect(parseResult.success).toBe(true);
      expect(parseResult.data).toEqual(sample);
    });

    it('应该创建包含多个药品的示例', () => {
      const sample = createSamplePrescriptionQR();
      
      expect(Array.isArray(sample.items)).toBe(true);
      expect(sample.items.length).toBeGreaterThan(1);
      expect(sample.copies).toBeGreaterThan(0);
      expect(sample.instructions.length).toBeGreaterThan(0);
    });
  });

  describe('prescriptionDataToQRString', () => {
    it('应该正确序列化处方数据', () => {
      const qrString = prescriptionDataToQRString(validPrescriptionData);
      const parsed = JSON.parse(qrString);
      
      expect(parsed).toEqual(validPrescriptionData);
    });

    it('应该创建可以往返转换的字符串', () => {
      const originalData = createSamplePrescriptionQR();
      const qrString = prescriptionDataToQRString(originalData);
      const parseResult = parseQrText(qrString);
      
      expect(parseResult.success).toBe(true);
      expect(parseResult.data).toEqual(originalData);
    });
  });

  describe('边界情况和压力测试', () => {
    it('应该处理最大允许的帖数', () => {
      const maxCopiesData = {
        items: [{ id: 'med_001', name: '人参', quantity: 10 }],
        copies: 30,
        instructions: '测试'
      };
      const result = parseQrText(JSON.stringify(maxCopiesData));
      
      expect(result.success).toBe(true);
    });

    it('应该处理最大允许的用量', () => {
      const maxQuantityData = {
        items: [{ id: 'med_001', name: '人参', quantity: 1000 }],
        copies: 1,
        instructions: '测试'
      };
      const result = parseQrText(JSON.stringify(maxQuantityData));
      
      expect(result.success).toBe(true);
    });

    it('应该处理最小允许的用量', () => {
      const minQuantityData = {
        items: [{ id: 'med_001', name: '人参', quantity: 0.1 }],
        copies: 1,
        instructions: '测试'
      };
      const result = parseQrText(JSON.stringify(minQuantityData));
      
      expect(result.success).toBe(true);
    });

    it('应该处理最大允许的药品种类数', () => {
      const maxItems = Array.from({ length: 50 }, (_, i) => ({
        id: `med_${String(i + 1).padStart(3, '0')}`,
        name: `药品${i + 1}`,
        quantity: 10
      }));
      const maxItemsData = {
        items: maxItems,
        copies: 1,
        instructions: '测试'
      };
      const result = parseQrText(JSON.stringify(maxItemsData));
      
      expect(result.success).toBe(true);
    });

    it('应该处理最大允许的用法说明长度', () => {
      const maxInstructionsData = {
        items: [{ id: 'med_001', name: '人参', quantity: 10 }],
        copies: 1,
        instructions: 'A'.repeat(500)
      };
      const result = parseQrText(JSON.stringify(maxInstructionsData));
      
      expect(result.success).toBe(true);
    });

    it('应该处理包含中文字符的复杂数据', () => {
      const chineseData = {
        items: [
          { id: 'med_001', name: '人参（东北）', quantity: 15.5 },
          { id: 'med_002', name: '当归（甘肃岷县）', quantity: 12.8 }
        ],
        copies: 7,
        instructions: '每日1剂，水煎服，早晚各1次，饭后温服。注意：孕妇慎用，忌食辛辣。'
      };
      const result = parseQrText(JSON.stringify(chineseData));
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(chineseData);
    });
  });
}); 