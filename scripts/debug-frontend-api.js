/**
 * 前端API调试脚本
 * 模拟MedicineSearch组件的API调用方式，诊断错误原因
 */

// 模拟ApiClient类的行为
class TestApiClient {
  constructor() {
    this.baseURL = 'http://localhost:3001';
  }

  async get(endpoint, params) {
    const url = this.buildURL(endpoint, params);
    console.log(`📤 发起请求: ${url}`);
    
    try {
      const response = await fetch(url);
      console.log(`📥 响应状态: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📊 响应数据:', data);
      console.log('📋 数据类型:', typeof data);
      console.log('📁 是否为数组:', Array.isArray(data));
      
      if (data.data) {
        console.log('📂 data字段:', data.data);
        console.log('📋 data字段类型:', typeof data.data);
        console.log('📁 data是否为数组:', Array.isArray(data.data));
      }
      
      return data;
      
    } catch (error) {
      console.error('❌ 请求失败:', error);
      throw error;
    }
  }

  buildURL(endpoint, params) {
    const url = new URL(endpoint, this.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }
}

// 模拟MedicineSearch的searchMedicines函数
const searchMedicines = async (term) => {
  console.log(`🔍 开始搜索: "${term}"`);
  const apiClient = new TestApiClient();
  
  try {
    const response = await apiClient.get('/api/v1/medicines', { 
      search: term, 
      limit: 15 
    });
    
    console.log('📊 原始响应:', response);
    
    // 使用与MedicineSearch相同的逻辑
    const result = Array.isArray(response) ? response : (response?.data || []);
    console.log('✅ 处理后结果:', result);
    console.log('📊 结果数量:', result.length);
    
    return result;
    
  } catch (err) {
    console.error('❌ 搜索药品失败:', err);
    throw new Error('搜索服务暂时不可用，请稍后重试');
  }
};

// 执行测试
const runDebugTest = async () => {
  console.log('🔧 前端API调试测试');
  console.log('=====================================');
  console.log('⏰ 测试时间:', new Date().toLocaleString());
  console.log('🌐 目标API:', 'http://localhost:3001/api/v1');
  console.log('');

  const testTerms = ['五指毛桃', '紫花地丁', '人参'];

  for (const term of testTerms) {
    console.log(`\n🧪 测试搜索词: "${term}"`);
    console.log('─────────────────────────────────────');
    
    try {
      const startTime = Date.now();
      const results = await searchMedicines(term);
      const endTime = Date.now();
      
      console.log(`✅ 搜索成功!`);
      console.log(`⏱️  响应时间: ${endTime - startTime}ms`);
      console.log(`📊 结果数量: ${results.length}`);
      
      if (results.length > 0) {
        console.log('📋 前3个结果:');
        results.slice(0, 3).forEach((medicine, index) => {
          console.log(`   ${index + 1}. ${medicine.chineseName || medicine.name || 'N/A'}`);
          console.log(`      英文: ${medicine.englishName || 'N/A'}`);
          console.log(`      拼音: ${medicine.pinyinName || 'N/A'}`);
        });
      }
      
    } catch (error) {
      console.log(`❌ 搜索失败: ${error.message}`);
    }
    
    // 避免过快的请求
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📊 调试测试完成');
  console.log('=====================================');
};

// 运行测试
runDebugTest().catch(error => {
  console.error('❌ 调试测试失败:', error);
  process.exit(1);
}); 