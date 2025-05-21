import React, { useState } from "react";
import TestVersionBanner from "./TestVersionBanner";
import { Button } from "@/components/ui/button";

const TestVersionBannerTest: React.FC = () => {
  const [language, setLanguage] = useState<"cn" | "en">("cn");
  const [showDetails, setShowDetails] = useState(true);
  const [iconType, setIconType] = useState<"warning" | "info">("warning");

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">测试版本横幅组件测试</h1>

      <div className="space-x-4 mb-4">
        <Button onClick={() => setLanguage("cn")} variant={language === 'cn' ? 'default' : 'outline'}>中文</Button>
        <Button onClick={() => setLanguage("en")} variant={language === 'en' ? 'default' : 'outline'}>English</Button>
        <Button onClick={() => setShowDetails(!showDetails)} variant="outline">
          {showDetails ? "隐藏详情" : "显示详情"}
        </Button>
        <Button onClick={() => setIconType(iconType === 'warning' ? 'info' : 'warning')} variant="outline">
          切换图标: {iconType === 'warning' ? "信息" : "警告"}
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">内联显示 (Inline)</h2>
        <TestVersionBanner 
          position="inline" 
          language={language} 
          showDetails={showDetails} 
          iconType={iconType} 
        />
      </div>

      <div className="bg-gray-100 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">顶部固定 (Top Fixed) - 页面其他内容会被遮挡部分，需自行处理</h2>
        <TestVersionBanner 
          position="top" 
          language={language} 
          showDetails={showDetails} 
          iconType={iconType} 
        />
        <p className="mt-20">这是在顶部横幅下方的内容，用于测试遮挡情况。</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">底部固定 (Bottom Fixed) - 页面其他内容会被遮挡部分，需自行处理</h2>
        <TestVersionBanner 
          position="bottom" 
          language={language} 
          showDetails={showDetails} 
          iconType={iconType} 
        />
        <p style={{ paddingBottom: '80px' }}>这是在底部横幅上方的内容，用于测试遮挡情况（已添加padding避免完全遮挡）。</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">内联显示 - 无详细信息 - 信息图标</h2>
        <TestVersionBanner 
          position="inline" 
          language={language} 
          showDetails={false} 
          iconType="info" 
          className="border-2 border-dashed border-purple-400" // 自定义额外样式
        />
      </div>
    </div>
  );
};

export default TestVersionBannerTest; 