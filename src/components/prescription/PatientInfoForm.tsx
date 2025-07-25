/**
 * 患者信息表单组件 - 医疗级UI/UX标准
 * 基于WCAG 2.2 AA级无障碍标准和医疗应用最佳实践
 * 
 * @version 1.0 - 医疗应用无障碍标准
 * @date 2025-01-15
 */

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  AlertCircle, 
  CheckCircle, 
  Calendar,
  Phone,
  MapPin,
  Shield
} from 'lucide-react';

// 患者信息类型定义 - 隐私合规
interface PatientInfo {
  // 基本信息 - 必填
  name: string;
  
  // 联系信息 - 可选
  phone?: string;
  emergencyContact?: string;
  
  // 医疗信息 - 可选
  allergies?: string;
  currentMedications?: string;
  symptoms?: string;
  diagnosis?: string;
  
  // 系统字段
  consentGiven: boolean;
}

interface PatientInfoFormProps {
  initialData?: Partial<PatientInfo>;
  onSubmit: (patientInfo: PatientInfo) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  errors?: string[];
}

export function PatientInfoForm({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  isLoading = false,
  errors = []
}: PatientInfoFormProps) {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    phone: '',
    emergencyContact: '',
    allergies: '',
    currentMedications: '',
    symptoms: '',
    diagnosis: '',
    consentGiven: false,
    ...initialData
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  // 字段更新处理器
  const handleFieldChange = useCallback((field: keyof PatientInfo, value: any) => {
    setPatientInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除相关验证错误
    if (validationErrors.length > 0) {
      setValidationErrors(prev => 
        prev.filter(error => !error.includes(getFieldDisplayName(field)))
      );
    }
  }, [validationErrors]);

  // 获取字段显示名称
  const getFieldDisplayName = (field: keyof PatientInfo): string => {
    const fieldNames: Record<keyof PatientInfo, string> = {
      name: '患者姓名',
      phone: '联系电话',
      emergencyContact: '紧急联系人',
      allergies: '过敏史',
      currentMedications: '当前用药',
      symptoms: '症状描述',
      diagnosis: '诊断信息',
      consentGiven: '隐私同意'
    };
    return fieldNames[field] || field;
  };

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    // 必填字段验证
    if (!patientInfo.name.trim()) {
      newErrors.push('患者姓名不能为空');
    } else if (patientInfo.name.trim().length < 2) {
      newErrors.push('患者姓名至少需要2个字符');
    }

    // 电话号码格式验证（如果填写）
    if (patientInfo.phone && !/^1[3-9]\d{9}$/.test(patientInfo.phone.replace(/[\s-]/g, ''))) {
      newErrors.push('请输入有效的手机号码');
    }

    // 隐私同意验证
    if (!patientInfo.consentGiven) {
      newErrors.push('必须同意隐私政策才能继续');
    }

    setValidationErrors(newErrors);
    return newErrors.length === 0;
  };

  // 提交处理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(patientInfo);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          患者信息
        </CardTitle>
        <p className="text-sm text-gray-600">
          请填写患者基本信息，所有信息将严格保密
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 错误提示 */}
          {(errors.length > 0 || validationErrors.length > 0) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {[...errors, ...validationErrors].map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* 基本信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              基本信息
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="required">
                  患者姓名 *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={patientInfo.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="请输入患者姓名"
                  required
                  aria-describedby="name-help"
                  className="focus:ring-2 focus:ring-blue-500"
                />
                <p id="name-help" className="text-xs text-gray-500">
                  请输入患者真实姓名，用于处方开具
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  联系电话
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={patientInfo.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder="请输入手机号码"
                  aria-describedby="phone-help"
                />
                <p id="phone-help" className="text-xs text-gray-500">
                  便于紧急情况联系（可选）
                </p>
              </div>
            </div>
          </div>

          {/* 高级选项切换 */}
          <div className="border-t pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAdvancedFields(!showAdvancedFields)}
              className="w-full justify-between"
            >
              <span>医疗信息（可选）</span>
              <span>{showAdvancedFields ? '收起' : '展开'}</span>
            </Button>
          </div>

          {/* 医疗信息 - 可折叠 */}
          {showAdvancedFields && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                医疗信息
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="symptoms">症状描述</Label>
                  <Textarea
                    id="symptoms"
                    name="symptoms"
                    value={patientInfo.symptoms}
                    onChange={(e) => handleFieldChange('symptoms', e.target.value)}
                    placeholder="请描述主要症状（可选）"
                    rows={3}
                    aria-describedby="symptoms-help"
                  />
                  <p id="symptoms-help" className="text-xs text-gray-500">
                    有助于医师更准确地开具处方
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">过敏史</Label>
                    <Textarea
                      id="allergies"
                      name="allergies"
                      value={patientInfo.allergies}
                      onChange={(e) => handleFieldChange('allergies', e.target.value)}
                      placeholder="请填写已知过敏史（可选）"
                      rows={2}
                      aria-describedby="allergies-help"
                    />
                    <p id="allergies-help" className="text-xs text-gray-500">
                      包括药物、食物等过敏史
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentMedications">当前用药</Label>
                    <Textarea
                      id="currentMedications"
                      name="currentMedications"
                      value={patientInfo.currentMedications}
                      onChange={(e) => handleFieldChange('currentMedications', e.target.value)}
                      placeholder="请填写正在使用的药物（可选）"
                      rows={2}
                      aria-describedby="medications-help"
                    />
                    <p id="medications-help" className="text-xs text-gray-500">
                      避免药物相互作用
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 隐私同意 */}
          <div className="border-t pt-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="consentGiven"
                checked={patientInfo.consentGiven}
                onChange={(e) => handleFieldChange('consentGiven', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                aria-describedby="consent-help"
                required
              />
              <div>
                <Label htmlFor="consentGiven" className="text-sm">
                  我同意按照隐私政策处理我的医疗信息 *
                </Label>
                <p id="consent-help" className="text-xs text-gray-500 mt-1">
                  您的信息将仅用于医疗目的，严格保密处理
                </p>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-between pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  处理中...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  确认信息
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// 样式扩展 - 医疗应用专用
const styles = `
  .required::after {
    content: ' *';
    color: #ef4444;
  }
  
  /* 高对比度模式支持 */
  @media (prefers-contrast: high) {
    .focus\\:ring-blue-500:focus {
      ring-color: #000000;
      ring-width: 3px;
    }
  }
  
  /* 减少动画模式支持 */
  @media (prefers-reduced-motion: reduce) {
    .animate-spin {
      animation: none;
    }
  }
`;

// 将样式注入到文档中
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}