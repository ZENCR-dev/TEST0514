/**
 * API类型系统测试
 * 验证StandardApiResponse、ErrorCode等核心类型的正确性
 */

import {
  StandardApiResponse,
  ApiError,
  ApiResponse,
  ErrorCode,
  PaginationMeta,
  isSuccessResponse,
  isErrorResponse,
  ExtractApiData
} from '../api';

describe('API Type System', () => {
  describe('StandardApiResponse', () => {
    it('should create valid success response', () => {
      const response: StandardApiResponse<string> = {
        success: true,
        data: 'test data',
        meta: {
          timestamp: '2025-06-19T10:00:00.000Z'
        }
      };

      expect(response.success).toBe(true);
      expect(response.data).toBe('test data');
      expect(response.meta.timestamp).toBeDefined();
    });

    it('should create valid success response with pagination', () => {
      const paginationMeta: PaginationMeta = {
        page: 1,
        limit: 20,
        totalItems: 100,
        totalPages: 5,
        hasNextPage: true,
        hasPrevPage: false
      };

      const response: StandardApiResponse<{ items: string[]; meta: { pagination: PaginationMeta } }> = {
        success: true,
        data: {
          items: ['item1', 'item2'],
          meta: {
            pagination: paginationMeta
          }
        },
        meta: {
          timestamp: '2025-06-19T10:00:00.000Z',
          pagination: paginationMeta
        }
      };

      expect(response.success).toBe(true);
      expect(response.data.items).toHaveLength(2);
      expect(response.data.meta.pagination.totalItems).toBe(100);
    });
  });

  describe('ApiError', () => {
    it('should create valid error response', () => {
      const error: ApiError = {
        success: false,
        error: {
          code: ErrorCode.AUTH_001,
          message: 'Authentication failed',
          timestamp: '2025-06-19T10:00:00.000Z'
        }
      };

      expect(error.success).toBe(false);
      expect(error.error.code).toBe('AUTH_001');
      expect(error.error.message).toBe('Authentication failed');
    });

    it('should create error response with details', () => {
      const error: ApiError = {
        success: false,
        error: {
          code: ErrorCode.VALIDATION_001,
          message: 'Validation failed',
          details: {
            field: 'email',
            hint: 'Email format is invalid'
          },
          timestamp: '2025-06-19T10:00:00.000Z'
        }
      };

      expect(error.error.details?.field).toBe('email');
      expect(error.error.details?.hint).toBe('Email format is invalid');
    });
  });

  describe('ErrorCode enum', () => {
    it('should contain all required error codes', () => {
      // 认证错误
      expect(ErrorCode.AUTH_001).toBe('AUTH_001');
      expect(ErrorCode.AUTH_002).toBe('AUTH_002');
      expect(ErrorCode.AUTH_003).toBe('AUTH_003');

      // 网络错误
      expect(ErrorCode.NETWORK_001).toBe('NETWORK_001');
      expect(ErrorCode.NETWORK_002).toBe('NETWORK_002');
      expect(ErrorCode.NETWORK_003).toBe('NETWORK_003');

      // 验证错误
      expect(ErrorCode.VALIDATION_001).toBe('VALIDATION_001');
      expect(ErrorCode.VALIDATION_002).toBe('VALIDATION_002');
      expect(ErrorCode.VALIDATION_003).toBe('VALIDATION_003');

      // 服务器错误
      expect(ErrorCode.SERVER_001).toBe('SERVER_001');
      expect(ErrorCode.SERVER_002).toBe('SERVER_002');
      expect(ErrorCode.SERVER_003).toBe('SERVER_003');

      // 业务错误
      expect(ErrorCode.BUSINESS_001).toBe('BUSINESS_001');
      expect(ErrorCode.BUSINESS_002).toBe('BUSINESS_002');
      expect(ErrorCode.BUSINESS_003).toBe('BUSINESS_003');

      // 数据错误
      expect(ErrorCode.DATA_001).toBe('DATA_001');
      expect(ErrorCode.DATA_002).toBe('DATA_002');
      expect(ErrorCode.DATA_003).toBe('DATA_003');

      // 系统错误
      expect(ErrorCode.SYSTEM_001).toBe('SYSTEM_001');
      expect(ErrorCode.SYSTEM_002).toBe('SYSTEM_002');
      expect(ErrorCode.SYSTEM_003).toBe('SYSTEM_003');

      // 未知错误
      expect(ErrorCode.UNKNOWN_ERROR).toBe('UNKNOWN_ERROR');
    });

    it('should have exactly 22 error codes', () => {
      const errorCodes = Object.values(ErrorCode);
      expect(errorCodes).toHaveLength(22);
    });
  });

  describe('Type Guards', () => {
    it('should correctly identify success responses', () => {
      const successResponse: ApiResponse<string> = {
        success: true,
        data: 'test',
        meta: { timestamp: '2025-06-19T10:00:00.000Z' }
      };

      expect(isSuccessResponse(successResponse)).toBe(true);
      expect(isErrorResponse(successResponse)).toBe(false);

      // TypeScript type narrowing test
      if (isSuccessResponse(successResponse)) {
        expect(successResponse.data).toBe('test');
      }
    });

    it('should correctly identify error responses', () => {
      const errorResponse: ApiResponse<string> = {
        success: false,
        error: {
          code: ErrorCode.AUTH_001,
          message: 'Authentication failed',
          timestamp: '2025-06-19T10:00:00.000Z'
        }
      };

      expect(isErrorResponse(errorResponse)).toBe(true);
      expect(isSuccessResponse(errorResponse)).toBe(false);

      // TypeScript type narrowing test
      if (isErrorResponse(errorResponse)) {
        expect(errorResponse.error.code).toBe('AUTH_001');
      }
    });
  });

  describe('Utility Types', () => {
    it('should extract data type correctly', () => {
      type TestResponse = StandardApiResponse<{ id: string; name: string }>;
      type ExtractedData = ExtractApiData<TestResponse>;

      const testData: ExtractedData = {
        id: 'test-id',
        name: 'test-name'
      };

      expect(testData.id).toBe('test-id');
      expect(testData.name).toBe('test-name');
    });
  });

  describe('PaginationMeta', () => {
    it('should create valid pagination metadata', () => {
      const pagination: PaginationMeta = {
        page: 2,
        limit: 10,
        totalItems: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPrevPage: true
      };

      expect(pagination.page).toBe(2);
      expect(pagination.limit).toBe(10);
      expect(pagination.totalItems).toBe(25);
      expect(pagination.totalPages).toBe(3);
      expect(pagination.hasNextPage).toBe(true);
      expect(pagination.hasPrevPage).toBe(true);
    });

    it('should handle first page pagination', () => {
      const pagination: PaginationMeta = {
        page: 1,
        limit: 20,
        totalItems: 50,
        totalPages: 3,
        hasNextPage: true,
        hasPrevPage: false
      };

      expect(pagination.page).toBe(1);
      expect(pagination.hasPrevPage).toBe(false);
      expect(pagination.hasNextPage).toBe(true);
    });

    it('should handle last page pagination', () => {
      const pagination: PaginationMeta = {
        page: 3,
        limit: 20,
        totalItems: 50,
        totalPages: 3,
        hasNextPage: false,
        hasPrevPage: true
      };

      expect(pagination.page).toBe(3);
      expect(pagination.hasPrevPage).toBe(true);
      expect(pagination.hasNextPage).toBe(false);
    });
  });

  describe('Real Backend Sample Validation', () => {
    it('should validate against real backend success response format', () => {
      // 基于后端团队提供的真实响应样本
      const backendSuccessResponse = {
        success: true as const,
        data: {
          id: "med_001",
          sku: "TCM-001",
          name: "人参",
          pinyin: "renshen",
          category: "补气",
          pricePerGram: 15.0
        },
        meta: {
          timestamp: "2025-06-19T10:00:00.000Z"
        }
      };

      // 类型兼容性验证
      const typedResponse: StandardApiResponse<any> = backendSuccessResponse;
      expect(isSuccessResponse(typedResponse)).toBe(true);

      if (isSuccessResponse(typedResponse)) {
        expect(typedResponse.data.sku).toBe("TCM-001");
        expect(typedResponse.data.name).toBe("人参");
        expect(typedResponse.meta.timestamp).toBeDefined();
      }
    });

    it('should validate against real backend error response format', () => {
      const backendErrorResponse = {
        success: false as const,
        error: {
          code: "BUSINESS_002",
          message: "Medicine not found",
          details: {
            field: "id",
            hint: "Please check the medicine ID"
          },
          timestamp: "2025-06-19T10:00:00.000Z"
        }
      };

      const typedResponse: ApiError = backendErrorResponse;
      expect(isErrorResponse(typedResponse)).toBe(true);

      if (isErrorResponse(typedResponse)) {
        expect(typedResponse.error.code).toBe('BUSINESS_002');
        expect(typedResponse.error.details?.field).toBe('id');
      }
    });

    it('should validate against real backend paginated response format', () => {
      const backendPaginatedResponse = {
        success: true as const,
        data: {
          data: [
            { id: "med_001", sku: "TCM-001", name: "人参", pinyin: "renshen", category: "补气", pricePerGram: 15.0 },
            { id: "med_002", sku: "TCM-002", name: "当归", pinyin: "danggui", category: "补血", pricePerGram: 3.5 }
          ],
          meta: {
            pagination: {
              page: 1,
              limit: 20,
              totalItems: 2,
              totalPages: 1,
              hasNextPage: false,
              hasPrevPage: false
            }
          }
        },
        meta: {
          timestamp: "2025-06-19T10:00:00.000Z"
        }
      };

      const typedResponse: StandardApiResponse<any> = backendPaginatedResponse;
      expect(isSuccessResponse(typedResponse)).toBe(true);

      if (isSuccessResponse(typedResponse)) {
        expect(Array.isArray(typedResponse.data.data)).toBe(true);
        expect(typedResponse.data.data).toHaveLength(2);
        expect(typedResponse.data.meta.pagination.totalItems).toBe(2);
        expect(typedResponse.data.meta.pagination.page).toBe(1);
      }
    });
  });
}); 