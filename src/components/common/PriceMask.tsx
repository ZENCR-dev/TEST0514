import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface PriceMaskProps {
  price: number;
  className?: string;
  formatter?: (price: number) => string;
}

/**
 * 价格遮罩组件
 * 对未认证用户显示模糊处理的价格，登录用户显示实际价格
 */
export function PriceMask({ price, className, formatter }: PriceMaskProps) {
  const { isAuthenticated } = useAuth();
  
  const formatPrice = (price: number): string => {
    if (formatter) {
      return formatter(price);
    }
    return price.toString();
  };
  
  if (isAuthenticated) {
    return (
      <span className={className}>
        {formatPrice(price)}
      </span>
    );
  }
  
  return (
    <span className={cn(
      'select-none cursor-not-allowed filter blur-sm hover:blur-sm',
      className
    )}>
      {formatPrice(price)}
    </span>
  );
} 