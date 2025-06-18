/**
 * 药品 Mock 数据
 * 基于后端团队确认的 Supabase Medicine 表结构规范
 * 
 * @version 2.0
 * @date 2025-01-21
 * @description 完全匹配后端 Supabase medicines 表结构
 */

import { Medicine, validateMedicineData } from '../types/medicine';

/**
 * Mock 药品数据
 * 所有数据都通过 validateMedicineData 验证
 */
export const mockMedicines: Medicine[] = [
  {
    id: 'clr1a2b3c4d5e6f7g8h9i0j1',
    name: '当归',
    chineseName: '当归',
    englishName: 'Angelica Sinensis',
    pinyinName: 'danggui',
    sku: 'DG',
    description: '补血活血，调经止痛，润燥滑肠。用于血虚萎黄，眩晕心悸，月经不调，经闭痛经。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 12.5,
    metadata: {
      origin: '甘肃岷县',
      grade: 'A',
      storage: '密封，置阴凉干燥处'
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'clr2b3c4d5e6f7g8h9i0j1k2',
    name: '川芎',
    chineseName: '川芎',
    englishName: 'Chuanxiong Rhizome',
    pinyinName: 'chuanxiong',
    sku: 'CX',
    description: '活血行气，祛风止痛。用于胸痹心痛，胸胁刺痛，跌扑肿痛，月经不调。',
    category: '活血药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 8.0,
    metadata: {
      origin: '四川都江堰',
      grade: 'A',
      storage: '密封，置阴凉干燥处'
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'clr3c4d5e6f7g8h9i0j1k2l3',
    name: '熟地黄',
    chineseName: '熟地黄',
    englishName: 'Prepared Rehmannia Root',
    pinyinName: 'shudihuang',
    sku: 'SDH',
    description: '滋阴补血，益精填髓。用于血虚萎黄，心悸怔忡，月经不调，崩漏下血。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 15.0,
    metadata: {
      origin: '河南焦作',
      grade: 'AAA',
      storage: '密封，置阴凉干燥处'
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'clr4d5e6f7g8h9i0j1k2l3m4',
    name: '白芍',
    chineseName: '白芍',
    englishName: 'White Peony Root',
    pinyinName: 'baishao',
    sku: 'BS',
    description: '养血柔肝，缓中止痛，敛阴收汗。用于血虚萎黄，月经不调，自汗。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 10.0,
    metadata: {
      origin: '浙江磐安',
      grade: 'A',
      storage: '密封，置阴凉干燥处'
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'clr5e6f7g8h9i0j1k2l3m4n5',
    name: '人参',
    chineseName: '人参',
    englishName: 'Ginseng',
    pinyinName: 'renshen',
    sku: 'RS',
    description: '大补元气，复脉固脱，补脾益肺，生津止渴，安神益智。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: true,
    basePrice: 180.0,
    metadata: {
      origin: '吉林长白山',
      grade: 'AAA',
      storage: '密封，置阴凉干燥处',
      warning: '孕妇慎用'
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'clr6f7g8h9i0j1k2l3m4n5o6',
    name: '党参',
    chineseName: '党参',
    englishName: 'Codonopsis Root',
    pinyinName: 'dangshen',
    sku: 'DS',
    description: '补中益气，健脾益肺。用于脾肺虚弱，气短心悸，食少便溏。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 25.0,
    metadata: {
      origin: '甘肃文县',
      grade: 'A',
      storage: '密封，置阴凉干燥处'
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'clr7g8h9i0j1k2l3m4n5o6p7',
    name: '西洋参',
    chineseName: '西洋参',
    englishName: 'American Ginseng',
    pinyinName: 'xiyangshen',
    sku: 'XYS',
    description: '补气养阴，清热生津。用于气虚阴亏，内热，咳喘痰血。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 120.0,
    metadata: {
      origin: '加拿大进口',
      grade: 'AAA',
      storage: '密封，置阴凉干燥处'
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'clr8h9i0j1k2l3m4n5o6p7q8',
    name: '甘草',
    chineseName: '甘草',
    englishName: 'Licorice Root',
    pinyinName: 'gancao',
    sku: 'GC',
    description: '补脾益气，清热解毒，祛痰止咳，缓急止痛，调和诸药。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 6.0,
    metadata: {
      origin: '新疆',
      grade: 'A',
      storage: '密封，置阴凉干燥处'
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'clr9i0j1k2l3m4n5o6p7q8r9',
    name: '白术',
    chineseName: '白术',
    englishName: 'White Atractylodes Rhizome',
    pinyinName: 'baizhu',
    sku: 'BZ',
    description: '补气健脾，燥湿利水，止汗，安胎。用于脾虚食少，腹胀泄泻。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 18.0,
    metadata: {
      origin: '浙江新昌',
      grade: 'A',
      storage: '密封，置阴凉干燥处'
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'clra0j1k2l3m4n5o6p7q8r9s0',
    name: '茯苓',
    chineseName: '茯苓',
    englishName: 'Poria',
    pinyinName: 'fuling',
    sku: 'FL',
    description: '利水渗湿，健脾，宁心。用于水肿尿少，痰饮眩悸，脾虚食少。',
    category: '理气药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 14.0,
    metadata: {
      origin: '云南',
      grade: 'A',
      storage: '密封，置阴凉干燥处'
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'clrb1k2l3m4n5o6p7q8r9s0t1',
    name: '山药',
    chineseName: '山药',
    englishName: 'Chinese Yam',
    pinyinName: 'shanyao',
    sku: 'SY',
    description: '补脾养胃，生津益肺，补肾涩精。用于脾虚食少，久泻不止。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 8.5,
    metadata: {
      origin: '河南焦作',
      grade: 'A',
      storage: '密封，置阴凉干燥处'
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'clrc2l3m4n5o6p7q8r9s0t1u2',
    name: '陈皮',
    chineseName: '陈皮',
    englishName: 'Tangerine Peel',
    pinyinName: 'chenpi',
    sku: 'CP',
    description: '理气健脾，燥湿化痰。用于胸脘胀满，食少吐泻，咳嗽痰多。',
    category: '理气药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 12.0,
    metadata: {
      origin: '广东新会',
      grade: 'AAA',
      storage: '密封，置阴凉干燥处'
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'clrd3m4n5o6p7q8r9s0t1u2v3',
    name: '半夏',
    chineseName: '半夏',
    englishName: 'Pinellia Rhizome',
    pinyinName: 'banxia',
    sku: 'BX',
    description: '燥湿化痰，降逆止呕，消痞散结。用于湿痰寒痰，呕吐反胃。',
    category: '化痰药',
    unit: 'g',
    requiresPrescription: true,
    basePrice: 22.0,
    metadata: {
      origin: '甘肃',
      grade: 'A',
      storage: '密封，置阴凉干燥处',
      warning: '有毒，需医师指导使用'
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'clre4n5o6p7q8r9s0t1u2v3w4',
    name: '黄连',
    chineseName: '黄连',
    englishName: 'Coptis Root',
    pinyinName: 'huanglian',
    sku: 'HL',
    description: '清热燥湿，泻火解毒。用于湿热痞满，呕吐吞酸，泻痢。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 45.0,
    metadata: {
      origin: '四川峨眉山',
      grade: 'AAA',
      storage: '密封，置阴凉干燥处'
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'clrf5o6p7q8r9s0t1u2v3w4x5',
    name: '金银花',
    chineseName: '金银花',
    englishName: 'Honeysuckle Flower',
    pinyinName: 'jinyinhua',
    sku: 'JYH',
    description: '清热解毒，疏散风热。用于痈肿疔疮，喉痹，丹毒，热毒血痢。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 28.0,
    metadata: {
      origin: '山东',
      grade: 'A',
      storage: '密封，置阴凉干燥处'
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  }
];

/**
 * 验证所有 Mock 数据
 * 确保每个药品数据都符合后端规范
 */
export function validateAllMockData(): boolean {
  const results = mockMedicines.map((medicine, index) => {
    const isValid = validateMedicineData(medicine);
    if (!isValid) {
      console.error(`Mock 数据验证失败 - 索引 ${index}:`, medicine);
    }
    return isValid;
  });
  
  const allValid = results.every(result => result);
  console.log(`Mock 数据验证结果: ${allValid ? '全部通过' : '存在错误'} (${results.filter(r => r).length}/${results.length})`);
  
  return allValid;
}

/**
 * 按分类获取药品
 */
export function getMedicinesByCategory(category: string): Medicine[] {
  return mockMedicines.filter(medicine => medicine.category === category);
}

/**
 * 按价格范围获取药品
 */
export function getMedicinesByPriceRange(minPrice: number, maxPrice: number): Medicine[] {
  return mockMedicines.filter(medicine => 
    medicine.basePrice >= minPrice && medicine.basePrice <= maxPrice
  );
}

/**
 * 按 SKU 获取药品
 */
export function getMedicineBySku(sku: string): Medicine | undefined {
  return mockMedicines.find(medicine => medicine.sku === sku);
}

/**
 * 按 ID 获取药品
 */
export function getMedicineById(id: string): Medicine | undefined {
  return mockMedicines.find(medicine => medicine.id === id);
}

/**
 * 搜索药品（支持中文名、英文名、拼音名）
 */
export function searchMedicines(query: string): Medicine[] {
  const lowerQuery = query.toLowerCase();
  return mockMedicines.filter(medicine => 
    medicine.chineseName.includes(query) ||
    medicine.englishName.toLowerCase().includes(lowerQuery) ||
    medicine.pinyinName.toLowerCase().includes(lowerQuery) ||
    medicine.name.includes(query)
  );
}

/**
 * 获取药品统计信息
 */
export function getMedicineStats() {
  const total = mockMedicines.length;
  const byCategory = mockMedicines.reduce((acc, medicine) => {
    acc[medicine.category] = (acc[medicine.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byStatus = mockMedicines.reduce((acc, medicine) => {
    acc[medicine.status] = (acc[medicine.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const prices = mockMedicines.map(m => m.basePrice);
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const priceRange = {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
  
  return {
    total,
    byCategory,
    byStatus,
    averagePrice: Math.round(averagePrice * 100) / 100,
    priceRange
  };
}

// 启动时验证数据
if (typeof window === 'undefined') {
  // 仅在 Node.js 环境中验证（避免在浏览器中打印日志）
  validateAllMockData();
} 