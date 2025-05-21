import { AdminDashboardStats } from '@/types/admin';
import { allMockUsers } from '@/mocks/admin/mockUsers';
import { UserRole } from '@/types/auth';

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 获取管理员仪表盘统计数据
 */
export async function getDashboardStats(): Promise<AdminDashboardStats> {
  // 模拟API调用延迟
  await delay(800);
  
  // 计算用户总数
  const totalUsers = allMockUsers.length;
  
  // 计算活跃用户数
  const activeUsers = allMockUsers.filter(user => user.status === 'active').length;
  
  // 按角色统计用户数量
  const usersByRole = allMockUsers.reduce((acc, user) => {
    if (!acc[user.role]) {
      acc[user.role] = 0;
    }
    acc[user.role]++;
    return acc;
  }, {} as Record<UserRole, number>);
  
  // 确保所有角色都有值
  const roles: UserRole[] = ['admin', 'doctor', 'pharmacy', 'patient'];
  roles.forEach(role => {
    if (!usersByRole[role]) {
      usersByRole[role] = 0;
    }
  });
  
  // 获取最近登录记录
  const recentLogins = allMockUsers
    .filter(user => user.lastLogin)
    .sort((a, b) => {
      const dateA = new Date(a.lastLogin || 0).getTime();
      const dateB = new Date(b.lastLogin || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5)
    .map(user => ({
      userId: user.id,
      username: user.name,
      time: user.lastLogin || ''
    }));
  
  return {
    totalUsers,
    activeUsers,
    usersByRole,
    recentLogins
  };
} 