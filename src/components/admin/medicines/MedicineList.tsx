/**
 * 中药列表组件
 */
import React from 'react';
import { formatPrice } from '@/utils/helpers';
import { Medicine } from '@/types/medicine';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';

interface MedicineListProps {
  medicines: Medicine[];
  loading: boolean;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onEdit?: (medicine: Medicine) => void;
  onDelete?: (medicine: Medicine) => void;
  onViewDetail?: (medicine: Medicine) => void;
  selectedMedicines?: Medicine[];
  onSelect?: (medicine: Medicine, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
}

export function MedicineList({
  medicines,
  loading,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onEdit,
  onDelete,
  onViewDetail,
  selectedMedicines = [],
  onSelect,
  onSelectAll
}: MedicineListProps) {
  // 计算总页数
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // 计算显示的页码范围
  const getPageRange = () => {
    const range = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    
    return range;
  };

  // 判断是否全部选中
  const isAllSelected = medicines.length > 0 && 
    selectedMedicines?.length === medicines.length && 
    medicines.every(med => selectedMedicines.some(s => s.id === med.id));

  // 判断单个中药是否选中
  const isSelected = (medicine: Medicine) => {
    return selectedMedicines?.some(med => med.id === medicine.id) || false;
  };

  // 处理全选/取消全选
  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelectAll) {
      onSelectAll(e.target.checked);
    }
  };

  // 处理单个选择
  const handleSelectChange = (medicine: Medicine, e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelect) {
      onSelect(medicine, e.target.checked);
    }
  };

  // 渲染加载状态
  if (loading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">加载中...</p>
      </div>
    );
  }

  // 渲染空列表状态
  if (medicines.length === 0) {
    return (
      <div className="w-full p-8 text-center bg-white rounded-md shadow-sm">
        <p className="text-gray-500">没有找到中药记录</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {onSelect && (
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAllChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </TableHead>
            )}
            <TableHead>中药名称</TableHead>
            <TableHead>英文名</TableHead>
            <TableHead>分类</TableHead>
            <TableHead>药性</TableHead>
            <TableHead className="text-right">价格(克)</TableHead>
            <TableHead className="text-right">库存(克)</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medicines.map((medicine) => (
            <TableRow 
              key={medicine.id}
              className={isSelected(medicine) ? "bg-blue-50" : ""}
            >
              {onSelect && (
                <TableCell className="w-12">
                  <input
                    type="checkbox"
                    checked={isSelected(medicine)}
                    onChange={(e) => handleSelectChange(medicine, e)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </TableCell>
              )}
              <TableCell 
                className="font-medium cursor-pointer"
                onClick={() => onViewDetail && onViewDetail(medicine)}
              >
                {medicine.chineseName}
              </TableCell>
              <TableCell>{medicine.englishName}</TableCell>
              <TableCell>{medicine.category || '-'}</TableCell>
              <TableCell>{medicine.property || '-'}</TableCell>
              <TableCell className="text-right">{formatPrice(medicine.pricePerGram)}</TableCell>
              <TableCell className="text-right">{medicine.stock}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  {onViewDetail && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewDetail(medicine)}
                    >
                      查看
                    </Button>
                  )}
                  {onEdit && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEdit(medicine)}
                    >
                      编辑
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => onDelete(medicine)}
                    >
                      删除
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* 分页控件 */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="flex items-center">
          <span className="text-sm text-gray-700">
            每页显示
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="mx-2 border-gray-300 rounded-md"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">
            共 {totalItems} 条记录
          </span>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            上一页
          </button>
          <div className="hidden md:flex">
            {getPageRange().map((page) => (
              <button
                key={page}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === page
                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
} 