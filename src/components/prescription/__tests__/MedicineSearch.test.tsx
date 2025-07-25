import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock react-hotkeys-hook to avoid ES module issues
jest.mock('react-hotkeys-hook', () => ({
  useHotkeys: jest.fn()
}));

import MedicineSearch from '../MedicineSearch';
import { mockMedicines } from '@/mocks/medicineData';

describe('MedicineSearch Component - DAY 2 联调测试', () => {
  const mockOnSelectMedicine = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('TC-MED-01-A: 渲染搜索组件', () => {
    render(<MedicineSearch onSelectMedicine={mockOnSelectMedicine} />);
    
    const searchInput = screen.getByPlaceholderText('搜索药材...');
    expect(searchInput).toBeInTheDocument();
  });

  test('TC-MED-01-B: 中文搜索功能', async () => {
    render(<MedicineSearch onSelectMedicine={mockOnSelectMedicine} />);
    
    const searchInput = screen.getByPlaceholderText('搜索药材...');
    
    // 测试中文搜索
    fireEvent.change(searchInput, { target: { value: '人参' } });
    
    await waitFor(() => {
      const results = screen.queryAllByText(/人参/i);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  test('TC-MED-01-C: 英文搜索功能', async () => {
    render(<MedicineSearch onSelectMedicine={mockOnSelectMedicine} />);
    
    const searchInput = screen.getByPlaceholderText('搜索药材...');
    
    // 测试英文搜索
    fireEvent.change(searchInput, { target: { value: 'ginseng' } });
    
    await waitFor(() => {
      const results = screen.queryAllByText(/ginseng/i);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  test('TC-MED-01-D: 拼音搜索功能', async () => {
    render(<MedicineSearch onSelectMedicine={mockOnSelectMedicine} />);
    
    const searchInput = screen.getByPlaceholderText('搜索药材...');
    
    // 测试拼音搜索
    fireEvent.change(searchInput, { target: { value: 'renshen' } });
    
    await waitFor(() => {
      const results = screen.queryAllByText(/renshen/i);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  test('TC-MED-01-E: 搜索结果选择功能', async () => {
    render(<MedicineSearch onSelectMedicine={mockOnSelectMedicine} />);
    
    const searchInput = screen.getByPlaceholderText('搜索药材...');
    fireEvent.change(searchInput, { target: { value: '人参' } });
    
    await waitFor(() => {
      const firstResult = screen.getAllByRole('listitem')[0];
      expect(firstResult).toBeInTheDocument();
      
      fireEvent.click(firstResult);
      expect(mockOnSelectMedicine).toHaveBeenCalled();
    });
  });

  test('TC-MED-01-F: 空搜索处理', () => {
    render(<MedicineSearch onSelectMedicine={mockOnSelectMedicine} />);
    
    const searchInput = screen.getByPlaceholderText('搜索药材...');
    fireEvent.change(searchInput, { target: { value: '' } });
    
    // 应该没有搜索结果显示
    const dropdown = screen.queryByRole('list');
    expect(dropdown).not.toBeInTheDocument();
  });

  test('TC-MED-01-G: 搜索性能测试', async () => {
    const startTime = performance.now();
    render(<MedicineSearch onSelectMedicine={mockOnSelectMedicine} />);
    
    const searchInput = screen.getByPlaceholderText('搜索药材...');
    fireEvent.change(searchInput, { target: { value: '人参' } });
    
    await waitFor(() => {
      const results = screen.queryAllByText(/人参/i);
      expect(results.length).toBeGreaterThan(0);
    });

    const endTime = performance.now();
    const searchTime = endTime - startTime;
    
    console.log(`搜索性能: ${searchTime}ms`);
    expect(searchTime).toBeLessThan(1000); // 搜索应在1秒内完成
  });
}); 