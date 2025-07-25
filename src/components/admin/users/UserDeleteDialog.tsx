import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, AlertCircle } from 'lucide-react';
import { ExtendedUser } from '@/types/admin';
import { UserRole } from '@/types/auth';
import { deleteUser } from '@/services/admin/userService';

interface UserDeleteDialogProps {
  user: ExtendedUser | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (deletedUserId: string) => void;
}

export const UserDeleteDialog: React.FC<UserDeleteDialogProps> = ({
  user,
  open,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取角色显示名称
  const getRoleDisplayName = (role: UserRole): string => {
    const roleMap: Record<UserRole, string> = {
      admin: '管理员',
      doctor: '医生',
      pharmacy: '药房',
      practitioner: '医师',
      pharmacy_operator: '药房操作员',
      patient: '患者',
    };
    return roleMap[role] || role;
  };

  // 获取删除警告信息
  const getDeleteWarning = (user: ExtendedUser): string => {
    switch (user.role) {
      case 'doctor':
        return '删除医生账户将移除其所有历史处方记录和患者关联。';
      case 'pharmacy':
        return '删除药房账户将移除其所有处方处理记录和库存信息。';
      case 'admin':
        return '删除管理员账户将移除其管理权限，请确保有其他管理员账户。';
      default:
        return '删除此账户将移除用户的所有相关数据。';
    }
  };

  // 处理删除确认
  const handleDelete = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      await deleteUser(user.id);
      onSuccess(user.id);
      onClose();
    } catch (err) {
      console.error('删除用户失败:', err);
      setError(err instanceof Error ? err.message : '删除用户失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理对话框关闭
  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      onClose();
    }
  };

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <AlertDialogTitle className="text-lg">
              确认删除用户
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-2">
            <p>
              您确定要删除用户 <strong>{user.name}</strong> ({getRoleDisplayName(user.role)}) 吗？
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">警告：此操作无法撤销</p>
                  <p>{getDeleteWarning(user)}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              请输入用户名称 <strong>{user.name}</strong> 来确认删除操作。
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel onClick={handleClose} disabled={isLoading}>
            取消
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              确认删除
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 