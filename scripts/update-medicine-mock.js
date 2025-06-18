/**
 * 批量更新药品Mock数据格式
 * 将旧格式转换为新的API兼容格式
 */

const fs = require('fs');
const path = require('path');

const mockFilePath = path.join(__dirname, '../src/mocks/medicineData.ts');

// 读取文件内容
const content = fs.readFileSync(mockFilePath, 'utf8');

// 使用正则表达式替换格式
let updatedContent = content.replace(
  /{\s*id:\s*"([^"]+)",\s*chineseName:\s*"([^"]+)",\s*englishName:\s*"([^"]*)",\s*pinyinName:\s*"([^"]+)",\s*pricePerGram:\s*([0-9.]+),\s*property:\s*"([^"]*)",\s*category:\s*"([^"]+)"\s*}/g,
  (match, id, chineseName, englishName, pinyinName, pricePerGram, property, category) => {
    const skuNumber = id.replace('med_', 'TCM-');
    return `{
    id: "${id}",
    sku: "${skuNumber}",
    name: "${chineseName}",
    pinyin: "${pinyinName}",
    category: "${category}",
    pricePerGram: ${pricePerGram},
    chineseName: "${chineseName}",
    englishName: "${englishName}",
    pinyinName: "${pinyinName}",
    property: "${property}"
  }`;
  }
);

// 写回文件
fs.writeFileSync(mockFilePath, updatedContent);

console.log('✅ Mock数据格式更新完成');
console.log('📄 文件路径:', mockFilePath); 