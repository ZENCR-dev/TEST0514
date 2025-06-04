/**
 * 处方管理服务
 * 用于药房端处方查询、状态管理等功能
 */

import { delay, generateId } from '@/utils/helpers';

// 处方状态枚举
export type PrescriptionStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

// 处方项目接口
export interface PrescriptionItem {
  id: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
}

// 处方接口
export interface Prescription {
  id: string;
  patientName: string;
  patientPhone?: string;
  doctorName: string;
  doctorId: string;
  pharmacyId?: string;
  pharmacyName?: string;
  items: PrescriptionItem[];
  copies: number;
  instructions: string;
  totalAmount: number;
  status: PrescriptionStatus;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  completedAt?: string;
  qrCode?: string;
}

// 处方搜索参数
export interface PrescriptionSearchParams {
  query?: string;
  status?: PrescriptionStatus;
  pharmacyId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// 分页处方结果
export interface PaginatedPrescriptions {
  data: Prescription[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 模拟处方数据
const mockPrescriptions: Prescription[] = [
  {
    id: 'RX-20231201-001',
    patientName: '张三',
    patientPhone: '13800138001',
    doctorName: '李医生',
    doctorId: 'doctor_001',
    pharmacyId: 'pharmacy_001',
    pharmacyName: '康复药房',
    items: [
      {
        id: 'item_001',
        medicineId: 'med_001',
        medicineName: '人参',
        quantity: 10,
        unit: '克',
        pricePerUnit: 2.5,
        totalPrice: 25
      },
      {
        id: 'item_002',
        medicineId: 'med_002',
        medicineName: '当归',
        quantity: 15,
        unit: '克',
        pricePerUnit: 1.8,
        totalPrice: 27
      }
    ],
    copies: 7,
    instructions: '水煎服，每日一剂，分早晚两次服用',
    totalAmount: 364, // (25 + 27) * 7
    status: 'pending',
    createdAt: '2023-12-01T09:00:00Z',
    updatedAt: '2023-12-01T09:00:00Z',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  },
  {
    id: 'RX-20231201-002',
    patientName: '李四',
    patientPhone: '13800138002',
    doctorName: '王医生',
    doctorId: 'doctor_002',
    pharmacyId: 'pharmacy_001',
    pharmacyName: '康复药房',
    items: [
      {
        id: 'item_003',
        medicineId: 'med_003',
        medicineName: '黄芪',
        quantity: 20,
        unit: '克',
        pricePerUnit: 1.2,
        totalPrice: 24
      }
    ],
    copies: 5,
    instructions: '水煎服，每日一剂',
    totalAmount: 120,
    status: 'processing',
    createdAt: '2023-12-01T10:30:00Z',
    updatedAt: '2023-12-01T11:00:00Z',
    processedAt: '2023-12-01T11:00:00Z'
  },
  {
    id: 'RX-20231201-003',
    patientName: '王五',
    patientPhone: '13800138003',
    doctorName: '张医生',
    doctorId: 'doctor_003',
    pharmacyId: 'pharmacy_001',
    pharmacyName: '康复药房',
    items: [
      {
        id: 'item_004',
        medicineId: 'med_004',
        medicineName: '甘草',
        quantity: 6,
        unit: '克',
        pricePerUnit: 0.8,
        totalPrice: 4.8
      },
      {
        id: 'item_005',
        medicineId: 'med_005',
        medicineName: '白术',
        quantity: 12,
        unit: '克',
        pricePerUnit: 1.5,
        totalPrice: 18
      }
    ],
    copies: 3,
    instructions: '水煎服，每日一剂，饭后服用',
    totalAmount: 68.4,
    status: 'completed',
    createdAt: '2023-11-30T14:00:00Z',
    updatedAt: '2023-12-01T16:30:00Z',
    processedAt: '2023-12-01T15:00:00Z',
    completedAt: '2023-12-01T16:30:00Z'
  }
];

// 模拟存储
let allPrescriptions: Prescription[] = [...mockPrescriptions];

/**
 * 获取处方列表（分页和筛选）
 */
export async function getPrescriptions(params: PrescriptionSearchParams = {}): Promise<PaginatedPrescriptions> {
  await delay(600);
  
  const {
    query = '',
    status,
    pharmacyId,
    dateFrom,
    dateTo,
    page = 1,
    limit = 10
  } = params;
  
  // 过滤处方
  let filtered = [...allPrescriptions];
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    filtered = filtered.filter(prescription => 
      prescription.id.toLowerCase().includes(lowerQuery) ||
      prescription.patientName.toLowerCase().includes(lowerQuery) ||
      prescription.doctorName.toLowerCase().includes(lowerQuery) ||
      prescription.patientPhone?.toLowerCase().includes(lowerQuery)
    );
  }
  
  if (status) {
    filtered = filtered.filter(prescription => prescription.status === status);
  }
  
  if (pharmacyId) {
    filtered = filtered.filter(prescription => prescription.pharmacyId === pharmacyId);
  }
  
  if (dateFrom) {
    filtered = filtered.filter(prescription => prescription.createdAt >= dateFrom);
  }
  
  if (dateTo) {
    filtered = filtered.filter(prescription => prescription.createdAt <= dateTo);
  }
  
  // 按创建时间倒序排列
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // 计算分页
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  // 返回当前页数据
  const paginatedData = filtered.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    total,
    page,
    limit,
    totalPages
  };
}

/**
 * 根据ID获取处方详情
 */
export async function getPrescriptionById(id: string): Promise<Prescription | null> {
  await delay(300);
  return allPrescriptions.find(prescription => prescription.id === id) || null;
}

/**
 * 更新处方状态
 */
export async function updatePrescriptionStatus(
  id: string, 
  status: PrescriptionStatus,
  pharmacyId?: string
): Promise<Prescription> {
  await delay(500);
  
  const prescriptionIndex = allPrescriptions.findIndex(p => p.id === id);
  
  if (prescriptionIndex === -1) {
    throw new Error('处方不存在');
  }
  
  const now = new Date().toISOString();
  const updatedPrescription = {
    ...allPrescriptions[prescriptionIndex],
    status,
    updatedAt: now
  };
  
  // 根据状态更新相应的时间戳
  if (status === 'processing' && !updatedPrescription.processedAt) {
    updatedPrescription.processedAt = now;
  }
  
  if (status === 'completed' && !updatedPrescription.completedAt) {
    updatedPrescription.completedAt = now;
  }
  
  if (pharmacyId) {
    updatedPrescription.pharmacyId = pharmacyId;
  }
  
  // 模拟保存到数据库
  allPrescriptions[prescriptionIndex] = updatedPrescription;
  
  return updatedPrescription;
}

/**
 * 获取处方统计信息
 */
export async function getPrescriptionStats(pharmacyId?: string): Promise<{
  total: number;
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
}> {
  await delay(300);
  
  let prescriptions = allPrescriptions;
  
  if (pharmacyId) {
    prescriptions = prescriptions.filter(p => p.pharmacyId === pharmacyId);
  }
  
  const stats = {
    total: prescriptions.length,
    pending: prescriptions.filter(p => p.status === 'pending').length,
    processing: prescriptions.filter(p => p.status === 'processing').length,
    completed: prescriptions.filter(p => p.status === 'completed').length,
    cancelled: prescriptions.filter(p => p.status === 'cancelled').length,
  };
  
  return stats;
}

/**
 * 创建新处方（医生端使用）
 */
export async function createPrescription(prescriptionData: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prescription> {
  await delay(800);
  
  const now = new Date().toISOString();
  const newPrescription: Prescription = {
    id: generateId('RX'),
    ...prescriptionData,
    createdAt: now,
    updatedAt: now
  };
  
  allPrescriptions.push(newPrescription);
  return newPrescription;
}

/**
 * 取消处方
 */
export async function cancelPrescription(id: string, reason?: string): Promise<Prescription> {
  await delay(400);
  
  const prescriptionIndex = allPrescriptions.findIndex(p => p.id === id);
  
  if (prescriptionIndex === -1) {
    throw new Error('处方不存在');
  }
  
  const prescription = allPrescriptions[prescriptionIndex];
  
  if (prescription.status === 'completed') {
    throw new Error('已完成的处方无法取消');
  }
  
  const updatedPrescription = {
    ...prescription,
    status: 'cancelled' as PrescriptionStatus,
    updatedAt: new Date().toISOString()
  };
  
  allPrescriptions[prescriptionIndex] = updatedPrescription;
  
  return updatedPrescription;
} 