import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { withAuth } from '@/components/auth/withAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function DoctorOnlyPage() {
  return (
    <MainLayout title="医生专用页面">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-blue-100 text-blue-800 p-4 rounded-md mb-6">
          <h2 className="text-xl font-bold">医生专用!</h2>
          <p className="mt-2">这个页面只有医生角色可以访问</p>
        </div>
        
        <p className="mb-6">
          此页面使用了 withAuth 高阶组件，并设置了角色限制为 &apos;doctor&apos;。
          其他角色的用户即使已登录，也会被重定向到首页。
        </p>
        
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/auth-test">返回测试页面</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}

// 使用withAuth HOC包装组件，并限制只有医生角色可以访问
export default withAuth(DoctorOnlyPage, { allowedRoles: ['doctor'] }); 