import { PrescriptionHistory } from '@/types/prescription';

/**
 * 模拟处方历史数据
 * 包含不同状态、时间和复杂度的处方记录
 */
export const mockPrescriptionHistory: PrescriptionHistory[] = [
  {
    id: 'hist_001',
    prescriptionId: 'pres_20241215_001',
    patientName: '张小明',
    patientId: 'pat_001',
    createdAt: '2024-12-15T10:30:00Z',
    updatedAt: '2024-12-15T14:20:00Z',
    status: 'completed',
    totalPrice: 156.80,
    itemCount: 5,
    copies: 7,
    prescriptionFee: 15.00,
    instructions: '水煎服，每次1剂，每日2次，早晚空腹服用',
    notes: '患者对甘草过敏，已调整配方',
    items: [
      {
        medicineId: 'med_001',
        medicineName: '人参',
        medicineEnglishName: 'Ginseng',
        quantity: 12,
        pricePerGram: 3.50,
        subtotal: 42.00,
        notes: '选用东北人参'
      },
      {
        medicineId: 'med_005',
        medicineName: '黄芪',
        medicineEnglishName: 'Astragalus',
        quantity: 20,
        pricePerGram: 1.20,
        subtotal: 24.00
      },
      {
        medicineId: 'med_008',
        medicineName: '当归',
        medicineEnglishName: 'Angelica',
        quantity: 15,
        pricePerGram: 2.80,
        subtotal: 42.00
      },
      {
        medicineId: 'med_012',
        medicineName: '白术',
        medicineEnglishName: 'Atractylodes',
        quantity: 18,
        pricePerGram: 1.60,
        subtotal: 28.80
      },
      {
        medicineId: 'med_015',
        medicineName: '茯苓',
        medicineEnglishName: 'Poria',
        quantity: 20,
        pricePerGram: 1.00,
        subtotal: 20.00
      }
    ]
  },
  {
    id: 'hist_002',
    prescriptionId: 'pres_20241214_003',
    patientName: '李雨晴',
    patientId: 'pat_002',
    createdAt: '2024-12-14T16:45:00Z',
    updatedAt: '2024-12-14T18:30:00Z',
    status: 'completed',
    totalPrice: 89.60,
    itemCount: 4,
    copies: 5,
    prescriptionFee: 12.00,
    instructions: '水煎服，每次1剂，每日1次，饭后30分钟服用',
    items: [
      {
        medicineId: 'med_003',
        medicineName: '板蓝根',
        medicineEnglishName: 'Isatis Root',
        quantity: 25,
        pricePerGram: 0.80,
        subtotal: 20.00
      },
      {
        medicineId: 'med_007',
        medicineName: '金银花',
        medicineEnglishName: 'Honeysuckle',
        quantity: 18,
        pricePerGram: 1.50,
        subtotal: 27.00
      },
      {
        medicineId: 'med_010',
        medicineName: '连翘',
        medicineEnglishName: 'Forsythia',
        quantity: 16,
        pricePerGram: 1.40,
        subtotal: 22.40
      },
      {
        medicineId: 'med_018',
        medicineName: '薄荷',
        medicineEnglishName: 'Mint',
        quantity: 10,
        pricePerGram: 2.02,
        subtotal: 20.20
      }
    ]
  },
  {
    id: 'hist_003',
    prescriptionId: 'pres_20241213_007',
    patientName: '王建华',
    patientId: 'pat_003',
    createdAt: '2024-12-13T09:15:00Z',
    updatedAt: '2024-12-13T09:15:00Z',
    status: 'pending',
    totalPrice: 203.40,
    itemCount: 7,
    copies: 10,
    prescriptionFee: 20.00,
    instructions: '水煎服，每次1剂，每日3次，餐前1小时服用',
    notes: '慢性病调理方，需要长期服用',
    items: [
      {
        medicineId: 'med_001',
        medicineName: '人参',
        medicineEnglishName: 'Ginseng',
        quantity: 15,
        pricePerGram: 3.50,
        subtotal: 52.50
      },
      {
        medicineId: 'med_002',
        medicineName: '西洋参',
        medicineEnglishName: 'American Ginseng',
        quantity: 10,
        pricePerGram: 4.20,
        subtotal: 42.00
      },
      {
        medicineId: 'med_009',
        medicineName: '枸杞子',
        medicineEnglishName: 'Goji Berry',
        quantity: 25,
        pricePerGram: 1.80,
        subtotal: 45.00
      },
      {
        medicineId: 'med_011',
        medicineName: '山药',
        medicineEnglishName: 'Chinese Yam',
        quantity: 30,
        pricePerGram: 1.20,
        subtotal: 36.00
      },
      {
        medicineId: 'med_014',
        medicineName: '熟地黄',
        medicineEnglishName: 'Rehmannia',
        quantity: 20,
        pricePerGram: 1.20,
        subtotal: 24.00
      },
      {
        medicineId: 'med_016',
        medicineName: '山茱萸',
        medicineEnglishName: 'Cornus',
        quantity: 12,
        pricePerGram: 2.40,
        subtotal: 28.80
      },
      {
        medicineId: 'med_020',
        medicineName: '牡丹皮',
        medicineEnglishName: 'Moutan',
        quantity: 15,
        pricePerGram: 1.60,
        subtotal: 24.00
      }
    ]
  },
  {
    id: 'hist_004',
    prescriptionId: 'pres_20241212_002',
    patientName: '陈美丽',
    patientId: 'pat_004',
    createdAt: '2024-12-12T14:20:00Z',
    updatedAt: '2024-12-12T16:45:00Z',
    status: 'cancelled',
    totalPrice: 67.20,
    itemCount: 3,
    copies: 3,
    prescriptionFee: 10.00,
    instructions: '水煎服，每次1剂，每日2次',
    notes: '患者要求取消，改用其他治疗方案',
    items: [
      {
        medicineId: 'med_006',
        medicineName: '川芎',
        medicineEnglishName: 'Chuanxiong',
        quantity: 12,
        pricePerGram: 2.20,
        subtotal: 26.40
      },
      {
        medicineId: 'med_013',
        medicineName: '红花',
        medicineEnglishName: 'Safflower',
        quantity: 8,
        pricePerGram: 3.60,
        subtotal: 28.80
      },
      {
        medicineId: 'med_017',
        medicineName: '桃仁',
        medicineEnglishName: 'Peach Seed',
        quantity: 10,
        pricePerGram: 1.20,
        subtotal: 12.00
      }
    ]
  },
  {
    id: 'hist_005',
    prescriptionId: 'pres_20241211_005',
    patientName: '刘国强',
    patientId: 'pat_005',
    createdAt: '2024-12-11T11:30:00Z',
    updatedAt: '2024-12-11T11:30:00Z',
    status: 'expired',
    totalPrice: 145.60,
    itemCount: 6,
    copies: 8,
    prescriptionFee: 15.00,
    instructions: '水煎服，每次1剂，每日1次，晚上睡前服用',
    notes: '处方已过期，患者未及时取药',
    items: [
      {
        medicineId: 'med_004',
        medicineName: '甘草',
        medicineEnglishName: 'Licorice',
        quantity: 8,
        pricePerGram: 1.00,
        subtotal: 8.00
      },
      {
        medicineId: 'med_008',
        medicineName: '当归',
        medicineEnglishName: 'Angelica',
        quantity: 18,
        pricePerGram: 2.80,
        subtotal: 50.40
      },
      {
        medicineId: 'med_012',
        medicineName: '白术',
        medicineEnglishName: 'Atractylodes',
        quantity: 20,
        pricePerGram: 1.60,
        subtotal: 32.00
      },
      {
        medicineId: 'med_015',
        medicineName: '茯苓',
        medicineEnglishName: 'Poria',
        quantity: 25,
        pricePerGram: 1.00,
        subtotal: 25.00
      },
      {
        medicineId: 'med_019',
        medicineName: '陈皮',
        medicineEnglishName: 'Tangerine Peel',
        quantity: 15,
        pricePerGram: 1.20,
        subtotal: 18.00
      },
      {
        medicineId: 'med_021',
        medicineName: '半夏',
        medicineEnglishName: 'Pinellia',
        quantity: 12,
        pricePerGram: 1.00,
        subtotal: 12.00
      }
    ]
  },
  {
    id: 'hist_006',
    prescriptionId: 'pres_20241210_001',
    patientName: '赵婷婷',
    patientId: 'pat_006',
    createdAt: '2024-12-10T08:45:00Z',
    updatedAt: '2024-12-10T12:30:00Z',
    status: 'completed',
    totalPrice: 78.40,
    itemCount: 4,
    copies: 4,
    prescriptionFee: 8.00,
    instructions: '水煎服，每次1剂，每日2次，温服',
    items: [
      {
        medicineId: 'med_003',
        medicineName: '板蓝根',
        medicineEnglishName: 'Isatis Root',
        quantity: 20,
        pricePerGram: 0.80,
        subtotal: 16.00
      },
      {
        medicineId: 'med_007',
        medicineName: '金银花',
        medicineEnglishName: 'Honeysuckle',
        quantity: 15,
        pricePerGram: 1.50,
        subtotal: 22.50
      },
      {
        medicineId: 'med_018',
        medicineName: '薄荷',
        medicineEnglishName: 'Mint',
        quantity: 8,
        pricePerGram: 2.02,
        subtotal: 16.16
      },
      {
        medicineId: 'med_022',
        medicineName: '桔梗',
        medicineEnglishName: 'Platycodon',
        quantity: 12,
        pricePerGram: 1.98,
        subtotal: 23.76
      }
    ]
  },
  {
    id: 'hist_007',
    prescriptionId: 'pres_20241209_004',
    patientName: '孙志明',
    patientId: 'pat_007',
    createdAt: '2024-12-09T15:20:00Z',
    updatedAt: '2024-12-09T17:10:00Z',
    status: 'completed',
    totalPrice: 234.80,
    itemCount: 8,
    copies: 12,
    prescriptionFee: 25.00,
    instructions: '水煎服，每次1剂，每日2次，早晚各一次，温热服',
    notes: '重症调理，需配合西医治疗',
    items: [
      {
        medicineId: 'med_001',
        medicineName: '人参',
        medicineEnglishName: 'Ginseng',
        quantity: 20,
        pricePerGram: 3.50,
        subtotal: 70.00
      },
      {
        medicineId: 'med_005',
        medicineName: '黄芪',
        medicineEnglishName: 'Astragalus',
        quantity: 30,
        pricePerGram: 1.20,
        subtotal: 36.00
      },
      {
        medicineId: 'med_008',
        medicineName: '当归',
        medicineEnglishName: 'Angelica',
        quantity: 18,
        pricePerGram: 2.80,
        subtotal: 50.40
      },
      {
        medicineId: 'med_011',
        medicineName: '山药',
        medicineEnglishName: 'Chinese Yam',
        quantity: 25,
        pricePerGram: 1.20,
        subtotal: 30.00
      },
      {
        medicineId: 'med_014',
        medicineName: '熟地黄',
        medicineEnglishName: 'Rehmannia',
        quantity: 15,
        pricePerGram: 1.20,
        subtotal: 18.00
      },
      {
        medicineId: 'med_016',
        medicineName: '山茱萸',
        medicineEnglishName: 'Cornus',
        quantity: 10,
        pricePerGram: 2.40,
        subtotal: 24.00
      },
      {
        medicineId: 'med_023',
        medicineName: '龙骨',
        medicineEnglishName: 'Dragon Bone',
        quantity: 15,
        pricePerGram: 0.80,
        subtotal: 12.00
      },
      {
        medicineId: 'med_024',
        medicineName: '牡蛎',
        medicineEnglishName: 'Oyster Shell',
        quantity: 20,
        pricePerGram: 0.72,
        subtotal: 14.40
      }
    ]
  },
  {
    id: 'hist_008',
    prescriptionId: 'pres_20241208_002',
    patientName: '周敏',
    patientId: 'pat_008',
    createdAt: '2024-12-08T10:00:00Z',
    updatedAt: '2024-12-08T13:20:00Z',
    status: 'completed',
    totalPrice: 92.80,
    itemCount: 5,
    copies: 6,
    prescriptionFee: 12.00,
    instructions: '水煎服，每次1剂，每日1次，饭前服用',
    items: [
      {
        medicineId: 'med_009',
        medicineName: '枸杞子',
        medicineEnglishName: 'Goji Berry',
        quantity: 20,
        pricePerGram: 1.80,
        subtotal: 36.00
      },
      {
        medicineId: 'med_025',
        medicineName: '菊花',
        medicineEnglishName: 'Chrysanthemum',
        quantity: 12,
        pricePerGram: 2.00,
        subtotal: 24.00
      },
      {
        medicineId: 'med_026',
        medicineName: '决明子',
        medicineEnglishName: 'Cassia Seed',
        quantity: 15,
        pricePerGram: 0.80,
        subtotal: 12.00
      },
      {
        medicineId: 'med_027',
        medicineName: '车前子',
        medicineEnglishName: 'Plantago Seed',
        quantity: 10,
        pricePerGram: 1.20,
        subtotal: 12.00
      },
      {
        medicineId: 'med_028',
        medicineName: '密蒙花',
        medicineEnglishName: 'Buddleja',
        quantity: 8,
        pricePerGram: 1.10,
        subtotal: 8.80
      }
    ]
  },
  {
    id: 'hist_009',
    prescriptionId: 'pres_20241207_006',
    patientName: '吴亮',
    patientId: 'pat_009',
    createdAt: '2024-12-07T13:45:00Z',
    updatedAt: '2024-12-07T15:30:00Z',
    status: 'completed',
    totalPrice: 156.00,
    itemCount: 6,
    copies: 9,
    prescriptionFee: 18.00,
    instructions: '水煎服，每次1剂，每日2次，空腹服用',
    notes: '胃肠调理方，注意饮食清淡',
    items: [
      {
        medicineId: 'med_029',
        medicineName: '党参',
        medicineEnglishName: 'Codonopsis',
        quantity: 25,
        pricePerGram: 1.60,
        subtotal: 40.00
      },
      {
        medicineId: 'med_012',
        medicineName: '白术',
        medicineEnglishName: 'Atractylodes',
        quantity: 20,
        pricePerGram: 1.60,
        subtotal: 32.00
      },
      {
        medicineId: 'med_015',
        medicineName: '茯苓',
        medicineEnglishName: 'Poria',
        quantity: 18,
        pricePerGram: 1.00,
        subtotal: 18.00
      },
      {
        medicineId: 'med_019',
        medicineName: '陈皮',
        medicineEnglishName: 'Tangerine Peel',
        quantity: 12,
        pricePerGram: 1.20,
        subtotal: 14.40
      },
      {
        medicineId: 'med_030',
        medicineName: '木香',
        medicineEnglishName: 'Costus',
        quantity: 10,
        pricePerGram: 3.20,
        subtotal: 32.00
      },
      {
        medicineId: 'med_031',
        medicineName: '砂仁',
        medicineEnglishName: 'Amomum',
        quantity: 8,
        pricePerGram: 2.45,
        subtotal: 19.60
      }
    ]
  },
  {
    id: 'hist_010',
    prescriptionId: 'pres_20241206_003',
    patientName: '郑小红',
    patientId: 'pat_010',
    createdAt: '2024-12-06T09:30:00Z',
    updatedAt: '2024-12-06T11:45:00Z',
    status: 'completed',
    totalPrice: 108.40,
    itemCount: 4,
    copies: 7,
    prescriptionFee: 14.00,
    instructions: '水煎服，每次1剂，每日3次，餐后服用',
    items: [
      {
        medicineId: 'med_007',
        medicineName: '金银花',
        medicineEnglishName: 'Honeysuckle',
        quantity: 20,
        pricePerGram: 1.50,
        subtotal: 30.00
      },
      {
        medicineId: 'med_010',
        medicineName: '连翘',
        medicineEnglishName: 'Forsythia',
        quantity: 18,
        pricePerGram: 1.40,
        subtotal: 25.20
      },
      {
        medicineId: 'med_032',
        medicineName: '蒲公英',
        medicineEnglishName: 'Dandelion',
        quantity: 25,
        pricePerGram: 0.80,
        subtotal: 20.00
      },
      {
        medicineId: 'med_033',
        medicineName: '紫花地丁',
        medicineEnglishName: 'Viola',
        quantity: 22,
        pricePerGram: 1.50,
        subtotal: 33.00
      }
    ]
  }
];

/**
 * 根据搜索参数获取处方历史
 */
export function getFilteredPrescriptionHistory(params: {
  query?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  let filtered = [...mockPrescriptionHistory];
  
  // 搜索过滤
  if (params.query) {
    const query = params.query.toLowerCase();
    filtered = filtered.filter(item => 
      item.patientName.toLowerCase().includes(query) ||
      item.prescriptionId.toLowerCase().includes(query) ||
      item.notes?.toLowerCase().includes(query)
    );
  }
  
  // 状态过滤
  if (params.status && params.status !== 'all') {
    filtered = filtered.filter(item => item.status === params.status);
  }
  
  // 日期过滤
  if (params.startDate) {
    filtered = filtered.filter(item => 
      new Date(item.createdAt) >= new Date(params.startDate!)
    );
  }
  
  if (params.endDate) {
    filtered = filtered.filter(item => 
      new Date(item.createdAt) <= new Date(params.endDate!)
    );
  }
  
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