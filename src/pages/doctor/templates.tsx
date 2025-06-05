import React, { useState, useEffect, useCallback } from 'react';
import { DoctorLayout } from '@/layouts/DoctorLayout';
import { withAuth } from '@/components/auth/withAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye,
  Edit,
  Copy,
  Trash2,
  Clock,
  Users,
  BookOpen,
  TrendingUp,
  Star
} from 'lucide-react';
import { PrescriptionTemplateService } from '@/services/prescriptionTemplateService';
import { PrescriptionTemplate, TemplateSearchParams } from '@/types/prescription';

/**
 * 模板卡片组件
 */
const TemplateCard: React.FC<{
  template: PrescriptionTemplate;
  onView: (template: PrescriptionTemplate) => void;
  onEdit: (template: PrescriptionTemplate) => void;
  onCopy: (template: PrescriptionTemplate) => void;
  onDelete: (template: PrescriptionTemplate) => void;
}> = ({ template, onView, onEdit, onCopy, onDelete }) => {
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg leading-tight">{template.name}</CardTitle>
              {template.isDefault && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                  <Star size={12} className="mr-1" />
                  默认
                </Badge>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {template.category}
            </Badge>
          </div>
        </div>
        
        {template.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {template.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* 药品信息 */}
          <div className="text-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <BookOpen size={14} />
              <span>药品组成</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {template.items.slice(0, 3).map(item => item.medicineName).join('、')}
              {template.items.length > 3 && `等${template.items.length}味药`}
            </div>
          </div>

          {/* 统计信息 */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span>使用{template.usageCount}次</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{formatDate(template.updatedAt)}</span>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(template)}
              className="flex-1 text-xs"
            >
              <Eye size={14} className="mr-1" />
              查看
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(template)}
              className="flex-1 text-xs"
            >
              <Edit size={14} className="mr-1" />
              编辑
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCopy(template)}
              className="text-xs"
            >
              <Copy size={14} />
            </Button>
            {!template.isDefault && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(template)}
                className="text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 size={14} />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * 统计卡片组件
 */
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}> = ({ title, value, icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

/**
 * 医师处方模板页面
 */
function DoctorTemplatesPage() {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 搜索和过滤状态
  const [searchParams, setSearchParams] = useState<TemplateSearchParams>({
    query: '',
    category: undefined,
    defaultOnly: false,
    page: 1,
    limit: 12
  });
  
  // 分页状态
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 0
  });
  
  // 分类选项和统计
  const [categories, setCategories] = useState<Array<{value: string, label: string, count: number}>>([]);
  const [popularTemplates, setPopularTemplates] = useState<PrescriptionTemplate[]>([]);

  /**
   * 加载处方模板数据
   */
  const loadTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await PrescriptionTemplateService.getTemplates(searchParams);
      setTemplates(result.data);
      setPagination({
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载模板失败');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  /**
   * 加载统计数据和分类信息
   */
  const loadStats = useCallback(async () => {
    try {
      // 加载分类信息
      const categoriesData = await PrescriptionTemplateService.getTemplateCategories();
      setCategories(categoriesData);
      
      // 加载热门模板
      const popular = await PrescriptionTemplateService.getPopularTemplates(3);
      setPopularTemplates(popular);
    } catch (err) {
      console.error('加载统计数据失败:', err);
    }
  }, []);

  // 初始化加载
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // 加载统计数据
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // 搜索参数变化时重新加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTemplates();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchParams, loadTemplates]);

  /**
   * 处理搜索输入
   */
  const handleSearch = (query: string) => {
    setSearchParams(prev => ({
      ...prev,
      query,
      page: 1
    }));
  };

  /**
   * 处理分类筛选
   */
  const handleCategoryFilter = (category: string) => {
    setSearchParams(prev => ({
      ...prev,
      category: category === 'all' ? undefined : category,
      page: 1
    }));
  };

  /**
   * 处理默认模板筛选
   */
  const handleDefaultFilter = (defaultOnly: boolean) => {
    setSearchParams(prev => ({
      ...prev,
      defaultOnly,
      page: 1
    }));
  };

  /**
   * 处理分页
   */
  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({
      ...prev,
      page
    }));
  };

  /**
   * 查看模板详情
   */
  const handleViewTemplate = (template: PrescriptionTemplate) => {
    // TODO: 实现模板详情Modal
    console.log('查看模板:', template);
  };

  /**
   * 编辑模板
   */
  const handleEditTemplate = (template: PrescriptionTemplate) => {
    // TODO: 实现模板编辑Modal
    console.log('编辑模板:', template);
  };

  /**
   * 复制模板
   */
  const handleCopyTemplate = async (template: PrescriptionTemplate) => {
    try {
      await PrescriptionTemplateService.duplicateTemplate(template.id);
      // 重新加载数据以显示新复制的模板
      loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : '复制模板失败');
    }
  };

  /**
   * 删除模板
   */
  const handleDeleteTemplate = async (template: PrescriptionTemplate) => {
    if (!confirm(`确定要删除模板"${template.name}"吗？此操作不可撤销。`)) {
      return;
    }
    
    try {
      await PrescriptionTemplateService.deleteTemplate(template.id);
      // 重新加载数据
      loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除模板失败');
    }
  };

  /**
   * 创建新模板
   */
  const handleCreateTemplate = () => {
    // TODO: 实现创建模板Modal
    console.log('创建新模板');
  };

  return (
    <DoctorLayout title="处方模板 - 医师工作站">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">处方模板</h1>
            <p className="text-muted-foreground">管理和使用您的处方模板</p>
          </div>
          <Button onClick={handleCreateTemplate} className="gap-2">
            <Plus size={16} />
            新建模板
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="模板总数"
            value={pagination.total}
            icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
            description="可用处方模板"
          />
          <StatsCard
            title="热门模板"
            value={popularTemplates[0]?.name || '暂无'}
            icon={<TrendingUp className="h-4 w-4 text-amber-600" />}
            description={`使用${popularTemplates[0]?.usageCount || 0}次`}
          />
          <StatsCard
            title="分类数量"
            value={categories.filter(c => c.value !== 'all').length}
            icon={<Filter className="h-4 w-4 text-blue-600" />}
            description="模板分类"
          />
          <StatsCard
            title="默认模板"
            value={categories.find(c => c.value === 'all')?.count || 0}
            icon={<Star className="h-4 w-4 text-green-600" />}
            description="系统推荐"
          />
        </div>

        {/* 搜索和筛选区域 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="搜索模板名称、描述或药品..."
                    value={searchParams.query || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select 
                  value={searchParams.category || 'all'} 
                  onValueChange={handleCategoryFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="分类筛选" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={searchParams.defaultOnly ? 'true' : 'false'} 
                  onValueChange={(value) => handleDefaultFilter(value === 'true')}
                >
                  <SelectTrigger className="w-[120px]">
                    <Star className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">全部模板</SelectItem>
                    <SelectItem value="true">默认模板</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 错误提示 */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* 模板展示区域 */}
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">加载中...</div>
            </div>
          ) : templates.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">暂无处方模板</p>
                  <Button 
                    onClick={handleCreateTemplate} 
                    className="mt-4 gap-2"
                    variant="outline"
                  >
                    <Plus size={16} />
                    创建第一个模板
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* 模板网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onView={handleViewTemplate}
                    onEdit={handleEditTemplate}
                    onCopy={handleCopyTemplate}
                    onDelete={handleDeleteTemplate}
                  />
                ))}
              </div>

              {/* 分页控件 */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-6">
                  <div className="text-sm text-muted-foreground">
                    显示第 {((pagination.page - 1) * 12) + 1} - {Math.min(pagination.page * 12, pagination.total)} 个，
                    共 {pagination.total} 个模板
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      上一页
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
}

export default withAuth(DoctorTemplatesPage, { allowedRoles: ['doctor'] }); 