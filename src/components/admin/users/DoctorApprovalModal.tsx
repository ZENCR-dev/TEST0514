import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  Calendar
} from 'lucide-react';
import { ExtendedUser } from '@/types/admin';
import { approveDoctorAccount } from '@/services/admin/userService';

interface DoctorApprovalModalProps {
  doctor: ExtendedUser | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (approvedDoctor: ExtendedUser) => void;
}

export const DoctorApprovalModal: React.FC<DoctorApprovalModalProps> = ({
  doctor,
  open,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 处理审核通过
  const handleApprove = async () => {
    if (!doctor) return;

    setIsLoading(true);
    setError(null);

    try {
      const approvedDoctor = await approveDoctorAccount(doctor.id);
      onSuccess(approvedDoctor);
      onClose();
    } catch (err) {
      console.error('审核医生账户失败:', err);
      setError(err instanceof Error ? err.message : '审核医生账户失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理Modal关闭
  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      onClose();
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (!doctor || doctor.role !== 'doctor') return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            医生账户审核
          </DialogTitle>
          <DialogDescription>
            请审核以下医生账户信息并决定是否批准该账户申请
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* 账户状态 */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">当前状态:</span>
            <Badge 
              variant={doctor.status === 'active' ? 'default' : 'secondary'}
              className={doctor.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
            >
              {doctor.status === 'active' ? '已激活' : '待审核'}
            </Badge>
          </div>

          <Separator />

          {/* 基本信息 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">基本信息</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">姓名</p>
                  <p className="text-sm font-medium">{doctor.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">邮箱</p>
                  <p className="text-sm font-medium">{doctor.email}</p>
                </div>
              </div>

              {doctor.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">电话</p>
                    <p className="text-sm font-medium">{doctor.phone}</p>
                  </div>
                </div>
              )}

              {doctor.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">地址</p>
                    <p className="text-sm font-medium">{doctor.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* 专业信息 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">专业资质</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {doctor.hpiNumber && (
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">HPI编号</p>
                    <p className="text-sm font-medium">{doctor.hpiNumber}</p>
                  </div>
                </div>
              )}

              {doctor.apcCertificate && (
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">APC证书</p>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      已上传
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* 申请时间 */}
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">申请时间</p>
              <p className="text-sm font-medium">{formatDate(doctor.createdAt)}</p>
            </div>
          </div>

          {/* 审核说明 */}
          {doctor.status === 'inactive' && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">审核说明</p>
                  <p>
                    请确认以上信息的准确性和完整性。批准后，该医生将获得系统访问权限，
                    可以创建和管理患者处方。
                  </p>
                </div>
              </div>
            </div>
          )}

          {doctor.status === 'active' && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <p className="font-medium">该医生账户已通过审核</p>
                  <p>账户状态：已激活，可以正常使用系统功能。</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            关闭
          </Button>
          
          {doctor.status === 'inactive' && (
            <Button 
              onClick={handleApprove} 
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              批准账户
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 