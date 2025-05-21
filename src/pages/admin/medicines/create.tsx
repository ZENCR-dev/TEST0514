/**
 * 新增中药页面
 */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { MedicineForm } from '@/components/admin/medicines/MedicineForm';
import { createMedicine } from '@/services/medicineService';

export default function CreateMedicinePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 处理表单提交
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await createMedicine(data);
      // 创建成功后返回列表页面
      router.push('/admin/medicines');
    } catch (err: any) {
      setError(err.message || '创建失败，请稍后重试');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">新增中药</h1>
        <Button variant="outline" onClick={() => router.back()}>
          返回
        </Button>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm">
        <MedicineForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error || undefined}
        />
      </div>
    </div>
  );
} 