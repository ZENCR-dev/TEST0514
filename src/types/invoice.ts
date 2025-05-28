export interface InvoiceItem {
  id: string;
  name: string; // 药品名称 (从 mock data 查找)
  quantity: number; // 数量
  retailPricePerGram: number; // 零售价/克
  costPricePerGram: number; // 成本价/克 (零售价的 60%)
  wholesalePricePerGram: number; // 批发价/克 (零售价的 75%)
  subtotalCost: number; // 基于成本价的小计
}

export interface InvoiceData {
  id: string; // 报价单ID，可以简单生成或关联到处方ID
  prescriptionId: string; // 关联的处方ID
  date: string; // 生成日期
  pharmacyName: string; // 药房名称 (待定数据来源)
  items: InvoiceItem[]; // 药材列表
  totalCost: number; // 总成本价 (所有药材小计之和 + 处方费)
  prescriptionFee: number; // 处方费
  // 可以根据需要添加其他字段，例如状态、备注等
} 