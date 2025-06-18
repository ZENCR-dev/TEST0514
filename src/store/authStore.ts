import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, LoginCredentials, User } from '@/types/auth';
import { loginUser, logoutUser } from '@/services/authService';

/**
 * 认证状态管理存储
 */
export const useAuthStore = create<AuthState & { checkAuth: () => Promise<void> }>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (credentials: LoginCredentials) => {
        try {
          const { user, token } = await loginUser(credentials);
          
          set({
            user,
            token,
            isAuthenticated: true,
          });
          
          return user;
        } catch (error) {
          throw error;
        }
      },
      
      logout: async () => {
        try {
          await logoutUser();
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error('登出错误:', error);
          throw error;
        }
      },

      checkAuth: async () => {
        // 检查本地存储中的认证状态
        // 当应用加载时，持久化中间件会自动恢复状态
        // 这里我们只需要做一些基本检查或刷新token的逻辑
        const state = get();
        console.log('检查认证状态:', state.isAuthenticated);
        
        // 如果需要验证token有效性，可以在这里添加逻辑
        // 例如发送请求到服务器验证token
        return Promise.resolve();
      }
    }),
    {
      name: 'tcm-auth-storage',
      storage: createJSONStorage(() => {
        // 在服务端返回一个空的存储实现
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      skipHydration: true,
    }
  )
); 