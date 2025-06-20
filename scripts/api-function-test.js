#!/usr/bin/env node

/**
 * API功能完整性测试脚本
 */

const tests = [
  { name: '中文搜索', url: '?search=人参' },
  { name: '英文搜索', url: '?search=ginseng' },
  { name: '拼音搜索', url: '?search=renshen' },
  { name: '分页测试-第2页', url: '?page=2&limit=3' },
  { name: '排序测试-价格降序', url: '?sortBy=price&sortOrder=desc' },
  { name: '排序测试-名称升序', url: '?sortBy=chineseName&sortOrder=asc' },
  { name: '分类筛选', url: '?category=补益药' },
  { name: '复合查询', url: '?search=参&category=补益药&sortBy=price&sortOrder=asc' }
];

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

async function runTests() {
  console.log(`${colors.blue}🚀 API功能完整性测试开始${colors.reset}\n`);
  
  const results = [];
  
  for (const test of tests) {
    try {
      const start = Date.now();
      const response = await fetch(`http://localhost:3000/api/v1/medicines${test.url}`);
      const data = await response.json();
      const time = Date.now() - start;
      
      const result = {
        name: test.name,
        success: response.ok,
        time,
        count: data.data?.length || 0,
        totalItems: data.meta?.pagination?.totalItems || 0,
        url: test.url
      };
      
      results.push(result);
      
      const status = result.success ? `${colors.green}✅` : `${colors.red}❌`;
      console.log(`${status} ${result.name}${colors.reset}`);
      console.log(`   响应时间: ${result.time}ms`);
      console.log(`   返回数据: ${result.count}条 (总计${result.totalItems}条)`);
      console.log(`   查询参数: ${result.url}`);
      console.log('');
      
    } catch (error) {
      console.log(`${colors.red}❌ ${test.name}${colors.reset}`);
      console.log(`   错误: ${error.message}`);
      console.log('');
      
      results.push({
        name: test.name,
        success: false,
        error: error.message,
        url: test.url
      });
    }
  }
  
  // 测试总结
  console.log(`${colors.blue}📊 测试总结${colors.reset}`);
  console.log('='.repeat(50));
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const avgTime = results.filter(r => r.time).reduce((sum, r) => sum + r.time, 0) / results.filter(r => r.time).length;
  
  console.log(`总测试数: ${totalCount}`);
  console.log(`成功数: ${colors.green}${successCount}${colors.reset}`);
  console.log(`失败数: ${colors.red}${totalCount - successCount}${colors.reset}`);
  console.log(`成功率: ${colors.green}${((successCount / totalCount) * 100).toFixed(1)}%${colors.reset}`);
  console.log(`平均响应时间: ${colors.yellow}${avgTime.toFixed(1)}ms${colors.reset}`);
  
  // 性能基准检查
  console.log(`\n${colors.blue}🎯 性能基准检查${colors.reset}`);
  const fastTests = results.filter(r => r.time && r.time < 100).length;
  const slowTests = results.filter(r => r.time && r.time > 500).length;
  
  console.log(`快速响应 (<100ms): ${colors.green}${fastTests}个${colors.reset}`);
  console.log(`慢速响应 (>500ms): ${colors.red}${slowTests}个${colors.reset}`);
  
  if (successCount === totalCount && slowTests === 0) {
    console.log(`\n${colors.green}🎊 所有测试通过，性能达标！准备灰度测试！${colors.reset}`);
  } else {
    console.log(`\n${colors.yellow}⚠️  部分测试需要优化${colors.reset}`);
  }
}

runTests().catch(console.error); 