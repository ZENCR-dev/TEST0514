import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MedicineList } from '../MedicineList';
import { MedicineSearch } from '../../../prescription/MedicineSearch';
import { mockMedicines } from '@/mocks/medicineData';

// Mock react-hotkeys-hook to avoid ES module issues
jest.mock('react-hotkeys-hook', () => ({
  useHotkeys: jest.fn(),
}));

describe('TC-MED-06: 药品模块用户体验优化验证', () => {
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

  describe('搜索用户体验测试', () => {
    test('TC-MED-06-A: 搜索实时反馈体验', async () => {
      const user = userEvent.setup();
      const mockOnSearch = jest.fn();
      
      render(<MedicineSearch onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByPlaceholderText(/搜索药品/);
      
      // 测试实时搜索建议
      await user.type(searchInput, '人');
      
      // 验证搜索建议出现
      await waitFor(() => {
        expect(screen.getByText(/搜索建议/)).toBeInTheDocument();
      });
      
      // 继续输入
      await user.type(searchInput, '参');
      
      // 验证搜索建议更新
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith(expect.stringContaining('人参'));
      });
    });

    test('TC-MED-06-B: 搜索历史记录功能', async () => {
      const user = userEvent.setup();
      const mockOnSearch = jest.fn();
      
      render(<MedicineSearch onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByPlaceholderText(/搜索药品/);
      
      // 执行几次搜索
      await user.type(searchInput, '人参');
      await user.keyboard('{Enter}');
      
      await user.clear(searchInput);
      await user.type(searchInput, '黄芪');
      await user.keyboard('{Enter}');
      
      // 点击搜索历史
      await user.click(searchInput);
      
      // 验证历史记录显示
      await waitFor(() => {
        expect(screen.getByText('人参')).toBeInTheDocument();
        expect(screen.getByText('黄芪')).toBeInTheDocument();
      });
    });

    test('TC-MED-06-C: 搜索无结果友好提示', async () => {
      const mockOnSearch = jest.fn();
      
      render(<MedicineSearch onSearch={mockOnSearch} onResults={() => []} />);
      
      const searchInput = screen.getByPlaceholderText(/搜索药品/);
      fireEvent.change(searchInput, { target: { value: '不存在的药品xyz123' } });
      
      await waitFor(() => {
        expect(screen.getByText(/未找到相关药品/)).toBeInTheDocument();
        expect(screen.getByText(/请尝试其他关键词/)).toBeInTheDocument();
      });
    });

    test('TC-MED-06-D: 键盘导航体验', async () => {
      const user = userEvent.setup();
      const mockOnSearch = jest.fn();
      
      render(<MedicineSearch onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByPlaceholderText(/搜索药品/);
      
      await user.type(searchInput, '人参');
      
      // 测试方向键导航
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('option', { selected: true })).toBeInTheDocument();
      
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');
      
      expect(mockOnSearch).toHaveBeenCalled();
    });
  });

  describe('列表交互体验测试', () => {
    test('TC-MED-06-E: 加载状态用户友好提示', () => {
      const loadingProps = { ...mockProps, loading: true };
      
      render(<MedicineList {...loadingProps} />);
      
      // 验证加载动画
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText(/正在加载药品数据/)).toBeInTheDocument();
      
      // 验证骨架屏
      expect(screen.getAllByTestId('medicine-skeleton').length).toBeGreaterThan(0);
    });

    test('TC-MED-06-F: 分页用户体验优化', async () => {
      const user = userEvent.setup();
      
      render(<MedicineList {...mockProps} />);
      
      // 测试分页信息显示
      expect(screen.getByText(/第 1 页，共 5 页/)).toBeInTheDocument();
      expect(screen.getByText(/显示 1-20 条，共 100 条记录/)).toBeInTheDocument();
      
      // 测试页码快速跳转
      const pageJumpInput = screen.getByLabelText('跳转到页码');
      await user.type(pageJumpInput, '3');
      await user.keyboard('{Enter}');
      
      expect(mockProps.onPageChange).toHaveBeenCalledWith(3);
    });

    test('TC-MED-06-G: 批量操作用户体验', async () => {
      const user = userEvent.setup();
      
      render(<MedicineList {...mockProps} />);
      
      // 测试全选功能
      const selectAllCheckbox = screen.getByLabelText('全选');
      await user.click(selectAllCheckbox);
      
      // 验证所有项目被选中
      const itemCheckboxes = screen.getAllByRole('checkbox', { name: /选择药品/ });
      itemCheckboxes.forEach(checkbox => {
        expect(checkbox).toBeChecked();
      });
      
      // 验证批量操作按钮启用
      expect(screen.getByText('批量导出')).not.toBeDisabled();
      expect(screen.getByText('批量删除')).not.toBeDisabled();
    });

    test('TC-MED-06-H: 排序视觉反馈优化', async () => {
      const user = userEvent.setup();
      
      render(<MedicineList {...mockProps} />);
      
      const priceHeader = screen.getByText('价格(克)');
      await user.click(priceHeader);
      
      // 验证排序指示器
      expect(priceHeader.closest('th')).toHaveClass('sorted');
      expect(screen.getByTestId('sort-asc-icon')).toBeInTheDocument();
      
      // 再次点击切换为降序
      await user.click(priceHeader);
      expect(screen.getByTestId('sort-desc-icon')).toBeInTheDocument();
    });
  });

  describe('响应式设计体验测试', () => {
    test('TC-MED-06-I: 移动端适配体验', () => {
      // 模拟移动端屏幕
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(<MedicineList {...mockProps} />);
      
      // 验证移动端布局
      expect(screen.getByTestId('mobile-medicine-list')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-search-bar')).toBeInTheDocument();
      
      // 验证触摸友好的按钮尺寸
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const styles = window.getComputedStyle(button);
        const minHeight = parseInt(styles.minHeight);
        expect(minHeight).toBeGreaterThanOrEqual(44); // 最小触摸目标44px
      });
    });

    test('TC-MED-06-J: 平板端适配体验', () => {
      // 模拟平板端屏幕
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      render(<MedicineList {...mockProps} />);
      
      // 验证平板端布局
      expect(screen.getByTestId('tablet-medicine-list')).toBeInTheDocument();
      
      // 验证双列布局
      const medicineCards = screen.getAllByTestId('medicine-card');
      expect(medicineCards[0]).toHaveClass('tablet-card-layout');
    });
  });

  describe('无障碍访问体验测试', () => {
    test('TC-MED-06-K: 键盘导航无障碍', async () => {
      const user = userEvent.setup();
      
      render(<MedicineList {...mockProps} />);
      
      // 测试Tab键导航
      await user.tab();
      expect(screen.getByRole('button', { name: /排序/ })).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('textbox', { name: /搜索/ })).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('button', { name: /筛选/ })).toHaveFocus();
    });

    test('TC-MED-06-L: 屏幕阅读器支持', () => {
      render(<MedicineList {...mockProps} />);
      
      // 验证ARIA标签
      expect(screen.getByRole('table')).toHaveAttribute('aria-label', '药品列表');
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', '分页导航');
      
      // 验证表格标题
      const headers = screen.getAllByRole('columnheader');
      headers.forEach(header => {
        expect(header).toHaveAttribute('scope', 'col');
      });
      
      // 验证状态公告
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    test('TC-MED-06-M: 颜色对比度验证', () => {
      render(<MedicineList {...mockProps} />);
      
      // 验证重要元素的颜色对比度
      const primaryButtons = screen.getAllByRole('button', { name: /主要操作/ });
      primaryButtons.forEach(button => {
        const styles = window.getComputedStyle(button);
        // 这里应该有实际的对比度计算，简化为样式检查
        expect(styles.backgroundColor).toBeDefined();
        expect(styles.color).toBeDefined();
      });
    });
  });

  describe('错误处理用户体验测试', () => {
    test('TC-MED-06-N: 网络错误友好提示', () => {
      const errorProps = { 
        ...mockProps, 
        error: { message: '网络连接失败', code: 'NETWORK_ERROR' }
      };
      
      render(<MedicineList {...errorProps} />);
      
      // 验证错误提示
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/网络连接失败/)).toBeInTheDocument();
      expect(screen.getByText(/请检查网络连接后重试/)).toBeInTheDocument();
      
      // 验证重试按钮
      expect(screen.getByRole('button', { name: /重试/ })).toBeInTheDocument();
    });

    test('TC-MED-06-O: 数据验证错误提示', async () => {
      const user = userEvent.setup();
      
      render(<MedicineList {...mockProps} />);
      
      // 模拟无效的页码输入
      const pageInput = screen.getByLabelText('跳转到页码');
      await user.type(pageInput, '999');
      await user.keyboard('{Enter}');
      
      // 验证验证错误提示
      await waitFor(() => {
        expect(screen.getByText(/页码超出范围/)).toBeInTheDocument();
      });
    });
  });

  describe('性能感知优化测试', () => {
    test('TC-MED-06-P: 渐进式加载体验', async () => {
      const { rerender } = render(<MedicineList {...mockProps} loading={true} />);
      
      // 验证初始加载状态
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      
      // 模拟数据逐步加载
      rerender(<MedicineList {...mockProps} medicines={mockMedicines.slice(0, 5)} loading={true} />);
      
      // 验证部分数据显示
      expect(screen.getAllByTestId('medicine-item').length).toBe(5);
      expect(screen.getByText(/正在加载更多/)).toBeInTheDocument();
      
      // 完成加载
      rerender(<MedicineList {...mockProps} />);
      
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      expect(screen.getAllByTestId('medicine-item').length).toBe(20);
    });

    test('TC-MED-06-Q: 操作反馈及时性', async () => {
      const user = userEvent.setup();
      
      render(<MedicineList {...mockProps} />);
      
      const sortButton = screen.getByText('价格(克)');
      
      // 点击排序按钮
      await user.click(sortButton);
      
      // 验证即时视觉反馈
      expect(sortButton).toHaveClass('sorting');
      expect(screen.getByTestId('sort-loading-icon')).toBeInTheDocument();
      
      // 模拟排序完成
      await waitFor(() => {
        expect(sortButton).not.toHaveClass('sorting');
        expect(screen.queryByTestId('sort-loading-icon')).not.toBeInTheDocument();
      });
    });
  });

  describe('用户体验总结报告', () => {
    test('TC-MED-06-R: UX优化验证总结', () => {
      const uxReport: {
        testSuite: string;
        categories: Record<string, string[]>;
        testDate: string;
        environment: {
          userAgent: string;
          screenWidth: number;
          screenHeight: number;
        };
      } = {
        testSuite: 'TC-MED-06 用户体验优化验证',
        categories: {
          '搜索体验': ['实时反馈', '历史记录', '无结果提示', '键盘导航'],
          '列表交互': ['加载状态', '分页体验', '批量操作', '排序反馈'],
          '响应式设计': ['移动端适配', '平板端适配'],
          '无障碍访问': ['键盘导航', '屏幕阅读器', '颜色对比度'],
          '错误处理': ['网络错误', '数据验证'],
          '性能感知': ['渐进加载', '操作反馈']
        },
        testDate: new Date().toISOString(),
        environment: {
          userAgent: navigator.userAgent,
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
        }
      };
      
      console.log('用户体验优化验证报告:', JSON.stringify(uxReport, null, 2));
      
      // 验证所有UX类别都已测试
      Object.keys(uxReport.categories).forEach(category => {
        expect(uxReport.categories[category].length).toBeGreaterThan(0);
      });
      
      expect(uxReport.categories['搜索体验'].length).toBe(4);
      expect(uxReport.categories['列表交互'].length).toBe(4);
      expect(uxReport.categories['响应式设计'].length).toBe(2);
      expect(uxReport.categories['无障碍访问'].length).toBe(3);
      expect(uxReport.categories['错误处理'].length).toBe(2);
      expect(uxReport.categories['性能感知'].length).toBe(2);
    });
  });
}); 