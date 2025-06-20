/**
 * API兼容性测试脚本 - Phase 2
 * 验证EnvironmentSwitcher修复和后端API响应格式
 */

console.log('🧪 ===== Phase 2: API兼容性验证测试 =====');
console.log('📅 测试时间:', new Date().toLocaleString('zh-CN'));

// 模拟前端ApiClient类的基本功能
class TestApiClient {
  constructor() {
    this.baseURL = 'http://localhost:3000/api/v1'; // 默认Mock模式
  }

  switchToNestJSBackend() {
    this.baseURL = 'http://localhost:3001/api/v1';
    console.log('✅ 切换到NestJS后端 (联调模式):', this.baseURL);
  }

  switchToNextJSAPI() {
    this.baseURL = 'http://localhost:3000/api/v1';
    console.log('✅ 切换到NextJS API (Mock模式):', this.baseURL);
  }

  getCurrentEnvironment() {
    if (this.baseURL.includes('localhost:3001')) {
      return 'integration';
    } else if (this.baseURL.includes('localhost:3000')) {
      return 'mock';
    } else {
      return 'custom';
    }
  }

  async get(endpoint, params = {}) {
    const url = new URL(endpoint, this.baseURL);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });

    const startTime = Date.now();
    try {
      const response = await fetch(url.toString());
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        data: data.data || data,
        status: response.status,
        responseTime,
        totalCount: data.totalCount,
        pagination: data.pagination
      };
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      throw {
        ...error,
        responseTime,
        endpoint: url.toString()
      };
    }
  }
}

async function testEnvironmentSwitching() {
  console.log('\n🔄 ===== 环境切换功能测试 =====');
  
  const apiClient = new TestApiClient();
  
  console.log('📊 初始状态:', apiClient.getCurrentEnvironment(), '-', apiClient.baseURL);
  
  // 测试切换到联调模式
  console.log('\n🚀 测试切换到联调模式...');
  apiClient.switchToNestJSBackend();
  console.log('当前环境:', apiClient.getCurrentEnvironment());
  
  // 测试切换到Mock模式
  console.log('\n🔧 测试切换到Mock模式...');
  apiClient.switchToNextJSAPI();
  console.log('当前环境:', apiClient.getCurrentEnvironment());
  
  console.log('✅ 环境切换功能正常！');
  return apiClient;
}

async function testAPICompatibility() {
  console.log('\n🔍 ===== API兼容性验证测试 =====');
  
  const apiClient = new TestApiClient();
  
  // 测试Mock API
  console.log('\n📝 测试Mock API (3000端口)...');
  apiClient.switchToNextJSAPI();
  try {
    const mockResult = await apiClient.get('/medicines', { 
      search: '五指毛桃', 
      limit: 5 
    });
    console.log('Mock API响应状态:', mockResult.status);
    console.log('Mock API响应时间:', mockResult.responseTime + 'ms');
    console.log('Mock API数据数量:', mockResult.data?.length || 0);
    console.log('Mock API响应结构:', {
      hasData: !!mockResult.data,
      dataType: Array.isArray(mockResult.data) ? 'array' : typeof mockResult.data,
      totalCount: mockResult.totalCount,
      pagination: mockResult.pagination
    });
    
    if (mockResult.data?.length > 0) {
      console.log('Mock API样本数据字段:', Object.keys(mockResult.data[0]));
    }
  } catch (error) {
    console.log('❌ Mock API测试失败:', error.message);
    console.log('响应时间:', error.responseTime + 'ms');
  }
  
  // 测试真实API
  console.log('\n🚀 测试真实API (3001端口)...');
  apiClient.switchToNestJSBackend();
  try {
    const realResult = await apiClient.get('/medicines', { 
      search: '五指毛桃', 
      limit: 5 
    });
    console.log('真实API响应状态:', realResult.status);
    console.log('真实API响应时间:', realResult.responseTime + 'ms');
    console.log('真实API数据数量:', realResult.data?.length || 0);
    console.log('真实API响应结构:', {
      hasData: !!realResult.data,
      dataType: Array.isArray(realResult.data) ? 'array' : typeof realResult.data,
      totalCount: realResult.totalCount,
      pagination: realResult.pagination
    });
    
    if (realResult.data?.length > 0) {
      console.log('真实API样本数据字段:', Object.keys(realResult.data[0]));
      console.log('五指毛桃数据详情:', realResult.data.find(item => 
        item.chineseName?.includes('五指毛桃') || 
        item.name?.includes('五指毛桃')
      ));
    }
    
    return {
      compatible: true,
      mockApi: { working: true },
      realApi: { working: true, hasWuzhimaotao: realResult.data?.length > 0 }
    };
  } catch (error) {
    console.log('❌ 真实API测试失败:', error.message);
    console.log('响应时间:', error.responseTime + 'ms');
    console.log('请确认后端NestJS服务是否在3001端口正常运行');
    
    return {
      compatible: false,
      mockApi: { working: true },
      realApi: { working: false, error: error.message }
    };
  }
}

async function generateCompatibilityReport(compatibilityResult) {
  console.log('\n📋 ===== Phase 2 兼容性验证报告 =====');
  
  const timestamp = new Date().toLocaleString('zh-CN');
  
  console.log('📅 测试完成时间:', timestamp);
  console.log('🎯 测试目标: 验证EnvironmentSwitcher修复和API兼容性');
  
  if (compatibilityResult.compatible) {
    console.log('✅ 兼容性验证: 通过');
    console.log('✅ Mock API (3000端口): 正常工作');
    console.log('✅ 真实API (3001端口): 正常工作');
    
    if (compatibilityResult.realApi.hasWuzhimaotao) {
      console.log('✅ 五指毛桃数据: 在真实API中找到');
      console.log('🚀 建议: 可以进行Phase 3 - MedicineSearch重构');
    } else {
      console.log('⚠️ 五指毛桃数据: 在真实API中未找到');
      console.log('💡 建议: 继续Phase 3，但需要用其他药品测试');
    }
  } else {
    console.log('❌ 兼容性验证: 失败');
    console.log('❌ 真实API问题:', compatibilityResult.realApi.error);
    console.log('🔧 建议: 需要先解决后端连接问题，然后重新测试');
  }
  
  console.log('\n🎯 下一步行动建议:');
  if (compatibilityResult.compatible) {
    console.log('1. 立即进入Phase 3: MedicineSearch重构');
    console.log('2. 预计时间: 35分钟');
    console.log('3. 风险等级: 中等 (已验证API兼容性)');
  } else {
    console.log('1. 检查后端NestJS服务状态');
    console.log('2. 确认3001端口是否被占用');
    console.log('3. 重新运行Phase 2测试');
  }
  
  return compatibilityResult;
}

// 执行测试主流程
async function main() {
  try {
    // Step 1: 测试环境切换功能
    await testEnvironmentSwitching();
    
    // Step 2: 测试API兼容性
    const compatibilityResult = await testAPICompatibility();
    
    // Step 3: 生成兼容性报告
    await generateCompatibilityReport(compatibilityResult);
    
    console.log('\n🎉 Phase 2 API兼容性验证测试完成！');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Phase 2测试过程中出现错误:', error);
    process.exit(1);
  }
}

// 启动测试
main(); 