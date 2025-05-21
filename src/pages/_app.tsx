import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export default function App({ Component, pageProps }: AppProps) {
  const { checkAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check authentication status on app load
    checkAuth();
    setMounted(true);
  }, [checkAuth]);

  // 在服务器端渲染期间不挂载错误边界
  if (!mounted && typeof window === 'undefined') {
    return <Component {...pageProps} />;
  }

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
} 