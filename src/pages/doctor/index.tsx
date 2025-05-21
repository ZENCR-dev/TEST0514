import React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { withAuth } from '@/components/auth/withAuth';

function DoctorHomePage() {
  const { user } = useAuth();
  
  return (
    <MainLayout title="医生工作站 - 中医处方平台">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">医生工作站</h1>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">欢迎, {user?.name || '医生'}</h2>
          <p className="text-gray-600 mb-4">
            通过医生工作站，您可以开具中医处方，管理患者记录，以及查看处方历史。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/prescription/create">
              <Button>
                开具新处方
              </Button>
            </Link>
            
            <Link href="/doctor/patients">
              <Button variant="outline">
                患者管理
              </Button>
            </Link>
            
            <Link href="/doctor/prescriptions">
              <Button variant="outline">
                处方记录
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// 使用withAuth HOC包装组件，限制只有医生角色可以访问
export default withAuth(DoctorHomePage, { allowedRoles: ['doctor'] }); 