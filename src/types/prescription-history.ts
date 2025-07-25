/**
 * 历史处方模块状态管理类型定义
 * 基于useReducer + Context架构的统一状态管理
 * 
 * @version 3.3 - API v3.3隐私合规升级适配
 * @date 2025-07-12
 */

import { PrescriptionStatus, Prescription, PrescriptionSearchParams } from './prescription';

// ==================== 状态管理类型定义 ====================

/**
 * 高级筛选参数 - API v3.3适配
 */
export interface AdvancedFilters {
  /** 日期范围筛选 */
  dateRange?: {
    start: Date;
    end: Date;
  };
  /** 状态筛选（支持多选） */
  status?: PrescriptionStatus[];
  /** 金额范围筛选 */
  amountRange?: {
    min: number;
    max: number;
  };
  /** 药品ID筛选（支持多选） */
  medicineIds?: string[];
  /** 医师ID筛选 */
  doctorId?: string;
  /** 优先级筛选（支持多选） */
  priority?: ('low' | 'normal' | 'high' | 'urgent')[];
  /** 处方类型筛选 */
  prescriptionType?: string[];
  // 注意：移除patientPhone字段 - API v3.3隐私合规
}

/**
 * 扩展的处方显示信息 - API v3.3适配
 */
export interface UnifiedPrescription extends Prescription {
  /** 显示状态（用于UI展示） */
  displayStatus: PrescriptionDisplayStatus;
  /** 格式化的创建时间 */
  formattedCreatedAt: string;
  /** 药品数量统计 */
  medicinesCount: number;
  /** 药品总重量 (API v3.3: grossWeight字段) */
  totalWeight: number;
  /** 药品摘要文本 */
  totalMedicines: string;
  /** 总金额 (API v3.3: totalPrice字段) */
  totalAmount: number;
  /** 是否紧急 */
  isUrgent: boolean;
  /** 是否可编辑 */
  isEditable: boolean;
  /** 是否已支付 - 基于状态派生 */
  isPaid?: boolean;
  /** 最后更新者 */
  lastUpdatedBy?: string;
  /** 状态历史记录 */
  statusHistory?: StatusHistoryItem[];
  // 注意：移除所有患者相关字段 - API v3.3隐私合规
  // patientName, patientDisplayName, patientAge, patientInfo 等字段已移除
}

/**
 * 处方显示状态
 */
export interface PrescriptionDisplayStatus {
  /** 状态标签 */
  label: string;
  /** 状态颜色 */
  color: 'gray' | 'blue' | 'yellow' | 'green' | 'red' | 'purple';
  /** 状态图标 */
  icon: string;
  /** 是否为最终状态 */
  isFinal: boolean;
}

/**
 * 状态历史记录项
 */
export interface StatusHistoryItem {
  /** 状态 */
  status: PrescriptionStatus;
  /** 变更时间 */
  timestamp: string;
  /** 操作者 */
  operator?: string;
  /** 备注 */
  notes?: string;
  /** 操作类型 */
  actionType: 'created' | 'updated' | 'cancelled' | 'completed' | 'paid' | 'dispensed';
}

/**
 * 批量操作参数
 */
export interface BatchOperationParams {
  /** 选中的处方ID列表 */
  prescriptionIds: string[];
  /** 操作类型 */
  operation: 'export' | 'print' | 'cancel' | 'archive' | 'delete';
  /** 操作选项 */
  options?: {
    /** 导出格式 */
    format?: 'pdf' | 'excel' | 'csv';
    /** 是否包含详细信息 */
    includeDetails?: boolean;
    /** 自定义参数 */
    [key: string]: any;
  };
}

/**
 * 批量操作结果
 */
export interface BatchOperationResult {
  /** 操作是否成功 */
  success: boolean;
  /** 成功处理的数量 */
  successCount: number;
  /** 失败的数量 */
  failureCount: number;
  /** 错误信息 */
  errors?: string[];
  /** 下载链接（用于导出操作） */
  downloadUrl?: string;
  /** 打印预览链接（用于打印操作） */
  printUrl?: string;
}

/**
 * 处方历史主状态
 */
export interface PrescriptionHistoryState {
  // ============ 数据状态 ============
  /** 处方列表 */
  prescriptions: UnifiedPrescription[];
  /** 总数量 */
  total: number;
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 最后加载时间 */
  lastLoadTime: number | null;

  // ============ UI状态 ============
  /** 选中的处方ID列表 */
  selectedIds: string[];
  /** 是否处于批量操作模式 */
  batchMode: boolean;
  /** 当前查看的处方详情 */
  viewingPrescription: UnifiedPrescription | null;
  /** 是否显示详情弹窗 */
  showDetailModal: boolean;

  // ============ 筛选状态 ============
  /** 高级筛选条件 */
  filters: AdvancedFilters;
  /** 基础搜索参数 */
  searchParams: PrescriptionSearchParams;
  /** 活跃的筛选标签 */
  activeFilterTags: string[];

  // ============ 实时更新状态 ============
  /** WebSocket连接状态 */
  realtimeConnected: boolean;
  /** 状态更新记录 */
  statusUpdates: Record<string, PrescriptionStatus>;
  /** 最后同步时间 */
  lastSyncTime: number | null;

  // ============ 缓存状态 ============
  /** 缓存的搜索结果 */
  cachedResults: Record<string, {
    data: UnifiedPrescription[];
    timestamp: number;
    total: number;
  }>;
  /** 缓存过期时间（毫秒） */
  cacheExpiry: number;

  // ============ 批量操作状态 ============
  /** 批量操作进行中 */
  batchOperationInProgress: boolean;
  /** 当前批量操作类型 */
  currentBatchOperation: string | null;
  /** 批量操作进度 */
  batchProgress: {
    total: number;
    completed: number;
    failed: number;
  } | null;
}

/**
 * 处方历史状态管理动作类型
 */
export type PrescriptionHistoryAction =
  // ============ 数据加载动作 ============
  | { type: 'LOAD_START' }
  | { 
      type: 'LOAD_SUCCESS'; 
      payload: { 
        prescriptions: UnifiedPrescription[]; 
        total: number;
        fromCache?: boolean;
      } 
    }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'REFRESH_DATA' }
  | { type: 'CLEAR_ERROR' }

  // ============ 筛选动作 ============
  | { type: 'UPDATE_FILTERS'; payload: Partial<AdvancedFilters> }
  | { type: 'UPDATE_SEARCH_PARAMS'; payload: Partial<PrescriptionSearchParams> }
  | { type: 'RESET_FILTERS' }
  | { type: 'ADD_FILTER_TAG'; payload: string }
  | { type: 'REMOVE_FILTER_TAG'; payload: string }

  // ============ 选择动作 ============
  | { type: 'SELECT_PRESCRIPTION'; payload: string }
  | { type: 'DESELECT_PRESCRIPTION'; payload: string }
  | { type: 'SELECT_ALL' }
  | { type: 'DESELECT_ALL' }
  | { type: 'TOGGLE_PRESCRIPTION_SELECTION'; payload: string }

  // ============ 批量操作动作 ============
  | { type: 'TOGGLE_BATCH_MODE' }
  | { type: 'START_BATCH_OPERATION'; payload: { operation: string; total: number } }
  | { type: 'UPDATE_BATCH_PROGRESS'; payload: { completed: number; failed: number } }
  | { type: 'COMPLETE_BATCH_OPERATION'; payload: BatchOperationResult }
  | { type: 'CANCEL_BATCH_OPERATION' }

  // ============ 详情查看动作 ============
  | { type: 'VIEW_PRESCRIPTION_DETAIL'; payload: UnifiedPrescription }
  | { type: 'CLOSE_PRESCRIPTION_DETAIL' }

  // ============ 实时更新动作 ============
  | { type: 'WEBSOCKET_CONNECTED' }
  | { type: 'WEBSOCKET_DISCONNECTED' }
  | { 
      type: 'REALTIME_STATUS_UPDATE'; 
      payload: { 
        prescriptionId: string; 
        status: PrescriptionStatus;
        timestamp: string;
        operator?: string;
      } 
    }
  | { type: 'SYNC_REALTIME_UPDATES' }

  // ============ 缓存动作 ============
  | { 
      type: 'UPDATE_CACHE'; 
      payload: { 
        key: string; 
        data: UnifiedPrescription[]; 
        total: number;
      } 
    }
  | { type: 'CLEAR_CACHE' }
  | { type: 'EXPIRE_CACHE'; payload: string }

  // ============ 系统动作 ============
  | { type: 'RESET_STATE' }
  | { type: 'UPDATE_TIMESTAMP'; payload: { field: 'lastLoadTime' | 'lastSyncTime'; timestamp: number } };

// ==================== Hook 和 Context 类型定义 ====================

/**
 * 处方历史Context值类型
 */
export interface PrescriptionHistoryContextValue {
  /** 当前状态 */
  state: PrescriptionHistoryState;
  /** 分发动作函数 */
  dispatch: React.Dispatch<PrescriptionHistoryAction>;
  
  // ============ 业务方法 ============
  /** 加载处方数据 */
  loadPrescriptions: (params?: Partial<PrescriptionSearchParams>) => Promise<void>;
  /** 刷新数据 */
  refreshData: () => Promise<void>;
  /** 搜索处方 */
  searchPrescriptions: (query: string) => Promise<void>;
  
  // ============ 筛选方法 ============
  /** 更新筛选条件 */
  updateFilters: (filters: Partial<AdvancedFilters>) => void;
  /** 重置筛选条件 */
  resetFilters: () => void;
  /** 应用快速筛选 */
  applyQuickFilter: (filterType: string, value: any) => void;
  
  // ============ 选择方法 ============
  /** 切换处方选择状态 */
  toggleSelection: (prescriptionId: string) => void;
  /** 全选/取消全选 */
  toggleSelectAll: () => void;
  /** 获取选中的处方 */
  getSelectedPrescriptions: () => UnifiedPrescription[];
  
  // ============ 批量操作方法 ============
  /** 执行批量操作 */
  executeBatchOperation: (params: BatchOperationParams) => Promise<BatchOperationResult>;
  /** 取消批量操作 */
  cancelBatchOperation: () => void;
  
  // ============ 详情查看方法 ============
  /** 查看处方详情 */
  viewPrescriptionDetail: (prescription: UnifiedPrescription) => void;
  /** 关闭详情弹窗 */
  closeDetailModal: () => void;
  
  // ============ 实时更新方法 ============
  /** 初始化WebSocket连接 */
  initializeRealtime: () => void;
  /** 断开WebSocket连接 */
  disconnectRealtime: () => void;
  /** 手动同步状态 */
  syncStatus: (prescriptionId: string) => Promise<void>;
}

/**
 * usePrescriptionHistory Hook 配置选项
 */
export interface UsePrescriptionHistoryOptions {
  /** 是否自动加载数据 */
  autoLoad?: boolean;
  /** 初始搜索参数 */
  initialParams?: Partial<PrescriptionSearchParams>;
  /** 是否启用实时更新 */
  enableRealtime?: boolean;
  /** 是否启用缓存 */
  enableCache?: boolean;
  /** 缓存过期时间（毫秒，默认5分钟） */
  cacheExpiry?: number;
  /** 是否启用批量操作 */
  enableBatchOperations?: boolean;
}

/**
 * 实时更新配置
 */
export interface RealtimeConfig {
  /** WebSocket连接URL */
  wsUrl?: string;
  /** 重连配置 */
  reconnection?: {
    enabled: boolean;
    attempts: number;
    delay: number;
  };
  /** 事件订阅配置 */
  events?: string[];
}

// ==================== 工具类型 ====================

/**
 * 排序配置
 */
export interface SortConfig {
  /** 排序字段 */
  field: keyof UnifiedPrescription;
  /** 排序方向 */
  direction: 'asc' | 'desc';
}

/**
 * 分页配置
 */
export interface PaginationConfig {
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  limit: number;
  /** 总数量 */
  total: number;
  /** 总页数 */
  totalPages: number;
}

/**
 * 表格显示配置
 */
export interface TableDisplayConfig {
  /** 可见列 */
  visibleColumns: string[];
  /** 列宽设置 */
  columnWidths: Record<string, number>;
  /** 是否启用虚拟滚动 */
  enableVirtualScroll: boolean;
  /** 行高 */
  rowHeight: number;
}

/**
 * 导出配置
 */
export interface ExportConfig {
  /** 导出格式 */
  format: 'pdf' | 'excel' | 'csv';
  /** 包含字段 */
  includeFields: string[];
  /** 是否包含详细信息 */
  includeDetails: boolean;
  /** 文件名前缀 */
  fileNamePrefix?: string;
}