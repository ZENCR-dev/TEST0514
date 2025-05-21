import { 
  ExtendedUser, 
  UserCreateData, 
  UserUpdateData, 
  UserSearchParams,
  PaginatedUsers,
  PharmacyCreateData,
  DoctorRegisterData
} from '@/types/admin';
import { allMockUsers } from '@/mocks/admin/mockUsers';
import { MOCK_PASSWORD } from '@/mocks/users';

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 获取用户列表（分页）
 */
export async function getUsers(params: UserSearchParams = {}): Promise<PaginatedUsers> {
  // 模拟API调用延迟
  await delay(600);
  
  const { 
    query = '', 
    role, 
    status,
    page = 1, 
    limit = 10 
  } = params;

  // 过滤用户
  let filteredUsers = [...allMockUsers];
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(lowerQuery) || 
      user.email.toLowerCase().includes(lowerQuery) ||
      user.phone?.toLowerCase().includes(lowerQuery) ||
      user.address?.toLowerCase().includes(lowerQuery)
    );
  }
  
  if (role) {
    filteredUsers = filteredUsers.filter(user => user.role === role);
  }
  
  if (status) {
    filteredUsers = filteredUsers.filter(user => user.status === status);
  }
  
  // 计算分页
  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  // 返回当前页数据
  const paginatedData = filteredUsers.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    total,
    page,
    limit,
    totalPages
  };
}

/**
 * 获取单个用户详情
 */
export async function getUserById(id: string): Promise<ExtendedUser | null> {
  await delay(300);
  
  const user = allMockUsers.find(user => user.id === id);
  return user || null;
}

/**
 * 创建新用户
 */
export async function createUser(userData: UserCreateData): Promise<ExtendedUser> {
  await delay(800);
  
  // 检查邮箱是否已存在
  const existingUser = allMockUsers.find(
    user => user.email.toLowerCase() === userData.email.toLowerCase()
  );
  
  if (existingUser) {
    throw new Error('邮箱已被使用');
  }
  
  // 创建新用户
  const newUser: ExtendedUser = {
    id: `user_${userData.role}_${Date.now()}`,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    status: 'active',
    createdAt: new Date().toISOString(),
    phone: userData.phone,
    address: userData.address
  };
  
  // 模拟保存到数据库
  allMockUsers.push(newUser);
  
  return newUser;
}

/**
 * 创建药房账户
 */
export async function createPharmacyAccount(data: PharmacyCreateData): Promise<ExtendedUser> {
  await delay(800);
  
  // 检查邮箱是否已存在
  const existingUser = allMockUsers.find(
    user => user.email.toLowerCase() === data.email.toLowerCase()
  );
  
  if (existingUser) {
    throw new Error('邮箱已被使用');
  }
  
  // 创建药房用户
  const newPharmacy: ExtendedUser = {
    id: `user_pharmacy_${Date.now()}`,
    name: data.name,
    email: data.email,
    role: 'pharmacy',
    status: data.status,
    createdAt: new Date().toISOString(),
    phone: data.phone,
    address: data.address,
    lastLogin: undefined
  };
  
  // 模拟保存到数据库
  allMockUsers.push(newPharmacy);
  
  return newPharmacy;
}

/**
 * 注册医生账户(待审核)
 */
export async function registerDoctorAccount(data: DoctorRegisterData): Promise<ExtendedUser> {
  await delay(1000);
  
  // 检查邮箱是否已存在
  const existingUser = allMockUsers.find(
    user => user.email.toLowerCase() === data.email.toLowerCase()
  );
  
  if (existingUser) {
    throw new Error('邮箱已被使用');
  }
  
  // 检查HPI编号是否已存在
  const existingHPI = allMockUsers.find(
    user => user.hpiNumber === data.hpiNumber
  );
  
  if (existingHPI) {
    throw new Error('HPI编号已被注册');
  }
  
  // 创建医生用户(默认为非活跃状态，等待管理员审核)
  const newDoctor: ExtendedUser = {
    id: `user_doctor_${Date.now()}`,
    name: data.name,
    email: data.email,
    role: 'doctor',
    status: 'inactive', // 默认为非活跃，需要管理员审核
    createdAt: new Date().toISOString(),
    phone: data.phone,
    address: data.address,
    hpiNumber: data.hpiNumber,
    apcCertificate: data.apcCertificate ? 'uploaded' : undefined, // Changed from null
    lastLogin: undefined
  };
  
  // 模拟保存到数据库
  allMockUsers.push(newDoctor);
  
  return newDoctor;
}

/**
 * 管理员创建医生账户(直接激活)
 */
export async function createDoctorAccount(data: DoctorRegisterData): Promise<ExtendedUser> {
  await delay(800);
  
  // 检查邮箱是否已存在
  const existingUser = allMockUsers.find(
    user => user.email.toLowerCase() === data.email.toLowerCase()
  );
  
  if (existingUser) {
    throw new Error('邮箱已被使用');
  }
  
  // 检查HPI编号是否已存在
  const existingHPI = allMockUsers.find(
    user => user.hpiNumber === data.hpiNumber
  );
  
  if (existingHPI) {
    throw new Error('HPI编号已被注册');
  }
  
  // 创建医生用户(管理员创建时默认为活跃状态)
  const newDoctor: ExtendedUser = {
    id: `user_doctor_${Date.now()}`,
    name: data.name,
    email: data.email,
    role: 'doctor',
    status: 'active', // 管理员创建的账户直接激活
    createdAt: new Date().toISOString(),
    phone: data.phone,
    address: data.address,
    hpiNumber: data.hpiNumber,
    apcCertificate: data.apcCertificate ? 'uploaded' : undefined, // Changed from null
    lastLogin: undefined
  };
  
  // 模拟保存到数据库
  allMockUsers.push(newDoctor);
  
  return newDoctor;
}

/**
 * 更新用户信息
 */
export async function updateUser(id: string, userData: UserUpdateData): Promise<ExtendedUser> {
  await delay(600);
  
  // 查找用户
  const userIndex = allMockUsers.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    throw new Error('用户不存在');
  }
  
  // 检查邮箱是否已被其他用户使用
  if (userData.email) {
    const emailExists = allMockUsers.some(
      user => user.id !== id && user.email.toLowerCase() === userData.email!.toLowerCase()
    );
    
    if (emailExists) {
      throw new Error('邮箱已被使用');
    }
  }
  
  // 更新用户信息
  const updatedUser = {
    ...allMockUsers[userIndex],
    ...userData
  };
  
  // 模拟保存到数据库
  allMockUsers[userIndex] = updatedUser;
  
  return updatedUser;
}

/**
 * 删除用户
 */
export async function deleteUser(id: string): Promise<void> {
  await delay(500);
  
  const userIndex = allMockUsers.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    throw new Error('用户不存在');
  }
  
  // 模拟从数据库删除
  allMockUsers.splice(userIndex, 1);
}

/**
 * 重置用户密码
 */
export async function resetUserPassword(id: string): Promise<{success: boolean, newPassword: string}> {
  await delay(500);
  
  const user = allMockUsers.find(user => user.id === id);
  
  if (!user) {
    throw new Error('用户不存在');
  }
  
  // 模拟生成新密码
  const newPassword = 'reset' + Math.random().toString(36).substring(2, 10);
  
  return {
    success: true,
    newPassword
  };
}

/**
 * 审核医生账户
 */
export async function approveDoctorAccount(id: string): Promise<ExtendedUser> {
  await delay(600);
  
  // 查找用户
  const userIndex = allMockUsers.findIndex(user => user.id === id && user.role === 'doctor');
  
  if (userIndex === -1) {
    throw new Error('医生账户不存在');
  }
  
  // 更新用户状态为活跃
  const updatedDoctor = {
    ...allMockUsers[userIndex],
    status: 'active' as const
  };
  
  // 模拟保存到数据库
  allMockUsers[userIndex] = updatedDoctor;
  
  return updatedDoctor;
} 