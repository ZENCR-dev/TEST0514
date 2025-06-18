import React, { useEffect, useRef } from 'react';
import { PrescriptionItem } from '@/store/prescriptionStore';

interface MedicineListProps {
  items: PrescriptionItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  lastAddedItemId?: string;
}

export const MedicineList: React.FC<MedicineListProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  lastAddedItemId
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    if (items.length > 0 && tableContainerRef.current) {
      tableContainerRef.current.scrollTop = tableContainerRef.current.scrollHeight;
    }
  }, [items.length]);

  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>当前处方为空</p>
        <p className="text-sm">请搜索并添加药品</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg max-h-[680px] flex flex-col">
      <div className="overflow-y-auto" ref={tableContainerRef}>
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                药品名称
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                数量 (克)
              </th>
              <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                单价 (元/克)
              </th>
              <th scope="col" className="pl-3 pr-4 py-3.5 text-right text-sm font-semibold text-gray-900">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white" ref={tableBodyRef}>
            {items.map((item) => (
              <tr 
                key={item.id} 
                className={`${lastAddedItemId === item.id ? 'animate-highlight' : ''} h-[68px]`}
              >
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                  <div className="font-medium text-gray-900">{item.medicine.chineseName}</div>
                  <div className="text-gray-500">
                    {item.medicine.englishName} ({item.medicine.pinyinName})
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                  <div className="flex items-center justify-center">
                    <button
                      className="text-gray-500 hover:text-gray-700 border rounded-l p-1"
                      onClick={() => {
                        if (item.quantity > 1) {
                          onUpdateQuantity(item.id, item.quantity - 1);
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      className="w-12 p-1 border-t border-b text-center"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value > 0 && value <= 99) {
                          onUpdateQuantity(item.id, value);
                        }
                      }}
                    />
                    <button
                      className="text-gray-500 hover:text-gray-700 border rounded-r p-1"
                      onClick={() => {
                        if (item.quantity < 99) {
                          onUpdateQuantity(item.id, item.quantity + 1);
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                  {item.medicine.basePrice || (item.medicine as any).pricePerGram}
                </td>
                <td className="whitespace-nowrap pl-3 pr-4 py-4 text-sm text-right">
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    移除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 