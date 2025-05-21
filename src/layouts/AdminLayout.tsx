import React, { useState } from 'react';
import Head from 'next/head';
import { Sidebar } from '@/components/admin/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * 管理员布局组件
 * 包含左侧可折叠导航栏和右侧内容区域
 */
export function AdminLayout({ children, title = '管理控制台 - 中医处方平台' }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="flex h-screen bg-background">
        {/* 侧边栏 */}
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggleCollapse={toggleSidebar} 
        />
        
        {/* 主内容区域 */}
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          sidebarCollapsed ? "ml-[70px]" : "ml-[240px]"
        )}>
          {/* 顶部栏 */}
          <header className="h-16 border-b bg-card flex items-center justify-between px-6">
            <h1 className="text-xl font-medium">{title}</h1>
            
            {user && (
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-2">
                  {user.name}
                </span>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  {user.name.charAt(0)}
                </div>
              </div>
            )}
          </header>
          
          {/* 内容区域 */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
          
          {/* 页脚 */}
          <footer className="border-t py-3 px-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} 中医处方平台管理系统</p>
          </footer>
        </div>
      </div>
    </>
  );
} 