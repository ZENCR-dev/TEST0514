import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { GuestModeGuard } from '../GuestModeGuard';
import { useGuestModeStore } from '../../../store/guestModeStore';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock Guest mode store
jest.mock('../../../store/guestModeStore');

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseGuestModeStore = useGuestModeStore as jest.MockedFunction<typeof useGuestModeStore>;

describe('GuestModeGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      pathname: '/prescription/create',
      push: mockPush,
      replace: mockReplace,
      query: {},
      asPath: '/prescription/create',
      route: '/prescription/create',
      isReady: true,
      back: jest.fn(),
      beforePopState: jest.fn(),
      prefetch: jest.fn(),
      reload: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isLocaleDomain: true,
      isPreview: false,
      basePath: '',
      locale: 'zh',
      locales: ['zh', 'en'],
      defaultLocale: 'zh',
      domainLocales: [],
    });
  });

  describe('正常访问权限控制', () => {
    it('Guest模式下应该允许访问处方创建页面', async () => {
      mockUseGuestModeStore.mockReturnValue({
        isGuestMode: true,
        isRouteAllowed: jest.fn().mockReturnValue(true),
        shouldRedirectToHome: jest.fn().mockReturnValue(false),
        allowedRoutes: ['/prescription/create', '/auth/*', '/register/*'],
        tempPrescriptions: [],
        sessionStartTime: Date.now(),
        language: 'zh',
        addTempPrescription: jest.fn(),
        clearTempPrescriptions: jest.fn(),
        setLanguage: jest.fn(),
        updateSessionTime: jest.fn(),
      });

      render(
        <GuestModeGuard>
          <div data-testid="protected-content">Protected Content</div>
        </GuestModeGuard>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('Guest模式下应该允许访问认证相关页面', async () => {
      mockUseRouter.mockReturnValue({
        ...mockUseRouter(),
        pathname: '/auth/login',
      });

      mockUseGuestModeStore.mockReturnValue({
        isGuestMode: true,
        isRouteAllowed: jest.fn().mockReturnValue(true),
        shouldRedirectToHome: jest.fn().mockReturnValue(false),
        allowedRoutes: ['/prescription/create', '/auth/*', '/register/*'],
        tempPrescriptions: [],
        sessionStartTime: Date.now(),
        language: 'zh',
        addTempPrescription: jest.fn(),
        clearTempPrescriptions: jest.fn(),
        setLanguage: jest.fn(),
        updateSessionTime: jest.fn(),
      });

      render(
        <GuestModeGuard>
          <div data-testid="auth-content">Auth Content</div>
        </GuestModeGuard>
      );

      expect(screen.getByTestId('auth-content')).toBeInTheDocument();
    });
  });

  describe('路由重定向逻辑', () => {
    it('Guest模式下访问首页应该重定向到处方创建页面', async () => {
      mockUseRouter.mockReturnValue({
        ...mockUseRouter(),
        pathname: '/',
      });

      mockUseGuestModeStore.mockReturnValue({
        isGuestMode: true,
        isRouteAllowed: jest.fn().mockReturnValue(true),
        shouldRedirectToHome: jest.fn().mockReturnValue(true),
        allowedRoutes: ['/prescription/create', '/auth/*', '/register/*'],
        tempPrescriptions: [],
        sessionStartTime: Date.now(),
        language: 'zh',
        addTempPrescription: jest.fn(),
        clearTempPrescriptions: jest.fn(),
        setLanguage: jest.fn(),
        updateSessionTime: jest.fn(),
      });

      render(
        <GuestModeGuard>
          <div data-testid="home-content">Home Content</div>
        </GuestModeGuard>
      );

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/prescription/create');
      });
    });

    it('Guest模式下访问受限页面应该重定向到处方创建页面', async () => {
      mockUseRouter.mockReturnValue({
        ...mockUseRouter(),
        pathname: '/admin/dashboard',
      });

      mockUseGuestModeStore.mockReturnValue({
        isGuestMode: true,
        isRouteAllowed: jest.fn().mockReturnValue(false),
        shouldRedirectToHome: jest.fn().mockReturnValue(false),
        allowedRoutes: ['/prescription/create', '/auth/*', '/register/*'],
        tempPrescriptions: [],
        sessionStartTime: Date.now(),
        language: 'zh',
        addTempPrescription: jest.fn(),
        clearTempPrescriptions: jest.fn(),
        setLanguage: jest.fn(),
        updateSessionTime: jest.fn(),
      });

      render(
        <GuestModeGuard>
          <div data-testid="admin-content">Admin Content</div>
        </GuestModeGuard>
      );

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/prescription/create');
      });

      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
    });

    it('Guest模式下访问医生页面应该重定向', async () => {
      mockUseRouter.mockReturnValue({
        ...mockUseRouter(),
        pathname: '/doctor/dashboard',
      });

      mockUseGuestModeStore.mockReturnValue({
        isGuestMode: true,
        isRouteAllowed: jest.fn().mockReturnValue(false),
        shouldRedirectToHome: jest.fn().mockReturnValue(false),
        allowedRoutes: ['/prescription/create', '/auth/*', '/register/*'],
        tempPrescriptions: [],
        sessionStartTime: Date.now(),
        language: 'zh',
        addTempPrescription: jest.fn(),
        clearTempPrescriptions: jest.fn(),
        setLanguage: jest.fn(),
        updateSessionTime: jest.fn(),
      });

      render(
        <GuestModeGuard>
          <div data-testid="doctor-content">Doctor Content</div>
        </GuestModeGuard>
      );

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/prescription/create');
      });

      expect(screen.queryByTestId('doctor-content')).not.toBeInTheDocument();
    });

    it('Guest模式下访问药房页面应该重定向', async () => {
      mockUseRouter.mockReturnValue({
        ...mockUseRouter(),
        pathname: '/pharmacy/prescriptions',
      });

      mockUseGuestModeStore.mockReturnValue({
        isGuestMode: true,
        isRouteAllowed: jest.fn().mockReturnValue(false),
        shouldRedirectToHome: jest.fn().mockReturnValue(false),
        allowedRoutes: ['/prescription/create', '/auth/*', '/register/*'],
        tempPrescriptions: [],
        sessionStartTime: Date.now(),
        language: 'zh',
        addTempPrescription: jest.fn(),
        clearTempPrescriptions: jest.fn(),
        setLanguage: jest.fn(),
        updateSessionTime: jest.fn(),
      });

      render(
        <GuestModeGuard>
          <div data-testid="pharmacy-content">Pharmacy Content</div>
        </GuestModeGuard>
      );

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/prescription/create');
      });

      expect(screen.queryByTestId('pharmacy-content')).not.toBeInTheDocument();
    });
  });

  describe('登录提示模态框触发', () => {
    it('Guest模式下访问需要认证的功能应该显示登录提示', async () => {
      mockUseGuestModeStore.mockReturnValue({
        isGuestMode: true,
        isRouteAllowed: jest.fn().mockReturnValue(true),
        shouldRedirectToHome: jest.fn().mockReturnValue(false),
        allowedRoutes: ['/prescription/create', '/auth/*', '/register/*'],
        tempPrescriptions: [],
        sessionStartTime: Date.now(),
        language: 'zh',
        addTempPrescription: jest.fn(),
        clearTempPrescriptions: jest.fn(),
        setLanguage: jest.fn(),
        updateSessionTime: jest.fn(),
      });

      render(
        <GuestModeGuard requireAuth={true}>
          <div data-testid="auth-required-content">Auth Required Content</div>
        </GuestModeGuard>
      );

      await waitFor(() => {
        expect(screen.getByTestId('login-prompt-modal')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('auth-required-content')).not.toBeInTheDocument();
    });

    it('Guest模式下不允许的路由应该显示登录提示', async () => {
      mockUseRouter.mockReturnValue({
        ...mockUseRouter(),
        pathname: '/premium/feature',
      });

      mockUseGuestModeStore.mockReturnValue({
        isGuestMode: true,
        isRouteAllowed: jest.fn().mockReturnValue(false),
        shouldRedirectToHome: jest.fn().mockReturnValue(false),
        allowedRoutes: ['/prescription/create', '/auth/*', '/register/*'],
        tempPrescriptions: [],
        sessionStartTime: Date.now(),
        language: 'zh',
        addTempPrescription: jest.fn(),
        clearTempPrescriptions: jest.fn(),
        setLanguage: jest.fn(),
        updateSessionTime: jest.fn(),
      });

      render(
        <GuestModeGuard>
          <div data-testid="premium-content">Premium Content</div>
        </GuestModeGuard>
      );

      await waitFor(() => {
        expect(screen.getByTestId('login-prompt-modal')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('premium-content')).not.toBeInTheDocument();
    });
  });

  describe('非Guest模式下正常行为', () => {
    it('非Guest模式下应该正常渲染子组件', () => {
      mockUseGuestModeStore.mockReturnValue({
        isGuestMode: false,
        isRouteAllowed: jest.fn().mockReturnValue(true),
        shouldRedirectToHome: jest.fn().mockReturnValue(false),
        allowedRoutes: ['/prescription/create', '/auth/*', '/register/*'],
        tempPrescriptions: [],
        sessionStartTime: Date.now(),
        language: 'zh',
        addTempPrescription: jest.fn(),
        clearTempPrescriptions: jest.fn(),
        setLanguage: jest.fn(),
        updateSessionTime: jest.fn(),
      });

      render(
        <GuestModeGuard requireAuth={true}>
          <div data-testid="normal-content">Normal Content</div>
        </GuestModeGuard>
      );

      expect(screen.getByTestId('normal-content')).toBeInTheDocument();
      expect(screen.queryByTestId('login-prompt-modal')).not.toBeInTheDocument();
    });

    it('非Guest模式下不应该进行路由重定向', () => {
      mockUseRouter.mockReturnValue({
        ...mockUseRouter(),
        pathname: '/admin/dashboard',
      });

      mockUseGuestModeStore.mockReturnValue({
        isGuestMode: false,
        isRouteAllowed: jest.fn().mockReturnValue(true),
        shouldRedirectToHome: jest.fn().mockReturnValue(false),
        allowedRoutes: ['/prescription/create', '/auth/*', '/register/*'],
        tempPrescriptions: [],
        sessionStartTime: Date.now(),
        language: 'zh',
        addTempPrescription: jest.fn(),
        clearTempPrescriptions: jest.fn(),
        setLanguage: jest.fn(),
        updateSessionTime: jest.fn(),
      });

      render(
        <GuestModeGuard>
          <div data-testid="admin-content">Admin Content</div>
        </GuestModeGuard>
      );

      expect(screen.getByTestId('admin-content')).toBeInTheDocument();
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  describe('边界条件测试', () => {
    it('应该处理路由器未就绪状态', () => {
      mockUseRouter.mockReturnValue({
        ...mockUseRouter(),
        isReady: false,
      });

      mockUseGuestModeStore.mockReturnValue({
        isGuestMode: true,
        isRouteAllowed: jest.fn().mockReturnValue(true),
        shouldRedirectToHome: jest.fn().mockReturnValue(false),
        allowedRoutes: ['/prescription/create', '/auth/*', '/register/*'],
        tempPrescriptions: [],
        sessionStartTime: Date.now(),
        language: 'zh',
        addTempPrescription: jest.fn(),
        clearTempPrescriptions: jest.fn(),
        setLanguage: jest.fn(),
        updateSessionTime: jest.fn(),
      });

      render(
        <GuestModeGuard>
          <div data-testid="loading-content">Loading Content</div>
        </GuestModeGuard>
      );

      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('应该处理空的子组件', () => {
      mockUseGuestModeStore.mockReturnValue({
        isGuestMode: false,
        isRouteAllowed: jest.fn().mockReturnValue(true),
        shouldRedirectToHome: jest.fn().mockReturnValue(false),
        allowedRoutes: ['/prescription/create', '/auth/*', '/register/*'],
        tempPrescriptions: [],
        sessionStartTime: Date.now(),
        language: 'zh',
        addTempPrescription: jest.fn(),
        clearTempPrescriptions: jest.fn(),
        setLanguage: jest.fn(),
        updateSessionTime: jest.fn(),
      });

      const { container } = render(<GuestModeGuard>{null}</GuestModeGuard>);

      expect(container.firstChild).toBeNull();
    });
  });
});