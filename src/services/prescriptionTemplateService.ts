import { 
  PrescriptionTemplate, 
  TemplateSearchParams, 
  CreateTemplateData,
  UpdateTemplateData
} from '@/types/prescription';
import { PaginatedResult } from '@/types/common';
import { 
  mockPrescriptionTemplates, 
  getFilteredPrescriptionTemplates,
  getTemplateById,
  getPopularTemplates,
  getRecentTemplates,
  templateCategories
} from '@/mocks/prescriptionTemplateData';

/**
 * 处方模板服务类
 * 提供处方模板的查询、创建、编辑和管理功能
 */
export class PrescriptionTemplateService {
  
  /**
   * 获取处方模板列表（支持搜索和分页）
   */
  static async getTemplates(params: TemplateSearchParams = {}): Promise<PaginatedResult<PrescriptionTemplate>> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const result = getFilteredPrescriptionTemplates(params);
      return result;
    } catch (error) {
      console.error('获取处方模板失败:', error);
      throw new Error('获取处方模板失败，请稍后重试');
    }
  }
  
  /**
   * 根据ID获取单个处方模板
   */
  static async getTemplateById(id: string): Promise<PrescriptionTemplate> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      const template = getTemplateById(id);
      
      if (!template) {
        throw new Error('处方模板不存在');
      }
      
      return template;
    } catch (error) {
      console.error('获取处方模板详情失败:', error);
      throw error;
    }
  }
  
  /**
   * 搜索处方模板
   */
  static async searchTemplates(query: string): Promise<PrescriptionTemplate[]> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 250));
    
    try {
      if (!query.trim()) {
        return [];
      }
      
      const searchQuery = query.toLowerCase();
      const results = mockPrescriptionTemplates.filter(template => 
        template.name.toLowerCase().includes(searchQuery) ||
        template.description?.toLowerCase().includes(searchQuery) ||
        template.category.toLowerCase().includes(searchQuery) ||
        template.items.some(item => 
          item.medicineName.toLowerCase().includes(searchQuery)
        )
      );
      
      // 按使用次数倒序排列
      return results.sort((a, b) => b.usageCount - a.usageCount);
    } catch (error) {
      console.error('搜索处方模板失败:', error);
      throw new Error('搜索处方模板失败，请稍后重试');
    }
  }
  
  /**
   * 创建新的处方模板
   */
  static async createTemplate(data: CreateTemplateData): Promise<PrescriptionTemplate> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // 验证数据
      if (!data.name?.trim()) {
        throw new Error('模板名称不能为空');
      }
      
      if (!data.category?.trim()) {
        throw new Error('模板分类不能为空');
      }
      
      if (!data.items || data.items.length === 0) {
        throw new Error('模板必须包含至少一个药品');
      }
      
      // 生成新模板
      const newTemplate: PrescriptionTemplate = {
        id: `tmpl_${Date.now()}`,
        name: data.name.trim(),
        description: data.description?.trim(),
        category: data.category.trim(),
        items: data.items.map(item => ({
          medicineId: item.medicineId,
          medicineName: item.medicineName,
          medicineEnglishName: undefined, // CreateTemplateData中不包含英文名，设为undefined
          defaultQuantity: item.defaultQuantity,
          notes: item.notes
        })),
        defaultInstructions: data.defaultInstructions?.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        isDefault: data.isDefault || false,
        creatorId: 'current_user_id', // 实际应用中从认证上下文获取
        creatorName: '当前用户' // 实际应用中从认证上下文获取
      };
      
      // 模拟保存到数据库
      mockPrescriptionTemplates.push(newTemplate);
      
      return newTemplate;
    } catch (error) {
      console.error('创建处方模板失败:', error);
      throw error;
    }
  }
  
  /**
   * 更新处方模板
   */
  static async updateTemplate(id: string, data: UpdateTemplateData): Promise<PrescriptionTemplate> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const templateIndex = mockPrescriptionTemplates.findIndex(template => template.id === id);
      
      if (templateIndex === -1) {
        throw new Error('处方模板不存在');
      }
      
      const existingTemplate = mockPrescriptionTemplates[templateIndex];
      
      // 验证权限（实际应用中应该检查用户权限）
      // if (existingTemplate.creatorId !== 'current_user_id') {
      //   throw new Error('无权限编辑此模板');
      // }
      
      // 更新模板
      const updatedTemplate: PrescriptionTemplate = {
        ...existingTemplate,
        ...data,
        id: existingTemplate.id, // 保持ID不变
        createdAt: existingTemplate.createdAt, // 保持创建时间不变
        updatedAt: new Date().toISOString(),
        usageCount: existingTemplate.usageCount, // 保持使用次数不变
        items: data.items ? data.items.map(item => ({
          medicineId: item.medicineId,
          medicineName: item.medicineName,
          medicineEnglishName: undefined, // UpdateTemplateData中可能不包含英文名
          defaultQuantity: item.defaultQuantity,
          notes: item.notes
        })) : existingTemplate.items
      };
      
      // 模拟保存到数据库
      mockPrescriptionTemplates[templateIndex] = updatedTemplate;
      
      return updatedTemplate;
    } catch (error) {
      console.error('更新处方模板失败:', error);
      throw error;
    }
  }
  
  /**
   * 删除处方模板
   */
  static async deleteTemplate(id: string): Promise<void> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const templateIndex = mockPrescriptionTemplates.findIndex(template => template.id === id);
      
      if (templateIndex === -1) {
        throw new Error('处方模板不存在');
      }
      
      const template = mockPrescriptionTemplates[templateIndex];
      
      // 验证权限（实际应用中应该检查用户权限）
      // if (template.creatorId !== 'current_user_id') {
      //   throw new Error('无权限删除此模板');
      // }
      
      // 检查是否为默认模板
      if (template.isDefault) {
        throw new Error('不能删除默认模板');
      }
      
      // 模拟从数据库删除
      mockPrescriptionTemplates.splice(templateIndex, 1);
    } catch (error) {
      console.error('删除处方模板失败:', error);
      throw error;
    }
  }
  
  /**
   * 增加模板使用次数
   */
  static async incrementUsageCount(id: string): Promise<void> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const template = mockPrescriptionTemplates.find(template => template.id === id);
      
      if (template) {
        template.usageCount += 1;
        template.updatedAt = new Date().toISOString();
      }
    } catch (error) {
      console.error('更新模板使用次数失败:', error);
      // 这里不抛出错误，因为这不是关键操作
    }
  }
  
  /**
   * 获取热门模板
   */
  static async getPopularTemplates(limit: number = 5): Promise<PrescriptionTemplate[]> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 150));
    
    try {
      return getPopularTemplates(limit);
    } catch (error) {
      console.error('获取热门模板失败:', error);
      throw new Error('获取热门模板失败，请稍后重试');
    }
  }
  
  /**
   * 获取最近创建的模板
   */
  static async getRecentTemplates(limit: number = 5): Promise<PrescriptionTemplate[]> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 150));
    
    try {
      return getRecentTemplates(limit);
    } catch (error) {
      console.error('获取最近模板失败:', error);
      throw new Error('获取最近模板失败，请稍后重试');
    }
  }
  
  /**
   * 获取模板分类统计
   */
  static async getTemplateCategories(): Promise<typeof templateCategories> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      return templateCategories;
    } catch (error) {
      console.error('获取模板分类失败:', error);
      throw new Error('获取模板分类失败，请稍后重试');
    }
  }
  
  /**
   * 复制模板
   */
  static async duplicateTemplate(id: string, newName?: string): Promise<PrescriptionTemplate> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 400));
    
    try {
      const originalTemplate = await this.getTemplateById(id);
      
      const duplicatedTemplate: CreateTemplateData = {
        name: newName || `${originalTemplate.name} (副本)`,
        description: originalTemplate.description,
        category: originalTemplate.category,
        items: originalTemplate.items.map(item => ({
          medicineId: item.medicineId,
          medicineName: item.medicineName,
          defaultQuantity: item.defaultQuantity,
          notes: item.notes
        })),
        defaultInstructions: originalTemplate.defaultInstructions,
        isDefault: false // 复制的模板不能是默认模板
      };
      
      return await this.createTemplate(duplicatedTemplate);
    } catch (error) {
      console.error('复制处方模板失败:', error);
      throw error;
    }
  }
} 