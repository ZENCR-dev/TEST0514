import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import SimulatedActionModal from "./SimulatedActionModal";
// 导入类型
import type { AllowedButtonNames, AllowedActionDescriptions } from './SimulatedActionModal';

// 假设类型已导出，如果未导出，则需要先在SimulatedActionModal.tsx中导出它们
// import type { AllowedButtonNames, AllowedActionDescriptions } from './SimulatedActionModal';
// 为了简单起见，我们在这里重新定义，但最佳实践是导入共享类型
const buttonNameValues = ["打印处方单", "下载PDF", "分享处方单"] as const;
type AllowedButtonNamesTest = typeof buttonNameValues[number];

const actionDescriptionValues = ["打开打印对话框", "下载PDF文件", "打开分享选项"] as const;
type AllowedActionDescriptionsTest = typeof actionDescriptionValues[number];

/**
 * 测试组件：用于展示和测试SimulatedActionModal
 */
const SimulatedActionModalTest: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonName, setButtonName] = useState<AllowedButtonNames>("打印处方单");
  const [actionDescription, setActionDescription] = useState<AllowedActionDescriptions>("打开打印对话框");
  const [language, setLanguage] = useState<"cn" | "en">("cn");

  const handleOpenModal = (name: AllowedButtonNames, description: AllowedActionDescriptions) => {
    setButtonName(name);
    setActionDescription(description);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">模拟操作模态弹窗测试</h1>
      
      <div className="space-y-4 mb-8">
        <Button 
          onClick={() => handleOpenModal("打印处方单", "打开打印对话框")}
          className="mr-4"
        >
          测试打印按钮
        </Button>
        
        <Button 
          onClick={() => handleOpenModal("下载PDF", "下载PDF文件")}
          variant="outline"
          className="mr-4"
        >
          测试下载PDF按钮
        </Button>
        
        <Button 
          onClick={() => handleOpenModal("分享处方单", "打开分享选项")}
          variant="secondary"
        >
          测试分享按钮
        </Button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-md mb-8">
        <h2 className="text-lg font-medium mb-2">语言切换测试</h2>
        <div className="flex space-x-4">
          <Button 
            onClick={() => setLanguage("cn")}
            variant={language === "cn" ? "default" : "outline"}
            size="sm"
          >
            中文
          </Button>
          <Button 
            onClick={() => setLanguage("en")}
            variant={language === "en" ? "default" : "outline"}
            size="sm"
          >
            English
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-md">
        <h2 className="text-lg font-medium mb-2">当前设置</h2>
        <p><strong>按钮名称：</strong>{buttonName}</p>
        <p><strong>操作描述：</strong>{actionDescription}</p>
        <p><strong>语言：</strong>{language === "cn" ? "中文" : "英文"}</p>
      </div>
      
      <SimulatedActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        buttonName={buttonName}
        actionDescription={actionDescription}
        language={language}
      />
    </div>
  );
};

export default SimulatedActionModalTest; 