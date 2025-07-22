/**
 * 药品 Mock 数据 - MVP1.9 Guest Mode
 * 基于442条真实药品数据集成
 * 
 * @version 1.9.0
 * @date 2025-07-22
 * @description 完全匹配后端 API Medicine 格式
 * @source 数据来源: archived-docs/medicine-data-450.CSV-processed.csv
 */

import { Medicine, validateMedicineData } from '../types/medicine';

/**
 * Mock 药品数据 - 442条完整数据
 * 所有数据都通过 validateMedicineData 验证
 */
export const mockMedicines: Medicine[] = [
  {
    id: 'med_001',
    name: '高丽参片',
    chineseName: '高丽参片',
    englishName: 'Panax Ginseng',
    pinyinName: 'gaolishenpian',
    sku: 'GLSP',
    description: '传统中药高丽参片，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.36956,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_002',
    name: '龙齿',
    chineseName: '龙齿',
    englishName: 'Os Draconis',
    pinyinName: 'longchi',
    sku: 'LC',
    description: '传统中药龙齿，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.32174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_003',
    name: '红参片',
    chineseName: '红参片',
    englishName: 'Panax Ginseng',
    pinyinName: 'hongcanpian',
    sku: 'HCP',
    description: '传统中药红参片，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.28696,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_004',
    name: '胡黄连',
    chineseName: '胡黄连',
    englishName: 'Rhizoma Picrorhizae',
    pinyinName: 'huhuanglian',
    sku: 'HHL',
    description: '传统中药胡黄连，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.26086,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_005',
    name: '黄连',
    chineseName: '黄连',
    englishName: 'Rhizoma Coptidis',
    pinyinName: 'huanglian',
    sku: 'HL',
    description: '传统中药黄连，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.1913,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_006',
    name: '虎乳菌',
    chineseName: '虎乳菌',
    englishName: 'Hu Ru Jun',
    pinyinName: 'hurujun',
    sku: 'HRJ',
    description: '传统中药虎乳菌，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.29565,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_007',
    name: '莲须',
    chineseName: '莲须',
    englishName: 'Stamen Nelumbinis',
    pinyinName: 'lianxu',
    sku: 'LX',
    description: '传统中药莲须，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.17392,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_008',
    name: '蝉蜕',
    chineseName: '蝉蜕',
    englishName: 'Periostracum Cicadae',
    pinyinName: 'chantui',
    sku: 'CT',
    description: '传统中药蝉蜕，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.1913,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_009',
    name: '通草圆片',
    chineseName: '通草圆片',
    englishName: 'Medulla Tetrapanacis',
    pinyinName: 'tongcaoyuanpian',
    sku: 'TCYP',
    description: '传统中药通草圆片，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.17392,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_010',
    name: '白参须',
    chineseName: '白参须',
    englishName: 'Panax Ginseng',
    pinyinName: 'baicanxu',
    sku: 'BCX',
    description: '传统中药白参须，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.20652,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_011',
    name: '桂花',
    chineseName: '桂花',
    englishName: 'Osmanthus fragrans',
    pinyinName: 'guihua',
    sku: 'GH',
    description: '传统中药桂花，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.212,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_012',
    name: '川贝',
    chineseName: '川贝',
    englishName: 'Bulbus Fritillariae Cirrhosae',
    pinyinName: 'chuanbei',
    sku: 'CB',
    description: '止咳化痰川贝，用于咳嗽痰多，润肺止咳。',
    category: '止咳药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.16086,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_013',
    name: '猫爪草',
    chineseName: '猫爪草',
    englishName: 'Radix Ranunculi Ternati',
    pinyinName: 'maozhuacao',
    sku: 'MZC',
    description: '传统中药猫爪草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.17392,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_014',
    name: '参芪四宝茶',
    chineseName: '参芪四宝茶',
    englishName: 'Si Bao Herbal Tea',
    pinyinName: 'canqisibaocha',
    sku: 'CQSBC',
    description: '传统中药参芪四宝茶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.128,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_015',
    name: '白鲜皮',
    chineseName: '白鲜皮',
    englishName: 'Cortex Dictamni',
    pinyinName: 'baixianpi',
    sku: 'BXP',
    description: '传统中药白鲜皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.15218,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_016',
    name: '天麻',
    chineseName: '天麻',
    englishName: 'Rhizoma Gastrodiae',
    pinyinName: 'tianma',
    sku: 'TM',
    description: '传统中药天麻，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.17391,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_017',
    name: '三七粉',
    chineseName: '三七粉',
    englishName: 'Radix Notoginseng Powder',
    pinyinName: 'sanqifen',
    sku: 'SQF',
    description: '活血化瘀三七粉，用于血瘀证候，改善血液循环。',
    category: '活血药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.13912,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_018',
    name: '龙胆草',
    chineseName: '龙胆草',
    englishName: 'Radix Gentianae',
    pinyinName: 'longdancao',
    sku: 'LDC',
    description: '传统中药龙胆草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.16086,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_019',
    name: '炙远志',
    chineseName: '炙远志',
    englishName: 'Radix Polygalae',
    pinyinName: 'zhiyuanzhi',
    sku: 'ZYZ',
    description: '安神定志炙远志，用于心神不宁，失眠健忘。',
    category: '安神药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.14348,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_020',
    name: '连翘',
    chineseName: '连翘',
    englishName: 'Fructus Forsythiae',
    pinyinName: 'lianqiao',
    sku: 'LQ',
    description: '清热解毒连翘，用于热性病证，清除内热。',
    category: '清热药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.08956,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_021',
    name: '蕤仁肉',
    chineseName: '蕤仁肉',
    englishName: 'Nux Prinsepiae',
    pinyinName: 'ruirenrou',
    sku: 'RRR',
    description: '传统中药蕤仁肉，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.13478,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_022',
    name: '细辛',
    chineseName: '细辛',
    englishName: 'Herba Asari',
    pinyinName: 'xixin',
    sku: 'XX',
    description: '传统中药细辛，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.13912,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_023',
    name: '海金沙',
    chineseName: '海金沙',
    englishName: 'Spora Lygodii',
    pinyinName: 'haijinsha',
    sku: 'HJS',
    description: '传统中药海金沙，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.12,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_024',
    name: '延胡索',
    chineseName: '延胡索',
    englishName: 'Rhizoma Corydalis',
    pinyinName: 'yanhusuo',
    sku: 'YHS',
    description: '传统中药延胡索，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.10434,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_025',
    name: '远志',
    chineseName: '远志',
    englishName: 'Radix Polygalae',
    pinyinName: 'yuanzhi',
    sku: 'YZ',
    description: '安神定志远志，用于心神不宁，失眠健忘。',
    category: '安神药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.1287,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_026',
    name: '炒酸枣仁',
    chineseName: '炒酸枣仁',
    englishName: 'Semen Ziziphi Spinosae',
    pinyinName: 'chaosuanzaoren',
    sku: 'CSZR',
    description: '安神定志炒酸枣仁，用于心神不宁，失眠健忘。',
    category: '安神药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0826,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_027',
    name: '北柴胡',
    chineseName: '北柴胡',
    englishName: 'Radix Bupleuri',
    pinyinName: 'beichaihu',
    sku: 'BCH',
    description: '传统中药北柴胡，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.13914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_028',
    name: '灯芯草',
    chineseName: '灯芯草',
    englishName: 'Medulla Junci',
    pinyinName: 'dengxincao',
    sku: 'DXC',
    description: '传统中药灯芯草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.084342857,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_029',
    name: '当归全片',
    chineseName: '当归全片',
    englishName: 'Radix Angelicae Sinensis',
    pinyinName: 'dangguiquanpian',
    sku: 'DGQP',
    description: '补益当归全片，用于调补身体，增强体质。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.130433333,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_030',
    name: '炒白术',
    chineseName: '炒白术',
    englishName: 'Rhizoma Atractylodis Macrocephalae',
    pinyinName: 'chaobaizhu',
    sku: 'CBZ',
    description: '化痰散结炒白术，用于痰湿内阻，咳嗽痰多。',
    category: '化痰药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.13044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_031',
    name: '胖大海',
    chineseName: '胖大海',
    englishName: 'Semen Sterculiae Lychnophorae',
    pinyinName: 'pangdahai',
    sku: 'PDH',
    description: '传统中药胖大海，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.12174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_032',
    name: '羌活',
    chineseName: '羌活',
    englishName: 'Rhizoma et Radix Notopterygii',
    pinyinName: 'qianghuo',
    sku: 'QH',
    description: '传统中药羌活，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.1087,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_033',
    name: '酸枣仁',
    chineseName: '酸枣仁',
    englishName: 'Semen Ziziphi Spinosae',
    pinyinName: 'suanzaoren',
    sku: 'SZR',
    description: '安神定志酸枣仁，用于心神不宁，失眠健忘。',
    category: '安神药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0826,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_034',
    name: '浙贝母',
    chineseName: '浙贝母',
    englishName: 'Bulbus Fritillariae Thunbergii',
    pinyinName: 'zhebeimu',
    sku: 'ZBM',
    description: '止咳化痰浙贝母，用于咳嗽痰多，润肺止咳。',
    category: '止咳药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.1026,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_035',
    name: '胖大海',
    chineseName: '胖大海',
    englishName: 'Semen Sterculiae Lychnophorae',
    pinyinName: 'pangdahai',
    sku: 'pangdahai',
    description: '传统中药胖大海，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.1322,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_036',
    name: '红花特级',
    chineseName: '红花特级',
    englishName: 'Flos Carthami',
    pinyinName: 'honghuateji',
    sku: 'HHTJ',
    description: '活血化瘀红花特级，用于血瘀证候，改善血液循环。',
    category: '活血药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.10956,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_037',
    name: '田七片',
    chineseName: '田七片',
    englishName: 'Radix Notoginseng',
    pinyinName: 'tianqipian',
    sku: 'TQP',
    description: '传统中药田七片，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.13044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_038',
    name: '雪莲子',
    chineseName: '雪莲子',
    englishName: 'Gleditsia sinensis Lam.',
    pinyinName: 'xuelianzi',
    sku: 'XLZ',
    description: '传统中药雪莲子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.1148,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_039',
    name: '白蔹',
    chineseName: '白蔹',
    englishName: 'Radix Ampelopsis',
    pinyinName: 'bailian',
    sku: 'BL',
    description: '传统中药白蔹，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0826,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_040',
    name: '法半夏',
    chineseName: '法半夏',
    englishName: 'Rhizoma Pinelliae',
    pinyinName: 'fabanxia',
    sku: 'FBX',
    description: '化痰散结法半夏，用于痰湿内阻，咳嗽痰多。',
    category: '化痰药',
    unit: 'g',
    requiresPrescription: true,
    basePrice: 0.11304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处",
          "warning": "需医师指导使用"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_041',
    name: '覆盆子',
    chineseName: '覆盆子',
    englishName: 'Fructus Rubi',
    pinyinName: 'fupenzi',
    sku: 'FPZ',
    description: '传统中药覆盆子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.09566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_042',
    name: '姜半夏',
    chineseName: '姜半夏',
    englishName: 'Rhizoma Pinelliae (ginger cured)',
    pinyinName: 'jiangbanxia',
    sku: 'JBX',
    description: '化痰散结姜半夏，用于痰湿内阻，咳嗽痰多。',
    category: '化痰药',
    unit: 'g',
    requiresPrescription: true,
    basePrice: 0.11304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处",
          "warning": "需医师指导使用"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_043',
    name: '蜜紫菀',
    chineseName: '蜜紫菀',
    englishName: 'Radix Asteris',
    pinyinName: 'miziwan',
    sku: 'MZW',
    description: '止咳化痰蜜紫菀，用于咳嗽痰多，润肺止咳。',
    category: '止咳药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.09566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_044',
    name: '清半夏',
    chineseName: '清半夏',
    englishName: 'Pinellia ternata (tuber prepared)',
    pinyinName: 'qingbanxia',
    sku: 'QBX',
    description: '化痰散结清半夏，用于痰湿内阻，咳嗽痰多。',
    category: '化痰药',
    unit: 'g',
    requiresPrescription: true,
    basePrice: 0.09566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处",
          "warning": "需医师指导使用"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_045',
    name: '银柴胡',
    chineseName: '银柴胡',
    englishName: 'Radix Stellariae',
    pinyinName: 'yinchaihu',
    sku: 'YCH',
    description: '传统中药银柴胡，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.11304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_046',
    name: '猪苓',
    chineseName: '猪苓',
    englishName: 'Polyporus',
    pinyinName: 'zhuling',
    sku: 'ZL',
    description: '传统中药猪苓，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.09478,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_047',
    name: '紫菀',
    chineseName: '紫菀',
    englishName: 'Radix Asteris',
    pinyinName: 'ziwan',
    sku: 'ZW',
    description: '止咳化痰紫菀，用于咳嗽痰多，润肺止咳。',
    category: '止咳药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.09566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_048',
    name: '刺五加皮',
    chineseName: '刺五加皮',
    englishName: 'Radix seu Caulis Acanthopanacis Senticosi',
    pinyinName: 'ciwujiapi',
    sku: 'CWJP',
    description: '传统中药刺五加皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.1026,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_049',
    name: '扁豆衣',
    chineseName: '扁豆衣',
    englishName: 'Seed-coat of Semen Lablab Album',
    pinyinName: 'biandouyi',
    sku: 'BDY',
    description: '传统中药扁豆衣，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.09566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_050',
    name: '党参五级',
    chineseName: '党参五级',
    englishName: 'Radix Codonopsis',
    pinyinName: 'dangshenwuji',
    sku: 'DSWJ',
    description: '补益党参五级，用于调补身体，增强体质。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.11478,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_051',
    name: '肉苁蓉',
    chineseName: '肉苁蓉',
    englishName: 'Herba Cistanches',
    pinyinName: 'roucongrong',
    sku: 'RCR',
    description: '传统中药肉苁蓉，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0913,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_052',
    name: '太子参',
    chineseName: '太子参',
    englishName: 'Radix Pseudostellariae',
    pinyinName: 'taizican',
    sku: 'TZC',
    description: '传统中药太子参，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.07566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_053',
    name: '牡丹皮',
    chineseName: '牡丹皮',
    englishName: 'Cortex Moutan',
    pinyinName: 'mudanpi',
    sku: 'MDP',
    description: '传统中药牡丹皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0913,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_054',
    name: '雪燕',
    chineseName: '雪燕',
    englishName: 'Gum Tragacanth',
    pinyinName: 'xueyan',
    sku: 'XY',
    description: '传统中药雪燕，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.098533333,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_055',
    name: '白薇',
    chineseName: '白薇',
    englishName: 'Radix Cynanchi Atrati',
    pinyinName: 'baiwei',
    sku: 'BW',
    description: '传统中药白薇，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.09392,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_056',
    name: '柏子仁',
    chineseName: '柏子仁',
    englishName: 'Semen Platycladi',
    pinyinName: 'baiziren',
    sku: 'BZR',
    description: '传统中药柏子仁，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0826,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_057',
    name: '葛花',
    chineseName: '葛花',
    englishName: 'Pueraria lobata',
    pinyinName: 'gehua',
    sku: 'gehua',
    description: '传统中药葛花，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.07826,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_058',
    name: '金银花',
    chineseName: '金银花',
    englishName: 'Flos Lonicerae',
    pinyinName: 'jinyinhua',
    sku: 'JYH',
    description: '清热解毒金银花，用于热性病证，清除内热。',
    category: '清热药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.09566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_059',
    name: '蔓荆子',
    chineseName: '蔓荆子',
    englishName: 'Fructus Viticis',
    pinyinName: 'manjingzi',
    sku: 'MJZ',
    description: '传统中药蔓荆子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.08522,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_060',
    name: '胎菊',
    chineseName: '胎菊',
    englishName: 'Flos Chrysanthemi',
    pinyinName: 'taiju',
    sku: 'TJ',
    description: '传统中药胎菊，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0956,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_061',
    name: '麦冬',
    chineseName: '麦冬',
    englishName: 'Radix Ophiopogonis',
    pinyinName: 'maidong',
    sku: 'MD',
    description: '传统中药麦冬，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0913,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_062',
    name: '谷精草',
    chineseName: '谷精草',
    englishName: 'Flos Eriocauli',
    pinyinName: 'gujingcao',
    sku: 'GJC',
    description: '传统中药谷精草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0826,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_063',
    name: '蜜升麻',
    chineseName: '蜜升麻',
    englishName: 'Rhizoma Cimicifugae',
    pinyinName: 'mishengma',
    sku: 'MSM',
    description: '传统中药蜜升麻，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.08696,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_064',
    name: '升麻',
    chineseName: '升麻',
    englishName: 'Rhizoma Cimicifugae',
    pinyinName: 'shengma',
    sku: 'SM',
    description: '传统中药升麻，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.08696,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_065',
    name: '白术统货',
    chineseName: '白术统货',
    englishName: 'Rhizoma Atractylodis Macrocephalae',
    pinyinName: 'baizhutonghuo',
    sku: 'BZTH',
    description: '化痰散结白术统货，用于痰湿内阻，咳嗽痰多。',
    category: '化痰药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.1,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_066',
    name: '海玉竹',
    chineseName: '海玉竹',
    englishName: 'Rhizoma Polygonati Odorati',
    pinyinName: 'haiyuzhu',
    sku: 'HYZ',
    description: '传统中药海玉竹，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0942,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_067',
    name: '原枝黄芪条',
    chineseName: '原枝黄芪条',
    englishName: 'Radix Astragali',
    pinyinName: 'yuanzhihuangqitiao',
    sku: 'YZHQT',
    description: '补益原枝黄芪条，用于调补身体，增强体质。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.09295,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_068',
    name: '海螵蛸',
    chineseName: '海螵蛸',
    englishName: 'Endoconcha Sepiae',
    pinyinName: 'haipiaoshao',
    sku: 'HPS',
    description: '传统中药海螵蛸，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.06956,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_069',
    name: '黑灵芝',
    chineseName: '黑灵芝',
    englishName: 'Ganoderma',
    pinyinName: 'heilingzhi',
    sku: 'HLZ',
    description: '传统中药黑灵芝，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.052,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_070',
    name: '巴戟天',
    chineseName: '巴戟天',
    englishName: 'Radix Morindae Officinalis',
    pinyinName: 'bajitian',
    sku: 'BJT',
    description: '传统中药巴戟天，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.07392,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_071',
    name: '龙脷叶',
    chineseName: '龙脷叶',
    englishName: 'Folium Sauropi',
    pinyinName: 'longliye',
    sku: 'LLY',
    description: '传统中药龙脷叶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.06956,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_072',
    name: '人参花',
    chineseName: '人参花',
    englishName: 'renshenhua',
    pinyinName: 'renshenhua',
    sku: 'RSH',
    description: '补益人参花，用于调补身体，增强体质。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.08348,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_073',
    name: '白豆蔻',
    chineseName: '白豆蔻',
    englishName: 'Fructus Amomi Rotundus',
    pinyinName: 'baidoukou',
    sku: 'BDK',
    description: '传统中药白豆蔻，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0313,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_074',
    name: '钩藤',
    chineseName: '钩藤',
    englishName: 'Ramulus Uncariae cum Uncis',
    pinyinName: 'gouteng',
    sku: 'GT',
    description: '传统中药钩藤，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.07566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_075',
    name: '玫瑰花',
    chineseName: '玫瑰花',
    englishName: 'Flos Rosae Chinensis',
    pinyinName: 'meiguihua',
    sku: 'MGH',
    description: '传统中药玫瑰花，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.06956,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_076',
    name: '沙苑子',
    chineseName: '沙苑子',
    englishName: 'Semen Astragali Complanati',
    pinyinName: 'shayuanzi',
    sku: 'SYZ',
    description: '传统中药沙苑子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.07826,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_077',
    name: '郁李仁',
    chineseName: '郁李仁',
    englishName: 'Semen Pruni',
    pinyinName: 'yuliren',
    sku: 'YLR',
    description: '传统中药郁李仁，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.06956,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_078',
    name: '南沙参',
    chineseName: '南沙参',
    englishName: 'Radix Adenophorae',
    pinyinName: 'nanshashen',
    sku: 'NSS',
    description: '传统中药南沙参，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.07218,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_079',
    name: '花椒',
    chineseName: '花椒',
    englishName: 'Pericarpium Zanthoxyli',
    pinyinName: 'huajiao',
    sku: 'HJ',
    description: '传统中药花椒，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.07826,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_080',
    name: '前胡',
    chineseName: '前胡',
    englishName: 'Radix Peucedani',
    pinyinName: 'qianhu',
    sku: 'qianhu',
    description: '传统中药前胡，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.06956,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_081',
    name: '燀桃仁',
    chineseName: '燀桃仁',
    englishName: 'Semen Persicae',
    pinyinName: 'chantaoren',
    sku: 'CTR',
    description: '活血化瘀燀桃仁，用于血瘀证候，改善血液循环。',
    category: '活血药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05218,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_082',
    name: '炒白芍',
    chineseName: '炒白芍',
    englishName: 'Radix Paeoniae Alba',
    pinyinName: 'chaobaishao',
    sku: 'CBS',
    description: '传统中药炒白芍，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.07826,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_083',
    name: '苍术',
    chineseName: '苍术',
    englishName: 'Rhizoma Atractylodis',
    pinyinName: 'cangzhu',
    sku: 'CZ',
    description: '化痰散结苍术，用于痰湿内阻，咳嗽痰多。',
    category: '化痰药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.06522,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_084',
    name: '龙牙百合',
    chineseName: '龙牙百合',
    englishName: 'Bulbus Lilii',
    pinyinName: 'longyabaihe',
    sku: 'LYBH',
    description: '传统中药龙牙百合，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.07652,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_085',
    name: '黑枸杞',
    chineseName: '黑枸杞',
    englishName: 'Lycium ruthenicum Murr',
    pinyinName: 'heigouqi',
    sku: 'HGQ',
    description: '补益黑枸杞，用于调补身体，增强体质。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0652,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_086',
    name: '黄精',
    chineseName: '黄精',
    englishName: 'Rhizoma Polygonati',
    pinyinName: 'huangjing',
    sku: 'huangjing',
    description: '传统中药黄精，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.050433333,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_087',
    name: '柴胡',
    chineseName: '柴胡',
    englishName: 'Radix Bupleuri',
    pinyinName: 'chaihu',
    sku: 'CH',
    description: '传统中药柴胡，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_088',
    name: '炒黄柏',
    chineseName: '炒黄柏',
    englishName: 'Cortex Phellodendri',
    pinyinName: 'chaohuangbai',
    sku: 'CHB',
    description: '传统中药炒黄柏，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_089',
    name: '赤芍',
    chineseName: '赤芍',
    englishName: 'Radix Paeoniae Rubra',
    pinyinName: 'chishao',
    sku: 'CS',
    description: '传统中药赤芍，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04852,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_090',
    name: '地骨皮',
    chineseName: '地骨皮',
    englishName: 'Cortex Lycii',
    pinyinName: 'digupi',
    sku: 'DGP',
    description: '传统中药地骨皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.06522,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_091',
    name: '藁本',
    chineseName: '藁本',
    englishName: 'Rhizoma Ligustici',
    pinyinName: 'gaoben',
    sku: 'GB',
    description: '传统中药藁本，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.06522,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_092',
    name: '黄柏',
    chineseName: '黄柏',
    englishName: 'Cortex Phellodendri',
    pinyinName: 'huangbai',
    sku: 'HB',
    description: '传统中药黄柏，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_093',
    name: '莲子芯',
    chineseName: '莲子芯',
    englishName: 'Plumula Nelumbinis',
    pinyinName: 'lianzixin',
    sku: 'LZX',
    description: '传统中药莲子芯，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05652,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_094',
    name: '洛神花',
    chineseName: '洛神花',
    englishName: 'Hibiscus sabdariffa',
    pinyinName: 'luoshenhua',
    sku: 'LSH',
    description: '传统中药洛神花，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.06522,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_095',
    name: '马勃',
    chineseName: '马勃',
    englishName: 'Carpophorum Calvatial Lilacinae',
    pinyinName: 'mabo',
    sku: 'MB',
    description: '传统中药马勃，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.06086,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_096',
    name: '山茱萸',
    chineseName: '山茱萸',
    englishName: 'Fructus Corni',
    pinyinName: 'shanzhuyu',
    sku: 'SZY',
    description: '传统中药山茱萸，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.06086,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_097',
    name: '威灵仙',
    chineseName: '威灵仙',
    englishName: 'Radix Clematidis',
    pinyinName: 'weilingxian',
    sku: 'WLX',
    description: '传统中药威灵仙，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_098',
    name: '月季花',
    chineseName: '月季花',
    englishName: 'Flos Rosae Chinensis',
    pinyinName: 'yuejihua',
    sku: 'YJH',
    description: '传统中药月季花，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.06522,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_099',
    name: '白芍小圆片',
    chineseName: '白芍小圆片',
    englishName: 'Radix Paeoniae Alba',
    pinyinName: 'baishaoxiaoyuanpian',
    sku: 'BSXYP',
    description: '传统中药白芍小圆片，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_100',
    name: '无硫玉竹',
    chineseName: '无硫玉竹',
    englishName: 'Rhizoma Polygonati Odorati',
    pinyinName: 'wuliuyuzhu',
    sku: 'WLYZ',
    description: '传统中药无硫玉竹，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0694,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_101',
    name: '合欢花',
    chineseName: '合欢花',
    englishName: 'Flos Albiziae',
    pinyinName: 'hehuanhua',
    sku: 'HHH',
    description: '传统中药合欢花，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.06086,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_102',
    name: '炒陈皮丝',
    chineseName: '炒陈皮丝',
    englishName: 'Pericarpium Citri Reticulatae',
    pinyinName: 'chaochenpisi',
    sku: 'CCPS',
    description: '理气调中炒陈皮丝，用于气机失调，脘腹胀痛。',
    category: '理气药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_103',
    name: '琥珀',
    chineseName: '琥珀',
    englishName: 'Succinum',
    pinyinName: 'hupo',
    sku: 'HP',
    description: '传统中药琥珀，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.06522,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_104',
    name: '桔梗',
    chineseName: '桔梗',
    englishName: 'Radix Platycodonis',
    pinyinName: 'jiegeng',
    sku: 'JG',
    description: '止咳化痰桔梗，用于咳嗽痰多，润肺止咳。',
    category: '止咳药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04244,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_105',
    name: '砂仁',
    chineseName: '砂仁',
    englishName: 'Fructus Amomi',
    pinyinName: 'sharen',
    sku: 'SR',
    description: '传统中药砂仁，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04348,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_106',
    name: '徐长卿',
    chineseName: '徐长卿',
    englishName: 'Radix Cynanchi Paniculati',
    pinyinName: 'xuchangqing',
    sku: 'XCQ',
    description: '传统中药徐长卿，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05652,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_107',
    name: '五味子',
    chineseName: '五味子',
    englishName: 'Fructus Schisandrae Chinensis',
    pinyinName: 'wuweizi',
    sku: 'WWZ',
    description: '传统中药五味子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0426,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_108',
    name: '白莲子',
    chineseName: '白莲子',
    englishName: 'Semen Nelumbinis',
    pinyinName: 'bailianzi',
    sku: 'BLZ',
    description: '传统中药白莲子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.06522,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_109',
    name: '北沙参节',
    chineseName: '北沙参节',
    englishName: 'Radix Glehniae',
    pinyinName: 'beishashenjie',
    sku: 'BSSJ',
    description: '传统中药北沙参节，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05392,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_110',
    name: '黄芩',
    chineseName: '黄芩',
    englishName: 'Radix Scutellariae',
    pinyinName: 'huangqin',
    sku: 'HQ',
    description: '传统中药黄芩，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0513,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_111',
    name: '当归尾',
    chineseName: '当归尾',
    englishName: 'Radix Angelicae Sinensis',
    pinyinName: 'dangguiwei',
    sku: 'DGW',
    description: '补益当归尾，用于调补身体，增强体质。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_112',
    name: '人参叶',
    chineseName: '人参叶',
    englishName: 'RenshenYe',
    pinyinName: 'renshenye',
    sku: 'RSY',
    description: '补益人参叶，用于调补身体，增强体质。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05218,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_113',
    name: '旋覆花',
    chineseName: '旋覆花',
    englishName: 'Flos Inulae',
    pinyinName: 'xuanfuhua',
    sku: 'XFH',
    description: '传统中药旋覆花，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05216,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_114',
    name: '野菊花',
    chineseName: '野菊花',
    englishName: 'Flos Chrysanthemi Indici',
    pinyinName: 'yejuhua',
    sku: 'yejuhua',
    description: '清热解毒野菊花，用于热性病证，清除内热。',
    category: '清热药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04782,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_115',
    name: '皂角刺',
    chineseName: '皂角刺',
    englishName: 'Spina Gleditsiae',
    pinyinName: 'zaojiaoci',
    sku: 'ZJC',
    description: '传统中药皂角刺，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04782,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_116',
    name: '茯神',
    chineseName: '茯神',
    englishName: 'Poria cum Radix Pini',
    pinyinName: 'fushen',
    sku: 'FS',
    description: '传统中药茯神，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04696,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_117',
    name: '黄芪顶切',
    chineseName: '黄芪顶切',
    englishName: 'Radix Astragali',
    pinyinName: 'huangqidingqie',
    sku: 'HQDQ',
    description: '补益黄芪顶切，用于调补身体，增强体质。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04696,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_118',
    name: '石菖蒲片',
    chineseName: '石菖蒲片',
    englishName: 'Rhizoma Acori Talarinowii',
    pinyinName: 'shichangpupian',
    sku: 'SCPP',
    description: '传统中药石菖蒲片，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_119',
    name: '锁阳',
    chineseName: '锁阳',
    englishName: 'Herba Cynomorii',
    pinyinName: 'suoyang',
    sku: 'SY',
    description: '传统中药锁阳，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05218,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_120',
    name: '百部',
    chineseName: '百部',
    englishName: 'Radix Stemonae',
    pinyinName: 'baibu',
    sku: 'BB',
    description: '传统中药百部，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0487,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_121',
    name: '橘红片',
    chineseName: '橘红片',
    englishName: 'Exocarpium Citri Rubrum',
    pinyinName: 'juhongpian',
    sku: 'JHP',
    description: '传统中药橘红片，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05652,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_122',
    name: '炙百部',
    chineseName: '炙百部',
    englishName: 'Radix Stemonae',
    pinyinName: 'zhibaibu',
    sku: 'ZBB',
    description: '传统中药炙百部，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0487,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_123',
    name: '佛手',
    chineseName: '佛手',
    englishName: 'Fructus Citri Sarcodactylis',
    pinyinName: 'foshou',
    sku: 'foshou',
    description: '理气调中佛手，用于气机失调，脘腹胀痛。',
    category: '理气药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04348,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_124',
    name: '白前',
    chineseName: '白前',
    englishName: 'Rhizoma Cynanchi Stauntonii',
    pinyinName: 'baiqian',
    sku: 'BQ',
    description: '传统中药白前，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04782,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_125',
    name: '车前子',
    chineseName: '车前子',
    englishName: 'Semen Plantaginis',
    pinyinName: 'cheqianzi',
    sku: 'CQZ',
    description: '传统中药车前子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03086,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_126',
    name: '虫草花',
    chineseName: '虫草花',
    englishName: 'Hemerocallis citrina Baroni',
    pinyinName: 'chongcaohua',
    sku: 'CCH',
    description: '传统中药虫草花，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04782,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_127',
    name: '瓜蒌',
    chineseName: '瓜蒌',
    englishName: 'Fructus Trichosanthis',
    pinyinName: 'gualou',
    sku: 'GL',
    description: '传统中药瓜蒌，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_128',
    name: '鬼羽箭',
    chineseName: '鬼羽箭',
    englishName: 'Buchnera cruciata Hamilt',
    pinyinName: 'guiyujian',
    sku: 'GYJ',
    description: '传统中药鬼羽箭，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_129',
    name: '怀牛膝',
    chineseName: '怀牛膝',
    englishName: 'Radix Achyranthis Bidentatae',
    pinyinName: 'huainiuxi',
    sku: 'HNX',
    description: '传统中药怀牛膝，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04348,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_130',
    name: '金果榄',
    chineseName: '金果榄',
    englishName: 'Radix Tinosporae',
    pinyinName: 'jinguolan',
    sku: 'JGL',
    description: '传统中药金果榄，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_131',
    name: '荆芥穗',
    chineseName: '荆芥穗',
    englishName: 'Herba Schizonepetae',
    pinyinName: 'jingjiesui',
    sku: 'JJS',
    description: '传统中药荆芥穗，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05218,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_132',
    name: '牛大力',
    chineseName: '牛大力',
    englishName: 'Millettia Speciosa',
    pinyinName: 'niudali',
    sku: 'NDL',
    description: '传统中药牛大力，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04782,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_133',
    name: '天冬',
    chineseName: '天冬',
    englishName: 'Radix Asparagi',
    pinyinName: 'tiandong',
    sku: 'TD',
    description: '传统中药天冬，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03826,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_134',
    name: '五加皮',
    chineseName: '五加皮',
    englishName: 'Cortex Acanthopanacis',
    pinyinName: 'wujiapi',
    sku: 'WJP',
    description: '传统中药五加皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04782,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_135',
    name: '玉竹特级',
    chineseName: '玉竹特级',
    englishName: 'Rhizoma Polygonati Odorati',
    pinyinName: 'yuzhuteji',
    sku: 'YZTJ',
    description: '传统中药玉竹特级，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05652,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_136',
    name: '鸡骨草',
    chineseName: '鸡骨草',
    englishName: 'Chikoo Herb',
    pinyinName: 'jigucao',
    sku: 'JGC',
    description: '传统中药鸡骨草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0608,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_137',
    name: '仙茅',
    chineseName: '仙茅',
    englishName: 'Rhizoma Curculiginis',
    pinyinName: 'xianmao',
    sku: 'XM',
    description: '传统中药仙茅，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04782,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_138',
    name: '千层纸',
    chineseName: '千层纸',
    englishName: 'Oroxylum indicum  Kurz',
    pinyinName: 'qiancengzhi',
    sku: 'QCZ',
    description: '传统中药千层纸，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04782,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_139',
    name: '煅龙骨',
    chineseName: '煅龙骨',
    englishName: 'Os Draconis Ustum',
    pinyinName: 'duanlonggu',
    sku: 'DLG',
    description: '安神定志煅龙骨，用于心神不宁，失眠健忘。',
    category: '安神药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04782,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_140',
    name: '防风',
    chineseName: '防风',
    englishName: 'Radix Saposhnikoviae',
    pinyinName: 'fangfeng',
    sku: 'FF',
    description: '传统中药防风，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0487,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_141',
    name: '千斤拔',
    chineseName: '千斤拔',
    englishName: 'Radix Flemingia philippinensis',
    pinyinName: 'qianjinba',
    sku: 'QJB',
    description: '传统中药千斤拔，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_142',
    name: '乳香',
    chineseName: '乳香',
    englishName: 'Olibanum',
    pinyinName: 'ruxiang',
    sku: 'RX',
    description: '传统中药乳香，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04348,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_143',
    name: '五指毛桃',
    chineseName: '五指毛桃',
    englishName: 'Ficus Simplicissima Lour',
    pinyinName: 'wuzhimoutao',
    sku: 'WZMT',
    description: '传统中药五指毛桃，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04348,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_144',
    name: '即食桑椹子',
    chineseName: '即食桑椹子',
    englishName: 'Fructus Mori 300g',
    pinyinName: 'jishisangshenzi',
    sku: 'JSSSZ',
    description: '传统中药即食桑椹子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.046366667,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_145',
    name: '荜茇',
    chineseName: '荜茇',
    englishName: 'Fructus Piperis Longi',
    pinyinName: 'biba',
    sku: 'biba',
    description: '传统中药荜茇，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04348,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_146',
    name: '桂圆特级',
    chineseName: '桂圆特级',
    englishName: 'Arillus Longan',
    pinyinName: 'guiyuanteji',
    sku: 'GYTJ',
    description: '传统中药桂圆特级，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05218,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_147',
    name: '紫草茸',
    chineseName: '紫草茸',
    englishName: 'Laccifer lacca Kerr.',
    pinyinName: 'zicaorong',
    sku: 'ZCR',
    description: '传统中药紫草茸，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04522,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_148',
    name: '无花果',
    chineseName: '无花果',
    englishName: 'Ficus Caric',
    pinyinName: 'wuhuaguo',
    sku: 'WHG',
    description: '传统中药无花果，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.052333333,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_149',
    name: '茯苓卷',
    chineseName: '茯苓卷',
    englishName: 'Poria',
    pinyinName: 'fulingjuan',
    sku: 'FLJ',
    description: '化痰散结茯苓卷，用于痰湿内阻，咳嗽痰多。',
    category: '化痰药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.046083333,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_150',
    name: '百合小片',
    chineseName: '百合小片',
    englishName: 'Bulbus Lilii',
    pinyinName: 'baihexiaopian',
    sku: 'BHXP',
    description: '传统中药百合小片，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04434,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_151',
    name: '丁香',
    chineseName: '丁香',
    englishName: 'Flos Caryophylli',
    pinyinName: 'dingxiang',
    sku: 'DX',
    description: '传统中药丁香，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04782,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_152',
    name: '桂皮粉 +B149',
    chineseName: '桂皮粉 +B149',
    englishName: 'Cortex Cinnamomi Powder',
    pinyinName: 'guipifen+b149',
    sku: 'GPF',
    description: '传统中药桂皮粉 +B149，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05218,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_153',
    name: '杭菊花',
    chineseName: '杭菊花',
    englishName: 'Flos Chrysanthemi',
    pinyinName: 'hangjuhua',
    sku: 'HJH',
    description: '传统中药杭菊花，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_154',
    name: '绞股蓝',
    chineseName: '绞股蓝',
    englishName: 'Herba Gynostemmatis',
    pinyinName: 'jiaogulan',
    sku: 'jiaogulan',
    description: '传统中药绞股蓝，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04348,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_155',
    name: '腊梅花',
    chineseName: '腊梅花',
    englishName: 'Flos Chimonanthi Praecocis',
    pinyinName: 'lameihua',
    sku: 'LMH',
    description: '传统中药腊梅花，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04348,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_156',
    name: '梅花椒',
    chineseName: '梅花椒',
    englishName: 'Pericarpium Zanthoxyli',
    pinyinName: 'meihuajiao',
    sku: 'MHJ',
    description: '传统中药梅花椒，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_157',
    name: '熟地大片',
    chineseName: '熟地大片',
    englishName: 'Radix Rehmanniae Preparata',
    pinyinName: 'shudidapian',
    sku: 'SDDP',
    description: '补益熟地大片，用于调补身体，增强体质。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03478,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_158',
    name: '特级红花椒',
    chineseName: '特级红花椒',
    englishName: 'Pericarpium Zanthoxyli',
    pinyinName: 'tejihonghuajiao',
    sku: 'TJHHJ',
    description: '活血化瘀特级红花椒，用于血瘀证候，改善血液循环。',
    category: '活血药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_159',
    name: '吴茱萸',
    chineseName: '吴茱萸',
    englishName: 'Fructus Evodiae',
    pinyinName: 'wuzhuyu',
    sku: 'WZY',
    description: '传统中药吴茱萸，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_160',
    name: '郁金',
    chineseName: '郁金',
    englishName: 'Radix Curcumae Wenyujin',
    pinyinName: 'yujin',
    sku: 'YJ',
    description: '传统中药郁金，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_161',
    name: '生地大片',
    chineseName: '生地大片',
    englishName: 'Radix Rehmanniae',
    pinyinName: 'shengdidapian',
    sku: 'shengdidapian',
    description: '传统中药生地大片，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.034766667,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_162',
    name: '即食脱皮去核红枣',
    chineseName: '即食脱皮去核红枣',
    englishName: 'Fructus Jujubae Seedless',
    pinyinName: 'jishituopiquhehongzao',
    sku: 'JSTPQHHZ',
    description: '传统中药即食脱皮去核红枣，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.05215,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_163',
    name: '香叶',
    chineseName: '香叶',
    englishName: 'Laurus nobilis',
    pinyinName: 'xiangye',
    sku: 'xiangye',
    description: '传统中药香叶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0129,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_164',
    name: '鹿衔草',
    chineseName: '鹿衔草',
    englishName: 'Herba Pyrolae',
    pinyinName: 'luxiancao',
    sku: 'LXC',
    description: '传统中药鹿衔草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03478,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_165',
    name: '秦艽',
    chineseName: '秦艽',
    englishName: 'Radix Gentianae Macrophyllae',
    pinyinName: 'qinjiao',
    sku: 'QJ',
    description: '传统中药秦艽，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_166',
    name: '五倍子',
    chineseName: '五倍子',
    englishName: 'Galla Chinensis',
    pinyinName: 'wubeizi',
    sku: 'WBZ',
    description: '传统中药五倍子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03826,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_167',
    name: '知母',
    chineseName: '知母',
    englishName: 'Rhizoma Anemarrhenae',
    pinyinName: 'zhimu',
    sku: 'ZM',
    description: '传统中药知母，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03392,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_168',
    name: '炒丹皮',
    chineseName: '炒丹皮',
    englishName: 'Cortex Moutan',
    pinyinName: 'chaodanpi',
    sku: 'CDP',
    description: '传统中药炒丹皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_169',
    name: '川牛膝',
    chineseName: '川牛膝',
    englishName: 'Radix Cyathulae',
    pinyinName: 'chuanniuxi',
    sku: 'CNX',
    description: '传统中药川牛膝，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_170',
    name: '金樱子',
    chineseName: '金樱子',
    englishName: 'Fructus Rosae Laevigatae',
    pinyinName: 'jinyingzi',
    sku: 'JYZ',
    description: '传统中药金樱子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_171',
    name: '橘核',
    chineseName: '橘核',
    englishName: 'Semen Citri Reticulatae',
    pinyinName: 'juhe',
    sku: 'JH',
    description: '传统中药橘核，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_172',
    name: '没药',
    chineseName: '没药',
    englishName: 'Myrrha',
    pinyinName: 'moyao',
    sku: 'MY',
    description: '传统中药没药，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_173',
    name: '桑白皮',
    chineseName: '桑白皮',
    englishName: 'Cortex Mori',
    pinyinName: 'sangbaipi',
    sku: 'SBP',
    description: '传统中药桑白皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_174',
    name: '薤白',
    chineseName: '薤白',
    englishName: 'Bulbus Allii Macrostemonis',
    pinyinName: 'xiebai',
    sku: 'XB',
    description: '传统中药薤白，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_175',
    name: '辛夷',
    chineseName: '辛夷',
    englishName: 'Magnolia Bionii',
    pinyinName: 'xinyi',
    sku: 'xinyi',
    description: '传统中药辛夷，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_176',
    name: '紫丹参片',
    chineseName: '紫丹参片',
    englishName: 'Radix Salviae Miltiorrhizae',
    pinyinName: 'zidanshenpian',
    sku: 'ZDSP',
    description: '活血化瘀紫丹参片，用于血瘀证候，改善血液循环。',
    category: '活血药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_177',
    name: '淫羊藿',
    chineseName: '淫羊藿',
    englishName: 'Herba Epimedii',
    pinyinName: 'yinyanghuo',
    sku: 'YYH',
    description: '传统中药淫羊藿，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_178',
    name: '瓜蒌仁',
    chineseName: '瓜蒌仁',
    englishName: 'Semen Trichosanthis',
    pinyinName: 'gualouren',
    sku: 'GLR',
    description: '传统中药瓜蒌仁，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_179',
    name: '射干',
    chineseName: '射干',
    englishName: 'Rhizoma Belamcandae',
    pinyinName: 'shegan',
    sku: 'SG',
    description: '传统中药射干，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_180',
    name: '大蓟',
    chineseName: '大蓟',
    englishName: 'Herba Cirsii Japonici',
    pinyinName: 'daji',
    sku: 'DJ',
    description: '传统中药大蓟，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03826,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_181',
    name: '蜜桑白皮',
    chineseName: '蜜桑白皮',
    englishName: 'Cortex Mori',
    pinyinName: 'misangbaipi',
    sku: 'MSBP',
    description: '传统中药蜜桑白皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_182',
    name: '炙黄芪',
    chineseName: '炙黄芪',
    englishName: 'Radix Astragali',
    pinyinName: 'zhihuangqi',
    sku: 'ZHQ',
    description: '补益炙黄芪，用于调补身体，增强体质。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_183',
    name: '八角',
    chineseName: '八角',
    englishName: 'Fructus Anisi Stellati',
    pinyinName: 'bajiao',
    sku: 'BJ',
    description: '传统中药八角，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03434,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_184',
    name: '茺蔚子',
    chineseName: '茺蔚子',
    englishName: 'Fructus Leonuri',
    pinyinName: 'chongweizi',
    sku: 'CWZ',
    description: '传统中药茺蔚子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03478,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_185',
    name: '大黄',
    chineseName: '大黄',
    englishName: 'Radix et Rhizoma Rhei',
    pinyinName: 'dahuang',
    sku: 'DH',
    description: '传统中药大黄，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04348,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_186',
    name: '甘草',
    chineseName: '甘草',
    englishName: 'Radix Glycyrrhizae',
    pinyinName: 'gancao',
    sku: 'GC',
    description: '传统中药甘草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_187',
    name: '骨碎补',
    chineseName: '骨碎补',
    englishName: 'Rhizoma Drynariae',
    pinyinName: 'gusuibu',
    sku: 'GSB',
    description: '传统中药骨碎补，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03652,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_188',
    name: '蒺藜',
    chineseName: '蒺藜',
    englishName: 'Fructus Tribuli',
    pinyinName: 'jili',
    sku: 'JL',
    description: '传统中药蒺藜，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02782,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_189',
    name: '焦栀子',
    chineseName: '焦栀子',
    englishName: 'Fructus Gardeniae',
    pinyinName: 'jiaozhizi',
    sku: 'JZZ',
    description: '传统中药焦栀子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03652,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_190',
    name: '酒大黄',
    chineseName: '酒大黄',
    englishName: 'Radix et Rhizoma Rhei',
    pinyinName: 'jiudahuang',
    sku: 'JDH',
    description: '传统中药酒大黄，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_191',
    name: '明党参',
    chineseName: '明党参',
    englishName: 'Radix Changii',
    pinyinName: 'mingdangshen',
    sku: 'MDS',
    description: '补益明党参，用于调补身体，增强体质。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_192',
    name: '木香',
    chineseName: '木香',
    englishName: 'Radix Aucklandiae',
    pinyinName: 'muxiang',
    sku: 'MX',
    description: '理气调中木香，用于气机失调，脘腹胀痛。',
    category: '理气药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02608,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_193',
    name: '土茯苓',
    chineseName: '土茯苓',
    englishName: 'Rhizoma Smilacis Glabrae',
    pinyinName: 'tufuling',
    sku: 'TFL',
    description: '化痰散结土茯苓，用于痰湿内阻，咳嗽痰多。',
    category: '化痰药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_194',
    name: '栀子',
    chineseName: '栀子',
    englishName: 'Fructus Gardeniae',
    pinyinName: 'zhizi',
    sku: 'ZZ',
    description: '传统中药栀子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03652,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_195',
    name: '炙甘草',
    chineseName: '炙甘草',
    englishName: 'Radix Glycyrrhizae',
    pinyinName: 'zhigancao',
    sku: 'ZGC',
    description: '传统中药炙甘草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_196',
    name: '炙首乌',
    chineseName: '炙首乌',
    englishName: 'Radix Polygoni Multiflori',
    pinyinName: 'zhishouwu',
    sku: 'ZSW',
    description: '传统中药炙首乌，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_197',
    name: '芡实',
    chineseName: '芡实',
    englishName: 'Semen Euryales',
    pinyinName: 'qianshi',
    sku: 'QS',
    description: '传统中药芡实，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.04125,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_198',
    name: '北杏仁',
    chineseName: '北杏仁',
    englishName: 'North Almond',
    pinyinName: 'beixingren',
    sku: 'BXR',
    description: '止咳化痰北杏仁，用于咳嗽痰多，润肺止咳。',
    category: '止咳药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0412,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_199',
    name: '南杏仁',
    chineseName: '南杏仁',
    englishName: 'Semen Armeniacae Amarum',
    pinyinName: 'nanxingren',
    sku: 'NXR',
    description: '止咳化痰南杏仁，用于咳嗽痰多，润肺止咳。',
    category: '止咳药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0412,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_200',
    name: '鹅不食草',
    chineseName: '鹅不食草',
    englishName: 'Herba Centipedae',
    pinyinName: 'ebushicao',
    sku: 'EBSC',
    description: '传统中药鹅不食草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03478,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_201',
    name: '草果',
    chineseName: '草果',
    englishName: 'Amomum Tsaoko',
    pinyinName: 'caoguo',
    sku: 'CG',
    description: '传统中药草果，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0278,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_202',
    name: '千年健',
    chineseName: '千年健',
    englishName: 'Rhizoma Homalomenae',
    pinyinName: 'qiannianjian',
    sku: 'QNJ',
    description: '传统中药千年健，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03392,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_203',
    name: '天花粉',
    chineseName: '天花粉',
    englishName: 'Radix Trichosanthis',
    pinyinName: 'tianhuafen',
    sku: 'THF',
    description: '传统中药天花粉，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03478,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_204',
    name: '夏枯草',
    chineseName: '夏枯草',
    englishName: 'Spica Prunellae',
    pinyinName: 'xiakucao',
    sku: 'XKC',
    description: '传统中药夏枯草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02784,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_205',
    name: '黑桂圆',
    chineseName: '黑桂圆',
    englishName: 'Arillus Longan',
    pinyinName: 'heiguiyuan',
    sku: 'HGY',
    description: '传统中药黑桂圆，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03218,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_206',
    name: '肉桂',
    chineseName: '肉桂',
    englishName: 'Cortex Cinnamomi',
    pinyinName: 'rougui',
    sku: 'RG',
    description: '传统中药肉桂，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03434,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_207',
    name: '白芷长片',
    chineseName: '白芷长片',
    englishName: 'Radix Angelicae Dahuricae',
    pinyinName: 'baizhichangpian',
    sku: 'BZCP',
    description: '传统中药白芷长片，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0253,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_208',
    name: '丹参粒',
    chineseName: '丹参粒',
    englishName: 'Radix Salviae Miltiorrhizae',
    pinyinName: 'danshenli',
    sku: 'DSL',
    description: '活血化瘀丹参粒，用于血瘀证候，改善血液循环。',
    category: '活血药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_209',
    name: '红莲子',
    chineseName: '红莲子',
    englishName: 'Semen Nelumbinis',
    pinyinName: 'honglianzi',
    sku: 'honglianzi',
    description: '传统中药红莲子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_210',
    name: '墨旱莲',
    chineseName: '墨旱莲',
    englishName: 'Herba Ecliptae',
    pinyinName: 'mohanlian',
    sku: 'MHL',
    description: '传统中药墨旱莲，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0313,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_211',
    name: '山药',
    chineseName: '山药',
    englishName: 'Dioscorea Opposita',
    pinyinName: 'shanyao',
    sku: 'shanyao',
    description: '传统中药山药，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0374,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_212',
    name: '蛇床子',
    chineseName: '蛇床子',
    englishName: 'Fructus Cnidii',
    pinyinName: 'shechuangzi',
    sku: 'SCZ',
    description: '传统中药蛇床子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0313,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_213',
    name: '乌药',
    chineseName: '乌药',
    englishName: 'Radix Linderae',
    pinyinName: 'wuyao',
    sku: 'WY',
    description: '传统中药乌药，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_214',
    name: '益智仁',
    chineseName: '益智仁',
    englishName: 'Fructus Alpiniae Oxyphyllae',
    pinyinName: 'yizhiren',
    sku: 'YZR',
    description: '传统中药益智仁，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_215',
    name: '黄杭菊',
    chineseName: '黄杭菊',
    englishName: 'Flos Chrysanthemi',
    pinyinName: 'huanghangju',
    sku: 'HHJ',
    description: '传统中药黄杭菊，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03848,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_216',
    name: '紫苏叶',
    chineseName: '紫苏叶',
    englishName: 'Folium Perillae',
    pinyinName: 'zisuye',
    sku: 'ZSY',
    description: '传统中药紫苏叶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_217',
    name: '炒苏子',
    chineseName: '炒苏子',
    englishName: 'Fructus Perillae',
    pinyinName: 'chaosuzi',
    sku: 'CSZ',
    description: '传统中药炒苏子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_218',
    name: '杜仲炭',
    chineseName: '杜仲炭',
    englishName: 'Cortex Eucommiae',
    pinyinName: 'duzhongtan',
    sku: 'DZT',
    description: '补益杜仲炭，用于调补身体，增强体质。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0287,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_219',
    name: '干姜',
    chineseName: '干姜',
    englishName: 'Rhizoma Zingiberis',
    pinyinName: 'ganjiang',
    sku: 'GJ',
    description: '传统中药干姜，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02218,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_220',
    name: '石韦',
    chineseName: '石韦',
    englishName: 'Folium Pyrrosiae',
    pinyinName: 'shiwei',
    sku: 'SW',
    description: '传统中药石韦，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_221',
    name: '柿蒂',
    chineseName: '柿蒂',
    englishName: 'Calyx Kaki',
    pinyinName: 'shidi',
    sku: 'SD',
    description: '传统中药柿蒂，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_222',
    name: '盐杜仲',
    chineseName: '盐杜仲',
    englishName: 'Cortex Eucommiae',
    pinyinName: 'yanduzhong',
    sku: 'YDZ',
    description: '补益盐杜仲，用于调补身体，增强体质。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0287,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_223',
    name: '地榆炭',
    chineseName: '地榆炭',
    englishName: 'Radix Sanguisorbae',
    pinyinName: 'diyutan',
    sku: 'DYT',
    description: '传统中药地榆炭，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02608,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_224',
    name: '独活',
    chineseName: '独活',
    englishName: 'Radix Angelicae Pubescentis',
    pinyinName: 'duhuo',
    sku: 'duhuo',
    description: '传统中药独活，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0313,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_225',
    name: '高良姜',
    chineseName: '高良姜',
    englishName: 'Rhizoma Alpiniae Officinarum',
    pinyinName: 'gaoliangjiang',
    sku: 'GLJ',
    description: '传统中药高良姜，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_226',
    name: '黄芪',
    chineseName: '黄芪',
    englishName: 'Radix Astragali',
    pinyinName: 'huangqi',
    sku: 'huangqi',
    description: '补益黄芪，用于调补身体，增强体质。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_227',
    name: '爆薏仁',
    chineseName: '爆薏仁',
    englishName: 'Semen Coicis',
    pinyinName: 'baoyiren',
    sku: 'BYR',
    description: '传统中药爆薏仁，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02608,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_228',
    name: '楮实子',
    chineseName: '楮实子',
    englishName: 'Fructus Broussonetiae',
    pinyinName: 'chushizi',
    sku: 'chushizi',
    description: '传统中药楮实子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0287,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_229',
    name: '川芎',
    chineseName: '川芎',
    englishName: 'Rhizoma Chuanxiong',
    pinyinName: 'chuanxiong',
    sku: 'CX',
    description: '活血化瘀川芎，用于血瘀证候，改善血液循环。',
    category: '活血药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03218,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_230',
    name: '刺五加',
    chineseName: '刺五加',
    englishName: 'Radix seu Caulis Acanthopanacis Senticosi',
    pinyinName: 'ciwujia',
    sku: 'CWJ',
    description: '传统中药刺五加，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_231',
    name: '大黄炭',
    chineseName: '大黄炭',
    englishName: 'Radix et Rhizoma Rhei',
    pinyinName: 'dahuangtan',
    sku: 'DHT',
    description: '传统中药大黄炭，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02478,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_232',
    name: '冬凌草',
    chineseName: '冬凌草',
    englishName: 'Rabdosia rubescens',
    pinyinName: 'donglingcao',
    sku: 'DLC',
    description: '传统中药冬凌草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02608,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_233',
    name: '莪术',
    chineseName: '莪术',
    englishName: 'Rhizoma Curcumae',
    pinyinName: 'eshu',
    sku: 'ES',
    description: '传统中药莪术，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03434,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_234',
    name: '麸炒枳壳',
    chineseName: '麸炒枳壳',
    englishName: 'Fructus Aurantii',
    pinyinName: 'fuchaozhike',
    sku: 'FCZK',
    description: '传统中药麸炒枳壳，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02434,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_235',
    name: '茯苓粒',
    chineseName: '茯苓粒',
    englishName: 'Poria',
    pinyinName: 'fulingli',
    sku: 'FLL',
    description: '化痰散结茯苓粒，用于痰湿内阻，咳嗽痰多。',
    category: '化痰药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0313,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_236',
    name: '广藿香',
    chineseName: '广藿香',
    englishName: 'Agastache Rugosa',
    pinyinName: 'guanghuoxiang',
    sku: 'GHX',
    description: '传统中药广藿香，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02696,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_237',
    name: '淮山生晒',
    chineseName: '淮山生晒',
    englishName: 'Dioscorea Opposita',
    pinyinName: 'huaishanshengshai',
    sku: 'HSSS',
    description: '传统中药淮山生晒，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_238',
    name: '炮姜',
    chineseName: '炮姜',
    englishName: 'Rhizoma Zingiberis Praeparata',
    pinyinName: 'paojiang',
    sku: 'PJ',
    description: '传统中药炮姜，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0287,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_239',
    name: '菟丝子',
    chineseName: '菟丝子',
    englishName: 'Semen Cuscutae',
    pinyinName: 'tusizi',
    sku: 'TSZ',
    description: '传统中药菟丝子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02956,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_240',
    name: '珍珠无花果',
    chineseName: '珍珠无花果',
    englishName: 'Ficus Caric',
    pinyinName: 'zhenzhuwuhuaguo',
    sku: 'ZZWHG',
    description: '传统中药珍珠无花果，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.03044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_241',
    name: '枳壳',
    chineseName: '枳壳',
    englishName: 'Fructus Aurantii',
    pinyinName: 'zhike',
    sku: 'ZK',
    description: '传统中药枳壳，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_242',
    name: '乌梅',
    chineseName: '乌梅',
    englishName: 'Fructus Mume',
    pinyinName: 'wumei',
    sku: 'WM',
    description: '传统中药乌梅，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.033,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_243',
    name: '蒲公英',
    chineseName: '蒲公英',
    englishName: 'Herba Taraxaci',
    pinyinName: 'pugongying',
    sku: 'PGY',
    description: '清热解毒蒲公英，用于热性病证，清除内热。',
    category: '清热药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0226,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_244',
    name: '枸杞子',
    chineseName: '枸杞子',
    englishName: 'Fructus Lycii',
    pinyinName: 'gouqizi',
    sku: 'GQZ',
    description: '补益枸杞子，用于调补身体，增强体质。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0313,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_245',
    name: '雪梨干',
    chineseName: '雪梨干',
    englishName: 'Pyrus bretschneideri Rehd',
    pinyinName: 'xueligan',
    sku: 'XLG',
    description: '传统中药雪梨干，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0261,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_246',
    name: '分心木',
    chineseName: '分心木',
    englishName: 'Seminis Juglantis Septum',
    pinyinName: 'fenxinmu',
    sku: 'FXM',
    description: '传统中药分心木，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02608,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_247',
    name: '紫苏子',
    chineseName: '紫苏子',
    englishName: 'Fructus Perillae',
    pinyinName: 'zisuzi',
    sku: 'ZSZ',
    description: '传统中药紫苏子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02434,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_248',
    name: '板蓝根',
    chineseName: '板蓝根',
    englishName: 'Radix Isatidis',
    pinyinName: 'banlangen',
    sku: 'BLG',
    description: '清热解毒板蓝根，用于热性病证，清除内热。',
    category: '清热药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0313,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_249',
    name: '陈皮丝',
    chineseName: '陈皮丝',
    englishName: 'Pericarpium Citri Reticulatae',
    pinyinName: 'chenpisi',
    sku: 'CPS',
    description: '理气调中陈皮丝，用于气机失调，脘腹胀痛。',
    category: '理气药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_250',
    name: '川楝子',
    chineseName: '川楝子',
    englishName: 'Fructus Toosendan',
    pinyinName: 'chuanlianzi',
    sku: 'CLZ',
    description: '传统中药川楝子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_251',
    name: '诃子',
    chineseName: '诃子',
    englishName: 'Fructus Chebulae',
    pinyinName: 'hezi',
    sku: 'HZ',
    description: '传统中药诃子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0226,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_252',
    name: '厚朴',
    chineseName: '厚朴',
    englishName: 'Cortex Magnoliae Officinalis',
    pinyinName: 'houpo',
    sku: 'houpo',
    description: '传统中药厚朴，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02086,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_253',
    name: '槲寄生',
    chineseName: '槲寄生',
    englishName: 'Herba Taxilli',
    pinyinName: 'hujisheng',
    sku: 'hujisheng',
    description: '传统中药槲寄生，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02348,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_254',
    name: '姜黄',
    chineseName: '姜黄',
    englishName: 'Rhizoma Curcumae Longae',
    pinyinName: 'jianghuang',
    sku: 'jianghuang',
    description: '传统中药姜黄，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02608,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_255',
    name: '苦参',
    chineseName: '苦参',
    englishName: 'Radix Sophorae Flavescentis',
    pinyinName: 'kucan',
    sku: 'KC',
    description: '传统中药苦参，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_256',
    name: '龙齿',
    chineseName: '龙齿',
    englishName: 'Os Draconis',
    pinyinName: 'longchi',
    sku: 'longchi',
    description: '传统中药龙齿，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02478,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_257',
    name: '龙骨',
    chineseName: '龙骨',
    englishName: 'Os Draconis',
    pinyinName: 'longgu',
    sku: 'LG',
    description: '安神定志龙骨，用于心神不宁，失眠健忘。',
    category: '安神药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_258',
    name: '木瓜',
    chineseName: '木瓜',
    englishName: 'Fructus Chaenomelis',
    pinyinName: 'mugua',
    sku: 'MG',
    description: '传统中药木瓜，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02522,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_259',
    name: '牛蒡片',
    chineseName: '牛蒡片',
    englishName: 'Arctium Lappa',
    pinyinName: 'niubangpian',
    sku: 'NBP',
    description: '传统中药牛蒡片，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02434,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_260',
    name: '生首乌',
    chineseName: '生首乌',
    englishName: 'Radix Polygoni Multiflori',
    pinyinName: 'shengshouwu',
    sku: 'SSW',
    description: '传统中药生首乌，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_261',
    name: '地肤子',
    chineseName: '地肤子',
    englishName: 'Fructus Kochiae',
    pinyinName: 'difuzi',
    sku: 'DFZ',
    description: '传统中药地肤子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0287,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_262',
    name: '三棱',
    chineseName: '三棱',
    englishName: 'Rhizoma Sparganii',
    pinyinName: 'sanleng',
    sku: 'SL',
    description: '传统中药三棱，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02348,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_263',
    name: '苏木',
    chineseName: '苏木',
    englishName: 'Lignum Sappan',
    pinyinName: 'sumu',
    sku: 'sumu',
    description: '传统中药苏木，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02434,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_264',
    name: '白茅根',
    chineseName: '白茅根',
    englishName: 'Rhizoma Imperatae',
    pinyinName: 'baimaogen',
    sku: 'BMG',
    description: '传统中药白茅根，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_265',
    name: '炒神曲',
    chineseName: '炒神曲',
    englishName: 'Massa Medicata Fermentata',
    pinyinName: 'chaoshenqu',
    sku: 'CSQ',
    description: '传统中药炒神曲，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02086,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_266',
    name: '炒王不留行子',
    chineseName: '炒王不留行子',
    englishName: 'Semen Vaccariae',
    pinyinName: 'chaowangbuliuxingzi',
    sku: 'CWBLXZ',
    description: '传统中药炒王不留行子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02434,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_267',
    name: '川木通',
    chineseName: '川木通',
    englishName: 'Caulis Akebiae Quinatae',
    pinyinName: 'chuanmutong',
    sku: 'CMT',
    description: '传统中药川木通，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02348,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_268',
    name: '垂盆草',
    chineseName: '垂盆草',
    englishName: 'Herba Sedi Sarmentosi',
    pinyinName: 'chuipencao',
    sku: 'CPC',
    description: '传统中药垂盆草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_269',
    name: '韭菜子',
    chineseName: '韭菜子',
    englishName: 'Semen Allii Tuberosi',
    pinyinName: 'jiucaizi',
    sku: 'JCZ',
    description: '传统中药韭菜子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_270',
    name: '六神曲',
    chineseName: '六神曲',
    englishName: 'Massa Medicata Fermentata',
    pinyinName: 'liushenqu',
    sku: 'LSQ',
    description: '传统中药六神曲，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_271',
    name: '炒荆芥',
    chineseName: '炒荆芥',
    englishName: 'Herba Schizonepetae',
    pinyinName: 'chaojingjie',
    sku: 'CJJ',
    description: '传统中药炒荆芥，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_272',
    name: '地榆',
    chineseName: '地榆',
    englishName: 'Radix Sanguisorbae',
    pinyinName: 'diyu',
    sku: 'DY',
    description: '传统中药地榆，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_273',
    name: '海藻',
    chineseName: '海藻',
    englishName: 'Sargassum fusiforme',
    pinyinName: 'haizao',
    sku: 'haizao',
    description: '传统中药海藻，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0226,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_274',
    name: '沙姜片',
    chineseName: '沙姜片',
    englishName: 'Rhizoma Kaempferiae',
    pinyinName: 'shajiangpian',
    sku: 'SJP',
    description: '传统中药沙姜片，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0226,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_275',
    name: '桑叶',
    chineseName: '桑叶',
    englishName: 'Folium Mori',
    pinyinName: 'sangye',
    sku: 'sangye',
    description: '传统中药桑叶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_276',
    name: '矮地茶',
    chineseName: '矮地茶',
    englishName: 'Herba Ardisiae Japonicae',
    pinyinName: 'aidicha',
    sku: 'ADC',
    description: '传统中药矮地茶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02088,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_277',
    name: '艾叶炭',
    chineseName: '艾叶炭',
    englishName: 'Folium Artemisiae Argyi',
    pinyinName: 'aiyetan',
    sku: 'AYT',
    description: '传统中药艾叶炭，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_278',
    name: '冬瓜皮',
    chineseName: '冬瓜皮',
    englishName: 'Exocarpium Benincasae',
    pinyinName: 'dongguapi',
    sku: 'dongguapi',
    description: '传统中药冬瓜皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02348,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_279',
    name: '杜仲丝',
    chineseName: '杜仲丝',
    englishName: 'Cortex Eucommiae',
    pinyinName: 'duzhongsi',
    sku: 'DZS',
    description: '补益杜仲丝，用于调补身体，增强体质。',
    category: '补益药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_280',
    name: '煅石膏',
    chineseName: '煅石膏',
    englishName: 'Gypsum Fibrosum Ustum',
    pinyinName: 'duanshigao',
    sku: 'DSG',
    description: '传统中药煅石膏，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_281',
    name: '葛根',
    chineseName: '葛根',
    englishName: 'Radix Puerariae',
    pinyinName: 'gegen',
    sku: 'GG',
    description: '传统中药葛根，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_282',
    name: '广金钱草',
    chineseName: '广金钱草',
    englishName: 'Herba Lysimachiae',
    pinyinName: 'guangjinqiancao',
    sku: 'GJQC',
    description: '传统中药广金钱草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_283',
    name: '海风藤',
    chineseName: '海风藤',
    englishName: 'Caulis Piperis Kadsurae',
    pinyinName: 'haifengteng',
    sku: 'HFT',
    description: '传统中药海风藤，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02436,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_284',
    name: '黑老虎根',
    chineseName: '黑老虎根',
    englishName: 'Kadsura coccinea A. C. Smith',
    pinyinName: 'heilaohugen',
    sku: 'HLHG',
    description: '传统中药黑老虎根，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_285',
    name: '胡芦巴',
    chineseName: '胡芦巴',
    englishName: 'Semen Trigonellae',
    pinyinName: 'huluba',
    sku: 'HLB',
    description: '传统中药胡芦巴，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_286',
    name: '金钱草',
    chineseName: '金钱草',
    englishName: 'Herba Lysimachiae',
    pinyinName: 'jinqiancao',
    sku: 'JQC',
    description: '传统中药金钱草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01392,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_287',
    name: '昆布',
    chineseName: '昆布',
    englishName: 'Thallus Laminariae',
    pinyinName: 'kunbu',
    sku: 'KB',
    description: '传统中药昆布，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02086,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_288',
    name: '莱菔子',
    chineseName: '莱菔子',
    englishName: 'Semen Raphani',
    pinyinName: 'laifuzi',
    sku: 'LFZ',
    description: '传统中药莱菔子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01652,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_289',
    name: '莲房',
    chineseName: '莲房',
    englishName: 'Receptaculum Nelumbinis',
    pinyinName: 'lianfang',
    sku: 'LF',
    description: '传统中药莲房，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_290',
    name: '硫磺粉',
    chineseName: '硫磺粉',
    englishName: 'Sulfur',
    pinyinName: 'liuhuangfen',
    sku: 'LHF',
    description: '传统中药硫磺粉，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_291',
    name: '芦根',
    chineseName: '芦根',
    englishName: 'Rhizoma Phragmitis',
    pinyinName: 'lugen',
    sku: 'lugen',
    description: '传统中药芦根，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_292',
    name: '密蒙花',
    chineseName: '密蒙花',
    englishName: 'Flos Buddlejae',
    pinyinName: 'mimenghua',
    sku: 'MMH',
    description: '传统中药密蒙花，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_293',
    name: '绵萆薢',
    chineseName: '绵萆薢',
    englishName: 'Rhizoma Dioscoreae Septemlobae',
    pinyinName: 'mianbixie',
    sku: 'MBX',
    description: '传统中药绵萆薢，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01956,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_294',
    name: '藕节',
    chineseName: '藕节',
    englishName: 'Nelumbo nucifera Gaertn.',
    pinyinName: 'oujie',
    sku: 'OJ',
    description: '传统中药藕节，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_295',
    name: '青皮',
    chineseName: '青皮',
    englishName: 'Pericarpium Citri Reticulatae Viride',
    pinyinName: 'qingpi',
    sku: 'QP',
    description: '传统中药青皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_296',
    name: '山楂特级',
    chineseName: '山楂特级',
    englishName: 'Fructus Crataegi',
    pinyinName: 'shanzhateji',
    sku: 'SZTJ',
    description: '传统中药山楂特级，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_297',
    name: '蛇舌草',
    chineseName: '蛇舌草',
    englishName: 'Hedyotis diffusa Willd',
    pinyinName: 'sheshecao',
    sku: 'SSC',
    description: '传统中药蛇舌草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_298',
    name: '首乌藤',
    chineseName: '首乌藤',
    englishName: 'Caulis Polygoni Multiflori',
    pinyinName: 'shouwuteng',
    sku: 'SWT',
    description: '传统中药首乌藤，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01696,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_299',
    name: '豨莶草',
    chineseName: '豨莶草',
    englishName: 'Siegesbeckia Pubescens Mak',
    pinyinName: 'xixiancao',
    sku: 'XXC',
    description: '传统中药豨莶草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_300',
    name: '香橼',
    chineseName: '香橼',
    englishName: 'Fructus Citri',
    pinyinName: 'xiangyuan',
    sku: 'xiangyuan',
    description: '传统中药香橼，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_301',
    name: '玄参',
    chineseName: '玄参',
    englishName: 'Radix Scrophulariae',
    pinyinName: 'xuancan',
    sku: 'XC',
    description: '传统中药玄参，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_302',
    name: '雪梨桂花茶',
    chineseName: '雪梨桂花茶',
    englishName: 'Pear and Sweet Olive Tea',
    pinyinName: 'xueliguihuacha',
    sku: 'XLGHC',
    description: '传统中药雪梨桂花茶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 5.09,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_303',
    name: '泽泻',
    chineseName: '泽泻',
    englishName: 'Rhizoma Alismatis',
    pinyinName: 'zexie',
    sku: 'ZX',
    description: '传统中药泽泻，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_304',
    name: '枳实',
    chineseName: '枳实',
    englishName: 'Eva Chinese Medical Centre',
    pinyinName: 'zhishi',
    sku: 'ZS',
    description: '传统中药枳实，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_305',
    name: '竹茹',
    chineseName: '竹茹',
    englishName: 'Caulis Bambusae in Taeniam',
    pinyinName: 'zhuru',
    sku: 'ZR',
    description: '传统中药竹茹，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_306',
    name: '紫苏梗',
    chineseName: '紫苏梗',
    englishName: 'Caulis Perillae',
    pinyinName: 'zisugeng',
    sku: 'ZSG',
    description: '传统中药紫苏梗，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02608,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_307',
    name: '槐米',
    chineseName: '槐米',
    englishName: 'Flos Sophorae',
    pinyinName: 'huaimi',
    sku: 'HM',
    description: '传统中药槐米，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_308',
    name: '马鞭草',
    chineseName: '马鞭草',
    englishName: 'Herba Verbenae',
    pinyinName: 'mabiancao',
    sku: 'MBC',
    description: '传统中药马鞭草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_309',
    name: '青风藤',
    chineseName: '青风藤',
    englishName: 'Caulis Sinomenii',
    pinyinName: 'qingfengteng',
    sku: 'QFT',
    description: '传统中药青风藤，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_310',
    name: '炙枇杷叶',
    chineseName: '炙枇杷叶',
    englishName: 'Folium Eriobotryae',
    pinyinName: 'zhipipaye',
    sku: 'ZPPY',
    description: '传统中药炙枇杷叶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_311',
    name: '炒白扁豆',
    chineseName: '炒白扁豆',
    englishName: 'Semen Lablab Album',
    pinyinName: 'chaobaibiandou',
    sku: 'CBBD',
    description: '传统中药炒白扁豆，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_312',
    name: '淡豆豉',
    chineseName: '淡豆豉',
    englishName: 'Semen Sojae Praepatum',
    pinyinName: 'dandouchi',
    sku: 'DDC',
    description: '传统中药淡豆豉，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_313',
    name: '冬瓜子',
    chineseName: '冬瓜子',
    englishName: 'Semen Benincasae',
    pinyinName: 'dongguazi',
    sku: 'DGZ',
    description: '传统中药冬瓜子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_314',
    name: '番泻叶',
    chineseName: '番泻叶',
    englishName: 'Folium Sennae',
    pinyinName: 'fanxieye',
    sku: 'FXY',
    description: '传统中药番泻叶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01564,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_315',
    name: '浮萍',
    chineseName: '浮萍',
    englishName: 'Lemna minor L.',
    pinyinName: 'fuping',
    sku: 'FP',
    description: '传统中药浮萍，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_316',
    name: '瓜蒌皮',
    chineseName: '瓜蒌皮',
    englishName: 'Seed-coat of Fructus Trichosanthis',
    pinyinName: 'gualoupi',
    sku: 'GLP',
    description: '传统中药瓜蒌皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_317',
    name: '鸡血藤',
    chineseName: '鸡血藤',
    englishName: 'Caulis Spatholobi',
    pinyinName: 'jixueteng',
    sku: 'JXT',
    description: '传统中药鸡血藤，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_318',
    name: '荆芥',
    chineseName: '荆芥',
    englishName: 'Herba Schizonepetae',
    pinyinName: 'jingjie',
    sku: 'JJ',
    description: '传统中药荆芥，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_319',
    name: '宽筋藤',
    chineseName: '宽筋藤',
    englishName: 'Tinospora sinensis',
    pinyinName: 'kuanjinteng',
    sku: 'KJT',
    description: '传统中药宽筋藤，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_320',
    name: '佩兰',
    chineseName: '佩兰',
    englishName: 'Herba Eupatorii',
    pinyinName: 'peilan',
    sku: 'PL',
    description: '传统中药佩兰，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_321',
    name: '青葙子',
    chineseName: '青葙子',
    englishName: 'Semen Celosiae',
    pinyinName: 'qingxiangzi',
    sku: 'QXZ',
    description: '传统中药青葙子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_322',
    name: '丝瓜络',
    chineseName: '丝瓜络',
    englishName: 'Luffa cylindrical',
    pinyinName: 'sigualuo',
    sku: 'SGL',
    description: '传统中药丝瓜络，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_323',
    name: '玉米须',
    chineseName: '玉米须',
    englishName: 'Zea mays L',
    pinyinName: 'yumixu',
    sku: 'YMX',
    description: '传统中药玉米须，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_324',
    name: '珍珠透骨草',
    chineseName: '珍珠透骨草',
    englishName: 'Impatiens balsamina',
    pinyinName: 'zhenzhutougucao',
    sku: 'ZZTGC',
    description: '传统中药珍珠透骨草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_325',
    name: '紫花地丁',
    chineseName: '紫花地丁',
    englishName: 'Viola philippica Car.',
    pinyinName: 'zihuadiding',
    sku: 'ZHDD',
    description: '传统中药紫花地丁，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01826,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_326',
    name: '布渣叶',
    chineseName: '布渣叶',
    englishName: 'Microcos Paniculata Linn',
    pinyinName: 'buzhaye',
    sku: 'BZY',
    description: '传统中药布渣叶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_327',
    name: '香附',
    chineseName: '香附',
    englishName: 'Rhizoma Cyperi',
    pinyinName: 'xiangfu',
    sku: 'XF',
    description: '理气调中香附，用于气机失调，脘腹胀痛。',
    category: '理气药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_328',
    name: '溪黄草',
    chineseName: '溪黄草',
    englishName: 'Herba Rabdosiae Serrae',
    pinyinName: 'xihuangcao',
    sku: 'XHC',
    description: '传统中药溪黄草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02175,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_329',
    name: '白扁豆',
    chineseName: '白扁豆',
    englishName: 'Semen Lablab Album',
    pinyinName: 'baibiandou',
    sku: 'BBD',
    description: '传统中药白扁豆，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_330',
    name: '炒枳实',
    chineseName: '炒枳实',
    englishName: 'Fructus Aurantii Immaturus',
    pinyinName: 'chaozhishi',
    sku: 'CZS',
    description: '传统中药炒枳实，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_331',
    name: '大青叶',
    chineseName: '大青叶',
    englishName: 'Folium Isatidis',
    pinyinName: 'daqingye',
    sku: 'DQY',
    description: '清热解毒大青叶，用于热性病证，清除内热。',
    category: '清热药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_332',
    name: '淡竹叶',
    chineseName: '淡竹叶',
    englishName: 'Herba Lophatheri',
    pinyinName: 'danzhuye',
    sku: 'DZY',
    description: '传统中药淡竹叶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_333',
    name: '冬葵子',
    chineseName: '冬葵子',
    englishName: 'Malva verticillata L',
    pinyinName: 'dongkuizi',
    sku: 'DKZ',
    description: '传统中药冬葵子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_334',
    name: '岗梅根',
    chineseName: '岗梅根',
    englishName: 'Radix Ilicis Asprellae',
    pinyinName: 'gangmeigen',
    sku: 'GMG',
    description: '传统中药岗梅根，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_335',
    name: '合欢皮',
    chineseName: '合欢皮',
    englishName: 'Cortex Albiziae',
    pinyinName: 'hehuanpi',
    sku: 'HHP',
    description: '传统中药合欢皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01392,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_336',
    name: '虎杖',
    chineseName: '虎杖',
    englishName: 'Rhizoma Polygoni Cuspidati',
    pinyinName: 'huzhang',
    sku: 'huzhang',
    description: '传统中药虎杖，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_337',
    name: '黄药子',
    chineseName: '黄药子',
    englishName: 'Rhizoma Dioscoreae Bulbiferae',
    pinyinName: 'huangyaozi',
    sku: 'huangyaozi',
    description: '传统中药黄药子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01652,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_338',
    name: '鸡矢藤',
    chineseName: '鸡矢藤',
    englishName: 'Herba Paederiae',
    pinyinName: 'jishiteng',
    sku: 'JST',
    description: '传统中药鸡矢藤，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_339',
    name: '菊苣',
    chineseName: '菊苣',
    englishName: 'Cichorium intubus',
    pinyinName: 'juju',
    sku: 'juju',
    description: '传统中药菊苣，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01392,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_340',
    name: '马齿苋',
    chineseName: '马齿苋',
    englishName: 'Herba Portulacae',
    pinyinName: 'machixian',
    sku: 'MCX',
    description: '传统中药马齿苋，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_341',
    name: '毛冬青',
    chineseName: '毛冬青',
    englishName: 'Ilex pubescens Hook. et Arn.',
    pinyinName: 'maodongqing',
    sku: 'MDQ',
    description: '传统中药毛冬青，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01392,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_342',
    name: '桑寄生',
    chineseName: '桑寄生',
    englishName: 'Herba Taxilli',
    pinyinName: 'sangjisheng',
    sku: 'SJS',
    description: '传统中药桑寄生，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01914,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_343',
    name: '葶苈子',
    chineseName: '葶苈子',
    englishName: 'Semen Lepidii',
    pinyinName: 'tinglizi',
    sku: 'TLZ',
    description: '传统中药葶苈子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_344',
    name: '小茴香',
    chineseName: '小茴香',
    englishName: 'Fructus Foeniculi',
    pinyinName: 'xiaohuixiang',
    sku: 'XHX',
    description: '传统中药小茴香，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_345',
    name: '绵茵陈',
    chineseName: '绵茵陈',
    englishName: 'Herba Artemisiae Scopariae',
    pinyinName: 'mianyinchen',
    sku: 'MYC',
    description: '传统中药绵茵陈，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_346',
    name: '白矾',
    chineseName: '白矾',
    englishName: 'Alumen',
    pinyinName: 'baifan',
    sku: 'BF',
    description: '传统中药白矾，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0087,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_347',
    name: '白芥子',
    chineseName: '白芥子',
    englishName: 'Semen Sinapis',
    pinyinName: 'baijiezi',
    sku: 'BJZ',
    description: '传统中药白芥子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01696,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_348',
    name: '半枝莲',
    chineseName: '半枝莲',
    englishName: 'Herba Scutellariae Barbatae',
    pinyinName: 'banzhilian',
    sku: 'BZL',
    description: '传统中药半枝莲，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_349',
    name: '炒莱菔子',
    chineseName: '炒莱菔子',
    englishName: 'Semen Raphani',
    pinyinName: 'chaolaifuzi',
    sku: 'CLFZ',
    description: '传统中药炒莱菔子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_350',
    name: '赤石脂',
    chineseName: '赤石脂',
    englishName: 'Halloysitum Rubrum',
    pinyinName: 'chishizhi',
    sku: 'chishizhi',
    description: '传统中药赤石脂，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_351',
    name: '穿心莲',
    chineseName: '穿心莲',
    englishName: 'Herba Andrographis',
    pinyinName: 'chuanxinlian',
    sku: 'CXL',
    description: '传统中药穿心莲，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_352',
    name: '海桐皮',
    chineseName: '海桐皮',
    englishName: 'Erythrina indica Lam',
    pinyinName: 'haitongpi',
    sku: 'HTP',
    description: '传统中药海桐皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_353',
    name: '荷叶',
    chineseName: '荷叶',
    englishName: 'Nelumbo nucifera Gaertn',
    pinyinName: 'heye',
    sku: 'HY',
    description: '传统中药荷叶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_354',
    name: '黑枣',
    chineseName: '黑枣',
    englishName: 'Black Jujubae',
    pinyinName: 'heizao',
    sku: 'heizao',
    description: '传统中药黑枣，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02086,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_355',
    name: '酒女贞子',
    chineseName: '酒女贞子',
    englishName: 'Fructus Ligustri Lucidi',
    pinyinName: 'jiunüzhenzi',
    sku: 'JNZZ',
    description: '传统中药酒女贞子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01652,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_356',
    name: '卷柏',
    chineseName: '卷柏',
    englishName: 'Herba Selaginellae',
    pinyinName: 'juanbai',
    sku: 'JB',
    description: '传统中药卷柏，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01478,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_357',
    name: '芒果核',
    chineseName: '芒果核',
    englishName: 'Semen Mangifera indica L',
    pinyinName: 'mangguohe',
    sku: 'mangguohe',
    description: '传统中药芒果核，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_358',
    name: '青果',
    chineseName: '青果',
    englishName: 'Fructus Canarii',
    pinyinName: 'qingguo',
    sku: 'QG',
    description: '传统中药青果，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01392,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_359',
    name: '青蒿',
    chineseName: '青蒿',
    englishName: 'Herba Artemisiae Annuae',
    pinyinName: 'qinghao',
    sku: 'qinghao',
    description: '传统中药青蒿，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_360',
    name: '石决明',
    chineseName: '石决明',
    englishName: 'Concha Haliotidis',
    pinyinName: 'shijueming',
    sku: 'SJM',
    description: '传统中药石决明，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01392,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_361',
    name: '王不留行子',
    chineseName: '王不留行子',
    englishName: 'Semen Vaccariae',
    pinyinName: 'wangbuliuxingzi',
    sku: 'WBLXZ',
    description: '传统中药王不留行子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_362',
    name: '香薷',
    chineseName: '香薷',
    englishName: 'Herba Moslae',
    pinyinName: 'xiangru',
    sku: 'XR',
    description: '传统中药香薷，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_363',
    name: '银杏叶',
    chineseName: '银杏叶',
    englishName: 'Folium Ginkgo',
    pinyinName: 'yinxingye',
    sku: 'YXY',
    description: '传统中药银杏叶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_364',
    name: '鸡蛋花',
    chineseName: '鸡蛋花',
    englishName: 'Flos Plumeriae',
    pinyinName: 'jidanhua',
    sku: 'jidanhua',
    description: '传统中药鸡蛋花，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.02,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_365',
    name: '枇杷叶',
    chineseName: '枇杷叶',
    englishName: 'Folium Eriobotryae',
    pinyinName: 'pipaye',
    sku: 'PPY',
    description: '传统中药枇杷叶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_366',
    name: '秦皮',
    chineseName: '秦皮',
    englishName: 'Cortex Fraxini',
    pinyinName: 'qinpi',
    sku: 'qinpi',
    description: '传统中药秦皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_367',
    name: '桂枝',
    chineseName: '桂枝',
    englishName: 'Ramulus Cinnamomi',
    pinyinName: 'guizhi',
    sku: 'GZ',
    description: '传统中药桂枝，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01722,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_368',
    name: '路路通',
    chineseName: '路路通',
    englishName: 'Fructus Liquidambaris',
    pinyinName: 'lulutong',
    sku: 'LLT',
    description: '传统中药路路通，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01132,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_369',
    name: '木棉花',
    chineseName: '木棉花',
    englishName: 'Flos Bombacis Malabarici',
    pinyinName: 'mumianhua',
    sku: 'mumianhua',
    description: '传统中药木棉花，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_370',
    name: '艾叶',
    chineseName: '艾叶',
    englishName: 'Folium Artemisiae Argyi',
    pinyinName: 'aiye',
    sku: 'AY',
    description: '传统中药艾叶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01478,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_371',
    name: '萹蓄',
    chineseName: '萹蓄',
    englishName: 'Herba Polygoni Avicularis',
    pinyinName: 'bianxu',
    sku: 'BX',
    description: '传统中药萹蓄，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.00956,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_372',
    name: '苍耳子',
    chineseName: '苍耳子',
    englishName: 'Fructus Xanthii',
    pinyinName: 'cangerzi',
    sku: 'CEZ',
    description: '传统中药苍耳子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01662,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_373',
    name: '侧柏炭',
    chineseName: '侧柏炭',
    englishName: 'Cacumen Platycladi',
    pinyinName: 'cebaitan',
    sku: 'CBT',
    description: '传统中药侧柏炭，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_374',
    name: '侧柏叶',
    chineseName: '侧柏叶',
    englishName: 'Cacumen Platycladi',
    pinyinName: 'cebaiye',
    sku: 'CBY',
    description: '传统中药侧柏叶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_375',
    name: '车前草',
    chineseName: '车前草',
    englishName: 'Herba Plantaginis',
    pinyinName: 'cheqiancao',
    sku: 'CQC',
    description: '传统中药车前草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0126,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_376',
    name: '椿树皮',
    chineseName: '椿树皮',
    englishName: 'Cortex Ailanthi',
    pinyinName: 'chunshupi',
    sku: 'CSP',
    description: '传统中药椿树皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_377',
    name: '大腹皮',
    chineseName: '大腹皮',
    englishName: 'Pericarpium Arecae',
    pinyinName: 'dafupi',
    sku: 'DFP',
    description: '传统中药大腹皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_378',
    name: '倒扣草',
    chineseName: '倒扣草',
    englishName: 'Dao Kou Cao',
    pinyinName: 'daokoucao',
    sku: 'DKC',
    description: '传统中药倒扣草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_379',
    name: '煅牡蛎',
    chineseName: '煅牡蛎',
    englishName: 'Concha Ostreae Praeparata',
    pinyinName: 'duanmuli',
    sku: 'DML',
    description: '安神定志煅牡蛎，用于心神不宁，失眠健忘。',
    category: '安神药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01218,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_380',
    name: '茯苓皮',
    chineseName: '茯苓皮',
    englishName: 'Poria',
    pinyinName: 'fulingpi',
    sku: 'FLP',
    description: '化痰散结茯苓皮，用于痰湿内阻，咳嗽痰多。',
    category: '化痰药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0087,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_381',
    name: '浮小麦',
    chineseName: '浮小麦',
    englishName: 'Fructus Tritici Levis',
    pinyinName: 'fuxiaomai',
    sku: 'fuxiaomai',
    description: '传统中药浮小麦，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_382',
    name: '红藤',
    chineseName: '红藤',
    englishName: 'Caulis Sargentodoxae',
    pinyinName: 'hongteng',
    sku: 'HT',
    description: '传统中药红藤，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01218,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_383',
    name: '花生衣',
    chineseName: '花生衣',
    englishName: 'Arachis hypogaea Linn',
    pinyinName: 'huashengyi',
    sku: 'HSY',
    description: '传统中药花生衣，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_384',
    name: '火炭母',
    chineseName: '火炭母',
    englishName: 'Herba Polygoni Chinensis',
    pinyinName: 'huotanmu',
    sku: 'HTM',
    description: '传统中药火炭母，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_385',
    name: '荔枝核',
    chineseName: '荔枝核',
    englishName: 'Semen Litchi',
    pinyinName: 'lizhihe',
    sku: 'LZH',
    description: '传统中药荔枝核，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_386',
    name: '木贼',
    chineseName: '木贼',
    englishName: 'Herba Equiseti Hiemalis',
    pinyinName: 'muzei',
    sku: 'MZ',
    description: '传统中药木贼，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_387',
    name: '女贞子',
    chineseName: '女贞子',
    englishName: 'Fructus Ligustri Lucidi',
    pinyinName: 'nüzhenzi',
    sku: 'NZZ',
    description: '传统中药女贞子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01652,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_388',
    name: '忍冬藤',
    chineseName: '忍冬藤',
    englishName: 'Caulis Lonicerae',
    pinyinName: 'rendongteng',
    sku: 'RDT',
    description: '传统中药忍冬藤，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_389',
    name: '山楂叶',
    chineseName: '山楂叶',
    englishName: 'Folium Crataegi',
    pinyinName: 'shanzhaye',
    sku: 'shanzhaye',
    description: '传统中药山楂叶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01392,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_390',
    name: '伸筋草',
    chineseName: '伸筋草',
    englishName: 'Herba Lycopodii',
    pinyinName: 'shenjincao',
    sku: 'SJC',
    description: '传统中药伸筋草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_391',
    name: '神曲茶',
    chineseName: '神曲茶',
    englishName: 'Massa Medicata Fermentata',
    pinyinName: 'shenqucha',
    sku: 'SQC',
    description: '传统中药神曲茶，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01652,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_392',
    name: '石榴皮',
    chineseName: '石榴皮',
    englishName: 'Pericarpium Granati',
    pinyinName: 'shiliupi',
    sku: 'SLP',
    description: '传统中药石榴皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_393',
    name: '石楠藤',
    chineseName: '石楠藤',
    englishName: 'Piper wallichii',
    pinyinName: 'shinanteng',
    sku: 'SNT',
    description: '传统中药石楠藤，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_394',
    name: '王不留行壳',
    chineseName: '王不留行壳',
    englishName: 'Vaccaria hispanica, seed capsule',
    pinyinName: 'wangbuliuxingke',
    sku: 'WBLXK',
    description: '传统中药王不留行壳，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01218,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_395',
    name: '仙鹤草',
    chineseName: '仙鹤草',
    englishName: 'Herba Agrimoniae',
    pinyinName: 'xianhecao',
    sku: 'xianhecao',
    description: '传统中药仙鹤草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_396',
    name: '鸭脚皮',
    chineseName: '鸭脚皮',
    englishName: 'Cortex Schefflerae Octophyllae',
    pinyinName: 'yajiaopi',
    sku: 'YJP',
    description: '传统中药鸭脚皮，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.00696,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_397',
    name: '阳起石',
    chineseName: '阳起石',
    englishName: 'Actinolitum',
    pinyinName: 'yangqishi',
    sku: 'YQS',
    description: '传统中药阳起石，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01218,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_398',
    name: '益母草',
    chineseName: '益母草',
    englishName: 'Herba Leonuri',
    pinyinName: 'yimucao',
    sku: 'YMC',
    description: '传统中药益母草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_399',
    name: '油松节',
    chineseName: '油松节',
    englishName: 'Pini Lignum Nodi',
    pinyinName: 'yousongjie',
    sku: 'YSJ',
    description: '传统中药油松节，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.00956,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_400',
    name: '鱼腥草',
    chineseName: '鱼腥草',
    englishName: 'Herba Houttuyniae',
    pinyinName: 'yuxingcao',
    sku: 'YXC',
    description: '传统中药鱼腥草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01218,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_401',
    name: '赭石',
    chineseName: '赭石',
    englishName: 'Haematitum',
    pinyinName: 'zheshi',
    sku: 'zheshi',
    description: '传统中药赭石，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_402',
    name: '珍珠母',
    chineseName: '珍珠母',
    englishName: 'Concha Margaritifera',
    pinyinName: 'zhenzhumu',
    sku: 'ZZM',
    description: '传统中药珍珠母，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0087,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_403',
    name: '紫石英',
    chineseName: '紫石英',
    englishName: 'Fluoritum',
    pinyinName: 'zishiying',
    sku: 'zishiying',
    description: '传统中药紫石英，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_404',
    name: '黑芝麻',
    chineseName: '黑芝麻',
    englishName: 'Semen Sesami Nigrum',
    pinyinName: 'heizhima',
    sku: 'HZM',
    description: '传统中药黑芝麻，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01696,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_405',
    name: '薏苡仁',
    chineseName: '薏苡仁',
    englishName: 'Semen Coicis',
    pinyinName: 'yiyiren',
    sku: 'YYR',
    description: '传统中药薏苡仁，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_406',
    name: '白头翁',
    chineseName: '白头翁',
    englishName: 'Radix Pulsatillae',
    pinyinName: 'baitouweng',
    sku: 'BTW',
    description: '传统中药白头翁，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01304,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_407',
    name: '炒谷芽',
    chineseName: '炒谷芽',
    englishName: 'Fructus Oryzae Germinatus',
    pinyinName: 'chaoguya',
    sku: 'CGY',
    description: '传统中药炒谷芽，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01086,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_408',
    name: '炉甘石',
    chineseName: '炉甘石',
    englishName: 'Calamina',
    pinyinName: 'luganshi',
    sku: 'LGS',
    description: '传统中药炉甘石，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0087,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_409',
    name: '络石藤',
    chineseName: '络石藤',
    englishName: 'Caulis Trachelospermi',
    pinyinName: 'luoshiteng',
    sku: 'LST',
    description: '传统中药络石藤，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0087,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_410',
    name: '生石膏',
    chineseName: '生石膏',
    englishName: 'Gypsum Fibrosum',
    pinyinName: 'shengshigao',
    sku: 'SSG',
    description: '传统中药生石膏，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_411',
    name: '自然铜',
    chineseName: '自然铜',
    englishName: 'Pyrite',
    pinyinName: 'zirantong',
    sku: 'ZRT',
    description: '传统中药自然铜，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.00782,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_412',
    name: '棕榈炭',
    chineseName: '棕榈炭',
    englishName: 'Petiolus Trachycarpi',
    pinyinName: 'zonglütan',
    sku: 'ZLT',
    description: '传统中药棕榈炭，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_413',
    name: '败酱草',
    chineseName: '败酱草',
    englishName: 'Herba Patriniae',
    pinyinName: 'baijiangcao',
    sku: 'BJC',
    description: '传统中药败酱草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01132,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_414',
    name: '磁石',
    chineseName: '磁石',
    englishName: 'Magnetitum',
    pinyinName: 'cishi',
    sku: 'cishi',
    description: '传统中药磁石，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_415',
    name: '栗壳',
    chineseName: '栗壳',
    englishName: 'Pericarpium Papaveris',
    pinyinName: 'like',
    sku: 'LK',
    description: '传统中药栗壳，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_416',
    name: '两面针',
    chineseName: '两面针',
    englishName: 'Radix Zanthoxyli',
    pinyinName: 'liangmianzhen',
    sku: 'LMZ',
    description: '传统中药两面针，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0074,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_417',
    name: '牡蛎',
    chineseName: '牡蛎',
    englishName: 'Concha Ostreae',
    pinyinName: 'muli',
    sku: 'ML',
    description: '安神定志牡蛎，用于心神不宁，失眠健忘。',
    category: '安神药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_418',
    name: '瞿麦',
    chineseName: '瞿麦',
    englishName: 'Herba Dianthi',
    pinyinName: 'qumai',
    sku: 'QM',
    description: '传统中药瞿麦，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_419',
    name: '桑枝',
    chineseName: '桑枝',
    englishName: 'Morus alba L.',
    pinyinName: 'sangzhi',
    sku: 'SZ',
    description: '传统中药桑枝，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01174,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_420',
    name: '雄黄',
    chineseName: '雄黄',
    englishName: 'Realgar',
    pinyinName: 'xionghuang',
    sku: 'XH',
    description: '传统中药雄黄，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: true,
    basePrice: 0.00956,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处",
          "warning": "需医师指导使用"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_421',
    name: '炒麦芽',
    chineseName: '炒麦芽',
    englishName: 'Fructus Hordei Germinatus',
    pinyinName: 'chaomaiya',
    sku: 'CMY',
    description: '传统中药炒麦芽，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_422',
    name: '麦芽',
    chineseName: '麦芽',
    englishName: 'Fructus Hordei Germinatus',
    pinyinName: 'maiya',
    sku: 'maiya',
    description: '传统中药麦芽，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_423',
    name: '青仁黑豆',
    chineseName: '青仁黑豆',
    englishName: 'Black soya bean',
    pinyinName: 'qingrenheidou',
    sku: 'QRHD',
    description: '传统中药青仁黑豆，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01218,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_424',
    name: '新疆小枣',
    chineseName: '新疆小枣',
    englishName: 'Fructus Jujubae',
    pinyinName: 'xinjiangxiaozao',
    sku: 'XJXZ',
    description: '传统中药新疆小枣，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01434,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_425',
    name: '谷芽',
    chineseName: '谷芽',
    englishName: 'Fructus Oryzae Germinatus',
    pinyinName: 'guya',
    sku: 'GY',
    description: '传统中药谷芽，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01086,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_426',
    name: '蛤壳',
    chineseName: '蛤壳',
    englishName: 'Concha Meretricis seu Cyclinae',
    pinyinName: 'hake',
    sku: 'HK',
    description: '传统中药蛤壳，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.00782,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_427',
    name: '海浮石',
    chineseName: '海浮石',
    englishName: 'Pumex',
    pinyinName: 'haifushi',
    sku: 'HFS',
    description: '传统中药海浮石，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0087,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_428',
    name: '红枣无核',
    chineseName: '红枣无核',
    englishName: 'Fructus Jujubae',
    pinyinName: 'hongzaowuhe',
    sku: 'HZWH',
    description: '传统中药红枣无核，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0121,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_429',
    name: '滑石粉',
    chineseName: '滑石粉',
    englishName: 'Pulvis Talci',
    pinyinName: 'huashifen',
    sku: 'HSF',
    description: '传统中药滑石粉，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_430',
    name: '决明子',
    chineseName: '决明子',
    englishName: 'Semen Cassiae',
    pinyinName: 'juemingzi',
    sku: 'JMZ',
    description: '传统中药决明子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01566,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_431',
    name: '老鹳草',
    chineseName: '老鹳草',
    englishName: 'Herba Geranii',
    pinyinName: 'laoguancao',
    sku: 'LGC',
    description: '传统中药老鹳草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_432',
    name: '田基王',
    chineseName: '田基王',
    englishName: 'Tianjiwang',
    pinyinName: 'tianjiwang',
    sku: 'TJW',
    description: '传统中药田基王，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0074,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_433',
    name: '瓦楞子',
    chineseName: '瓦楞子',
    englishName: 'Concha Arcae',
    pinyinName: 'walengzi',
    sku: 'WLZ',
    description: '传统中药瓦楞子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0087,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_434',
    name: '玄明粉',
    chineseName: '玄明粉',
    englishName: 'Xuanmingfen',
    pinyinName: 'xuanmingfen',
    sku: 'XMF',
    description: '传统中药玄明粉，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.00696,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_435',
    name: '泽兰',
    chineseName: '泽兰',
    englishName: 'Herba Lycopi',
    pinyinName: 'zelan',
    sku: 'zelan',
    description: '传统中药泽兰，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_436',
    name: '赤小豆',
    chineseName: '赤小豆',
    englishName: 'Semen Phaseoli',
    pinyinName: 'chixiaodou',
    sku: 'CXD',
    description: '传统中药赤小豆，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01044,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_437',
    name: '凤尾草',
    chineseName: '凤尾草',
    englishName: 'Pteris multifida Poir',
    pinyinName: 'fengweicao',
    sku: 'FWC',
    description: '传统中药凤尾草，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.0087,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_438',
    name: '蜜枣',
    chineseName: '蜜枣',
    englishName: 'Fructus Jujubae',
    pinyinName: 'mizao',
    sku: 'mizao',
    description: '传统中药蜜枣，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.00957,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_439',
    name: '使君子',
    chineseName: '使君子',
    englishName: 'Fructus Quisqualis',
    pinyinName: 'shijunzi',
    sku: 'SJZ',
    description: '传统中药使君子，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.00956,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_440',
    name: '南姜',
    chineseName: '南姜',
    englishName: 'Alpinia Galanga  Willd.',
    pinyinName: 'nanjiang',
    sku: 'NJ',
    description: '传统中药南姜，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.00696,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
    },
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'med_441',
    name: '金丝蜜枣特级',
    chineseName: '金丝蜜枣特级',
    englishName: 'Fructus Jujubae',
    pinyinName: 'jinsimizaoteji',
    sku: 'JSMZTJ',
    description: '传统中药金丝蜜枣特级，具有独特的药用价值。',
    category: '其他中药',
    unit: 'g',
    requiresPrescription: false,
    basePrice: 0.01,
    metadata: {
          "origin": "新西兰",
          "grade": "A",
          "storage": "密封，置阴凉干燥处"
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
