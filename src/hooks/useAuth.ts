import { useAuthStore } from '@/store/authStore';
import { LoginCredentials, User, UserRole } from '@/types/auth';

/**
 * 认证钩子
 * 提供对认证状态的简便访问和相关功能
 */
export function useAuth() {
  const { user, isAuthenticated, token, login, logout, checkAuth } = useAuthStore();
  
  /**
   * 检查当前用户是否具有指定角色
   */
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!isAuthenticated || !user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };
  
  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    hasRole
  };
} 