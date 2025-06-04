import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/auth/LoginModal';
import { ClientOnly } from '@/components/common/ClientOnly';

export function Navbar() {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-lg font-bold">
            中医处方平台
          </Link>
          
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              href="/auth-test" 
              className={`px-3 py-1 rounded-md ${
                router.pathname === '/auth-test'
                  ? 'bg-primary-foreground/20'
                  : 'hover:bg-primary-foreground/10'
              }`}
            >
              认证测试
            </Link>
            
            <Link 
              href="/protected-route" 
              className={`px-3 py-1 rounded-md ${
                router.pathname === '/protected-route'
                  ? 'bg-primary-foreground/20'
                  : 'hover:bg-primary-foreground/10'
              }`}
            >
              受保护页面
            </Link>
            
            <Link 
              href="/doctor-only" 
              className={`px-3 py-1 rounded-md ${
                router.pathname === '/doctor-only'
                  ? 'bg-primary-foreground/20'
                  : 'hover:bg-primary-foreground/10'
              }`}
            >
              医生专用
            </Link>
            
            <ClientOnly>
              <AuthenticatedNavLinks />
            </ClientOnly>
          </div>
        </div>
        
        <div className="flex items-center">
          <ClientOnly fallback={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLoginModalOpen(true)}
              className="text-foreground"
            >
              登录
            </Button>
          }>
            <AuthStatus onLoginClick={() => setIsLoginModalOpen(true)} />
          </ClientOnly>
        </div>
      </div>
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </nav>
  );
}

// 认证后的导航链接组件
function AuthenticatedNavLinks() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  
  if (!isAuthenticated) return null;
  
  return (
    <>
      {user?.role === 'doctor' && (
        <Link 
          href="/prescription/create" 
          className={`px-3 py-1 rounded-md ${
            router.pathname === '/prescription/create'
              ? 'bg-primary-foreground/20'
              : 'hover:bg-primary-foreground/10'
          }`}
        >
          创建处方
        </Link>
      )}

      {user?.role === 'admin' && (
        <Link 
          href="/admin" 
          className={`px-3 py-1 rounded-md ${
            router.pathname.startsWith('/admin')
              ? 'bg-primary-foreground/20'
              : 'hover:bg-primary-foreground/10'
          }`}
        >
          管理控制台
        </Link>
      )}
    </>
  );
}

// 认证状态组件
function AuthStatus({ onLoginClick }: { onLoginClick: () => void }) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      
      // 如果在受保护的路由上，登出后重定向到首页
      if (router.pathname.startsWith('/protected') || 
          router.pathname.startsWith('/doctor-only') ||
          router.pathname.startsWith('/admin') ||
          router.pathname.startsWith('/prescription')) {
        router.push('/');
      }
    } catch (error) {
      console.error('登出错误:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-4">
        <div className="hidden md:block">
          <span className="text-sm opacity-90">
            {user?.name} ({user?.role})
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-foreground"
        >
          {isLoggingOut ? '登出中...' : '登出'}
        </Button>
      </div>
    );
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onLoginClick}
      className="text-foreground"
    >
      登录
    </Button>
  );
} 