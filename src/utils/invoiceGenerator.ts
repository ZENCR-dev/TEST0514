import { PrescriptionQRItem } from "@/types/prescription";
import { InvoiceData, InvoiceItem } from "@/types/invoice";
import { mockMedicines } from "@/mocks/medicineData"; 

// 查找药品信息
function findMedicineById(id: string) {
  return mockMedicines.find(medicine => medicine.id === id);
}

// 生成报价单数据
export function generateInvoiceData(
  prescriptionItems: PrescriptionQRItem[],
  prescriptionFee: number,
  prescriptionId: string = "", // 可选：如果可以关联到处方ID
  pharmacyName: string = "未知药房" // 待定：药房名称来源
): InvoiceData {
  const invoiceItems: InvoiceItem[] = [];
  let totalCost = 0;

  for (const pItem of prescriptionItems) {
    const medicine = findMedicineById(pItem.id);

    if (!medicine) {
      console.warn(`Warning: Medicine with ID ${pItem.id} not found in mock data.`);
      // 可以选择跳过，或者添加一个标记为"未找到"的条目
      continue; 
    }

    const retailPricePerGram = medicine.pricePerGram;
    const costPricePerGram = retailPricePerGram * 0.6; // 成本价 60%
    const wholesalePricePerGram = retailPricePerGram * 0.75; // 批发价 75%
    const subtotalCost = costPricePerGram * pItem.quantity;

    invoiceItems.push({
      id: pItem.id,
      name: medicine.chineseName || medicine.englishName || "未知药品", // 使用中文或英文名
      quantity: pItem.quantity,
      retailPricePerGram,
      costPricePerGram,
      wholesalePricePerGram,
      subtotalCost,
    });

    totalCost += subtotalCost;
  }

  totalCost += prescriptionFee; // 加上处方费

  return {
    id: `invoice-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, // 简单生成ID
    prescriptionId: prescriptionId, 
    date: new Date().toLocaleDateString(),
    pharmacyName: pharmacyName, 
    items: invoiceItems,
    totalCost,
    prescriptionFee,
  };
} 