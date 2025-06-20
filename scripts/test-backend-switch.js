#!/usr/bin/env node

/**
 * 后端服务切换测试脚本
 * 用于快速测试Next.js API Routes和NestJS后端服务
 */

const fetch = require('node-fetch');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

async function testEndpoint(url, name) {
  try {
    console.log(`${colors.yellow}🔍 测试 ${name}:${colors.reset} ${url}`);
    
    const startTime = Date.now();
    const response = await fetch(url);
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    const data = await response.json();
    
    if (response.ok) {
      console.log(`${colors.green}✅ ${name} - 成功${colors.reset}`);
      console.log(`   状态码: ${response.status}`);
      console.log(`   响应时间: ${responseTime}ms`);
      console.log(`   数据数量: ${data.data?.length || 0} 条`);
      console.log(`   分页信息: ${data.meta?.pagination ? '✅' : '❌'}`);
      return { success: true, responseTime, dataCount: data.data?.length || 0 };
    } else {
      console.log(`${colors.red}❌ ${name} - 失败${colors.reset}`);
      console.log(`   状态码: ${response.status}`);
      console.log(`   错误信息: ${data.message || '未知错误'}`);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.log(`${colors.red}❌ ${name} - 连接失败${colors.reset}`);
    console.log(`   错误: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log(`${colors.blue}🚀 新西兰中医处方平台 - 后端服务测试${colors.reset}\n`);
  
  const testCases = [
    {
      name: 'Next.js API Routes (端口3000)',
      url: 'http://localhost:3000/api/v1/medicines?page=1&limit=5'
    },
    {
      name: 'NestJS后端服务 (端口3001)', 
      url: 'http://localhost:3001/api/v1/medicines?page=1&limit=5'
    }
  ];

  const results = [];
  
  for (const testCase of testCases) {
    const result = await testEndpoint(testCase.url, testCase.name);
    results.push({ ...testCase, ...result });
    console.log(''); // 空行分隔
  }

  // 测试总结
  console.log(`${colors.blue}📊 测试总结${colors.reset}`);
  console.log('='.repeat(50));
  
  results.forEach(result => {
    const status = result.success ? `${colors.green}✅ 可用${colors.reset}` : `${colors.red}❌ 不可用${colors.reset}`;
    const performance = result.responseTime ? `${result.responseTime}ms` : '无数据';
    const dataCount = result.dataCount ? `${result.dataCount}条` : '无数据';
    
    console.log(`${result.name}:`);
    console.log(`  状态: ${status}`);
    console.log(`  性能: ${performance}`);
    console.log(`  数据: ${dataCount}`);
    console.log('');
  });

  // 建议
  const workingServices = results.filter(r => r.success);
  if (workingServices.length === 0) {
    console.log(`${colors.red}⚠️  警告: 没有可用的后端服务${colors.reset}`);
  } else if (workingServices.length === 1) {
    console.log(`${colors.yellow}💡 建议: 使用 ${workingServices[0].name}${colors.reset}`);
  } else {
    const fastest = workingServices.sort((a, b) => a.responseTime - b.responseTime)[0];
    console.log(`${colors.green}🏆 推荐: ${fastest.name} (最快响应: ${fastest.responseTime}ms)${colors.reset}`);
  }
  
  console.log(`\n${colors.blue}🔧 切换方法:${colors.reset}`);
  console.log('// 切换到Next.js API Routes');
  console.log('apiClient.switchToNextJSAPI();');
  console.log('');
  console.log('// 切换到NestJS后端');
  console.log('apiClient.switchToNestJSBackend();');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testEndpoint }; 