/**
 * Guest模式数据管理器
 * MVP1.9 Guest Mode Data Manager
 * 
 * 功能：
 * - 内存中临时处方存储（非localStorage）
 * - 处方CRUD操作
 * - 唯一ID生成
 * - 演示数据标识
 * - 手动清空功能
 */

import { MedicineItem, LocalPrescription } from '../types/guest';

class GuestDataManager {
  private tempPrescriptions: LocalPrescription[] = [];

  /**
   * 保存处方到内存中
   * @param prescription 处方数据 (不包含id, createdAt, isDemo)
   * @returns 完整的LocalPrescription对象
   */
  savePrescription(prescription: Omit<LocalPrescription, 'id' | 'createdAt' | 'isDemo'>): LocalPrescription {
    const localPrescription: LocalPrescription = {
      ...prescription,
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      isDemo: true
    };

    this.tempPrescriptions.push(localPrescription);
    return localPrescription;
  }

  /**
   * 获取所有处方数据
   * @returns 处方列表的副本
   */
  getPrescriptions(): LocalPrescription[] {
    // 返回副本，防止外部直接修改原数据
    return [...this.tempPrescriptions];
  }

  /**
   * 清空所有处方数据
   */
  clearPrescriptions(): void {
    this.tempPrescriptions = [];
  }

  /**
   * 手动清空功能 - 用户点击清空按钮时调用
   * 导出或打印完成后可清理已生成的处方
   */
  clearAfterExport(): void {
    this.clearPrescriptions();
    console.log('处方数据已清空');
  }
}

// 导出单例实例
export const guestDataManager = new GuestDataManager();