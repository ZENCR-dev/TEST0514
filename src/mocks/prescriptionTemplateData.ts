import { PrescriptionTemplate, TemplateSearchParams } from '@/types/prescription';
import { PaginatedResult } from '@/types/common';

/**
 * 模拟处方模板数据
 * 涵盖常用中医临床方剂模板
 */
export const mockPrescriptionTemplates: PrescriptionTemplate[] = [
  // ========== 补益类方剂 ==========
  {
    id: 'tmpl_001',
    name: '四君子汤',
    description: '补气健脾的基础方，适用于脾胃气虚证',
    category: '补益剂',
    items: [
      {
        medicineId: 'med_029',
        medicineName: '党参',
        medicineEnglishName: 'Codonopsis',
        defaultQuantity: 15,
        notes: '补气健脾，可用人参代替'
      },
      {
        medicineId: 'med_012',
        medicineName: '白术',
        medicineEnglishName: 'Atractylodes',
        defaultQuantity: 12,
        notes: '健脾燥湿'
      },
      {
        medicineId: 'med_015',
        medicineName: '茯苓',
        medicineEnglishName: 'Poria',
        defaultQuantity: 15,
        notes: '健脾渗湿'
      },
      {
        medicineId: 'med_004',
        medicineName: '甘草',
        medicineEnglishName: 'Licorice',
        defaultQuantity: 6,
        notes: '炙甘草，调和诸药'
      }
    ],
    defaultInstructions: '水煎服，每次1剂，每日2次，温服',
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-12-10T14:30:00Z',
    usageCount: 156,
    isDefault: true,
    creatorId: 'doc_001',
    creatorName: '张医师'
  },
  {
    id: 'tmpl_002',
    name: '六味地黄丸',
    description: '滋补肾阴的经典方剂，治疗肾阴虚证',
    category: '补益剂',
    items: [
      {
        medicineId: 'med_014',
        medicineName: '熟地黄',
        medicineEnglishName: 'Rehmannia',
        defaultQuantity: 24,
        notes: '君药，滋肾阴补精血'
      },
      {
        medicineId: 'med_011',
        medicineName: '山药',
        medicineEnglishName: 'Chinese Yam',
        defaultQuantity: 12,
        notes: '补脾固肾'
      },
      {
        medicineId: 'med_016',
        medicineName: '山茱萸',
        medicineEnglishName: 'Cornus',
        defaultQuantity: 12,
        notes: '补肝肾，涩精气'
      },
      {
        medicineId: 'med_015',
        medicineName: '茯苓',
        medicineEnglishName: 'Poria',
        defaultQuantity: 9,
        notes: '健脾渗湿'
      },
      {
        medicineId: 'med_020',
        medicineName: '牡丹皮',
        medicineEnglishName: 'Moutan',
        defaultQuantity: 9,
        notes: '清热凉血'
      },
      {
        medicineId: 'med_034',
        medicineName: '泽泻',
        medicineEnglishName: 'Alisma',
        defaultQuantity: 9,
        notes: '利水渗湿'
      }
    ],
    defaultInstructions: '水煎服，每次1剂，每日2次，空腹温服',
    createdAt: '2024-11-01T11:00:00Z',
    updatedAt: '2024-12-08T16:20:00Z',
    usageCount: 234,
    isDefault: true,
    creatorId: 'doc_001',
    creatorName: '张医师'
  },
  {
    id: 'tmpl_003',
    name: '补中益气汤',
    description: '补中益气，升阳举陷，用于中气下陷证',
    category: '补益剂',
    items: [
      {
        medicineId: 'med_005',
        medicineName: '黄芪',
        medicineEnglishName: 'Astragalus',
        defaultQuantity: 20,
        notes: '君药，大补脾肺之气'
      },
      {
        medicineId: 'med_029',
        medicineName: '党参',
        medicineEnglishName: 'Codonopsis',
        defaultQuantity: 15,
        notes: '补气健脾'
      },
      {
        medicineId: 'med_012',
        medicineName: '白术',
        medicineEnglishName: 'Atractylodes',
        defaultQuantity: 10,
        notes: '健脾燥湿'
      },
      {
        medicineId: 'med_008',
        medicineName: '当归',
        medicineEnglishName: 'Angelica',
        defaultQuantity: 10,
        notes: '养血和血'
      },
      {
        medicineId: 'med_019',
        medicineName: '陈皮',
        medicineEnglishName: 'Tangerine Peel',
        defaultQuantity: 6,
        notes: '理气健脾'
      },
      {
        medicineId: 'med_035',
        medicineName: '升麻',
        medicineEnglishName: 'Cimicifuga',
        defaultQuantity: 6,
        notes: '升阳举陷'
      },
      {
        medicineId: 'med_036',
        medicineName: '柴胡',
        medicineEnglishName: 'Bupleurum',
        defaultQuantity: 6,
        notes: '升阳解郁'
      },
      {
        medicineId: 'med_004',
        medicineName: '甘草',
        medicineEnglishName: 'Licorice',
        defaultQuantity: 6,
        notes: '炙甘草，调和诸药'
      }
    ],
    defaultInstructions: '水煎服，每次1剂，每日2次，饭前温服',
    createdAt: '2024-11-02T09:30:00Z',
    updatedAt: '2024-12-12T10:15:00Z',
    usageCount: 89,
    isDefault: false,
    creatorId: 'doc_002',
    creatorName: '李医师'
  },

  // ========== 解表类方剂 ==========
  {
    id: 'tmpl_004',
    name: '银翘散',
    description: '辛凉解表，清热解毒，治疗风热感冒',
    category: '解表剂',
    items: [
      {
        medicineId: 'med_007',
        medicineName: '金银花',
        medicineEnglishName: 'Honeysuckle',
        defaultQuantity: 15,
        notes: '君药，清热解毒'
      },
      {
        medicineId: 'med_010',
        medicineName: '连翘',
        medicineEnglishName: 'Forsythia',
        defaultQuantity: 15,
        notes: '君药，清热解毒'
      },
      {
        medicineId: 'med_022',
        medicineName: '桔梗',
        medicineEnglishName: 'Platycodon',
        defaultQuantity: 6,
        notes: '宣肺利咽'
      },
      {
        medicineId: 'med_018',
        medicineName: '薄荷',
        medicineEnglishName: 'Mint',
        defaultQuantity: 6,
        notes: '疏散风热，后下'
      },
      {
        medicineId: 'med_037',
        medicineName: '淡豆豉',
        medicineEnglishName: 'Soy Bean',
        defaultQuantity: 9,
        notes: '解表宣肺'
      },
      {
        medicineId: 'med_038',
        medicineName: '牛蒡子',
        medicineEnglishName: 'Arctium',
        defaultQuantity: 9,
        notes: '疏散风热，利咽'
      },
      {
        medicineId: 'med_039',
        medicineName: '淡竹叶',
        medicineEnglishName: 'Bamboo Leaves',
        defaultQuantity: 6,
        notes: '清热除烦'
      },
      {
        medicineId: 'med_040',
        medicineName: '芦根',
        medicineEnglishName: 'Reed Rhizome',
        defaultQuantity: 20,
        notes: '清热生津'
      }
    ],
    defaultInstructions: '水煎服，每次1剂，每日2-3次，薄荷后下',
    createdAt: '2024-11-03T14:00:00Z',
    updatedAt: '2024-12-11T09:45:00Z',
    usageCount: 112,
    isDefault: true,
    creatorId: 'doc_001',
    creatorName: '张医师'
  },
  {
    id: 'tmpl_005',
    name: '麻黄汤',
    description: '发汗解表，宣肺平喘，治疗风寒感冒',
    category: '解表剂',
    items: [
      {
        medicineId: 'med_041',
        medicineName: '麻黄',
        medicineEnglishName: 'Ephedra',
        defaultQuantity: 9,
        notes: '君药，发汗解表'
      },
      {
        medicineId: 'med_042',
        medicineName: '桂枝',
        medicineEnglishName: 'Cinnamon Twig',
        defaultQuantity: 6,
        notes: '助麻黄解表'
      },
      {
        medicineId: 'med_043',
        medicineName: '杏仁',
        medicineEnglishName: 'Apricot Kernel',
        defaultQuantity: 9,
        notes: '宣肺止咳'
      },
      {
        medicineId: 'med_004',
        medicineName: '甘草',
        medicineEnglishName: 'Licorice',
        defaultQuantity: 3,
        notes: '调和诸药'
      }
    ],
    defaultInstructions: '水煎服，每次1剂，每日2次，温服取汗',
    createdAt: '2024-11-03T15:30:00Z',
    updatedAt: '2024-12-09T11:20:00Z',
    usageCount: 67,
    isDefault: false,
    creatorId: 'doc_003',
    creatorName: '王医师'
  },

  // ========== 清热类方剂 ==========
  {
    id: 'tmpl_006',
    name: '清热解毒汤',
    description: '清热解毒，消肿散结，用于热毒壅盛证',
    category: '清热剂',
    items: [
      {
        medicineId: 'med_007',
        medicineName: '金银花',
        medicineEnglishName: 'Honeysuckle',
        defaultQuantity: 20,
        notes: '清热解毒'
      },
      {
        medicineId: 'med_010',
        medicineName: '连翘',
        medicineEnglishName: 'Forsythia',
        defaultQuantity: 15,
        notes: '清热解毒'
      },
      {
        medicineId: 'med_032',
        medicineName: '蒲公英',
        medicineEnglishName: 'Dandelion',
        defaultQuantity: 20,
        notes: '清热解毒，消肿散结'
      },
      {
        medicineId: 'med_033',
        medicineName: '紫花地丁',
        medicineEnglishName: 'Viola',
        defaultQuantity: 15,
        notes: '清热解毒'
      },
      {
        medicineId: 'med_044',
        medicineName: '野菊花',
        medicineEnglishName: 'Wild Chrysanthemum',
        defaultQuantity: 12,
        notes: '清热解毒'
      },
      {
        medicineId: 'med_003',
        medicineName: '板蓝根',
        medicineEnglishName: 'Isatis Root',
        defaultQuantity: 15,
        notes: '清热解毒，凉血利咽'
      }
    ],
    defaultInstructions: '水煎服，每次1剂，每日3次，温服',
    createdAt: '2024-11-04T10:20:00Z',
    updatedAt: '2024-12-13T14:10:00Z',
    usageCount: 145,
    isDefault: false,
    creatorId: 'doc_002',
    creatorName: '李医师'
  },

  // ========== 理气类方剂 ==========
  {
    id: 'tmpl_007',
    name: '四逆散',
    description: '疏肝理气，调和肝脾，用于肝气郁结证',
    category: '理气剂',
    items: [
      {
        medicineId: 'med_036',
        medicineName: '柴胡',
        medicineEnglishName: 'Bupleurum',
        defaultQuantity: 12,
        notes: '疏肝解郁'
      },
      {
        medicineId: 'med_045',
        medicineName: '白芍',
        medicineEnglishName: 'White Peony',
        defaultQuantity: 12,
        notes: '养血柔肝'
      },
      {
        medicineId: 'med_046',
        medicineName: '枳实',
        medicineEnglishName: 'Immature Orange',
        defaultQuantity: 12,
        notes: '行气破滞'
      },
      {
        medicineId: 'med_004',
        medicineName: '甘草',
        medicineEnglishName: 'Licorice',
        defaultQuantity: 6,
        notes: '炙甘草，调和诸药'
      }
    ],
    defaultInstructions: '水煎服，每次1剂，每日2次，温服',
    createdAt: '2024-11-05T16:45:00Z',
    updatedAt: '2024-12-10T08:30:00Z',
    usageCount: 78,
    isDefault: false,
    creatorId: 'doc_003',
    creatorName: '王医师'
  },

  // ========== 活血化瘀类方剂 ==========
  {
    id: 'tmpl_008',
    name: '桃红四物汤',
    description: '活血化瘀，养血调经，用于血瘀证',
    category: '活血化瘀剂',
    items: [
      {
        medicineId: 'med_008',
        medicineName: '当归',
        medicineEnglishName: 'Angelica',
        defaultQuantity: 12,
        notes: '养血活血'
      },
      {
        medicineId: 'med_006',
        medicineName: '川芎',
        medicineEnglishName: 'Chuanxiong',
        defaultQuantity: 8,
        notes: '活血行气'
      },
      {
        medicineId: 'med_045',
        medicineName: '白芍',
        medicineEnglishName: 'White Peony',
        defaultQuantity: 12,
        notes: '养血敛阴'
      },
      {
        medicineId: 'med_047',
        medicineName: '熟地',
        medicineEnglishName: 'Prepared Rehmannia',
        defaultQuantity: 15,
        notes: '滋阴养血'
      },
      {
        medicineId: 'med_017',
        medicineName: '桃仁',
        medicineEnglishName: 'Peach Seed',
        defaultQuantity: 10,
        notes: '活血化瘀'
      },
      {
        medicineId: 'med_013',
        medicineName: '红花',
        medicineEnglishName: 'Safflower',
        defaultQuantity: 6,
        notes: '活血通经'
      }
    ],
    defaultInstructions: '水煎服，每次1剂，每日2次，温服',
    createdAt: '2024-11-06T11:15:00Z',
    updatedAt: '2024-12-11T13:25:00Z',
    usageCount: 134,
    isDefault: true,
    creatorId: 'doc_001',
    creatorName: '张医师'
  },

  // ========== 祛痰类方剂 ==========
  {
    id: 'tmpl_009',
    name: '二陈汤',
    description: '燥湿化痰，理气和中，用于湿痰证',
    category: '祛痰剂',
    items: [
      {
        medicineId: 'med_021',
        medicineName: '半夏',
        medicineEnglishName: 'Pinellia',
        defaultQuantity: 12,
        notes: '燥湿化痰，制半夏'
      },
      {
        medicineId: 'med_019',
        medicineName: '陈皮',
        medicineEnglishName: 'Tangerine Peel',
        defaultQuantity: 9,
        notes: '理气化痰'
      },
      {
        medicineId: 'med_015',
        medicineName: '茯苓',
        medicineEnglishName: 'Poria',
        defaultQuantity: 15,
        notes: '健脾渗湿'
      },
      {
        medicineId: 'med_004',
        medicineName: '甘草',
        medicineEnglishName: 'Licorice',
        defaultQuantity: 6,
        notes: '炙甘草，调和诸药'
      }
    ],
    defaultInstructions: '水煎服，每次1剂，每日2次，温服',
    createdAt: '2024-11-07T09:40:00Z',
    updatedAt: '2024-12-08T15:50:00Z',
    usageCount: 92,
    isDefault: false,
    creatorId: 'doc_002',
    creatorName: '李医师'
  },

  // ========== 安神类方剂 ==========
  {
    id: 'tmpl_010',
    name: '甘麦大枣汤',
    description: '养心安神，和中缓急，用于脏躁证',
    category: '安神剂',
    items: [
      {
        medicineId: 'med_004',
        medicineName: '甘草',
        medicineEnglishName: 'Licorice',
        defaultQuantity: 10,
        notes: '炙甘草，缓急安中'
      },
      {
        medicineId: 'med_048',
        medicineName: '小麦',
        medicineEnglishName: 'Wheat',
        defaultQuantity: 30,
        notes: '养心安神'
      },
      {
        medicineId: 'med_049',
        medicineName: '大枣',
        medicineEnglishName: 'Chinese Date',
        defaultQuantity: 12,
        notes: '补中益气，去核'
      }
    ],
    defaultInstructions: '水煎服，每次1剂，每日2次，温服',
    createdAt: '2024-11-08T13:20:00Z',
    updatedAt: '2024-12-12T16:40:00Z',
    usageCount: 56,
    isDefault: false,
    creatorId: 'doc_003',
    creatorName: '王医师'
  }
];

/**
 * 处方模板分类统计
 */
export const templateCategories = [
  { value: 'all', label: '全部分类', count: mockPrescriptionTemplates.length },
  { value: '补益剂', label: '补益剂', count: 3 },
  { value: '解表剂', label: '解表剂', count: 2 },
  { value: '清热剂', label: '清热剂', count: 1 },
  { value: '理气剂', label: '理气剂', count: 1 },
  { value: '活血化瘀剂', label: '活血化瘀剂', count: 1 },
  { value: '祛痰剂', label: '祛痰剂', count: 1 },
  { value: '安神剂', label: '安神剂', count: 1 }
];

/**
 * 根据搜索参数获取处方模板
 */
export function getFilteredPrescriptionTemplates(params: TemplateSearchParams): PaginatedResult<PrescriptionTemplate> {
  let filtered = [...mockPrescriptionTemplates];
  
  // 搜索过滤
  if (params.query) {
    const query = params.query.toLowerCase();
    filtered = filtered.filter(template => 
      template.name.toLowerCase().includes(query) ||
      template.description?.toLowerCase().includes(query) ||
      template.category.toLowerCase().includes(query) ||
      template.items.some(item => 
        item.medicineName.toLowerCase().includes(query)
      )
    );
  }
  
  // 分类过滤
  if (params.category && params.category !== 'all') {
    filtered = filtered.filter(template => template.category === params.category);
  }
  
  // 默认模板过滤
  if (params.defaultOnly) {
    filtered = filtered.filter(template => template.isDefault);
  }
  
  // 按使用次数降序排列
  filtered.sort((a, b) => b.usageCount - a.usageCount);
  
  // 分页
  const page = params.page || 1;
  const limit = params.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    data: filtered.slice(start, end),
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit)
  };
}

/**
 * 根据ID获取模板
 */
export function getTemplateById(id: string): PrescriptionTemplate | undefined {
  return mockPrescriptionTemplates.find(template => template.id === id);
}

/**
 * 获取热门模板（按使用次数排序）
 */
export function getPopularTemplates(limit: number = 5): PrescriptionTemplate[] {
  return [...mockPrescriptionTemplates]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, limit);
}

/**
 * 获取最近创建的模板
 */
export function getRecentTemplates(limit: number = 5): PrescriptionTemplate[] {
  return [...mockPrescriptionTemplates]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
} 