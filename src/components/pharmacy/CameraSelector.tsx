import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Smartphone, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCameraDevices, getRecommendedCameraIdFromList, type CameraDevice } from '@/utils/cameraUtils';

export interface CameraSelectorProps {
  onCameraSelect: (cameraId: string) => void;
  selectedCameraId?: string;
  disabled?: boolean;
  className?: string;
  autoSelectOnLoad?: boolean; // 新增：是否在加载完成后自动选择推荐摄像头
}

export const CameraSelector: React.FC<CameraSelectorProps> = ({
  onCameraSelect,
  selectedCameraId,
  disabled = false,
  className = '',
  autoSelectOnLoad = true
}) => {
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [switching, setSwitching] = useState(false); // 切换摄像头时的加载状态
  const { toast } = useToast();

  // 获取摄像头图标
  const getCameraIcon = (camera: CameraDevice) => {
    if (camera.type === 'front') {
      return <Smartphone className="w-4 h-4" />;
    }
    return <Camera className="w-4 h-4" />;
  };

  // 获取倍数显示文本
  const getMultiplierDisplay = (camera: CameraDevice) => {
    if (camera.type === 'front') {
      return '前置';
    }
    return camera.multiplier || '1x';
  };

  // 显示摄像头切换成功提示
  const showCameraSwitchToast = useCallback((camera: CameraDevice) => {
    toast({
      title: "摄像头已切换",
      description: `当前使用: ${camera.friendlyName}`,
      duration: 1000, // 1秒后自动消失
    });
  }, [toast]);

  // 加载可用摄像头
  const loadCameras = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const devices = await getCameraDevices();
      setCameras(devices);

      // 如果启用自动选择且没有选中的摄像头，自动选择推荐的摄像头
      if (autoSelectOnLoad && !selectedCameraId && devices.length > 0) {
        const recommendedId = getRecommendedCameraIdFromList(devices);
        if (recommendedId) {
          onCameraSelect(recommendedId);
          const recommendedCamera = devices.find(cam => cam.id === recommendedId);
          if (recommendedCamera) {
            console.log('[CameraSelector] Auto-selected recommended camera:', recommendedCamera.friendlyName);
          }
        }
      }
    } catch (err) {
      console.error('[CameraSelector] Error loading cameras:', err);
      setError(err instanceof Error ? err.message : '获取摄像头列表失败');
    } finally {
      setLoading(false);
    }
  }, [selectedCameraId, onCameraSelect, autoSelectOnLoad]);

  // 处理摄像头选择
  const handleCameraSelect = useCallback(async (cameraId: string) => {
    if (disabled || switching || cameraId === selectedCameraId) return;
    
    setSwitching(true);
    try {
      // 添加短暂延迟，让用户看到切换效果
      await new Promise(resolve => setTimeout(resolve, 200));
      
      onCameraSelect(cameraId);
      
      // 显示切换成功提示
      const selectedCamera = cameras.find(cam => cam.id === cameraId);
      if (selectedCamera) {
        showCameraSwitchToast(selectedCamera);
      }
    } finally {
      setSwitching(false);
    }
  }, [disabled, switching, selectedCameraId, onCameraSelect, cameras, showCameraSwitchToast]);

  // 重试加载摄像头
  const retryLoadCameras = useCallback(() => {
    loadCameras();
  }, [loadCameras]);

  // 组件挂载时加载摄像头
  useEffect(() => {
    loadCameras();
  }, [loadCameras]);

  // 加载状态
  if (loading) {
    return (
      <div className={`camera-selector ${className}`}>
        <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-600">正在检测摄像头...</span>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className={`camera-selector ${className}`}>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={retryLoadCameras}
              disabled={disabled}
              className="ml-2"
            >
              重试
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 没有检测到摄像头
  if (cameras.length === 0) {
    return (
      <div className={`camera-selector ${className}`}>
        <Alert>
          <Camera className="h-4 w-4" />
          <AlertDescription>
            未检测到可用的摄像头设备，请确保摄像头已连接并授予权限。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // iOS风格的摄像头选择界面
  const backCameras = cameras.filter(cam => cam.type === 'back');
  const frontCameras = cameras.filter(cam => cam.type === 'front');

  return (
    <div className={`camera-selector ${className}`}>
      <div className="flex flex-col space-y-3">
        <p className="text-sm font-medium text-gray-700">选择扫描摄像头：</p>
        
        {/* iOS风格的摄像头选择按钮 */}
        <div className="flex items-center justify-center space-x-3 p-4 bg-black/10 rounded-2xl">
          
          {/* 后置摄像头（圆形倍数按钮） */}
          {backCameras.map((camera) => {
            const isSelected = camera.id === selectedCameraId;
            return (
              <button
                key={camera.id}
                onClick={() => handleCameraSelect(camera.id)}
                disabled={disabled || switching}
                className={`
                  relative flex items-center justify-center w-12 h-12 rounded-full text-sm font-medium
                  transition-all duration-200 ease-in-out
                  ${isSelected 
                    ? 'bg-white text-black shadow-lg scale-110' 
                    : 'bg-black/20 text-white hover:bg-black/30'
                  }
                  ${disabled || switching ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  active:scale-95
                `}
                title={camera.friendlyName}
              >
                {switching && isSelected ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  getMultiplierDisplay(camera)
                )}
                
                {/* 推荐标识 */}
                {camera.isRecommended && !isSelected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </button>
            );
          })}

          {/* 分隔线 */}
          {backCameras.length > 0 && frontCameras.length > 0 && (
            <div className="w-px h-8 bg-white/30" />
          )}

          {/* 前置摄像头 */}
          {frontCameras.map((camera) => {
            const isSelected = camera.id === selectedCameraId;
            return (
              <button
                key={camera.id}
                onClick={() => handleCameraSelect(camera.id)}
                disabled={disabled || switching}
                className={`
                  relative flex items-center justify-center w-12 h-12 rounded-lg text-xs font-medium
                  transition-all duration-200 ease-in-out
                  ${isSelected 
                    ? 'bg-white text-black shadow-lg scale-110' 
                    : 'bg-black/20 text-white hover:bg-black/30'
                  }
                  ${disabled || switching ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  active:scale-95
                `}
                title={camera.friendlyName}
              >
                {switching && isSelected ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="flex flex-col items-center">
                    {getCameraIcon(camera)}
                    <span className="text-xs mt-1">前置</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 当前选中摄像头信息 */}
        {selectedCameraId && (
          <div className="text-center">
            {(() => {
              const selectedCamera = cameras.find(cam => cam.id === selectedCameraId);
              return selectedCamera ? (
                <p className="text-sm text-gray-600">
                  当前使用: <span className="font-medium text-blue-600">{selectedCamera.friendlyName}</span>
                  {selectedCamera.isRecommended && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">推荐</span>
                  )}
                </p>
              ) : null;
            })()}
          </div>
        )}

        {/* 帮助提示 */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            <strong>提示：</strong> 
            {backCameras.length > 0 ? 
              '建议使用"1x"主摄像头以获得最佳扫描效果' : 
              '如果扫描效果不佳，请尝试切换到其他摄像头'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default CameraSelector; 