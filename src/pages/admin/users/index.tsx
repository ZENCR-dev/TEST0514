import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AdminLayout } from '@/layouts/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { getUsers } from '@/services/admin/userService';
import { ExtendedUser, UserSearchParams } from '@/types/admin';
import { UserRole } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash,
  KeyRound,
  CircleAlert,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';

// 角色显示名称映射
const roleNames: Record<UserRole, string> = {
  admin: '管理员',
  doctor: '医生',
  pharmacy: '药房',
  // patient: '患者' // Patient role is not defined in UserRole type
};

// 角色标签颜色映射
const roleTagColors: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-700',
  doctor: 'bg-blue-100 text-blue-700',
  pharmacy: 'bg-green-100 text-green-700',
  // patient: 'bg-amber-100 text-amber-700' // Patient role is not defined in UserRole type
};

export default function UsersListPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState<UserSearchParams>({
    page: 1,
    limit: 10
  });

  // 验证用户是否有权限访问管理员界面
  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      router.replace('/');
    }
  }, [isAuthenticated, user, router]);

  // 获取用户列表
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await getUsers(searchParams);
        setUsers(result.data);
        setTotalPages(result.totalPages);
        setCurrentPage(result.page);
        setError(null);
      } catch (err) {
        console.error('获取用户列表失败:', err);
        setError('获取用户列表失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchParams]);

  // 处理搜索
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;
    
    setSearchParams(prev => ({
      ...prev,
      query: query || undefined,
      page: 1 // 重置到第一页
    }));
  };

  // 处理角色筛选
  const handleRoleFilter = (role: UserRole | undefined) => {
    setSearchParams(prev => ({
      ...prev,
      role,
      page: 1 // 重置到第一页
    }));
  };

  // 处理状态筛选
  const handleStatusFilter = (status: 'active' | 'inactive' | undefined) => {
    setSearchParams(prev => ({
      ...prev,
      status,
      page: 1 // 重置到第一页
    }));
  };

  // 处理分页
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    setSearchParams(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // 加载状态显示
  if (loading && users.length === 0) {
    return (
      <AdminLayout title="用户管理 - 加载中">
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
  if (error && users.length === 0) {
    return (
      <AdminLayout title="用户管理 - 错误">
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
    <AdminLayout title="用户管理">
      <div className="space-y-6">
        {/* 顶部操作栏 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">用户管理</h1>
            <p className="text-muted-foreground mt-1">管理系统用户，包括医生、药房和患者账户</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              className="w-full sm:w-auto"
              variant="outline"
              onClick={() => router.push('/admin/users/create')}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              创建药房账户
            </Button>
            
            <Button 
              className="w-full sm:w-auto"
              onClick={() => router.push('/admin/users/create-doctor')}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              创建医生账户
            </Button>
          </div>
        </div>
        
        {/* 搜索和筛选 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
              <Input 
                type="search" 
                name="query"
                placeholder="搜索用户名称、邮箱或地址..." 
                defaultValue={searchParams.query || ''}
                className="flex-1"
              />
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
          
          <div>
            <div className="relative">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => document.getElementById('roleFilter')?.click()}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {searchParams.role ? roleNames[searchParams.role] : '所有角色'}
                </Button>
              </div>
              
              <select
                id="roleFilter"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={searchParams.role || ''}
                onChange={(e) => handleRoleFilter(e.target.value as UserRole || undefined)}
              >
                <option value="">所有角色</option>
                <option value="admin">管理员</option>
                <option value="doctor">医生</option>
                <option value="pharmacy">药房</option>
                <option value="patient">患者</option>
              </select>
            </div>
          </div>
          
          <div>
            <div className="relative">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => document.getElementById('statusFilter')?.click()}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {searchParams.status === 'active' ? '活跃' : 
                   searchParams.status === 'inactive' ? '非活跃' : '所有状态'}
                </Button>
              </div>
              
              <select
                id="statusFilter"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={searchParams.status || ''}
                onChange={(e) => handleStatusFilter(e.target.value as 'active' | 'inactive' | undefined)}
              >
                <option value="">所有状态</option>
                <option value="active">活跃</option>
                <option value="inactive">非活跃</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* 用户列表 */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建日期</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          {user.phone && (
                            <p className="text-xs text-muted-foreground">{user.phone}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${roleTagColors[user.role]}`}>
                        {roleNames[user.role]}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.status === 'active' ? (
                        <div className="flex items-center gap-1 text-green-700">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-xs">活跃</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-amber-700">
                          <XCircle className="h-4 w-4" />
                          <span className="text-xs">非活跃</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(user.createdAt)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" title="编辑">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="删除">
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="重置密码">
                          <KeyRound className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    没有找到用户
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              显示 {users.length} 个用户中的 {(currentPage - 1) * searchParams.limit! + 1}-
              {Math.min(currentPage * searchParams.limit!, users.length)} 个
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 