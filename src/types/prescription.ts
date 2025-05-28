/**
 * 处方相关类型定义
 * 用于药房端QR码解析和数据处理
 */

/**
 * QR码中包含的药品项目信息
 */
export interface PrescriptionQRItem {
  /** 药品ID，对应Medicine.id */
  id: string;
  /** 用量（克） */
  quantity: number;
  /** 药品中文名称（可选，药房端通过ID查找） */
  name?: string;
}

/**
 * QR码中包含的完整处方数据
 * 必须与医师端PrescriptionPreview.tsx中的格式保持一致
 */
export interface PrescriptionQRData {
  /** 处方ID */
  prescriptionId: string;
  /** 药品列表 */
  items: PrescriptionQRItem[];
  /** 帖数 */
  copies: number;
  /** 用法用量说明 */
  instructions: string;
}

/**
 * QR码解析结果
 */
export interface QRParseResult {
  /** 解析是否成功 */
  success: boolean;
  /** 解析后的数据（成功时存在） */
  data?: PrescriptionQRData;
  /** 错误信息（失败时存在） */
  error?: string;
  /** 错误类型 */
  errorType?: 'INVALID_JSON' | 'INVALID_FORMAT' | 'MISSING_FIELDS' | 'INVALID_DATA';
}

/**
 * 处方解析状态
 */
export type PrescriptionParseStatus = 'idle' | 'parsing' | 'success' | 'error'; 