import React from 'react';
import { useRouter } from 'next/router';
import { 
  Home, 
  FileText, 
  History, 
  BookOpen,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 导航项目组件
 */
interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  href, 
  icon, 
  label, 
  active = false, 
  disabled = false 
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors",
        active 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
        disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
      {disabled && (
        <span className="ml-auto text-xs bg-muted-foreground/20 px-2 py-1 rounded">
          开发中
        </span>
      )}
    </button>
  );
};

/**
 * 医师导航组件属性
 */
interface DoctorNavProps {
  className?: string;
}

/**
 * 医师导航组件
 * 提供医师工作站的主要导航功能
 */
export const DoctorNav: React.FC<DoctorNavProps> = ({ className }) => {
  const router = useRouter();
  
  const navItems = [
    {
      href: '/doctor',
      icon: <Home size={20} />,
      label: '工作站首页',
      active: router.pathname === '/doctor',
      disabled: false
    },
    {
      href: '/prescription/create',
      icon: <FileText size={20} />,
      label: '开具处方',
      active: router.pathname === '/prescription/create',
      disabled: false
    },
    {
      href: '/doctor/history',
      icon: <History size={20} />,
      label: '处方历史',
      active: router.pathname === '/doctor/history',
      disabled: false // 即将实现
    },
    {
      href: '/doctor/templates',
      icon: <BookOpen size={20} />,
      label: '处方模板',
      active: router.pathname === '/doctor/templates',
      disabled: false // 即将实现
    },
    {
      href: '/doctor/settings',
      icon: <Settings size={20} />,
      label: '个人设置',
      active: router.pathname === '/doctor/settings',
      disabled: true // 暂未实现
    }
  ];
  
  return (
    <div className={cn("space-y-1", className)}>
      {navItems.map((item, index) => (
        <NavItem
          key={index}
          href={item.href}
          icon={item.icon}
          label={item.label}
          active={item.active}
          disabled={item.disabled}
        />
      ))}
    </div>
  );
}; 