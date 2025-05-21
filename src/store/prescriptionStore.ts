/**
 * 处方状态管理Store
 */
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Medicine } from '@/types/medicine';

export interface PrescriptionItem {
  id: string;
  medicine: Medicine;
  quantity: number;
}

export interface PrescriptionState {
  items: PrescriptionItem[];
  copies: number; // 处方帖数
  
  // 添加药品到处方，返回新添加或更新的药品ID
  addItem: (medicine: Medicine, quantity: number) => string;
  
  // 更新药品数量
  updateItemQuantity: (itemId: string, quantity: number) => void;
  
  // 移除药品
  removeItem: (itemId: string) => void;
  
  // 设置处方帖数
  setCopies: (copies: number) => void;
  
  // 清空处方
  clearPrescription: () => void;
}

export const usePrescriptionStore = create<PrescriptionState>((set, get) => ({
  items: [],
  copies: 1,
  
  addItem: (medicine, quantity) => {
    let updatedItemId = '';
    
    set((state) => {
      // 检查药品是否已在处方中
      const existingItemIndex = state.items.findIndex(
        item => item.medicine.id === medicine.id
      );
      
      if (existingItemIndex >= 0) {
        // 如果药品已存在，更新数量
        const newItems = [...state.items];
        updatedItemId = newItems[existingItemIndex].id;
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
        return { items: newItems };
      } else {
        // 添加新药品
        updatedItemId = uuidv4();
        return {
          items: [
            ...state.items,
            {
              id: updatedItemId,
              medicine,
              quantity
            }
          ]
        };
      }
    });
    
    return updatedItemId;
  },
  
  updateItemQuantity: (itemId, quantity) =>
    set((state) => ({
      items: state.items.map(item => 
        item.id === itemId
          ? { ...item, quantity }
          : item
      )
    })),
  
  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter(item => item.id !== itemId)
    })),
  
  setCopies: (copies) =>
    set({ copies }),
  
  clearPrescription: () =>
    set({ items: [], copies: 1 })
})); 