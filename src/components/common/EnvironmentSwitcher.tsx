/**
 * 环境切换器组件 - 联调专用
 * 新西兰中医处方平台
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ApiClient } from '@/lib/apiClient';

// 创建全局API客户端实例
const apiClient = new ApiClient();

interface EnvironmentSwitcherProps {
  className?: string;
}

export function EnvironmentSwitcher({ className = '' }: EnvironmentSwitcherProps) {
  const [currentEnv, setCurrentEnv] = useState<'integration' | 'mock' | 'custom'>('mock');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 检查当前环境
    setCurrentEnv(apiClient.getCurrentEnvironment());
    
    // 在开发环境或联调模式下显示
    const isDev = process.env.NODE_ENV === 'development';
    const isIntegrationPeriod = localStorage.getItem('tcm_show_env_switcher') === 'true';
    setIsVisible(isDev || isIntegrationPeriod);
  }, []);

  const handleSwitchToIntegration = () => {
    apiClient.switchToIntegrationMode();
    setCurrentEnv('integration');
    // 刷新页面以应用新的API环境
    window.location.reload();
  };

  const handleSwitchToMock = () => {
    apiClient.switchToMockMode();
    setCurrentEnv('mock');
    // 刷新页面以应用新的API环境
    window.location.reload();
  };

  const getEnvironmentInfo = () => {
    switch (currentEnv) {
      case 'integration':
        return {
          name: '联调环境',
          url: 'https://staging-api.tcm.onrender.com/api/v1',
          status: 'primary',
          description: '连接到后端Staging环境'
        };
      case 'mock':
        return {
          name: 'Mock环境',
          url: 'http://localhost:3001',
          status: 'secondary',
          description: '使用本地Mock数据'
        };
      default:
        return {
          name: '自定义环境',
          url: process.env.NEXT_PUBLIC_API_URL || '未知',
          status: 'outline',
          description: '使用自定义API端点'
        };
    }
  };

  if (!isVisible) {
    return null;
  }

  const envInfo = getEnvironmentInfo();

  return (
    <Card className={`fixed bottom-4 right-4 z-50 w-80 shadow-lg ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>🔧 API环境控制</span>
          <Badge variant={envInfo.status as any}>{envInfo.name}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-gray-600">
          <div className="font-medium">当前端点:</div>
          <div className="font-mono text-xs bg-gray-100 p-1 rounded mt-1">
            {envInfo.url}
          </div>
          <div className="text-gray-500 mt-1">{envInfo.description}</div>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={currentEnv === 'integration' ? 'default' : 'outline'}
            onClick={handleSwitchToIntegration}
            className="flex-1"
          >
            🚀 联调环境
          </Button>
          <Button
            size="sm"
            variant={currentEnv === 'mock' ? 'default' : 'outline'}
            onClick={handleSwitchToMock}
            className="flex-1"
          >
            🔧 Mock环境
          </Button>
        </div>

        {currentEnv === 'integration' && (
          <div className="text-xs bg-green-50 border border-green-200 rounded p-2">
            <div className="text-green-800 font-medium">✅ 联调模式已激活</div>
            <div className="text-green-600">所有API请求将发送到后端Staging环境</div>
          </div>
        )}

        {currentEnv === 'mock' && (
          <div className="text-xs bg-blue-50 border border-blue-200 rounded p-2">
            <div className="text-blue-800 font-medium">🔧 Mock模式已激活</div>
            <div className="text-blue-600">使用本地Mock数据，适合离线开发</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * 工具函数：启用环境切换器显示
 */
export function enableEnvironmentSwitcher() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tcm_show_env_switcher', 'true');
    console.log('🔧 环境切换器已启用');
  }
}

/**
 * 工具函数：禁用环境切换器显示
 */
export function disableEnvironmentSwitcher() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tcm_show_env_switcher', 'false');
    console.log('🔧 环境切换器已禁用');
  }
}

/**
 * 工具函数：快速切换到联调模式
 */
export function quickSwitchToIntegration() {
  const client = new ApiClient();
  client.switchToIntegrationMode();
  enableEnvironmentSwitcher();
  console.log('�� 快速切换到联调环境完成');
} 