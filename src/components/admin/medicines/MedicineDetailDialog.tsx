/**
 * 中药详情对话框组件
 */
import React from 'react';
import Image from 'next/image';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Medicine } from '@/types/medicine';
import { formatDate, formatCurrency } from '@/utils/helpers';

interface MedicineDetailDialogProps {
  medicine: Medicine | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MedicineDetailDialog({
  medicine,
  isOpen,
  onClose
}: MedicineDetailDialogProps) {
  if (!medicine) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>中药详情 - {medicine.chineseName}</DialogTitle>
          <DialogDescription>
            查看中药详细信息及相关数据
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">基本信息</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">中文名：</div>
              <div className="text-sm font-medium">{medicine.chineseName}</div>
              
              <div className="text-sm text-gray-500">英文名：</div>
              <div className="text-sm">{medicine.englishName}</div>
              
              <div className="text-sm text-gray-500">拼音名：</div>
              <div className="text-sm">{medicine.pinyinName}</div>
              
              <div className="text-sm text-gray-500">单价：</div>
              <div className="text-sm">{formatCurrency(medicine.pricePerGram)}/克</div>
              
              <div className="text-sm text-gray-500">库存：</div>
              <div className="text-sm">{medicine.stock ?? '-'} {medicine.stock ? '克' : ''}</div>
              
              <div className="text-sm text-gray-500">药性：</div>
              <div className="text-sm">{medicine.properties || medicine.property || '-'}</div>
              
              <div className="text-sm text-gray-500">分类：</div>
              <div className="text-sm">{medicine.category || '-'}</div>
              
              <div className="text-sm text-gray-500">状态：</div>
              <div className="text-sm">
                {medicine.isActive !== undefined ? (
                  medicine.isActive ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      已启用
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      已禁用
                    </span>
                  )
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    未知
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">其他信息</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">创建时间：</div>
              <div className="text-sm">{medicine.createdAt ? formatDate(medicine.createdAt) : '-'}</div>
              
              <div className="text-sm text-gray-500">更新时间：</div>
              <div className="text-sm">{medicine.updatedAt ? formatDate(medicine.updatedAt) : '-'}</div>
              
              <div className="text-sm text-gray-500">ID：</div>
              <div className="text-sm text-gray-400">{medicine.id}</div>
            </div>
            
            {medicine.imageUrl && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">药材图片</h3>
                <div className="relative h-48 w-full bg-gray-100 rounded-md overflow-hidden">
                  <Image 
                    src={medicine.imageUrl} 
                    alt={medicine.name || medicine.chineseName || '药品图片'}
                    layout="fill"
                    objectFit="cover"
                    onError={(e) => {
                      // 图片加载失败时显示占位符
                      (e.target as HTMLImageElement).srcset = 'https://via.placeholder.com/200x150?text=图片加载失败';
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=图片加载失败';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {medicine.description && (
          <div className="space-y-2 border-t pt-4">
            <h3 className="text-sm font-medium text-gray-500">功效与应用</h3>
            <p className="text-sm whitespace-pre-line">{medicine.description}</p>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 