/**
 * 多药品API联调测试脚本
 * 新西兰中医处方平台 - Supabase真实数据库搜索验证
 * 
 * 目标：验证前端能够通过API搜索多种药品（中文、英文、拼音）
 * 测试药品：紫花地丁、Haliotis diversicolor、daqingye、麻黄、shengdihuang、Nepeta cataria
 */

const API_CONFIG = {
  // 真实NestJS后端API（3001端口）
  REAL_API_BASE_URL: 'http://localhost:3001/api/v1',
  
  // 测试药品列表
  TEST_MEDICINES: [
    {
      searchTerm: '紫花地丁',
      type: 'chinese',
      description: '中文名 - 紫花地丁（清热解毒药）'
    },
    {
      searchTerm: 'Haliotis diversicolor',
      type: 'latin',
      description: '拉丁学名 - 石决明（平肝息风药）'
    },
    {
      searchTerm: 'daqingye',
      type: 'pinyin',
      description: '拼音名 - 大青叶（清热解毒药）'
    },
    {
      searchTerm: '麻黄',
      type: 'chinese',
      description: '中文名 - 麻黄（解表药）'
    },
    {
      searchTerm: 'shengdihuang',
      type: 'pinyin',
      description: '拼音名 - 生地黄（清热凉血药）'
    },
    {
      searchTerm: 'Nepeta cataria',
      type: 'latin',
      description: '拉丁学名 - 荆芥（解表药）'
    }
  ]
};

/**
 * 单个药品搜索测试
 */
async function testSingleMedicine(medicine) {
  console.log(`\n🔍 测试药品: ${medicine.searchTerm}`);
  console.log(`📋 类型: ${medicine.type} | ${medicine.description}`);
  
  try {
    const startTime = Date.now();
    const response = await fetch(`${API_CONFIG.REAL_API_BASE_URL}/medicines?search=${encodeURIComponent(medicine.searchTerm)}`);
    const endTime = Date.now();
    
    console.log(`⏱️  响应时间: ${endTime - startTime}ms`);
    console.log(`📊 响应状态: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      const resultCount = data.data ? data.data.length : 0;
      
      console.log(`📦 搜索结果: ${resultCount} 条`);
      
      if (resultCount > 0) {
        console.log(`✅ 搜索成功！找到相关药品:`);
        data.data.slice(0, 3).forEach((med, index) => {
          console.log(`   ${index + 1}. ${med.chineseName || med.name} (${med.sku || 'N/A'})`);
          if (med.englishName) console.log(`      英文: ${med.englishName}`);
          if (med.pinyinName) console.log(`      拼音: ${med.pinyinName}`);
          if (med.basePrice || med.pricePerGram) {
            console.log(`      价格: $${med.basePrice || med.pricePerGram}/g`);
          }
        });
        
        // 检查搜索相关性
        const exactMatch = data.data.find(med => 
          med.chineseName?.includes(medicine.searchTerm) ||
          med.englishName?.toLowerCase().includes(medicine.searchTerm.toLowerCase()) ||
          med.pinyinName?.toLowerCase().includes(medicine.searchTerm.toLowerCase()) ||
          med.latinName?.toLowerCase().includes(medicine.searchTerm.toLowerCase())
        );
        
        if (exactMatch) {
          console.log(`🎯 找到精确匹配: ${exactMatch.chineseName || exactMatch.name}`);
        }
        
        return {
          status: 'SUCCESS',
          searchTerm: medicine.searchTerm,
          resultCount,
          responseTime: endTime - startTime,
          hasExactMatch: !!exactMatch,
          results: data.data.slice(0, 3)
        };
      } else {
        console.log(`❌ 未找到相关药品`);
        return {
          status: 'NO_RESULTS',
          searchTerm: medicine.searchTerm,
          resultCount: 0,
          responseTime: endTime - startTime
        };
      }
    } else {
      console.log(`❌ API请求失败: ${response.status} ${response.statusText}`);
      return {
        status: 'API_ERROR',
        searchTerm: medicine.searchTerm,
        statusCode: response.status,
        responseTime: endTime - startTime
      };
    }
  } catch (error) {
    console.log(`❌ 连接失败: ${error.message}`);
    return {
      status: 'CONNECTION_ERROR',
      searchTerm: medicine.searchTerm,
      error: error.message
    };
  }
}

/**
 * 批量药品搜索测试
 */
async function testAllMedicines() {
  console.log('🧪 ===== 多药品API搜索测试 =====');
  console.log('📍 测试目标：验证Supabase真实数据库中的药品搜索功能');
  console.log('🌐 测试语言：中文、拼音、拉丁学名');
  console.log(`📋 测试药品数量: ${API_CONFIG.TEST_MEDICINES.length} 种`);
  
  const results = [];
  
  for (const medicine of API_CONFIG.TEST_MEDICINES) {
    const result = await testSingleMedicine(medicine);
    results.push(result);
    
    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
}

/**
 * 生成测试报告
 */
function generateTestReport(results) {
  console.log('\n📊 ===== 测试结果统计报告 =====');
  
  const successCount = results.filter(r => r.status === 'SUCCESS').length;
  const noResultsCount = results.filter(r => r.status === 'NO_RESULTS').length;
  const errorCount = results.filter(r => r.status === 'API_ERROR' || r.status === 'CONNECTION_ERROR').length;
  const exactMatchCount = results.filter(r => r.hasExactMatch).length;
  
  console.log(`✅ 搜索成功: ${successCount}/${results.length} (${Math.round(successCount/results.length*100)}%)`);
  console.log(`🎯 精确匹配: ${exactMatchCount}/${results.length} (${Math.round(exactMatchCount/results.length*100)}%)`);
  console.log(`❓ 无结果: ${noResultsCount}/${results.length} (${Math.round(noResultsCount/results.length*100)}%)`);
  console.log(`❌ 错误: ${errorCount}/${results.length} (${Math.round(errorCount/results.length*100)}%)`);
  
  // 性能统计
  const responseTimes = results.filter(r => r.responseTime).map(r => r.responseTime);
  if (responseTimes.length > 0) {
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const maxResponseTime = Math.max(...responseTimes);
    const minResponseTime = Math.min(...responseTimes);
    
    console.log(`\n⚡ 性能指标:`);
    console.log(`   平均响应时间: ${Math.round(avgResponseTime)}ms`);
    console.log(`   最快响应: ${minResponseTime}ms`);
    console.log(`   最慢响应: ${maxResponseTime}ms`);
  }
  
  // 详细结果
  console.log(`\n📋 详细搜索结果:`);
  results.forEach((result, index) => {
    const medicine = API_CONFIG.TEST_MEDICINES[index];
    console.log(`\n${index + 1}. 搜索词: "${result.searchTerm}" (${medicine.type})`);
    
    switch (result.status) {
      case 'SUCCESS':
        console.log(`   ✅ 成功 | ${result.resultCount} 条结果 | ${result.responseTime}ms`);
        if (result.hasExactMatch) {
          console.log(`   🎯 包含精确匹配`);
        }
        break;
      case 'NO_RESULTS':
        console.log(`   ❓ 无结果 | ${result.responseTime}ms`);
        break;
      case 'API_ERROR':
        console.log(`   ❌ API错误 | ${result.statusCode} | ${result.responseTime}ms`);
        break;
      case 'CONNECTION_ERROR':
        console.log(`   ❌ 连接错误 | ${result.error}`);
        break;
    }
  });
  
  // 数据库内容建议
  console.log(`\n🔍 数据库分析建议:`);
  const noResultTerms = results.filter(r => r.status === 'NO_RESULTS').map(r => r.searchTerm);
  if (noResultTerms.length > 0) {
    console.log(`📝 以下搜索词未找到结果，建议检查数据库:`);
    noResultTerms.forEach(term => console.log(`   - ${term}`));
  }
  
  const successTerms = results.filter(r => r.status === 'SUCCESS').map(r => r.searchTerm);
  if (successTerms.length > 0) {
    console.log(`✅ 以下搜索词成功找到数据:`);
    successTerms.forEach(term => console.log(`   - ${term}`));
  }
}

/**
 * 对比不同搜索方式
 */
async function compareSearchMethods() {
  console.log('\n🔍 ===== 搜索方式对比测试 =====');
  
  // 测试同一药品的不同搜索方式
  const testCases = [
    { 
      medicine: '麻黄',
      searches: ['麻黄', 'mahuang', 'Ephedra', 'ephedra sinica']
    },
    {
      medicine: '生地黄', 
      searches: ['生地黄', 'shengdihuang', 'Rehmannia', 'rehmannia glutinosa']
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🌿 测试药品: ${testCase.medicine}`);
    
    for (const searchTerm of testCase.searches) {
      try {
        const response = await fetch(`${API_CONFIG.REAL_API_BASE_URL}/medicines?search=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          const count = data.data ? data.data.length : 0;
          console.log(`   "${searchTerm}": ${count} 条结果`);
        }
      } catch (error) {
        console.log(`   "${searchTerm}": 搜索失败`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
}

/**
 * 主测试执行函数
 */
async function main() {
  console.log('🏥 新西兰中医处方平台 - 多药品搜索验证');
  console.log('⏰ 测试时间:', new Date().toLocaleString('zh-CN', { timeZone: 'Pacific/Auckland' }));
  console.log('🔗 API端点:', API_CONFIG.REAL_API_BASE_URL);
  
  // 首先测试API连接
  console.log('\n🔌 API连接测试...');
  try {
    const connectionTest = await fetch(`${API_CONFIG.REAL_API_BASE_URL}/medicines?limit=1`);
    if (connectionTest.ok) {
      console.log('✅ API连接正常');
    } else {
      console.log('❌ API连接异常，状态码:', connectionTest.status);
      return;
    }
  } catch (error) {
    console.log('❌ 无法连接到API:', error.message);
    console.log('🔧 请确认NestJS后端服务运行在3001端口');
    return;
  }
  
  // 执行批量搜索测试
  const results = await testAllMedicines();
  
  // 生成测试报告
  generateTestReport(results);
  
  // 对比搜索方式
  await compareSearchMethods();
  
  // 前端集成指导
  console.log('\n📋 ===== 前端集成验证 =====');
  console.log('🎯 在前端MedicineSearch组件中测试以下搜索：');
  API_CONFIG.TEST_MEDICINES.forEach((med, index) => {
    console.log(`${index + 1}. 搜索 "${med.searchTerm}" (${med.type})`);
  });
  
  console.log('\n🔧 前端验证步骤：');
  console.log('1. 打开 http://localhost:3000/prescription/create');
  console.log('2. 在药品搜索框中依次输入上述搜索词');
  console.log('3. 验证是否显示来自真实数据库的搜索结果');
  console.log('4. 检查浏览器Network标签，确认请求发送到3001端口');
  
  return results;
}

// 如果直接运行此脚本
if (typeof module !== 'undefined' && require.main === module) {
  main().catch(console.error);
}

// 如果在浏览器环境中
if (typeof window !== 'undefined') {
  window.testMultipleMedicines = main;
}

module.exports = { testAllMedicines, testSingleMedicine, main }; 