import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FunctionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  className?: string;
  disabled?: boolean;
}

export const FunctionCard: React.FC<FunctionCardProps> = ({
  title,
  description,
  icon: Icon,
  href,
  className,
  disabled = false
}) => {
  const cardContent = (
    <div 
      className={cn(
        "p-6 flex flex-col items-center text-center bg-white border rounded-lg shadow-sm transition-all duration-200",
        disabled ? "opacity-60 cursor-not-allowed bg-gray-50" : "hover:shadow-md hover:border-primary/50",
        className
      )}
    >
      <div className="p-3 mb-4 rounded-full bg-primary/10 text-primary">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );

  if (disabled) {
    return cardContent;
  }

  return (
    <Link href={href} className="block">
      {cardContent}
    </Link>
  );
};

export default FunctionCard; 