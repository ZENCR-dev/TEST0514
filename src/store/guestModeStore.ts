/**
 * Guest模式状态管理Store
 * MVP1.9 Guest Mode State Management
 * 
 * 功能：
 * - Guest模式开关控制
 * - 路由权限检查
 * - 临时处方数据管理
 * - 多语言状态管理
 * - 首页重定向逻辑
 */

import { create } from 'zustand';
import { GuestModeState, LanguageState, LocalPrescription, Translations } from '../types/guest';

export const useGuestModeStore = create<GuestModeState>((set, get) => ({
  isGuestMode: true, // 默认Guest模式
  allowedRoutes: [
    '/prescription/create', // 默认首页
    '/auth/*', 
    '/register/*'
  ],
  tempPrescriptions: [],
  sessionStartTime: Date.now(),
  language: 'zh', // 默认中文
  
  enableGuestMode: () => set({ isGuestMode: true }),
  disableGuestMode: () => set({ isGuestMode: false }),
  
  addTempPrescription: (prescription) => 
    set(state => ({
      tempPrescriptions: [...state.tempPrescriptions, prescription]
    })),
    
  clearTempData: () => set({ tempPrescriptions: [] }),
  
  isRouteAllowed: (path) => {
    const { allowedRoutes, isGuestMode } = get();
    if (!isGuestMode) return true;
    if (!path) return false; // 处理undefined和空字符串
    
    return allowedRoutes.some(route => 
      route.endsWith('*') 
        ? path.startsWith(route.slice(0, -1))
        : path === route
    );
  },
  
  shouldRedirectToHome: () => {
    const { isGuestMode } = get();
    return isGuestMode;
  },
  
  setLanguage: (lang) => set({ language: lang })
}));

// 多语言文本配置
const translations: Translations = {
  zh: {
    'prescription.create': '创建处方',
    'medicine.search': '搜索药品',
    'medicine.name': '药品名称',
    'medicine.weight': '用量',
    'prescription.copies': '帖数',
    'prescription.notes': '备注',
    'prescription.total': '总价',
    'button.save': '保存',
    'button.export': '导出',
    'button.print': '打印',
    'button.clear': '清空',
    'demo.mode': '演示模式',
    'demo.price': '演示价格'
  },
  en: {
    'prescription.create': 'Create Prescription',
    'medicine.search': 'Search Medicine',
    'medicine.name': 'Medicine Name',
    'medicine.weight': 'Weight',
    'prescription.copies': 'Copies',
    'prescription.notes': 'Notes',
    'prescription.total': 'Total',
    'button.save': 'Save',
    'button.export': 'Export',
    'button.print': 'Print',
    'button.clear': 'Clear',
    'demo.mode': 'Demo Mode',
    'demo.price': 'Demo Price'
  }
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  currentLanguage: 'zh',
  
  switchLanguage: (lang) => set({ currentLanguage: lang }),
  
  getText: (key) => {
    const { currentLanguage } = get();
    return translations[currentLanguage][key as keyof typeof translations['zh']] || key;
  }
}));