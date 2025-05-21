import React, { useState } from 'react';
import { DoctorRegisterData } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/common/FileUpload';
import { uploadFile } from '@/services/fileUploadService';

interface DoctorRegisterFormProps {
  onSubmit: (data: DoctorRegisterData) => Promise<void>;
  isLoading?: boolean;
}

export function DoctorRegisterForm({ onSubmit, isLoading = false }: DoctorRegisterFormProps) {
  const [formData, setFormData] = useState<DoctorRegisterData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    hpiNumber: '',
    apcCertificate: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileUploading, setFileUploading] = useState(false);

  // 处理表单输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 清除该字段的错误信息
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 处理文件选择
  const handleFileSelect = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      apcCertificate: file
    }));

    // 清除文件错误
    if (errors.apcCertificate) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.apcCertificate;
        return newErrors;
      });
    }
  };

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 验证姓名
    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    } else if (formData.name.length < 2 || formData.name.length > 30) {
      newErrors.name = '姓名必须在2-30个字符之间';
    }

    // 验证邮箱
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    // 验证密码
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 8) {
      newErrors.password = '密码长度必须至少为8个字符';
    }

    // 验证电话
    if (!formData.phone.trim()) {
      newErrors.phone = '请输入联系电话';
    } else if (!/^[+]?[\d\s-]{8,15}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的电话号码';
    }

    // 验证地址
    if (!formData.address.trim()) {
      newErrors.address = '请输入执业地址';
    } else if (formData.address.length > 200) {
      newErrors.address = '地址不能超过200个字符';
    }

    // 验证HPI编号
    if (!formData.hpiNumber.trim()) {
      newErrors.hpiNumber = '请输入HPI编号';
    } else if (!/^[A-Za-z0-9-]{5,20}$/.test(formData.hpiNumber)) {
      newErrors.hpiNumber = 'HPI编号格式不正确';
    }

    // 验证APC证书
    if (!formData.apcCertificate) {
      newErrors.apcCertificate = '请上传APC证书';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 表单提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setFileUploading(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('表单提交错误:', error);
      setErrors(prev => ({
        ...prev,
        form: (error as Error).message || '提交表单时发生错误'
      }));
    } finally {
      setFileUploading(false);
    }
  };

  const isSubmitDisabled = isLoading || fileUploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium">
          姓名 <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'border-red-500' : ''}
          placeholder="输入您的姓名"
          disabled={isSubmitDisabled}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">
          邮箱地址 <span className="text-red-500">*</span>
        </label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'border-red-500' : ''}
          placeholder="example@example.com"
          disabled={isSubmitDisabled}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">
          密码 <span className="text-red-500">*</span>
        </label>
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? 'border-red-500' : ''}
          placeholder="至少8个字符"
          disabled={isSubmitDisabled}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">
          HPI编号 <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          name="hpiNumber"
          value={formData.hpiNumber}
          onChange={handleChange}
          className={errors.hpiNumber ? 'border-red-500' : ''}
          placeholder="输入您的HPI编号"
          disabled={isSubmitDisabled}
        />
        {errors.hpiNumber && <p className="text-red-500 text-xs mt-1">{errors.hpiNumber}</p>}
        <p className="text-xs text-muted-foreground mt-1">
          HPI编号是医疗从业者在新西兰的唯一标识号码
        </p>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">
          联系电话 <span className="text-red-500">*</span>
        </label>
        <Input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={errors.phone ? 'border-red-500' : ''}
          placeholder="+64 XXXX XXXX"
          disabled={isSubmitDisabled}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">
          执业地址 <span className="text-red-500">*</span>
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`w-full min-h-[100px] p-2 rounded-md border ${
            errors.address ? 'border-red-500' : 'border-input'
          } bg-background`}
          placeholder="输入您的执业详细地址"
          disabled={isSubmitDisabled}
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
      </div>

      <div className="space-y-1">
        <FileUpload
          label="APC证书上传 *"
          onFileSelect={handleFileSelect}
          accept="image/jpeg,image/png,application/pdf"
          error={errors.apcCertificate}
          value={formData.apcCertificate}
          disabled={isSubmitDisabled}
        />
        <p className="text-xs text-muted-foreground mt-1">
          请上传您的年度执业证书(APC)，文件格式支持JPG、PNG或PDF
        </p>
      </div>

      {errors.form && (
        <div className="bg-red-50 p-3 rounded-md">
          <p className="text-red-500 text-sm">{errors.form}</p>
        </div>
      )}

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitDisabled}
        >
          {isSubmitDisabled ? '处理中...' : '提交申请'}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          提交注册申请后，管理员将审核您的资料，审核通过后您将收到通知邮件
        </p>
      </div>
    </form>
  );
} 