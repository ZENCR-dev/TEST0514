/**
 * 中药管理页面
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { MedicineList } from '@/components/admin/medicines/MedicineList';
import { MedicineFilters, MedicineFilterOptions } from '@/components/admin/medicines/MedicineFilters';
import { MedicineDetailDialog } from '@/components/admin/medicines/MedicineDetailDialog';
import { MedicineDeleteDialog } from '@/components/admin/medicines/MedicineDeleteDialog';
import { MedicineImportDialog } from '@/components/admin/medicines/MedicineImportDialog';
import { MedicinePriceAdjustDialog } from '@/components/admin/medicines/MedicinePriceAdjustDialog';
import { Medicine } from '@/types/medicine';
import { getAllMedicines } from '@/services/medicineService';

export default function MedicinesPage() {
  // 路由
  const router = useRouter();
  
  // 状态
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<MedicineFilterOptions>({
    query: '',
    category: '',
    property: '',
    sortBy: 'chineseName',
    order: 'asc'
  });
  
  // 选中的中药
  const [selectedMedicines, setSelectedMedicines] = useState<Medicine[]>([]);
  
  // 对话框状态
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [priceAdjustDialogOpen, setPriceAdjustDialogOpen] = useState(false);
  
  // 加载数据
  const loadMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllMedicines({
        search: filters.query,
        category: filters.category,
        property: filters.property,
        page: currentPage,
        limit: itemsPerPage,
        sort: `${filters.sortBy}:${filters.order}`
      });
      
      setMedicines(result);
      setTotalItems(result.length);
    } catch (error) {
      console.error('Failed to load medicines:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, itemsPerPage, setLoading, setMedicines, setTotalItems]);
  
  // 初始加载和依赖项变更时加载数据
  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]); // currentPage, itemsPerPage, filters 已经是 loadMedicines 的依赖
  
  // 处理筛选变更
  const handleFilterChange = (newFilters: MedicineFilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // 重置为第一页
  };
  
  // 处理分页变更
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // 处理每页条数变更
  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1); // 重置为第一页
  };
  
  // 处理创建新中药
  const handleCreateNew = () => {
    router.push('/admin/medicines/create');
  };
  
  // 处理编辑中药
  const handleEdit = (medicine: Medicine) => {
    router.push(`/admin/medicines/edit/${medicine.id}`);
  };
  
  // 处理查看中药详情
  const handleViewDetail = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setDetailDialogOpen(true);
  };
  
  // 处理删除中药
  const handleDelete = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setDeleteDialogOpen(true);
  };
  
  // 处理批量导入
  const handleImport = () => {
    setImportDialogOpen(true);
  };
  
  // 处理批量价格调整
  const handlePriceAdjust = () => {
    if (selectedMedicines.length > 0) {
      setPriceAdjustDialogOpen(true);
    }
  };
  
  // 处理选中中药
  const handleSelect = (medicine: Medicine, selected: boolean) => {
    if (selected) {
      setSelectedMedicines(prev => [...prev, medicine]);
    } else {
      setSelectedMedicines(prev => prev.filter(m => m.id !== medicine.id));
    }
  };
  
  // 处理全选/取消全选
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedMedicines(medicines);
    } else {
      setSelectedMedicines([]);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">中药管理</h1>
        <div className="flex flex-wrap justify-between items-center">
          <div className="space-x-2 mb-4 sm:mb-0">
            <Button onClick={handleCreateNew}>新增中药</Button>
            <Button variant="outline" onClick={handleImport}>批量导入</Button>
            <Button 
              variant="outline" 
              onClick={handlePriceAdjust}
              disabled={selectedMedicines.length === 0}
            >
              批量调价 ({selectedMedicines.length})
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            共 {totalItems} 种中药
          </div>
        </div>
      </div>
      
      {/* 过滤器 */}
      <MedicineFilters
        filters={filters}
        onChange={handleFilterChange}
      />
      
      {/* 中药列表 */}
      <MedicineList
        medicines={medicines}
        loading={loading}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        selectedMedicines={selectedMedicines}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        onViewDetail={handleViewDetail}
      />
      
      {/* 详情对话框 */}
      <MedicineDetailDialog
        medicine={selectedMedicine}
        isOpen={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
      />
      
      {/* 删除对话框 */}
      <MedicineDeleteDialog
        medicine={selectedMedicine}
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDeleteSuccess={loadMedicines}
      />
      
      {/* 导入对话框 */}
      <MedicineImportDialog
        isOpen={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImportSuccess={loadMedicines}
      />
      
      {/* 价格调整对话框 */}
      <MedicinePriceAdjustDialog
        isOpen={priceAdjustDialogOpen}
        onClose={() => setPriceAdjustDialogOpen(false)}
        selectedMedicines={selectedMedicines}
        onAdjustSuccess={loadMedicines}
      />
    </div>
  );
} 