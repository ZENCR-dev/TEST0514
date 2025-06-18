/**
 * Error Toast Component
 * 新西兰中医处方平台 - 错误提示组件
 */

import React, { useEffect, useState } from 'react';
import { AlertCircle, X, RefreshCw, LogIn, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ProcessedError, ErrorSeverity, UserAction } from '@/lib/errorHandler';

interface ErrorToastProps {
  error: ProcessedError;
  onAction: (action: UserAction) => void;
  onClose: () => void;
}

export function ErrorToast({ error, onAction, onClose }: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  // 自动关闭逻辑
  useEffect(() => {
    if (error.config.autoClose && error.config.duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // 等待动画完成
      }, error.config.duration);

      return () => clearTimeout(timer);
    }
  }, [error.config.autoClose, error.config.duration, onClose]);

  // 获取图标
  const getIcon = () => {
    switch (error.severity) {
      case ErrorSeverity.INFO:
        return <Info className="h-4 w-4 text-blue-500" />;
      case ErrorSeverity.WARNING:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case ErrorSeverity.ERROR:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case ErrorSeverity.CRITICAL:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // 获取样式类
  const getAlertVariant = (): "default" | "destructive" => {
    switch (error.severity) {
      case ErrorSeverity.ERROR:
      case ErrorSeverity.CRITICAL:
        return "destructive";
      default:
        return "default";
    }
  };

  // 获取动作按钮图标
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'retry':
        return <RefreshCw className="h-3 w-3" />;
      case 'login':
        return <LogIn className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const handleAction = (action: UserAction) => {
    if (action.type === 'close') {
      setIsVisible(false);
      setTimeout(onClose, 300);
    } else {
      onAction(action);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`
      fixed top-4 right-4 z-50 w-96 max-w-sm
      transform transition-all duration-300 ease-in-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <Alert variant={getAlertVariant()} className="shadow-lg border">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2 flex-1">
            {getIcon()}
            <div className="flex-1 min-w-0">
              <AlertDescription className="text-sm">
                <div className="font-medium mb-1">
                  {error.message}
                </div>
                {error.context !== 'Unknown' && (
                  <div className="text-xs text-muted-foreground">
                    上下文: {error.context}
                  </div>
                )}
              </AlertDescription>
              
              {/* 用户操作按钮 */}
              {error.userActions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {error.userActions.map((action, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant={action.primary ? "default" : "outline"}
                      onClick={() => handleAction(action)}
                      className="h-7 px-2 text-xs"
                    >
                      {getActionIcon(action.type)}
                      <span className="ml-1">{action.label}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* 关闭按钮 */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleAction({ type: 'close', label: '关闭', primary: false })}
            className="h-6 w-6 p-0 ml-2 flex-shrink-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </Alert>
    </div>
  );
}

// ==================== 错误提示管理器组件 ====================

interface ErrorToastManagerProps {
  maxToasts?: number;
}

export function ErrorToastManager({ maxToasts = 3 }: ErrorToastManagerProps) {
  const [errors, setErrors] = useState<ProcessedError[]>([]);

  useEffect(() => {
    const handleError = (error: ProcessedError) => {
      // 只显示需要Toast的错误
      if (error.config.showToast) {
        setErrors(prev => {
          const newErrors = [error, ...prev];
          // 限制最大显示数量
          return newErrors.slice(0, maxToasts);
        });
      }
    };

    // 监听全局错误事件
    const handleGlobalError = (event: CustomEvent<ProcessedError>) => {
      handleError(event.detail);
    };

    window.addEventListener('app:error', handleGlobalError as EventListener);

    return () => {
      window.removeEventListener('app:error', handleGlobalError as EventListener);
    };
  }, [maxToasts]);

  const handleAction = (error: ProcessedError, action: UserAction) => {
    // 触发全局错误动作事件
    window.dispatchEvent(new CustomEvent('app:error-action', {
      detail: { error, action }
    }));

    // 如果是重试操作，不关闭Toast（让重试逻辑处理）
    if (action.type !== 'retry') {
      removeError(error.id);
    }
  };

  const removeError = (errorId: string) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
  };

  return (
    <div className="fixed top-0 right-0 z-50 pointer-events-none">
      <div className="flex flex-col gap-2 p-4 pointer-events-auto">
        {errors.map((error, index) => (
          <div
            key={error.id}
            style={{
              transform: `translateY(${index * 10}px)`,
              zIndex: 50 - index,
            }}
          >
            <ErrorToast
              error={error}
              onAction={(action) => handleAction(error, action)}
              onClose={() => removeError(error.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 