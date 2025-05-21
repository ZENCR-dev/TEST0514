import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { PriceMask } from '@/components/common/PriceMask';
import { LoginModal } from '@/components/auth/LoginModal';
import Link from 'next/link';
import { ConsentModal } from '@/components/common/ConsentModal';

export default function AuthTestPage() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [testResults, setTestResults] = useState<{
    test: string;
    passed: boolean;
    message?: string;
  }[]>([]);

  // 测试用户认证状态
  const testAuthState = () => {
    setTestResults(prev => [
      ...prev,
      {
        test: '认证状态检测',
        passed: typeof isAuthenticated === 'boolean',
        message: `当前认证状态: ${isAuthenticated ? '已认证' : '未认证'}`
      }
    ]);
  };

  // 测试登录功能
  const testLoginModal = () => {
    setIsLoginModalOpen(true);
    setTestResults(prev => [
      ...prev,
      {
        test: '登录模态框显示',
        passed: true,
        message: '登录模态框已打开'
      }
    ]);
  };

  // 测试价格遮罩
  const testPriceMask = () => {
    setTestResults(prev => [
      ...prev,
      {
        test: '价格遮罩测试',
        passed: true,
        message: '请检查下方价格显示是否正常：' + (isAuthenticated ? '已认证，显示清晰价格' : '未认证，价格被模糊处理')
      }
    ]);
  };

  // 测试当前用户信息
  const testUserInfo = () => {
    if (isAuthenticated && user) {
      setTestResults(prev => [
        ...prev,
        {
          test: '用户信息测试',
          passed: true,
          message: `用户名: ${user.name}, 角色: ${user.role}, ID: ${user.id}`
        }
      ]);
    } else {
      setTestResults(prev => [
        ...prev,
        {
          test: '用户信息测试',
          passed: false,
          message: '未登录，无法获取用户信息'
        }
      ]);
    }
  };

  // 测试登出功能
  const testLogout = async () => {
    try {
      await logout();
      setTestResults(prev => [
        ...prev,
        {
          test: '登出功能测试',
          passed: true,
          message: '登出成功'
        }
      ]);
    } catch (error) {
      setTestResults(prev => [
        ...prev,
        {
          test: '登出功能测试',
          passed: false,
          message: `登出失败: ${(error as Error).message}`
        }
      ]);
    }
  };

  // 测试同意模态框
  const testConsentModal = () => {
    setIsConsentModalOpen(true);
    setTestResults(prev => [
      ...prev,
      {
        test: '同意模态框显示',
        passed: true,
        message: '同意模态框已打开，请等待倒计时结束后确认按钮变为可点击状态'
      }
    ]);
  };

  // 清除测试结果
  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <MainLayout title="认证模块测试">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">认证模块功能测试</h1>
        
        <div className="grid gap-4 mb-8">
          <div className="p-4 border rounded-md">
            <h2 className="text-lg font-medium mb-2">当前认证状态</h2>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>{isAuthenticated ? '已登录' : '未登录'}</span>
            </div>
            {isAuthenticated && user && (
              <div className="mt-2 text-sm">
                <p>用户: {user.name}</p>
                <p>角色: {user.role}</p>
                <p>邮箱: {user.email}</p>
              </div>
            )}
          </div>

          <div className="p-4 border rounded-md">
            <h2 className="text-lg font-medium mb-4">保护路由测试</h2>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground mb-2">
                点击下方链接测试受保护路由。未登录状态下，将被重定向回首页。
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link href="/protected-route">访问受保护页面</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/doctor-only">访问医生专用页面</Link>
                </Button>
                {isAuthenticated && user?.role === 'admin' && (
                  <Button asChild variant="outline" className="bg-blue-50 border-blue-200">
                    <Link href="/admin">访问管理控制台</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-md">
            <h2 className="text-lg font-medium mb-4">价格遮罩测试</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2">价格展示:</p>
                <PriceMask 
                  price={99.99} 
                  className="text-xl font-bold" 
                />
              </div>
              <div>
                <p className="mb-2">格式化价格:</p>
                <PriceMask 
                  price={123.45} 
                  className="text-xl font-bold text-green-600"
                  formatter={(p) => `NZ$ ${p.toFixed(2)}`} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          <Button onClick={testAuthState}>测试认证状态</Button>
          <Button onClick={testLoginModal}>测试登录模态框</Button>
          <Button onClick={testPriceMask}>测试价格遮罩</Button>
          <Button onClick={testUserInfo}>测试用户信息</Button>
          <Button onClick={testLogout} variant="destructive">测试登出功能</Button>
          <Button onClick={testConsentModal} variant="default" className="bg-blue-600 hover:bg-blue-700">测试同意模态框</Button>
          <Button onClick={clearResults} variant="outline">清除测试结果</Button>
        </div>

        <div className="border rounded-md p-4">
          <h2 className="text-lg font-medium mb-4">测试结果</h2>
          {testResults.length === 0 ? (
            <p className="text-muted-foreground">无测试结果</p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-md ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${result.passed ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="font-medium">{result.test}</span>
                    <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                      {result.passed ? '通过' : '未通过'}
                    </span>
                  </div>
                  {result.message && (
                    <p className="mt-1 text-sm">{result.message}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setTestResults(prev => [
            ...prev,
            {
              test: '登录功能测试',
              passed: true,
              message: '登录成功'
            }
          ]);
        }}
      />

      <ConsentModal
        isOpen={isConsentModalOpen}
        onClose={() => {
          console.log('ConsentModal closed');
          setIsConsentModalOpen(false);
          setTestResults(prev => [
            ...prev,
            {
              test: '同意模态框关闭',
              passed: true,
              message: '用户取消了同意模态框'
            }
          ]);
        }}
        onConfirm={() => {
          console.log('ConsentModal confirmed');
          setIsConsentModalOpen(false);
          setTestResults(prev => [
            ...prev,
            {
              test: '同意模态框确认',
              passed: true,
              message: '用户成功确认了同意模态框（等待3秒后）'
            }
          ]);
        }}
        title="测试版本声明"
        consentMessage="我已阅读并理解此为测试版本，所有数据均为模拟，仅用于功能演示，不构成真实医疗建议或交易。此功能将用于医师端生成处方和药房端扫码前的合规提示。"
        confirmText="我已阅读并同意"
        cancelText="取消"
        waitTime={3}
        redirectOnCancel={false}
      />
    </MainLayout>
  );
} 