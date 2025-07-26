/**
 * Guest模式和多语言相关类型定义
 * MVP1.9 Guest Mode Types
 */

// 药品项目接口
export interface MedicineItem {
  medicineId: string;
  pinyinName: string;
  englishName: string;
  chineseName: string;
  weight: number;
  unitPrice: number;
  unit: string;
}

// 本地处方接口
export interface LocalPrescription {
  id: string;
  medicines: MedicineItem[];
  instructions: string;
  dosage: number;
  totalAmount: number;
  createdAt: string;
  isDemo: true; // 标识演示数据
}

// Guest模式状态接口
export interface GuestModeState {
  isGuestMode: boolean;
  allowedRoutes: string[];
  tempPrescriptions: LocalPrescription[];
  sessionStartTime: number;
  language: 'zh' | 'en';
  
  // Actions
  enableGuestMode: () => void;
  disableGuestMode: () => void;
  addTempPrescription: (prescription: LocalPrescription) => void;
  clearTempData: () => void;
  isRouteAllowed: (path: string) => boolean;
  shouldRedirectToHome: () => boolean;
  setLanguage: (lang: 'zh' | 'en') => void;
}

// 多语言状态接口
export interface LanguageState {
  currentLanguage: 'zh' | 'en';
  switchLanguage: (lang: 'zh' | 'en') => void;
  getText: (key: string) => string;
}

// 多语言文本类型
export type TranslationKey = 
  | 'prescription.create'
  | 'medicine.search'
  | 'medicine.name'
  | 'medicine.weight'
  | 'prescription.copies'
  | 'prescription.notes'
  | 'prescription.total'
  | 'button.save'
  | 'button.export'
  | 'button.print'
  | 'button.clear'
  | 'demo.mode'
  | 'demo.price';

export type Translations = Record<'zh' | 'en', Record<TranslationKey, string>>;