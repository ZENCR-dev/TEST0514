/**
 * API Client for TCM Prescription Platform
 * 新西兰中医处方平台 - 统一API客户端
 * 
 * Features:
 * - 自动Token管理和刷新
 * - 统一错误处理
 * - 请求/响应拦截器
 * - 重试机制
 */

// ==================== 类型定义 ====================

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta: {
    timestamp: string;
    pagination?: PaginationMeta;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// ==================== 错误类型枚举 ====================

export enum ErrorType {
  // 网络相关错误
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  
  // 认证相关错误
  AUTH_ERROR = 'AUTH_ERROR',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // 数据验证错误
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING',
  INVALID_FORMAT = 'INVALID_FORMAT',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  
  // 业务逻辑错误
  BUSINESS_ERROR = 'BUSINESS_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  
  // 服务器错误
  SERVER_ERROR = 'SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // 未知错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// ==================== 错误处理系统 ====================

/**
 * 标准化的API错误类
 */
export class ApiClientError extends Error {
  public readonly type: ErrorType;
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly details?: any;
  public readonly timestamp: string;
  public readonly retryable: boolean;

  constructor(
    type: ErrorType,
    code: string,
    message: string,
    statusCode?: number,
    details?: any,
    retryable: boolean = false
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.type = type;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.retryable = retryable;
  }
}

/**
 * 错误分类器 - 根据HTTP状态码和错误信息分类错误
 */
class ErrorClassifier {
  /**
   * 根据HTTP状态码分类错误
   */
  static classifyByStatusCode(statusCode: number, errorData?: any): { type: ErrorType; code: string; retryable: boolean } {
    switch (statusCode) {
      case 400:
        return {
          type: ErrorType.VALIDATION_ERROR,
          code: errorData?.error?.code || 'VALIDATION_001',
          retryable: false
        };
      case 401:
        return {
          type: ErrorType.UNAUTHORIZED,
          code: errorData?.error?.code || 'AUTH_001',
          retryable: false
        };
      case 403:
        return {
          type: ErrorType.FORBIDDEN,
          code: errorData?.error?.code || 'AUTH_003',
          retryable: false
        };
      case 404:
        return {
          type: ErrorType.RESOURCE_NOT_FOUND,
          code: errorData?.error?.code || 'RESOURCE_001',
          retryable: false
        };
      case 409:
        return {
          type: ErrorType.DUPLICATE_ENTRY,
          code: errorData?.error?.code || 'VALIDATION_002',
          retryable: false
        };
      case 422:
        return {
          type: ErrorType.VALIDATION_ERROR,
          code: errorData?.error?.code || 'VALIDATION_003',
          retryable: false
        };
      case 429:
        return {
          type: ErrorType.SERVER_ERROR,
          code: 'SERVER_003',
          retryable: true
        };
      case 500:
        return {
          type: ErrorType.SERVER_ERROR,
          code: errorData?.error?.code || 'SERVER_001',
          retryable: true
        };
      case 502:
      case 503:
      case 504:
        return {
          type: ErrorType.SERVICE_UNAVAILABLE,
          code: 'SERVER_002',
          retryable: true
        };
      default:
        return {
          type: ErrorType.UNKNOWN_ERROR,
          code: 'UNKNOWN_001',
          retryable: false
        };
    }
  }

  /**
   * 根据网络错误分类
   */
  static classifyNetworkError(error: Error): { type: ErrorType; code: string; retryable: boolean } {
    const message = error.message.toLowerCase();
    
    if (message.includes('timeout') || message.includes('aborted')) {
      return {
        type: ErrorType.TIMEOUT_ERROR,
        code: 'NETWORK_002',
        retryable: true
      };
    }
    
    if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
      return {
        type: ErrorType.CONNECTION_ERROR,
        code: 'NETWORK_001',
        retryable: true
      };
    }
    
    return {
      type: ErrorType.NETWORK_ERROR,
      code: 'NETWORK_003',
      retryable: true
    };
  }
}

// ==================== Token管理器 ====================

class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;
  private pendingRequests: Array<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
  }> = [];
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    // 从localStorage恢复refreshToken
    this.refreshToken = localStorage.getItem('tcm_refresh_token');
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('tcm_refresh_token', refreshToken);
    
    // 设置自动刷新定时器
    this.scheduleTokenRefresh(accessToken);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('tcm_refresh_token');
    this.isRefreshing = false;
    
    // 清除自动刷新定时器
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    
    // 拒绝所有等待的请求
    this.rejectPendingRequests(new Error('Tokens cleared'));
  }

  async refreshAccessToken(): Promise<string> {
    // 如果正在刷新，将请求加入队列
    if (this.isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        this.pendingRequests.push({ resolve, reject });
      });
    }

    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    this.isRefreshing = true;
    
    try {
      const newAccessToken = await this.performTokenRefresh();
      
      // 刷新成功，处理所有等待的请求
      this.resolvePendingRequests(newAccessToken);
      
      this.isRefreshing = false;
      return newAccessToken;
    } catch (error) {
      // 刷新失败，拒绝所有等待的请求
      this.rejectPendingRequests(error as Error);
      
      this.isRefreshing = false;
      this.clearTokens(); // 刷新失败，清除所有Token
      throw error;
    }
  }

  private resolvePendingRequests(token: string): void {
    this.pendingRequests.forEach(({ resolve }) => resolve(token));
    this.pendingRequests = [];
  }

  private rejectPendingRequests(error: Error): void {
    this.pendingRequests.forEach(({ reject }) => reject(error));
    this.pendingRequests = [];
  }

  /**
   * 检查Token是否即将过期（5分钟内过期）
   */
  private isTokenExpiringSoon(token: string): boolean {
    try {
      const payload = this.parseJWT(token);
      if (!payload.exp) return false;
      
      const expirationTime = payload.exp * 1000; // 转换为毫秒
      const currentTime = Date.now();
      const fiveMinutes = 5 * 60 * 1000; // 5分钟
      
      return (expirationTime - currentTime) <= fiveMinutes;
    } catch (error) {
      console.warn('Failed to parse JWT token:', error);
      return false;
    }
  }

  /**
   * 解析JWT Token获取payload
   */
  private parseJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid JWT token format');
    }
  }

  /**
   * 安排Token自动刷新
   */
  private scheduleTokenRefresh(accessToken: string): void {
    // 清除现有定时器
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    // 检查是否为有效的JWT格式
    if (!accessToken || !accessToken.includes('.')) {
      console.warn('Invalid token format, skipping auto-refresh scheduling');
      return;
    }

    try {
      const payload = this.parseJWT(accessToken);
      if (!payload.exp) {
        console.warn('Token has no expiration time, skipping auto-refresh scheduling');
        return;
      }

      const expirationTime = payload.exp * 1000; // 转换为毫秒
      const currentTime = Date.now();
      const fiveMinutes = 5 * 60 * 1000; // 5分钟
      
      // 计算刷新时间（过期前5分钟）
      const refreshTime = expirationTime - fiveMinutes - currentTime;
      
      if (refreshTime > 0) {
        this.refreshTimer = setTimeout(async () => {
          try {
            await this.refreshAccessToken();
            console.log('Token auto-refreshed successfully');
          } catch (error) {
            console.warn('Auto token refresh failed:', error);
          }
        }, refreshTime);
        
        console.log(`Token auto-refresh scheduled in ${Math.round(refreshTime / 1000)} seconds`);
      } else {
        console.warn('Token expires too soon, immediate refresh recommended');
      }
    } catch (error) {
      console.warn('Failed to schedule token refresh, token may not be a valid JWT:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const response = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: this.refreshToken
      })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data: ApiResponse<TokenRefreshResponse> = await response.json();
    
    if (!data.success) {
      throw new Error('Token refresh failed');
    }

    this.setTokens(data.data.accessToken, data.data.refreshToken);
    return data.data.accessToken;
  }
}

// ==================== API客户端主类 ====================

export class ApiClient {
  private baseURL: string;
  private tokenManager: TokenManager;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL?: string) {
    // 支持联调环境切换
    this.baseURL = baseURL || this.getApiBaseURL();
    this.tokenManager = new TokenManager();
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * 获取API基础URL - 支持联调环境切换
   */
  private getApiBaseURL(): string {
    // 优先级：环境变量 > 联调配置 > 默认本地
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }

    // 联调环境配置
    if (typeof window !== 'undefined') {
      const isIntegrationMode = localStorage.getItem('tcm_integration_mode') === 'true';
      if (isIntegrationMode) {
        return 'https://staging-api.tcm.onrender.com/api/v1';
      }
    }

    // 默认Mock/本地环境
    return 'http://localhost:3001';
  }

  /**
   * 切换到联调环境
   */
  switchToIntegrationMode(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tcm_integration_mode', 'true');
      this.baseURL = 'https://staging-api.tcm.onrender.com/api/v1';
      console.log('🚀 已切换到联调环境:', this.baseURL);
    }
  }

  /**
   * 切换到Mock环境
   */
  switchToMockMode(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tcm_integration_mode', 'false');
      this.baseURL = 'http://localhost:3001';
      console.log('🔧 已切换到Mock环境:', this.baseURL);
    }
  }

  /**
   * 获取当前API环境
   */
  getCurrentEnvironment(): 'integration' | 'mock' | 'custom' {
    if (this.baseURL.includes('staging-api.tcm.onrender.com')) {
      return 'integration';
    } else if (this.baseURL.includes('localhost:3001')) {
      return 'mock';
    } else {
      return 'custom';
    }
  }

  // ==================== 公共方法 ====================

  setTokens(accessToken: string, refreshToken: string): void {
    this.tokenManager.setTokens(accessToken, refreshToken);
  }

  clearTokens(): void {
    this.tokenManager.clearTokens();
  }

  isAuthenticated(): boolean {
    return this.tokenManager.getAccessToken() !== null;
  }

  // ==================== HTTP方法 ====================

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildURL(endpoint, params);
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const url = this.buildURL(endpoint);
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const url = this.buildURL(endpoint);
    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    const url = this.buildURL(endpoint);
    return this.request<T>(url, { method: 'DELETE' });
  }

  // ==================== 核心请求方法 ====================

  private async request<T>(
    url: string, 
    options: RequestInit,
    isRetry = false,
    retryCount = 0
  ): Promise<T> {
    // 准备请求头
    const headers = await this.prepareHeaders(options.headers);
    
    const requestOptions: RequestInit = {
      ...options,
      headers,
      // Note: timeout is handled by AbortController in production
    };

    try {
      const response = await fetch(url, requestOptions);
      
      // 处理401错误（Token过期）
      if (response && response.status === 401 && !isRetry) {
        try {
          await this.tokenManager.refreshAccessToken();
          // 重试原请求
          return this.request<T>(url, options, true, retryCount);
        } catch (refreshError) {
          // Token刷新失败，跳转到登录页
          this.handleAuthenticationFailure();
          throw new Error('Authentication failed');
        }
      }

      // 处理其他HTTP错误
      if (response && !response.ok) {
        const errorData = await response.json().catch(() => null);
        throw this.createApiError(response.status, errorData);
      }

      // 解析响应数据
      if (response) {
        const responseData: ApiResponse<T> | ApiError = await response.json();
        
        if (responseData.success) {
          return responseData.data;
        } else {
          throw this.createApiError(response.status, responseData);
        }
      } else {
        throw new Error('No response received');
      }

    } catch (error) {
      // 网络错误重试逻辑
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const classification = ErrorClassifier.classifyNetworkError(error);
        
        if (classification.retryable && retryCount < 3) { // 最多重试3次
          const delay = Math.pow(2, retryCount) * 1000; // 指数退避：1s, 2s, 4s
          console.warn(`Network error, retrying in ${delay}ms... (attempt ${retryCount + 1}/3)`);
          
          await this.delay(delay);
          return this.request<T>(url, options, isRetry, retryCount + 1);
        }
        
        // 重试次数用完或不可重试，抛出标准化错误
        throw new ApiClientError(
          classification.type,
          classification.code,
          `${getErrorMessage(classification.code)} (after ${retryCount + 1} attempts)`,
          undefined,
          { originalError: error.message, retryCount },
          false
        );
      }
      throw error;
    }
  }

  // ==================== 辅助方法 ====================

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async prepareHeaders(customHeaders?: HeadersInit): Promise<Record<string, string>> {
    const headers = { ...this.defaultHeaders };
    
    // 添加认证头
    const accessToken = this.tokenManager.getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // 合并自定义头
    if (customHeaders) {
      Object.assign(headers, customHeaders);
    }

    return headers;
  }

  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  private createApiError(status: number, errorData?: any): ApiClientError {
    const classification = ErrorClassifier.classifyByStatusCode(status, errorData);
    
    let message: string;
    if (errorData && !errorData.success && errorData.error) {
      message = errorData.error.message || getErrorMessage(classification.code);
    } else {
      message = getErrorMessage(classification.code);
    }
    
    return new ApiClientError(
      classification.type,
      classification.code,
      message,
      status,
      errorData,
      classification.retryable
    );
  }

  private handleAuthenticationFailure(): void {
    this.clearTokens();
    
    // 触发自定义事件，让应用层处理登录跳转
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:logout', {
        detail: { reason: 'token_refresh_failed' }
      }));
    }
    
    console.warn('Authentication failed, user should be redirected to login');
  }
}

// ==================== 单例实例 ====================

export const apiClient = new ApiClient();

// ==================== 错误处理工具 ====================

export const ERROR_MESSAGES: Record<string, string> = {
  // 认证相关错误
  'AUTH_001': '邮箱或密码错误，请重新输入',
  'AUTH_002': '登录已过期，请重新登录',
  'AUTH_003': '权限不足，无法访问该资源',
  'TOKEN_EXPIRED': 'Token已过期，请重新登录',
  'TOKEN_INVALID': 'Token无效，请重新登录',
  'REFRESH_TOKEN_EXPIRED': '登录已过期，请重新登录',
  'UNAUTHORIZED': '未授权访问，请先登录',
  'FORBIDDEN': '权限不足，无法执行此操作',
  
  // 网络相关错误
  'NETWORK_001': '网络连接失败，请检查网络设置',
  'NETWORK_002': '请求超时，请稍后重试',
  'NETWORK_003': '网络错误，请检查连接',
  
  // 数据验证错误
  'VALIDATION_001': '请求数据格式不正确',
  'VALIDATION_002': '该数据已存在，请勿重复提交',
  'VALIDATION_003': '数据验证失败，请检查输入内容',
  'REQUIRED_FIELD_MISSING': '必填字段缺失',
  'INVALID_FORMAT': '数据格式不正确',
  'DUPLICATE_ENTRY': '数据已存在',
  
  // 业务逻辑错误
  'RESOURCE_001': '请求的资源不存在',
  'BUSINESS_ERROR': '业务处理失败',
  'PERMISSION_DENIED': '权限不足',
  'OPERATION_NOT_ALLOWED': '操作不被允许',
  
  // 服务器错误
  'SERVER_001': '服务器内部错误，请稍后重试',
  'SERVER_002': '服务暂时不可用，请稍后重试',
  'SERVER_003': '请求过于频繁，请稍后重试',
  'DATABASE_ERROR': '数据库错误，请联系技术支持',
  'SERVICE_UNAVAILABLE': '服务暂时不可用',
  
  // 业务模块特定错误
  'MED_001': '药品信息加载失败，请刷新页面重试',
  'MED_002': '药品搜索失败，请重新尝试',
  'PRESCRIPTION_001': '处方创建失败，请检查输入信息',
  'PRESCRIPTION_002': '处方查询失败，请稍后重试',
  
  // 未知错误
  'UNKNOWN_001': '发生未知错误，请联系技术支持',
};

export function getErrorMessage(errorCode: string): string {
  return ERROR_MESSAGES[errorCode] || '发生未知错误，请联系技术支持';
}

// ==================== 默认导出 ====================

export default ApiClient; 