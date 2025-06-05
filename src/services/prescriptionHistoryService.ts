import { 
  PrescriptionHistory, 
  HistorySearchParams
} from '@/types/prescription';
import { PaginatedResult } from '@/types/common';
import { 
  mockPrescriptionHistory, 
  getFilteredPrescriptionHistory 
} from '@/mocks/prescriptionHistoryData';

/**
 * 处方历史服务类
 * 提供处方历史记录的查询、搜索和管理功能
 */
export class PrescriptionHistoryService {
  
  /**
   * 获取处方历史记录列表（支持搜索和分页）
   */
  static async getHistory(params: HistorySearchParams = {}): Promise<PaginatedResult<PrescriptionHistory>> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const result = getFilteredPrescriptionHistory({
        query: params.query,
        status: params.status,
        startDate: params.startDate,
        endDate: params.endDate,
        page: params.page || 1,
        limit: params.limit || 10
      });
      
      return result;
    } catch (error) {
      console.error('获取处方历史失败:', error);
      throw new Error('获取处方历史记录失败，请稍后重试');
    }
  }
  
  /**
   * 根据ID获取单个处方历史记录
   */
  static async getHistoryById(id: string): Promise<PrescriptionHistory> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      const history = mockPrescriptionHistory.find(item => item.id === id);
      
      if (!history) {
        throw new Error('处方历史记录不存在');
      }
      
      return history;
    } catch (error) {
      console.error('获取处方历史详情失败:', error);
      throw error;
    }
  }
  
  /**
   * 搜索处方历史记录
   */
  static async searchHistory(query: string): Promise<PrescriptionHistory[]> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 250));
    
    try {
      if (!query.trim()) {
        return [];
      }
      
      const searchQuery = query.toLowerCase();
      const results = mockPrescriptionHistory.filter(item => 
        item.patientName.toLowerCase().includes(searchQuery) ||
        item.prescriptionId.toLowerCase().includes(searchQuery) ||
        item.notes?.toLowerCase().includes(searchQuery) ||
        item.items.some(medicine => 
          medicine.medicineName.toLowerCase().includes(searchQuery)
        )
      );
      
      // 按创建时间倒序排列
      return results.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('搜索处方历史失败:', error);
      throw new Error('搜索处方历史记录失败，请稍后重试');
    }
  }
  
  /**
   * 获取处方状态统计
   */
  static async getStatusStatistics(): Promise<Record<string, number>> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 150));
    
    try {
      const stats = mockPrescriptionHistory.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // 添加总数
      stats.total = mockPrescriptionHistory.length;
      
      return stats;
    } catch (error) {
      console.error('获取处方状态统计失败:', error);
      throw new Error('获取统计信息失败，请稍后重试');
    }
  }
  
  /**
   * 获取最近的处方历史记录
   */
  static async getRecentHistory(limit: number = 5): Promise<PrescriptionHistory[]> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const recent = [...mockPrescriptionHistory]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
      
      return recent;
    } catch (error) {
      console.error('获取最近处方历史失败:', error);
      throw new Error('获取最近处方记录失败，请稍后重试');
    }
  }
  
  /**
   * 导出处方历史记录（模拟功能）
   */
  static async exportHistory(params: HistorySearchParams = {}): Promise<string> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const result = getFilteredPrescriptionHistory(params);
      
      // 模拟生成下载链接
      const downloadUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(
        '处方ID,患者姓名,创建时间,状态,总价\n' +
        result.data.map(item => 
          `${item.prescriptionId},${item.patientName},${item.createdAt},${item.status},${item.totalPrice}`
        ).join('\n')
      )}`;
      
      return downloadUrl;
    } catch (error) {
      console.error('导出处方历史失败:', error);
      throw new Error('导出处方历史记录失败，请稍后重试');
    }
  }
} 