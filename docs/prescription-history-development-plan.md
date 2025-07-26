# 历史处方管理功能开发计划

## 📋 功能概述

历史处方管理是医师端的核心功能之一，允许医师查看、筛选、管理历史处方记录，并实时跟踪处方状态变化。基于现有的`doctor/history.tsx`页面，需要增强WebSocket集成和状态管理。

## 🎯 功能需求分析

### 现有功能评估
- ✅ **已实现**：
  - 处方列表展示（PrescriptionHistoryService）
  - 日期范围和状态筛选
  - 分页功能
  - 统计卡片显示
  - 处方详情Modal（PrescriptionHistoryModal）
  - 数据导出功能
  - useOrchestrationEvents Hook

- ⚠️ **需增强**：
  - WebSocket实时状态更新
  - 批量操作功能
  - 高级筛选条件
  - 打印功能集成
  - 性能优化（虚拟滚动）

## 🏗️ 架构设计

### 1. 组件结构
```
components/
├── doctor/
│   ├── PrescriptionHistoryModal.tsx    # ✅ 处方详情弹窗
│   ├── PrescriptionHistoryTable.tsx    # 🆕 表格组件（抽离）
│   ├── PrescriptionFilters.tsx         # 🆕 高级筛选组件
│   ├── PrescriptionBatchActions.tsx    # 🆕 批量操作组件
│   └── PrescriptionStatusTimeline.tsx  # 🆕 状态时间线组件
├── common/
│   ├── VirtualTable.tsx                # 🆕 虚拟滚动表格
│   └── ExportMenu.tsx                  # 🆕 导出菜单组件
```

### 2. 服务层增强
```typescript
// services/prescriptionHistoryService.ts 增强
export interface AdvancedSearchParams extends HistorySearchParams {
  patientPhone?: string;
  medicineIds?: string[];
  minAmount?: number;
  maxAmount?: number;
  doctorId?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

export interface BatchOperationParams {
  prescriptionIds: string[];
  operation: 'export' | 'print' | 'cancel' | 'archive';
  options?: any;
}

// 新增方法
export class PrescriptionHistoryService {
  // ... 现有方法

  // 高级搜索
  static async advancedSearch(params: AdvancedSearchParams): Promise<PrescriptionHistoryResponse> {
    const queryParams = this.buildAdvancedQueryParams(params);
    const response = await apiClient.get(`/prescriptions/search`, { params: queryParams });
    return this.transformResponse(response.data);
  }

  // 批量操作
  static async batchOperation(params: BatchOperationParams): Promise<BatchOperationResult> {
    const response = await apiClient.post(`/prescriptions/batch`, params);
    return response.data;
  }

  // 获取处方状态历史
  static async getStatusHistory(prescriptionId: string): Promise<StatusHistoryItem[]> {
    const response = await apiClient.get(`/prescriptions/${prescriptionId}/status-history`);
    return response.data.data;
  }

  // 实时订阅处方更新
  static subscribeToPrescriptionUpdates(
    prescriptionIds: string[],
    onUpdate: (update: PrescriptionUpdate) => void
  ): () => void {
    const unsubscribes = prescriptionIds.map(id => 
      wsService.subscribe(`prescription.${id}.updated`, onUpdate)
    );
    
    return () => unsubscribes.forEach(unsub => unsub());
  }
}
```

## 📦 核心组件实现

### 1. 增强的历史处方表格组件
```typescript
// components/doctor/PrescriptionHistoryTable.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { VirtualTable } from '@/components/common/VirtualTable';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PrescriptionHistory } from '@/types/prescription';
import { formatDate, formatCurrency } from '@/utils/formatters';

interface PrescriptionHistoryTableProps {
  data: PrescriptionHistory[];
  loading: boolean;
  onViewDetail: (item: PrescriptionHistory) => void;
  onSelectionChange: (selectedIds: string[]) => void;
  enableBatchSelection?: boolean;
}

export const PrescriptionHistoryTable: React.FC<PrescriptionHistoryTableProps> = ({
  data,
  loading,
  onViewDetail,
  onSelectionChange,
  enableBatchSelection = false
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allIds = new Set(data.map(item => item.id));
      setSelectedIds(allIds);
      onSelectionChange(Array.from(allIds));
    } else {
      setSelectedIds(new Set());
      onSelectionChange([]);
    }
  }, [data, onSelectionChange]);

  const handleSelectOne = useCallback((id: string, checked: boolean) => {
    const newSelection = new Set(selectedIds);
    if (checked) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    setSelectedIds(newSelection);
    onSelectionChange(Array.from(newSelection));
  }, [selectedIds, onSelectionChange]);

  const columns = useMemo(() => [
    {
      key: 'selection',
      header: () => enableBatchSelection && (
        <Checkbox
          checked={selectedIds.size === data.length && data.length > 0}
          indeterminate={selectedIds.size > 0 && selectedIds.size < data.length}
          onCheckedChange={handleSelectAll}
        />
      ),
      cell: (row: PrescriptionHistory) => enableBatchSelection && (
        <Checkbox
          checked={selectedIds.has(row.id)}
          onCheckedChange={(checked) => handleSelectOne(row.id, checked as boolean)}
        />
      ),
      width: 50,
    },
    {
      key: 'prescriptionId',
      header: '处方编号',
      cell: (row: PrescriptionHistory) => (
        <span className="font-mono text-sm">{row.prescriptionId}</span>
      ),
      width: 150,
    },
    {
      key: 'patientName',
      header: '患者姓名',
      cell: (row: PrescriptionHistory) => (
        <div>
          <div className="font-medium">{row.patientName}</div>
          {row.patientPhone && (
            <div className="text-sm text-gray-500">{row.patientPhone}</div>
          )}
        </div>
      ),
      width: 150,
    },
    {
      key: 'createdAt',
      header: '创建时间',
      cell: (row: PrescriptionHistory) => formatDate(row.createdAt),
      width: 180,
    },
    {
      key: 'medicines',
      header: '药品信息',
      cell: (row: PrescriptionHistory) => (
        <div className="text-sm">
          <div>{row.itemCount} 种药品</div>
          <div className="text-gray-500">{row.copies} 帖</div>
        </div>
      ),
      width: 100,
    },
    {
      key: 'totalPrice',
      header: '总金额',
      cell: (row: PrescriptionHistory) => (
        <span className="font-semibold">{formatCurrency(row.totalPrice)}</span>
      ),
      width: 100,
    },
    {
      key: 'status',
      header: '状态',
      cell: (row: PrescriptionHistory) => <StatusBadge status={row.status} />,
      width: 100,
    },
    {
      key: 'actions',
      header: '操作',
      cell: (row: PrescriptionHistory) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetail(row)}
          >
            查看
          </Button>
          {row.status === 'completed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePrint(row.id)}
            >
              打印
            </Button>
          )}
        </div>
      ),
      width: 150,
    },
  ], [data, selectedIds, enableBatchSelection, onViewDetail]);

  const handlePrint = useCallback(async (id: string) => {
    try {
      const printData = await PrescriptionHistoryService.getPrintData(id);
      window.open(printData.printUrl, '_blank');
    } catch (error) {
      toast.error('打印失败，请重试');
    }
  }, []);

  if (loading) {
    return <TableSkeleton rows={10} columns={columns.length} />;
  }

  return (
    <VirtualTable
      data={data}
      columns={columns}
      rowHeight={60}
      height={600}
      emptyMessage="暂无处方记录"
    />
  );
};

// 状态徽章组件
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    created: { label: '已创建', variant: 'default' as const, className: 'bg-gray-100' },
    paid: { label: '已支付', variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
    dispensed: { label: '已配药', variant: 'default' as const, className: 'bg-purple-100 text-purple-800' },
    completed: { label: '已完成', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
    cancelled: { label: '已取消', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
    expired: { label: '已过期', variant: 'outline' as const, className: 'bg-gray-100 text-gray-600' }
  };
  
  const config = statusConfig[status] || statusConfig.created;
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};
```

### 2. 高级筛选组件
```typescript
// components/doctor/PrescriptionFilters.tsx
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, FilterIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface FilterValues {
  dateRange?: { start: Date; end: Date };
  status?: string;
  patientPhone?: string;
  minAmount?: number;
  maxAmount?: number;
  medicineIds?: string[];
}

interface PrescriptionFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  onReset: () => void;
}

export const PrescriptionFilters: React.FC<PrescriptionFiltersProps> = ({
  onFilterChange,
  onReset
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleDateRangeChange = (range: { start?: Date; end?: Date }) => {
    if (range.start && range.end) {
      updateFilter('dateRange', { start: range.start, end: range.end });
      addActiveFilter('日期范围');
    }
  };

  const updateFilter = (key: keyof FilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const addActiveFilter = (label: string) => {
    if (!activeFilters.includes(label)) {
      setActiveFilters([...activeFilters, label]);
    }
  };

  const removeFilter = (key: keyof FilterValues, label: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    setActiveFilters(activeFilters.filter(f => f !== label));
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters({});
    setActiveFilters([]);
    onReset();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FilterIcon className="h-4 w-4" />
              高级筛选
              {activeFilters.length > 0 && (
                <Badge variant="secondary">{activeFilters.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-4" align="start">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">高级筛选</h3>
              
              {/* 日期范围选择 */}
              <div>
                <label className="text-sm font-medium mb-2 block">日期范围</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange ? (
                        `${format(filters.dateRange.start, 'yyyy-MM-dd')} - ${format(filters.dateRange.end, 'yyyy-MM-dd')}`
                      ) : (
                        '选择日期范围'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={filters.dateRange}
                      onSelect={handleDateRangeChange}
                      locale={zhCN}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* 患者手机号 */}
              <div>
                <label className="text-sm font-medium mb-2 block">患者手机号</label>
                <Input
                  placeholder="输入手机号搜索"
                  value={filters.patientPhone || ''}
                  onChange={(e) => {
                    updateFilter('patientPhone', e.target.value);
                    if (e.target.value) addActiveFilter('患者手机');
                  }}
                />
              </div>

              {/* 金额范围 */}
              <div>
                <label className="text-sm font-medium mb-2 block">金额范围</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    placeholder="最小金额"
                    value={filters.minAmount || ''}
                    onChange={(e) => {
                      updateFilter('minAmount', Number(e.target.value));
                      addActiveFilter('金额范围');
                    }}
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    placeholder="最大金额"
                    value={filters.maxAmount || ''}
                    onChange={(e) => {
                      updateFilter('maxAmount', Number(e.target.value));
                      addActiveFilter('金额范围');
                    }}
                  />
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 pt-2">
                <Button onClick={() => setIsOpen(false)} className="flex-1">
                  应用筛选
                </Button>
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  重置
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* 活动筛选标签 */}
        {activeFilters.map((filter, index) => (
          <Badge key={index} variant="secondary" className="gap-1">
            {filter}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => {
                // 根据标签名称移除对应的筛选条件
                if (filter === '日期范围') removeFilter('dateRange', filter);
                if (filter === '患者手机') removeFilter('patientPhone', filter);
                if (filter === '金额范围') {
                  removeFilter('minAmount', filter);
                  removeFilter('maxAmount', filter);
                }
              }}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};
```

### 3. WebSocket实时状态更新集成
```typescript
// hooks/usePrescriptionRealtime.ts
import { useEffect, useCallback, useRef } from 'react';
import { wsService } from '@/services/websocketService';
import { PrescriptionHistory } from '@/types/prescription';
import { toast } from 'react-hot-toast';

interface UsePrescriptionRealtimeOptions {
  prescriptionIds?: string[];
  onStatusUpdate?: (prescriptionId: string, newStatus: string) => void;
  onPrescriptionUpdate?: (prescription: PrescriptionHistory) => void;
}

export const usePrescriptionRealtime = ({
  prescriptionIds = [],
  onStatusUpdate,
  onPrescriptionUpdate
}: UsePrescriptionRealtimeOptions) => {
  const subscriptionsRef = useRef<(() => void)[]>([]);

  const handlePrescriptionUpdate = useCallback((data: any) => {
    console.log('处方更新事件:', data);
    
    // 处理状态更新
    if (data.status && onStatusUpdate) {
      onStatusUpdate(data.prescriptionId, data.status);
      
      // 显示通知
      const statusMessages = {
        paid: '处方已支付',
        dispensed: '处方已配药',
        completed: '处方已完成',
        cancelled: '处方已取消'
      };
      
      const message = statusMessages[data.status];
      if (message) {
        toast.success(`${message} - ${data.prescriptionId}`);
      }
    }

    // 处理完整处方更新
    if (data.prescription && onPrescriptionUpdate) {
      onPrescriptionUpdate(data.prescription);
    }
  }, [onStatusUpdate, onPrescriptionUpdate]);

  useEffect(() => {
    // 订阅全局处方更新事件
    const globalUnsub = wsService.subscribe(
      'prescription.updated',
      handlePrescriptionUpdate
    );
    subscriptionsRef.current.push(globalUnsub);

    // 订阅特定处方的更新
    if (prescriptionIds.length > 0) {
      const prescriptionUnsubs = prescriptionIds.map(id =>
        wsService.subscribe(
          `prescription.${id}.updated`,
          handlePrescriptionUpdate
        )
      );
      subscriptionsRef.current.push(...prescriptionUnsubs);
    }

    // 清理函数
    return () => {
      subscriptionsRef.current.forEach(unsub => unsub());
      subscriptionsRef.current = [];
    };
  }, [prescriptionIds, handlePrescriptionUpdate]);

  // 手动刷新处方状态
  const refreshPrescriptionStatus = useCallback(async (prescriptionId: string) => {
    try {
      const response = await apiClient.get(`/prescriptions/${prescriptionId}/status`);
      if (response.data.success) {
        handlePrescriptionUpdate({
          prescriptionId,
          status: response.data.data.status
        });
      }
    } catch (error) {
      console.error('刷新处方状态失败:', error);
    }
  }, [handlePrescriptionUpdate]);

  return {
    refreshPrescriptionStatus
  };
};
```

### 4. 批量操作组件
```typescript
// components/doctor/PrescriptionBatchActions.tsx
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download, Printer, Archive, MoreHorizontal } from 'lucide-react';
import { PrescriptionHistoryService } from '@/services/prescriptionHistoryService';
import { toast } from 'react-hot-toast';

interface PrescriptionBatchActionsProps {
  selectedIds: string[];
  onActionComplete?: () => void;
}

export const PrescriptionBatchActions: React.FC<PrescriptionBatchActionsProps> = ({
  selectedIds,
  onActionComplete
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBatchExport = async (format: 'pdf' | 'excel' | 'csv') => {
    if (selectedIds.length === 0) {
      toast.error('请先选择处方');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await PrescriptionHistoryService.batchOperation({
        prescriptionIds: selectedIds,
        operation: 'export',
        options: { format }
      });

      // 下载导出的文件
      window.open(result.downloadUrl, '_blank');
      toast.success(`成功导出 ${selectedIds.length} 个处方`);
      onActionComplete?.();
    } catch (error) {
      toast.error('导出失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchPrint = async () => {
    if (selectedIds.length === 0) {
      toast.error('请先选择处方');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await PrescriptionHistoryService.batchOperation({
        prescriptionIds: selectedIds,
        operation: 'print'
      });

      // 打开打印预览
      window.open(result.printUrl, '_blank');
      toast.success(`准备打印 ${selectedIds.length} 个处方`);
    } catch (error) {
      toast.error('打印失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchArchive = async () => {
    if (selectedIds.length === 0) {
      toast.error('请先选择处方');
      return;
    }

    if (!confirm(`确定要归档 ${selectedIds.length} 个处方吗？`)) {
      return;
    }

    setIsProcessing(true);
    try {
      await PrescriptionHistoryService.batchOperation({
        prescriptionIds: selectedIds,
        operation: 'archive'
      });

      toast.success(`成功归档 ${selectedIds.length} 个处方`);
      onActionComplete?.();
    } catch (error) {
      toast.error('归档失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">
        已选择 {selectedIds.length} 个处方
      </span>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={selectedIds.length === 0 || isProcessing}
          >
            批量操作
            <MoreHorizontal className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleBatchExport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            导出为 PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleBatchExport('excel')}>
            <Download className="mr-2 h-4 w-4" />
            导出为 Excel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleBatchExport('csv')}>
            <Download className="mr-2 h-4 w-4" />
            导出为 CSV
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleBatchPrint}>
            <Printer className="mr-2 h-4 w-4" />
            批量打印
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleBatchArchive} className="text-red-600">
            <Archive className="mr-2 h-4 w-4" />
            批量归档
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
```

## 🧪 测试用例设计

### 1. 单元测试
```typescript
// __tests__/components/doctor/PrescriptionHistoryTable.test.tsx
describe('PrescriptionHistoryTable', () => {
  it('should render prescription list correctly', () => {
    const mockData = [
      {
        id: '1',
        prescriptionId: 'RX001',
        patientName: '张三',
        createdAt: '2025-01-10T10:00:00Z',
        itemCount: 5,
        copies: 3,
        totalPrice: 150.50,
        status: 'completed'
      }
    ];

    render(
      <PrescriptionHistoryTable
        data={mockData}
        loading={false}
        onViewDetail={jest.fn()}
        onSelectionChange={jest.fn()}
      />
    );

    expect(screen.getByText('RX001')).toBeInTheDocument();
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('已完成')).toBeInTheDocument();
  });

  it('should handle batch selection correctly', () => {
    const onSelectionChange = jest.fn();
    const { container } = render(
      <PrescriptionHistoryTable
        data={mockData}
        loading={false}
        onViewDetail={jest.fn()}
        onSelectionChange={onSelectionChange}
        enableBatchSelection={true}
      />
    );

    // 选择全部
    const selectAllCheckbox = container.querySelector('thead input[type="checkbox"]');
    fireEvent.click(selectAllCheckbox);
    
    expect(onSelectionChange).toHaveBeenCalledWith(['1', '2', '3']);
  });
});
```

### 2. WebSocket集成测试
```typescript
// __tests__/hooks/usePrescriptionRealtime.test.ts
import { renderHook } from '@testing-library/react-hooks';
import { usePrescriptionRealtime } from '@/hooks/usePrescriptionRealtime';
import { wsService } from '@/services/websocketService';

jest.mock('@/services/websocketService');

describe('usePrescriptionRealtime', () => {
  it('should subscribe to prescription updates', () => {
    const mockSubscribe = jest.fn().mockReturnValue(jest.fn());
    (wsService.subscribe as jest.Mock) = mockSubscribe;

    const { result } = renderHook(() => 
      usePrescriptionRealtime({
        prescriptionIds: ['RX001', 'RX002'],
        onStatusUpdate: jest.fn()
      })
    );

    // 验证订阅调用
    expect(mockSubscribe).toHaveBeenCalledWith('prescription.updated', expect.any(Function));
    expect(mockSubscribe).toHaveBeenCalledWith('prescription.RX001.updated', expect.any(Function));
    expect(mockSubscribe).toHaveBeenCalledWith('prescription.RX002.updated', expect.any(Function));
  });

  it('should handle status updates correctly', () => {
    const onStatusUpdate = jest.fn();
    const { result } = renderHook(() => 
      usePrescriptionRealtime({
        onStatusUpdate
      })
    );

    // 模拟WebSocket事件
    const mockEvent = {
      prescriptionId: 'RX001',
      status: 'paid'
    };

    // 触发事件处理
    // ... 模拟事件触发

    expect(onStatusUpdate).toHaveBeenCalledWith('RX001', 'paid');
  });
});
```

## 📈 性能优化方案

### 1. 虚拟滚动实现
```typescript
// components/common/VirtualTable.tsx
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface VirtualTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowHeight: number;
  height: number;
  emptyMessage?: string;
}

export function VirtualTable<T>({
  data,
  columns,
  rowHeight,
  height,
  emptyMessage = '暂无数据'
}: VirtualTableProps<T>) {
  const Row = ({ index, style }) => {
    const item = data[index];
    
    return (
      <div style={style} className="flex items-center border-b">
        {columns.map((column) => (
          <div
            key={column.key}
            style={{ width: column.width }}
            className="px-4 py-2"
          >
            {column.cell(item)}
          </div>
        ))}
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <AutoSizer>
        {({ width }) => (
          <List
            height={height}
            itemCount={data.length}
            itemSize={rowHeight}
            width={width}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
}
```

### 2. 数据缓存策略
```typescript
// hooks/usePrescriptionHistoryCache.ts
import { useCallback, useRef } from 'react';
import { PrescriptionHistory } from '@/types/prescription';

interface CacheEntry {
  data: PrescriptionHistory[];
  timestamp: number;
  params: any;
}

export const usePrescriptionHistoryCache = (ttl: number = 5 * 60 * 1000) => {
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());

  const getCacheKey = (params: any) => {
    return JSON.stringify(params);
  };

  const getFromCache = useCallback((params: any): PrescriptionHistory[] | null => {
    const key = getCacheKey(params);
    const entry = cacheRef.current.get(key);

    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > ttl) {
      cacheRef.current.delete(key);
      return null;
    }

    return entry.data;
  }, [ttl]);

  const setCache = useCallback((params: any, data: PrescriptionHistory[]) => {
    const key = getCacheKey(params);
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now(),
      params
    });
  }, []);

  const invalidateCache = useCallback((predicate?: (params: any) => boolean) => {
    if (!predicate) {
      cacheRef.current.clear();
      return;
    }

    for (const [key, entry] of cacheRef.current.entries()) {
      if (predicate(entry.params)) {
        cacheRef.current.delete(key);
      }
    }
  }, []);

  return {
    getFromCache,
    setCache,
    invalidateCache
  };
};
```

## 🚀 实施计划

### 第一阶段：组件重构（1天）
- [ ] 抽离表格组件
- [ ] 实现高级筛选组件
- [ ] 实现批量操作组件
- [ ] 集成虚拟滚动

### 第二阶段：WebSocket集成（1天）
- [ ] 实现实时状态更新Hook
- [ ] 集成WebSocket服务
- [ ] 添加状态变更通知
- [ ] 测试实时更新功能

### 第三阶段：性能优化（0.5天）
- [ ] 实现数据缓存
- [ ] 优化渲染性能
- [ ] 添加loading骨架屏
- [ ] 优化批量操作性能

### 第四阶段：测试完善（0.5天）
- [ ] 编写单元测试
- [ ] 编写集成测试
- [ ] 修复发现的问题
- [ ] 代码审查和优化

## 📋 验收标准

### 功能要求
- ✅ 支持多条件高级筛选
- ✅ 支持批量选择和操作
- ✅ 实时状态更新工作正常
- ✅ 虚拟滚动流畅无卡顿
- ✅ 导出和打印功能正常

### 性能要求
- ✅ 1000条数据渲染 < 100ms
- ✅ 滚动流畅度 > 60fps
- ✅ WebSocket延迟 < 500ms
- ✅ 内存占用稳定

### 用户体验
- ✅ 加载状态清晰
- ✅ 操作反馈及时
- ✅ 错误提示友好
- ✅ 移动端适配良好

---

**文档创建**: 2025年1月10日  
**负责人**: 前端开发团队  
**预计完成**: 3天