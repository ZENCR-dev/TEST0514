import { LoginCredentials, LoginResponse, User, RegisterData } from '@/types/auth';
import { mockUsers, MOCK_PASSWORD } from '@/mocks/users';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 模拟登录服务
 * 在真实项目中，这应该是一个API调用
 */
export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  // 模拟网络请求延迟
  await delay(800);
  
  const { email, password } = credentials;
  
  // 查找用户
  const user = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  
  // 验证用户和密码
  if (!user || password !== MOCK_PASSWORD) {
    throw new Error('邮箱或密码错误');
  }
  
  // 生成模拟JWT令牌
  const token = `mock-jwt-token-${user.id}-${Date.now()}`;
  
  return {
    user,
    token
  };
}

/**
 * 模拟登出服务
 */
export async function logoutUser(): Promise<void> {
  // 模拟网络请求延迟
  await delay(300);
  
  // 在真实项目中，这里可能需要调用后端API来使令牌失效
  return Promise.resolve();
} 