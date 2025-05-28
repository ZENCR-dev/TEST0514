import { generateInvoiceData } from '@/utils/invoiceGenerator';
import { PrescriptionQRItem } from '@/types/prescription';

// 模拟数据
const mockPrescriptionItems: PrescriptionQRItem[] = [
  {
    id: 'med_001',
    quantity: 10,
    name: '人参'
  },
  {
    id: 'med_002', 
    quantity: 5,
    name: '当归'
  }
];

describe('Invoice Generation', () => {
  describe('generateInvoiceData', () => {
    it('应该根据处方项目生成正确的报价单数据', () => {
      const invoiceData = generateInvoiceData(
        mockPrescriptionItems,
        15, // 处方费
        'test-prescription-123',
        '测试药房'
      );

      expect(invoiceData).toBeDefined();
      expect(invoiceData.prescriptionId).toBe('test-prescription-123');
      expect(invoiceData.pharmacyName).toBe('测试药房');
      expect(invoiceData.prescriptionFee).toBe(15);
      expect(invoiceData.items).toHaveLength(2);
      
      // 检查第一个药品（人参）
      const firstItem = invoiceData.items[0];
      expect(firstItem.id).toBe('med_001');
      expect(firstItem.name).toBe('人参');
      expect(firstItem.quantity).toBe(10);
      expect(firstItem.retailPricePerGram).toBe(15.0); // 人参的零售价
      expect(firstItem.costPricePerGram).toBe(9.0); // 60% of 15.0
      expect(firstItem.wholesalePricePerGram).toBe(11.25); // 75% of 15.0
      expect(firstItem.subtotalCost).toBe(90.0); // 10 * 9.0

      // 检查第二个药品（当归）
      const secondItem = invoiceData.items[1];
      expect(secondItem.id).toBe('med_002');
      expect(secondItem.name).toBe('当归');
      expect(secondItem.quantity).toBe(5);
      expect(secondItem.retailPricePerGram).toBe(3.5); // 当归的零售价
      expect(secondItem.costPricePerGram).toBe(2.1); // 60% of 3.5
      expect(secondItem.wholesalePricePerGram).toBe(2.625); // 75% of 3.5
      expect(secondItem.subtotalCost).toBe(10.5); // 5 * 2.1
      
      // 检查总计
      expect(invoiceData.totalCost).toBe(115.5); // 90.0 + 10.5 + 15 (处方费)
    });

    it('应该处理未找到的药品', () => {
      const itemsWithUnknown: PrescriptionQRItem[] = [
        {
          id: 'unknown_med',
          quantity: 3,
          name: '未知药品'
        }
      ];

      const invoiceData = generateInvoiceData(
        itemsWithUnknown,
        10,
        'test-unknown',
        '测试药房'
      );

      expect(invoiceData.items).toHaveLength(0); // 未找到的药品被跳过
      expect(invoiceData.totalCost).toBe(10); // 只有处方费
    });

    it('应该生成唯一的报价单ID', () => {
      const invoice1 = generateInvoiceData(mockPrescriptionItems, 15);
      const invoice2 = generateInvoiceData(mockPrescriptionItems, 15);
      
      expect(invoice1.id).not.toBe(invoice2.id);
      expect(invoice1.id).toMatch(/^invoice-\d+-\w{4}$/);
    });
  });
}); 