import React, { useState, useEffect, useCallback } from 'react';
import { DoctorLayout } from '@/layouts/DoctorLayout';
import { withAuth } from '@/components/auth/withAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  Calendar,
  Users,
  FileText,
  TrendingUp
} from 'lucide-react';
import { PrescriptionHistoryService } from '@/services/prescriptionHistoryService';
import { PrescriptionHistory, HistorySearchParams } from '@/types/prescription';
import { PrescriptionHistoryModal } from '@/components/doctor/PrescriptionHistoryModal';

/**
 * 状态徽章组件
 */
const StatusBadge: React.FC<{ status: PrescriptionHistory['status'] }> = ({ status }) => {
  const statusConfig = {
    completed: { label: '已完成', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
    pending: { label: '待处理', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
    cancelled: { label: '已取消', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
    expired: { label: '已过期', variant: 'outline' as const, className: 'bg-gray-100 text-gray-600' }
  };
  
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

/**
 * 统计卡片组件
 */
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}> = ({ title, value, icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

/**
 * 医师处方历史页面
 */
function DoctorHistoryPage() {
  const [history, setHistory] = useState<PrescriptionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<PrescriptionHistory | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // 搜索和过滤状态
  const [searchParams, setSearchParams] = useState<HistorySearchParams>({
    query: '',
    status: undefined,
    page: 1,
    limit: 10
  });
  
  // 分页状态
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 0
  });
  
  // 统计信息
  const [stats, setStats] = useState<Record<string, number>>({});

  /**
   * 加载处方历史数据
   */
  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await PrescriptionHistoryService.getHistory(searchParams);
      setHistory(result.data);
      setPagination({
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载处方历史失败');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  /**
   * 加载统计信息
   */
  const loadStats = useCallback(async () => {
    try {
      const statistics = await PrescriptionHistoryService.getStatusStatistics();
      setStats(statistics);
    } catch (err) {
      console.error('获取统计信息失败:', err);
    }
  }, []);

  // 初始化数据
  useEffect(() => {
    loadHistory();
    loadStats();
  }, [loadHistory, loadStats]);

  // 搜索参数变化时重新加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      loadHistory();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchParams, loadHistory]);

  /**
   * 处理搜索输入
   */
  const handleSearch = (query: string) => {
    setSearchParams(prev => ({
      ...prev,
      query,
      page: 1
    }));
  };

  /**
   * 处理状态筛选
   */
  const handleStatusFilter = (status: string) => {
    setSearchParams(prev => ({
      ...prev,
      status: status === 'all' ? undefined : status as PrescriptionHistory['status'],
      page: 1
    }));
  };

  /**
   * 处理分页
   */
  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({
      ...prev,
      page
    }));
  };

  /**
   * 查看处方详情
   */
  const handleViewDetail = (historyItem: PrescriptionHistory) => {
    setSelectedHistory(historyItem);
    setShowModal(true);
  };

  /**
   * 导出数据
   */
  const handleExport = async () => {
    try {
      const downloadUrl = await PrescriptionHistoryService.exportHistory(searchParams);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `prescription-history-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err instanceof Error ? err.message : '导出失败');
    }
  };

  /**
   * 格式化日期
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DoctorLayout title="处方历史 - 医师工作站">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">处方历史</h1>
            <p className="text-muted-foreground">查看和管理您的处方记录</p>
          </div>
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download size={16} />
            导出数据
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="总处方数"
            value={stats.total || 0}
            icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            description="历史处方记录总数"
          />
          <StatsCard
            title="已完成"
            value={stats.completed || 0}
            icon={<TrendingUp className="h-4 w-4 text-green-600" />}
            description="成功完成的处方"
          />
          <StatsCard
            title="待处理"
            value={stats.pending || 0}
            icon={<Calendar className="h-4 w-4 text-yellow-600" />}
            description="等待处理的处方"
          />
          <StatsCard
            title="取消/过期"
            value={(stats.cancelled || 0) + (stats.expired || 0)}
            icon={<Users className="h-4 w-4 text-red-600" />}
            description="已取消或过期的处方"
          />
        </div>

        {/* 搜索和筛选区域 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="搜索患者姓名、处方ID或备注..."
                    value={searchParams.query || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select 
                  value={searchParams.status || 'all'} 
                  onValueChange={handleStatusFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="状态筛选" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                    <SelectItem value="pending">待处理</SelectItem>
                    <SelectItem value="cancelled">已取消</SelectItem>
                    <SelectItem value="expired">已过期</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 错误提示 */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* 数据表格 */}
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">加载中...</div>
              </div>
            ) : history.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">暂无处方历史记录</div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>处方ID</TableHead>
                      <TableHead>患者姓名</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead>药品数量</TableHead>
                      <TableHead>帖数</TableHead>
                      <TableHead>总价</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.prescriptionId}</TableCell>
                        <TableCell className="font-medium">{item.patientName}</TableCell>
                        <TableCell>{formatDate(item.createdAt)}</TableCell>
                        <TableCell>{item.itemCount}种</TableCell>
                        <TableCell>{item.copies}帖</TableCell>
                        <TableCell className="font-medium">¥{item.totalPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(item)}
                            className="gap-1"
                          >
                            <Eye size={14} />
                            查看
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* 分页控件 */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-muted-foreground">
                      显示第 {((pagination.page - 1) * 10) + 1} - {Math.min(pagination.page * 10, pagination.total)} 条，
                      共 {pagination.total} 条记录
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                      >
                        上一页
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 处方详情 Modal */}
      {selectedHistory && (
        <PrescriptionHistoryModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedHistory(null);
          }}
          history={selectedHistory}
        />
      )}
    </DoctorLayout>
  );
}

export default withAuth(DoctorHistoryPage, { allowedRoles: ['doctor'] }); 