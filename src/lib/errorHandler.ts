/**
 * Error Handler Utilities
 * 新西兰中医处方平台 - 错误处理工具
 * 
 * 提供用户友好的错误提示和处理功能
 */

import { ApiClientError, ErrorType } from './apiClient';

// ==================== 错误提示配置 ====================

export interface ErrorDisplayConfig {
  showToast: boolean;
  showModal: boolean;
  autoClose: boolean;
  duration: number;
  allowRetry: boolean;
  redirectOnAuth: boolean;
}

export const DEFAULT_ERROR_CONFIG: ErrorDisplayConfig = {
  showToast: true,
  showModal: false,
  autoClose: true,
  duration: 5000,
  allowRetry: false,
  redirectOnAuth: true,
};

// ==================== 错误严重程度分类 ====================

export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// ==================== 错误显示配置映射 ====================

const ERROR_TYPE_CONFIG: Record<ErrorType, Partial<ErrorDisplayConfig> & { severity: ErrorSeverity }> = {
  // 网络相关错误 - 通常可重试
  [ErrorType.NETWORK_ERROR]: {
    severity: ErrorSeverity.WARNING,
    allowRetry: true,
    duration: 6000,
  },
  [ErrorType.TIMEOUT_ERROR]: {
    severity: ErrorSeverity.WARNING,
    allowRetry: true,
    duration: 6000,
  },
  [ErrorType.CONNECTION_ERROR]: {
    severity: ErrorSeverity.WARNING,
    allowRetry: true,
    duration: 6000,
  },

  // 认证相关错误 - 需要重新登录
  [ErrorType.AUTH_ERROR]: {
    severity: ErrorSeverity.ERROR,
    showModal: true,
    autoClose: false,
    redirectOnAuth: true,
  },
  [ErrorType.TOKEN_EXPIRED]: {
    severity: ErrorSeverity.WARNING,
    redirectOnAuth: true,
    duration: 3000,
  },
  [ErrorType.TOKEN_INVALID]: {
    severity: ErrorSeverity.ERROR,
    showModal: true,
    redirectOnAuth: true,
  },
  [ErrorType.REFRESH_TOKEN_EXPIRED]: {
    severity: ErrorSeverity.ERROR,
    showModal: true,
    redirectOnAuth: true,
  },
  [ErrorType.UNAUTHORIZED]: {
    severity: ErrorSeverity.ERROR,
    showModal: true,
    redirectOnAuth: true,
  },
  [ErrorType.FORBIDDEN]: {
    severity: ErrorSeverity.ERROR,
    showModal: true,
    autoClose: false,
  },

  // 数据验证错误 - 用户需要修正输入
  [ErrorType.VALIDATION_ERROR]: {
    severity: ErrorSeverity.WARNING,
    duration: 8000,
  },
  [ErrorType.REQUIRED_FIELD_MISSING]: {
    severity: ErrorSeverity.WARNING,
    duration: 6000,
  },
  [ErrorType.INVALID_FORMAT]: {
    severity: ErrorSeverity.WARNING,
    duration: 6000,
  },
  [ErrorType.DUPLICATE_ENTRY]: {
    severity: ErrorSeverity.WARNING,
    duration: 6000,
  },

  // 业务逻辑错误
  [ErrorType.BUSINESS_ERROR]: {
    severity: ErrorSeverity.ERROR,
    duration: 8000,
  },
  [ErrorType.RESOURCE_NOT_FOUND]: {
    severity: ErrorSeverity.WARNING,
    duration: 5000,
  },
  [ErrorType.PERMISSION_DENIED]: {
    severity: ErrorSeverity.ERROR,
    showModal: true,
    autoClose: false,
  },
  [ErrorType.OPERATION_NOT_ALLOWED]: {
    severity: ErrorSeverity.WARNING,
    duration: 6000,
  },

  // 服务器错误 - 通常可重试
  [ErrorType.SERVER_ERROR]: {
    severity: ErrorSeverity.ERROR,
    allowRetry: true,
    duration: 8000,
  },
  [ErrorType.DATABASE_ERROR]: {
    severity: ErrorSeverity.CRITICAL,
    showModal: true,
    autoClose: false,
  },
  [ErrorType.SERVICE_UNAVAILABLE]: {
    severity: ErrorSeverity.ERROR,
    allowRetry: true,
    duration: 8000,
  },

  // 未知错误
  [ErrorType.UNKNOWN_ERROR]: {
    severity: ErrorSeverity.CRITICAL,
    showModal: true,
    autoClose: false,
  },
};

// ==================== 错误处理器主类 ====================

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: Array<(error: ProcessedError) => void> = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * 注册错误监听器
   */
  addErrorListener(listener: (error: ProcessedError) => void): void {
    this.errorListeners.push(listener);
  }

  /**
   * 移除错误监听器
   */
  removeErrorListener(listener: (error: ProcessedError) => void): void {
    const index = this.errorListeners.indexOf(listener);
    if (index > -1) {
      this.errorListeners.splice(index, 1);
    }
  }

  /**
   * 处理错误并触发相应的用户提示
   */
  handleError(error: Error | ApiClientError, context?: string): ProcessedError {
    const processedError = this.processError(error, context);
    
    // 触发所有监听器
    this.errorListeners.forEach(listener => {
      try {
        listener(processedError);
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError);
      }
    });

    return processedError;
  }

  /**
   * 处理错误，生成用户友好的错误信息
   */
  private processError(error: Error | ApiClientError, context?: string): ProcessedError {
    if (error instanceof ApiClientError) {
      return this.processApiClientError(error, context);
    } else {
      return this.processGenericError(error, context);
    }
  }

  /**
   * 处理ApiClientError
   */
  private processApiClientError(error: ApiClientError, context?: string): ProcessedError {
    const config = {
      ...DEFAULT_ERROR_CONFIG,
      ...ERROR_TYPE_CONFIG[error.type],
    };

    return {
      id: this.generateErrorId(),
      type: error.type,
      code: error.code,
      message: error.message,
      severity: config.severity,
      context: context || 'Unknown',
      timestamp: error.timestamp,
      config,
      originalError: error,
      userActions: this.generateUserActions(error, config),
    };
  }

  /**
   * 处理普通Error
   */
  private processGenericError(error: Error, context?: string): ProcessedError {
    const config = {
      ...DEFAULT_ERROR_CONFIG,
      ...ERROR_TYPE_CONFIG[ErrorType.UNKNOWN_ERROR],
    };

    return {
      id: this.generateErrorId(),
      type: ErrorType.UNKNOWN_ERROR,
      code: 'UNKNOWN_001',
      message: error.message || '发生未知错误',
      severity: config.severity,
      context: context || 'Unknown',
      timestamp: new Date().toISOString(),
      config,
      originalError: error,
      userActions: this.generateUserActions(null, config),
    };
  }

  /**
   * 生成用户可执行的操作
   */
  private generateUserActions(error: ApiClientError | null, config: ErrorDisplayConfig): UserAction[] {
    const actions: UserAction[] = [];

    // 重试操作
    if (config.allowRetry && error?.retryable) {
      actions.push({
        type: 'retry',
        label: '重试',
        primary: true,
      });
    }

    // 认证相关操作
    if (config.redirectOnAuth && error?.type && [
      ErrorType.AUTH_ERROR,
      ErrorType.TOKEN_EXPIRED,
      ErrorType.TOKEN_INVALID,
      ErrorType.REFRESH_TOKEN_EXPIRED,
      ErrorType.UNAUTHORIZED,
    ].includes(error.type)) {
      actions.push({
        type: 'login',
        label: '重新登录',
        primary: true,
      });
    }

    // 关闭操作
    actions.push({
      type: 'close',
      label: '关闭',
      primary: false,
    });

    return actions;
  }

  /**
   * 生成错误ID
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }
}

// ==================== 类型定义 ====================

export interface ProcessedError {
  id: string;
  type: ErrorType;
  code: string;
  message: string;
  severity: ErrorSeverity;
  context: string;
  timestamp: string;
  config: ErrorDisplayConfig;
  originalError: Error | ApiClientError;
  userActions: UserAction[];
}

export interface UserAction {
  type: 'retry' | 'login' | 'close' | 'contact' | 'refresh';
  label: string;
  primary: boolean;
}

// ==================== 便捷工具函数 ====================

/**
 * 全局错误处理器实例
 */
export const errorHandler = ErrorHandler.getInstance();

/**
 * 便捷的错误处理函数
 */
export function handleError(error: Error | ApiClientError, context?: string): ProcessedError {
  return errorHandler.handleError(error, context);
}

/**
 * 检查错误是否需要用户重新登录
 */
export function requiresAuthentication(error: ProcessedError): boolean {
  return [
    ErrorType.AUTH_ERROR,
    ErrorType.TOKEN_EXPIRED,
    ErrorType.TOKEN_INVALID,
    ErrorType.REFRESH_TOKEN_EXPIRED,
    ErrorType.UNAUTHORIZED,
  ].includes(error.type);
}

/**
 * 检查错误是否可重试
 */
export function isRetryable(error: ProcessedError): boolean {
  return error.config.allowRetry && 
         error.originalError instanceof ApiClientError && 
         error.originalError.retryable;
}

/**
 * 获取错误的用户友好描述
 */
export function getErrorDescription(error: ProcessedError): string {
  const descriptions: Record<ErrorType, string> = {
    [ErrorType.NETWORK_ERROR]: '网络连接出现问题，请检查您的网络设置后重试。',
    [ErrorType.TIMEOUT_ERROR]: '请求超时，可能是网络较慢，请稍后重试。',
    [ErrorType.CONNECTION_ERROR]: '无法连接到服务器，请检查网络连接。',
    [ErrorType.AUTH_ERROR]: '身份验证失败，请重新登录。',
    [ErrorType.TOKEN_EXPIRED]: '登录已过期，请重新登录以继续使用。',
    [ErrorType.TOKEN_INVALID]: '登录信息无效，请重新登录。',
    [ErrorType.REFRESH_TOKEN_EXPIRED]: '登录已过期，请重新登录。',
    [ErrorType.UNAUTHORIZED]: '您没有权限执行此操作，请先登录。',
    [ErrorType.FORBIDDEN]: '您没有足够的权限执行此操作。',
    [ErrorType.VALIDATION_ERROR]: '输入的信息有误，请检查后重新提交。',
    [ErrorType.REQUIRED_FIELD_MISSING]: '请填写所有必填字段。',
    [ErrorType.INVALID_FORMAT]: '输入格式不正确，请按要求填写。',
    [ErrorType.DUPLICATE_ENTRY]: '该信息已存在，请勿重复提交。',
    [ErrorType.BUSINESS_ERROR]: '操作失败，请检查输入信息或联系客服。',
    [ErrorType.RESOURCE_NOT_FOUND]: '请求的内容不存在或已被删除。',
    [ErrorType.PERMISSION_DENIED]: '您没有权限访问此内容。',
    [ErrorType.OPERATION_NOT_ALLOWED]: '当前不允许执行此操作。',
    [ErrorType.SERVER_ERROR]: '服务器出现问题，我们正在修复，请稍后重试。',
    [ErrorType.DATABASE_ERROR]: '数据库出现问题，请联系技术支持。',
    [ErrorType.SERVICE_UNAVAILABLE]: '服务暂时不可用，请稍后重试。',
    [ErrorType.UNKNOWN_ERROR]: '出现了意外错误，请联系技术支持。',
  };

  return descriptions[error.type] || error.message;
} 