import React, { useState, useRef, useEffect } from 'react';
import { NextPage } from 'next';
import { DoctorLayout } from '@/layouts/DoctorLayout';
import { withAuth } from '@/components/auth/withAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  Minus,
  Trash2,
  BookOpen,
  Save,
  FileText,
  Clock,
  Star,
  Copy,
  Eye,
  Zap
} from 'lucide-react';

// 导入现有组件
import MedicineSearch from '@/components/prescription/MedicineSearch';
import { QuantityInput } from '@/components/prescription/QuantityInput';
import { PrescriptionPreview } from '@/components/prescription/PrescriptionPreview';
import ConsentModal from '@/components/common/ConsentModal';

// 导入Store和类型
import { usePrescriptionStore } from '@/store/prescriptionStore';
import { Medicine } from '@/types/medicine';
import { PrescriptionTemplate } from '@/types/prescription';

// 导入服务
import { PrescriptionTemplateService } from '@/services/prescriptionTemplateService';
import { getAllMedicines } from '@/services/medicineService';
import { initialMedicines } from '@/mocks/medicineData';

/**
 * 处方项目卡片组件
 */
const PrescriptionItemCard: React.FC<{
  item: any;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  isHighlighted?: boolean;
}> = ({ item, onUpdateQuantity, onRemove, isHighlighted }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <Card className={`transition-all duration-300 ${isHighlighted ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{item.medicine.chineseName}</h4>
              <Badge variant="outline" className="text-xs">
                {item.medicine.englishName}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              单价: ¥{item.medicine.pricePerGram}/克
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus size={14} />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}克</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                <Plus size={14} />
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(item.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t text-sm text-muted-foreground">
          小计: ¥{(item.medicine.pricePerGram * quantity).toFixed(2)}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * 模板卡片组件
 */
const TemplateCard: React.FC<{
  template: PrescriptionTemplate;
  onApply: (template: PrescriptionTemplate) => void;
  onView: (template: PrescriptionTemplate) => void;
}> = ({ template, onApply, onView }) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-base">{template.name}</CardTitle>
              {template.isDefault && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                  <Star size={10} className="mr-1" />
                  推荐
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
          <div className="text-xs text-muted-foreground">
            {template.items.slice(0, 3).map(item => item.medicineName).join('、')}
            {template.items.length > 3 && `等${template.items.length}味药`}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onApply(template)}
              className="flex-1 text-xs"
            >
              <Zap size={12} className="mr-1" />
              应用模板
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(template)}
              className="text-xs"
            >
              <Eye size={12} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * 重新设计的处方创建页面
 */
const CreatePrescriptionPage: NextPage = () => {
  const { 
    items, 
    copies, 
    addItem, 
    updateItemQuantity, 
    removeItem, 
    setCopies, 
    clearPrescription 
  } = usePrescriptionStore();
  
  // 基础状态
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [lastAddedItemId, setLastAddedItemId] = useState<string | undefined>(undefined);
  const [instructions, setInstructions] = useState<string>("水煎服，每次1剂，每日2次，温服");
  const [showConsent, setShowConsent] = useState(false);
  
  // 模板相关状态
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([]);
  const [popularTemplates, setPopularTemplates] = useState<PrescriptionTemplate[]>([]);
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  
  // 当前选项卡
  const [activeTab, setActiveTab] = useState('manual');
  
  const searchRef = useRef<{ focusInput: () => void }>(null);

  // 初始化数据
  useEffect(() => {
    loadPopularTemplates();
    
    // 检查同意状态
    if (typeof window !== 'undefined') {
      const hasSeenConsent = sessionStorage.getItem('hasSeenPrescriptionConsent');
      if (!hasSeenConsent) {
        setShowConsent(true);
      }
    }
  }, []);

  /**
   * 加载热门模板
   */
  const loadPopularTemplates = async () => {
    try {
      const popular = await PrescriptionTemplateService.getPopularTemplates(6);
      setPopularTemplates(popular);
    } catch (error) {
      console.error('加载热门模板失败:', error);
    }
  };

  /**
   * 搜索模板
   */
  const searchTemplates = async (query: string) => {
    if (!query.trim()) {
      setTemplates([]);
      return;
    }
    
    try {
      setLoadingTemplates(true);
      const results = await PrescriptionTemplateService.searchTemplates(query);
      setTemplates(results);
    } catch (error) {
      console.error('搜索模板失败:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  /**
   * 处理模板搜索
   */
  const handleTemplateSearch = (query: string) => {
    setTemplateSearchQuery(query);
    const timer = setTimeout(() => {
      searchTemplates(query);
    }, 300);
    
    return () => clearTimeout(timer);
  };

  /**
   * 应用模板到当前处方
   */
  const handleApplyTemplate = async (template: PrescriptionTemplate) => {
    try {
      // 清空当前处方
      clearPrescription();
      
      // 添加模板中的药品
      for (const templateItem of template.items) {
        // 查找对应的药品信息
        const medicine = initialMedicines.find(m => m.id === templateItem.medicineId);
        if (medicine) {
          addItem(medicine, templateItem.defaultQuantity);
        }
      }
      
      // 设置默认医嘱
      if (template.defaultInstructions) {
        setInstructions(template.defaultInstructions);
      }
      
      // 切换到手动添加选项卡
      setActiveTab('manual');
      
      // 增加模板使用次数（异步调用，不影响主流程）
      PrescriptionTemplateService.incrementUsageCount(template.id).catch(error => {
        console.error('更新模板使用次数失败:', error);
      });
      
    } catch (error) {
      console.error('应用模板失败:', error);
    }
  };

  /**
   * 查看模板详情
   */
  const handleViewTemplate = (template: PrescriptionTemplate) => {
    // TODO: 实现模板详情Modal
    console.log('查看模板详情:', template);
  };

  /**
   * 保存为模板
   */
  const handleSaveAsTemplate = () => {
    if (items.length === 0) {
      alert('请先添加药品再保存为模板');
      return;
    }
    
    // TODO: 实现保存为模板功能
    console.log('保存为模板');
  };

  // 处理同意
  const handleConsentConfirm = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasSeenPrescriptionConsent', 'true');
    }
    setShowConsent(false);
  };

  // 处理选择药品
  const handleSelectMedicine = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
  };

  // 处理确认添加药品
  const handleConfirmQuantity = (medicine: Medicine, quantity: number) => {
    const newItemId = addItem(medicine, quantity);
    setLastAddedItemId(newItemId);
    setSelectedMedicine(null);
    
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.focusInput();
      }
    }, 100);
    
    setTimeout(() => {
      setLastAddedItemId(undefined);
    }, 3000);
  };

  // 处理取消添加药品
  const handleCancelQuantity = () => {
    setSelectedMedicine(null);
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.focusInput();
      }
    }, 100);
  };

  // 处理生成处方单
  const handleGeneratePrescription = () => {
    if (items.length === 0) {
      alert('请先添加药品');
      return;
    }
    setShowPreview(true);
  };

  // 处理完成处方
  const handleComplete = () => {
    setShowPreview(false);
    clearPrescription();
    setInstructions("水煎服，每次1剂，每日2次，温服");
    
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.focusInput();
      }
    }, 100);
  };

  // 计算总价
  const totalPrice = items.reduce((sum, item) => 
    sum + (item.medicine.pricePerGram * item.quantity), 0
  );

  return (
    <DoctorLayout title="创建处方 - 医师工作站">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">创建处方</h1>
            <p className="text-muted-foreground">选择模板快速开始，或手动添加药品</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSaveAsTemplate}
              disabled={items.length === 0}
              className="gap-2"
            >
              <Save size={16} />
              保存为模板
            </Button>
            <Button 
              onClick={handleGeneratePrescription}
              disabled={items.length === 0}
              className="gap-2"
            >
              <FileText size={16} />
              生成处方单
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：添加药品区域 */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="template" className="gap-2">
                  <BookOpen size={16} />
                  从模板开始
                </TabsTrigger>
                <TabsTrigger value="manual" className="gap-2">
                  <Search size={16} />
                  手动添加
                </TabsTrigger>
              </TabsList>
              
              {/* 模板选择 */}
              <TabsContent value="template" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">选择处方模板</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 模板搜索 */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="搜索模板名称或药品..."
                        value={templateSearchQuery}
                        onChange={(e) => handleTemplateSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    {/* 模板列表 */}
                    <div className="space-y-4">
                      {templateSearchQuery ? (
                        // 搜索结果
                        <div>
                          <h4 className="font-medium mb-2">搜索结果</h4>
                          {loadingTemplates ? (
                            <div className="text-center py-4 text-muted-foreground">搜索中...</div>
                          ) : templates.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {templates.map((template) => (
                                <TemplateCard
                                  key={template.id}
                                  template={template}
                                  onApply={handleApplyTemplate}
                                  onView={handleViewTemplate}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-muted-foreground">
                              未找到相关模板
                            </div>
                          )}
                        </div>
                      ) : (
                        // 热门模板
                        <div>
                          <h4 className="font-medium mb-2">热门模板</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {popularTemplates.map((template) => (
                              <TemplateCard
                                key={template.id}
                                template={template}
                                onApply={handleApplyTemplate}
                                onView={handleViewTemplate}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* 手动添加 */}
              <TabsContent value="manual">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">搜索添加药品</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MedicineSearch 
                      ref={searchRef} 
                      onSelectMedicine={handleSelectMedicine}
                      maxDropdownHeight={400} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* 右侧：处方信息 */}
          <div className="space-y-6">
            {/* 处方统计 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">处方统计</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>药品种类:</span>
                  <span className="font-medium">{items.length} 种</span>
                </div>
                <div className="flex justify-between">
                  <span>预估总价:</span>
                  <span className="font-medium">¥{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>帖数:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCopies(Math.max(1, copies - 1))}
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="w-8 text-center font-medium">{copies}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCopies(copies + 1)}
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>总计:</span>
                    <span>¥{(totalPrice * copies).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 用法用量 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">用法用量</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="请输入用法用量..."
                  className="w-full h-24 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <div className="space-y-2">
              <Button 
                onClick={handleGeneratePrescription}
                disabled={items.length === 0}
                className="w-full gap-2"
                size="lg"
              >
                <FileText size={16} />
                生成处方单
              </Button>
              <Button 
                variant="outline"
                onClick={clearPrescription}
                disabled={items.length === 0}
                className="w-full"
              >
                清空处方
              </Button>
            </div>
          </div>
        </div>

        {/* 处方药品列表 */}
        {items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">处方药品列表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <PrescriptionItemCard
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateItemQuantity}
                    onRemove={removeItem}
                    isHighlighted={item.id === lastAddedItemId}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 弹窗组件 */}
      {selectedMedicine && (
        <QuantityInput
          medicine={selectedMedicine}
          onConfirm={handleConfirmQuantity}
          onCancel={handleCancelQuantity}
        />
      )}
      
      {showPreview && (
        <PrescriptionPreview
          items={items}
          copies={copies}
          instructions={instructions}
          onClose={() => setShowPreview(false)}
          onComplete={handleComplete}
        />
      )}

      {/* 同意模态框 */}
      <ConsentModal
        isOpen={showConsent}
        onClose={() => setShowConsent(false)}
        onConfirm={handleConsentConfirm}
        title="处方系统测试版声明"
        consentMessage="我已阅读并理解此处方系统为测试版本，所有处方和药物数据均为模拟，仅用于功能演示，不构成真实医疗建议或处方。继续使用表示您同意测试条款。"
        confirmText="我已阅读并同意"
        cancelText="取消"
        waitTime={3}
        redirectOnCancel={true}
      />
    </DoctorLayout>
  );
};

export default withAuth(CreatePrescriptionPage, { allowedRoles: ['doctor'] }); 