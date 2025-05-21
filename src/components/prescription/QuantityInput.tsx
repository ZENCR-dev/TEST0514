import React, { useState, useRef, useEffect } from 'react';
import { Medicine } from '@/types/medicine';

interface QuantityInputProps {
  medicine: Medicine;
  onConfirm: (medicine: Medicine, quantity: number) => void;
  onCancel: () => void;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  medicine,
  onConfirm,
  onCancel
}) => {
  const [quantity, setQuantity] = useState<string>('15'); // 默认设置为15克
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动聚焦到输入框，使用setTimeout确保DOM完全渲染后再聚焦
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        // 选中所有文本方便用户直接输入
        inputRef.current.select();
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  // 处理数量输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // 只允许输入1-99的整数
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0 && parseInt(value) <= 99)) {
      setQuantity(value);
    }
  };

  // 处理确认
  const handleConfirm = () => {
    if (quantity && parseInt(quantity) > 0) {
      onConfirm(medicine, parseInt(quantity));
    }
  };

  // 处理回车键
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  // 快速设置常用数量
  const quickSetQuantity = (value: number) => {
    setQuantity(value.toString());
    // 选中输入框
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full">
        <h3 className="text-lg font-medium mb-4">
          设置 <span className="text-blue-600">{medicine.chineseName}</span> 的数量
        </h3>
        
        <div className="flex items-center mb-4">
          <div className="w-full">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              数量 (克)
            </label>
            <input
              ref={inputRef}
              id="quantity"
              type="number"
              min="1"
              max="99"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-center text-lg font-medium"
              value={quantity}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="输入数量"
              autoFocus
            />
          </div>
        </div>

        {/* 快速选择常用数量 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[10, 15, 20, 30].map((value) => (
            <button
              key={value}
              type="button"
              className={`py-1 px-3 rounded-full text-sm ${
                quantity === value.toString()
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => quickSetQuantity(value)}
            >
              {value}克
            </button>
          ))}
        </div>

        <div className="flex justify-between gap-4">
          <button
            type="button"
            className="flex-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onCancel}
          >
            取消
          </button>
          <button
            type="button"
            className="flex-1 bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleConfirm}
            disabled={!quantity}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}; 