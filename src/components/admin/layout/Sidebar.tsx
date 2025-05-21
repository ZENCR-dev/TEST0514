import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  PackageSearch,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 定义侧边栏项目
const sidebarItems = [
  {
    title: '仪表盘',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    title: '用户管理',
    href: '/admin/users',
    icon: Users
  },
  {
    title: '中药管理',
    href: '/admin/medicines',
    icon: PackageSearch,
    disabled: false  // 启用中药管理功能
  },
  {
    title: '处方记录',
    href: '/admin/prescriptions',
    icon: FileText,
    disabled: true  // 未实现的功能
  },
  {
    title: '系统日志',
    href: '/admin/logs',
    icon: History,
    disabled: true  // 未实现的功能
  },
  {
    title: '系统设置',
    href: '/admin/settings',
    icon: Settings,
    disabled: true  // 未实现的功能
  }
];

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div className={cn(
      "h-screen bg-slate-800 text-white flex flex-col transition-all duration-300",
      collapsed ? "w-[70px]" : "w-[240px]"
    )}>
      {/* 系统标志 */}
      <div className="flex items-center p-4 h-16 border-b border-slate-700">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold mr-3">
          TCM
        </div>
        {!collapsed && (
          <h1 className="text-lg font-bold whitespace-nowrap overflow-hidden">中医处方平台</h1>
        )}
      </div>

      {/* 导航项目 */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {sidebarItems.map((item) => {
            const isActive = currentPath === item.href || 
              (item.href !== '/admin' && currentPath.startsWith(item.href));
            
            return (
              <li key={item.href}>
                <Link
                  href={item.disabled ? '#' : item.href}
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md transition-colors",
                    isActive 
                      ? "bg-primary text-white font-medium" 
                      : "text-slate-300 hover:bg-slate-700",
                    item.disabled && "opacity-50 cursor-not-allowed",
                    collapsed && "justify-center"
                  )}
                  onClick={e => {
                    if (item.disabled) {
                      e.preventDefault();
                    }
                  }}
                >
                  <item.icon size={20} className={collapsed ? "mx-auto" : "mr-3"} />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 折叠按钮 */}
      {onToggleCollapse && (
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={onToggleCollapse}
            className="flex items-center justify-center w-full p-2 rounded-md hover:bg-slate-700 transition-colors"
          >
            {collapsed ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
} 