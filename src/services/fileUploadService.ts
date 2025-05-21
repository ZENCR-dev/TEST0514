/**
 * 模拟文件上传API服务
 * 在实际应用中，这里会连接到真实的文件存储服务 (如AWS S3或Azure Blob Storage)
 */

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 允许的文件类型
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
// 最大文件大小 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface UploadResult {
  success: boolean;
  filename: string;
  url: string;
  error?: string;
}

/**
 * 验证文件类型和大小
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // 检查文件类型
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: '文件类型不支持。请上传JPG, PNG或PDF文件。'
    };
  }

  // 检查文件大小
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: '文件大小超过限制。最大文件大小为5MB。'
    };
  }

  return { valid: true };
}

/**
 * 上传文件
 * @param file 要上传的文件
 * @param folder 目标文件夹
 * @returns 上传结果
 */
export async function uploadFile(file: File, folder: string = 'certificates'): Promise<UploadResult> {
  // 验证文件
  const validation = validateFile(file);
  if (!validation.valid) {
    return {
      success: false,
      filename: '',
      url: '',
      error: validation.error
    };
  }

  // 模拟上传延迟
  await delay(1500);

  // 获取文件扩展名
  const extension = file.name.split('.').pop();
  
  // 生成唯一文件名
  const uniqueFileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`;
  
  // 模拟上传URL (在真实实现中，这将是实际的存储URL)
  const fileUrl = `/uploads/${uniqueFileName}`;

  // 模拟文件读取以验证其内容
  try {
    // 在真实实现中，这里会包含实际的文件上传逻辑
    console.log(`模拟上传文件: ${file.name}, 大小: ${file.size} 字节, 类型: ${file.type}`);
    
    return {
      success: true,
      filename: uniqueFileName,
      url: fileUrl
    };
  } catch (error) {
    return {
      success: false,
      filename: '',
      url: '',
      error: '文件上传失败，请重试。'
    };
  }
}

/**
 * 删除文件
 * @param filename 要删除的文件名
 * @returns 删除结果
 */
export async function deleteFile(filename: string): Promise<{ success: boolean; error?: string }> {
  // 模拟删除延迟
  await delay(500);
  
  // 在真实实现中，这里会包含实际的文件删除逻辑
  console.log(`模拟删除文件: ${filename}`);
  
  return { success: true };
} 