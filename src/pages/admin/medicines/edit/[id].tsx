/**
 * 编辑中药页面
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { MedicineForm } from '@/components/admin/medicines/MedicineForm';
import { getMedicineById, updateMedicine } from '@/services/medicineService';
import { Medicine } from '@/types/medicine';

export default function EditMedicinePage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取中药详情
  const loadMedicine = useCallback(async (medicineId: string) => {
    setIsLoading(true);
    try {
      const data = await getMedicineById(medicineId);
      if (data) {
        setMedicine(data);
      } else {
        setError('未找到该中药');
        router.push('/admin/medicines');
      }
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setIsLoading(false);
    }
  }, [router, setIsLoading, setMedicine, setError]);

  // 加载中药数据
  useEffect(() => {
    if (id) {
      loadMedicine(id as string);
    }
  }, [id, loadMedicine]);

  // 处理表单提交
  const handleSubmit = async (data: any) => {
    if (!medicine) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      await updateMedicine(medicine.id, data);
      // 更新成功后返回列表页面
      router.push('/admin/medicines');
    } catch (err: any) {
      setError(err.message || '更新失败，请稍后重试');
      setIsSubmitting(false);
    }
  };

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">加载中...</p>
      </div>
    );
  }

  // 错误状态
  if (error && !medicine) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
        </div>
        <div className="mt-4">
          <Button onClick={() => router.push('/admin/medicines')}>
            返回列表
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">编辑中药 - {medicine?.chineseName}</h1>
        <Button variant="outline" onClick={() => router.back()}>
          返回
        </Button>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm">
        {medicine && (
          <MedicineForm
            initialData={medicine}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error || undefined}
          />
        )}
      </div>
    </div>
  );
} 