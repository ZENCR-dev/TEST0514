/**
 * useErrorHandler Hook
 * 新西兰中医处方平台 - 错误处理Hook
 */

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ApiClientError } from '../lib/apiClient';
import { 
  errorHandler, 
  ProcessedError, 
  UserAction, 
  requiresAuthentication,
  isRetryable,
  handleError as processError
} from '../lib/errorHandler';
// import { useAuth } from './useAuth';

export interface UseErrorHandlerOptions {
  context?: string;
  onRetry?: () => void | Promise<void>;
  onAuthRequired?: () => void;
  showToast?: boolean;
  showModal?: boolean;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const router = useRouter();
  // const { logout } = useAuth();
  
  // 临时的logout函数，实际项目中应该使用useAuth
  const logout = () => {
    localStorage.removeItem('tcm_refresh_token');
    // 可以在这里添加其他清理逻辑
  };

  // 处理错误的主要函数
  const handleError = useCallback((error: Error | ApiClientError, context?: string) => {
    const processedError = processError(error, context || options.context);
    
    // 触发全局错误事件（用于Toast显示）
    if (options.showToast !== false && processedError.config.showToast) {
      window.dispatchEvent(new CustomEvent('app:error', {
        detail: processedError
      }));
    }

    return processedError;
  }, [options.context, options.showToast]);

  // 处理用户操作
  const handleErrorAction = useCallback(async (error: ProcessedError, action: UserAction) => {
    switch (action.type) {
      case 'retry':
        if (options.onRetry && isRetryable(error)) {
          try {
            await options.onRetry();
            // 重试成功，移除错误提示
            window.dispatchEvent(new CustomEvent('app:error-remove', {
              detail: { errorId: error.id }
            }));
          } catch (retryError) {
            // 重试失败，显示新的错误
            handleError(retryError as Error, 'Retry failed');
          }
        }
        break;

      case 'login':
        if (requiresAuthentication(error)) {
          if (options.onAuthRequired) {
            options.onAuthRequired();
          } else {
            // 默认行为：清除认证状态并跳转到登录页
            logout();
            router.push('/auth/login');
          }
        }
        break;

      case 'refresh':
        window.location.reload();
        break;

      case 'contact':
        // 可以在这里实现联系客服的逻辑
        window.open('mailto:support@tcm-platform.com', '_blank');
        break;

      case 'close':
        // Toast组件会自己处理关闭
        break;

      default:
        console.warn('Unknown error action type:', action.type);
    }
  }, [options.onRetry, options.onAuthRequired, logout, router]);

  // 监听全局错误动作事件
  useEffect(() => {
    const handleGlobalErrorAction = (event: CustomEvent<{ error: ProcessedError; action: UserAction }>) => {
      handleErrorAction(event.detail.error, event.detail.action);
    };

    window.addEventListener('app:error-action', handleGlobalErrorAction as EventListener);

    return () => {
      window.removeEventListener('app:error-action', handleGlobalErrorAction as EventListener);
    };
  }, [handleErrorAction]);

  // 便捷的错误处理函数
  const handleApiError = useCallback((error: ApiClientError, context?: string) => {
    return handleError(error, context);
  }, [handleError]);

  const handleNetworkError = useCallback((error: Error, context?: string) => {
    return handleError(error, context || 'Network operation');
  }, [handleError]);

  const handleValidationError = useCallback((message: string, details?: any) => {
    const error = new Error(message);
    return handleError(error, 'Form validation');
  }, [handleError]);

  // 创建带错误处理的异步函数包装器
  const withErrorHandling = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context?: string
  ) => {
    return async (...args: T): Promise<R | null> => {
      try {
        return await fn(...args);
      } catch (error) {
        handleError(error as Error, context);
        return null;
      }
    };
  }, [handleError]);

  // 创建带重试的异步函数包装器
  const withRetry = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    maxRetries: number = 3,
    context?: string
  ) => {
    return async (...args: T): Promise<R | null> => {
      let lastError: Error;
      
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await fn(...args);
        } catch (error) {
          lastError = error as Error;
          
          // 如果是最后一次尝试，处理错误
          if (attempt === maxRetries) {
            handleError(lastError, context);
            return null;
          }
          
          // 等待一段时间后重试
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
      
      return null;
    };
  }, [handleError]);

  return {
    // 主要错误处理函数
    handleError,
    handleApiError,
    handleNetworkError,
    handleValidationError,
    
    // 错误动作处理
    handleErrorAction,
    
    // 便捷包装器
    withErrorHandling,
    withRetry,
    
    // 工具函数
    requiresAuthentication,
    isRetryable,
  };
}

// ==================== 全局错误处理Hook ====================

/**
 * 全局错误处理Hook，用于设置应用级别的错误处理
 */
export function useGlobalErrorHandler() {
  const { handleError } = useErrorHandler();

  useEffect(() => {
    // 处理未捕获的Promise错误
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      handleError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        'Unhandled Promise Rejection'
      );
    };

    // 处理未捕获的JavaScript错误
    const handleJSError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error);
      handleError(
        event.error instanceof Error ? event.error : new Error(event.message),
        'Unhandled JavaScript Error'
      );
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleJSError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleJSError);
    };
  }, [handleError]);

  // 监听API客户端的认证失败事件
  useEffect(() => {
    const handleAuthLogout = (event: CustomEvent<{ reason: string }>) => {
      handleError(
        new Error('Authentication session expired'),
        'Token Refresh Failed'
      );
    };

    window.addEventListener('auth:logout', handleAuthLogout as EventListener);

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout as EventListener);
    };
  }, [handleError]);
} 