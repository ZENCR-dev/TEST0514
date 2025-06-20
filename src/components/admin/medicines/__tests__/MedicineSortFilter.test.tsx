import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MedicineList } from '../MedicineList';
import { mockMedicines } from '@/mocks/medicineData';

describe('TC-MED-04: 药品排序与筛选功能联调测试', () => {
  const mockProps = {
    medicines: mockMedicines.slice(0, 20),
    loading: false,
    totalItems: 100,
    currentPage: 1,
    itemsPerPage: 20,
    onPageChange: jest.fn(),
    onItemsPerPageChange: jest.fn(),
    onSort: jest.fn(),
    onFilter: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('排序功能测试', () => {
    test('TC-MED-04-A: 按价格排序功能', async () => {
      const startTime = performance.now();
      
      render(<MedicineList {...mockProps} />);
      
      // 模拟点击价格列头进行排序
      const priceHeader = screen.getByText('价格(克)');
      fireEvent.click(priceHeader);
      
      const endTime = performance.now();
      const sortTime = endTime - startTime;
      
      console.log(`价格排序响应时间: ${sortTime}ms`);
      expect(sortTime).toBeLessThan(100); // 排序应在100ms内响应
      
      // 验证排序回调被调用
      expect(mockProps.onSort).toHaveBeenCalledWith('price', 'asc');
    });

    test('TC-MED-04-B: 按分类排序功能', async () => {
      render(<MedicineList {...mockProps} />);
      
      const categoryHeader = screen.getByText('分类');
      fireEvent.click(categoryHeader);
      
      expect(mockProps.onSort).toHaveBeenCalledWith('category', 'asc');
      
      // 测试第二次点击切换为降序
      fireEvent.click(categoryHeader);
      expect(mockProps.onSort).toHaveBeenCalledWith('category', 'desc');
    });

    test('TC-MED-04-C: 按名称排序功能', async () => {
      render(<MedicineList {...mockProps} />);
      
      const nameHeader = screen.getByText('中药名称');
      fireEvent.click(nameHeader);
      
      expect(mockProps.onSort).toHaveBeenCalledWith('name', 'asc');
    });

    test('TC-MED-04-D: 排序状态视觉反馈', () => {
      const sortedProps = {
        ...mockProps,
        sortBy: 'price',
        sortOrder: 'asc'
      };
      
      render(<MedicineList {...sortedProps} />);
      
      // 验证排序指示器显示
      const priceHeader = screen.getByText('价格(克)');
      expect(priceHeader.closest('th')).toHaveClass('sorted-asc');
    });
  });

  describe('筛选功能测试', () => {
    test('TC-MED-04-E: 分类筛选功能', async () => {
      render(<MedicineList {...mockProps} />);
      
      // 查找分类筛选下拉框
      const categoryFilter = screen.getByLabelText('分类筛选');
      fireEvent.change(categoryFilter, { target: { value: '补益药' } });
      
      await waitFor(() => {
        expect(mockProps.onFilter).toHaveBeenCalledWith({
          category: '补益药'
        });
      });
    });

    test('TC-MED-04-F: 价格范围筛选功能', async () => {
      render(<MedicineList {...mockProps} />);
      
      // 设置价格范围
      const minPriceInput = screen.getByLabelText('最低价格');
      const maxPriceInput = screen.getByLabelText('最高价格');
      
      fireEvent.change(minPriceInput, { target: { value: '10' } });
      fireEvent.change(maxPriceInput, { target: { value: '100' } });
      
      await waitFor(() => {
        expect(mockProps.onFilter).toHaveBeenCalledWith({
          priceMin: 10,
          priceMax: 100
        });
      });
    });

    test('TC-MED-04-G: 复合筛选条件', async () => {
      render(<MedicineList {...mockProps} />);
      
      // 同时设置分类和价格筛选
      const categoryFilter = screen.getByLabelText('分类筛选');
      const minPriceInput = screen.getByLabelText('最低价格');
      
      fireEvent.change(categoryFilter, { target: { value: '补益药' } });
      fireEvent.change(minPriceInput, { target: { value: '20' } });
      
      await waitFor(() => {
        expect(mockProps.onFilter).toHaveBeenCalledWith({
          category: '补益药',
          priceMin: 20
        });
      });
    });

    test('TC-MED-04-H: 筛选条件清除功能', async () => {
      render(<MedicineList {...mockProps} />);
      
      const clearFiltersButton = screen.getByText('清除筛选');
      fireEvent.click(clearFiltersButton);
      
      expect(mockProps.onFilter).toHaveBeenCalledWith({});
    });
  });

  describe('排序与筛选组合测试', () => {
    test('TC-MED-04-I: 筛选后排序功能', async () => {
      const filteredProps = {
        ...mockProps,
        filters: { category: '补益药' }
      };
      
      render(<MedicineList {...filteredProps} />);
      
      // 在筛选状态下进行排序
      const priceHeader = screen.getByText('价格(克)');
      fireEvent.click(priceHeader);
      
      expect(mockProps.onSort).toHaveBeenCalledWith('price', 'asc');
    });

    test('TC-MED-04-J: 排序后筛选功能', async () => {
      const sortedProps = {
        ...mockProps,
        sortBy: 'price',
        sortOrder: 'asc'
      };
      
      render(<MedicineList {...sortedProps} />);
      
      // 在排序状态下进行筛选
      const categoryFilter = screen.getByLabelText('分类筛选');
      fireEvent.change(categoryFilter, { target: { value: '活血药' } });
      
      await waitFor(() => {
        expect(mockProps.onFilter).toHaveBeenCalledWith({
          category: '活血药'
        });
      });
    });
  });

  describe('性能与用户体验测试', () => {
    test('TC-MED-04-K: 大数据量排序性能', () => {
      const startTime = performance.now();
      
      const largeMedicineList = Array.from({ length: 1000 }, (_, index) => ({
        ...mockMedicines[0],
        id: `perf-test-${index}`,
        chineseName: `性能测试药品${index}`,
        basePrice: Math.random() * 200,
      }));
      
      render(<MedicineList {...mockProps} medicines={largeMedicineList} />);
      
      const priceHeader = screen.getByText('价格(克)');
      fireEvent.click(priceHeader);
      
      const endTime = performance.now();
      const performanceTime = endTime - startTime;
      
      console.log(`大数据量排序性能: ${performanceTime}ms`);
      expect(performanceTime).toBeLessThan(300); // 大数据量排序应在300ms内完成
    });

    test('TC-MED-04-L: 筛选条件输入防抖测试', async () => {
      jest.useFakeTimers();
      
      render(<MedicineList {...mockProps} />);
      
      const searchInput = screen.getByLabelText('名称搜索');
      
      // 快速输入多个字符
      fireEvent.change(searchInput, { target: { value: '人' } });
      fireEvent.change(searchInput, { target: { value: '人参' } });
      fireEvent.change(searchInput, { target: { value: '人参片' } });
      
      // 快进时间，触发防抖
      jest.advanceTimersByTime(500);
      
      await waitFor(() => {
        // 应该只调用一次，且是最后的值
        expect(mockProps.onFilter).toHaveBeenCalledTimes(1);
        expect(mockProps.onFilter).toHaveBeenCalledWith({
          nameSearch: '人参片'
        });
      });
      
      jest.useRealTimers();
    });
  });
}); 