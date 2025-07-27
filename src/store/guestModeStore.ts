import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 类型定义
export interface PatientInfo {
  name: string;
  age: number;
}

export interface TempPrescription {
  id: string;
  medicines: unknown[];
  patientInfo: PatientInfo;
  createdAt: string;
}

export type Language = 'zh' | 'en';

export type TranslationKey = 'welcome' | 'prescription' | 'guest_mode' | 'create_prescription';

export interface GuestModeState {
  // Guest模式状态
  isGuestMode: boolean;
  allowedRoutes: readonly string[];
  tempPrescriptionData: TempPrescription[];
  
  // 多语言状态
  language: Language;
  
  // Actions
  enableGuestMode: () => void;
  disableGuestMode: () => void;
  isRouteAllowed: (route: string) => boolean;
  addTempPrescription: (prescription: TempPrescription) => void;
  clearTempData: () => void;
  setLanguage: (lang: Language) => void;
  getTranslation: (key: TranslationKey) => string;
}

// 翻译数据
const translations: Record<Language, Record<TranslationKey, string>> = {
  zh: {
    welcome: '欢迎',
    prescription: '处方',
    guest_mode: '访客模式',
    create_prescription: '创建处方',
  },
  en: {
    welcome: 'Welcome',
    prescription: 'Prescription',
    guest_mode: 'Guest Mode',
    create_prescription: 'Create Prescription',
  },
} as const;

// Guest模式允许的路由
const GUEST_ALLOWED_ROUTES = [
  '/',
  '/prescription/create',
] as const;

export const useGuestModeStore = create<GuestModeState>()(
  persist(
    (set, get) => ({
      // 初始状态 - MVP1.9 Guest模式默认启用
      isGuestMode: true,
      allowedRoutes: GUEST_ALLOWED_ROUTES,
      tempPrescriptionData: [],
      language: 'zh',

      // Guest模式控制
      enableGuestMode: () => {
        set({
          isGuestMode: true,
          allowedRoutes: GUEST_ALLOWED_ROUTES,
        });
      },

      disableGuestMode: () => {
        set({
          isGuestMode: false,
          allowedRoutes: ['/'], // 关闭Guest模式时恢复到仅首页
        });
      },

      // 路由权限检查
      isRouteAllowed: (route: string) => {
        const { isGuestMode, allowedRoutes } = get();
        
        if (!isGuestMode) {
          return true; // 非Guest模式允许所有路由
        }
        
        return allowedRoutes.some(allowedRoute => 
          route === allowedRoute || route.startsWith(allowedRoute)
        );
      },

      // 临时处方数据管理
      addTempPrescription: (prescription: TempPrescription) => {
        set(state => ({
          tempPrescriptionData: [...state.tempPrescriptionData, prescription],
        }));
      },

      clearTempData: () => {
        set({
          tempPrescriptionData: [],
        });
      },

      // 多语言管理
      setLanguage: (lang: Language) => {
        set({ language: lang });
      },

      getTranslation: (key: TranslationKey) => {
        const { language } = get();
        return translations[language][key] || key;
      },
    }),
    {
      name: 'guest-mode-storage',
      partialize: (state) => ({
        isGuestMode: state.isGuestMode,
        language: state.language,
        tempPrescriptionData: state.tempPrescriptionData,
        // 确保allowedRoutes也被持久化
        allowedRoutes: state.allowedRoutes,
      }),
    }
  )
);