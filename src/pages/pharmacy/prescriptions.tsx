import React, { useState, useEffect, useCallback } from 'react';
import { withAuth } from '@/components/auth/withAuth';
import { PharmacyLayout } from '@/layouts/PharmacyLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PrescriptionDetailModal } from '@/components/pharmacy/PrescriptionDetailModal';
import { 
  Search, 
  FileText, 
  Filter, 
  RefreshCw,
  Clock,
  PlayCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  Prescription, 
  PrescriptionStatus, 
  getPrescriptions, 
  getPrescriptionStats,
  PrescriptionSearchParams 
} from '@/services/prescriptionService';

function PrescriptionsPage() {
  // 状态管理
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 搜索和筛选
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PrescriptionStatus | 'all'>('all');
  
  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  
  // Modal状态
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  // 统计信息
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0
  });

  // 获取状态显示信息
  const getStatusInfo = (status: PrescriptionStatus) => {
    switch (status) {
      case 'pending':
        return { label: '待处理', color: 'bg-yellow-100 text-yellow-700', icon: Clock };
      case 'processing':
        return { label: '处理中', color: 'bg-blue-100 text-blue-700', icon: PlayCircle };
      case 'completed':
        return { label: '已完成', color: 'bg-green-100 text-green-700', icon: CheckCircle2 };
      case 'cancelled':
        return { label: '已取消', color: 'bg-red-100 text-red-700', icon: XCircle };
      default:
        return { label: '未知', color: 'bg-gray-100 text-gray-700', icon: AlertCircle };
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  // 加载处方数据
  const loadPrescriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: PrescriptionSearchParams = {
        query: searchTerm.trim(),
        status: statusFilter === 'all' ? undefined : statusFilter,
        pharmacyId: 'pharmacy_001', // 模拟当前药房ID
        page: currentPage,
        limit: itemsPerPage
      };
      
      const result = await getPrescriptions(params);
      setPrescriptions(result.data);
      setTotalPages(result.totalPages);
      setTotalItems(result.total);
    } catch (err) {
      console.error('加载处方数据失败:', err);
      setError('加载处方数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, currentPage]);

  // 加载统计数据
  const loadStats = useCallback(async () => {
    try {
      const statsData = await getPrescriptionStats('pharmacy_001');
      setStats(statsData);
    } catch (err) {
      console.error('加载统计数据失败:', err);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadPrescriptions();
    loadStats();
  }, [loadPrescriptions, loadStats]);

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadPrescriptions();
  };

  // 处理状态筛选
  const handleStatusFilter = (status: PrescriptionStatus | 'all') => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // 处理查看详情
  const handleViewDetail = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setDetailModalOpen(true);
  };

  // 处理状态更新
  const handleStatusUpdate = (updatedPrescription: Prescription) => {
    setPrescriptions(prev => 
      prev.map(p => p.id === updatedPrescription.id ? updatedPrescription : p)
    );
    loadStats(); // 重新加载统计数据
  };

  // 处理刷新
  const handleRefresh = () => {
    loadPrescriptions();
    loadStats();
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <PharmacyLayout title="处方管理 - 药房系统">
      <div className="space-y-6">
        {/* 页面标题和统计 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">处方管理</h1>
            <p className="text-sm text-gray-600 mt-1">查看和管理药房处方订单</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                <div className="text-lg font-semibold text-yellow-700">{stats.pending}</div>
                <div className="text-xs text-yellow-600">待处理</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                <div className="text-lg font-semibold text-blue-700">{stats.processing}</div>
                <div className="text-xs text-blue-600">处理中</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                <div className="text-lg font-semibold text-green-700">{stats.completed}</div>
                <div className="text-xs text-green-600">已完成</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                <div className="text-lg font-semibold text-gray-700">{stats.total}</div>
                <div className="text-xs text-gray-600">总计</div>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="搜索处方ID、患者姓名、医生姓名或电话号码"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待处理</SelectItem>
                  <SelectItem value="processing">处理中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                </SelectContent>
              </Select>
              
              <Button type="submit" disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                搜索
              </Button>
              
              <Button type="button" variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </form>
        </div>

        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 处方列表 */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="mt-2 text-gray-600">加载中...</p>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-600">暂无处方数据</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        处方信息
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        患者信息
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        医生
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        金额
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        时间
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {prescriptions.map((prescription) => {
                      const statusInfo = getStatusInfo(prescription.status);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <tr key={prescription.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {prescription.id}
                              </div>
                              <div className="text-sm text-gray-500">
                                {prescription.items.length} 种药品 · {prescription.copies} 帖
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {prescription.patientName}
                              </div>
                              {prescription.patientPhone && (
                                <div className="text-sm text-gray-500">
                                  {prescription.patientPhone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {prescription.doctorName}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            ¥{prescription.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={`${statusInfo.color} flex items-center gap-1 w-fit`}>
                              <StatusIcon className="h-3 w-3" />
                              {statusInfo.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {formatDate(prescription.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetail(prescription)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              查看
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
                  <div className="text-sm text-gray-700">
                    显示 {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} 条，共 {totalItems} 条记录
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      上一页
                    </Button>
                    
                    <span className="text-sm text-gray-700">
                      第 {currentPage} 页，共 {totalPages} 页
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      下一页
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 处方详情Modal */}
        <PrescriptionDetailModal
          prescription={selectedPrescription}
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </PharmacyLayout>
  );
}

export default withAuth(PrescriptionsPage, { allowedRoles: ['pharmacy'] }); 