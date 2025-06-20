import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MedicineList } from '../MedicineList';
import { mockMedicines } from '@/mocks/medicineData';

describe('MedicineList Component - DAY 2 分页功能联调测试', () => {
  const mockProps = {
    medicines: mockMedicines.slice(0, 10), // 前10个药品
    loading: false,
    totalItems: 50,
    currentPage: 1,
    itemsPerPage: 10,
    onPageChange: jest.fn(),
    onItemsPerPageChange: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onViewDetail: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('TC-MED-03-A: 渲染药品列表', () => {
    render(<MedicineList {...mockProps} />);
    
    // 验证表头
    expect(screen.getByText('中药名称')).toBeInTheDocument();
    expect(screen.getByText('英文名')).toBeInTheDocument();
    expect(screen.getByText('分类')).toBeInTheDocument();
    
    // 验证第一个药品（当归）
    expect(screen.getByText('当归')).toBeInTheDocument();
    expect(screen.getByText('Angelica Sinensis')).toBeInTheDocument();
  });

  test('TC-MED-03-B: 分页功能验证', () => {
    render(<MedicineList {...mockProps} />);
    
    // 验证分页信息显示
    expect(screen.getByText('共 50 条记录')).toBeInTheDocument();
    expect(screen.getByText('每页显示')).toBeInTheDocument();
    
    // 测试下一页按钮
    const nextButton = screen.getByText('下一页');
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).not.toBeDisabled();
    
    fireEvent.click(nextButton);
    expect(mockProps.onPageChange).toHaveBeenCalledWith(2);
  });

  test('TC-MED-03-C: 每页显示数量选择', () => {
    render(<MedicineList {...mockProps} />);
    
    // 找到每页显示数量的选择器
    const itemsPerPageSelect = screen.getByDisplayValue('10');
    expect(itemsPerPageSelect).toBeInTheDocument();
    
    // 修改每页显示数量
    fireEvent.change(itemsPerPageSelect, { target: { value: '20' } });
    expect(mockProps.onItemsPerPageChange).toHaveBeenCalledWith(20);
  });

  test('TC-MED-03-D: 加载状态显示', () => {
    render(<MedicineList {...mockProps} loading={true} />);
    
    expect(screen.getByText('加载中...')).toBeInTheDocument();
    // 验证loading spinner存在
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  test('TC-MED-03-E: 空列表状态', () => {
    render(<MedicineList {...mockProps} medicines={[]} totalItems={0} />);
    
    expect(screen.getByText('没有找到中药记录')).toBeInTheDocument();
  });

  test('TC-MED-03-F: 药品操作按钮功能', async () => {
    render(<MedicineList {...mockProps} />);
    
    // 测试查看按钮
    const viewButtons = screen.getAllByText('查看');
    fireEvent.click(viewButtons[0]);
    expect(mockProps.onViewDetail).toHaveBeenCalledWith(mockMedicines[0]);
    
    // 测试编辑按钮
    const editButtons = screen.getAllByText('编辑');
    fireEvent.click(editButtons[0]);
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockMedicines[0]);
    
    // 测试删除按钮
    const deleteButtons = screen.getAllByText('删除');
    fireEvent.click(deleteButtons[0]);
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockMedicines[0]);
  });

  test('TC-MED-03-G: 批量选择功能', () => {
    const propsWithSelection = {
      ...mockProps,
      selectedMedicines: [],
      onSelect: jest.fn(),
      onSelectAll: jest.fn(),
    };
    
    render(<MedicineList {...propsWithSelection} />);
    
    // 测试全选checkbox
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(selectAllCheckbox);
    expect(propsWithSelection.onSelectAll).toHaveBeenCalledWith(true);
    
    // 测试单个选择
    const firstItemCheckbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(firstItemCheckbox);
    expect(propsWithSelection.onSelect).toHaveBeenCalledWith(mockMedicines[0], true);
  });

  test('TC-MED-03-H: 分页边界情况测试', () => {
    // 测试第一页
    const firstPageProps = { ...mockProps, currentPage: 1 };
    const { rerender } = render(<MedicineList {...firstPageProps} />);
    
    const prevButton = screen.getByText('上一页');
    expect(prevButton).toBeDisabled();
    
    // 测试最后一页
    const lastPageProps = { ...mockProps, currentPage: 5 };
    rerender(<MedicineList {...lastPageProps} />);
    
    const nextButton = screen.getByText('下一页');
    expect(nextButton).toBeDisabled();
  });

  test('TC-MED-03-I: 性能测试 - 大量数据渲染', () => {
    const startTime = performance.now();
    
    const largeMedicineList = Array.from({ length: 100 }, (_, index) => ({
      ...mockMedicines[0],
      id: `test-${index}`,
      chineseName: `测试药品${index}`,
    }));
    
    render(<MedicineList {...mockProps} medicines={largeMedicineList} totalItems={1000} />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    console.log(`大量数据渲染时间: ${renderTime}ms`);
    expect(renderTime).toBeLessThan(500); // 渲染应在500ms内完成
    
    // 验证数据正确渲染
    expect(screen.getByText('测试药品0')).toBeInTheDocument();
    expect(screen.getByText('测试药品99')).toBeInTheDocument();
  });
}); 