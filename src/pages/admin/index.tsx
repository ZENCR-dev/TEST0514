import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AdminLayout } from '@/layouts/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { getDashboardStats } from '@/services/admin/dashboardService';
import { AdminDashboardStats } from '@/types/admin';
import { UserRole } from '@/types/auth';
import { 
  Users, 
  UserCheck, 
  ShieldCheck, 
  Tablets, 
  FileText, 
  CircleAlert
} from 'lucide-react';

// 角色显示名称映射
const roleDisplayNames: Record<UserRole, string> = {
  admin: '管理员',
  doctor: '医师',
  pharmacy: '药房',
  // patient: '患者' // Patient role is not defined in UserRole type
};

// 角色颜色映射
const roleColors: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-700',
  doctor: 'bg-blue-100 text-blue-700',
  pharmacy: 'bg-green-100 text-green-700',
  // patient: 'bg-amber-100 text-amber-700' // Patient role is not defined in UserRole type
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 验证用户是否有权限访问管理员界面
  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      router.replace('/');
    }
  }, [isAuthenticated, user, router]);

  // 获取仪表盘数据
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('获取仪表盘数据失败:', err);
        setError('获取数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // 加载状态显示
  if (loading) {
    return (
      <AdminLayout title="仪表盘 - 加载中">
        <div className="h-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">加载数据中...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // 错误状态显示
  if (error) {
    return (
      <AdminLayout title="仪表盘 - 错误">
        <div className="bg-destructive/10 border border-destructive/30 rounded-md p-6 mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            <CircleAlert className="text-destructive h-6 w-6" />
            <h2 className="text-lg font-medium text-destructive">出错了</h2>
          </div>
          <p className="mt-2 text-sm text-destructive/90">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-card border rounded-md text-sm hover:bg-muted transition-colors"
          >
            重新加载
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="仪表盘">
      {stats && (
        <div className="space-y-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">总用户数</p>
                  <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">活跃用户</p>
                  <h3 className="text-2xl font-bold">{stats.activeUsers}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% 的用户处于活跃状态
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <Tablets className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">药房账户</p>
                  <h3 className="text-2xl font-bold">{stats.usersByRole.pharmacy}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <FileText className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">医生账户</p>
                  <h3 className="text-2xl font-bold">{stats.usersByRole.doctor}</h3>
                </div>
              </div>
            </div>
          </div>
          
          {/* 用户分布 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-4">用户分布</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stats.usersByRole).map(([role, count]) => (
                  <div 
                    key={role} 
                    className={`p-4 rounded-md ${roleColors[role as UserRole]} flex flex-col items-center justify-center`}
                  >
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm mt-1">{roleDisplayNames[role as UserRole]}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">最近登录</h3>
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="space-y-4">
                {stats.recentLogins.map((login) => (
                  <div key={login.userId} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {login.username.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{login.username}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(login.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 功能卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border rounded-lg p-6 shadow-sm hover:border-primary/50 hover:shadow transition-all cursor-pointer" onClick={() => router.push('/admin/users')}>
              <h3 className="text-lg font-medium mb-2">用户管理</h3>
              <p className="text-sm text-muted-foreground">管理系统用户，包括医生、药房和患者账户。</p>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm hover:border-primary/50 hover:shadow transition-all cursor-pointer opacity-70">
              <h3 className="text-lg font-medium mb-2">中药管理</h3>
              <p className="text-sm text-muted-foreground">管理中药库存、价格以及相关信息。</p>
              <p className="mt-2 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded inline-block">即将推出</p>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm hover:border-primary/50 hover:shadow transition-all cursor-pointer opacity-70">
              <h3 className="text-lg font-medium mb-2">处方记录</h3>
              <p className="text-sm text-muted-foreground">查看和管理系统中的所有处方记录。</p>
              <p className="mt-2 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded inline-block">即将推出</p>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 