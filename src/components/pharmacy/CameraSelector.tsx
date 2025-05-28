import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Smartphone, Monitor, AlertTriangle, CheckCircle } from 'lucide-react';
import { getCameraDevices, getRecommendedCameraId, type CameraDevice } from '@/utils/cameraUtils';

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

  // 获取摄像头设备列表
  const loadCameras = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const devices = await getCameraDevices();
      setCameras(devices);
      
      // 如果没有选中的摄像头，自动选择推荐的摄像头
      if (!selectedCameraId && devices.length > 0) {
        const recommendedId = await getRecommendedCameraId();
        if (recommendedId) {
          onCameraSelect(recommendedId);
        }
      }
    } catch (err) {
      console.error('[CameraSelector] Error loading cameras:', err);
      setError(err instanceof Error ? err.message : '无法获取摄像头设备');
    } finally {
      setLoading(false);
    }
  }, [selectedCameraId, onCameraSelect]);

  useEffect(() => {
    loadCameras();
  }, [loadCameras]);

  // 获取摄像头图标
  const getCameraIcon = (camera: CameraDevice) => {
    switch (camera.type) {
      case 'front':
        return Smartphone;
      case 'back':
        return Camera;
      default:
        return Monitor;
    }
  };

  // 处理摄像头选择
  const handleCameraSelect = (cameraId: string) => {
    if (!disabled) {
      onCameraSelect(cameraId);
    }
  };

  // 重新扫描摄像头
  const handleRefresh = () => {
    loadCameras();
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Camera className="h-4 w-4 animate-pulse" />
          <span>正在扫描可用摄像头...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={disabled}
          >
            重试
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (cameras.length === 0) {
    return (
      <Alert className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          未检测到可用的摄像头设备。请确保已连接摄像头并授予浏览器访问权限。
        </AlertDescription>
      </Alert>
    );
  }

  // 如果只有一个摄像头，显示简化的信息
  if (cameras.length === 1) {
    const camera = cameras[0];
    const IconComponent = getCameraIcon(camera);
    
    return (
      <div className={`flex items-center justify-between p-3 bg-muted/50 rounded-md ${className}`}>
        <div className="flex items-center space-x-3">
          <IconComponent className="h-5 w-5 text-muted-foreground" />
          <div>
            <span className="text-sm font-medium">{camera.friendlyName}</span>
            <div className="flex items-center space-x-1 mt-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span className="text-xs text-muted-foreground">已选中</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 多个摄像头的选择界面
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">选择摄像头</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          disabled={disabled}
          className="h-8 w-8 p-0"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {cameras.map((camera) => {
          const IconComponent = getCameraIcon(camera);
          const isSelected = camera.id === selectedCameraId;
          
          return (
            <Button
              key={camera.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleCameraSelect(camera.id)}
              disabled={disabled}
              className="flex items-center justify-start space-x-3 h-auto p-3 text-left"
            >
              <IconComponent className={`h-4 w-4 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {camera.friendlyName}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {camera.isRecommended && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      isSelected 
                        ? 'bg-primary-foreground/20 text-primary-foreground' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      推荐
                    </span>
                  )}
                  {isSelected && (
                    <CheckCircle className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
      
      {cameras.some(c => c.isRecommended) && (
        <p className="text-xs text-muted-foreground mt-2">
          💡 推荐使用后置摄像头进行二维码扫描以获得最佳效果
        </p>
      )}
    </div>
  );
};

export default CameraSelector; 