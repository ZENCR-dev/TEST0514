#!/usr/bin/env node

/**
 * 浏览器控制台检查脚本
 * 通过访问前端应用页面来检查控制台错误
 */

const puppeteer = require('puppeteer');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

async function checkBrowserConsole() {
  let browser;
  
  try {
    console.log(`${colors.blue}🚀 启动浏览器控制台检查${colors.reset}\n`);
    
    // 启动浏览器
    browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 收集控制台日志
    const consoleLogs = [];
    const consoleErrors = [];
    const consoleWarnings = [];
    
    page.on('console', msg => {
      const logData = {
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString()
      };
      
      consoleLogs.push(logData);
      
      if (msg.type() === 'error') {
        consoleErrors.push(logData);
        console.log(`${colors.red}❌ Console Error:${colors.reset} ${msg.text()}`);
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(logData);
        console.log(`${colors.yellow}⚠️  Console Warning:${colors.reset} ${msg.text()}`);
      } else if (msg.type() === 'log') {
        console.log(`${colors.blue}ℹ️  Console Log:${colors.reset} ${msg.text()}`);
      }
    });
    
    // 收集网络错误
    const networkErrors = [];
    
    page.on('requestfailed', request => {
      const errorData = {
        url: request.url(),
        method: request.method(),
        failure: request.failure()?.errorText,
        timestamp: new Date().toISOString()
      };
      
      networkErrors.push(errorData);
      console.log(`${colors.red}🌐 Network Error:${colors.reset} ${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
    });
    
    // 收集响应错误
    page.on('response', response => {
      if (response.status() >= 400) {
        console.log(`${colors.red}📡 HTTP Error:${colors.reset} ${response.status()} ${response.url()}`);
      }
    });
    
    console.log(`${colors.blue}📱 访问前端应用页面...${colors.reset}`);
    
    // 访问主页
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log(`${colors.green}✅ 主页加载完成${colors.reset}`);
    
    // 等待一段时间收集日志
    await page.waitForTimeout(3000);
    
    // 尝试访问一些关键页面
    const testPages = [
      '/doctor',
      '/pharmacy',
      '/admin'
    ];
    
    for (const testPage of testPages) {
      try {
        console.log(`${colors.blue}📱 访问页面: ${testPage}${colors.reset}`);
        await page.goto(`http://localhost:3000${testPage}`, { 
          waitUntil: 'networkidle2',
          timeout: 10000 
        });
        await page.waitForTimeout(2000);
      } catch (error) {
        console.log(`${colors.yellow}⚠️  页面访问失败: ${testPage} - ${error.message}${colors.reset}`);
      }
    }
    
    // 测试API调用
    console.log(`${colors.blue}🧪 测试API调用...${colors.reset}`);
    
    await page.evaluate(async () => {
      try {
        const response = await fetch('/api/v1/medicines?limit=5');
        const data = await response.json();
        console.log('API测试成功:', data);
      } catch (error) {
        console.error('API测试失败:', error);
      }
    });
    
    await page.waitForTimeout(2000);
    
    // 生成报告
    console.log(`\n${colors.blue}📊 浏览器控制台检查报告${colors.reset}`);
    console.log('='.repeat(50));
    
    console.log(`总日志数: ${consoleLogs.length}`);
    console.log(`${colors.red}错误数: ${consoleErrors.length}${colors.reset}`);
    console.log(`${colors.yellow}警告数: ${consoleWarnings.length}${colors.reset}`);
    console.log(`${colors.red}网络错误数: ${networkErrors.length}${colors.reset}`);
    
    if (consoleErrors.length === 0 && networkErrors.length === 0) {
      console.log(`\n${colors.green}🎊 控制台检查通过！无错误发现！${colors.reset}`);
    } else {
      console.log(`\n${colors.yellow}⚠️  发现问题需要关注${colors.reset}`);
      
      if (consoleErrors.length > 0) {
        console.log(`\n${colors.red}控制台错误详情:${colors.reset}`);
        consoleErrors.forEach((error, index) => {
          console.log(`${index + 1}. ${error.text}`);
        });
      }
      
      if (networkErrors.length > 0) {
        console.log(`\n${colors.red}网络错误详情:${colors.reset}`);
        networkErrors.forEach((error, index) => {
          console.log(`${index + 1}. ${error.method} ${error.url} - ${error.failure}`);
        });
      }
    }
    
    // 保存截图
    await page.screenshot({ path: 'browser-console-check.png', fullPage: true });
    console.log(`\n${colors.blue}📸 页面截图已保存: browser-console-check.png${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.red}❌ 浏览器检查失败:${colors.reset}`, error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// 检查是否安装了puppeteer
async function checkPuppeteer() {
  try {
    require('puppeteer');
    return true;
  } catch (error) {
    console.log(`${colors.yellow}⚠️  Puppeteer未安装，尝试安装...${colors.reset}`);
    return false;
  }
}

async function main() {
  const hasPuppeteer = await checkPuppeteer();
  
  if (!hasPuppeteer) {
    console.log(`${colors.blue}📦 请先安装Puppeteer:${colors.reset}`);
    console.log('npm install puppeteer');
    console.log('然后重新运行此脚本');
    return;
  }
  
  await checkBrowserConsole();
}

main().catch(console.error); 