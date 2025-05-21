/**
 * 中药表单组件
 */
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Medicine, MedicineCategory, MedicineProperty } from '@/types/medicine';

// 表单验证模式
const medicineSchema = z.object({
  chineseName: z.string().min(1, '中文名是必填项'),
  englishName: z.string().min(1, '英文名是必填项'),
  pinyinName: z.string().min(1, '拼音名是必填项'),
  pricePerGram: z.coerce.number().min(0.01, '价格必须大于0'),
  stock: z.coerce.number().min(0, '库存不能为负数'),
  description: z.string().optional(),
  properties: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().default(true),
  imageUrl: z.string().optional(),
});

// 表单数据类型
type MedicineFormData = z.infer<typeof medicineSchema>;

interface MedicineFormProps {
  initialData?: Medicine;
  onSubmit: (data: MedicineFormData) => void;
  isSubmitting: boolean;
  error?: string;
}

export function MedicineForm({ 
  initialData, 
  onSubmit, 
  isSubmitting,
  error
}: MedicineFormProps) {
  // 使用react-hook-form管理表单状态
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<MedicineFormData>({
    resolver: zodResolver(medicineSchema),
    defaultValues: initialData || {
      chineseName: '',
      englishName: '',
      pinyinName: '',
      pricePerGram: 0,
      stock: 0,
      description: '',
      properties: '平',
      category: MedicineCategory.OTHER,
      isActive: true,
      imageUrl: '',
    }
  });

  // 提交表单
  const onFormSubmit = (data: MedicineFormData) => {
    onSubmit(data);
  };

  // 重置表单
  const handleReset = () => {
    reset(initialData || {
      chineseName: '',
      englishName: '',
      pinyinName: '',
      pricePerGram: 0,
      stock: 0,
      description: '',
      properties: '平',
      category: MedicineCategory.OTHER,
      isActive: true,
      imageUrl: '',
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <p>{error}</p>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 中文名 */}
        <div>
          <Label htmlFor="chineseName">中文名 <span className="text-red-500">*</span></Label>
          <Input
            id="chineseName"
            {...register('chineseName')}
            className={errors.chineseName ? 'border-red-500' : ''}
          />
          {errors.chineseName && (
            <p className="text-red-500 text-sm mt-1">{errors.chineseName.message}</p>
          )}
        </div>

        {/* 英文名 */}
        <div>
          <Label htmlFor="englishName">英文名 <span className="text-red-500">*</span></Label>
          <Input
            id="englishName"
            {...register('englishName')}
            className={errors.englishName ? 'border-red-500' : ''}
          />
          {errors.englishName && (
            <p className="text-red-500 text-sm mt-1">{errors.englishName.message}</p>
          )}
        </div>

        {/* 拼音名 */}
        <div>
          <Label htmlFor="pinyinName">拼音名 <span className="text-red-500">*</span></Label>
          <Input
            id="pinyinName"
            {...register('pinyinName')}
            className={errors.pinyinName ? 'border-red-500' : ''}
          />
          {errors.pinyinName && (
            <p className="text-red-500 text-sm mt-1">{errors.pinyinName.message}</p>
          )}
        </div>

        {/* 价格 */}
        <div>
          <Label htmlFor="pricePerGram">单价(元/克) <span className="text-red-500">*</span></Label>
          <Input
            id="pricePerGram"
            type="number"
            step="0.01"
            {...register('pricePerGram')}
            className={errors.pricePerGram ? 'border-red-500' : ''}
          />
          {errors.pricePerGram && (
            <p className="text-red-500 text-sm mt-1">{errors.pricePerGram.message}</p>
          )}
        </div>

        {/* 库存 */}
        <div>
          <Label htmlFor="stock">库存(克) <span className="text-red-500">*</span></Label>
          <Input
            id="stock"
            type="number"
            {...register('stock')}
            className={errors.stock ? 'border-red-500' : ''}
          />
          {errors.stock && (
            <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
          )}
        </div>

        {/* 药性 */}
        <div>
          <Label htmlFor="properties">药性</Label>
          <select
            id="properties"
            {...register('properties')}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            {Object.values(MedicineProperty).map((property) => (
              <option key={property} value={property}>
                {property}
              </option>
            ))}
          </select>
        </div>

        {/* 分类 */}
        <div>
          <Label htmlFor="category">分类</Label>
          <select
            id="category"
            {...register('category')}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            {Object.values(MedicineCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* 状态 */}
        <div className="flex items-center">
          <input
            id="isActive"
            type="checkbox"
            {...register('isActive')}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <Label htmlFor="isActive" className="ml-2">已启用</Label>
        </div>

        {/* 图片URL */}
        <div>
          <Label htmlFor="imageUrl">图片URL</Label>
          <Input
            id="imageUrl"
            {...register('imageUrl')}
          />
        </div>
      </div>

      {/* 描述 */}
      <div>
        <Label htmlFor="description">描述</Label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
        ></textarea>
      </div>

      {/* 提交按钮 */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isSubmitting}
        >
          重置
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '保存中...' : '保存'}
        </Button>
      </div>
    </form>
  );
} 