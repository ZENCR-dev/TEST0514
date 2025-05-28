import { Html5Qrcode } from 'html5-qrcode';

export interface CameraDevice {
  id: string;
  label: string;
  friendlyName: string;
  type: 'front' | 'back' | 'unknown';
  subType: 'main' | 'wide' | 'telephoto' | 'unknown';
  multiplier: string; // '1x', '0.5x', '3x', etc.
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
      const cameraInfo = analyzeCameraDevice(device, index, devices.length);
      return {
        id: device.id,
        label: device.label || `摄像头 ${index + 1}`,
        friendlyName: cameraInfo.friendlyName,
        type: cameraInfo.type,
        subType: cameraInfo.subType,
        multiplier: cameraInfo.multiplier,
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
function analyzeCameraDevice(
  device: { id: string; label: string }, 
  index: number, 
  totalDevices: number
): {
  friendlyName: string;
  type: 'front' | 'back' | 'unknown';
  subType: 'main' | 'wide' | 'telephoto' | 'unknown';
  multiplier: string;
  isRecommended: boolean;
} {
  const label = device.label.toLowerCase();
  const id = device.id.toLowerCase();
  
  // 前置摄像头关键词
  const frontKeywords = ['front', 'user', 'facing', 'selfie', '前置', 'facetime'];
  // 后置摄像头关键词
  const backKeywords = ['back', 'rear', 'environment', 'main', '后置', '主'];
  // 广角摄像头关键词
  const wideKeywords = ['wide', 'ultra', '广角', '超广角', 'ultrawide'];
  // 长焦摄像头关键词
  const telephotoKeywords = ['telephoto', 'tele', 'zoom', '长焦', 'periscope'];
  
  let type: 'front' | 'back' | 'unknown' = 'unknown';
  let subType: 'main' | 'wide' | 'telephoto' | 'unknown' = 'unknown';
  let friendlyName = `摄像头 ${index + 1}`;
  let multiplier = '1x';
  let isRecommended = false;
  
  // 首先检测前置/后置
  if (frontKeywords.some(keyword => label.includes(keyword) || id.includes(keyword))) {
    type = 'front';
    friendlyName = '前置摄像头';
    multiplier = '1x';
  } else if (backKeywords.some(keyword => label.includes(keyword) || id.includes(keyword))) {
    type = 'back';
    subType = 'main';
    friendlyName = '主摄像头';
    multiplier = '1x';
    isRecommended = true; // 主摄像头是扫码的最佳选择
  }
  
  // 检测后置摄像头的子类型
  if (type === 'back' || type === 'unknown') {
    if (wideKeywords.some(keyword => label.includes(keyword) || id.includes(keyword))) {
      type = 'back';
      subType = 'wide';
      friendlyName = '广角摄像头';
      multiplier = '0.5x';
      // 广角摄像头次优选择（有些设备的广角效果不错）
      if (!isRecommended) isRecommended = false;
    } else if (telephotoKeywords.some(keyword => label.includes(keyword) || id.includes(keyword))) {
      type = 'back';
      subType = 'telephoto';
      friendlyName = '长焦摄像头';
      multiplier = '3x';
      // 长焦摄像头不太适合扫码
      isRecommended = false;
    }
  }
  
  // 特殊处理：如果是第一个设备且无法识别，但有多个设备，假设第一个是主摄
  if (type === 'unknown' && index === 0 && totalDevices > 1) {
    type = 'back';
    subType = 'main';
    friendlyName = '主摄像头';
    multiplier = '1x';
    isRecommended = true;
  }
  // 如果只有一个设备，直接标记为推荐
  else if (type === 'unknown' && totalDevices === 1) {
    type = 'back';
    subType = 'main';
    friendlyName = '主摄像头';
    multiplier = '1x';
    isRecommended = true;
  }
  
  return { friendlyName, type, subType, multiplier, isRecommended };
}

/**
 * 获取推荐的摄像头设备ID（异步版本）
 * 优先选择后置主摄像头，如果没有则选择第一个可用设备
 */
export async function getRecommendedCameraId(): Promise<string | null> {
  try {
    const cameras = await getCameraDevices();
    return getRecommendedCameraIdFromList(cameras);
  } catch (error) {
    console.error('[CameraUtils] Error getting recommended camera:', error);
    return null;
  }
}

/**
 * 从已有的摄像头设备列表中获取推荐的摄像头ID
 * 优先级：后置主摄 > 后置广角 > 前置摄像头 > 其他
 */
export function getRecommendedCameraIdFromList(cameras: CameraDevice[]): string | null {
  if (cameras.length === 0) {
    return null;
  }
  
  // 优先级1：寻找推荐的摄像头（通常是后置主摄）
  const recommended = cameras.find(camera => camera.isRecommended);
  if (recommended) {
    return recommended.id;
  }
  
  // 优先级2：寻找后置主摄像头
  const mainBackCamera = cameras.find(camera => 
    camera.type === 'back' && camera.subType === 'main'
  );
  if (mainBackCamera) {
    return mainBackCamera.id;
  }
  
  // 优先级3：寻找任何后置摄像头
  const backCamera = cameras.find(camera => camera.type === 'back');
  if (backCamera) {
    return backCamera.id;
  }
  
  // 优先级4：前置摄像头
  const frontCamera = cameras.find(camera => camera.type === 'front');
  if (frontCamera) {
    return frontCamera.id;
  }
  
  // 默认返回第一个设备
  return cameras[0].id;
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

/**
 * 初始化推荐摄像头ID（用于页面初始化）
 * 这个函数会缓存结果以避免重复调用
 */
let cachedRecommendedId: string | null = null;
let cachePromise: Promise<string | null> | null = null;

export async function initializeRecommendedCameraId(): Promise<string | null> {
  // 如果已经有缓存结果，直接返回
  if (cachedRecommendedId !== null) {
    return cachedRecommendedId;
  }
  
  // 如果正在加载中，返回同一个Promise
  if (cachePromise) {
    return cachePromise;
  }
  
  // 开始加载
  cachePromise = (async () => {
    try {
      const recommendedId = await getRecommendedCameraId();
      cachedRecommendedId = recommendedId;
      return recommendedId;
    } catch (error) {
      console.error('[CameraUtils] Error initializing recommended camera:', error);
      return null;
    } finally {
      // 清除Promise缓存，允许重试
      cachePromise = null;
    }
  })();
  
  return cachePromise;
}

/**
 * 清除摄像头缓存（用于强制重新检测）
 */
export function clearCameraCache(): void {
  cachedRecommendedId = null;
  cachePromise = null;
} 