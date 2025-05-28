import React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ConsentModal } from '@/components/common/ConsentModal';
import { ClientOnly } from '@/components/common/ClientOnly';
import { useState } from 'react';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <MainLayout title="首页 - 中医处方平台">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">欢迎来到中医处方平台</h1>
        
        <ClientOnly fallback={
          <div className="bg-card p-6 rounded-lg shadow-sm border mb-6">
            <h2 className="text-xl font-semibold mb-4">认证模块测试</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth-test">
                <Button size="lg">
                  开始测试认证模块
                </Button>
              </Link>
            </div>
          </div>
        }>
          <AuthenticatedContent />
        </ClientOnly>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <ClientOnly fallback={
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">当前认证状态</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">加载中...</p>
              </div>
            </div>
          }>
            <AuthStatusCard />
          </ClientOnly>
          
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">测试内容</h2>
            <ul className="list-disc list-inside text-left space-y-2">
              <li>用户登录与登出</li>
              <li>基于角色的访问控制</li>
              <li>受保护路由实现</li>
              <li>价格遮罩功能</li>
              <li>状态持久化存储</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">医生申请注册</h2>
          <p className="mb-4">
            如果您是执业中医师，并希望使用本平台开具电子处方，请点击下方按钮申请注册医生账户。
            我们会审核您的执业资质后开通账户。
          </p>
          
          <Link href="/register/doctor">
            <Button size="lg" variant="default" className="bg-blue-600 hover:bg-blue-700">
              申请医生账户
            </Button>
          </Link>
        </div>
      </div>
      <ConsentModal
        isOpen={isModalOpen}
        onClose={() => {
          console.log('ConsentModal closed');
          setIsModalOpen(false);
        }}
        onConfirm={() => {
          console.log('ConsentModal confirmed');
          setIsModalOpen(false);
        }}
        title="测试同意模态框"
        consentMessage="这是一个用于测试的同意声明。请仔细阅读并勾选下方同意框。"
        checkboxLabel="我已阅读并同意测试条款"
        confirmText="确认测试"
        cancelText="关闭测试"
      />
    </MainLayout>
  );
}

// 认证相关的内容组件
function AuthenticatedContent() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border mb-6">
      <h2 className="text-xl font-semibold mb-4">认证模块测试</h2>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/auth-test">
          <Button size="lg">
            开始测试认证模块
          </Button>
        </Link>
        
        {isAuthenticated && (
          <>
            {user?.role === 'admin' && (
              <Link href="/admin">
                <Button size="lg" variant="outline">
                  进入管理控制台
                </Button>
              </Link>
            )}
            
            {user?.role === 'doctor' && (
              <Link href="/doctor">
                <Button size="lg" variant="outline">
                  进入医生工作站
                </Button>
              </Link>
            )}
            
            {user?.role === 'pharmacy' && (
              <Link href="/pharmacy">
                <Button size="lg" variant="outline">
                  进入药房管理
                </Button>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// 认证状态卡片组件
function AuthStatusCard() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-4">当前认证状态</h2>
      {isAuthenticated ? (
        <div className="bg-green-50 p-4 rounded-md">
          <p className="text-green-700">已登录</p>
          <p className="mt-2">用户：{user?.name}</p>
          <p>角色：{user?.role}</p>
          
          {user?.role === 'admin' && (
            <div className="mt-4">
              <Link href="/admin">
                <Button size="sm" variant="outline">
                  进入管理控制台
                </Button>
              </Link>
            </div>
          )}
          
          {user?.role === 'doctor' && (
            <div className="mt-4">
              <Link href="/doctor">
                <Button size="sm" variant="outline">
                  进入医生工作站
                </Button>
              </Link>
            </div>
          )}
          
          {user?.role === 'pharmacy' && (
            <div className="mt-4">
              <Link href="/pharmacy">
                <Button size="sm" variant="outline">
                  进入药房管理
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-700">未登录</p>
          <p className="mt-2">请使用导航栏中的登录按钮进行登录</p>
        </div>
      )}
      
      {isAuthenticated && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">可用功能：</h3>
          <ul className="list-disc list-inside text-left space-y-1 text-sm">
            {user?.role === 'admin' && (
              <li>管理员仪表盘与用户管理</li>
            )}
            {user?.role === 'doctor' && (
              <li>处方开具与管理</li>
            )}
            {user?.role === 'pharmacy' && (
              <li>处方接收与药品配送</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
} 