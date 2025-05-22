import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats, Html5QrcodeResult } from 'html5-qrcode';
// 注意：CSS已在globals.css中全局导入

export interface QrScannerProps {
  onScanSuccess: (decodedText: string, decodedResult: Html5QrcodeResult) => void;
  onScanFailure?: (error: any) => void;
  isActive: boolean;
  verbose?: boolean;
}

// 设备类型检测
const isMobileDevice = () => {
  // 检查是否为移动设备
  const userAgent = typeof window !== 'undefined' ? navigator.userAgent : '';
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
};

const QrScanner: React.FC<QrScannerProps> = ({ 
  onScanSuccess, 
  onScanFailure, 
  isActive, 
  verbose = false 
}) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerContainerId = "qr-reader";
  const isScanningRef = useRef<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 3; // 扫描指南的总页数
  
  // 在客户端初始化时检测设备类型
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);
  
  // 动态计算扫描框大小
  const getOptimalQrboxSize = useCallback(() => {
    // 获取容器宽度
    const container = document.getElementById(scannerContainerId);
    const containerWidth = container ? container.clientWidth : window.innerWidth;
    
    // 移动设备使用较小的扫描框
    if (isMobile) {
      const size = Math.min(containerWidth * 0.7, 250);
      return { width: size, height: size };
    }
    
    // 桌面设备使用较大的扫描框，以适应低质量摄像头
    const size = Math.min(containerWidth * 0.6, 300);
    return { width: size, height: size };
  }, [isMobile, scannerContainerId]);
  
  // 完全停止扫描器并释放摄像头
  const stopScannerCompletely = useCallback(() => {
    if (scannerRef.current) {
      if (verbose) console.log("[QrScanner] 完全停止扫描器并释放摄像头");
      try {
        // 先暂停扫描器，然后清理DOM
        scannerRef.current.clear();
        isScanningRef.current = false;
        
        // 移除可能存在的视频元素引用
        videoRef.current = null;
        
        // 延迟重置扫描器实例，确保所有资源都被释放
        setTimeout(() => {
          scannerRef.current = null;
        }, 100);
      } catch (error) {
        console.error("[QrScanner] 清理扫描器时出错:", error);
      }
    }
  }, [verbose]);
  
  // 处理成功扫描的回调函数
  const handleScanSuccess = useCallback((decodedText: string, decodedResult: Html5QrcodeResult) => {
    if (verbose) console.log("[QrScanner] 扫描成功:", decodedText);
    onScanSuccess(decodedText, decodedResult);
    
    // 成功后立即停止扫描并释放资源
    stopScannerCompletely();
  }, [onScanSuccess, verbose, stopScannerCompletely]);
  
  // 处理扫描失败的回调函数，过滤掉不重要的错误
  const handleScanFailure = useCallback((errorMessage: string) => {
    // 过滤掉正常的"未找到二维码"错误
    if (errorMessage.includes('NotFoundException') || 
        errorMessage.includes('No MultiFormat Readers were able to detect the code')) {
      if (verbose) console.warn(`[QrScanner] 当前帧未找到二维码: ${errorMessage}`);
      return;
    }
    
    if (verbose) console.error("[QrScanner] 扫描错误:", errorMessage);
    if (onScanFailure) {
      onScanFailure(errorMessage);
    }
  }, [onScanFailure, verbose]);
  
  // 创建/更新扫描框指导
  const updateScannerGuide = useCallback((width: number, height: number) => {
    try {
      // 查找扫描区域
      const scanRegion = document.querySelector('#qr-reader__scan_region');
      if (!scanRegion) return;
      
      // 清除旧的指导元素
      const oldGuideBox = document.querySelector('#qr-scanner-guide-box');
      if (oldGuideBox) oldGuideBox.remove();
      
      const oldGuideText = document.querySelector('#qr-scanner-guide-text');
      if (oldGuideText) oldGuideText.remove();
      
      // 创建新的指导框
      const guideBox = document.createElement('div');
      guideBox.id = 'qr-scanner-guide-box';
      scanRegion.appendChild(guideBox);
      
      // 创建新的指导文本
      const guideText = document.createElement('div');
      guideText.id = 'qr-scanner-guide-text';
      scanRegion.appendChild(guideText);
      
      // 设置指导框样式
      guideBox.style.position = 'absolute';
      guideBox.style.top = '50%';
      guideBox.style.left = '50%';
      guideBox.style.width = `${width}px`;
      guideBox.style.height = `${height}px`;
      guideBox.style.transform = 'translate(-50%, -50%)';
      guideBox.style.border = '2px dashed rgba(255, 255, 255, 0.7)';
      guideBox.style.borderRadius = '8px';
      guideBox.style.boxShadow = '0 0 0 9999px rgba(0, 0, 0, 0.5)';
      guideBox.style.zIndex = '2';
      guideBox.style.pointerEvents = 'none';
      
      // 添加角标
      const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      corners.forEach(corner => {
        const cornerEl = document.createElement('div');
        cornerEl.style.position = 'absolute';
        cornerEl.style.width = '20px';
        cornerEl.style.height = '20px';
        cornerEl.style.borderColor = '#ffffff';
        cornerEl.style.borderStyle = 'solid';
        
        if (corner === 'top-left') {
          cornerEl.style.top = '0';
          cornerEl.style.left = '0';
          cornerEl.style.borderWidth = '3px 0 0 3px';
          cornerEl.style.borderTopLeftRadius = '4px';
        } else if (corner === 'top-right') {
          cornerEl.style.top = '0';
          cornerEl.style.right = '0';
          cornerEl.style.borderWidth = '3px 3px 0 0';
          cornerEl.style.borderTopRightRadius = '4px';
        } else if (corner === 'bottom-left') {
          cornerEl.style.bottom = '0';
          cornerEl.style.left = '0';
          cornerEl.style.borderWidth = '0 0 3px 3px';
          cornerEl.style.borderBottomLeftRadius = '4px';
        } else if (corner === 'bottom-right') {
          cornerEl.style.bottom = '0';
          cornerEl.style.right = '0';
          cornerEl.style.borderWidth = '0 3px 3px 0';
          cornerEl.style.borderBottomRightRadius = '4px';
        }
        
        guideBox.appendChild(cornerEl);
      });
      
      // 添加扫描动画
      const scanLine = document.createElement('div');
      scanLine.style.position = 'absolute';
      scanLine.style.left = '0';
      scanLine.style.top = '0';
      scanLine.style.right = '0';
      scanLine.style.height = '2px';
      scanLine.style.background = 'linear-gradient(to right, transparent, rgba(82, 255, 168, 0.8) 50%, transparent)';
      scanLine.style.boxShadow = '0 0 8px rgba(82, 255, 168, 0.5)';
      scanLine.style.animation = 'scan-line 2s linear infinite';
      guideBox.appendChild(scanLine);
      
      // 添加动画样式
      const style = document.createElement('style');
      style.textContent = `
        @keyframes scan-line {
          0% { top: 0; }
          50% { top: calc(100% - 2px); }
          100% { top: 0; }
        }
      `;
      document.head.appendChild(style);
      
      // 设置指导文本样式
      guideText.style.position = 'absolute';
      guideText.style.top = `calc(50% + ${height/2 + 20}px)`;
      guideText.style.left = '50%';
      guideText.style.transform = 'translateX(-50%)';
      guideText.style.color = 'white';
      guideText.style.fontSize = '14px';
      guideText.style.zIndex = '3';
      guideText.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
      guideText.style.padding = '4px 12px';
      guideText.style.borderRadius = '4px';
      guideText.style.whiteSpace = 'nowrap';
      guideText.style.textAlign = 'center';
      
      // 为不同设备设置不同的指导文本
      guideText.textContent = isMobile 
        ? '请将二维码对准此框，保持稳定' 
        : '请将二维码靠近摄像头（5-15厘米）';
      
    } catch (error) {
      console.error("[QrScanner] 更新扫描指南时出错:", error);
    }
  }, [isMobile]);
  
  // 初始化后的处理函数，用于应用CSS覆盖和查找视频元素
  const applyCustomUI = useCallback(() => {
    try {
      // 隐藏Select Camera下拉菜单
      const selectElement = document.querySelector('#qr-reader__dashboard_section_csr select');
      if (selectElement) {
        (selectElement as HTMLElement).style.display = 'none';
      }
      
      // 隐藏手电筒按钮
      const torchButton = document.querySelector('#qr-reader__dashboard_section_torch button');
      if (torchButton) {
        (torchButton as HTMLElement).style.display = 'none';
      }
      
      // 隐藏Select Camera文字
      const selectLabel = document.querySelector('#qr-reader__dashboard_section_csr label');
      if (selectLabel) {
        (selectLabel as HTMLElement).style.display = 'none';
      }
      
      // 获取视频元素引用并应用样式
      const videoElement = document.querySelector('#qr-reader__scan_region video') as HTMLVideoElement;
      if (videoElement) {
        videoRef.current = videoElement;
        
        // 应用视频样式，确保其填满容器但保持比例
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.maxHeight = isMobile ? '80vh' : '400px';
        videoElement.style.objectFit = 'cover';
      }
      
      // 找到扫描区域元素
      const scanRegion = document.querySelector('#qr-reader__scan_region');
      if (scanRegion) {
        // 确保扫描区域有足够高度
        (scanRegion as HTMLElement).style.minHeight = isMobile ? '300px' : '400px';
        (scanRegion as HTMLElement).style.position = 'relative';
        (scanRegion as HTMLElement).style.overflow = 'hidden';
        (scanRegion as HTMLElement).style.background = '#000';
      }
      
      // 修改状态提示文本样式
      const statusSpan = document.querySelector('#qr-reader__status_span');
      if (statusSpan) {
        (statusSpan as HTMLElement).style.color = 'rgba(255, 255, 255, 0.7)';
        (statusSpan as HTMLElement).style.background = 'rgba(0, 0, 0, 0.5)';
        (statusSpan as HTMLElement).style.padding = '4px 8px';
        (statusSpan as HTMLElement).style.borderRadius = '4px';
        (statusSpan as HTMLElement).style.margin = '8px 0';
      }
      
      // 创建或更新扫描框指导元素
      const qrboxSize = getOptimalQrboxSize();
      updateScannerGuide(qrboxSize.width, qrboxSize.height);
      
    } catch (error) {
      console.error("[QrScanner] 应用自定义UI时出错:", error);
    }
  }, [isMobile, getOptimalQrboxSize, updateScannerGuide]);
  
  // 初始化扫描器 - 只在活动状态下创建
  useEffect(() => {
    if (isActive && !scannerRef.current) {
      if (verbose) console.log("[QrScanner] 创建扫描器实例");
      
      // 获取最佳扫描框尺寸
      const qrboxSize = getOptimalQrboxSize();
      
      const config = {
        fps: 10,
        qrbox: qrboxSize,
        aspectRatio: 1.0, // 保持视频流方形，便于对焦
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: false, // 禁用手电筒按钮
        showScanTypeSelector: false, // 隐藏摄像头选择UI
        defaultDeviceId: isMobile ? 'environment' : undefined, // 移动设备尝试使用后置摄像头
        // 自定义按钮文本
        textIfCameraAccessIsAllowed: "开始扫描",
        textIfCameraAccessIsBlocked: "请求相机权限",
        textIfCameraScanTakingLong: "正在获取相机...",
        textIfCameraPermissionIsRequired: "需要访问相机以扫描二维码",
        textIfFileScanningIsNotSupported: "不支持文件扫描",
        textIfImageScanningIsNotSupported: "不支持图片扫描",
        textForFileSelectionUiComponent: "扫描图片文件"
      };
      
      scannerRef.current = new Html5QrcodeScanner(
        scannerContainerId,
        config,
        /* 初始化但不自动开始扫描 */ false
      );
      
      // 渲染并启动扫描
      scannerRef.current.render(handleScanSuccess, handleScanFailure);
      isScanningRef.current = true;
      
      // 应用自定义UI，包括隐藏不需要的元素和添加扫描指导
      setTimeout(applyCustomUI, 300);
      
      // 监听窗口大小变化，重新调整扫描框
      const handleResize = () => {
        const qrboxSize = getOptimalQrboxSize();
        updateScannerGuide(qrboxSize.width, qrboxSize.height);
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
    
    // 组件卸载或isActive变为false时完全清理
    return () => {
      if (!isActive && scannerRef.current) {
        stopScannerCompletely();
      }
    };
  }, [isActive, handleScanSuccess, handleScanFailure, verbose, stopScannerCompletely, 
      getOptimalQrboxSize, applyCustomUI, updateScannerGuide, isMobile]);
  
  // 获取当前分页的扫描指南
  const getScannerGuide = () => {
    if (isMobile) {
      switch(currentPage) {
        case 1:
          return "将二维码放入扫描框中，保持手机稳定";
        case 2:
          return "确保环境光线充足，避免反光和阴影";
        case 3:
          return "如果扫描失败，尝试调整距离（10-20厘米）";
        default:
          return "将二维码放入扫描框中，保持手机稳定";
      }
    } else {
      switch(currentPage) {
        case 1:
          return "将二维码靠近摄像头（约5-15厘米）";
        case 2:
          return "确保二维码与摄像头正对，避免倾斜";
        case 3:
          return "调整距离和角度，直到成功识别";
        default:
          return "将二维码靠近摄像头（约5-15厘米）";
      }
    }
  };
  
  // 下一个提示
  const nextTip = () => {
    setCurrentPage(prev => prev >= totalPages ? 1 : prev + 1);
  };
  
  return (
    <div className="qr-scanner-container w-full">
      <div 
        id={scannerContainerId} 
        className="w-full overflow-hidden rounded-md"
        style={{
          minHeight: isMobile ? '350px' : '400px',
          position: 'relative',
          background: '#000'
        }}
      />
      
      <div className="flex items-center justify-between mt-2">
        <button 
          className="text-xs text-primary px-2 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          onClick={nextTip}
        >
          提示 {currentPage}/{totalPages}
        </button>
        <p className="text-center text-sm text-muted-foreground flex-1">
          {getScannerGuide()}
        </p>
      </div>
    </div>
  );
};

export default QrScanner; 