import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { withAuth } from '@/components/auth/withAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ProtectedPage() {
  return (
    <MainLayout title="受保护页面">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6">
          <h2 className="text-xl font-bold">认证成功！</h2>
          <p className="mt-2">你已成功访问受保护的页面</p>
        </div>
        
        <p className="mb-6">
          这个页面使用了 withAuth 高阶组件进行保护，只有登录后才能访问。如果用户未登录，将被重定向到首页。
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

// 使用withAuth HOC包装组件，确保只有认证用户可以访问
export default withAuth(ProtectedPage); 