/**
 * guestModeStore TDD测试用例
 * MVP1.9 Guest模式状态管理测试
 * 
 * 测试覆盖:
 * - 初始状态验证
 * - Guest模式开启/关闭
 * - 路由权限检查
 * - 临时处方数据管理
 * - 重定向逻辑
 * - 语言切换功能
 */

import { act, renderHook } from '@testing-library/react';
import { useGuestModeStore } from '../guestModeStore';
import { LocalPrescription } from '../../types/guest';

describe('guestModeStore', () => {
  beforeEach(() => {
    // 每个测试前重置store状态
    const { result } = renderHook(() => useGuestModeStore());
    act(() => {
      result.current.clearTempData();
      result.current.enableGuestMode();
    });
  });

  describe('初始状态验证', () => {
    it('应该有正确的初始状态', () => {
      const { result } = renderHook(() => useGuestModeStore());
      
      expect(result.current.isGuestMode).toBe(true);
      expect(result.current.allowedRoutes).toEqual([
        '/prescription/create',
        '/auth/*',
        '/register/*'
      ]);
      expect(result.current.tempPrescriptions).toEqual([]);
      expect(result.current.sessionStartTime).toBeGreaterThan(0);
      expect(result.current.language).toBe('zh');
    });

    it('sessionStartTime应该是当前时间戳', () => {
      const beforeTime = Date.now();
      const { result } = renderHook(() => useGuestModeStore());
      const afterTime = Date.now();
      
      expect(result.current.sessionStartTime).toBeGreaterThanOrEqual(beforeTime);
      expect(result.current.sessionStartTime).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('Guest模式控制', () => {
    it('enableGuestMode 应该启用Guest模式', () => {
      const { result } = renderHook(() => useGuestModeStore());
      
      act(() => {
        result.current.disableGuestMode();
      });
      expect(result.current.isGuestMode).toBe(false);
      
      act(() => {
        result.current.enableGuestMode();
      });
      expect(result.current.isGuestMode).toBe(true);
    });

    it('disableGuestMode 应该禁用Guest模式', () => {
      const { result } = renderHook(() => useGuestModeStore());
      
      act(() => {
        result.current.disableGuestMode();
      });
      
      expect(result.current.isGuestMode).toBe(false);
    });
  });

  describe('路由权限检查', () => {
    it('isRouteAllowed 应该正确检查允许的路由', () => {
      const { result } = renderHook(() => useGuestModeStore());
      
      // 允许的精确路由
      expect(result.current.isRouteAllowed('/prescription/create')).toBe(true);
      
      // 允许的通配符路由
      expect(result.current.isRouteAllowed('/auth/login')).toBe(true);
      expect(result.current.isRouteAllowed('/auth/register')).toBe(true);
      expect(result.current.isRouteAllowed('/register/doctor')).toBe(true);
      
      // 不允许的路由
      expect(result.current.isRouteAllowed('/doctor/dashboard')).toBe(false);
      expect(result.current.isRouteAllowed('/pharmacy/orders')).toBe(false);
      expect(result.current.isRouteAllowed('/admin/users')).toBe(false);
    });

    it('非Guest模式下应该允许所有路由', () => {
      const { result } = renderHook(() => useGuestModeStore());
      
      act(() => {
        result.current.disableGuestMode();
      });
      
      expect(result.current.isRouteAllowed('/doctor/dashboard')).toBe(true);
      expect(result.current.isRouteAllowed('/pharmacy/orders')).toBe(true);
      expect(result.current.isRouteAllowed('/admin/users')).toBe(true);
    });
  });

  describe('重定向逻辑', () => {
    it('shouldRedirectToHome 在Guest模式下应该返回true', () => {
      const { result } = renderHook(() => useGuestModeStore());
      
      expect(result.current.shouldRedirectToHome()).toBe(true);
    });

    it('shouldRedirectToHome 在非Guest模式下应该返回false', () => {
      const { result } = renderHook(() => useGuestModeStore());
      
      act(() => {
        result.current.disableGuestMode();
      });
      
      expect(result.current.shouldRedirectToHome()).toBe(false);
    });
  });

  describe('临时处方数据管理', () => {
    const mockPrescription: LocalPrescription = {
      id: 'test-prescription-1',
      medicines: [
        {
          medicineId: 'med_001',
          pinyinName: 'gaolishenpian',
          englishName: 'Panax Ginseng',
          chineseName: '高丽参片',
          weight: 10,
          unitPrice: 0.36956,
          unit: 'g'
        }
      ],
      instructions: '每日三次，饭后服用',
      dosage: 7,
      totalAmount: 25.87,
      createdAt: '2025-07-26T09:13:00.000Z',
      isDemo: true
    };

    it('addTempPrescription 应该添加临时处方', () => {
      const { result } = renderHook(() => useGuestModeStore());
      
      act(() => {
        result.current.addTempPrescription(mockPrescription);
      });
      
      expect(result.current.tempPrescriptions).toHaveLength(1);
      expect(result.current.tempPrescriptions[0]).toEqual(mockPrescription);
    });

    it('应该支持添加多个临时处方', () => {
      const { result } = renderHook(() => useGuestModeStore());
      
      const prescription2: LocalPrescription = {
        ...mockPrescription,
        id: 'test-prescription-2',
        dosage: 14
      };
      
      act(() => {
        result.current.addTempPrescription(mockPrescription);
        result.current.addTempPrescription(prescription2);
      });
      
      expect(result.current.tempPrescriptions).toHaveLength(2);
      expect(result.current.tempPrescriptions[0]).toEqual(mockPrescription);
      expect(result.current.tempPrescriptions[1]).toEqual(prescription2);
    });

    it('clearTempData 应该清空所有临时数据', () => {
      const { result } = renderHook(() => useGuestModeStore());
      
      act(() => {
        result.current.addTempPrescription(mockPrescription);
      });
      expect(result.current.tempPrescriptions).toHaveLength(1);
      
      act(() => {
        result.current.clearTempData();
      });
      expect(result.current.tempPrescriptions).toEqual([]);
    });
  });

  describe('语言切换功能', () => {
    it('setLanguage 应该更新语言设置', () => {
      const { result } = renderHook(() => useGuestModeStore());
      
      expect(result.current.language).toBe('zh');
      
      act(() => {
        result.current.setLanguage('en');
      });
      
      expect(result.current.language).toBe('en');
      
      act(() => {
        result.current.setLanguage('zh');
      });
      
      expect(result.current.language).toBe('zh');
    });
  });

  describe('边界条件测试', () => {
    it('路由检查应该处理空字符串', () => {
      const { result } = renderHook(() => useGuestModeStore());
      
      expect(result.current.isRouteAllowed('')).toBe(false);
    });

    it('路由检查应该处理undefined', () => {
      const { result } = renderHook(() => useGuestModeStore());
      
      expect(result.current.isRouteAllowed(undefined as any)).toBe(false);
    });

    it('应该处理空的处方数据', () => {
      const { result } = renderHook(() => useGuestModeStore());
      
      const emptyPrescription: LocalPrescription = {
        id: 'empty-prescription',
        medicines: [],
        instructions: '空处方',
        dosage: 1,
        totalAmount: 0,
        createdAt: new Date().toISOString(),
        isDemo: true
      };
      
      act(() => {
        result.current.addTempPrescription(emptyPrescription);
      });
      
      expect(result.current.tempPrescriptions).toHaveLength(1);
      expect(result.current.tempPrescriptions[0].medicines).toEqual([]);
    });
  });

  describe('状态持久性测试', () => {
    it('Guest模式状态在操作后应该保持', () => {
      const { result } = renderHook(() => useGuestModeStore());
      
      const mockPrescription: LocalPrescription = {
        id: 'test-prescription-persist',
        medicines: [
          {
            medicineId: 'med_001',
            pinyinName: 'gaolishenpian',
            englishName: 'Panax Ginseng',
            chineseName: '高丽参片',
            weight: 10,
            unitPrice: 0.36956,
            unit: 'g'
          }
        ],
        instructions: '每日三次，饭后服用',
        dosage: 7,
        totalAmount: 25.87,
        createdAt: '2025-07-26T09:13:00.000Z',
        isDemo: true
      };
      
      act(() => {
        result.current.addTempPrescription(mockPrescription);
        result.current.setLanguage('en');
      });
      
      expect(result.current.isGuestMode).toBe(true);
      expect(result.current.tempPrescriptions).toHaveLength(1);
      expect(result.current.language).toBe('en');
    });
  });

  describe('兼容性测试', () => {
    const completeMockPrescription: LocalPrescription = {
      id: 'test-prescription-complete',
      medicines: [
        {
          medicineId: 'med_001',
          pinyinName: 'gaolishenpian',
          englishName: 'Panax Ginseng',
          chineseName: '高丽参片',
          weight: 10,
          unitPrice: 0.36956,
          unit: 'g'
        }
      ],
      instructions: '每日三次，饭后服用',
      dosage: 7,
      totalAmount: 25.87,
      createdAt: '2025-07-26T09:13:00.000Z',
      isDemo: true
    };

    it('应该支持完整的LocalPrescription对象', () => {
      const { result } = renderHook(() => useGuestModeStore());
      
      act(() => {
        result.current.addTempPrescription(completeMockPrescription);
      });
      
      expect(result.current.tempPrescriptions).toHaveLength(1);
      expect(result.current.tempPrescriptions[0]).toEqual(completeMockPrescription);
    });
  });
});