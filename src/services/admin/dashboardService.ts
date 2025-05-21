import { mockUsers } from '@/mocks/userData';
import { AdminDashboardStats, ExtendedUser } from '@/types/admin';
import { UserRole } from '@/types/auth';

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 获取管理员仪表盘统计数据
 */
export async function getDashboardStats(): Promise<AdminDashboardStats> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Initialize usersByRole with all UserRole keys and 0 count
  const usersByRole: Record<UserRole, number> = {
    admin: 0,
    doctor: 0,
    pharmacy: 0,
  };

  mockUsers.forEach(user => {
    // Ensure user.role is a valid UserRole key before incrementing
    if (user.role in usersByRole) {
      usersByRole[user.role]++;
    }
  });

  const totalUsers = mockUsers.length;
  // Simulate active users (e.g., users with a status property or recently active)
  // This is a placeholder as mockUsers currently doesn't have a status or lastLogin
  const activeUsers = mockUsers.filter(u => u.email.includes('example')).length; // Simplified active logic

  // Simulate recent logins (placeholder)
  const recentLogins = mockUsers.slice(0, 3).map(user => ({
    userId: user.id,
    username: user.name,
    time: new Date(Date.now() - Math.random() * 100000000).toISOString(),
  }));

  return {
    totalUsers,
    activeUsers,
    usersByRole, // Now this should be Record<UserRole, number>
    recentLogins,
  };
} 