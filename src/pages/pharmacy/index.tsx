import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { withAuth } from '@/components/auth/withAuth';
import ConsentModal from '@/components/common/ConsentModal';
import { FunctionCard } from '@/components/pharmacy/FunctionCard';
import { QrCode, ClipboardList, History, Settings } from 'lucide-react';
import { PharmacyLayout } from '@/layouts/PharmacyLayout';

function PharmacyHomePage() {
  const { user } = useAuth();
  const [showConsent, setShowConsent] = useState(false);
  
  // 检查用户是否已经看到并同意了药房管理的免责声明
  useEffect(() => {
    // 仅在客户端运行
    if (typeof window !== 'undefined') {
      const hasSeenConsent = sessionStorage.getItem('hasSeenPharmacyConsent');
      if (!hasSeenConsent) {
        setShowConsent(true);
      }
    }
  }, []);

  // 处理用户确认同意
  const handleConsentConfirm = () => {
    // 标记用户已同意，保存到会话存储
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasSeenPharmacyConsent', 'true');
    }
    setShowConsent(false);
  };
  
  return (
    <PharmacyLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">药房控制台</h1>
        
        <div className="bg-primary/5 p-4 rounded-md mb-8">
          <p className="text-sm">
            欢迎使用药房管理系统，{user?.name}。您可以处理和管理中医处方的药材准备和配发流程。
            <span className="block mt-1 text-muted-foreground">所有数据均为模拟，仅用于功能演示。</span>
          </p>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">功能模块</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FunctionCard 
            title="扫描处方"
            description="扫描处方单二维码，查看处方详情"
            icon={QrCode}
            href="/pharmacy/scan"
          />
          <FunctionCard 
            title="处方查询"
            description="通过处方ID或患者信息查询处方"
            icon={ClipboardList}
            href="/pharmacy/prescriptions"
          />
          <FunctionCard 
            title="处方历史"
            description="查看已处理的处方历史记录"
            icon={History}
            href="/pharmacy/history"
            disabled={true}
          />
          <FunctionCard 
            title="药房设置"
            description="管理药房信息和偏好设置"
            icon={Settings}
            href="/pharmacy/settings"
            disabled={true}
          />
        </div>
      </div>
      
      {/* 同意模态框 */}
      <ConsentModal
        isOpen={showConsent}
        onClose={() => setShowConsent(false)}
        onConfirm={handleConsentConfirm}
        title="药房系统测试版声明"
        consentMessage="我已阅读并理解此药房管理系统为测试版本，所有处方和药物数据均为模拟，仅用于功能演示，不构成真实医疗建议或交易。继续使用表示您同意测试条款。"
        confirmText="我已阅读并同意"
        cancelText="取消"
        waitTime={3}
        redirectOnCancel={true}
      />
    </PharmacyLayout>
  );
}

// 使用withAuth HOC包装组件，限制只有pharmacy角色可以访问
export default withAuth(PharmacyHomePage, { allowedRoles: ['pharmacy'] }); 