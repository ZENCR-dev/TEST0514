import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginModal } from '../LoginModal';
import { withAuth } from '../withAuth';
import { useAuth } from '@/hooks/useAuth';

// 模拟useAuth钩子
jest.mock('@/hooks/useAuth');

// 模拟next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/test'
  })
}));

describe('LoginModal组件', () => {
  // 每个测试之前重置mocks
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      login: jest.fn().mockResolvedValue({}),
      isAuthenticated: false,
      user: null
    });
  });

  test('渲染登录表单', () => {
    render(
      <LoginModal
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText('登录系统')).toBeInTheDocument();
    expect(screen.getByLabelText('邮箱')).toBeInTheDocument();
    expect(screen.getByLabelText('密码')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();
  });

  test('表单验证 - 显示错误信息', async () => {
    render(
      <LoginModal
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    // 输入无效邮箱
    fireEvent.change(screen.getByLabelText('邮箱'), {
      target: { value: 'invalid-email' }
    });

    // 输入太短的密码
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: '123' }
    });

    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    // 检查错误信息
    await waitFor(() => {
      expect(screen.getByText('请输入有效的邮箱地址')).toBeInTheDocument();
      expect(screen.getByText('密码至少需要6个字符')).toBeInTheDocument();
    });
  });

  test('成功登录流程', async () => {
    const mockLogin = jest.fn().mockResolvedValue({});
    const mockOnClose = jest.fn();
    const mockOnSuccess = jest.fn();
    
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      user: null
    });

    render(
      <LoginModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // 输入有效邮箱
    fireEvent.change(screen.getByLabelText('邮箱'), {
      target: { value: 'test@example.com' }
    });

    // 输入有效密码
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: 'password123' }
    });

    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    // 检查登录调用
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(mockOnClose).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  test('登录失败处理', async () => {
    const mockError = new Error('邮箱或密码错误');
    const mockLogin = jest.fn().mockRejectedValue(mockError);
    
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      user: null
    });

    render(
      <LoginModal
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    // 输入凭据
    fireEvent.change(screen.getByLabelText('邮箱'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: 'password123' }
    });

    // 提交表单
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    // 检查错误信息
    await waitFor(() => {
      expect(screen.getByText('邮箱或密码错误')).toBeInTheDocument();
    });
  });

  test('测试账户快速填充功能', () => {
    render(
      <LoginModal
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    // 点击医生测试账户
    fireEvent.click(screen.getByText('医生'));

    // 检查表单是否填充了正确的值
    expect(screen.getByLabelText('邮箱')).toHaveValue('doctor@example.com');
    expect(screen.getByLabelText('密码')).toHaveValue('password123');
  });
});

describe('withAuth HOC', () => {
  test('未登录时重定向到首页', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null
    });

    const mockRouterPush = jest.fn();
    require('next/router').useRouter.mockReturnValue({
      push: mockRouterPush,
      pathname: '/protected'
    });

    const ProtectedComponent = () => <div>Protected Content</div>;
    const WrappedComponent = withAuth()(ProtectedComponent);

    render(<WrappedComponent />);

    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });

  test('已登录用户可以访问受保护页面', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'doctor' }
    });

    const ProtectedComponent = () => <div>Protected Content</div>;
    const WrappedComponent = withAuth()(ProtectedComponent);

    render(<WrappedComponent />);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('非医生角色用户无法访问医生专用页面', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'pharmacy' }
    });

    const mockRouterPush = jest.fn();
    require('next/router').useRouter.mockReturnValue({
      push: mockRouterPush,
      pathname: '/doctor-only'
    });

    const DoctorComponent = () => <div>Doctor Content</div>;
    const WrappedComponent = withAuth({ allowedRoles: ['doctor'] })(DoctorComponent);

    render(<WrappedComponent />);

    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });
}); 