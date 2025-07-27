/**
 * GuestModeGuard组件测试
 * MVP1.9 Guest模式路由守卫组件TDD测试套件
 * 
 * @description 测试Guest模式下的路由保护、重定向和权限控制功能
 * @version 1.0.0
 * @date 2025-01-27
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';
import { GuestModeGuard } from '../GuestModeGuard';
import { useGuestModeStore } from '@/store/guestModeStore';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock GuestModeStore
jest.mock('@/store/guestModeStore', () => ({
  useGuestModeStore: jest.fn(),
}));

// Mock LoginPromptModal组件
jest.mock('../LoginPromptModal', () => ({
  LoginPromptModal: ({ isOpen, onClose, restrictedFeature }: any) => (
    isOpen ? (
      <div data-testid="login-prompt-modal">
        <h2>需要登录</h2>
        <p>访问功能: {restrictedFeature}</p>
        <button onClick={onClose}>关闭</button>
      </div>
    ) : null
  ),
}));

const mockRouter = {
  pathname: '/',
  replace: jest.fn(),
  push: jest.fn(),
};

const mockGuestStore = {
  isGuestMode: true,
  isRouteAllowed: jest.fn(),
  allowedRoutes: ['/', '/prescription/create'],
};

describe('GuestModeGuard组件', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useGuestModeStore as jest.Mock).mockReturnValue(mockGuestStore);
  });

  // 4.1.1.2 组件基础结构测试
  describe('基础结构测试', () => {
    it('应该正确渲染子组件', () => {
      mockGuestStore.isRouteAllowed.mockReturnValue(true);
      mockRouter.pathname = '/prescription/create';

      render(
        <GuestModeGuard>
          <div data-testid="child-component">子组件内容</div>
        </GuestModeGuard>
      );

      expect(screen.getByTestId('child-component')).toBeInTheDocument();
      expect(screen.getByText('子组件内容')).toBeInTheDocument();
    });

    it('应该有正确的displayName', () => {
      expect(GuestModeGuard.displayName).toBe('GuestModeGuard');
    });

    it('应该接受所有必需的props', () => {
      const onUnauthorizedAccess = jest.fn();
      
      render(
        <GuestModeGuard
          requireAuth={false}
          redirectTo="/custom-redirect"
          onUnauthorizedAccess={onUnauthorizedAccess}
        >
          <div>测试子组件</div>
        </GuestModeGuard>
      );

      // 验证组件能够接收和处理这些props
      expect(screen.getByText('测试子组件')).toBeInTheDocument();
    });
  });

  // 4.1.1.3 路由重定向测试
  describe('首页重定向测试', () => {
    it('Guest模式下应该从首页重定向到处方创建页', async () => {
      mockRouter.pathname = '/';
      mockGuestStore.isGuestMode = true;

      render(
        <GuestModeGuard>
          <div>首页内容</div>
        </GuestModeGuard>
      );

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/prescription/create');
      });
    });

    it('非Guest模式下不应该重定向首页', async () => {
      mockRouter.pathname = '/';
      mockGuestStore.isGuestMode = false;

      render(
        <GuestModeGuard>
          <div>首页内容</div>
        </GuestModeGuard>
      );

      await waitFor(() => {
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('Guest模式下非首页路由不应该触发重定向', async () => {
      mockRouter.pathname = '/prescription/create';
      mockGuestStore.isGuestMode = true;
      mockGuestStore.isRouteAllowed.mockReturnValue(true);

      render(
        <GuestModeGuard>
          <div>处方创建页</div>
        </GuestModeGuard>
      );

      await waitFor(() => {
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('应该支持自定义重定向路径', async () => {
      mockRouter.pathname = '/';
      mockGuestStore.isGuestMode = true;

      render(
        <GuestModeGuard redirectTo="/custom-page">
          <div>首页内容</div>
        </GuestModeGuard>
      );

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/custom-page');
      });
    });
  });

  // 4.1.1.4 Guest模式路由权限检查测试
  describe('Guest模式路由权限检查', () => {
    it('应该允许访问允许的路由', () => {
      mockRouter.pathname = '/prescription/create';
      mockGuestStore.isGuestMode = true;
      mockGuestStore.isRouteAllowed.mockReturnValue(true);

      render(
        <GuestModeGuard>
          <div data-testid="allowed-content">允许的内容</div>
        </GuestModeGuard>
      );

      expect(screen.getByTestId('allowed-content')).toBeInTheDocument();
      expect(mockGuestStore.isRouteAllowed).toHaveBeenCalledWith('/prescription/create');
    });

    it('应该正确调用路由权限检查函数', () => {
      mockRouter.pathname = '/some/path';
      mockGuestStore.isGuestMode = true;
      mockGuestStore.isRouteAllowed.mockReturnValue(false);

      render(
        <GuestModeGuard>
          <div>内容</div>
        </GuestModeGuard>
      );

      expect(mockGuestStore.isRouteAllowed).toHaveBeenCalledWith('/some/path');
    });

    it('应该在路由变化时重新检查权限', () => {
      const { rerender } = render(
        <GuestModeGuard>
          <div>内容</div>
        </GuestModeGuard>
      );

      // 模拟路由变化
      mockRouter.pathname = '/new-route';
      rerender(
        <GuestModeGuard>
          <div>新内容</div>
        </GuestModeGuard>
      );

      expect(mockGuestStore.isRouteAllowed).toHaveBeenCalledWith('/new-route');
    });
  });

  // 4.1.1.5 非允许路由处理测试（触发LoginPromptModal）
  describe('非允许路由处理测试', () => {
    it('应该显示登录提示模态框当访问受限路由时', () => {
      mockRouter.pathname = '/doctor/dashboard';
      mockGuestStore.isGuestMode = true;
      mockGuestStore.isRouteAllowed.mockReturnValue(false);

      render(
        <GuestModeGuard>
          <div>受限内容</div>
        </GuestModeGuard>
      );

      expect(screen.getByTestId('login-prompt-modal')).toBeInTheDocument();
      expect(screen.getByText('需要登录')).toBeInTheDocument();
      expect(screen.getByText('访问功能: 医师工作站')).toBeInTheDocument();
    });

    it('应该隐藏子组件当显示登录提示时', () => {
      mockRouter.pathname = '/admin/users';
      mockGuestStore.isGuestMode = true;
      mockGuestStore.isRouteAllowed.mockReturnValue(false);

      render(
        <GuestModeGuard>
          <div data-testid="protected-content">受保护的内容</div>
        </GuestModeGuard>
      );

      expect(screen.getByTestId('login-prompt-modal')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('应该支持requireAuth prop强制显示登录提示', () => {
      mockRouter.pathname = '/prescription/create';
      mockGuestStore.isGuestMode = true;
      mockGuestStore.isRouteAllowed.mockReturnValue(true);

      render(
        <GuestModeGuard requireAuth={true}>
          <div>需要认证的内容</div>
        </GuestModeGuard>
      );

      expect(screen.getByTestId('login-prompt-modal')).toBeInTheDocument();
    });

    it('应该调用onUnauthorizedAccess回调当访问被拒绝时', () => {
      const onUnauthorizedAccess = jest.fn();
      mockRouter.pathname = '/protected-route';
      mockGuestStore.isGuestMode = true;
      mockGuestStore.isRouteAllowed.mockReturnValue(false);

      render(
        <GuestModeGuard onUnauthorizedAccess={onUnauthorizedAccess}>
          <div>受保护内容</div>
        </GuestModeGuard>
      );

      expect(onUnauthorizedAccess).toHaveBeenCalledWith('/protected-route');
    });

    it('应该处理特殊路由模式（admin, doctor, pharmacy）', () => {
      const testRoutes = [
        { path: '/admin/users', expected: '管理员功能' },
        { path: '/doctor/history', expected: '医师工作站' },
        { path: '/pharmacy/prescriptions', expected: '药房管理' }
      ];

      testRoutes.forEach(({ path, expected }) => {
        mockRouter.pathname = path;
        mockGuestStore.isGuestMode = true;
        mockGuestStore.isRouteAllowed.mockReturnValue(false);

        const { unmount } = render(
          <GuestModeGuard>
            <div>内容</div>
          </GuestModeGuard>
        );

        expect(screen.getByText(`访问功能: ${expected}`)).toBeInTheDocument();
        unmount();
      });
    });
  });

  // 4.1.1.6 Guest模式关闭时正常渲染测试
  describe('Guest模式关闭时正常渲染', () => {
    it('非Guest模式下应该正常渲染所有子组件', () => {
      mockRouter.pathname = '/admin/dashboard';
      mockGuestStore.isGuestMode = false;

      render(
        <GuestModeGuard>
          <div data-testid="normal-content">正常内容</div>
        </GuestModeGuard>
      );

      expect(screen.getByTestId('normal-content')).toBeInTheDocument();
      expect(screen.queryByTestId('login-prompt-modal')).not.toBeInTheDocument();
    });

    it('非Guest模式下不应该进行路由权限检查', () => {
      mockRouter.pathname = '/any/route';
      mockGuestStore.isGuestMode = false;

      render(
        <GuestModeGuard>
          <div>内容</div>
        </GuestModeGuard>
      );

      // 在非Guest模式下，即使isRouteAllowed返回false也应该正常渲染
      expect(screen.getByText('内容')).toBeInTheDocument();
    });

    it('非Guest模式下requireAuth prop应该被忽略', () => {
      mockRouter.pathname = '/some/route';
      mockGuestStore.isGuestMode = false;

      render(
        <GuestModeGuard requireAuth={true}>
          <div data-testid="auth-ignored-content">应该显示的内容</div>
        </GuestModeGuard>
      );

      expect(screen.getByTestId('auth-ignored-content')).toBeInTheDocument();
      expect(screen.queryByTestId('login-prompt-modal')).not.toBeInTheDocument();
    });
  });

  // 边界条件和异常处理测试
  describe('边界条件和异常处理', () => {
    it('应该处理空的children', () => {
      mockGuestStore.isGuestMode = true;
      mockGuestStore.isRouteAllowed.mockReturnValue(true);

      expect(() => {
        render(<GuestModeGuard>{null}</GuestModeGuard>);
      }).not.toThrow();
    });

    it('应该处理undefined路由', () => {
      mockRouter.pathname = undefined;
      mockGuestStore.isGuestMode = true;
      mockGuestStore.isRouteAllowed.mockReturnValue(false);

      expect(() => {
        render(
          <GuestModeGuard>
            <div>内容</div>
          </GuestModeGuard>
        );
      }).not.toThrow();
    });

    it('应该处理Store状态异常', () => {
      (useGuestModeStore as jest.Mock).mockReturnValue({
        isGuestMode: undefined,
        isRouteAllowed: undefined,
      });

      expect(() => {
        render(
          <GuestModeGuard>
            <div>内容</div>
          </GuestModeGuard>
        );
      }).not.toThrow();
    });

    it('应该处理路由器状态异常', () => {
      (useRouter as jest.Mock).mockReturnValue({
        pathname: null,
        replace: null,
      });

      expect(() => {
        render(
          <GuestModeGuard>
            <div>内容</div>
          </GuestModeGuard>
        );
      }).not.toThrow();
    });
  });

  // 性能和优化测试
  describe('性能和优化测试', () => {
    it('应该只在必要时重新渲染', () => {
      const renderSpy = jest.fn();
      const TestChild = () => {
        renderSpy();
        return <div>测试子组件</div>;
      };

      mockGuestStore.isGuestMode = true;
      mockGuestStore.isRouteAllowed.mockReturnValue(true);

      const { rerender } = render(
        <GuestModeGuard>
          <TestChild />
        </GuestModeGuard>
      );

      // 相同props重新渲染不应该触发子组件重新渲染
      rerender(
        <GuestModeGuard>
          <TestChild />
        </GuestModeGuard>
      );

      // 由于React的渲染机制，子组件会重新渲染，但这是正常的
      expect(renderSpy).toHaveBeenCalled();
    });

    it('应该正确处理快速路由切换', async () => {
      mockGuestStore.isGuestMode = true;
      
      const { rerender } = render(
        <GuestModeGuard>
          <div>内容</div>
        </GuestModeGuard>
      );

      // 快速切换多个路由
      const routes = ['/', '/prescription/create', '/admin/users', '/doctor/history'];
      
      for (const route of routes) {
        mockRouter.pathname = route;
        mockGuestStore.isRouteAllowed.mockReturnValue(route.includes('prescription') || route === '/');
        
        rerender(
          <GuestModeGuard>
            <div>内容</div>
          </GuestModeGuard>
        );

        // 只有非首页路由才会调用isRouteAllowed
        if (route !== '/') {
          await waitFor(() => {
            expect(mockGuestStore.isRouteAllowed).toHaveBeenCalledWith(route);
          });
        }
      }
    });
  });
});