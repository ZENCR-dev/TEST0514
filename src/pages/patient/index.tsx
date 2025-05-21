import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { withAuth } from '@/components/auth/withAuth';

function PatientHomePage() {
  const { user } = useAuth();
  
  return (
    <MainLayout title="患者中心 - 中医处方平台">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">患者服务中心</h1>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">欢迎, {user?.name || '尊敬的患者'}</h2>
          <p className="text-gray-600">
            在这里，您可以查看您的处方记录，寻找合适的中医药房，以及管理您的个人健康信息。
          </p>
        </div>
      </div>
    </MainLayout>
  );
}

// 目前患者页面不限制特定角色，任何已登录用户都可访问
export default withAuth(PatientHomePage); 