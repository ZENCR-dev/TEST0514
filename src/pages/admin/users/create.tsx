import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AdminLayout } from '@/layouts/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { PharmacyForm } from '@/components/admin/users/PharmacyForm';
import { createPharmacyAccount } from '@/services/admin/userService';
import { PharmacyCreateData } from '@/types/admin';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CreateUserPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 验证用户是否有权限访问管理员界面
  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      router.replace('/');
    }
  }, [isAuthenticated, user, router]);

  // 处理药房账户表单提交
  const handlePharmacySubmit = async (data: PharmacyCreateData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await createPharmacyAccount(data);
      setSubmitSuccess(true);

      // 3秒后重定向回用户列表页面
      setTimeout(() => {
        router.push('/admin/users');
      }, 3000);
    } catch (err) {
      setError((err as Error).message || '创建药房账户失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理取消操作
  const handleCancel = () => {
    router.push('/admin/users');
  };

  return (
    <AdminLayout title="创建药房账户">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/users')}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            返回用户列表
          </button>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-2">创建药房账户</h1>
          <p className="text-muted-foreground mb-6">添加新的药房账户到系统中</p>

          {submitSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
                <h3 className="text-green-900 font-medium">账户创建成功</h3>
              </div>
              <p className="text-green-700 mt-2">药房账户已成功创建。3秒后将返回用户列表页面。</p>
              <div className="mt-4">
                <Button 
                  onClick={() => router.push('/admin/users')} 
                  size="sm"
                >
                  立即返回
                </Button>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="text-red-500 mr-2 h-5 w-5" />
                    <h3 className="text-red-900 font-medium">创建失败</h3>
                  </div>
                  <p className="text-red-700 mt-2">{error}</p>
                </div>
              )}

              <PharmacyForm 
                onSubmit={handlePharmacySubmit}
                onCancel={handleCancel}
                isLoading={isSubmitting}
              />
            </>
          )}
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <h3 className="font-medium mb-2">注意事项：</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>创建的药房账户将立即能够登录系统</li>
            <li>请确保提供有效的电子邮件地址，系统将发送登录凭据到该邮箱</li>
            <li>药房状态可以在创建后通过用户管理页面随时更改</li>
            <li>密码应当包含字母、数字和特殊字符以确保安全性</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
} 