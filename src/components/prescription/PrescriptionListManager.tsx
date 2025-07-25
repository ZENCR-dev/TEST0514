/**
 * 处方列表管理组件 - DAY 3 Stage 2 核心业务逻辑
 * 医师端处方列表管理和状态跟踪
 * 
 * @version 2.1 - Stage 2 Business Logic
 * @date 2025-01-21
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Plus,
  Eye,
  Edit,
  QrCode,
  Download,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Printer
} from 'lucide-react';

import { 
  Prescription, 
  PrescriptionStatus,
  PrescriptionSearchParams,
  PrescriptionListResponse
} from '@/types/prescription';
import { useAuth } from '@/hooks/useAuth';
import { 
  getPrescriptions, 
  updatePrescriptionStatus,
  getPrescriptionById,
  formatPrescriptionStatus,
  getPrescriptionStatusColor,
  generatePrescriptionQRCode,
  getPrescriptionPrintData
} from '@/services/prescriptionService';
import { PrescriptionCreator } from './PrescriptionCreator';

interface PrescriptionListManagerProps {
  doctorId?: string;
  showCreateButton?: boolean;
  defaultStatus?: PrescriptionStatus;
}

export function PrescriptionListManager({ 
  doctorId, 
  showCreateButton = true,
  defaultStatus
}: PrescriptionListManagerProps) {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // 搜索和筛选状态
  const [searchParams, setSearchParams] = useState<PrescriptionSearchParams>({
    search: '',
    status: defaultStatus,
    doctorId: doctorId || user?.id,
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // 分页状态
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // 统计状态
  const [stats, setStats] = useState({
    totalPrescriptions: 0,
    statusBreakdown: {} as Record<PrescriptionStatus, number>,
    totalValue: 0
  });

  // 加载处方列表
  const loadPrescriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiParams = {
        page: searchParams.page,
        limit: searchParams.limit,
        status: Array.isArray(searchParams.status) 
          ? searchParams.status.join(',') 
          : searchParams.status
      };
      const response: PrescriptionListResponse = await getPrescriptions(apiParams);
      setPrescriptions(response.prescriptions);
      setPagination(response.pagination);
      if (response.stats) {
        setStats(response.stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载处方列表失败');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // 初始加载
  useEffect(() => {
    loadPrescriptions();
  }, [searchParams, loadPrescriptions]);

  // 搜索处理
  const handleSearch = (search: string) => {
    setSearchParams(prev => ({ ...prev, search, page: 1 }));
  };

  // 状态筛选
  const handleStatusFilter = (status: PrescriptionStatus | 'all') => {
    setSearchParams(prev => ({ 
      ...prev, 
      status: status === 'all' ? undefined : status,
      page: 1 
    }));
  };

  // 排序处理
  const handleSort = (sortBy: string) => {
    setSearchParams(prev => ({
      ...prev,
      sortBy: sortBy as any,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc',
      page: 1
    }));
  };

  // 分页处理
  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  // 处方详情
  const handleViewDetail = async (prescription: Prescription) => {
    try {
      const fullPrescription = await getPrescriptionById(prescription.id);
      setSelectedPrescription(fullPrescription);
      setShowDetailModal(true);
    } catch (err) {
      setError('加载处方详情失败');
    }
  };

  // 状态更新
  const handleStatusUpdate = async (prescriptionId: string, newStatus: PrescriptionStatus) => {
    try {
      // 转换状态值为服务期望的格式
      const statusMap: Record<PrescriptionStatus, 'processing' | 'completed' | 'cancelled'> = {
        [PrescriptionStatus.DRAFT]: 'processing',
        [PrescriptionStatus.PENDING]: 'processing',
        [PrescriptionStatus.CONFIRMED]: 'processing',
        [PrescriptionStatus.PROCESSING]: 'processing',
        [PrescriptionStatus.COMPLETED]: 'completed',
        [PrescriptionStatus.CANCELLED]: 'cancelled',
        [PrescriptionStatus.EXPIRED]: 'cancelled'
      };
      
      await updatePrescriptionStatus(prescriptionId, statusMap[newStatus] || 'processing');
      
      // 刷新列表
      loadPrescriptions();
    } catch (err) {
      setError('更新处方状态失败');
    }
  };

  // 生成QR码
  const handleGenerateQR = async (prescriptionId: string) => {
    try {
      const qrResult = await generatePrescriptionQRCode(prescriptionId);
      // 这里可以显示QR码或下载
      console.log('QR码生成成功:', qrResult);
    } catch (err) {
      setError('生成QR码失败');
    }
  };

  // 打印处方
  const handlePrint = async (prescriptionId: string) => {
    try {
      const printData = await getPrescriptionPrintData(prescriptionId);
      window.open(printData.printUrl, '_blank');
    } catch (err) {
      setError('获取打印数据失败');
    }
  };

  // 处方创建成功回调
  const handlePrescriptionCreated = (newPrescription: Prescription) => {
    setShowCreateModal(false);
    loadPrescriptions(); // 刷新列表
  };

  // 获取状态图标
  const getStatusIcon = (status: PrescriptionStatus) => {
    switch (status) {
      case PrescriptionStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case PrescriptionStatus.PROCESSING:
        return <Clock className="w-4 h-4 text-orange-600" />;
      case PrescriptionStatus.CANCELLED:
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和统计 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">处方管理</h1>
          <p className="text-gray-600">
            共 {stats.totalPrescriptions} 个处方，总价值 ¥{stats.totalValue?.toFixed(2)}
          </p>
        </div>
        {showCreateButton && (
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                创建处方
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>创建新处方</DialogTitle>
              </DialogHeader>
              <PrescriptionCreator
                onSuccess={handlePrescriptionCreated}
                onCancel={() => setShowCreateModal(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* 状态统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(stats.statusBreakdown || {}).map(([status, count]) => (
          <Card key={status} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{formatPrescriptionStatus(status as PrescriptionStatus)}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
                {getStatusIcon(status as PrescriptionStatus)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索患者姓名、处方编号..."
                  value={searchParams.search || ''}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={Array.isArray(searchParams.status) ? searchParams.status[0] || 'all' : (searchParams.status || 'all')}
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="筛选状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {Object.values(PrescriptionStatus).map(status => (
                  <SelectItem key={status} value={status}>
                    {formatPrescriptionStatus(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={`${searchParams.sortBy}-${searchParams.sortOrder}`}
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-');
                setSearchParams(prev => ({ ...prev, sortBy: sortBy as any, sortOrder: sortOrder as any, page: 1 }));
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">创建时间（新到旧）</SelectItem>
                <SelectItem value="createdAt-asc">创建时间（旧到新）</SelectItem>
                <SelectItem value="totalAmount-desc">金额（高到低）</SelectItem>
                <SelectItem value="totalAmount-asc">金额（低到高）</SelectItem>
                <SelectItem value="status-asc">状态</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 处方列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            处方列表
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 mx-auto mb-4 animate-spin text-gray-400" />
              <p className="text-gray-600">加载中...</p>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无处方记录</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>处方编号</TableHead>
                    <TableHead>患者信息</TableHead>
                    <TableHead>药品数量</TableHead>
                    <TableHead>总金额</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell className="font-medium">
                        {prescription.prescriptionId || prescription.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">处方 #{prescription.id?.slice(-6) || '匿名'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {prescription.medicines.length} 种药品
                      </TableCell>
                      <TableCell>
                        ¥{(prescription.totalPrice || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`text-${getPrescriptionStatusColor(prescription.status as PrescriptionStatus)}-600 border-${getPrescriptionStatusColor(prescription.status as PrescriptionStatus)}-600`}
                        >
                          {getStatusIcon(prescription.status as PrescriptionStatus)}
                          <span className="ml-1">{formatPrescriptionStatus(prescription.status as PrescriptionStatus)}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(prescription.createdAt).toLocaleString('zh-CN')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(prescription)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGenerateQR(prescription.id)}
                          >
                            <QrCode className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePrint(prescription.id)}
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 分页 */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600">
                  显示 {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.totalItems)} 
                  共 {pagination.totalItems} 条记录
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    上一页
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    下一页
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 处方详情模态框 */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>处方详情</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">处方信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><span className="font-medium">处方ID：</span>#{selectedPrescription.id?.slice(-8) || '匿名处方'}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">处方信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><span className="font-medium">处方编号：</span>{selectedPrescription.prescriptionId || selectedPrescription.id}</p>
                    <p><span className="font-medium">创建时间：</span>{new Date(selectedPrescription.createdAt).toLocaleString('zh-CN')}</p>
                    <p><span className="font-medium">帖数：</span>{selectedPrescription.copies}帖</p>
                    <p><span className="font-medium">状态：</span>
                      <Badge className="ml-2">{formatPrescriptionStatus(selectedPrescription.status as PrescriptionStatus)}</Badge>
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* 药品列表 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">药品清单</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>药品名称</TableHead>
                        <TableHead>用量</TableHead>
                        <TableHead>单价</TableHead>
                        <TableHead>小计</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPrescription.medicines.map((medicine, index) => (
                        <TableRow key={medicine.medicineId || index}>
                          <TableCell>{medicine.chineseName || medicine.englishName}</TableCell>
                          <TableCell>{medicine.weight}{medicine.unit}</TableCell>
                          <TableCell>¥{(medicine.basePrice || 0).toFixed(2)}/{medicine.unit}</TableCell>
                          <TableCell>¥{((medicine.basePrice || 0) * medicine.weight).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* 用法用量 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">用法用量</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{selectedPrescription.notes || '暂无用法用量'}</p>
                </CardContent>
              </Card>

              {/* 费用明细 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">费用明细</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>药品费用：</span>
                    <span>¥{selectedPrescription.medicines.reduce((total, medicine) => 
                      total + (medicine.basePrice || 0) * medicine.weight, 0
                    ).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>处方费：</span>
                    <span>¥{(10).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>总计：</span>
                    <span>¥{(selectedPrescription.totalPrice || 0).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 