/**
 * 中药删除确认对话框组件
 */
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Medicine } from '@/types/medicine';
import { deleteMedicine } from '@/services/medicineService';

interface MedicineDeleteDialogProps {
  medicine: Medicine | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

export function MedicineDeleteDialog({
  medicine,
  isOpen,
  onClose,
  onDeleteSuccess
}: MedicineDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!medicine) return;

    setIsDeleting(true);
    setError(null);

    try {
      const success = await deleteMedicine(medicine.id);
      if (success) {
        onDeleteSuccess();
        onClose();
      } else {
        setError('删除失败，请稍后重试');
      }
    } catch (err: any) {
      setError(`删除失败: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!medicine) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            您确定要删除这个中药吗？此操作不可撤销。
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <p>{error}</p>
            </Alert>
          )}

          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium text-gray-500">中药名称：</div>
              <div className="text-sm">{medicine.chineseName}</div>

              <div className="text-sm font-medium text-gray-500">英文名：</div>
              <div className="text-sm">{medicine.englishName}</div>

              <div className="text-sm font-medium text-gray-500">ID：</div>
              <div className="text-sm text-gray-400">{medicine.id}</div>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            删除后，与该中药相关的所有数据将被永久移除，无法恢复。
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '删除中...' : '确认删除'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 