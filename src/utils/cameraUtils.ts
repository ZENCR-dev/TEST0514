import { Html5Qrcode } from 'html5-qrcode';

export interface CameraDevice {
  id: string;
  label: string;
  friendlyName: string;
  type: 'front' | 'back' | 'unknown';
  isRecommended?: boolean;
}

/**
 * 获取可用的摄像头设备列表
 */
export async function getCameraDevices(): Promise<CameraDevice[]> {
  try {
    // 使用html5-qrcode库获取摄像头设备
    const devices = await Html5Qrcode.getCameras();
    
    return devices.map((device, index) => {
      const cameraInfo = analyzeCameraDevice(device, index);
      return {
        id: device.id,
        label: device.label || `摄像头 ${index + 1}`,
        friendlyName: cameraInfo.friendlyName,
        type: cameraInfo.type,
        isRecommended: cameraInfo.isRecommended
      };
    });
  } catch (error) {
    console.error('[CameraUtils] Error getting camera devices:', error);
    throw new Error('无法获取摄像头设备列表');
  }
}

/**
 * 分析摄像头设备信息，推断类型和生成友好名称
 */
function analyzeCameraDevice(device: { id: string; label: string }, index: number): {
  friendlyName: string;
  type: 'front' | 'back' | 'unknown';
  isRecommended: boolean;
} {
  const label = device.label.toLowerCase();
  const id = device.id.toLowerCase();
  
  // 前置摄像头关键词
  const frontKeywords = ['front', 'user', 'facing', 'selfie', '前置', 'facetime'];
  // 后置摄像头关键词
  const backKeywords = ['back', 'rear', 'environment', 'main', '后置', '主'];
  
  let type: 'front' | 'back' | 'unknown' = 'unknown';
  let friendlyName = `摄像头 ${index + 1}`;
  let isRecommended = false;
  
  // 检测前置摄像头
  if (frontKeywords.some(keyword => label.includes(keyword) || id.includes(keyword))) {
    type = 'front';
    friendlyName = '前置摄像头';
  }
  // 检测后置摄像头
  else if (backKeywords.some(keyword => label.includes(keyword) || id.includes(keyword))) {
    type = 'back';
    friendlyName = '后置摄像头';
    isRecommended = true; // 推荐使用后置摄像头进行扫码
  }
  // 特殊处理：如果是第一个设备且无法识别，但有多个设备，假设第一个是后置
  else if (index === 0) {
    type = 'back';
    friendlyName = '主摄像头';
    isRecommended = true;
  }
  
  // 尝试从设备标签中提取更详细的信息
  if (label.includes('wide') || label.includes('广角')) {
    friendlyName += ' (广角)';
  } else if (label.includes('ultra') || label.includes('超广角')) {
    friendlyName += ' (超广角)';
  } else if (label.includes('telephoto') || label.includes('长焦')) {
    friendlyName += ' (长焦)';
  }
  
  return { friendlyName, type, isRecommended };
}

/**
 * 获取推荐的摄像头设备ID
 * 优先选择后置摄像头，如果没有则选择第一个可用设备
 */
export async function getRecommendedCameraId(): Promise<string | null> {
  try {
    const cameras = await getCameraDevices();
    
    if (cameras.length === 0) {
      return null;
    }
    
    // 寻找推荐的摄像头
    const recommended = cameras.find(camera => camera.isRecommended);
    if (recommended) {
      return recommended.id;
    }
    
    // 寻找后置摄像头
    const backCamera = cameras.find(camera => camera.type === 'back');
    if (backCamera) {
      return backCamera.id;
    }
    
    // 默认返回第一个设备
    return cameras[0].id;
  } catch (error) {
    console.error('[CameraUtils] Error getting recommended camera:', error);
    return null;
  }
}

/**
 * 检查是否有多个摄像头设备
 */
export async function hasMultipleCameras(): Promise<boolean> {
  try {
    const cameras = await getCameraDevices();
    return cameras.length > 1;
  } catch (error) {
    console.error('[CameraUtils] Error checking multiple cameras:', error);
    return false;
  }
} 