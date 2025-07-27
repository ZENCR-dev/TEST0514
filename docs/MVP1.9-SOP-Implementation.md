# MVP1.9 Guest模式实施SOP - 技术实施指南

## 📋 文档信息

**版本**: MVP1.9  
**创建日期**: 2025-07-22  
**分支名称**: Grey test July  
**文档类型**: 标准操作程序 (SOP)  
**实施周期**: 8天 (分4个Phase)  

## 🎯 实施概述

### 目标
将MVP2.2的**Mock环境模块**改造为Guest模式灰度测试版本，提供独立的纯前端处方生成工具。

### 核心原则
1. **零API调用**: 完全基于前端Mock数据，无需localStorage持久化
2. **默认首页重定向**: `/` → `/prescription/create` 自动跳转
3. **界面简化**: 隐藏测试集成页面和环境切换组件
4. **功能限制控制**: Guest体验 → 登录弹窗阻止访问未开发功能
5. **明确标识**: 演示模式清晰标识，避免用户混淆
6. **保持核心价值**: 处方创建核心功能完整保留

## 🏗️ 技术架构改造

### 1. Guest模式状态管理架构

#### Zustand Store扩展
```typescript
// src/store/guestModeStore.ts
interface GuestModeState {
  isGuestMode: boolean;
  allowedRoutes: string[];
  tempPrescriptions: LocalPrescription[];
  sessionStartTime: number;
  
  // Actions
  enableGuestMode: () => void;
  disableGuestMode: () => void;
  addTempPrescription: (prescription: LocalPrescription) => void;
  clearTempData: () => void;
  isRouteAllowed: (path: string) => boolean;
  shouldRedirectToHome: () => boolean;
}

const useGuestModeStore = create<GuestModeState>((set, get) => ({
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

// 多语言状态管理
interface LanguageState {
  currentLanguage: 'zh' | 'en';
  switchLanguage: (lang: 'zh' | 'en') => void;
  getText: (key: string) => string;
}

const useLanguageStore = create<LanguageState>((set, get) => ({
  currentLanguage: 'zh',
  
  switchLanguage: (lang) => set({ currentLanguage: lang }),
  
  getText: (key) => {
    const { currentLanguage } = get();
    return translations[currentLanguage][key] || key;
  }
}));

// 多语言文本配置
const translations = {
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
```

### 2. 路由保护中间件

#### Guest模式路由守卫和重定向
```typescript
// src/components/auth/GuestModeGuard.tsx
import { useRouter } from 'next/router';
import { useGuestModeStore } from '@/store/guestModeStore';
import { LoginPromptModal } from './LoginPromptModal';
import { useEffect } from 'react';

interface GuestModeGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const GuestModeGuard: React.FC<GuestModeGuardProps> = ({ 
  children, 
  requireAuth = false 
}) => {
  const router = useRouter();
  const { isGuestMode, isRouteAllowed, shouldRedirectToHome } = useGuestModeStore();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Guest模式下首页重定向
  useEffect(() => {
    if (shouldRedirectToHome() && router.pathname === '/') {
      router.replace('/prescription/create');
      return;
    }
    
    if (isGuestMode && requireAuth) {
      setShowLoginPrompt(true);
    } else if (isGuestMode && !isRouteAllowed(router.pathname)) {
      setShowLoginPrompt(true);
    }
  }, [router.pathname, isGuestMode, requireAuth]);

  // 隐藏测试集成页面和环境切换组件
  if (isGuestMode && (
    router.pathname === '/test' || 
    router.pathname === '/integration' ||
    router.pathname.startsWith('/admin') ||
    router.pathname.startsWith('/doctor/') ||
    router.pathname.startsWith('/pharmacy/')
  )) {
    router.replace('/prescription/create');
    return null;
  }

  if (showLoginPrompt) {
    return (
      <LoginPromptModal 
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={() => {
          setShowLoginPrompt(false);
          // 触发登录流程
        }}
        onRegister={() => {
          setShowLoginPrompt(false);
          // 触发注册流程
        }}
        restrictedFeature={getFeatureName(router.pathname)}
      />
    );
  }

  return <>{children}</>;
};
```

### 3. 药品数据集成和本地存储机制

#### 442条真实药品数据集成 (符合后端API格式)
```typescript
// src/data/medicineData.ts
// 基于 archived-docs/medicine-data-450.CSV-processed.csv
// 数据结构符合UNIFIED_API_DOCUMENTATION.md中的Medicine模型

interface Medicine {
  id: string;                    // 系统ID
  name: string;                  // 对应中文名
  chineseName: string;           // 中文名
  englishName: string;           // 英文名
  pinyinName: string;            // 拼音名
  sku: string;                   // SKU代码
  category: string;              // 分类
  basePrice: number;             // 基础价格 (NZD$)
  unit: string;                  // 单位
  description?: string;          // 描述
  status: 'active' | 'inactive'; // 状态
}

// 处方数据结构 (符合后端API格式)
interface PrescriptionCreateRequest {
  medicines: Array<{
    medicineId: string;          // 药品ID
    weight: number;              // 单味药克重
  }>;
  copies: number;                // 帖数 (1-30)
  notes?: string;                // 处方整体备注
}

interface PrescriptionResponse {
  id: string;
  prescriptionId: string;        // RX-YYYY-XXX 格式
  medicines: Array<{
    medicineId: string;
    pinyinName: string;
    englishName: string;
    chineseName: string;
    weight: number;
    unitPrice: number;           // 对应basePrice
    unit: string;
  }>;
  copies: number;                // 帖数 (非amounts)
  grossWeight: number;           // 总克重
  totalPrice: number;            // 总价格
  status: 'DRAFT' | 'PAID' | 'FULFILLED' | 'COMPLETED';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// CSV数据转换为API格式
export const MEDICINE_DATABASE: Medicine[] = [
  {
    id: "med_001",
    name: "高丽参片",              // 对应CSV中的中文名
    chineseName: "高丽参片",
    englishName: "Panax Ginseng", 
    pinyinName: "gaolishenpian",
    sku: "GLSP",
    category: "其他中药",
    basePrice: 0.36956,          // CSV中的基础价格
    unit: "g",
    status: "active"
  },
  // ... 442条完整数据
];

// 药品搜索服务 (符合API响应格式)
export class MedicineSearchService {
  private medicines = MEDICINE_DATABASE;
  
  searchByName(query: string): Medicine[] {
    const lowercaseQuery = query.toLowerCase();
    return this.medicines.filter(medicine => 
      medicine.chineseName.includes(query) ||
      medicine.englishName.toLowerCase().includes(lowercaseQuery) ||
      medicine.pinyinName.toLowerCase().includes(lowercaseQuery) ||
      medicine.sku.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  searchByCategory(category: string): Medicine[] {
    return this.medicines.filter(medicine => medicine.category === category);
  }
  
  getAllCategories(): string[] {
    return [...new Set(this.medicines.map(m => m.category))];
  }
  
  // 根据语言设置返回药品名称
  getMedicineName(medicine: Medicine, language: 'zh' | 'en'): string {
    return language === 'en' ? medicine.englishName : medicine.chineseName;
  }
}
```

#### 本地数据管理器 (简化版)
```typescript
// src/utils/guestDataManager.ts
interface LocalPrescription {
  id: string;
  medicines: MedicineItem[];
  instructions: string;
  dosage: number;
  totalAmount: number;
  createdAt: string;
  isDemo: true; // 标识演示数据
}

class GuestDataManager {
  private tempPrescriptions: LocalPrescription[] = [];

  savePrescription(prescription: Omit<LocalPrescription, 'id' | 'createdAt' | 'isDemo'>) {
    const localPrescription: LocalPrescription = {
      ...prescription,
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      isDemo: true
    };

    this.tempPrescriptions.push(localPrescription);
    return localPrescription;
  }

  getPrescriptions(): LocalPrescription[] {
    return this.tempPrescriptions;
  }

  clearPrescriptions() {
    this.tempPrescriptions = [];
  }

  // 手动清空功能 - 用户点击清空按钮时调用
  clearAfterExport() {
    this.clearPrescriptions();
    console.log('处方数据已清空');
  }
}

export const guestDataManager = new GuestDataManager();
```

## 📋 Phase分解实施计划

### Phase 1: 基础架构搭建 (2天)

#### Day 1: 项目准备和状态管理
**目标**: 建立Guest模式基础架构

**实施步骤**:
1. **[子任务1] Git分支创建** 📋
   ```bash
   git checkout main
   git pull origin main
   git checkout -b "MVP1.9"
   git push -u origin MVP1.9
   ```

2. **[子任务2] Guest模式Store创建** 🧪
   - **TDD策略**: 先写测试 `src/store/__tests__/guestModeStore.test.ts`
   - 创建 `src/store/guestModeStore.ts`
   - 实现状态管理逻辑
   - 添加TypeScript类型定义
   - **验证**: 测试通过率100%

3. **[子任务3] 本地数据管理器实现** 🧪
   - **TDD策略**: 先写测试 `src/utils/__tests__/guestDataManager.test.ts`
   - 创建 `src/utils/guestDataManager.ts`
   - 实现内存中临时存储(无localStorage)
   - 添加手动清空功能
   - **验证**: 测试通过率100%

**验收标准**:
- [ ] Git分支创建成功
- [ ] Guest模式Store功能完整
- [ ] 内存数据存储测试通过
- [ ] TypeScript编译无错误

#### Day 2: 路由保护和组件基础
**目标**: 实现路由级别的Guest模式控制

**实施步骤**:
1. **[子任务4.1] 路由守卫组件** ✅ **COMPLETED**
   - ✅ 创建 `src/components/auth/GuestModeGuard.tsx`
   - ✅ 实现路由访问控制逻辑
   - ✅ 集成到页面组件中

2. **登录引导弹窗**
   - 创建 `src/components/auth/LoginPromptModal.tsx`
   - 设计用户友好的转化界面
   - 实现多种触发场景

3. **Guest模式标识组件**
   - 创建 `src/components/common/GuestModeBanner.tsx`
   - 实现演示模式视觉标识
   - 响应式设计适配

4. **多语言切换组件**
   - 创建 `src/components/common/LanguageSwitcher.tsx`
   - 实现中英文切换功能
   - 集成到页面右上角

**验收标准**:
- [ ] 路由保护正确工作
- [ ] 登录引导弹窗功能完整
- [ ] Guest模式标识清晰可见
- [ ] 所有组件响应式适配
- [ ] 语言切换功能正常工作

### Phase 2: 核心功能改造 (3天)

#### Day 3: 处方创建页面Guest模式改造
**目标**: 处方创建功能完全本地化

**实施步骤**:
1. **PrescriptionCreator组件改造**
   ```typescript
   // src/components/prescription/PrescriptionCreator.tsx
   const PrescriptionCreator = () => {
     const { isGuestMode } = useGuestModeStore();
     
     const handleSavePrescription = async (prescriptionData) => {
       if (isGuestMode) {
         // 内存临时保存逻辑(不使用localStorage)
         const saved = guestDataManager.savePrescription(prescriptionData);
         showSuccessToast('演示处方已生成，可导出或打印');
         return saved;
       } else {
         // 原有API保存逻辑
         return await prescriptionService.create(prescriptionData);
       }
     };
     
     return (
       <div>
         {isGuestMode && <GuestModeBanner />}
         {/* 处方创建界面 */}
       </div>
     );
   };
   ```

2. **药品搜索本地化**
   - 修改 `src/hooks/useMedicineSearch.ts`
   - 基于442条真实药品数据实现搜索，符合后端API格式
   - 支持中文名、英文名、拼音名、SKU搜索
   - 根据语言设置返回对应语言的药品名称

3. **金额计算演示模式**
   - 修改 `src/utils/prescriptionCalculator.ts`
   - 统一使用纽元NZD$作为金额单位
   - 使用后端API数据结构 (copies而非amounts)
   - 保持计算逻辑准确性

4. **界面组件隐藏**
   - 隐藏处方创建页面右下角"联调环境/Mock环境"切换组件
   - 移除EnvironmentSwitcher组件的渲染条件
   - 确保Guest模式下不显示开发者工具

5. **多语言界面实现**
   - 实现LanguageSwitcher组件
   - 药品名称根据语言设置显示
   - 界面文本使用多语言文本配置

**验收标准**:
- [ ] 处方创建完全本地化
- [ ] 药品搜索基于442条真实药品数据，符合API格式
- [ ] 金额显示使用纽元NZD$并标注"演示价格"
- [ ] 功能体验与原版一致
- [ ] 环境切换组件在Guest模式下完全隐藏
- [ ] 中英文界面切换功能正常

#### Day 4: PDF导出和打印功能
**目标**: 实现带演示标识的导出功能

**实施步骤**:
1. **PDF导出改造**
   ```typescript
   // src/utils/pdfGenerator.ts
   const generatePrescriptionPDF = (prescription: LocalPrescription) => {
     const doc = new jsPDF();
     
     // 添加演示水印
     if (prescription.isDemo) {
       doc.setTextColor(200, 200, 200);
       doc.setFontSize(50);
       doc.text('演示版本', 105, 150, { align: 'center', angle: 45 });
     }
     
     // 处方内容渲染
     doc.setTextColor(0, 0, 0);
     doc.setFontSize(12);
     // ... 处方内容
     
     return doc;
   };
   ```

2. **打印样式优化**
   - 修改 `src/styles/print.css`
   - 添加演示标识打印样式
   - 确保移动端打印兼容

3. **QR码生成**
   - 修改QR码内容包含演示标识
   - 本地生成的处方ID格式
   - 扫码后的演示说明

**验收标准**:
- [ ] PDF包含演示水印
- [ ] 打印样式完整美观
- [ ] QR码包含演示标识
- [ ] 各种设备导出正常

#### Day 5: API Client Guest模式适配
**目标**: API层面支持Guest模式

**实施步骤**:
1. **ApiClient改造**
   ```typescript
   // src/lib/apiClient.ts
   class ApiClient {
     async request(endpoint: string, options: RequestInit = {}) {
       const { isGuestMode } = useGuestModeStore.getState();
       
       if (isGuestMode && this.isProtectedEndpoint(endpoint)) {
         // 返回Mock数据或抛出需要登录异常
         return this.getMockResponse(endpoint);
       }
       
       // 正常API请求逻辑
       return this.actualRequest(endpoint, options);
     }
     
     private isProtectedEndpoint(endpoint: string): boolean {
       const protectedPatterns = [
         '/prescriptions',
         '/account',
         '/user'
       ];
       return protectedPatterns.some(pattern => endpoint.includes(pattern));
     }
   }
   ```

2. **Mock数据服务增强**
   - 集成442条真实药品数据替换现有Mock数据 (medicine-data-450.CSV-processed.csv)
   - 实现MedicineSearchService类提供完整搜索功能
   - 确保药品分类数据准确性 (8个分类)
   - 搜索算法本地化实现

3. **组件隐藏和路由配置**
   - 配置首页自动重定向到 `/prescription/create`
   - 隐藏测试集成页面和开发者工具
   - 移除EnvironmentSwitcher组件

**验收标准**:
- [ ] API Client正确识别Guest模式
- [ ] 集成442条真实药品数据
- [ ] 搜索功能完全本地化
- [ ] 零API调用确认
- [ ] 首页自动重定向功能正常

### Phase 3: 用户体验优化 (2天)

#### Day 6: 导航优化和用户体验增强
**目标**: 优化Guest模式导航和用户引导

**实施步骤**:
1. **路由重定向优化**
   ```typescript
   // src/pages/index.tsx - 首页重定向
   const HomePage = () => {
     const router = useRouter();
     const { isGuestMode } = useGuestModeStore();
     
     useEffect(() => {
       if (isGuestMode) {
         router.replace('/prescription/create');
       }
     }, [isGuestMode, router]);
     
     // Guest模式下不显示任何内容，直接重定向
     if (isGuestMode) {
       return <div>正在跳转到处方创建页...</div>;
     }
     
     return <AuthenticatedHomePage />;
   };
   ```

2. **导航菜单Guest适配**
   - 修改 `src/components/common/Navbar.tsx`
   - 隐藏不相关的导航菜单项
   - 只保留处方创建相关功能

3. **环境切换组件隐藏**
   - 确保EnvironmentSwitcher组件在Guest模式下不渲染
   - 移除所有测试和调试相关的UI组件

**验收标准**:
- [ ] 首页自动重定向到处方创建页
- [ ] 导航菜单只显示相关功能
- [ ] 环境切换组件完全隐藏
- [ ] 用户体验流畅自然

#### Day 7: 响应式和性能优化
**目标**: 确保各设备优秀体验

**实施步骤**:
1. **移动端适配优化**
   - 触摸操作优化
   - 屏幕适配测试
   - 输入体验改进

2. **性能优化**
   - Bundle大小分析
   - 懒加载实现
   - 本地存储性能优化

3. **离线功能增强**
   - Service Worker实现
   - 离线提示机制
   - 数据同步策略

**验收标准**:
- [ ] 移动端体验流畅
- [ ] 页面加载速度<3秒
- [ ] 离线模式可用
- [ ] 内存使用合理

### Phase 4: 测试和部署 (1天)

#### Day 8: 质量保证和灰度发布
**目标**: 确保产品质量并发布

**实施步骤**:
1. **功能测试**
   - Guest模式完整流程测试
   - 跨浏览器兼容性测试
   - 移动端设备测试

2. **性能和安全测试**
   - 性能指标验证
   - 数据安全检查
   - 无网络请求确认

3. **部署和监控**
   - 灰度环境部署
   - 监控指标设置
   - 用户反馈收集机制

**验收标准**:
- [ ] 所有功能测试通过
- [ ] 性能指标达标
- [ ] 灰度环境部署成功
- [ ] 监控系统正常

## 🎯 关键实施要点

### 技术要点
1. **状态管理**: 使用Zustand管理Guest模式状态，确保全局一致性
2. **数据持久化**: localStorage + 24小时过期策略
3. **路由保护**: 中间件模式实现路由级别访问控制
4. **组件隔离**: Guest模式组件与正常模式组件清晰分离

### 用户体验要点
1. **明确标识**: 所有Guest模式页面都有清晰的演示标识
2. **渐进引导**: 从功能体验到登录转化的自然过渡
3. **功能完整**: 核心处方创建功能体验不打折扣
4. **响应式**: 确保所有设备上的一致体验

### 质量保证要点
1. **零后端依赖**: 完全前端化，无API调用
2. **数据安全**: 本地数据加密存储，定期清理
3. **性能优化**: 基于本地数据的快速响应
4. **兼容性**: 主流浏览器100%支持

## 📊 成功指标监控

### 实施过程指标
- [ ] 代码覆盖率 > 85%
- [ ] 构建成功率 100%
- [ ] 测试通过率 > 95%
- [ ] 性能回归 < 5%

### 用户体验指标
- [ ] 首屏加载时间 < 3秒
- [ ] 功能完成率 > 90%
- [ ] 用户停留时间 > 5分钟
- [ ] 转化引导点击率 > 15%

## 🔄 迭代和维护计划

### 短期优化 (1周内)
- 用户行为数据收集
- 转化漏斗分析
- 功能使用热力图

### 中期改进 (1个月内)
- 基于用户反馈的UX优化
- 转化率优化实验
- 功能增强需求评估

### 长期规划 (3个月内)
- Guest模式数据分析报告
- 正式版本功能规划
- 商业化策略调整

---

**文档状态**: ✅ SOP完成  
**实施状态**: 待开始  
**负责人**: Claude Code Assistant  
**审核状态**: 待技术团队审核  

*本SOP遵循SuperClaude RIPER方法学和MVP TCM Platform技术标准*