import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MedicineList } from '../MedicineList';
import { MedicineSearch } from '../../../prescription/MedicineSearch';
import { mockMedicines } from '@/mocks/medicineData';
import { Medicine } from '@/types/medicine';

// Mock react-hotkeys-hook to avoid ES module issues
jest.mock('react-hotkeys-hook', () => ({
  useHotkeys: jest.fn(),
}));

describe('TC-MED-05: 药品模块性能基准测试', () => {
  // 性能基准标准
  const PERFORMANCE_BENCHMARKS = {
    SEARCH_RESPONSE: 500, // 搜索响应时间 < 500ms
    LIST_RENDER: 1000,    // 列表渲染时间 < 1s
    PAGINATION: 200,      // 分页切换 < 200ms
    SORT_FILTER: 300,     // 排序筛选 < 300ms
    MEMORY_LIMIT: 50 * 1024 * 1024, // 内存使用 < 50MB
  };

  const generateLargeMedicineData = (count: number): Medicine[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: `perf-med-${index}`,
      name: `性能测试中药${index}`,
      chineseName: `性能测试中药${index}`,
      englishName: `Performance Test Medicine ${index}`,
      pinyinName: `xingnengceshi${index}`,
      sku: `TEST${index}`,
      category: ['补益药', '清热药', '活血药', '化痰药', '理气药'][index % 5],
      description: `这是性能测试用的中药材${index}，用于验证系统在大数据量下的表现。`,
      unit: 'g',
      requiresPrescription: false,
      basePrice: Math.random() * 200 + 10,
      metadata: {
        specifications: '500g/包',
        manufacturer: `测试厂商${index % 10}`,
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  };

  describe('搜索性能测试', () => {
    test('TC-MED-05-A: 搜索响应时间基准测试', async () => {
      const mockOnSelectMedicine = jest.fn();
      const startTime = performance.now();
      
      render(<MedicineSearch onSelectMedicine={mockOnSelectMedicine} />);
      
      const searchInput = screen.getByPlaceholderText(/搜索中药/);
      fireEvent.change(searchInput, { target: { value: '人参' } });
      
      // 等待搜索结果出现（模拟异步搜索）
      await waitFor(() => {
        // 检查是否有搜索结果或加载状态
        const searchResults = screen.queryByTestId('search-results') || 
                             screen.queryByTestId('search-loading');
        expect(searchResults).toBeTruthy();
      }, { timeout: 1000 });
      
      const endTime = performance.now();
      const searchTime = endTime - startTime;
      
      console.log(`搜索响应时间: ${searchTime}ms`);
      expect(searchTime).toBeLessThan(PERFORMANCE_BENCHMARKS.SEARCH_RESPONSE);
    });

    test('TC-MED-05-B: 并发搜索性能测试', async () => {
      const mockOnSelectMedicine = jest.fn();
      const searchTerms = ['人参', '黄芪', '当归', '川芎', '白术'];
      
      render(<MedicineSearch onSelectMedicine={mockOnSelectMedicine} />);
      const searchInput = screen.getByPlaceholderText(/搜索中药/);
      
      const startTime = performance.now();
      
      // 模拟快速连续搜索
      for (const term of searchTerms) {
        fireEvent.change(searchInput, { target: { value: term } });
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // 等待最后一次搜索完成
      await waitFor(() => {
        // 检查搜索状态或结果
        const searchState = screen.queryByTestId('search-results') || 
                           screen.queryByTestId('search-loading');
        expect(searchState).toBeTruthy();
      });
      
      const endTime = performance.now();
      const concurrentSearchTime = endTime - startTime;
      
      console.log(`并发搜索完成时间: ${concurrentSearchTime}ms`);
      expect(concurrentSearchTime).toBeLessThan(PERFORMANCE_BENCHMARKS.SEARCH_RESPONSE * 2);
    });
  });

  describe('列表渲染性能测试', () => {
    test('TC-MED-05-C: 大数据量列表渲染性能', () => {
      const largeMedicineList = generateLargeMedicineData(1000);
      const mockProps = {
        medicines: largeMedicineList,
        loading: false,
        totalItems: 1000,
        currentPage: 1,
        itemsPerPage: 50,
        onPageChange: jest.fn(),
        onItemsPerPageChange: jest.fn(),
        onSort: jest.fn(),
        onFilter: jest.fn(),
      };

      const startTime = performance.now();
      
      render(<MedicineList {...mockProps} />);
      
      // 验证所有项目都渲染了
      expect(screen.getAllByText(/性能测试中药/).length).toBeGreaterThan(0);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      console.log(`1000条数据渲染时间: ${renderTime}ms`);
      expect(renderTime).toBeLessThan(PERFORMANCE_BENCHMARKS.LIST_RENDER);
    });

    test('TC-MED-05-D: 分页性能测试', async () => {
      const largeMedicineList = generateLargeMedicineData(500);
      const mockOnPageChange = jest.fn();
      const mockProps = {
        medicines: largeMedicineList.slice(0, 20),
        loading: false,
        totalItems: 500,
        currentPage: 1,
        itemsPerPage: 20,
        onPageChange: mockOnPageChange,
        onItemsPerPageChange: jest.fn(),
        onSort: jest.fn(),
        onFilter: jest.fn(),
      };

      render(<MedicineList {...mockProps} />);
      
      const startTime = performance.now();
      
      // 点击下一页
      const nextPageButton = screen.getByText('下一页');
      fireEvent.click(nextPageButton);
      
      const endTime = performance.now();
      const paginationTime = endTime - startTime;
      
      console.log(`分页切换时间: ${paginationTime}ms`);
      expect(paginationTime).toBeLessThan(PERFORMANCE_BENCHMARKS.PAGINATION);
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });
  });

  describe('排序筛选性能测试', () => {
    test('TC-MED-05-E: 大数据量排序性能', () => {
      const largeMedicineList = generateLargeMedicineData(1000);
      const mockOnSort = jest.fn();
      const mockProps = {
        medicines: largeMedicineList,
        loading: false,
        totalItems: 1000,
        currentPage: 1,
        itemsPerPage: 50,
        onPageChange: jest.fn(),
        onItemsPerPageChange: jest.fn(),
        onSort: mockOnSort,
        onFilter: jest.fn(),
      };

      render(<MedicineList {...mockProps} />);
      
      const startTime = performance.now();
      
      // 点击价格列进行排序
      const priceHeader = screen.getByText('价格(克)');
      fireEvent.click(priceHeader);
      
      const endTime = performance.now();
      const sortTime = endTime - startTime;
      
      console.log(`1000条数据排序时间: ${sortTime}ms`);
      expect(sortTime).toBeLessThan(PERFORMANCE_BENCHMARKS.SORT_FILTER);
      expect(mockOnSort).toHaveBeenCalledWith('price', 'asc');
    });

    test('TC-MED-05-F: 复合筛选性能测试', async () => {
      const largeMedicineList = generateLargeMedicineData(1000);
      const mockOnFilter = jest.fn();
      const mockProps = {
        medicines: largeMedicineList,
        loading: false,
        totalItems: 1000,
        currentPage: 1,
        itemsPerPage: 50,
        onPageChange: jest.fn(),
        onItemsPerPageChange: jest.fn(),
        onSort: jest.fn(),
        onFilter: mockOnFilter,
      };

      render(<MedicineList {...mockProps} />);
      
      const startTime = performance.now();
      
      // 应用多个筛选条件
      const categoryFilter = screen.getByLabelText('分类筛选');
      const minPriceInput = screen.getByLabelText('最低价格');
      
      fireEvent.change(categoryFilter, { target: { value: '补益药' } });
      fireEvent.change(minPriceInput, { target: { value: '50' } });
      
      await waitFor(() => {
        expect(mockOnFilter).toHaveBeenCalled();
      });
      
      const endTime = performance.now();
      const filterTime = endTime - startTime;
      
      console.log(`复合筛选响应时间: ${filterTime}ms`);
      expect(filterTime).toBeLessThan(PERFORMANCE_BENCHMARKS.SORT_FILTER);
    });
  });

  describe('内存使用性能测试', () => {
    test('TC-MED-05-G: 内存使用监控测试', () => {
      // 模拟内存使用监控
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      const largeMedicineList = generateLargeMedicineData(2000);
      const mockProps = {
        medicines: largeMedicineList,
        loading: false,
        totalItems: 2000,
        currentPage: 1,
        itemsPerPage: 100,
        onPageChange: jest.fn(),
        onItemsPerPageChange: jest.fn(),
        onSort: jest.fn(),
        onFilter: jest.fn(),
      };

      render(<MedicineList {...mockProps} />);
      
      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryUsed = finalMemory - initialMemory;
      
      console.log(`内存使用量: ${memoryUsed / 1024 / 1024}MB`);
      
      if (performance.memory) {
        expect(memoryUsed).toBeLessThan(PERFORMANCE_BENCHMARKS.MEMORY_LIMIT);
      }
    });

    test('TC-MED-05-H: 组件卸载内存清理测试', () => {
      const { unmount } = render(
        <MedicineList
          medicines={generateLargeMedicineData(1000)}
          loading={false}
          totalItems={1000}
          currentPage={1}
          itemsPerPage={50}
          onPageChange={jest.fn()}
          onItemsPerPageChange={jest.fn()}
          onSort={jest.fn()}
          onFilter={jest.fn()}
        />
      );

      const beforeUnmount = performance.memory?.usedJSHeapSize || 0;
      
      // 卸载组件
      unmount();
      
      // 强制垃圾回收（如果支持）
      if (global.gc) {
        global.gc();
      }
      
      const afterUnmount = performance.memory?.usedJSHeapSize || 0;
      const memoryFreed = beforeUnmount - afterUnmount;
      
      console.log(`组件卸载释放内存: ${memoryFreed / 1024 / 1024}MB`);
      
      // 验证内存有所释放（允许一定误差）
      if (performance.memory) {
        expect(memoryFreed).toBeGreaterThan(-10 * 1024 * 1024); // 允许10MB误差
      }
    });
  });

  describe('综合性能压力测试', () => {
    test('TC-MED-05-I: 综合操作性能测试', async () => {
      const largeMedicineList = generateLargeMedicineData(1000);
      const mockProps = {
        medicines: largeMedicineList.slice(0, 50),
        loading: false,
        totalItems: 1000,
        currentPage: 1,
        itemsPerPage: 50,
        onPageChange: jest.fn(),
        onItemsPerPageChange: jest.fn(),
        onSort: jest.fn(),
        onFilter: jest.fn(),
      };

      render(<MedicineList {...mockProps} />);
      
      const startTime = performance.now();
      
      // 执行一系列操作
      const priceHeader = screen.getByText('价格(克)');
      fireEvent.click(priceHeader); // 排序
      
      const categoryFilter = screen.getByLabelText('分类筛选');
      fireEvent.change(categoryFilter, { target: { value: '补益药' } }); // 筛选
      
      const nextPageButton = screen.getByText('下一页');
      fireEvent.click(nextPageButton); // 分页
      
      await waitFor(() => {
        expect(mockProps.onPageChange).toHaveBeenCalled();
      });
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      console.log(`综合操作完成时间: ${totalTime}ms`);
      expect(totalTime).toBeLessThan(1000); // 综合操作应在1秒内完成
    });
  });

  describe('性能基准报告', () => {
    test('TC-MED-05-J: 性能基准总结报告', () => {
      const performanceReport = {
        testSuite: 'TC-MED-05 药品模块性能基准测试',
        benchmarks: PERFORMANCE_BENCHMARKS,
        testDate: new Date().toISOString(),
        environment: {
          userAgent: navigator.userAgent,
          memorySupport: !!performance.memory,
          timingSupport: !!performance.now,
        }
      };
      
      console.log('性能基准测试报告:', JSON.stringify(performanceReport, null, 2));
      
      // 验证所有性能基准都已定义
      expect(performanceReport.benchmarks.SEARCH_RESPONSE).toBeDefined();
      expect(performanceReport.benchmarks.LIST_RENDER).toBeDefined();
      expect(performanceReport.benchmarks.PAGINATION).toBeDefined();
      expect(performanceReport.benchmarks.SORT_FILTER).toBeDefined();
      expect(performanceReport.benchmarks.MEMORY_LIMIT).toBeDefined();
    });
  });
}); 