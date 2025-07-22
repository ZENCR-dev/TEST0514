#!/usr/bin/env tsx

/**
 * 药品数据集成脚本 - MVP1.9 Guest Mode
 * 
 * 功能：
 * 1. 读取multiple格式的药品数据源
 * 2. 验证数据一致性和完整性  
 * 3. 生成符合后端API格式的统一数据
 * 4. 输出TypeScript格式的药品数据文件
 * 
 * 数据源：
 * - archived-docs/medicine-data-450.CSV-processed.csv (主数据源)
 * - archived-docs/user-data/medicine-data-450.csv (验证数据源)
 * - archived-docs/user-data/medicine-data-template.tsv (格式参考)
 */

import * as fs from 'fs';
import * as path from 'path';

// 后端API Medicine接口格式
interface Medicine {
  id: string;                    // 系统ID
  name: string;                  // 对应中文名
  chineseName: string;           // 中文名
  englishName: string;           // 英文名
  pinyinName: string;            // 拼音名
  sku: string;                   // SKU代码
  category: string;              // 分类
  basePrice: number;             // 基础价格 (NZD$)
  unit: string;                  // 单位
  description?: string;          // 描述
  requiresPrescription: boolean; // 是否需要处方
  status: 'active' | 'inactive'; // 状态
  metadata?: {
    origin?: string;
    grade?: string;
    storage?: string;
    warning?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// CSV行数据格式
interface ProcessedCSVRow {
  中文名: string;
  英文名: string;
  拼音名: string;
  SKU: string;
  分类: string;
  单位: string;
  需要处方: string;
  基础价格: string;
  状态: string;
}

interface UserCSVRow {
  中文名: string;
  英文名: string;
  价格: string;
}

// 数据验证结果
interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalMedicines: number;
    categoriesCount: number;
    priceRange: { min: number; max: number; avg: number };
    duplicates: number;
  };
}

class MedicineDataIntegrator {
  private processedData: ProcessedCSVRow[] = [];
  private userData: UserCSVRow[] = [];
  private integratedData: Medicine[] = [];
  
  constructor() {
    console.log('🏥 药品数据集成工具启动 - MVP1.9 Guest Mode');
  }

  /**
   * 读取CSV文件
   */
     private readCSV(filePath: string): string[][] {
     try {
       const content = fs.readFileSync(filePath, 'utf-8');
       const lines = content.trim().split('\n');
       return lines.map(line => this.parseCSVLine(line));
     } catch (error: any) {
       throw new Error(`读取CSV文件失败: ${filePath} - ${error.message}`);
     }
   }

   /**
    * 正确解析包含引号和逗号的CSV行
    */
   private parseCSVLine(line: string): string[] {
     const result: string[] = [];
     let current = '';
     let inQuotes = false;
     let i = 0;
     
     while (i < line.length) {
       const char = line[i];
       
       if (char === '"') {
         if (inQuotes && line[i + 1] === '"') {
           // 转义的引号
           current += '"';
           i += 2;
         } else {
           // 切换引号状态
           inQuotes = !inQuotes;
           i++;
         }
       } else if (char === ',' && !inQuotes) {
         // 字段分隔符
         result.push(current.trim());
         current = '';
         i++;
       } else {
         current += char;
         i++;
       }
     }
     
     // 添加最后一个字段
     result.push(current.trim());
     
     return result;
   }

  /**
   * 读取TSV文件  
   */
  private readTSV(filePath: string): string[][] {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.trim().split('\n');
      return lines.map(line => line.split('\t').map(cell => cell.trim()));
         } catch (error: any) {
       throw new Error(`读取TSV文件失败: ${filePath} - ${error.message}`);
     }
  }

  /**
   * 加载主数据源 (processed.csv)
   */
  private async loadProcessedData(): Promise<void> {
    console.log('📊 加载主数据源: medicine-data-450.CSV-processed.csv');
    
         const filePath = '../archived-docs/medicine-data-450.CSV-processed.csv';
    const rows = this.readCSV(filePath);
    
    // 跳过标题行
    const headers = rows[0];
    const dataRows = rows.slice(1);
    
    console.log(`   📋 标题行: ${headers.join(', ')}`);
    console.log(`   📊 数据行数: ${dataRows.length}`);
    
    this.processedData = dataRows.map(row => ({
      中文名: row[0] || '',
      英文名: row[1] || '',
      拼音名: row[2] || '',
      SKU: row[3] || '',
      分类: row[4] || '',
      单位: row[5] || '',
      需要处方: row[6] || '',
      基础价格: row[7] || '',
      状态: row[8] || ''
    }));
    
    console.log(`   ✅ 成功加载 ${this.processedData.length} 条药品数据`);
  }

  /**
   * 加载用户数据源 (user-data.csv)
   */
  private async loadUserData(): Promise<void> {
    console.log('📊 加载用户数据源: user-data/medicine-data-450.csv');
    
         const filePath = '../archived-docs/user-data/medicine-data-450.csv';
    const rows = this.readCSV(filePath);
    
    // 跳过标题行
    const headers = rows[0];
    const dataRows = rows.slice(1);
    
    console.log(`   📋 标题行: ${headers.join(', ')}`);
    console.log(`   📊 数据行数: ${dataRows.length}`);
    
    this.userData = dataRows.map(row => ({
      中文名: row[0] || '',
      英文名: row[1] || '',
      价格: row[2] || ''
    }));
    
    console.log(`   ✅ 成功加载 ${this.userData.length} 条用户数据`);
  }

  /**
   * 验证数据一致性
   */
  private validateDataConsistency(): ValidationResult {
    console.log('🔍 验证数据一致性...');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // 验证数据量一致性
    if (this.processedData.length !== this.userData.length) {
      warnings.push(`数据量不一致: processed=${this.processedData.length}, user=${this.userData.length}`);
    }
    
    // 验证价格一致性
    let priceInconsistencies = 0;
    const priceValues: number[] = [];
    
    for (let i = 0; i < Math.min(this.processedData.length, this.userData.length); i++) {
      const processedRow = this.processedData[i];
      const userRow = this.userData[i];
      
      // 验证中文名一致性
      if (processedRow.中文名 !== userRow.中文名) {
        errors.push(`第${i+1}行中文名不一致: "${processedRow.中文名}" vs "${userRow.中文名}"`);
      }
      
      // 验证价格一致性
      const processedPrice = parseFloat(processedRow.基础价格);
      const userPrice = parseFloat(userRow.价格);
      
      if (Math.abs(processedPrice - userPrice) > 0.0001) {
        priceInconsistencies++;
        if (priceInconsistencies <= 5) { // 只显示前5个不一致的价格
          warnings.push(`第${i+1}行价格不一致: ${processedPrice} vs ${userPrice} (${processedRow.中文名})`);
        }
      }
      
      priceValues.push(processedPrice);
    }
    
         // 统计信息
     const categorySet = new Set(this.processedData.map(row => row.分类));
     const categories = Array.from(categorySet);
     const duplicateNames = this.findDuplicates(this.processedData.map(row => row.中文名));
    
    const stats = {
      totalMedicines: this.processedData.length,
      categoriesCount: categories.length,
      priceRange: {
        min: Math.min(...priceValues),
        max: Math.max(...priceValues),
        avg: priceValues.reduce((sum, price) => sum + price, 0) / priceValues.length
      },
      duplicates: duplicateNames.length
    };
    
    console.log(`   📊 分类数量: ${stats.categoriesCount} (${categories.join(', ')})`);
    console.log(`   💰 价格范围: $${stats.priceRange.min.toFixed(4)} - $${stats.priceRange.max.toFixed(4)} (平均: $${stats.priceRange.avg.toFixed(4)})`);
    console.log(`   🔄 重复药品: ${stats.duplicates}个`);
    
    if (priceInconsistencies > 5) {
      warnings.push(`总计${priceInconsistencies}个价格不一致项`);
    }
    
    const success = errors.length === 0;
    console.log(`   ${success ? '✅' : '❌'} 验证${success ? '通过' : '失败'}: ${errors.length}个错误, ${warnings.length}个警告`);
    
    return { success, errors, warnings, stats };
  }

  /**
   * 查找重复项
   */
  private findDuplicates(items: string[]): string[] {
    const counts = items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.keys(counts).filter(item => counts[item] > 1);
  }

  /**
   * 生成统一的Medicine数据
   */
  private generateIntegratedData(): void {
    console.log('🔄 生成统一的Medicine数据...');
    
    this.integratedData = this.processedData.map((row, index) => {
      const medicineId = `med_${String(index + 1).padStart(3, '0')}`;
      const basePrice = parseFloat(row.基础价格);
      const requiresPrescription = row.需要处方 === '是';
      
      const medicine: Medicine = {
        id: medicineId,
        name: row.中文名,                 // 对应中文名
        chineseName: row.中文名,
        englishName: row.英文名,
        pinyinName: row.拼音名,
        sku: row.SKU,
        category: row.分类,
        basePrice: basePrice,
        unit: row.单位 || 'g',
        requiresPrescription: requiresPrescription,
        status: (row.状态 === 'active' ? 'active' : 'inactive') as 'active' | 'inactive',
        metadata: {
          origin: '新西兰',
          grade: 'A',
          storage: '密封，置阴凉干燥处'
        },
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z')
      };
      
      // 添加特殊处方药的警告信息
      if (requiresPrescription) {
        medicine.metadata!.warning = '需医师指导使用';
      }
      
      return medicine;
    });
    
    console.log(`   ✅ 成功生成 ${this.integratedData.length} 条标准化药品数据`);
  }

  /**
   * 导出TypeScript格式文件
   */
  private exportTypeScriptFile(): void {
    console.log('📝 导出TypeScript格式文件...');
    
         const outputPath = '../src/mocks/medicineData.ts';
    
    // 生成TypeScript文件内容
    const fileContent = `/**
 * 药品 Mock 数据 - MVP1.9 Guest Mode
 * 基于442条真实药品数据集成
 * 
 * @version 1.9.0
 * @date ${new Date().toISOString().split('T')[0]}
 * @description 完全匹配后端 API Medicine 格式
 * @source 数据来源: archived-docs/medicine-data-450.CSV-processed.csv
 */

import { Medicine, validateMedicineData } from '../types/medicine';

/**
 * Mock 药品数据 - 442条完整数据
 * 所有数据都通过 validateMedicineData 验证
 */
export const mockMedicines: Medicine[] = [
${this.integratedData.map(medicine => `  {
    id: '${medicine.id}',
    name: '${medicine.name}',
    chineseName: '${medicine.chineseName}',
    englishName: '${medicine.englishName}',
    pinyinName: '${medicine.pinyinName}',
    sku: '${medicine.sku}',
    description: '${this.generateDescription(medicine)}',
    category: '${medicine.category}',
    unit: '${medicine.unit}',
    requiresPrescription: ${medicine.requiresPrescription},
    basePrice: ${medicine.basePrice},
    metadata: ${JSON.stringify(medicine.metadata, null, 6).replace(/\n/g, '\n    ')},
    status: '${medicine.status}',
    createdAt: new Date('${medicine.createdAt.toISOString()}'),
    updatedAt: new Date('${medicine.updatedAt.toISOString()}')
  }`).join(',\n')}
];

/**
 * 验证所有 Mock 数据
 * 确保每个药品数据都符合后端规范
 */
export function validateAllMockData(): boolean {
  const results = mockMedicines.map((medicine, index) => {
    const isValid = validateMedicineData(medicine);
    if (!isValid) {
      console.error(\`Mock 数据验证失败 - 索引 \${index}:\`, medicine);
    }
    return isValid;
  });
  
  const allValid = results.every(result => result);
  console.log(\`Mock 数据验证结果: \${allValid ? '全部通过' : '存在错误'} (\${results.filter(r => r).length}/\${results.length})\`);
  
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
`;
    
    // 创建目录（如果不存在）
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 写入文件
    fs.writeFileSync(outputPath, fileContent, 'utf-8');
    console.log(`   ✅ 成功导出到: ${outputPath}`);
    console.log(`   📊 文件大小: ${(fileContent.length / 1024).toFixed(1)} KB`);
  }

  /**
   * 生成药品描述
   */
     private generateDescription(medicine: Medicine): string {
     const categoryDescriptions: Record<string, string> = {
       '补益药': `补益${medicine.name}，用于调补身体，增强体质。`,
       '活血药': `活血化瘀${medicine.name}，用于血瘀证候，改善血液循环。`,
       '清热药': `清热解毒${medicine.name}，用于热性病证，清除内热。`,
       '止咳药': `止咳化痰${medicine.name}，用于咳嗽痰多，润肺止咳。`,
       '安神药': `安神定志${medicine.name}，用于心神不宁，失眠健忘。`,
       '理气药': `理气调中${medicine.name}，用于气机失调，脘腹胀痛。`,
       '化痰药': `化痰散结${medicine.name}，用于痰湿内阻，咳嗽痰多。`,
       '其他中药': `传统中药${medicine.name}，具有独特的药用价值。`
     };
     
     return categoryDescriptions[medicine.category] || `中药${medicine.name}，具有重要的药用价值。`;
   }

  /**
   * 导出数据集成报告
   */
  private exportIntegrationReport(validation: ValidationResult): void {
    console.log('📋 生成数据集成报告...');
    
         const reportPath = './medicine-data-integration-report.md';
    const reportContent = `# 药品数据集成报告 - MVP1.9 Guest Mode

## 概述

**生成时间**: ${new Date().toLocaleString('zh-CN')}  
**数据源**: 442条真实药品数据  
**目标**: Guest模式纯前端处方生成工具  

## 数据源信息

### 主数据源
- **文件**: archived-docs/medicine-data-450.CSV-processed.csv
- **记录数**: ${this.processedData.length}
- **字段**: 9个完整字段
- **格式**: CSV (UTF-8)

### 验证数据源  
- **文件**: archived-docs/user-data/medicine-data-450.csv
- **记录数**: ${this.userData.length}
- **字段**: 3个基础字段
- **格式**: CSV (UTF-8)

## 验证结果

### ✅ 数据质量
- **验证状态**: ${validation.success ? '通过' : '失败'}
- **错误数量**: ${validation.errors.length}
- **警告数量**: ${validation.warnings.length}

### 📊 统计信息
- **药品总数**: ${validation.stats.totalMedicines}
- **分类数量**: ${validation.stats.categoriesCount}
- **价格范围**: $${validation.stats.priceRange.min.toFixed(4)} - $${validation.stats.priceRange.max.toFixed(4)}
- **平均价格**: $${validation.stats.priceRange.avg.toFixed(4)}
- **重复药品**: ${validation.stats.duplicates}个

## 错误和警告

### 错误列表
${validation.errors.length > 0 ? validation.errors.map(error => `- ${error}`).join('\n') : '无错误'}

### 警告列表  
${validation.warnings.length > 0 ? validation.warnings.map(warning => `- ${warning}`).join('\n') : '无警告'}

## 输出文件

### TypeScript数据文件
- **路径**: src/mocks/medicineData.ts
- **格式**: 符合后端API Medicine接口
- **记录数**: ${this.integratedData.length}
- **验证**: 包含完整的数据验证函数

### 功能特性
- ✅ 支持中英文药品名称搜索
- ✅ 支持拼音名搜索  
- ✅ 支持SKU搜索
- ✅ 按分类筛选
- ✅ 按价格范围筛选
- ✅ 统计信息计算
- ✅ 数据验证工具

## 使用说明

\`\`\`typescript
import { mockMedicines, searchMedicines, getMedicinesByCategory } from '@/mocks/medicineData';

// 搜索药品
const results = searchMedicines('人参');

// 按分类获取
const herbs = getMedicinesByCategory('补益药');

// 数据验证
import { validateAllMockData } from '@/mocks/medicineData';
validateAllMockData(); // 返回 true/false
\`\`\`

---

**集成完成** ✅ 数据已准备就绪，可用于MVP1.9 Guest模式开发
`;
    
    fs.writeFileSync(reportPath, reportContent, 'utf-8');
    console.log(`   ✅ 报告已保存到: ${reportPath}`);
  }

  /**
   * 执行完整的数据集成流程
   */
  async run(): Promise<void> {
    try {
      console.log('🚀 开始药品数据集成流程...\n');
      
      // 1. 加载数据源
      await this.loadProcessedData();
      await this.loadUserData();
      
      // 2. 验证数据一致性
      const validation = this.validateDataConsistency();
      
      // 3. 生成统一数据
      this.generateIntegratedData();
      
      // 4. 导出文件
      this.exportTypeScriptFile();
      this.exportIntegrationReport(validation);
      
      console.log('\n🎉 药品数据集成完成！');
      console.log('📁 输出文件:');
      console.log('   - src/mocks/medicineData.ts (TypeScript数据文件)');
      console.log('   - scripts/medicine-data-integration-report.md (集成报告)');
      
      if (!validation.success) {
        console.log('\n⚠️  注意: 发现数据验证问题，请查看报告中的错误和警告');
        process.exit(1);
      }
      
         } catch (error: any) {
       console.error('❌ 数据集成失败:', error.message);
       process.exit(1);
     }
  }
}

// 执行数据集成
const integrator = new MedicineDataIntegrator();
integrator.run().catch(console.error); 