import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info } from "lucide-react"; // 使用 lucide-react 图标

const bannerTextMap = {
  title: {
    en: "TEST VERSION - FOR DEMONSTRATION PURPOSES ONLY",
    cn: "测试版本 - 仅供演示",
  },
  message: {
    en: "ALL DATA IS SIMULATED AND DOES NOT CONSTITUTE REAL MEDICAL ADVICE OR A TRANSACTION.",
    cn: "所有数据均为模拟，不构成真实医疗建议或交易。",
  },
  details: {
    en: "Please do not use for actual clinical activities.",
    cn: "请勿用于实际诊疗活动。",
  }
};

interface TestVersionBannerProps {
  position?: "top" | "bottom" | "inline";
  language?: "cn" | "en";
  showDetails?: boolean; // 是否显示更详细的提示
  iconType?: "warning" | "info";
  className?: string;
}

export const TestVersionBanner: React.FC<TestVersionBannerProps> = ({
  position = "inline", // 默认内联显示
  language = "cn",
  showDetails = true,
  iconType = "warning",
  className = "",
}) => {
  const title = bannerTextMap.title[language];
  const message = bannerTextMap.message[language];
  const details = bannerTextMap.details[language];

  const IconComponent = iconType === "warning" ? AlertTriangle : Info;

  const bannerBaseClasses =
    "p-3 text-sm z-50 border-l-4 flex items-start";
  
  const colorClasses = 
    iconType === "warning"
      ? "bg-yellow-50 border-yellow-400 text-yellow-700"
      : "bg-blue-50 border-blue-400 text-blue-700";

  const positionClasses = {
    top: "fixed top-0 left-0 right-0 shadow-md rounded-none",
    bottom: "fixed bottom-0 left-0 right-0 shadow-md rounded-none",
    inline: "my-4 rounded-md", // 内联时可以有圆角和上下边距
  };

  return (
    <div
      className={cn(
        bannerBaseClasses,
        colorClasses,
        positionClasses[position],
        className
      )}
      role="alert"
    >
      <IconComponent className="h-5 w-5 mr-3 flex-shrink-0" aria-hidden="true" />
      <div>
        <p className="font-bold">{title}</p>
        <p>{message}</p>
        {showDetails && <p className="mt-1 text-xs">{details}</p>}
      </div>
    </div>
  );
};

export default TestVersionBanner; 