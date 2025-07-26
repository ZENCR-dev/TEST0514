import React, { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useGuestModeStore } from '../../store/guestModeStore';
import { LoginPromptModal } from './LoginPromptModal';

interface GuestModeGuardProps {
  children: ReactNode;
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
    if (!router.isReady) return;

    if (shouldRedirectToHome() && router.pathname === '/') {
      router.replace('/prescription/create');
      return;
    }
    
    if (isGuestMode && requireAuth) {
      setShowLoginPrompt(true);
    } else if (isGuestMode && !isRouteAllowed(router.pathname)) {
      setShowLoginPrompt(true);
    }
  }, [router.pathname, router.isReady, isGuestMode, requireAuth, shouldRedirectToHome, isRouteAllowed]);

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
          router.push('/auth/login');
        }}
        onRegister={() => {
          setShowLoginPrompt(false);
          router.push('/auth/register');
        }}
        data-testid="login-prompt-modal"
      />
    );
  }

  return <>{children}</>;
};