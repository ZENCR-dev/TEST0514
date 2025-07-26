import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginPromptModal } from '../LoginPromptModal';
import { useGuestModeStore } from '../../../store/guestModeStore';

// Mock Guest mode store
jest.mock('../../../store/guestModeStore');
const mockUseGuestModeStore = useGuestModeStore as jest.MockedFunction<typeof useGuestModeStore>;

describe('LoginPromptModal', () => {
  const mockOnClose = jest.fn();
  const mockOnLogin = jest.fn();
  const mockOnRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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
  });

  describe('模态框显示和隐藏', () => {
    it('当isOpen为true时应该显示模态框', () => {
      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      expect(screen.getByTestId('login-prompt-modal')).toBeInTheDocument();
      expect(screen.getByText('立即登录，解锁完整功能')).toBeInTheDocument();
    });

    it('当isOpen为false时不应该显示模态框', () => {
      render(
        <LoginPromptModal
          isOpen={false}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      expect(screen.queryByTestId('login-prompt-modal')).not.toBeInTheDocument();
    });

    it('点击关闭按钮应该触发onClose回调', () => {
      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      const closeButton = screen.getByTestId('modal-close-button');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('点击遮罩层应该触发onClose回调', () => {
      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      const overlay = screen.getByTestId('modal-overlay');
      fireEvent.click(overlay);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('按下Escape键应该触发onClose回调', () => {
      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('多语言支持', () => {
    it('中文环境下应该显示中文文案', () => {
      mockUseGuestModeStore.mockReturnValue({
        ...mockUseGuestModeStore(),
        language: 'zh',
      });

      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      expect(screen.getByText('立即登录，解锁完整功能')).toBeInTheDocument();
      expect(screen.getByText('您正在使用演示模式，功能受限。登录后可以：')).toBeInTheDocument();
      expect(screen.getByText('保存处方到云端')).toBeInTheDocument();
      expect(screen.getByText('访问完整药品库')).toBeInTheDocument();
      expect(screen.getByText('查看历史记录')).toBeInTheDocument();
      expect(screen.getByText('使用高级功能')).toBeInTheDocument();
      expect(screen.getByText('立即登录')).toBeInTheDocument();
      expect(screen.getByText('免费注册')).toBeInTheDocument();
      expect(screen.getByText('继续演示')).toBeInTheDocument();
    });

    it('英文环境下应该显示英文文案', () => {
      mockUseGuestModeStore.mockReturnValue({
        ...mockUseGuestModeStore(),
        language: 'en',
      });

      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      expect(screen.getByText('Login to Unlock Full Features')).toBeInTheDocument();
      expect(screen.getByText('You are using demo mode with limited features. After login, you can:')).toBeInTheDocument();
      expect(screen.getByText('Save prescriptions to cloud')).toBeInTheDocument();
      expect(screen.getByText('Access complete medicine database')).toBeInTheDocument();
      expect(screen.getByText('View history records')).toBeInTheDocument();
      expect(screen.getByText('Use advanced features')).toBeInTheDocument();
      expect(screen.getByText('Login Now')).toBeInTheDocument();
      expect(screen.getByText('Free Register')).toBeInTheDocument();
      expect(screen.getByText('Continue Demo')).toBeInTheDocument();
    });
  });

  describe('用户交互行为', () => {
    it('点击登录按钮应该触发onLogin回调', () => {
      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);

      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });

    it('点击注册按钮应该触发onRegister回调', () => {
      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      const registerButton = screen.getByTestId('register-button');
      fireEvent.click(registerButton);

      expect(mockOnRegister).toHaveBeenCalledTimes(1);
    });

    it('点击继续演示按钮应该触发onClose回调', () => {
      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      const continueButton = screen.getByTestId('continue-demo-button');
      fireEvent.click(continueButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('功能特色展示', () => {
    it('应该显示所有功能特色列表', () => {
      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      expect(screen.getByTestId('feature-cloud-save')).toBeInTheDocument();
      expect(screen.getByTestId('feature-full-database')).toBeInTheDocument();
      expect(screen.getByTestId('feature-history')).toBeInTheDocument();
      expect(screen.getByTestId('feature-advanced')).toBeInTheDocument();
    });

    it('每个功能特色应该有对应的图标', () => {
      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      expect(screen.getByTestId('icon-cloud')).toBeInTheDocument();
      expect(screen.getByTestId('icon-database')).toBeInTheDocument();
      expect(screen.getByTestId('icon-history')).toBeInTheDocument();
      expect(screen.getByTestId('icon-advanced')).toBeInTheDocument();
    });
  });

  describe('样式和布局', () => {
    it('模态框应该有正确的CSS类名', () => {
      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      const modal = screen.getByTestId('login-prompt-modal');
      expect(modal).toHaveClass('fixed', 'inset-0', 'z-50');
    });

    it('主按钮应该有突出的样式', () => {
      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      const loginButton = screen.getByTestId('login-button');
      expect(loginButton).toHaveClass('bg-blue-600', 'text-white');
    });

    it('次要按钮应该有不同的样式', () => {
      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      const registerButton = screen.getByTestId('register-button');
      expect(registerButton).toHaveClass('bg-green-600', 'text-white');

      const continueButton = screen.getByTestId('continue-demo-button');
      expect(continueButton).toHaveClass('text-gray-600', 'border-gray-300');
    });
  });

  describe('可访问性支持', () => {
    it('模态框应该有正确的ARIA属性', () => {
      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      const modal = screen.getByTestId('login-prompt-modal');
      expect(modal).toHaveAttribute('role', 'dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby');
    });

    it('关闭按钮应该有可访问的标签', () => {
      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      const closeButton = screen.getByTestId('modal-close-button');
      expect(closeButton).toHaveAttribute('aria-label', '关闭对话框');
    });

    it('所有交互元素应该支持键盘导航', () => {
      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      const loginButton = screen.getByTestId('login-button');
      const registerButton = screen.getByTestId('register-button');
      const continueButton = screen.getByTestId('continue-demo-button');
      const closeButton = screen.getByTestId('modal-close-button');

      expect(loginButton).toHaveAttribute('tabIndex', '0');
      expect(registerButton).toHaveAttribute('tabIndex', '0');
      expect(continueButton).toHaveAttribute('tabIndex', '0');
      expect(closeButton).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('边界条件测试', () => {
    it('应该处理缺失的回调函数', () => {
      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={undefined as any}
          onRegister={undefined as any}
        />
      );

      const loginButton = screen.getByTestId('login-button');
      const registerButton = screen.getByTestId('register-button');
      
      // 应该不会抛出错误
      expect(() => {
        fireEvent.click(loginButton);
        fireEvent.click(registerButton);
      }).not.toThrow();
    });

    it('应该处理无效的语言设置', () => {
      mockUseGuestModeStore.mockReturnValue({
        ...mockUseGuestModeStore(),
        language: 'invalid' as any,
      });

      render(
        <LoginPromptModal
          isOpen={true}
          onClose={mockOnClose}
          onLogin={mockOnLogin}
          onRegister={mockOnRegister}
        />
      );

      // 应该默认使用中文
      expect(screen.getByText('立即登录，解锁完整功能')).toBeInTheDocument();
    });
  });
});