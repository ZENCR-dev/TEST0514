/**
 * Login Prompt Modal Component
 * MVP1.9 Guest模式登录引导弹窗组件
 * 
 * @description Guest模式下访问受限功能时显示的登录引导界面
 * @version 1.0.0
 * @date 2025-01-27
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGuestModeStore } from '@/store/guestModeStore';

/**
 * LoginPromptModal组件Props接口
 */
export interface LoginPromptModalProps {
  /** 是否显示模态框 */
  isOpen: boolean;
  /** 关闭模态框的回调函数 */
  onClose: () => void;
  /** 登录按钮点击回调 */
  onLogin?: () => void;
  /** 注册按钮点击回调 */
  onRegister?: () => void;
  /** 受限功能名称，用于显示给用户 */
  restrictedFeature?: string;
}

/**
 * Guest模式登录引导弹窗
 * 
 * 功能：
 * 1. 友好的用户转化界面设计
 * 2. 多语言支持（中英文）
 * 3. 三个操作选项：登录、注册、继续演示
 * 4. 清晰的受限功能说明
 */
export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  restrictedFeature = '此功能',
}) => {
  const { getTranslation, language } = useGuestModeStore();

  // 多语言文本
  const texts = {
    zh: {
      title: '体验完整功能需要登录',
      message: `您当前在演示模式下，要使用 ${restrictedFeature} 请先登录或注册`,
      loginButton: '立即登录',
      registerButton: '免费注册',
      continueButton: '继续演示',
      guestModeNote: '演示模式下您可以体验处方创建的完整功能'
    },
    en: {
      title: 'Login Required for Full Features',
      message: `You are currently in demo mode. To access ${restrictedFeature}, please login or register`,
      loginButton: 'Login Now',
      registerButton: 'Free Register',
      continueButton: 'Continue Demo',
      guestModeNote: 'In demo mode, you can experience the complete prescription creation features'
    }
  };

  const currentTexts = texts[language] || texts.zh;

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      // 默认行为：关闭模态框
      onClose();
    }
  };

  const handleRegister = () => {
    if (onRegister) {
      onRegister();
    } else {
      // 默认行为：关闭模态框
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            {currentTexts.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-center text-muted-foreground">
            {currentTexts.message}
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={handleLogin}
              className="w-full"
              size="lg"
            >
              {currentTexts.loginButton}
            </Button>
            
            <Button 
              onClick={handleRegister}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {currentTexts.registerButton}
            </Button>
            
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full"
              size="lg"
            >
              {currentTexts.continueButton}
            </Button>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-xs text-center text-muted-foreground">
              {currentTexts.guestModeNote}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 设置displayName以便于调试
LoginPromptModal.displayName = 'LoginPromptModal';