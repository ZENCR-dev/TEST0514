import React, { useState, useEffect, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { ChevronDown, Camera, Smartphone } from 'lucide-react';

interface CameraDevice {
  id: string;
  label: string;
}

interface CameraSelectorProps {
  onCameraSelect: (cameraId: string) => void;
  selectedCameraId?: string;
  disabled?: boolean;
  autoSelectOnLoad?: boolean;
  layout?: 'buttons' | 'dropdown' | 'auto'; // 新增布局选项
}

export function CameraSelector({ 
  onCameraSelect, 
  selectedCameraId, 
  disabled = false, 
  autoSelectOnLoad = true,
  layout = 'auto' 
}: CameraSelectorProps) {
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 检测是否为移动端
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'tablet'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 检查摄像头权限
  const checkCameraPermission = async (): Promise<boolean> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('当前浏览器不支持摄像头访问');
      }

      // 尝试获取临时权限来检测设备
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      // 立即停止流，我们只是在检查权限
      stream.getTracks().forEach(track => track.stop());
      setPermissionGranted(true);
      return true;
    } catch (error: any) {
      console.warn('[CameraSelector] Permission check failed:', error);
      
      if (error.name === 'NotAllowedError') {
        setError('摄像头权限被拒绝。请在浏览器设置中允许访问摄像头。');
      } else if (error.name === 'NotFoundError') {
        setError('未找到可用的摄像头设备。');
      } else if (error.name === 'NotReadableError') {
        setError('摄像头被其他应用占用或存在硬件问题。');
      } else {
        setError('无法访问摄像头：' + (error.message || '未知错误'));
      }
      
      setPermissionGranted(false);
      return false;
    }
  };

  // 获取可用摄像头列表
  const getCameras = async (): Promise<CameraDevice[]> => {
    try {
      const devices = await Html5Qrcode.getCameras();
      
      if (!devices || devices.length === 0) {
        throw new Error('未找到任何摄像头设备');
      }

      const cameraDevices: CameraDevice[] = devices.map(device => ({
        id: device.id,
        label: device.label || `摄像头 ${device.id.substring(0, 8)}`
      }));

      return cameraDevices;
    } catch (error: any) {
      console.error('[CameraSelector] Failed to get cameras:', error);
      throw new Error('获取摄像头列表失败：' + (error.message || '未知错误'));
    }
  };

  // 初始化摄像头
  const initializeCameras = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 首先检查权限
      const hasPermission = await checkCameraPermission();
      if (!hasPermission) {
        return;
      }

      // 获取摄像头列表
      const cameraList = await getCameras();
      setCameras(cameraList);

      // 自动选择摄像头
      if (autoSelectOnLoad && cameraList.length > 0) {
        // 优先选择后置摄像头（通常包含 'back' 或 'environment'）
        let selectedCamera = cameraList.find(camera => 
          camera.id.toLowerCase().includes('back') || 
          camera.id.toLowerCase().includes('environment') ||
          camera.label.toLowerCase().includes('back') ||
          camera.label.toLowerCase().includes('后置')
        );

        // 如果没有找到后置摄像头，选择第一个
        if (!selectedCamera) {
          selectedCamera = cameraList[0];
        }

        onCameraSelect(selectedCamera.id);
      }

    } catch (error: any) {
      console.error('[CameraSelector] Initialization failed:', error);
      setError(error.message || '摄像头初始化失败');
    } finally {
      setLoading(false);
    }
  }, [autoSelectOnLoad, onCameraSelect]);

  // 重试初始化
  const retryInitialization = useCallback(() => {
    initializeCameras();
  }, [initializeCameras]);

  useEffect(() => {
    // 只在客户端初始化
    if (typeof window !== 'undefined') {
      initializeCameras();
    }
  }, [initializeCameras]);

  // 决定使用哪种布局
  const getLayoutType = () => {
    if (layout === 'auto') {
      return isMobile ? 'buttons' : 'dropdown';
    }
    return layout;
  };

  // 获取摄像头友好名称
  const getCameraFriendlyName = (camera: CameraDevice) => {
    const label = camera.label.toLowerCase();
    if (label.includes('back') || label.includes('environment') || label.includes('后置')) {
      return '后置摄像头';
    } else if (label.includes('front') || label.includes('user') || label.includes('前置')) {
      return '前置摄像头';
    }
    return camera.label;
  };

  // 渲染按钮布局（移动端友好）
  const renderButtonLayout = () => {
    const currentCamera = cameras.find(c => c.id === selectedCameraId);
    
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium">
          摄像头选择 ({cameras.length} 个可用)
        </label>
        
        {cameras.length <= 2 ? (
          // 2个或更少摄像头：显示切换按钮
          <div className="flex gap-2">
            {cameras.map((camera) => {
              const isSelected = camera.id === selectedCameraId;
              const friendlyName = getCameraFriendlyName(camera);
              
              return (
                <button
                  key={camera.id}
                  onClick={() => onCameraSelect(camera.id)}
                  disabled={disabled}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {friendlyName.includes('后置') ? (
                      <Camera className="w-4 h-4" />
                    ) : (
                      <Smartphone className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{friendlyName}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          // 多个摄像头：显示当前选择和下拉菜单
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              disabled={disabled}
              className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {currentCamera ? getCameraFriendlyName(currentCamera) : '请选择摄像头'}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'transform rotate-180' : ''}`} />
              </div>
            </button>
            
            {showDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {cameras.map((camera) => (
                  <button
                    key={camera.id}
                    onClick={() => {
                      onCameraSelect(camera.id);
                      setShowDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      camera.id === selectedCameraId ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {getCameraFriendlyName(camera).includes('后置') ? (
                        <Camera className="w-4 h-4" />
                      ) : (
                        <Smartphone className="w-4 h-4" />
                      )}
                      <span>{getCameraFriendlyName(camera)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {permissionGranted && (
          <p className="text-xs text-green-600">
            ✓ 摄像头权限已获取
          </p>
        )}
      </div>
    );
  };

  // 渲染下拉菜单布局（桌面端）
  const renderDropdownLayout = () => (
    <div className="camera-selector">
      <label className="block text-sm font-medium mb-2">
        摄像头选择 ({cameras.length} 个可用)
      </label>
      <select
        value={selectedCameraId || ''}
        onChange={(e) => onCameraSelect(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {!selectedCameraId && (
          <option value="" disabled>
            请选择摄像头
          </option>
        )}
        {cameras.map((camera) => (
          <option key={camera.id} value={camera.id}>
            {getCameraFriendlyName(camera)}
          </option>
        ))}
      </select>
      
      {permissionGranted && (
        <p className="text-xs text-green-600 mt-1">
          ✓ 摄像头权限已获取
        </p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="camera-selector">
        <label className="block text-sm font-medium mb-2">
          摄像头选择
        </label>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">正在检测摄像头...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="camera-selector">
        <label className="block text-sm font-medium mb-2">
          摄像头选择
        </label>
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-700 mb-2">{error}</p>
          <button
            onClick={retryInitialization}
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (cameras.length === 0) {
    return (
      <div className="camera-selector">
        <label className="block text-sm font-medium mb-2">
          摄像头选择
        </label>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-sm text-yellow-700">未找到可用的摄像头设备</p>
        </div>
      </div>
    );
  }

  const layoutType = getLayoutType();
  
  return layoutType === 'buttons' ? renderButtonLayout() : renderDropdownLayout();
} 