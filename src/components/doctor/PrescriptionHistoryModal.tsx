import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar,
  User,
  FileText,
  CreditCard,
  Clock,
  Pill
} from 'lucide-react';
import { PrescriptionHistory } from '@/types/prescription';

/**
 * 处方历史详情 Modal 组件属性
 */
interface PrescriptionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: PrescriptionHistory;
}

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
 * 信息项组件
 */
const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  className?: string;
}> = ({ icon, label, value, className = "" }) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <div className="mt-0.5">{icon}</div>
    <div className="flex-1">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  </div>
);

/**
 * 处方历史详情 Modal 组件
 */
export const PrescriptionHistoryModal: React.FC<PrescriptionHistoryModalProps> = ({
  isOpen,
  onClose,
  history
}) => {
  /**
   * 格式化日期时间
   */
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  /**
   * 计算药品总价
   */
  const medicineTotal = history.items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="h-5 w-5" />
            处方详情 - {history.prescriptionId}
            <StatusBadge status={history.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                基本信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={<User className="h-4 w-4 text-muted-foreground" />}
                  label="患者姓名"
                  value={history.patientName}
                />
                <InfoItem
                  icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                  label="患者ID"
                  value={history.patientId}
                />
                <InfoItem
                  icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                  label="创建时间"
                  value={formatDateTime(history.createdAt)}
                />
                <InfoItem
                  icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                  label="更新时间"
                  value={formatDateTime(history.updatedAt)}
                />
                <InfoItem
                  icon={<Pill className="h-4 w-4 text-muted-foreground" />}
                  label="药品种类"
                  value={`${history.itemCount} 种`}
                />
                <InfoItem
                  icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                  label="帖数"
                  value={`${history.copies} 帖`}
                />
              </div>
            </CardContent>
          </Card>

          {/* 用法医嘱 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                用法医嘱
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm leading-relaxed">{history.instructions}</p>
              </div>
              {history.notes && (
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground mb-2">医师备注</div>
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">{history.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 药品清单 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Pill className="h-5 w-5" />
                药品清单
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {history.items.map((item, index) => (
                  <div 
                    key={`${item.medicineId}-${index}`}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{item.medicineName}</h4>
                        {item.medicineEnglishName && (
                          <span className="text-sm text-muted-foreground">
                            ({item.medicineEnglishName})
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        用量: {item.quantity}g × {history.copies}帖 = {item.quantity * history.copies}g
                        {item.notes && (
                          <span className="ml-2 text-blue-600">• {item.notes}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">¥{item.subtotal.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        ¥{item.pricePerGram.toFixed(2)}/g
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 费用明细 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                费用明细
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">药品费用</span>
                  <span>¥{medicineTotal.toFixed(2)}</span>
                </div>
                {history.prescriptionFee && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">处方费</span>
                    <span>¥{history.prescriptionFee.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>总计</span>
                  <span className="text-lg">¥{history.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 