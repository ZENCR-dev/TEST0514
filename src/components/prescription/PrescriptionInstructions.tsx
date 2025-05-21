import React from 'react';
import { cn } from '@/lib/utils';

interface PrescriptionInstructionsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function PrescriptionInstructions({
  value,
  onChange,
  placeholder = "水煎服，每次1剂，每日1次，服用200ml"
}: PrescriptionInstructionsProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      // 如果输入框为空，并且按下了Tab键，则填充placeholder内容
      if (!value && placeholder) {
        e.preventDefault();
        onChange(placeholder);
      }
      // 如果输入框非空，Tab键则执行默认行为（通常是切换焦点）
      // 如果需要阻止Tab键在任何情况下切换焦点，可以在这里 e.preventDefault()
      // 但通常情况下，如果输入框有内容，用户可能期望Tab键切换到下一个元素
    }
  };

  return (
    <div className="relative mb-4 mt-4">
      <div className="flex justify-between items-center mb-1">
        <label htmlFor="prescription-instructions" className="block text-sm font-medium text-gray-700">用法/医嘱</label>
      </div>
      
      <div className="relative">
        <textarea
          id="prescription-instructions"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full min-h-[80px] p-3 bg-white text-gray-900 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
            // 使用CSS的placeholder选择器来定义placeholder文本颜色，而不是动态类
            // 例如：在全局CSS中添加 textarea::placeholder { color: #9ca3af; /* gray-500 */ }
          )}
          rows={3} // 建议设定一个初始行数
        />
      </div>
      
      <p className="mt-1 text-xs text-gray-500">
        提示: 输入框为空时，按Tab键可以快速填充默认文本
      </p>
    </div>
  );
} 