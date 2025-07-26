import React, { useEffect } from 'react';
import { X, Cloud, Database, History, Star } from 'lucide-react';
import { useGuestModeStore } from '../../store/guestModeStore';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

const translations = {
  zh: {
    title: '立即登录，解锁完整功能',
    subtitle: '您正在使用演示模式，功能受限。登录后可以：',
    features: {
      cloudSave: '保存处方到云端',
      fullDatabase: '访问完整药品库',
      history: '查看历史记录',
      advanced: '使用高级功能'
    },
    buttons: {
      login: '立即登录',
      register: '免费注册',
      continueDemo: '继续演示'
    },
    closeLabel: '关闭对话框'
  },
  en: {
    title: 'Login to Unlock Full Features',
    subtitle: 'You are using demo mode with limited features. After login, you can:',
    features: {
      cloudSave: 'Save prescriptions to cloud',
      fullDatabase: 'Access complete medicine database', 
      history: 'View history records',
      advanced: 'Use advanced features'
    },
    buttons: {
      login: 'Login Now',
      register: 'Free Register',
      continueDemo: 'Continue Demo'
    },
    closeLabel: 'Close dialog'
  }
};

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister
}) => {
  const { language } = useGuestModeStore();
  const t = translations[language] || translations.zh;

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    }
  };

  const handleRegister = () => {
    if (onRegister) {
      onRegister();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      data-testid="login-prompt-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative"
        data-testid="modal-overlay"
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          data-testid="modal-close-button"
          aria-label={t.closeLabel}
          tabIndex={0}
        >
          <X size={24} />
        </button>

        {/* 标题 */}
        <h2 
          id="modal-title"
          className="text-xl font-bold text-gray-900 mb-2 pr-8"
        >
          {t.title}
        </h2>

        {/* 副标题 */}
        <p className="text-gray-600 mb-6">
          {t.subtitle}
        </p>

        {/* 功能特色列表 */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3" data-testid="feature-cloud-save">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Cloud size={16} className="text-blue-600" data-testid="icon-cloud" />
            </div>
            <span className="text-gray-700">{t.features.cloudSave}</span>
          </div>

          <div className="flex items-center space-x-3" data-testid="feature-full-database">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Database size={16} className="text-green-600" data-testid="icon-database" />
            </div>
            <span className="text-gray-700">{t.features.fullDatabase}</span>
          </div>

          <div className="flex items-center space-x-3" data-testid="feature-history">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <History size={16} className="text-purple-600" data-testid="icon-history" />
            </div>
            <span className="text-gray-700">{t.features.history}</span>
          </div>

          <div className="flex items-center space-x-3" data-testid="feature-advanced">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Star size={16} className="text-orange-600" data-testid="icon-advanced" />
            </div>
            <span className="text-gray-700">{t.features.advanced}</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            data-testid="login-button"
            tabIndex={0}
          >
            {t.buttons.login}
          </button>

          <button
            onClick={handleRegister}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            data-testid="register-button"
            tabIndex={0}
          >
            {t.buttons.register}
          </button>

          <button
            onClick={onClose}
            className="w-full text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 font-medium py-3 px-4 rounded-lg transition-colors"
            data-testid="continue-demo-button"
            tabIndex={0}
          >
            {t.buttons.continueDemo}
          </button>
        </div>
      </div>
    </div>
  );
};