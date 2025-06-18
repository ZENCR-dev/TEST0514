/**
 * 中药过滤组件
 */
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MedicineCategory } from '@/types/medicine';
import { debounce } from '@/utils/helpers';

// 过滤选项类型
export interface MedicineFilterOptions {
  query: string;
  category: string;
  property: string;
  sortBy: 'chineseName' | 'basePrice' | 'createdAt';
  order: 'asc' | 'desc';
}

interface MedicineFiltersProps {
  filters: MedicineFilterOptions;
  onChange: (filters: MedicineFilterOptions) => void;
}

export function MedicineFilters({ filters, onChange }: MedicineFiltersProps) {
  // 本地状态用于处理输入
  const [searchValue, setSearchValue] = useState(filters.query || '');
  
  // 使用防抖处理搜索
  const debouncedSearch = debounce((value: string) => {
    onChange({
      ...filters,
      query: value
    });
  }, 300);
  
  // 当搜索值改变时触发防抖搜索
  useEffect(() => {
    debouncedSearch(searchValue);
  }, [searchValue, debouncedSearch]);
  
  // 处理分类变更
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filters,
      category: e.target.value
    });
  };
  
  // 处理药性变更
  const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filters,
      property: e.target.value
    });
  };
  
  // 处理排序字段变更
  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filters,
      sortBy: e.target.value as MedicineFilterOptions['sortBy']
    });
  };
  
  // 处理排序方向变更
  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filters,
      order: e.target.value as 'asc' | 'desc'
    });
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* 搜索框 */}
        <div className="col-span-1 md:col-span-2">
          <Label htmlFor="search">搜索</Label>
          <Input
            id="search"
            type="text"
            placeholder="搜索中药名称、拼音或英文"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="mt-1"
          />
        </div>
        
        {/* 分类筛选 */}
        <div>
          <Label htmlFor="category">分类</Label>
          <select
            id="category"
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full mt-1 border border-gray-300 rounded-md p-2"
          >
            <option value="">所有分类</option>
            {Object.values(MedicineCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {/* 状态筛选 */}
        <div>
          <Label htmlFor="property">状态</Label>
          <select
            id="property"
            value={filters.property}
            onChange={handlePropertyChange}
            className="w-full mt-1 border border-gray-300 rounded-md p-2"
          >
            <option value="">所有状态</option>
            <option value="active">活跃</option>
            <option value="inactive">非活跃</option>
          </select>
        </div>
        
        {/* 排序 */}
        <div>
          <div className="flex flex-col space-y-2">
            <div>
              <Label htmlFor="sortBy">排序方式</Label>
              <select
                id="sortBy"
                value={filters.sortBy}
                onChange={handleSortByChange}
                className="w-full mt-1 border border-gray-300 rounded-md p-2"
              >
                <option value="chineseName">按名称</option>
                <option value="basePrice">按价格</option>
                <option value="createdAt">按创建时间</option>
              </select>
            </div>
            <div>
              <Label htmlFor="order">排序方向</Label>
              <select
                id="order"
                value={filters.order}
                onChange={handleOrderChange}
                className="w-full mt-1 border border-gray-300 rounded-md p-2"
              >
                <option value="asc">升序</option>
                <option value="desc">降序</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 