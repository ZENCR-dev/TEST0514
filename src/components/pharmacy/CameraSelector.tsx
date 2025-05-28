import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Smartphone, Monitor, AlertTriangle, CheckCircle } from 'lucide-react';
import { getCameraDevices, getRecommendedCameraIdFromList, type CameraDevice } from '@/utils/cameraUtils';

export interface CameraSelectorProps {
  onCameraSelect: (cameraId: string) => void;
  selectedCameraId?: string;
  disabled?: boolean;
  className?: string;
}

export const CameraSelector: React.FC<CameraSelectorProps> = ({
  onCameraSelect,
  selectedCameraId,
  disabled = false,
  className = ''
}) => {
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取摄像头图标
  const getCameraIcon = (type: CameraDevice['type']) => {
    switch (type) {
      case 'front':
        return <Smartphone className="w-4 h-4" />;
      case 'back':
        return <Camera className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  // 加载可用摄像头
  const loadCameras = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const devices = await getCameraDevices();
      setCameras(devices);

      // 如果没有选中的摄像头，自动选择推荐的摄像头
      if (!selectedCameraId && devices.length > 0) {
        const recommendedId = getRecommendedCameraIdFromList(devices);
        if (recommendedId) {
          onCameraSelect(recommendedId);
        }
      }
    } catch (err) {
      console.error('[CameraSelector] Error loading cameras:', err);
      setError(err instanceof Error ? err.message : '获取摄像头列表失败');
    } finally {
      setLoading(false);
    }
  }, [selectedCameraId, onCameraSelect]);

  // 处理摄像头选择
  const handleCameraSelect = useCallback((cameraId: string) => {
    if (disabled) return;
    onCameraSelect(cameraId);
  }, [disabled, onCameraSelect]);

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
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
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
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={retryLoadCameras}
              disabled={disabled}
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

  // 只有一个摄像头时，显示简化的信息
  if (cameras.length === 1) {
    const camera = cameras[0];
    return (
      <div className={`camera-selector ${className}`}>
        <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          {getCameraIcon(camera.type)}
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-blue-900">{camera.friendlyName}</p>
            <p className="text-xs text-blue-600">已自动选择此摄像头</p>
          </div>
          <CheckCircle className="w-5 h-5 text-blue-600" />
        </div>
      </div>
    );
  }

  // 多个摄像头时，显示选择界面
  return (
    <div className={`camera-selector ${className}`}>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 mb-3">选择扫描摄像头：</p>
        
        <div className="grid gap-2">
          {cameras.map((camera) => {
            const isSelected = camera.id === selectedCameraId;
            const isRecommended = camera.isRecommended;
            
            return (
              <Button
                key={camera.id}
                variant={isSelected ? "default" : "outline"}
                className={`w-full justify-start p-4 h-auto relative ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                } ${
                  isRecommended && !isSelected ? 'border-green-300 bg-green-50' : ''
                }`}
                onClick={() => handleCameraSelect(camera.id)}
                disabled={disabled}
              >
                <div className="flex items-center w-full">
                  {getCameraIcon(camera.type)}
                  <div className="ml-3 flex-1 text-left">
                    <p className={`text-sm font-medium ${
                      isSelected ? 'text-white' : 'text-gray-900'
                    }`}>
                      {camera.friendlyName}
                    </p>
                    <p className={`text-xs ${
                      isSelected ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {camera.label}
                    </p>
                  </div>
                  
                  {/* 推荐标签 */}
                  {isRecommended && !isSelected && (
                    <span className="absolute top-1 right-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      推荐
                    </span>
                  )}
                  
                  {/* 选中标记 */}
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-white" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {/* 帮助提示 */}
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>提示：</strong> 
            {cameras.some(c => c.type === 'back') ? 
              '建议选择"后置摄像头"以获得更好的扫描效果。' : 
              '如果扫描效果不佳，请尝试切换到其他摄像头。'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default CameraSelector; 