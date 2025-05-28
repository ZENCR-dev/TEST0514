import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Html5Qrcode, Html5QrcodeResult, Html5QrcodeSupportedFormats } from 'html5-qrcode';
// 注意：CSS已在globals.css中全局导入

export interface QrScannerProps {
  onScanSuccess: (decodedText: string, decodedResult: Html5QrcodeResult) => void;
  onScanFailure?: (error: any) => void;
  isActive: boolean;
  verbose?: boolean;
  cameraId?: string;
}

const QrScanner: React.FC<QrScannerProps> = ({ 
  onScanSuccess, 
  onScanFailure, 
  isActive, 
  verbose = false,
  cameraId
}) => {
  const qrCodeReaderRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentCameraId, setCurrentCameraId] = useState<string | undefined>(cameraId);

  const handleScanSuccess = useCallback((decodedText: string, decodedResult: Html5QrcodeResult) => {
    if (verbose) {
      console.log('[QrScanner] Scan success:', decodedText);
    }
    onScanSuccess(decodedText, decodedResult);
  }, [onScanSuccess, verbose]);

  const handleScanFailure = useCallback((error: any) => {
    // 只在详细模式下记录扫描失败（避免控制台刷屏）
    if (verbose && error) {
      console.log('[QrScanner] Scan failure:', error);
    }
    
    if (onScanFailure) {
      onScanFailure(error);
    }
  }, [onScanFailure, verbose]);

  // 完全停止扫描器
  const stopScannerCompletely = useCallback(async () => {
    if (qrCodeReaderRef.current && isScanning) {
      try {
        await qrCodeReaderRef.current.stop();
        if (verbose) {
          console.log('[QrScanner] Scanner stopped successfully');
        }
      } catch (error) {
        console.error('[QrScanner] Error stopping scanner:', error);
      } finally {
        setIsScanning(false);
      }
    }
  }, [isScanning, verbose]);

  // 启动扫描器
  const startScanner = useCallback(async (targetCameraId?: string) => {
    if (!qrCodeReaderRef.current || isScanning) {
      return;
    }

    try {
      const finalCameraId = targetCameraId || cameraId || 'environment';
      
      await qrCodeReaderRef.current.start(
        finalCameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          disableFlip: false,
        },
        handleScanSuccess,
        handleScanFailure
      );

      setIsScanning(true);
      setCurrentCameraId(finalCameraId);
      
      if (verbose) {
        console.log('[QrScanner] Scanner started with camera:', finalCameraId);
      }

      // 强制隐藏库默认的UI控件
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
          
          const selectLabel = document.querySelector('#qr-reader__dashboard_section_csr label');
          if (selectLabel) {
            (selectLabel as HTMLElement).style.display = 'none';
          }

          const startButton = document.getElementById('html5-qrcode-button-camera-start');
          if (startButton) {
            startButton.style.display = 'none';
          }

          const stopButton = document.getElementById('html5-qrcode-button-camera-stop');
          if (stopButton) {
            stopButton.style.display = 'none';
          }

          const fileSelectionButton = document.getElementById('html5-qrcode-button-file-selection');
          if (fileSelectionButton) {
            fileSelectionButton.style.display = 'none';
          }

          const requestPermissionButton = document.getElementById('html5-qrcode-button-camera-permission');
          if (requestPermissionButton) {
            requestPermissionButton.style.display = 'none';
          }
        } catch (hideError) {
          console.warn('[QrScanner] Warning: Failed to hide some UI elements:', hideError);
        }
      }, 100);

    } catch (error) {
      console.error('[QrScanner] Error starting scanner with camera', targetCameraId || cameraId, ':', error);
      setIsScanning(false);
      
      if (onScanFailure) {
        onScanFailure(error);
      }
    }
  }, [cameraId, handleScanSuccess, handleScanFailure, isScanning, onScanFailure, verbose]);

  // 切换摄像头
  const switchCamera = useCallback(async (newCameraId: string) => {
    if (verbose) {
      console.log('[QrScanner] Switching camera from', currentCameraId, 'to', newCameraId);
    }

    // 先停止当前扫描
    await stopScannerCompletely();
    
    // 等待一小段时间确保摄像头资源释放
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // 使用新摄像头启动
    await startScanner(newCameraId);
  }, [currentCameraId, stopScannerCompletely, startScanner, verbose]);

  // 主要的效果：处理isActive和cameraId变化
  useEffect(() => {
    const qrCodeElementId = 'qr-reader';

    if (isActive) {
      if (!qrCodeReaderRef.current) {
        // 初始化Html5Qrcode实例
        qrCodeReaderRef.current = new Html5Qrcode(qrCodeElementId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: verbose
        });

        if (verbose) {
          console.log('[QrScanner] Html5Qrcode instance created');
        }
      }

      if (!isScanning) {
        startScanner();
      }
    } else {
      stopScannerCompletely();
    }

    return () => {
      if (!isActive) {
        stopScannerCompletely();
      }
    };
  }, [isActive, startScanner, stopScannerCompletely, verbose, cameraId]);

  // 处理摄像头ID变化的专门效果
  useEffect(() => {
    if (isActive && cameraId && cameraId !== currentCameraId && qrCodeReaderRef.current) {
      switchCamera(cameraId);
    }
  }, [cameraId, currentCameraId, isActive, switchCamera]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (qrCodeReaderRef.current) {
        stopScannerCompletely().finally(() => {
          qrCodeReaderRef.current = null;
        });
      }
    };
  }, [stopScannerCompletely]);

  return (
    <div className="qr-scanner-container">
      <div 
        id="qr-reader" 
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          margin: '0 auto',
          border: '2px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      />
      
      {/* 隐藏库自带的所有UI控件 */}
      <style jsx>{`
        :global(#qr-reader__dashboard_section_csr) {
          display: none !important;
        }
        :global(#qr-reader__dashboard_section_torch) {
          display: none !important;
        }
        :global(#qr-reader__dashboard_section_file) {
          display: none !important;
        }
        :global(#html5-qrcode-button-camera-start) {
          display: none !important;
        }
        :global(#html5-qrcode-button-camera-stop) {
          display: none !important;
        }
        :global(#html5-qrcode-button-file-selection) {
          display: none !important;
        }
        :global(#html5-qrcode-button-camera-permission) {
          display: none !important;
        }
        :global(#qr-reader select) {
          display: none !important;
        }
        :global(#qr-reader__dashboard_section) {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default QrScanner; 