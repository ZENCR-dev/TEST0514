import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';

// 仅在开发模式下导入 stagewise
let StagewiseToolbar: any = null;
if (process.env.NODE_ENV === 'development') {
  try {
    const { StagewiseToolbar: Toolbar } = require('@stagewise/toolbar-next');
    StagewiseToolbar = Toolbar;
  } catch (error) {
    console.warn('Stagewise toolbar not available:', error);
  }
}

// Stagewise 配置
const stagewiseConfig = {
  plugins: []
};

export default function App({ Component, pageProps }: AppProps) {
  const { checkAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check authentication status on app load
    checkAuth();
    setMounted(true);
  }, [checkAuth]);

  // 在服务器端渲染期间不挂载，避免水合错误
  if (!mounted) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
      <Toaster />
      {/* 仅在开发模式下渲染 stagewise 工具栏 */}
      {process.env.NODE_ENV === 'development' && StagewiseToolbar && (
        <StagewiseToolbar config={stagewiseConfig} />
      )}
    </ErrorBoundary>
  );
} 