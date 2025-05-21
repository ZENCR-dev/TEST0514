import { User } from '@/types/auth';

/**
 * 模拟用户数据
 * 用于测试阶段，真实项目应从API获取
 */
export const mockUsers: User[] = [
  {
    id: 'user_doctor_1',
    name: '张医生',
    email: 'doctor@example.com',
    role: 'doctor'
  },
  {
    id: 'user_pharmacy_1',
    name: '李药师',
    email: 'pharmacy@example.com',
    role: 'pharmacy'
  },
  {
    id: 'user_admin_1',
    name: '管理员',
    email: 'admin@example.com',
    role: 'admin'
  }
];

/**
 * 简单的密码验证 - 所有用户使用相同密码"password123"
 * 仅用于开发测试，生产环境应使用加密密码
 */
export const MOCK_PASSWORD = 'password123'; 