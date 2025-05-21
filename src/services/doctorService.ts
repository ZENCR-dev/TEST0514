import { DoctorRegisterData, ExtendedUser } from "@/types/admin";
import { registerDoctorAccount as adminRegisterDoctorAccount } from './admin/userService';

/**
 * 医生注册服务
 * 处理医生自行注册流程
 */

/**
 * 医生注册申请
 */
export async function registerDoctorAccount(data: DoctorRegisterData): Promise<ExtendedUser> {
  // 调用管理员服务中的注册方法
  // 在实际应用中，这里可能有不同的处理逻辑或额外的前置验证
  try {
    const result = await adminRegisterDoctorAccount(data);
    return result;
  } catch (error) {
    // 可以在这里添加特定的错误处理或日志记录
    console.error('医生注册失败:', error);
    throw error;
  }
} 