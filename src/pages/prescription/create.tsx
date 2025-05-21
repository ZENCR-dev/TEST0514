import React, { useState, useRef, useEffect } from 'react';
import { NextPage } from 'next';
import { MedicineSearch } from '@/components/prescription/MedicineSearch';
import { MedicineList } from '@/components/prescription/MedicineList';
import { QuantityInput } from '@/components/prescription/QuantityInput';
import { PrescriptionActions } from '@/components/prescription/PrescriptionActions';
import { PrescriptionPreview } from '@/components/prescription/PrescriptionPreview';
import { PrescriptionInstructions } from '@/components/prescription/PrescriptionInstructions';
import { usePrescriptionStore } from '@/store/prescriptionStore';
import { Medicine } from '@/types/medicine';
import { withAuth } from '@/components/auth/withAuth';
import { UserRole } from '@/types/auth';
import TestVersionBanner from '@/components/common/TestVersionBanner';
import ConsentModal from '@/components/common/ConsentModal';

const CreatePrescriptionPage: NextPage = () => {
  const { 
    items, 
    copies, 
    addItem, 
    updateItemQuantity, 
    removeItem, 
    setCopies, 
    clearPrescription 
  } = usePrescriptionStore();
  
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [lastAddedItemId, setLastAddedItemId] = useState<string | undefined>(undefined);
  const [instructions, setInstructions] = useState<string>("");
  const [showConsent, setShowConsent] = useState(false);
  // 创建对搜索框组件的引用
  const searchRef = useRef<{ focusInput: () => void }>(null);

  // 检查用户是否已经看到并同意了处方创建的免责声明
  useEffect(() => {
    // 仅在客户端运行
    if (typeof window !== 'undefined') {
      const hasSeenConsent = sessionStorage.getItem('hasSeenPrescriptionConsent');
      if (!hasSeenConsent) {
        setShowConsent(true);
      }
    }
  }, []);

  // 处理用户确认同意
  const handleConsentConfirm = () => {
    // 标记用户已同意，保存到会话存储
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasSeenPrescriptionConsent', 'true');
    }
    setShowConsent(false);
  };

  // 处理选择药品
  const handleSelectMedicine = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
  };

  // 处理医嘱变更
  const handleInstructionsChange = (value: string) => {
    setInstructions(value);
  };

  // 处理确认添加药品
  const handleConfirmQuantity = (medicine: Medicine, quantity: number) => {
    // 添加药品并获取新添加的项目ID
    const newItemId = addItem(medicine, quantity);
    // 设置最后添加的项目ID用于高亮显示
    setLastAddedItemId(newItemId);
    
    // 清除选中的药品
    setSelectedMedicine(null);
    
    // 添加药品后重新聚焦到搜索框
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.focusInput();
      }
    }, 100);
    
    // 3秒后清除高亮效果
    setTimeout(() => {
      setLastAddedItemId(undefined);
    }, 3000);
  };

  // 处理取消添加药品
  const handleCancelQuantity = () => {
    setSelectedMedicine(null);
    
    // 取消添加药品后也重新聚焦到搜索框
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.focusInput();
      }
    }, 100);
  };

  // 处理生成处方单
  const handleGeneratePrescription = () => {
    setShowPreview(true);
  };

  // 处理完成处方
  const handleComplete = () => {
    // 关闭预览并清空购物车
    setShowPreview(false);
    clearPrescription();
    
    // 聚焦回搜索框
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.focusInput();
      }
    }, 100);
  };

  // u641cu7d22u4e0bu62c9u83dcu5355u6700u5927u9ad8u5ea6
  const searchDropdownMaxHeight = 520; 

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <h1 className="text-2xl font-bold p-4 flex-shrink-0">创建处方</h1>
      
      <div className="px-4">
        <TestVersionBanner language="cn" className="mb-4" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 左侧区域：包含搜索药品和固定在底部的处方操作 */}
        <div className="w-5/12 flex flex-col p-4 overflow-hidden">
          {/* 上部区域：搜索药品 */}
          <div className="flex-1 overflow-auto mb-4">
            <div className="bg-white p-6 rounded-lg shadow h-auto">
              <h2 className="text-xl font-semibold mb-4">搜索药品</h2>
              <MedicineSearch 
                ref={searchRef} 
                onSelectMedicine={handleSelectMedicine}
                maxDropdownHeight={searchDropdownMaxHeight} 
              />
            </div>
          </div>
          
          {/* 下部区域：固定处方操作模块 */}
          <div className="flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <PrescriptionActions
                copies={copies}
                onSetCopies={setCopies}
                onClearPrescription={clearPrescription}
                onGeneratePrescription={handleGeneratePrescription}
                isEmpty={items.length === 0}
                itemCount={items.length}
              />
            </div>
          </div>
        </div>
        
        {/* 右侧区域：处方药品列表占满整个右侧 */}
        <div className="w-7/12 p-4 h-full overflow-hidden">
          <div className="bg-white p-6 rounded-lg shadow h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4">处方药品列表</h2>
            <div className="flex-1 overflow-hidden">
              <MedicineList
                items={items}
                onUpdateQuantity={updateItemQuantity}
                onRemoveItem={removeItem}
                lastAddedItemId={lastAddedItemId}
              />
            </div>
            
            {/* 用法/医嘱文本框 */}
            <div className="mt-auto pt-4">
              <PrescriptionInstructions
                value={instructions}
                onChange={setInstructions}
                placeholder="水煎服，每次1剂，每日1次，服用200ml"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* u5f39u7a97u7ec4u4ef6 */}
      {selectedMedicine && (
        <QuantityInput
          medicine={selectedMedicine}
          onConfirm={handleConfirmQuantity}
          onCancel={handleCancelQuantity}
        />
      )}
      
      {showPreview && (
        <PrescriptionPreview
          items={items}
          copies={copies}
          instructions={instructions}
          onClose={() => setShowPreview(false)}
          onComplete={handleComplete}
        />
      )}

      {/* 同意模态框 */}
      <ConsentModal
        isOpen={showConsent}
        onClose={() => setShowConsent(false)}
        onConfirm={handleConsentConfirm}
        title="处方系统测试版声明"
        consentMessage="我已阅读并理解此处方系统为测试版本，所有处方和药物数据均为模拟，仅用于功能演示，不构成真实医疗建议或处方。继续使用表示您同意测试条款。"
        confirmText="我已阅读并同意"
        cancelText="取消"
        waitTime={3}
        redirectOnCancel={true}
      />
    </div>
  );
};

export default withAuth(CreatePrescriptionPage, { allowedRoles: ['doctor'] }); 