import React from 'react';
import { MainLayout } from './MainLayout';
import { DoctorNav } from '@/components/doctor/DoctorNav';
import { TestVersionBanner } from '@/components/common/TestVersionBanner';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';

/**
 * 医师布局组件属性
 */
interface DoctorLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBanner?: boolean;
}

/**
 * 医师专用布局组件
 * 封装了医师工作站的页面结构，包括侧边导航栏和特定样式
 */
export function DoctorLayout({ 
  children, 
  title = '医师工作站 - 中医处方平台',
  showBanner = true
}: DoctorLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <MainLayout title={title}>
      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
        {/* 侧边栏 - 移动设备下为顶部 */}
        <aside className="md:w-64 flex-shrink-0">
          <div className="bg-card p-4 rounded-lg shadow-sm border mb-4">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
              <div className="p-2 rounded-full bg-primary/10">
                <User size={24} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name || '医师'}</p>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                title="登出"
                onClick={() => logout()}
              >
                <LogOut size={18} className="text-muted-foreground" />
              </Button>
            </div>
            
            <DoctorNav />
          </div>
        </aside>
        
        {/* 主内容区域 */}
        <main className="flex-1">
          {showBanner && (
            <TestVersionBanner 
              language="cn" 
              className="mb-6" 
              iconType="warning"
              showDetails={true}
            />
          )}
          
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            {children}
          </div>
        </main>
      </div>
    </MainLayout>
  );
} 