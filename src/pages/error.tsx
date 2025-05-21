'use client';

import { useEffect } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 记录错误到错误报告服务
    console.error('页面错误:', error);
  }, [error]);

  return (
    <MainLayout title="出错了">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h1 className="text-2xl font-bold mb-4">出错了</h1>
        <p className="mb-6 text-muted-foreground max-w-md">
          很抱歉，页面加载时发生了错误。您可以尝试刷新页面或返回首页。
        </p>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
          >
            返回首页
          </Button>
          <Button onClick={reset}>
            重试
          </Button>
        </div>
      </div>
    </MainLayout>
  );
} 