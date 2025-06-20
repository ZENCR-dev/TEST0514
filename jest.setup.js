// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom'); 

// Jest setup for TCM Prescription Platform
// 新西兰中医处方平台测试环境配置

// 使用CommonJS require而不是ES6 import
require('@testing-library/jest-dom');

// 修复Node.js全局对象在Jest环境中的缺失问题
// 用于支持supertest等需要Node.js API的测试工具
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// 模拟window对象的localStorage和sessionStorage
const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: mockStorage,
  });

  // 模拟window.location
  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://localhost:3000',
      reload: jest.fn(),
    },
    writable: true,
  });
}

// 清理每个测试后的localStorage mock
beforeEach(() => {
  mockStorage.getItem.mockClear();
  mockStorage.setItem.mockClear();
  mockStorage.removeItem.mockClear();
  mockStorage.clear.mockClear();
}); 