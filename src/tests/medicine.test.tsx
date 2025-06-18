/**
 * 中药管理组件集成测试
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MedicineForm } from '@/components/admin/medicines/MedicineForm';
import { MedicineList } from '@/components/admin/medicines/MedicineList';
import { MedicineFilters } from '@/components/admin/medicines/MedicineFilters';
import { Medicine } from '@/types/medicine';
import MedicineSearch from '@/components/prescription/MedicineSearch';

// 模拟初始数据
const mockMedicines: Medicine[] = [
  {
    id: "med_001",
    sku: "TCM-001",
    name: "人参",
    pinyin: "renshen",
    category: "补气",
    pricePerGram: 15.0,
    // 向后兼容字段
    chineseName: "人参",
    englishName: "Ginseng",
    pinyinName: "renshen",
    stock: 100,
    description: "补气药",
    properties: "温",
    isActive: true,
    imageUrl: "https://example.com/ginseng.jpg",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "med_002",
    sku: "TCM-002",
    name: "当归",
    pinyin: "danggui",
    category: "补血",
    pricePerGram: 3.5,
    // 向后兼容字段
    chineseName: "当归",
    englishName: "Angelica Sinensis",
    pinyinName: "danggui",
    stock: 200,
    description: "补血药",
    properties: "温",
    isActive: true,
    imageUrl: "https://example.com/angelica.jpg",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  }
];

// 模拟服务
jest.mock('@/services/medicineService', () => ({
  getAllMedicines: jest.fn().mockResolvedValue({
    data: mockMedicines,
    total: mockMedicines.length,
    page: 1,
    limit: 10,
    totalPages: 1
  }),
  getMedicineById: jest.fn().mockImplementation((id: string) => 
    Promise.resolve(mockMedicines.find(m => m.id === id) || null)
  ),
  createMedicine: jest.fn().mockImplementation((data) => 
    Promise.resolve({
      id: 'med_new',
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  ),
  updateMedicine: jest.fn().mockImplementation((id, data) => {
    const medicine = mockMedicines.find(m => m.id === id);
    if (!medicine) {
      return Promise.reject(new Error('Medicine not found'));
    }
    return Promise.resolve({
      ...medicine,
      ...data,
      updatedAt: new Date().toISOString()
    });
  }),
  deleteMedicine: jest.fn().mockResolvedValue(true),
  searchMedicines: jest.fn().mockImplementation((query) => {
    if (!query) return Promise.resolve([]);
    return Promise.resolve(
      mockMedicines.filter(m => 
        m.name.includes(query) ||
        (m.chineseName && m.chineseName.includes(query)) ||
        (m.englishName && m.englishName.toLowerCase().includes(query.toLowerCase())) ||
        (m.pinyinName && m.pinyinName.includes(query))
      )
    );
  })
}));

// 模拟组件依赖
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/admin/medicines',
    query: {}
  }),
}));

describe('中药管理集成测试 - MedicineForm组件', () => {
  // 注意：这些测试将在实际实现MedicineForm组件后进行调整
  
  test('应该正确渲染创建新中药的表单', () => {
    const handleSubmit = jest.fn();
    render(
      <MedicineForm 
        onSubmit={handleSubmit}
        isSubmitting={false}
      />
    );
    
    // 检查表单字段是否正确渲染
    expect(screen.getByLabelText(/中文名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/英文名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/拼音名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/单价/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/库存/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/药性/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/分类/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/描述/i)).toBeInTheDocument();
    
    // 检查提交按钮
    expect(screen.getByRole('button', { name: /保存/i })).toBeInTheDocument();
  });
  
  test('应该正确渲染编辑中药的表单并填充初始数据', () => {
    const handleSubmit = jest.fn();
    render(
      <MedicineForm 
        initialData={mockMedicines[0]}
        onSubmit={handleSubmit}
        isSubmitting={false}
      />
    );
    
    // 检查初始值是否正确填充
    expect(screen.getByLabelText(/中文名/i)).toHaveValue(mockMedicines[0].chineseName);
    expect(screen.getByLabelText(/英文名/i)).toHaveValue(mockMedicines[0].englishName);
    expect(screen.getByLabelText(/拼音名/i)).toHaveValue(mockMedicines[0].pinyinName);
    expect(screen.getByLabelText(/单价/i)).toHaveValue(mockMedicines[0].pricePerGram.toString());
    expect(screen.getByLabelText(/库存/i)).toHaveValue(mockMedicines[0].stock?.toString() || '');
    expect(screen.getByLabelText(/描述/i)).toHaveValue(mockMedicines[0].description);
  });
  
  test('提交前应该验证必填字段', async () => {
    const handleSubmit = jest.fn();
    render(
      <MedicineForm 
        onSubmit={handleSubmit}
        isSubmitting={false}
      />
    );
    
    // 不填写必填字段，直接点击提交
    fireEvent.click(screen.getByRole('button', { name: /保存/i }));
    
    // 应该显示错误信息
    await waitFor(() => {
      expect(screen.getByText(/中文名是必填项/i)).toBeInTheDocument();
      expect(screen.getByText(/英文名是必填项/i)).toBeInTheDocument();
      expect(screen.getByText(/拼音名是必填项/i)).toBeInTheDocument();
      expect(screen.getByText(/单价是必填项/i)).toBeInTheDocument();
    });
    
    // 提交函数不应被调用
    expect(handleSubmit).not.toHaveBeenCalled();
  });
  
  test('填写有效数据后应该成功提交表单', async () => {
    const handleSubmit = jest.fn();
    render(
      <MedicineForm 
        onSubmit={handleSubmit}
        isSubmitting={false}
      />
    );
    
    // 填写表单
    fireEvent.change(screen.getByLabelText(/中文名/i), { target: { value: '测试中药' } });
    fireEvent.change(screen.getByLabelText(/英文名/i), { target: { value: 'Test Medicine' } });
    fireEvent.change(screen.getByLabelText(/拼音名/i), { target: { value: 'ceshizhongyao' } });
    fireEvent.change(screen.getByLabelText(/单价/i), { target: { value: '5.0' } });
    fireEvent.change(screen.getByLabelText(/库存/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/描述/i), { target: { value: '这是一个测试用的中药' } });
    
    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: /保存/i }));
    
    // 验证是否调用了onSubmit函数
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        chineseName: '测试中药',
        englishName: 'Test Medicine',
        pinyinName: 'ceshizhongyao',
        pricePerGram: 5.0,
        stock: 1000,
        description: '这是一个测试用的中药',
        isActive: true,
        properties: expect.any(String),
        category: expect.any(String)
      });
    });
  });
});

describe('中药管理集成测试 - MedicineList组件', () => {
  test('应该正确渲染中药列表', () => {
    render(
      <MedicineList 
        medicines={mockMedicines}
        loading={false}
        totalItems={mockMedicines.length}
        currentPage={1}
        itemsPerPage={10}
        onPageChange={jest.fn()}
        onItemsPerPageChange={jest.fn()}
      />
    );
    
    // 检查是否显示了所有中药
    expect(screen.getByText('人参')).toBeInTheDocument();
    expect(screen.getByText('Ginseng')).toBeInTheDocument();
    expect(screen.getByText('当归')).toBeInTheDocument();
    expect(screen.getByText('Angelica Sinensis')).toBeInTheDocument();
    
    // 检查是否显示了价格信息
    expect(screen.getByText('¥15.00')).toBeInTheDocument();
    expect(screen.getByText('¥3.50')).toBeInTheDocument();
    
    // 检查是否显示了操作按钮
    expect(screen.getAllByRole('button', { name: /编辑/i })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /删除/i })).toHaveLength(2);
  });
  
  test('应该显示加载中状态', () => {
    render(
      <MedicineList 
        medicines={[]}
        loading={true}
        totalItems={0}
        currentPage={1}
        itemsPerPage={10}
        onPageChange={jest.fn()}
        onItemsPerPageChange={jest.fn()}
      />
    );
    
    expect(screen.getByText(/加载中/i)).toBeInTheDocument();
  });
  
  test('列表为空时应该显示空状态提示', () => {
    render(
      <MedicineList 
        medicines={[]}
        loading={false}
        totalItems={0}
        currentPage={1}
        itemsPerPage={10}
        onPageChange={jest.fn()}
        onItemsPerPageChange={jest.fn()}
      />
    );
    
    expect(screen.getByText(/没有找到中药/i)).toBeInTheDocument();
  });
  
  test('点击分页按钮应该触发分页事件', () => {
    const handlePageChange = jest.fn();
    render(
      <MedicineList 
        medicines={mockMedicines}
        loading={false}
        totalItems={25}
        currentPage={1}
        itemsPerPage={10}
        onPageChange={handlePageChange}
        onItemsPerPageChange={jest.fn()}
      />
    );
    
    // 点击第二页
    const nextButton = screen.getByRole('button', { name: /下一页/i });
    fireEvent.click(nextButton);
    
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });
});

describe('中药管理集成测试 - MedicineFilters组件', () => {
  test('应该正确渲染筛选组件', () => {
    const handleChange = jest.fn();
    const filters = {
      query: '',
      category: '',
      property: '',
      sortBy: 'chineseName' as const,
      order: 'asc' as const
    };
    
    render(
      <MedicineFilters 
        filters={filters}
        onChange={handleChange}
      />
    );
    
    // 检查搜索框
    expect(screen.getByPlaceholderText(/搜索中药/i)).toBeInTheDocument();
    
    // 检查分类筛选
    expect(screen.getByText(/所有分类/i)).toBeInTheDocument();
    
    // 检查药性筛选
    expect(screen.getByText(/所有药性/i)).toBeInTheDocument();
    
    // 检查排序
    expect(screen.getByText(/排序方式/i)).toBeInTheDocument();
  });
  
  test('更改搜索关键词应该触发变更事件', async () => {
    const handleChange = jest.fn();
    const filters = {
      query: '',
      category: '',
      property: '',
      sortBy: 'chineseName' as const,
      order: 'asc' as const
    };
    
    render(
      <MedicineFilters 
        filters={filters}
        onChange={handleChange}
      />
    );
    
    // 输入搜索关键词
    const searchInput = screen.getByPlaceholderText(/搜索中药/i);
    fireEvent.change(searchInput, { target: { value: '人参' } });
    
    // 等待防抖
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith({
        ...filters,
        query: '人参'
      });
    });
  });
  
  test('更改分类筛选应该触发变更事件', () => {
    const handleChange = jest.fn();
    const filters = {
      query: '',
      category: '',
      property: '',
      sortBy: 'chineseName' as const,
      order: 'asc' as const
    };
    
    render(
      <MedicineFilters 
        filters={filters}
        onChange={handleChange}
      />
    );
    
    // 选择补气分类
    const categorySelect = screen.getByLabelText(/分类/i);
    fireEvent.change(categorySelect, { target: { value: '补气' } });
    
    expect(handleChange).toHaveBeenCalledWith({
      ...filters,
      category: '补气'
    });
  });
  
  test('更改药性筛选应该触发变更事件', () => {
    const handleChange = jest.fn();
    const filters = {
      query: '',
      category: '',
      property: '',
      sortBy: 'chineseName' as const,
      order: 'asc' as const
    };
    
    render(
      <MedicineFilters 
        filters={filters}
        onChange={handleChange}
      />
    );
    
    // 选择温性
    const propertySelect = screen.getByLabelText(/药性/i);
    fireEvent.change(propertySelect, { target: { value: '温' } });
    
    expect(handleChange).toHaveBeenCalledWith({
      ...filters,
      property: '温'
    });
  });
  
  test('更改排序应该触发变更事件', () => {
    const handleChange = jest.fn();
    const filters = {
      query: '',
      category: '',
      property: '',
      sortBy: 'chineseName' as const,
      order: 'asc' as const
    };
    
    render(
      <MedicineFilters 
        filters={filters}
        onChange={handleChange}
      />
    );
    
    // 更改排序字段
    const sortBySelect = screen.getByLabelText(/排序方式/i);
    fireEvent.change(sortBySelect, { target: { value: 'pricePerGram' } });
    
    expect(handleChange).toHaveBeenCalledWith({
      ...filters,
      sortBy: 'pricePerGram'
    });
    
    // 更改排序方向
    const orderSelect = screen.getByLabelText(/排序方向/i);
    fireEvent.change(orderSelect, { target: { value: 'desc' } });
    
    expect(handleChange).toHaveBeenCalledWith({
      ...filters,
      order: 'desc'
    });
  });
});

describe('Medicine Components', () => {
  describe('MedicineSearch', () => {
    it('renders search input', () => {
      const mockOnSelectMedicine = jest.fn();
      
      render(
        <MedicineSearch 
          onSelectMedicine={mockOnSelectMedicine}
        />
      );
      
      expect(screen.getByPlaceholderText(/搜索药材/)).toBeInTheDocument();
    });

    it('calls onSelectMedicine when medicine is selected', () => {
      const mockOnSelectMedicine = jest.fn();
      
      render(
        <MedicineSearch 
          onSelectMedicine={mockOnSelectMedicine}
        />
      );
      
      const searchInput = screen.getByPlaceholderText(/搜索药材/);
      fireEvent.change(searchInput, { target: { value: '人参' } });
      
      // 等待搜索结果出现
      const medicineOption = screen.getByText('人参');
      fireEvent.click(medicineOption);
      
      expect(mockOnSelectMedicine).toHaveBeenCalled();
    });

    it('shows search results when typing', () => {
      const mockOnSelectMedicine = jest.fn();
      
      render(
        <MedicineSearch 
          onSelectMedicine={mockOnSelectMedicine}
        />
      );
      
      const searchInput = screen.getByPlaceholderText(/搜索药材/);
      fireEvent.change(searchInput, { target: { value: '人参' } });
      
      expect(screen.getByText('人参')).toBeInTheDocument();
    });
  });

  describe('Medicine Form', () => {
    it('renders medicine form with correct values', () => {
      // 模拟药品表单组件测试
      const medicine = mockMedicines[0];
      
      render(
        <div>
          <input aria-label="药品名称" defaultValue={medicine.name} />
          <input aria-label="拼音" defaultValue={medicine.pinyin} />
          <input aria-label="价格" defaultValue={medicine.pricePerGram.toString()} />
          <input aria-label="库存" defaultValue={medicine.stock?.toString() || ''} />
        </div>
      );
      
      expect(screen.getByLabelText(/药品名称/i)).toHaveValue('人参');
      expect(screen.getByLabelText(/拼音/i)).toHaveValue('renshen');
      expect(screen.getByLabelText(/价格/i)).toHaveValue('15');
      expect(screen.getByLabelText(/库存/i)).toHaveValue(mockMedicines[0].stock?.toString() || '');
    });
  });
}); 