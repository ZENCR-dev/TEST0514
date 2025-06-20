/**
 * SKU搜索功能验证脚本
 * 验证后端团队修复的拼音首字母简写搜索功能
 */

const https = require('http');

// 测试的SKU列表
const testSKUs = [
  { sku: 'DG', expected: '当归', description: 'Danggui (当归)' },
  { sku: 'CX', expected: '川芎', description: 'Chuanxiong (川芎)' },
  { sku: 'BS', expected: '白芍', description: 'Baishao (白芍)' },
  { sku: 'SDH', expected: '熟地黄', description: 'Shudihuang (熟地黄)' },
  { sku: 'WZMT', expected: '五指毛桃', description: 'Wuzhimaotao (五指毛桃)' },
  { sku: 'RS', expected: '人参', description: 'Renshen (人参)' },
  { sku: 'XYRS', expected: '西洋参', description: 'Xiyangshen (西洋参)' }
];

// API调用函数
function apiCall(path) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        try {
          const parsed = JSON.parse(data);
          resolve({ 
            data: parsed, 
            responseTime, 
            statusCode: res.statusCode 
          });
        } catch (error) {
          reject(new Error(`JSON解析失败: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`请求失败: ${error.message}`));
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.end();
  });
}

// 测试单个SKU搜索
async function testSKUSearch(testCase) {
  try {
    const path = `/api/v1/medicines?search=${encodeURIComponent(testCase.sku)}&limit=5`;
    const result = await apiCall(path);
    
    const { data, responseTime, statusCode } = result;
    
    if (statusCode !== 200) {
      return {
        sku: testCase.sku,
        status: '❌',
        error: `HTTP ${statusCode}`,
        responseTime
      };
    }

    if (!data.success || !Array.isArray(data.data)) {
      return {
        sku: testCase.sku,
        status: '❌',
        error: '响应格式错误',
        responseTime
      };
    }

    const medicines = data.data;
    const found = medicines.some(med => 
      med.chineseName?.includes(testCase.expected) || 
      med.name?.includes(testCase.expected) ||
      med.sku === testCase.sku
    );

    return {
      sku: testCase.sku,
      status: found ? '✅' : '⚠️',
      expected: testCase.expected,
      found: medicines.length,
      description: testCase.description,
      responseTime,
      details: found ? medicines[0] : '未找到匹配药品'
    };

  } catch (error) {
    return {
      sku: testCase.sku,
      status: '❌',
      error: error.message,
      responseTime: 0
    };
  }
}

// 执行所有测试
async function runAllTests() {
  console.log('🔍 SKU搜索功能验证开始...\n');
  console.log('📍 测试目标：http://localhost:3001/api/v1/medicines\n');
  
  const results = [];
  let passedTests = 0;
  let totalResponseTime = 0;

  for (const testCase of testSKUs) {
    console.log(`测试 ${testCase.sku} (${testCase.description})...`);
    const result = await testSKUSearch(testCase);
    
    results.push(result);
    if (result.status === '✅') passedTests++;
    totalResponseTime += result.responseTime;
    
    // 显示即时结果
    if (result.status === '✅') {
      console.log(`  ${result.status} 找到 ${result.found} 个结果 (${result.responseTime}ms)`);
      if (result.details && typeof result.details === 'object') {
        console.log(`     药品: ${result.details.chineseName} | SKU: ${result.details.sku}`);
      }
    } else if (result.status === '⚠️') {
      console.log(`  ${result.status} 未找到预期药品 "${result.expected}" (${result.responseTime}ms)`);
    } else {
      console.log(`  ${result.status} 错误: ${result.error} (${result.responseTime}ms)`);
    }
    
    console.log(''); // 空行分隔
  }

  // 汇总报告
  console.log('📊 SKU搜索功能验证报告');
  console.log('='.repeat(50));
  console.log(`总测试数量: ${testSKUs.length}`);
  console.log(`通过测试: ${passedTests}`);
  console.log(`失败测试: ${testSKUs.length - passedTests}`);
  console.log(`成功率: ${Math.round((passedTests / testSKUs.length) * 100)}%`);
  console.log(`平均响应时间: ${Math.round(totalResponseTime / testSKUs.length)}ms`);
  console.log('');

  // 详细结果表格
  console.log('📋 详细测试结果:');
  console.log('SKU\t状态\t预期药品\t\t响应时间\t备注');
  console.log('-'.repeat(70));
  
  results.forEach(result => {
    const sku = result.sku.padEnd(6);
    const status = result.status;
    const expected = (result.expected || '').padEnd(12);
    const responseTime = `${result.responseTime}ms`.padEnd(8);
    const note = result.error || `找到${result.found || 0}个结果`;
    
    console.log(`${sku}\t${status}\t${expected}\t${responseTime}\t${note}`);
  });

  console.log('');

  // 最终结论
  if (passedTests === testSKUs.length) {
    console.log('🎉 所有SKU搜索测试通过！后端SKU搜索功能修复成功！');
  } else if (passedTests >= testSKUs.length * 0.8) {
    console.log('✅ 大部分SKU搜索测试通过，功能基本正常');
  } else {
    console.log('⚠️ 部分SKU搜索测试失败，需要进一步检查');
  }

  console.log('');
  console.log('🏆 DAY 2联调 - SKU搜索功能验证完成！');
  
  return {
    passed: passedTests,
    total: testSKUs.length,
    successRate: Math.round((passedTests / testSKUs.length) * 100),
    averageResponseTime: Math.round(totalResponseTime / testSKUs.length)
  };
}

// 运行测试
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('❌ 测试执行失败:', error.message);
    process.exit(1);
  });
}

module.exports = { runAllTests, testSKUSearch }; 