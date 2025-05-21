import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { QrCode, ClipboardList, History, Settings, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  disabled?: boolean;
}

/**
 * 药房导航项组件
 */
const NavItem: React.FC<NavItemProps> = ({ href, icon, label, active, disabled }) => {
  const baseClasses = "flex items-center gap-2 px-4 py-3 rounded-md transition-all";
  const activeClasses = "bg-primary/10 text-primary font-medium";
  const inactiveClasses = "hover:bg-muted text-muted-foreground hover:text-foreground";
  const disabledClasses = "opacity-50 cursor-not-allowed";
  
  const content = (
    <div className={cn(
      baseClasses,
      active ? activeClasses : inactiveClasses,
      disabled && disabledClasses
    )}>
      {icon}
      <span>{label}</span>
    </div>
  );
  
  if (disabled) {
    return content;
  }
  
  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
};

interface PharmacyNavProps {
  className?: string;
}

/**
 * 药房导航组件
 * 提供药房模块的主要导航功能
 */
export const PharmacyNav: React.FC<PharmacyNavProps> = ({ className }) => {
  const router = useRouter();
  
  const navItems = [
    {
      href: '/pharmacy',
      icon: <Home size={20} />,
      label: '药房主页',
      active: router.pathname === '/pharmacy',
      disabled: false
    },
    {
      href: '/pharmacy/scan',
      icon: <QrCode size={20} />,
      label: '扫描处方',
      active: router.pathname === '/pharmacy/scan',
      disabled: false
    },
    {
      href: '/pharmacy/prescriptions',
      icon: <ClipboardList size={20} />,
      label: '处方查询',
      active: router.pathname === '/pharmacy/prescriptions',
      disabled: false
    },
    {
      href: '/pharmacy/history',
      icon: <History size={20} />,
      label: '处方历史',
      active: router.pathname === '/pharmacy/history',
      disabled: true
    },
    {
      href: '/pharmacy/settings',
      icon: <Settings size={20} />,
      label: '药房设置',
      active: router.pathname === '/pharmacy/settings',
      disabled: true
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

export default PharmacyNav; 