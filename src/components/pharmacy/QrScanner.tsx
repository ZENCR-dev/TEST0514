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
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentCameraId, setCurrentCameraId] = useState<string | undefined>(cameraId);
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const [isProcessingSuccess, setIsProcessingSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  // 客户端渲染检查
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleScanSuccess = useCallback((decodedText: string, decodedResult: Html5QrcodeResult) => {
    // 防止重复处理
    if (hasSucceeded || isProcessingSuccess) {
      return;
    }
    
    setIsProcessingSuccess(true);
    setHasSucceeded(true);
    
    if (verbose) {
      console.log('[QrScanner] Scan success:', decodedText);
    }
    
    // 强化的停止和回调逻辑
    const stopAndCallback = async () => {
      try {
        // 强制停止扫描器，不依赖isScanning状态
        if (qrCodeReaderRef.current) {
          try {
            await qrCodeReaderRef.current.stop();
            if (verbose) {
              console.log('[QrScanner] Scanner stopped after successful scan');
            }
          } catch (stopError) {
            console.warn('[QrScanner] Error stopping scanner, but continuing:', stopError);
          }
          
          // 强制释放所有视频轨道
          const videoElement = document.querySelector('#qr-reader video') as HTMLVideoElement;
          if (videoElement && videoElement.srcObject) {
            const stream = videoElement.srcObject as MediaStream;
            stream.getTracks().forEach(track => {
              track.stop();
              if (verbose) {
                console.log('[QrScanner] Stopped video track:', track.label);
              }
            });
          }
        }
        
        setIsScanning(false);
        setVideoReady(false);
        videoElementRef.current = null;
        
      } catch (error) {
        console.error('[QrScanner] Error in stopAndCallback:', error);
      } finally {
        // 无论是否成功停止，都要调用回调
        setIsProcessingSuccess(false);
        onScanSuccess(decodedText, decodedResult);
      }
    };
    
    stopAndCallback();
  }, [onScanSuccess, verbose, hasSucceeded, isProcessingSuccess]);

  const handleScanFailure = useCallback((error: any) => {
    // 如果已经扫描成功或正在处理成功，忽略后续的失败事件
    if (hasSucceeded || isProcessingSuccess) {
      return;
    }

    // 检查是否是Canvas相关的错误
    const errorString = typeof error === 'string' ? error : (error?.message || '');
    if (errorString.includes('getImageData') || 
        errorString.includes('source width is 0') ||
        errorString.includes('IndexSizeError')) {
      console.warn('[QrScanner] Canvas/Video stream not ready, retrying...', errorString);
      return;
    }
    
    // 只在详细模式下记录常规扫描失败（避免控制台刷屏）
    if (verbose && error && !errorString.includes('NotFoundException')) {
      console.log('[QrScanner] Scan failure:', error);
    }
    
    if (onScanFailure) {
      onScanFailure(error);
    }
  }, [onScanFailure, verbose, hasSucceeded, isProcessingSuccess]);

  // 完全停止扫描器 - 强化版本
  const stopScannerCompletely = useCallback(async () => {
    try {
      // 强制停止扫描器，不依赖状态检查
      if (qrCodeReaderRef.current) {
        try {
          await qrCodeReaderRef.current.stop();
          if (verbose) {
            console.log('[QrScanner] Scanner stopped successfully');
          }
        } catch (stopError) {
          console.warn('[QrScanner] Error stopping scanner, but continuing cleanup:', stopError);
        }
      }
      
      // 强制释放所有媒体轨道
      const videoElement = document.querySelector('#qr-reader video') as HTMLVideoElement;
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach(track => {
          track.stop();
          if (verbose) {
            console.log('[QrScanner] Forcibly stopped track:', track.label);
          }
        });
        videoElement.srcObject = null;
      }
      
    } catch (error) {
      console.error('[QrScanner] Error in stopScannerCompletely:', error);
    } finally {
      // 始终重置状态，无论是否发生错误
      setIsScanning(false);
      setVideoReady(false);
      videoElementRef.current = null;
    }
  }, [verbose]);

  // 重置组件状态
  const resetComponentState = useCallback(() => {
    setHasSucceeded(false);
    setIsProcessingSuccess(false);
    setIsScanning(false);
    setVideoReady(false);
    setInitializationError(null);
    videoElementRef.current = null;
  }, []);

  // 启动扫描器 - 简化版本
  const startScanner = useCallback(async (targetCameraId?: string) => {
    // 确保只在客户端环境中运行
    if (!isClient || !qrCodeReaderRef.current || isScanning || isProcessingSuccess) {
      return;
    }

    try {
      setInitializationError(null);
      setIsScanning(true);
      
      // 摄像头降级策略 - 修复类型错误
      const cameraOptions: (string | undefined)[] = [
        targetCameraId || cameraId,
        'environment', // 后置摄像头
        'user', // 前置摄像头
        undefined // 让浏览器选择
      ];
      
      // 过滤掉undefined值，但保留一个undefined作为最后的降级选项
      const filteredOptions = cameraOptions.filter((option, index) => 
        option !== undefined || index === cameraOptions.length - 1
      );
      
      let lastError;
      
      for (const cameraOption of filteredOptions) {
        try {
          if (verbose) {
            console.log('[QrScanner] Trying camera:', cameraOption);
          }
          
          // 直接启动，依赖Html5Qrcode.start()的Promise
          // 当cameraOption为undefined时，Html5Qrcode会自动选择摄像头
          await qrCodeReaderRef.current.start(
            cameraOption || { facingMode: "environment" }, // 修复类型错误：undefined时使用MediaTrackConstraints
            {
              fps: 10, // 恢复正常帧率
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
              disableFlip: false,
            },
            handleScanSuccess,
            handleScanFailure
          );

          setCurrentCameraId(cameraOption || 'auto');
          
          if (verbose) {
            console.log('[QrScanner] Successfully started with camera:', cameraOption || 'auto');
          }
          
          // 简单等待video元素出现并设置videoReady
          setTimeout(() => {
            const videoElement = document.querySelector('#qr-reader video') as HTMLVideoElement;
            if (videoElement) {
              videoElementRef.current = videoElement;
              setVideoReady(true);
              if (verbose) {
                console.log('[QrScanner] Video element found and ready');
              }
            }
          }, 1000);

          // 隐藏库默认的UI控件
          setTimeout(() => {
            try {
              const elementsToHide = [
                '#qr-reader__dashboard_section_csr select',
                '#qr-reader__dashboard_section_torch button',
                '#qr-reader__dashboard_section_csr label',
                '#html5-qrcode-button-camera-start',
                '#html5-qrcode-button-camera-stop',
                '#html5-qrcode-button-file-selection',
                '#html5-qrcode-button-camera-permission'
              ];
              
              elementsToHide.forEach(selector => {
                const element = document.querySelector(selector) as HTMLElement;
                if (element) {
                  element.style.display = 'none';
                }
              });
            } catch (hideError) {
              console.warn('[QrScanner] Warning: Failed to hide some UI elements:', hideError);
            }
          }, 200);
          
          return; // 成功启动，退出循环
          
        } catch (error) {
          lastError = error;
          if (verbose) {
            console.log('[QrScanner] Failed to start with camera', cameraOption || 'auto', ':', error);
          }
          continue; // 尝试下一个摄像头选项
        }
      }
      
      // 如果所有摄像头选项都失败了
      throw lastError || new Error('无法启动任何摄像头');

    } catch (error) {
      console.error('[QrScanner] All camera options failed:', error);
      setIsScanning(false);
      setInitializationError(error instanceof Error ? error.message : '摄像头初始化失败');
      
      if (onScanFailure) {
        onScanFailure(error);
      }
    }
  }, [cameraId, handleScanSuccess, handleScanFailure, isScanning, onScanFailure, verbose, isProcessingSuccess, isClient]);

  // 切换摄像头
  const switchCamera = useCallback(async (newCameraId: string) => {
    if (!isClient) return;
    
    if (verbose) {
      console.log('[QrScanner] Switching camera from', currentCameraId, 'to', newCameraId);
    }

    // 先停止当前扫描
    await stopScannerCompletely();
    
    // 等待一小段时间确保摄像头资源释放
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 使用新摄像头启动
    await startScanner(newCameraId);
  }, [currentCameraId, stopScannerCompletely, startScanner, verbose, isClient]);

  // 主要的效果：处理isActive变化
  useEffect(() => {
    // 确保只在客户端环境中运行
    if (!isClient) return;
    
    const qrCodeElementId = 'qr-reader';

    if (isActive) {
      if (!qrCodeReaderRef.current) {
        // 初始化Html5Qrcode实例
        qrCodeReaderRef.current = new Html5Qrcode(qrCodeElementId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false // 关闭库的详细日志
        });

        if (verbose) {
          console.log('[QrScanner] Html5Qrcode instance created');
        }
      }

      if (!isScanning && !hasSucceeded && !isProcessingSuccess) {
        startScanner();
      }
    } else {
      // isActive变为false时，停止扫描并重置状态
      stopScannerCompletely().then(() => {
        resetComponentState();
      });
    }

    return () => {
      if (!isActive) {
        stopScannerCompletely().then(() => {
          resetComponentState();
        });
      }
    };
  }, [isActive, startScanner, stopScannerCompletely, verbose, isScanning, hasSucceeded, isProcessingSuccess, resetComponentState, isClient]);

  // 处理摄像头ID变化的专门效果
  useEffect(() => {
    if (isClient && isActive && cameraId && cameraId !== currentCameraId && qrCodeReaderRef.current && !hasSucceeded && !isProcessingSuccess) {
      switchCamera(cameraId);
    }
  }, [cameraId, currentCameraId, isActive, switchCamera, hasSucceeded, isProcessingSuccess, isClient]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (qrCodeReaderRef.current) {
        stopScannerCompletely().finally(() => {
          qrCodeReaderRef.current = null;
          resetComponentState();
        });
      }
    };
  }, [stopScannerCompletely, resetComponentState]);

  // 如果不是客户端环境，显示占位符
  if (!isClient) {
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
            overflow: 'hidden',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5'
          }}
        >
          <div className="text-center text-gray-500">
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse mx-auto mb-2"></div>
            <span className="text-sm">正在加载扫描器...</span>
          </div>
        </div>
      </div>
    );
  }

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
          overflow: 'hidden',
          minHeight: '300px' // 确保最小高度，防止坍缩
        }}
      />
      
      {/* 扫描状态指示器 */}
      {isScanning && !videoReady && !hasSucceeded && (
        <div className="text-center mt-2">
          <div className="inline-flex items-center text-sm text-orange-600">
            <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse mr-2"></div>
            正在初始化摄像头...
          </div>
        </div>
      )}
      
      {isScanning && videoReady && !hasSucceeded && (
        <div className="text-center mt-2">
          <div className="inline-flex items-center text-sm text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse mr-2"></div>
            正在扫描...
          </div>
        </div>
      )}
      
      {hasSucceeded && (
        <div className="text-center mt-2">
          <div className="inline-flex items-center text-sm text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
            扫描成功
          </div>
        </div>
      )}
      
      {isProcessingSuccess && (
        <div className="text-center mt-2">
          <div className="inline-flex items-center text-sm text-orange-600">
            <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse mr-2"></div>
            正在处理...
          </div>
        </div>
      )}
      
      {initializationError && (
        <div className="text-center mt-2">
          <div className="inline-flex items-center text-sm text-red-600">
            <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
            初始化失败: {initializationError}
          </div>
        </div>
      )}
      
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