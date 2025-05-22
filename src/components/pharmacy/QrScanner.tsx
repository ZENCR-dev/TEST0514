import React, { useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats, Html5QrcodeResult } from 'html5-qrcode';
// 注意：CSS已在globals.css中全局导入

export interface QrScannerProps {
  onScanSuccess: (decodedText: string, decodedResult: Html5QrcodeResult) => void;
  onScanFailure?: (error: any) => void;
  isActive: boolean;
  verbose?: boolean;
}

const QrScanner: React.FC<QrScannerProps> = ({ 
  onScanSuccess, 
  onScanFailure, 
  isActive, 
  verbose = false 
}) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerContainerId = "qr-reader";
  const isScanningRef = useRef<boolean>(false);
  
  // 处理成功扫描的回调函数
  const handleScanSuccess = useCallback((decodedText: string, decodedResult: Html5QrcodeResult) => {
    if (verbose) console.log("[QrScanner] Scan successful:", decodedText);
    onScanSuccess(decodedText, decodedResult);
  }, [onScanSuccess, verbose]);
  
  // 处理扫描失败的回调函数，过滤掉不重要的错误
  const handleScanFailure = useCallback((errorMessage: string) => {
    // 过滤掉正常的"未找到二维码"错误
    if (errorMessage.includes('NotFoundException') || 
        errorMessage.includes('No MultiFormat Readers were able to detect the code')) {
      if (verbose) console.warn(`[QrScanner] QR code not found in current frame: ${errorMessage}`);
      return;
    }
    
    if (verbose) console.error("[QrScanner] Scan error:", errorMessage);
    if (onScanFailure) {
      onScanFailure(errorMessage);
    }
  }, [onScanFailure, verbose]);
  
  // 初始化扫描器 - 只创建一次实例
  useEffect(() => {
    if (!scannerRef.current) {
      if (verbose) console.log("[QrScanner] Creating scanner instance");
      
      const config = {
        fps: 10,
        // 设置固定的扫描框大小，与CSS中的样式保持一致
        qrbox: { width: 200, height: 200 },
        aspectRatio: 1.0, // 保持视频流方形，便于对焦
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: false, // 禁用手电筒按钮
        // 隐藏摄像头选择UI，让库自动选择合适的摄像头
        showScanTypeSelector: false,
        defaultDeviceId: 'environment', // 尝试使用后置摄像头
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
    }
    
    // 组件卸载时完全清理
    return () => {
      if (scannerRef.current) {
        stopScannerCompletely();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verbose]);
  
  // 完全停止扫描器并释放摄像头
  const stopScannerCompletely = useCallback(() => {
    if (scannerRef.current) {
      if (verbose) console.log("[QrScanner] Completely stopping scanner and releasing camera");
      try {
        // 先暂停扫描器，然后清理DOM
        scannerRef.current.clear();
        isScanningRef.current = false;
      } catch (error) {
        console.error("[QrScanner] Error clearing scanner:", error);
      }
    }
  }, [verbose]);
  
  // 根据isActive控制扫描器的启动和停止
  useEffect(() => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    
    if (isActive && !isScanningRef.current) {
      if (verbose) console.log("[QrScanner] Starting scanner");
      // 重新渲染并启动扫描
      scanner.render(handleScanSuccess, handleScanFailure);
      isScanningRef.current = true;
      
      // 强制隐藏选择摄像头的下拉菜单和手电筒按钮（以防CSS未完全生效）
      setTimeout(() => {
        try {
          const selectElement = document.querySelector('#qr-reader__dashboard_section_csr select');
          if (selectElement) {
            (selectElement as HTMLElement).style.display = 'none';
          }
          
          const torchButton = document.querySelector('#qr-reader__dashboard_section_torch button');
          if (torchButton) {
            (torchButton as HTMLElement).style.display = 'none';
          }
          
          // 强制隐藏Select Camera文字
          const selectLabel = document.querySelector('#qr-reader__dashboard_section_csr label');
          if (selectLabel) {
            (selectLabel as HTMLElement).style.display = 'none';
          }
        } catch (error) {
          console.error("[QrScanner] Error hiding UI elements:", error);
        }
      }, 300);
    } else if (!isActive && isScanningRef.current) {
      if (verbose) console.log("[QrScanner] Stopping scanner and releasing camera");
      // 完全停止扫描器并释放摄像头，而不只是暂停
      stopScannerCompletely();
      
      // 在下一帧重新创建扫描器实例，但不启动它
      setTimeout(() => {
        if (!isActive && verbose) console.log("[QrScanner] Recreating scanner instance after stop");
        try {
          // 重新创建一个新的扫描器实例，以便下次激活时使用
          const config = {
            fps: 10,
            qrbox: { width: 200, height: 200 },
            aspectRatio: 1.0,
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
            rememberLastUsedCamera: true,
            showTorchButtonIfSupported: false,
            showScanTypeSelector: false,
            defaultDeviceId: 'environment',
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
            false
          );
        } catch (error) {
          console.error("[QrScanner] Error recreating scanner:", error);
          if (onScanFailure) onScanFailure(error);
        }
      }, 100);
    }
  }, [isActive, handleScanSuccess, handleScanFailure, onScanFailure, verbose, stopScannerCompletely]);
  
  return (
    <div className="qr-scanner-container w-full">
      <div 
        id={scannerContainerId} 
        className="w-full overflow-hidden rounded-md"
        style={{
          minHeight: '350px', // 增加高度以容纳引导UI
          position: 'relative',
          background: '#000' // 添加黑色背景以突出扫描框
        }}
      />
      <p className="text-center text-sm text-muted-foreground mt-2">
        请将二维码置于扫描框中央，保持稳定
      </p>
    </div>
  );
};

export default QrScanner; 