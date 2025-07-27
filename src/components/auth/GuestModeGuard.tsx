/**
 * Guest Mode Guard Component
 * MVP1.9 Guest模式路由守卫组件
 * 
 * @description 处理Guest模式下的路由保护、重定向和权限控制
 * @features 
 * - 首页自动重定向到处方创建页
 * - Guest模式路由权限控制
 * - 未授权访问时显示登录引导
 * - 与现有withAuth HOC协同工作
 * @version 1.0.0
 * @date 2025-01-27
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useGuestModeStore } from '@/store/guestModeStore';
import { LoginPromptModal } from './LoginPromptModal';

/**
 * GuestModeGuard组件Props接口
 */
export interface GuestModeGuardProps {
  /** 子组件 */
  children: React.ReactNode;
  /** 是否强制要求认证，如果为true则在Guest模式下也显示登录提示 */
  requireAuth?: boolean;
  /** 自定义重定向路径，默认为 '/prescription/create' */
  redirectTo?: string;
  /** 未授权访问时的回调函数 */
  onUnauthorizedAccess?: (route: string) => void;
}

/**
 * Guest模式路由守卫组件
 * 
 * 负责：
 * 1. Guest模式下首页重定向到处方创建页
 * 2. 检查Guest模式下的路由访问权限
 * 3. 显示登录引导模态框对于受限路由
 * 4. 在非Guest模式下正常渲染所有内容
 */
export const GuestModeGuard: React.FC<GuestModeGuardProps> = ({
  children,
  requireAuth = false,
  redirectTo = '/prescription/create',
  onUnauthorizedAccess,
}) => {
  const router = useRouter();
  const { isGuestMode, isRouteAllowed } = useGuestModeStore();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    // 安全检查：确保router和相关函数存在
    if (!router || typeof router.replace !== 'function') {
      return;
    }

    // Guest模式下的处理逻辑
    if (isGuestMode) {
      // 首页重定向到处方创建页（或自定义重定向路径）
      if (router.pathname === '/') {
        router.replace(redirectTo);
        return;
      }

      // 如果强制要求认证，直接显示登录提示
      if (requireAuth) {
        setShowLoginPrompt(true);
        if (onUnauthorizedAccess) {
          onUnauthorizedAccess(router.pathname);
        }
        return;
      }

      // 检查当前路由是否被允许
      if (typeof isRouteAllowed === 'function') {
        const routeAllowed = isRouteAllowed(router.pathname);
        
        if (!routeAllowed) {
          setShowLoginPrompt(true);
          if (onUnauthorizedAccess) {
            onUnauthorizedAccess(router.pathname);
          }
          return;
        }
      }
    }

    // 如果通过所有检查，确保不显示登录提示
    setShowLoginPrompt(false);
  }, [
    router.pathname, 
    isGuestMode, 
    isRouteAllowed, 
    requireAuth, 
    redirectTo, 
    onUnauthorizedAccess,
    router
  ]);

  // 处理登录提示模态框关闭
  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  // 处理登录操作
  const handleLogin = () => {
    setShowLoginPrompt(false);
    // TODO: 集成实际的登录逻辑
    // 这里可以触发登录模态框或跳转到登录页面
  };

  // 处理注册操作
  const handleRegister = () => {
    setShowLoginPrompt(false);
    // TODO: 集成实际的注册逻辑
    // 这里可以触发注册模态框或跳转到注册页面
  };

  // 获取受限功能的显示名称
  const getRestrictedFeatureName = (pathname: string): string => {
    if (pathname.startsWith('/admin')) return '管理员功能';
    if (pathname.startsWith('/doctor')) return '医师工作站';
    if (pathname.startsWith('/pharmacy')) return '药房管理';
    return pathname;
  };

  // 如果需要显示登录提示，渲染模态框而不是子组件
  if (showLoginPrompt) {
    return (
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={handleCloseLoginPrompt}
        onLogin={handleLogin}
        onRegister={handleRegister}
        restrictedFeature={getRestrictedFeatureName(router.pathname || '')}
      />
    );
  }

  // 正常情况下渲染子组件
  return <>{children}</>;
};

// 设置displayName以便于调试
GuestModeGuard.displayName = 'GuestModeGuard';