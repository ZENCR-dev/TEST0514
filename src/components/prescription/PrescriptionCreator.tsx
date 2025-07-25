/**
 * 处方创建组件 - DAY 3 Stage 2 核心业务逻辑
 * 基于后端混合架构的处方创建界面
 * 
 * @version 2.1 - Stage 2 Business Logic
 * @date 2025-01-21
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  User, 
  Plus, 
  Trash2, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  ShoppingCart,
  FileText,
  QrCode,
  Calculator
} from 'lucide-react';

import { 
  CreatePrescriptionData, 
  PrescriptionStatus,
  Prescription
} from '@/types/prescription';
import { Medicine } from '@/types/medicine';
import { useAuth } from '@/hooks/useAuth';
import { 
  createPrescription, 
  validatePrescriptionData, 
  calculatePrescriptionTotal,
  generatePrescriptionQRCode
} from '@/services/prescriptionService';
import { searchMedicinesEnhanced } from '@/services/medicineService';
import { MedicineSearch } from './MedicineSearch';
import { BalancePaymentModal } from '@/components/payment/BalancePaymentModal';

interface PrescriptionCreatorProps {
  onSuccess?: (prescription: Prescription) => void;
  onCancel?: () => void;
  initialData?: Partial<CreatePrescriptionData>;
  mode?: 'create' | 'edit';
}

export function PrescriptionCreator({ 
  onSuccess, 
  onCancel, 
  initialData,
  mode = 'create' 
}: PrescriptionCreatorProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'medicines' | 'details' | 'review' | 'payment'>('medicines');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showMedicineSearch, setShowMedicineSearch] = useState(false);
  const [createdPrescription, setCreatedPrescription] = useState<Prescription | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  // 处方数据状态 - API v3.3规范：隐私合规架构（患者信息已移除）
  const [prescriptionData, setPrescriptionData] = useState<CreatePrescriptionData>({
    doctorId: user?.id,
    // patientName 字段已移除 - API v3.3隐私合规
    medicines: [],
    notes: '',
    instructions: '',
    dosageInstructions: '',
    copies: 1, // 帖数
    doctorNotes: '',
    prescriptionFee: 10,
    priority: 'normal',
    ...initialData
  });

  // 计算总价
  const pricing = calculatePrescriptionTotal(prescriptionData.medicines);

  // 处理处方基本信息更新
  const handleBasicInfoChange = (field: keyof CreatePrescriptionData, value: any) => {
    setPrescriptionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理药品添加 - API v3.2标准字段
  const handleMedicineAdd = (medicine: Medicine, weight: number) => {
    const newMedicine = {
      // API v3.2必填字段
      medicineId: medicine.id,
      englishName: medicine.englishName || medicine.name,  // 英文名
      chineseName: medicine.chineseName,                   // 中文名
      pinyinName: medicine.pinyinName || '',               // 拼音名
      weight,                                              // 克重(quantity→weight)
      unit: medicine.unit || 'g',                         // 单位
      basePrice: medicine.basePrice, // 单价(unitPrice→basePrice)

      // 临时显示字段(兼容现有UI)
      dosageInstructions: '',                              // 剂量说明
      notes: ''                                           // 药品备注
    };

    setPrescriptionData(prev => ({
      ...prev,
      medicines: [...prev.medicines, newMedicine]
    }));
    setShowMedicineSearch(false);
  };

  // 处理药品删除
  const handleMedicineRemove = (index: number) => {
    setPrescriptionData(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }));
  };

  // 处理药品更新
  const handleMedicineUpdate = (index: number, field: string, value: any) => {
    setPrescriptionData(prev => ({
      ...prev,
      medicines: prev.medicines.map((medicine, i) => 
        i === index ? { ...medicine, [field]: value } : medicine
      )
    }));
  };

  // 验证当前步骤
  const validateCurrentStep = () => {
    const newErrors: string[] = [];

    switch (currentStep) {
      case 'medicines':
        if (prescriptionData.medicines.length === 0) {
          newErrors.push('至少需要添加一种药品');
        }
        prescriptionData.medicines.forEach((medicine, index) => {
          if (medicine.weight <= 0) {
            newErrors.push(`第${index + 1}种药品的克重必须大于0`);
          }
        });
        break;
      case 'details':
        if (!prescriptionData.instructions?.trim() && !prescriptionData.notes?.trim()) {
          newErrors.push('处方说明或备注不能为空');
        }
        if (!prescriptionData.copies || prescriptionData.copies <= 0) {
          newErrors.push('帖数必须大于0');
        }
        break;
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // 下一步
  const handleNextStep = () => {
    if (!validateCurrentStep()) return;

    const steps = ['medicines', 'details', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1] as any);
    }
  };

  // 上一步
  const handlePrevStep = () => {
    const steps = ['medicines', 'details', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1] as any);
    }
  };

  // 提交处方
  const handleSubmit = async () => {
    const validation = validatePrescriptionData(prescriptionData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      const newPrescription = await createPrescription(prescriptionData);
      setCreatedPrescription(newPrescription as any);
      setCurrentStep('payment');
    } catch (error) {
      setErrors([error instanceof Error ? error.message : '创建处方失败']);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理支付成功
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    if (createdPrescription) {
      onSuccess?.(createdPrescription);
    }
  };

  // 处理支付取消
  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    // 回到review步骤，允许用户重新尝试支付
    setCurrentStep('review');
  };

  // 渲染药品选择步骤
  const renderMedicinesStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          药品选择
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            已选择 {prescriptionData.medicines.length} 种药品
          </p>
          <Dialog open={showMedicineSearch} onOpenChange={setShowMedicineSearch}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-8 px-3 text-sm">
                <Plus className="w-4 h-4 mr-2" />
                添加药品
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>选择药品</DialogTitle>
              </DialogHeader>
              <MedicineSearch
                onSelectMedicine={(medicine) => handleMedicineAdd(medicine, 15)} // 默认15g
              />
            </DialogContent>
          </Dialog>
        </div>

        {prescriptionData.medicines.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂未选择药品</p>
            <p className="text-sm">点击&quot;添加药品&quot;开始选择</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prescriptionData.medicines.map((medicine, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{medicine.chineseName || medicine.englishName}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-2 mt-2">
                      <div>
                        <Label className="text-xs">克重</Label>
                        <Input
                          type="number"
                          value={medicine.weight}
                          onChange={(e) => handleMedicineUpdate(index, 'weight', parseFloat(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => handleMedicineRemove(index)}
                    className="text-red-500 hover:text-red-700 h-8 w-8 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // 渲染处方详情步骤
  const renderDetailsStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          处方详情
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="instructions">用法用量说明 *</Label>
          <Textarea
            id="instructions"
            value={prescriptionData.instructions}
            onChange={(e) => setPrescriptionData(prev => ({ ...prev, instructions: e.target.value }))}
            placeholder="请输入详细的用法用量说明"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="dosageInstructions">服用方法</Label>
          <Textarea
            id="dosageInstructions"
            value={prescriptionData.dosageInstructions || ''}
            onChange={(e) => setPrescriptionData(prev => ({ ...prev, dosageInstructions: e.target.value }))}
            placeholder="如：水煎服，每日一剂，分早晚两次温服"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="copies">帖数 *</Label>
            <Input
              id="copies"
              type="number"
              value={prescriptionData.copies}
              onChange={(e) => setPrescriptionData(prev => ({ ...prev, copies: parseInt(e.target.value) || 1 }))}
              min="1"
            />
          </div>
          <div>
            <Label htmlFor="priority">优先级</Label>
            <Select 
              value={prescriptionData.priority || 'normal'} 
              onValueChange={(value) => setPrescriptionData(prev => ({ ...prev, priority: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">低</SelectItem>
                <SelectItem value="normal">普通</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="urgent">紧急</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="prescriptionFee">处方费 (元)</Label>
            <Input
              id="prescriptionFee"
              type="number"
              value={prescriptionData.prescriptionFee || 10}
              onChange={(e) => setPrescriptionData(prev => ({ ...prev, prescriptionFee: parseFloat(e.target.value) || 10 }))}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="doctorNotes">医师备注</Label>
          <Textarea
            id="doctorNotes"
            value={prescriptionData.doctorNotes || ''}
            onChange={(e) => setPrescriptionData(prev => ({ ...prev, doctorNotes: e.target.value }))}
            placeholder="医师备注信息"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );

  // 渲染确认步骤
  const renderReviewStep = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            处方确认
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">处方信息</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">药品数量：</span>{prescriptionData.medicines.length}种</p>
              <p><span className="font-medium">帖数：</span>{prescriptionData.copies}帖</p>
              <p><span className="font-medium">优先级：</span>{prescriptionData.priority}</p>
              <p><span className="font-medium">处方费：</span>¥{prescriptionData.prescriptionFee}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">药品清单</h4>
            <div className="space-y-2">
              {prescriptionData.medicines.map((medicine, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{medicine.chineseName || medicine.englishName}</span>
                  <Badge variant="outline">{medicine.weight}g</Badge>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">用法用量</h4>
            <p className="text-sm text-gray-600">{prescriptionData.instructions}</p>
          </div>

          <Separator />

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">费用明细</h4>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>药品费用：</span>
                <span>¥{pricing.medicinesTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>处方费：</span>
                <span>¥{pricing.prescriptionFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>总计：</span>
                <span>¥{pricing.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // 渲染支付步骤
  const renderPaymentStep = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            支付处方费用
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {createdPrescription ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-medium mb-2">处方创建成功！</h3>
              <p className="text-gray-600 mb-4">
                处方编号：{createdPrescription.id || 'RX-' + Date.now()}
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">应付金额：</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ¥{pricing.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
              <Button 
                onClick={() => setShowPaymentModal(true)}
                className="w-full"
                size="lg"
              >
                立即支付
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                支付完成后，处方将生成二维码供药房扫描
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <p className="text-red-600">处方创建失败，请返回重试</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6" data-testid="prescription-creator-form" role="form" aria-label="处方创建表单">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {mode === 'create' ? '创建处方' : '编辑处方'}
        </h1>
        <p className="text-gray-600">为患者创建中医处方</p>
      </div>

      {/* 步骤指示器 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {[
            { key: 'medicines', label: '药品选择', icon: ShoppingCart },
            { key: 'details', label: '处方详情', icon: FileText },
            { key: 'review', label: '确认提交', icon: CheckCircle },
            { key: 'payment', label: '支付费用', icon: Calculator }
          ].map(({ key, label, icon: Icon }, index) => (
            <div key={key} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 
                ${currentStep === key 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-400'
                }
              `}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="ml-2 hidden md:block">
                <p className={`text-sm font-medium ${
                  currentStep === key ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {label}
                </p>
              </div>
              {index < 3 && (
                <div className={`
                  w-16 h-0.5 mx-4 
                  ${['medicines', 'details', 'review'].indexOf(currentStep) > index 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300'
                  }
                `} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 错误提示 */}
      {errors.length > 0 && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* 步骤内容 */}
      <div className="mb-6">
        {currentStep === 'medicines' && renderMedicinesStep()}
        {currentStep === 'details' && renderDetailsStep()}
        {currentStep === 'review' && renderReviewStep()}
        {currentStep === 'payment' && renderPaymentStep()}
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-between">
        <div>
          {currentStep !== 'medicines' && currentStep !== 'payment' && (
            <Button variant="outline" onClick={handlePrevStep}>
              上一步
            </Button>
          )}
          {currentStep === 'payment' && (
            <Button variant="outline" onClick={() => setCurrentStep('review')}>
              返回确认
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {currentStep !== 'payment' ? (
            <>
              <Button variant="outline" onClick={onCancel}>
                取消
              </Button>
              {currentStep !== 'review' ? (
                <Button onClick={handleNextStep}>
                  下一步
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      创建中...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      创建处方
                    </>
                  )}
                </Button>
              )}
            </>
          ) : (
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={showPaymentModal}
            >
              稍后支付
            </Button>
          )}
        </div>
      </div>

      {/* 支付弹窗 */}
      {createdPrescription && (
        <BalancePaymentModal
          isOpen={showPaymentModal}
          onClose={handlePaymentCancel}
          prescriptionId={createdPrescription.id}
          amount={pricing.totalAmount}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
} 