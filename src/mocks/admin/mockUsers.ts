import { ExtendedUser } from '@/types/admin';
import { mockUsers } from '@/mocks/users';

/**
 * 扩展模拟用户数据，添加管理所需的字段
 */
export const mockExtendedUsers: ExtendedUser[] = mockUsers.map(user => ({
  ...user,
  status: 'active',
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  lastLogin: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
  phone: `+${Math.floor(Math.random() * 100)}-${Math.floor(Math.random() * 10000000000)}`,
  address: user.role === 'doctor' 
    ? '新西兰奥克兰中央区医疗中心' 
    : user.role === 'pharmacy' 
      ? '新西兰威灵顿中药房' 
      : '系统总部'
}));

// 增加更多模拟用户数据
const additionalUsers: ExtendedUser[] = [
  {
    id: 'user_doctor_2',
    name: '王医生',
    email: 'doctor2@example.com',
    role: 'doctor',
    status: 'active',
    createdAt: new Date(Date.now() - 5000000000).toISOString(),
    lastLogin: new Date(Date.now() - 100000000).toISOString(),
    phone: '+64-2233445566',
    address: '新西兰克赖斯特彻奇医院'
  },
  {
    id: 'user_pharmacy_2',
    name: '赵药师',
    email: 'pharmacy2@example.com',
    role: 'pharmacy',
    status: 'inactive',
    createdAt: new Date(Date.now() - 8000000000).toISOString(),
    lastLogin: new Date(Date.now() - 500000000).toISOString(),
    phone: '+64-9988776655',
    address: '新西兰皇后镇中心药房'
  },
  {
    id: 'user_doctor_3',
    name: '李医生',
    email: 'doctor3@example.com',
    role: 'doctor',
    status: 'active',
    createdAt: new Date(Date.now() - 2000000000).toISOString(),
    lastLogin: new Date(Date.now() - 50000000).toISOString(),
    phone: '+64-5566778899',
    address: '新西兰达尼丁中医诊所'
  }
];

// 合并所有用户数据
export const allMockUsers: ExtendedUser[] = [...mockExtendedUsers, ...additionalUsers]; 