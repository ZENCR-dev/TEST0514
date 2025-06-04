import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { ExtendedUser, UserUpdateData } from '@/types/admin';
import { UserRole } from '@/types/auth';
import { updateUser } from '@/services/admin/userService';

// 表单验证Schema
const editUserSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符').max(50, '姓名不能超过50个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  phone: z.string().min(10, '电话号码至少需要10位数字').optional().or(z.literal('')),
  address: z.string().max(200, '地址不能超过200个字符').optional().or(z.literal('')),
  status: z.enum(['active', 'inactive'], {
    required_error: '请选择用户状态',
  }),
  hpiNumber: z.string().optional().or(z.literal('')),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface UserEditModalProps {
  user: ExtendedUser | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedUser: ExtendedUser) => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  user,
  open,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      status: 'active',
      hpiNumber: '',
    },
  });

  // 当用户数据变化时更新表单
  useEffect(() => {
    if (user && open) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        status: user.status || 'active',
        hpiNumber: user.hpiNumber || '',
      });
      setError(null);
    }
  }, [user, open, form]);

  // 处理表单提交
  const onSubmit = async (data: EditUserFormData) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // 准备更新数据，移除空字符串
      const updateData: UserUpdateData = {
        name: data.name,
        email: data.email,
        status: data.status,
      };

      // 只有非空值才包含在更新数据中
      if (data.phone?.trim()) {
        updateData.phone = data.phone.trim();
      }
      if (data.address?.trim()) {
        updateData.address = data.address.trim();
      }
      if (data.hpiNumber?.trim() && user.role === 'doctor') {
        updateData.hpiNumber = data.hpiNumber.trim();
      }

      const updatedUser = await updateUser(user.id, updateData);
      
      onSuccess(updatedUser);
      onClose();
      
      // 清理表单状态
      form.reset();
    } catch (err) {
      console.error('更新用户失败:', err);
      setError(err instanceof Error ? err.message : '更新用户失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理Modal关闭
  const handleClose = () => {
    if (!isLoading) {
      onClose();
      form.reset();
      setError(null);
    }
  };

  // 获取角色显示名称
  const getRoleDisplayName = (role: UserRole): string => {
    const roleMap: Record<UserRole, string> = {
      admin: '管理员',
      doctor: '医生',
      pharmacy: '药房',
    };
    return roleMap[role] || role;
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑用户</DialogTitle>
          <DialogDescription>
            修改 {user.name} ({getRoleDisplayName(user.role)}) 的信息
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 姓名 */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓名 *</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入姓名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 邮箱 */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱 *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="请输入邮箱" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 电话 */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>电话</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="请输入电话号码" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 状态 */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>状态 *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择用户状态" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">活跃</SelectItem>
                        <SelectItem value="inactive">停用</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* HPI编号 (仅医生角色显示) */}
            {user.role === 'doctor' && (
              <FormField
                control={form.control}
                name="hpiNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HPI编号</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="请输入HPI编号" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* 地址 */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>地址</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="请输入地址" 
                      className="resize-none" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                保存更改
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 