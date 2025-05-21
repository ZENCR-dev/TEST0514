import React, { useState } from 'react';
import { PharmacyCreateData } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PharmacyFormProps {
  onSubmit: (data: PharmacyCreateData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PharmacyForm({ onSubmit, onCancel, isLoading = false }: PharmacyFormProps) {
  const [formData, setFormData] = useState<PharmacyCreateData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    status: 'active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 处理表单输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 验证药房名称
    if (!formData.name.trim()) {
      newErrors.name = '请输入药房名称';
    } else if (formData.name.length < 2 || formData.name.length > 50) {
      newErrors.name = '药房名称必须在2-50个字符之间';
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
      newErrors.address = '请输入药房地址';
    } else if (formData.address.length > 200) {
      newErrors.address = '地址不能超过200个字符';
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
      await onSubmit(formData);
    } catch (error) {
      console.error('表单提交错误:', error);
      setErrors(prev => ({
        ...prev,
        form: (error as Error).message || '提交表单时发生错误'
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium">
          药房名称 <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'border-red-500' : ''}
          placeholder="输入药房名称"
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
          disabled={isLoading}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">
          药房地址 <span className="text-red-500">*</span>
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`w-full min-h-[100px] p-2 rounded-md border ${
            errors.address ? 'border-red-500' : 'border-input'
          } bg-background`}
          placeholder="输入药房详细地址"
          disabled={isLoading}
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">
          账户状态 <span className="text-red-500">*</span>
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 rounded-md border border-input bg-background"
          disabled={isLoading}
        >
          <option value="active">活跃</option>
          <option value="inactive">非活跃</option>
        </select>
      </div>

      {errors.form && (
        <div className="bg-red-50 p-3 rounded-md">
          <p className="text-red-500 text-sm">{errors.form}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
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
        >
          {isLoading ? '创建中...' : '创建药房账户'}
        </Button>
      </div>
    </form>
  );
} 