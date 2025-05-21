import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useRouter } from 'next/router';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  consentMessage?: string;
  checkboxLabel?: string;
  confirmText?: string;
  cancelText?: string;
  waitTime?: number; // 新增等待时间参数，单位：秒
  redirectOnCancel?: boolean; // 取消时是否重定向到首页
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "使用须知",
  consentMessage = "我已阅读并理解此为测试版本，所有数据均为模拟，仅用于功能演示，不构成真实医疗建议或交易，并同意相关使用条款。",
  checkboxLabel,
  confirmText = "我已阅读并同意",
  cancelText = "取消",
  waitTime = 3, // 默认等待3秒
  redirectOnCancel = true, // 默认取消时重定向
}) => {
  const [timeLeft, setTimeLeft] = useState(waitTime);
  const [canConfirm, setCanConfirm] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  // 重置状态当模态框打开/关闭时
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(waitTime);
      setCanConfirm(false);
      setIsChecked(false);
      
      // 倒计时逻辑
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            setCanConfirm(true);
            return 0;
          }
          return newTime;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isOpen, waitTime]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    if (redirectOnCancel) {
      // 关闭模态框并重定向到首页
      onClose();
      router.push('/');
    } else {
      // 仅关闭模态框
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4 transform transition-all duration-300 ease-in-out scale-100 opacity-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6 text-sm text-gray-600 space-y-2">
          <p>{consentMessage}</p>
        </div>

        {checkboxLabel && (
          <div className="flex items-center space-x-2 mb-6">
            <Checkbox id="consent-checkbox" checked={isChecked} onCheckedChange={(checked) => setIsChecked(checked === true)} />
            <Label htmlFor="consent-checkbox" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {checkboxLabel}
            </Label>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="px-4 py-2"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!canConfirm || (checkboxLabel ? !isChecked : false)}
            className="px-4 py-2"
          >
            {timeLeft > 0 ? `${confirmText} (${timeLeft}s)` : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal; 