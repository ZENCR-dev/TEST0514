import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 文本映射对象，支持中英文
const textMap = {
  title: {
    en: "Simulated Action",
    cn: "模拟操作",
  },
  body: {
    en: "This is a simulated action for \"[buttonName]\". In a live version, this would [actionDescription]. No actual file will be generated or shared in this test version.",
    cn: "此为针对\"[buttonName]\"的模拟操作。在正式版本中，此操作会[actionDescription]。在此测试版本中，不会生成或分享任何实际文件。",
  },
  button: {
    en: "Got it",
    cn: "知道了",
  },
  // 添加按钮名称的中英文映射
  buttonNames: {
    "打印处方单": {
      en: "Print Prescription",
      cn: "打印处方单"
    },
    "下载PDF": {
      en: "Download PDF",
      cn: "下载PDF"
    },
    "分享处方单": {
      en: "Share Prescription",
      cn: "分享处方单"
    }
  },
  // 添加操作描述的中英文映射
  actionDescriptions: {
    "打开打印对话框": {
      en: "open the print dialog",
      cn: "打开打印对话框"
    },
    "下载PDF文件": {
      en: "download a PDF file",
      cn: "下载PDF文件"
    },
    "打开分享选项": {
      en: "open sharing options",
      cn: "打开分享选项"
    }
  }
};

// 定义按钮名称的联合类型
export type AllowedButtonNames = keyof typeof textMap.buttonNames;
// 定义操作描述的联合类型
export type AllowedActionDescriptions = keyof typeof textMap.actionDescriptions;

interface SimulatedActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonName: AllowedButtonNames; // 使用更精确的类型
  actionDescription: AllowedActionDescriptions; // 使用更精确的类型
  language?: "cn" | "en"; // 默认使用中文
  className?: string;
}

/**
 * 模拟操作模态弹窗组件
 * 用于在用户点击"打印"、"下载PDF"等按钮后显示提示信息
 * 按钮在前5秒内禁用，倒计时结束后才能点击关闭弹窗
 */
export const SimulatedActionModal: React.FC<SimulatedActionModalProps> = ({
  isOpen,
  onClose,
  buttonName,
  actionDescription,
  language = "cn",
  className,
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [countdown, setCountdown] = useState(5);

  // 当弹窗打开时，开始5秒倒计时
  useEffect(() => {
    if (isOpen) {
      // 重置状态
      setIsButtonDisabled(true);
      setCountdown(5);

      // 设置倒计时
      const timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer);
            setIsButtonDisabled(false);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);

      // 清理函数
      return () => {
        clearInterval(timer);
      };
    }
  }, [isOpen]);

  // 获取本地化的按钮名称
  const getLocalizedButtonName = (name: AllowedButtonNames, lang: "cn" | "en"): string => {
    // 检查是否有针对这个按钮名称的映射
    // TypeScript 现在知道 'name' 必须是 textMap.buttonNames 中的一个键
    if (textMap.buttonNames[name]) { 
      return textMap.buttonNames[name][lang];
    }
    // 理论上这行不会执行，因为 name 的类型已经保证了它在映射中
    // 但为了以防万一或未来扩展，可以保留
    return name; 
  };

  // 获取本地化的操作描述
  const getLocalizedActionDescription = (desc: AllowedActionDescriptions, lang: "cn" | "en"): string => {
    // TypeScript 现在知道 'desc' 必须是 textMap.actionDescriptions 中的一个键
    if (textMap.actionDescriptions[desc]) {
      return textMap.actionDescriptions[desc][lang];
    }
    return desc;
  };

  // 构建文本内容，替换占位符
  const title = textMap.title[language];
  const bodyTemplate = textMap.body[language];
  const localizedButtonName = getLocalizedButtonName(buttonName, language);
  const localizedActionDescription = getLocalizedActionDescription(actionDescription, language);
  
  const body = bodyTemplate
    .replace("[buttonName]", localizedButtonName)
    .replace("[actionDescription]", localizedActionDescription);
  const buttonText = textMap.button[language];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn("sm:max-w-md", className)}
        onInteractOutside={(e) => {
          // 在按钮禁用期间防止通过点击外部关闭弹窗
          if (isButtonDisabled) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          // 在按钮禁用期间防止通过Esc键关闭弹窗
          if (isButtonDisabled) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{body}</DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-4">
          <Button
            onClick={onClose}
            disabled={isButtonDisabled}
            className={cn(
              "min-w-[100px]",
              isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
            )}
          >
            {isButtonDisabled
              ? `${buttonText} (${countdown}s)`
              : buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SimulatedActionModal; 