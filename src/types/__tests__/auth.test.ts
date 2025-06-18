/**
 * 认证模块类型测试
 * 测试认证相关API响应类型的正确性
 */

import {
  LoginResponseData,
  LoginApiResponse,
  RefreshTokenResponseData,
  RefreshTokenApiResponse,
  UserProfileApiResponse,
  RegisterResponseData,
  RegisterApiResponse,
  AuthErrorCode,
  User,
  LoginCredentials
} from '../auth';
import { isSuccessResponse, isErrorResponse } from '../api';

describe('认证模块类型测试', () => {

  describe('用户类型测试', () => {
    it('应该正确定义用户类型', () => {
      const mockUser: User = {
        id: 'user-123',
        name: 'Dr. John Doe',
        email: 'john.doe@tcm.com',
        role: 'doctor'
      };

      expect(mockUser.id).toBe('user-123');
      expect(mockUser.role).toBe('doctor');
      expect(['doctor', 'pharmacy', 'admin']).toContain(mockUser.role);
    });

    it('应该支持所有用户角色', () => {
      const doctorUser: User = {
        id: '1',
        name: 'Doctor',
        email: 'doctor@tcm.com',
        role: 'doctor'
      };

      const pharmacyUser: User = {
        id: '2',
        name: 'Pharmacy',
        email: 'pharmacy@tcm.com',
        role: 'pharmacy'
      };

      const adminUser: User = {
        id: '3',
        name: 'Admin',
        email: 'admin@tcm.com',
        role: 'admin'
      };

      expect(doctorUser.role).toBe('doctor');
      expect(pharmacyUser.role).toBe('pharmacy');
      expect(adminUser.role).toBe('admin');
    });
  });

  describe('登录响应类型测试', () => {
    it('应该正确构造登录响应数据', () => {
      const loginData: LoginResponseData = {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'refresh_token_here',
        user: {
          id: 'user-123',
          name: 'Dr. John Doe',
          email: 'john.doe@tcm.com',
          role: 'doctor'
        }
      };

      expect(loginData.accessToken).toBeDefined();
      expect(loginData.refreshToken).toBeDefined();
      expect(loginData.user.role).toBe('doctor');
    });

    it('应该正确构造完整的登录API响应', () => {
      const loginApiResponse: LoginApiResponse = {
        success: true,
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'refresh_token_here',
          user: {
            id: 'user-123',
            name: 'Dr. John Doe',
            email: 'john.doe@tcm.com',
            role: 'doctor'
          }
        },
        meta: {
          timestamp: '2025-06-19T10:00:00.000Z'
        }
      };

      expect(isSuccessResponse(loginApiResponse)).toBe(true);
      if (isSuccessResponse(loginApiResponse)) {
        expect(loginApiResponse.data.user.id).toBe('user-123');
        expect(loginApiResponse.data.accessToken).toBeDefined();
      }
    });
  });

  describe('Token刷新响应类型测试', () => {
    it('应该正确构造Token刷新响应数据', () => {
      const refreshData: RefreshTokenResponseData = {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token'
      };

      expect(refreshData.accessToken).toBe('new_access_token');
      expect(refreshData.refreshToken).toBe('new_refresh_token');
    });

    it('应该正确构造完整的Token刷新API响应', () => {
      const refreshApiResponse: RefreshTokenApiResponse = {
        success: true,
        data: {
          accessToken: 'new_access_token',
          refreshToken: 'new_refresh_token'
        },
        meta: {
          timestamp: '2025-06-19T10:30:00.000Z'
        }
      };

      expect(isSuccessResponse(refreshApiResponse)).toBe(true);
      if (isSuccessResponse(refreshApiResponse)) {
        expect(refreshApiResponse.data.accessToken).toBe('new_access_token');
      }
    });
  });

  describe('用户注册类型测试', () => {
    it('应该正确构造注册响应数据', () => {
      const registerData: RegisterResponseData = {
        userId: 'new-user-123',
        message: 'User registered successfully'
      };

      expect(registerData.userId).toBe('new-user-123');
      expect(registerData.message).toBeDefined();
    });

    it('应该正确构造完整的注册API响应', () => {
      const registerApiResponse: RegisterApiResponse = {
        success: true,
        data: {
          userId: 'new-user-123',
          message: 'User registered successfully'
        },
        meta: {
          timestamp: '2025-06-19T11:00:00.000Z'
        }
      };

      expect(isSuccessResponse(registerApiResponse)).toBe(true);
    });
  });

  describe('认证错误代码测试', () => {
    it('应该包含所有认证错误代码', () => {
      expect(AuthErrorCode.INVALID_CREDENTIALS).toBe('AUTH_001');
      expect(AuthErrorCode.TOKEN_EXPIRED).toBe('AUTH_002');
      expect(AuthErrorCode.INSUFFICIENT_PERMISSIONS).toBe('AUTH_003');
    });
  });

  describe('基于后端样本数据的验证', () => {
    it('应该匹配后端确认的登录成功响应格式', () => {
      // 基于后端提供的真实样本
      const backendLoginResponse = {
        success: true as const,
        data: {
          accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          refreshToken: "a1b2c3d4.eyJzdWIiOiJjZTQyYjQ4My0xZGRi...",
          user: {
            id: "ce42b483-1ddb-41b2-b179-0b2d3d5b6921",
            email: "doctor.test@tcm.com",
            name: "John Doe",
            role: "doctor" as const
          }
        },
        meta: {
          timestamp: "2025-06-19T10:00:00.000Z"
        }
      };

      // 类型兼容性验证
      const typedResponse: LoginApiResponse = backendLoginResponse;
      expect(isSuccessResponse(typedResponse)).toBe(true);
      
      if (isSuccessResponse(typedResponse)) {
        expect(typedResponse.data.user.email).toBe("doctor.test@tcm.com");
        expect(typedResponse.data.user.role).toBe("doctor");
        expect(typedResponse.data.accessToken.startsWith("eyJ")).toBe(true);
      }
    });

    it('应该匹配后端确认的Token刷新响应格式', () => {
      const backendRefreshResponse = {
        success: true as const,
        data: {
          accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          refreshToken: "b2c3d4e5.eyJzdWIiOiJjZTQyYjQ4My0xZGRi..."
        },
        meta: {
          timestamp: "2025-06-19T10:30:00.000Z"
        }
      };

      const typedResponse: RefreshTokenApiResponse = backendRefreshResponse;
      expect(isSuccessResponse(typedResponse)).toBe(true);
      
      if (isSuccessResponse(typedResponse)) {
        expect(typedResponse.data.accessToken).toBeDefined();
        expect(typedResponse.data.refreshToken).toBeDefined();
      }
    });

    it('应该匹配后端确认的认证错误响应格式', () => {
      const backendErrorResponse = {
        success: false as const,
        error: {
          code: "AUTH_001",
          message: "Invalid email or password.",
          details: {
            field: "credentials",
            hint: "Please check your email and password"
          },
          timestamp: "2025-06-19T10:05:00.000Z"
        }
      };

      expect(isErrorResponse(backendErrorResponse)).toBe(true);
      
      if (isErrorResponse(backendErrorResponse)) {
        expect(backendErrorResponse.error.code).toBe('AUTH_001');
        expect(backendErrorResponse.error.code).toBe(AuthErrorCode.INVALID_CREDENTIALS);
        expect(backendErrorResponse.error.details?.field).toBe('credentials');
      }
    });
  });

  describe('登录凭证类型测试', () => {
    it('应该正确定义登录凭证类型', () => {
      const credentials: LoginCredentials = {
        email: 'test@tcm.com',
        password: 'password123'
      };

      expect(credentials.email).toBe('test@tcm.com');
      expect(credentials.password).toBe('password123');
    });
  });

  describe('用户资料API响应测试', () => {
    it('应该正确构造用户资料API响应', () => {
      const userProfileResponse: UserProfileApiResponse = {
        success: true,
        data: {
          id: 'user-123',
          name: 'Dr. John Doe',
          email: 'john.doe@tcm.com',
          role: 'doctor'
        },
        meta: {
          timestamp: '2025-06-19T12:00:00.000Z'
        }
      };

      expect(isSuccessResponse(userProfileResponse)).toBe(true);
      if (isSuccessResponse(userProfileResponse)) {
        expect(userProfileResponse.data.role).toBe('doctor');
      }
    });
  });
}); 