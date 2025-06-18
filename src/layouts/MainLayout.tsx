import React from 'react';
import Head from 'next/head';
import { Navbar } from '@/components/layout/Navbar';
import { EnvironmentSwitcher } from '@/components/common/EnvironmentSwitcher';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * 主布局组件
 * 封装了页面的主要结构，包括导航栏和页面标题
 */
export function MainLayout({ children, title = '中医处方平台' }: MainLayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-6 pb-12 px-4">
          {children}
        </main>
        
        <footer className="bg-muted py-4 text-center text-sm text-muted-foreground">
          <div className="container mx-auto">
            <p>© {new Date().getFullYear()} 中医处方平台</p>
          </div>
        </footer>
        
        {/* 联调环境切换器 */}
        <EnvironmentSwitcher />
      </div>
    </>
  );
} 