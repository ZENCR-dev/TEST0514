/**
 * 五指毛桃专项联调测试脚本
 * 这是DAY 2联调的关键验证测试
 * 
 * 验证要点：
 * 1. 五指毛桃是真实数据库中的独有数据
 * 2. Mock数据中不包含五指毛桃
 * 3. 只有真实API连接才能搜索到五指毛桃
 * 4. 响应时间应该反映真实网络延迟
 */

const testWuzhimaotaoAPI = async () => {
  console.log('🎯 五指毛桃专项联调测试');
  console.log('=====================================');
  console.log('🔍 测试目标: 验证真实API连接和独有数据');
  console.log('🌿 测试药品: 五指毛桃（Ficus hirta）');
  console.log('📊 预期: 只有联调模式能找到此药品');
  console.log('');

  const testEnvironment = async (envName, baseURL) => {
    console.log(`📍 测试环境: ${envName}`);
    console.log(`🌐 API地址: ${baseURL}`);
    console.log('─────────────────────────────────────');

    const testQueries = [
      '五指毛桃',
      'wuzhimaotao', 
      'Ficus hirta',
      '五指'
    ];

    const results = [];

    for (const query of testQueries) {
      const startTime = Date.now();
      
      try {
        const url = `${baseURL}/medicines?search=${encodeURIComponent(query)}&limit=5`;
        console.log(`🔍 搜索词: "${query}"`);
        
        const response = await fetch(url);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const resultCount = Array.isArray(data.data) ? data.data.length : (Array.isArray(data) ? data.length : 0);
        
        // 检查是否包含五指毛桃
        let hasWuzhimaotao = false;
        let wuzhimaotaoData = null;
        
        const searchData = data.data || data || [];
        if (Array.isArray(searchData)) {
          wuzhimaotaoData = searchData.find(medicine => 
            medicine.chineseName?.includes('五指毛桃') ||
            medicine.englishName?.toLowerCase().includes('ficus hirta') ||
            medicine.pinyinName?.includes('wuzhimaotao')
          );
          hasWuzhimaotao = !!wuzhimaotaoData;
        }

        const result = {
          query,
          success: true,
          resultCount,
          responseTime,
          hasWuzhimaotao,
          wuzhimaotaoData,
          status: response.status
        };

        // 显示结果
        console.log(`   📊 结果: ${resultCount} 条`);
        console.log(`   ⏱️  响应时间: ${responseTime}ms`);
        console.log(`   🎯 五指毛桃: ${hasWuzhimaotao ? '✅ 找到' : '❌ 未找到'}`);
        
        if (hasWuzhimaotao && wuzhimaotaoData) {
          console.log(`   🌿 药品信息:`);
          console.log(`      中文名: ${wuzhimaotaoData.chineseName || 'N/A'}`);
          console.log(`      英文名: ${wuzhimaotaoData.englishName || 'N/A'}`);
          console.log(`      拼音名: ${wuzhimaotaoData.pinyinName || 'N/A'}`);
          console.log(`      价格: $${wuzhimaotaoData.price || 'N/A'}/g`);
        }
        
        results.push(result);
        
      } catch (error) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        console.log(`   ❌ 错误: ${error.message}`);
        console.log(`   ⏱️  响应时间: ${responseTime}ms`);
        
        results.push({
          query,
          success: false,
          error: error.message,
          responseTime,
          hasWuzhimaotao: false
        });
      }
      
      console.log('');
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return results;
  };

  // 测试联调环境（真实API）
  console.log('🚀 测试联调环境（3001端口）');
  const integrationResults = await testEnvironment(
    '联调环境 (Integration)', 
    'http://localhost:3001/api/v1'
  );

  // 测试Mock环境（对照组）
  console.log('🎭 测试Mock环境（3000端口）');
  const mockResults = await testEnvironment(
    'Mock环境 (Mock)', 
    'http://localhost:3000/api/v1'
  );

  // 生成专项报告
  console.log('📊 五指毛桃专项报告');
  console.log('=====================================');

  const analyzeResults = (envName, results) => {
    const wuzhimaotaoFound = results.some(r => r.hasWuzhimaotao);
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
    const successfulQueries = results.filter(r => r.success).length;

    console.log(`\n📋 ${envName} 分析:`);
    console.log(`   🎯 五指毛桃检测: ${wuzhimaotaoFound ? '✅ 找到' : '❌ 未找到'}`);
    console.log(`   📈 查询成功率: ${successfulQueries}/${results.length}`);
    console.log(`   ⏱️  平均响应时间: ${avgResponseTime.toFixed(0)}ms`);

    if (wuzhimaotaoFound) {
      const wuzhimaotaoResult = results.find(r => r.hasWuzhimaotao);
      console.log(`   🌿 五指毛桃数据:`);
      console.log(`      搜索词: "${wuzhimaotaoResult.query}"`);
      console.log(`      响应时间: ${wuzhimaotaoResult.responseTime}ms`);
      console.log(`      结果数量: ${wuzhimaotaoResult.resultCount}`);
    }
  };

  analyzeResults('联调环境', integrationResults);
  analyzeResults('Mock环境', mockResults);

  // 联调验证结论
  console.log('\n🎯 联调验证结论');
  console.log('=====================================');

  const integrationHasWuzhimaotao = integrationResults.some(r => r.hasWuzhimaotao);
  const mockHasWuzhimaotao = mockResults.some(r => r.hasWuzhimaotao);
  const integrationAvgTime = integrationResults.reduce((sum, r) => sum + r.responseTime, 0) / integrationResults.length;

  if (integrationHasWuzhimaotao && !mockHasWuzhimaotao) {
    console.log('🎉 联调状态: ✅ 完全成功');
    console.log('📡 真实API连接: ✅ 正常');
    console.log('🔍 独有数据验证: ✅ 通过');
    console.log('🎯 五指毛桃搜索: ✅ 仅在真实API中找到');
    console.log(`⏱️  网络延迟: ✅ 真实（平均${integrationAvgTime.toFixed(0)}ms）`);
    console.log('');
    console.log('🏆 DAY 2联调目标达成！');
  } else if (integrationHasWuzhimaotao && mockHasWuzhimaotao) {
    console.log('⚠️  联调状态: 🟡 需要确认');
    console.log('📡 两个环境都找到五指毛桃，可能Mock数据已更新');
  } else if (!integrationHasWuzhimaotao && !mockHasWuzhimaotao) {
    console.log('🔍 联调状态: 🟡 数据缺失');
    console.log('📡 两个环境都未找到五指毛桃，可能数据库未包含此药品');
  } else {
    console.log('❌ 联调状态: 🔴 异常');
    console.log('📡 Mock环境找到但真实API未找到，连接可能有问题');
  }

  console.log('\n📋 前端验证建议');
  console.log('=====================================');
  console.log('🔧 请在浏览器中执行以下验证：');
  console.log('1. 打开 http://localhost:3000/prescription/create');
  console.log('2. 确保EnvironmentSwitcher设置为"联调环境"');
  console.log('3. 在药品搜索框中输入"五指毛桃"');
  console.log('4. 检查浏览器Network标签，确认请求发送到localhost:3001');
  console.log('5. 验证搜索结果是否来自真实数据库');
  console.log('');
  console.log('✅ 五指毛桃专项联调测试完成');
};

// 执行测试
testWuzhimaotaoAPI().catch(error => {
  console.error('❌ 五指毛桃测试失败:', error);
  process.exit(1);
}); 